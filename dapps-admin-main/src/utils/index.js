import { Contract } from '@ethersproject/contracts'

export function sortAddress(add) {
  if (add) {
    const sortAdd = `${add.slice(0, 6)}...${add.slice(add.length - 4)}`
    return sortAdd
  } else {
    return add
  }
}
export function isValidationEmail(email) {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  if (email === '' || email === 'undefined') {
    return false
  }
  return re.test(String(email).toLowerCase())
}
export function isValidPassword(value) {
  const re = /^(?=.*\d)(?=.*[A-Z]).{8,14}$/
  if (value === '' || value === 'undefined') {
    return false
  }
  return re.test(value)
}

export function getSigner(library, account) {
  return library.getSigner(account).connectUnchecked()
}

export function getProviderOrSigner(library, account) {
  return account ? getSigner(library, account) : library
}

export function getContract(address, ABI, library, account) {
  return new Contract(address, ABI, getProviderOrSigner(library, account))
}
export const calculateTimeLeft = (endDate) => {
  if (endDate) {
    let difference = +new Date(endDate) - +new Date()
    let timeLeft = {}

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      }
    }
    return timeLeft
  } else {
    return false
  }
}
export const getBase64 = (file, cb) => {
  let reader = new FileReader()
  reader.readAsDataURL(file)
  reader.onload = function () {
    cb(reader.result)
  }
  reader.onerror = function (err) {
    console.log('Error: ', err)
  }
}
