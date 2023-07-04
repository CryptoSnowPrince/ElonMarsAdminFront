import { Fragment, useRef, useState, useEffect } from 'react'
import moment from 'moment';
import { Dialog, Transition } from '@headlessui/react'
import Dropdown from './Dropdown';
import callApi from '../api/api';
import { FIELDS } from '../utils/constant';

const EditModal = ({
  open,
  onClose,
  addresses = [],
  onUpdate,
  onFail,
}) => {
  const [field, setField] = useState(FIELDS[0]);
  const [value, setValue] = useState(0);
  const [date, setDate] = useState(moment().format('YYYY-MM-DD'));
  const [loading, setLoading] = useState(false);
  const cancelButtonRef = useRef(null);

  useEffect(() => {
    setField(FIELDS[0]);
    setValue(0);
    setDate(moment().format('YYYY-MM-DD'));
  }, [open]);

  const handleUpdate = async () => {
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
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" initialFocus={cancelButtonRef} onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                      <Dialog.Title as="h3" className="text-base font-semibold leading-6 text-gray-900">
                        Edit Users
                      </Dialog.Title>
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">
                          Please update variables for following users
                        </p>
                        <div className="max-h-[12rem] overflow-auto mt-4">
                          {addresses && addresses.length > 0 && addresses.map((item, index) => (
                            <p key={`wallet-${index}`} className="text-sm text-gray-400 my-0.5">{item}</p>
                          ))}
                        </div>
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
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                  <button
                    type="button"
                    className="inline-flex w-full justify-center rounded-md bg-[#4F70E5] px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#6366F1] sm:ml-3 sm:w-auto disabled:bg-gray-500"
                    onClick={handleUpdate}
                    disabled={(field.type === 'number' && value === 0) || loading}
                  >
                    Update
                  </button>
                  <button
                    type="button"
                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                    onClick={onClose}
                    ref={cancelButtonRef}
                  >
                    Cancel
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}

export default EditModal;
