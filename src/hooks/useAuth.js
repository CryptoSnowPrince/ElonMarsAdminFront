import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Web3 from 'web3'
import web3ModalSetup from '../utils/web3ModalSetup.js'
import * as actions from '../store/actions'
import * as selector from '../store/selectors'

const web3Modal = web3ModalSetup()

const useAuth = () => {
  const dispatch = useDispatch()
  const curWeb3 = useSelector(selector.web3State)

  const logout = useCallback(async () => {
    web3Modal.clearCachedProvider()
    if (curWeb3 && curWeb3.provider && typeof curWeb3.provider.disconnect === 'function') {
      await curWeb3.provider.disconnect()
    }
    dispatch(actions.setInit())
  }, [dispatch, curWeb3])

  const login = useCallback(async () => {
    const provider = await web3Modal.connect()
    const web3Provider = new Web3(provider)
    var acc = null
    try {
      acc = provider.selectedAddress ? provider.selectedAddress : provider.accounts[0]
    } catch (error) {
      acc = provider.address
    }

    dispatch(actions.setWeb3(web3Provider))
    dispatch(actions.setCurAcount(acc))
    dispatch(actions.setProvider(provider))
  }, [dispatch])

  return { login, logout }
}

export default useAuth
