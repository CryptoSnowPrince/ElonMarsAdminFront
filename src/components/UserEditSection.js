import { useState } from 'react';
import { useSelector } from 'react-redux'
import moment from 'moment';
import Dropdown from './Dropdown';
import callApi from '../api/api';
import { FIELDS } from '../utils/constant';
import Web3 from 'web3';
import { isAccount, signMessageHash } from '../utils/utils';
import * as selector from '../store/selectors'

const web3Const = new Web3('https://bsc-dataseed1.binance.org')

const UserEditSection = ({
  onUpdate,
  onFail,
}) => {
  const curWeb3 = useSelector(selector.web3State)
  const curAccount = useSelector(selector.curAccountState)

  const [field, setField] = useState(FIELDS[0]);
  const [addressText, setAddressText] = useState('');
  const [value, setValue] = useState(0);
  const [date, setDate] = useState(moment().format('YYYY-MM-DD'));
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    if (curWeb3 && isAccount(curAccount)) {
      const addresses = addressText.toLowerCase().split('\n').filter(item => item);
      if (addresses.length === 0) {
        return;
      }
      // duplicate check
      const duplicateCheck = {}
      for (const addrValue of addresses) {
        duplicateCheck[addrValue] = true
      }

      const nonDuplicateAddresses = []
      for (const dupIndex in duplicateCheck) {
        nonDuplicateAddresses.push(dupIndex)
      }

      // Address valid check
      const validAddresses = nonDuplicateAddresses.filter(item => {
          return web3Const.utils.isAddress(item)
      })

      // console.log("validAddresses: ", validAddresses)

      setLoading(true);
      const _data = {
        address: curAccount,
        actionDate: Date.now()
      }

      const _signData = await signMessageHash(curWeb3, curAccount, JSON.stringify(_data))
      if (_signData.success === true) {
        const res = await callApi('user/edit', 'post', {
          validAddresses,
          type: field.name,
          value: field.type === 'date' ? date : value,
          data: _data,
          signData: _signData.message,
        });

        if (res.success) {
          onUpdate();
        } else {
          onFail(res.message);
        }
      }
      else {
        alert('Sign fail!');
      }
      setLoading(false);
    } else {
      alert('fail', 'Please wallet connect!');
    }
  }

  return (
    <div className="border border-[#e5e7eb] rounded-xl px-4 py-6 sm:px-6 lg:px-8">
      <h2 className="text-base font-semibold leading-6 text-gray-900">Update Users</h2>
      <div className="max-w-md mt-2">
        <p className="text-sm text-gray-500">
          Please update variables for following users
        </p>
        <div className="mt-4">
          <textarea
            className="min-h-[12rem] block w-full rounded-md border-0 py-1.5 pl-4 pr-2 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            value={addressText}
            onChange={(e) => setAddressText(e.target.value)}
          />
        </div>
        <div className="mt-4">
          <Dropdown onChange={setField} />
        </div>
        {field.type === 'number' ? (
          <div className="mt-4">
            <label htmlFor="value" className="block text-sm font-medium leading-6 text-gray-900">
              {field.desc}
            </label>
            <div className="relative mt-2 rounded-md shadow-sm">
              <input
                type="number"
                name="value"
                id="value"
                className="block w-full rounded-md border-0 py-1.5 pl-4 pr-2 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                placeholder="0"
                value={value}
                onChange={(e) => setValue(+e.target.value)}
                disabled={loading}
              />
            </div>
          </div>
        ) : field.type === 'date' ? (
          <div className="mt-4">
            <label htmlFor="datepicker" className="block text-sm font-medium leading-6 text-gray-900">
              {field.desc}
            </label>
            <div className="relative mt-2 rounded-md shadow-sm">
              <input
                type="date"
                name="datepicker"
                id="datepicker"
                className="block w-full rounded-md border-0 py-1.5 pl-4 pr-2 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                // min={moment().format('YYYY-MM-DD')}
                placeholder="Select date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                disabled={loading}
              />
            </div>
          </div>
        ) : field.type === 'array' ? (
          <div className="mt-4">
            <label htmlFor="value" className="block text-sm font-medium leading-6 text-gray-900">
              {field.desc}
            </label>
            <div className="relative mt-2 rounded-md shadow-sm">
              <input
                type="number"
                min={1}
                max={3}
                name="value"
                id="value"
                className="block w-full rounded-md border-0 py-1.5 pl-4 pr-2 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                placeholder="0"
                value={value}
                onChange={(e) => setValue(+e.target.value)}
                disabled={loading}
              />
            </div>
          </div>
        ) : null}
      </div>
      <div className="mt-6">
        <button
          type="button"
          className="inline-flex w-full justify-center rounded-full bg-[#00FF1A] px-12 py-2 text-[24px] font-semibold text-white shadow-sm hover:bg-[#6366F1] sm:w-auto disabled:bg-gray-500"
          onClick={handleUpdate}
          disabled={!addressText || (field.type === 'number' && value === 0) || loading}
        >
          SEND
        </button>
      </div>
    </div>
  );
}

export default UserEditSection;
