import { useState, useEffect } from 'react';
import UserEditSection from '../components/UserEditSection';
import UserTable from '../components/UserTable';
import EditModal from '../components/EditModal';
import Notification from '../components/Notification';
import callApi from '../api/api';

const UserPage = () => {
  const [users, setUsers] = useState([]);
  const [selected, setSelected] = useState([]);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openToast, setOpenToast] = useState(false);
  const [toastStatus, setToastStatus] = useState('success');
  const [toastText, setToastText] = useState('');

  const getUserData = async () => {
    const resp = await callApi('user/all');
    if (resp?.users) {
      setUsers(resp.users);
    }
  }

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

  const handleUpdate = () => {
    getUserData();
    showToast('success', 'Updated');
  }

  const handleFail = (text) => {
    showToast('fail', text);
  }

  return (
    <div className="w-full md:w-[90%] py-10 mt-10 mx-auto">
      <h1 className='text-center text-[28px] font-medium pb-4'>Admin pannel</h1>
      <div className="max-w-[72rem] mx-auto">
        <UserEditSection
          onUpdate={handleUpdate}
          onFail={handleFail}
        />
        {/* <div className="mt-24 border border-[#e5e7eb] rounded-xl px-4 py-6 mt-6 sm:px-6 lg:px-8">
          <div className="flex items-center">
            <div className="flex flex-1">
              <h1 className="font-semibold text-lg">Users Table</h1>
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
        </div> */}
      </div>
      {/* <EditModal
        open={openEditModal}
        onClose={() => setOpenEditModal(false)}
        addresses={selected}
        onUpdate={handleUpdate}
        onFail={handleFail}
      /> */}
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
