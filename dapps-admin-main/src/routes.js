import React, { lazy } from 'react'
import { Redirect } from 'react-router-dom'
import HomeLayout from 'src/layouts/HomeLayout'

export const routes = [
  {
    exact: true,
    path: '/',
    layout: HomeLayout,
    guard: true,
    component: lazy(() => import('src/views/pages/Dashboard/index')),
  },
  {
    exact: true,
    path: '/login',
    component: lazy(() => import('src/views/pages/Login')),
  },
  {
    exact: true,
    path: '/forgot-password',
    component: lazy(() => import('src/views/pages/ForgotPassword')),
  },
  {
    exact: true,
    path: '/reset-password',
    component: lazy(() => import('src/views/pages/ResetPassword')),
  },
  {
    exact: true,
    path: '/popup',
    component: lazy(() => import('src/views/pages/Users/Pop')),
  },

  {
    exact: true,
    path: '/AddAdmin',
    layout: HomeLayout,
    guard: true,
    component: lazy(() => import('src/views/pages/Users/Admin/AddAdmin')),
  },
  {
    exact: true,
    path: '/Userview',
    layout: HomeLayout,
    guard: true,
    component: lazy(() => import('src/views/pages/Userview')),
  },
  {
    exact: true,
    path: '/User',
    layout: HomeLayout,
    guard: true,
    component: lazy(() => import('src/views/pages/Users/index')),
  },
  {
    exact: true,
    path: '/SearchResult',
    layout: HomeLayout,
    guard: true,
    component: lazy(() => import('src/views/pages/Users/Searchresult')),
  },
  {
    exact: true,
    path: '/setting',
    layout: HomeLayout,
    guard: true,
    component: lazy(() => import('src/views/pages/Setting/index')),
  },
  {
    exact: true,
    path: '/NFT-detail',
    layout: HomeLayout,
    guard: true,
    component: lazy(() => import('src/views/pages/NFTDetail/index')),
  },

  {
    exact: true,
    path: '/chat-settings',
    guard: true,
    layout: HomeLayout,
    component: lazy(() => import('src/views/pages/Setting/Chat')),
  },
  
  {
    exact: true,
    path: '/userimg',
    guard: true,
    component: lazy(() => import('src/component/User')),
  },
  {
    exact: true,
    path: '/press-nft',
    component: lazy(() => import('src/views/pages/Home/PressNft')),
  },
  {
    exact: true,
    path: '/Press',
    component: lazy(() => import('src/views/pages/Home/Press')),
  },
  {
    exact: true,
    path: '/static-content-management',
    guard: true,
    layout: HomeLayout,
    component: lazy(() => import('src/views/pages/StaticContent')),
  },
  {
    exact: true,
    path: '/banners',
    guard: true,
    layout: HomeLayout,
    component: lazy(() =>
      import('src/views/pages/LandingBanner'),
    ),
  },
  {
    exact: true,
    path: '/landing-sections',
    guard: true,
    layout: HomeLayout,
    component: lazy(() =>
      import('src/views/pages/LandingSections'),
    ),
  },
  {
    exact: true,
    path: '/oursolutions/:id',
    guard: true,
    layout: HomeLayout,
    component: lazy(() =>
      import('src/views/pages/LandingSections/OurSolutions'),
    ),
  },
  {
    exact: true,
    path: '/how-it-works/:id',
    guard: true,
    layout: HomeLayout,
    component: lazy(() =>
      import('src/views/pages/LandingSections/HowItWorks'),
    ),
  },
  {
    exact: true,
    path: '/banner-management',
    guard: true,
    layout: HomeLayout,
    component: lazy(() => import('src/views/pages/LandingBanner')),
  },
  {
    exact: true,
    path: '/add-banner',
    guard: true,
    layout: HomeLayout,
    component: lazy(() =>
      import('src/views/pages/LandingBanner/newBanner'),
    ),
  },
  {
    exact: true,
    path: '/edit-banner/:id',
    guard: true,
    layout: HomeLayout,
    component: lazy(() =>
      import('src/views/pages/LandingBanner/editBanner'),
    ),
  },
  {
    exact: true,
    path: '/view-banner/:id',
    guard: true,
    layout: HomeLayout,
    component: lazy(() =>
      import('src/views/pages/LandingBanner/viewBanner'),
    ),
  },
  {
    exact: true,
    path: '/view-static',
    component: lazy(() =>
      import('src/views/pages/Staticmanagement/viewStatic'),
    ),
  },
  {
    exact: true,
    path: '/view-socail',
    component: lazy(() =>
      import('src/views/pages/Staticmanagement/ViewSocial'),
    ),
  },
  {
    exact: true,
    path: '/edit-static',
    component: lazy(() =>
      import('src/views/pages/Staticmanagement/editStatic'),
    ),
  },
  {
    exact: true,
    path: '/edit-social',
    component: lazy(() =>
      import('src/views/pages/Staticmanagement/EditSocial'),
    ),
  },
  // {
  //   exact: true,
  //   path: '/ads-managment',
  //   guard: true,
  //   layout: HomeLayout,
  //   component: lazy(() =>
  //     import('src/views/pages/Advertisment/index'),
  //   ),
  // },
  {
    exact: true,
    path: '/referral-managment',
    guard: true,
    layout: HomeLayout,
    component: lazy(() => import('src/views/pages/ReferralManagment/Referral')),
  },
  {
    exact: true,
    path: '/sub-admin',
    guard: true,
    layout: HomeLayout,
    component: lazy(() => import('src/views/pages/SubAdmin/SubAdminList')),
  },
  {
    exact: true,
    path: '/add-advertisment',
    guard: true,
    layout: HomeLayout,
    component: lazy(() =>
      import('src/views/pages/Advertisment/newAds'),
    ),
  },
  
  {
    exact: true,
    path: '/add-subAdmin',
    guard: true,
    layout: HomeLayout,
    component: lazy(() => import('src/views/pages/SubAdmin/AddSubAdmin')),
  },
  {
    exact: true,
    path: '/view-ads',
    guard: true,
    layout: HomeLayout,
    component: lazy(() =>
      import('src/views/pages/Advertisment/viewAds'),
    ),
  },
  {
    exact: true,
    path: '/edit-ads',
    component: lazy(() =>
      import('src/views/pages/Advertisment/editAds'),
    ),
  },
  {
    exact: true,
    path: '/view-transaction',
    guard: true,
    layout: HomeLayout,
    component: lazy(() => import('src/views/pages/Users/viewUserTransaction')),
  },
  {
    exact: true,
    path: '/user-management',
    guard: true,
    layout: HomeLayout,
    component: lazy(() => import('src/views/pages/Users/UserMangementDetails')),
  },
  {
    exact: true,
    path: '/404',
    component: lazy(() => import('src/views/errors/NotFound')),
  },
  {
    component: () => <Redirect to="/" />,
  },
]
