import React, { createContext, useState, useEffect } from 'react'
import axios from 'axios'
import Apiconfigs from 'src/Apiconfig/Apiconfig'

export const AuthContext = createContext()

function checkLogin() {
  const accessToken = sessionStorage.getItem("AccessToken");
  return accessToken ? true : false;
}

const setSession = (accessToken) => {
  if (accessToken) {
    sessionStorage.setItem('AccessToken', accessToken)
    axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`
  } else {
    sessionStorage.removeItem('AccessToken')
    delete axios.defaults.headers.common.Authorization
  }
}

export default function AuthProvider(props) {
  const [isLogin, setIsLogin] = useState(checkLogin())
  const [userData] = useState({})
  const [permissions, setPermissions] = useState()
  const [isLoading, setIsLoading] = useState(false)
  const [dashboardData, setDashboardData] = useState()
  const [platformBalance, setPlatformBalance] = useState({})
  const [adminTotalEarnings, setAdminTotalEarnings] = useState({})
  const [virtualMoney, setVirtualMoney] = useState({})
  const dashboardDataHandler = async () => {
    try {
      const res = await axios.get(Apiconfigs.dashboard, {
        params: {
          searchBy: 'All',
        },
        headers: {
          token: sessionStorage.getItem('AccessToken'),
        },
      })
      if (res.data.statusCode === 200) {
        setDashboardData(res.data.result)
      }
      setIsLoading(false)
    } catch (error) {
      console.log('ERROR', error)
      setIsLoading(false)
    }
  }
  const getTotalAccountBalanceHandler = async () => {
    try {
      const res = await axios({
        method: 'GET',
        url: Apiconfigs.totalAdminBalance,
        headers: {
          token: sessionStorage.getItem('AccessToken'),
        },
      })
      if (res.data.statusCode === 200) {
        setPlatformBalance(res.data.result)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const getTotalEarningBalanceHanlder = async () => {
    try {
      const res = await axios({
        method: 'GET',
        url: Apiconfigs.getAdminTotalEarnings,
        headers: {
          token: sessionStorage.getItem('AccessToken'),
        },
      })
      if (res.data.statusCode === 200) {
        setAdminTotalEarnings(res.data.result)
      }
    } catch (error) {
      console.log(error)
    }
  }
  const getTotalVirtualMoneyHandler = async () => {
    try {
      const res = await axios({
        method: 'GET',
        url: Apiconfigs.totalUserFunds,
        headers: {
          token: sessionStorage.getItem('AccessToken'),
        },
      })
      if (res.data.statusCode === 200) {
        setVirtualMoney(res?.data?.result[0])
      }
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
    if(isLogin){
      dashboardDataHandler()
      if (window.sessionStorage.getItem('userType') === 'Admin') {
        getTotalAccountBalanceHandler()
        getTotalEarningBalanceHanlder()
        getTotalVirtualMoneyHandler()
      }
      var obj = JSON.parse(sessionStorage.getItem('permission'))
      setPermissions(obj) 
    }
    
  }, [isLogin]);
  let data = {
    userLoggedIn: isLogin,
    userData,
    dashboardData,
    isLoading,
    permissions,
    platformBalance,
    adminTotalEarnings,
    virtualMoney,
    userLogIn: (type, data) => {
      setIsLogin(type);
      setSession(data);
    },
    logout: () => {
      setIsLogin(false)
      sessionStorage.removeItem('AccessToken')
      sessionStorage.removeItem('permission')
    },
  }

  return (
    <AuthContext.Provider value={data}>{props.children}</AuthContext.Provider>
  )
}
