import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux'
import UserEditSection from '../components/UserEditSection';
import UserTable from '../components/UserTable';
import EditModal from '../components/EditModal';
import Notification from '../components/Notification';
import callApi from '../api/api';
import useAuth from '../hooks/useAuth';
import { isAccount, getDisplayString, signMessageHash } from '../utils/utils';
import * as selector from '../store/selectors'
import Web3 from 'web3';

const web3Const = new Web3('https://bsc-dataseed1.binance.org')

const UserPage = () => {
  const curWeb3 = useSelector(selector.web3State)
  const curAccount = useSelector(selector.curAccountState)

  const { login, logout } = useAuth()

  const [users, setUsers] = useState([]);
  const [selected, setSelected] = useState([]);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openToast, setOpenToast] = useState(false);
  const [toastStatus, setToastStatus] = useState('success');
  const [toastText, setToastText] = useState('');
  const [searchKey, setSearchKey] = useState('')

  const getUserData = async () => {
    const resp = await callApi('user/all');
    console.log(resp)
    if (resp?.users) {
      setUsers(resp.users);
    }
  }

  const [isAdmin, setIsAdmin] = useState(true)

  useEffect(() => {
    const fetchIsAdmin = async () => {
      if (curWeb3 && isAccount(curAccount)) {
        const _data = {
          address: curAccount,
          actionDate: Date.now()
        }

        // console.log('fetchIsAdmin')
        // const _signData = await signMessageHash(curWeb3, curAccount, JSON.stringify(_data))
        // if (_signData.success === true) {
        //   const retVal = await callApi('user/isAdmin', 'post', {
        //     data: _data,
        //     signData: _signData.message,
        //   });
        //   if (retVal.success) {
        //     setIsAdmin(true);
        //     showToast('success', 'Admin Page');
        //   } else {
        //     setIsAdmin(false);
        //     showToast('fail', 'Failed Admin');
        //   }
        // } else {
        //   showToast('fail', 'Sign fail!');
        //   setIsAdmin(false);
        // }
      }
    }
    fetchIsAdmin()
  }, [curWeb3, curAccount])

  useEffect(() => {
    getUserData();
  }, []);

  const showToast = (status, text) => {
    setToastStatus(status);
    setToastText(text);
    setOpenToast(true);
    setTimeout(() => {
      setOpenToast(false);
    }, 1500);
  }

  const handleEdit = () => {
    setOpenEditModal(true);
  }

  const handleSearch = async () => {
    if (web3Const.utils.isAddress(searchKey)) {
      const resp = await callApi(`user/all?walletAddress=${searchKey.toLowerCase()}`);
      if (resp?.user) {
        console.log(resp.user);
        setUsers([resp.user]);
      } else {
        setUsers([]);
      }
    } else if (!searchKey) {
      await getUserData();
    } else {
      showToast('fail', 'Please enter account address!');
    }
  }

  const handleUpdate = () => {
    getUserData();
    showToast('success', 'Updated');
  }

  const handleFail = (text) => {
    showToast('fail', text);
  }

  return (
    <div className="w-full md:w-[90%] py-10 mt-10 mx-auto">
      <div className="mt-0 text-right">
        <button
          type="button"
          className="w-full justify-center rounded-full bg-[#00FF1A] px-12 py-2 text-[24px] font-semibold text-white shadow-sm hover:bg-[#6366F1] sm:w-auto disabled:bg-gray-500"
          onClick={curWeb3 && isAccount(curAccount) ? logout : login}
          disabled={false}
        >
          {curWeb3 && isAccount(curAccount) ? getDisplayString(curAccount, 6, 4) : `Wallet Connection`}
        </button>
      </div>
      <h1 className='text-center text-[28px] font-medium pb-4'>Admin panel</h1>
      <div className="max-w-[72rem] mx-auto">
        {
          isAdmin ? <>
            <UserEditSection
              onUpdate={handleUpdate}
              onFail={handleFail}
            />
            <div className="mt-24 border border-[#e5e7eb] rounded-xl px-4 py-6 mt-6 sm:px-6 lg:px-8">
              <div className="flex items-center">
                <div className="flex flex-1">
                  <h1 className="font-semibold text-lg">User Table</h1>
                </div>
                <div className="flex flex-1">
                  <h1 className="font-semibold text-lg mr-3">{'Search:'}</h1>
                  <input
                    type="text"
                    name="value"
                    id="value"
                    className="block w-full rounded-md border-0 py-1.5 pl-4 pr-2 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    placeholder="search user"
                    value={searchKey}
                    onChange={(e) => setSearchKey(e.target.value)}
                  />
                  <button
                    type="button"
                    className="font-semibold ml-3 text-white text-sm bg-[#4F70E5] rounded-md px-4 py-2 hover:bg-[#6366F1] disabled:bg-gray-500"
                    onClick={handleSearch}
                  >Find</button>
                </div>
                <div className="ml-8">
                  <button
                    type="button"
                    className="font-semibold text-white text-sm bg-[#4F70E5] rounded-md px-4 py-2 hover:bg-[#6366F1] disabled:bg-gray-500"
                    disabled={selected.length === 0}
                    onClick={handleEdit}
                  >Edit</button>
                </div>
              </div>
              <div className="flow-root mt-8">
                <UserTable
                  users={users}
                  selected={selected}
                  setSelected={setSelected}
                />
              </div>
            </div>
          </> : <h1 className='text-center text-[28px] font-medium pb-4'>Not Admin</h1>
        }
      </div>
      <EditModal
        open={openEditModal}
        onClose={() => setOpenEditModal(false)}
        addresses={selected}
        onUpdate={handleUpdate}
        onFail={handleFail}
      />
      <Notification
        open={openToast}
        onClose={() => setOpenToast(false)}
        status={toastStatus}
        text={toastText}
      />
    </div>
  );
}

export default UserPage;
