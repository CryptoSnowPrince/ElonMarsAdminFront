import { Fragment, useRef, useState, useEffect } from 'react'
import moment from 'moment';
import { useSelector } from 'react-redux'
import { Dialog, Transition } from '@headlessui/react'
import Dropdown from './Dropdown';
import callApi from '../api/api';
import { FIELDS } from '../utils/constant';
import Web3 from 'web3';
import * as selector from '../store/selectors'
import { isAccount, signMessageHash } from '../utils/utils';

const web3Const = new Web3('https://bsc-dataseed1.binance.org')

const EditModal = ({
  open,
  onClose,
  addresses = [],
  onUpdate,
  onFail,
}) => {
  const curWeb3 = useSelector(selector.web3State)
  const curAccount = useSelector(selector.curAccountState)

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
    if (curWeb3 && isAccount(curAccount)) {
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
          addresses: validAddresses,
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
                        {addresses && addresses.length > 0 &&
                          <div className="max-h-[12rem] overflow-auto mt-4">
                            {addresses.map((item, index) => (
                              <p key={index} className="text-sm text-gray-400 my-0.5">{item}</p>
                            ))}
                          </div>
                        }
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
                  </div>
                </div>
                <br></br>
                <br></br>
                <br></br>
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
