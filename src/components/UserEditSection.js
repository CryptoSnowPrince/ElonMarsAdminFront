import { useState } from 'react';
import moment from 'moment';
import Dropdown from './Dropdown';
import callApi from '../api/api';
import { FIELDS } from '../utils/constant';

const UserEditSection = ({
  onUpdate,
  onFail,
}) => {
  const [field, setField] = useState(FIELDS[0]);
  const [addressText, setAddressText] = useState('');
  const [value, setValue] = useState(0);
  const [date, setDate] = useState(moment().format('YYYY-MM-DD'));
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    const addresses = addressText.split('\n').filter(item => item);
    if (addresses.length === 0) {
      return;
    }

    setLoading(true);
    const res = await callApi('user/edit', 'post', {
      addresses,
      type: field.name,
      value: field.type === 'number' ? value : date,
    });

    if (res.success) {
      onUpdate();
    } else {
      onFail(res.message);
    }
    setLoading(false);
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
              Value
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
              Value
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
