import Web3 from 'web3'

export const web3 = new Web3('https://bsc-dataseed1.binance.org')

export const isAccount = account => {
  return web3.utils.isAddress(account)
}

export const getDisplayString = (str, subLength1, subLength2) => {
  return `${str.toString().substr(0, subLength1)}...${str
    .toString()
    .substr(str.length - subLength2, str.length)}`
}

export const signMessageHash = async (web3Obj, address, plainTxt) => {
  const plainTxtHash = web3Obj.utils.keccak256(plainTxt)
  var encryptedTxt = ''
  try {
    await web3Obj.eth.personal.sign(
      web3Obj.utils.toHex(plainTxtHash),
      address,
      function (err, result) {
        if (err) {
          console.error(err)
          return {
            success: false,
            message: err,
          }
        }
        encryptedTxt = result
        // console.log("SIGNED:" + result);
      },
    )
    return {
      success: true,
      message: encryptedTxt,
    }
  } catch (err) {
    return {
      success: false,
      message: err.message,
    }
  }
}

export const recoverSignedMessage = async (Web3Obj, plainTxt, encryptedTxt) => {
  var recoveredAddress = ''
  try {
    recoveredAddress = await Web3Obj.eth.personal.ecRecover(plainTxt, encryptedTxt)
    return recoveredAddress
  } catch (error) {
    console.log('error on recovering : ', error.message)
    return recoveredAddress
  }
}

export const isAddress = async (Web3Obj, address) => {
  try {
    var status = await Web3Obj.utils.isAddress(address)
    return status
  } catch (error) {
    console.log('error on recovering : ', error.message)
    return false
  }
}

export const delay = ms => {
  return new Promise(resolve => {
    setTimeout(resolve, ms)
  })
}
