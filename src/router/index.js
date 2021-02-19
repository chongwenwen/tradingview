import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import Login from '@/components/login/Login'
import Register from '@/components/login/Register'
import ForgetPass from '@/components/login/ForgetPass'
import Quotation from '@/components/quotation/Quotation'
import FrenchCurrenry from '@/components/french/FrenchCurrenry'
import Personal from '@/components/my/Personal'
import Certification from '@/components/my/Certification'
import Information from '@/components/Information'
import InfoDetail from '@/components/InfoDetail'
import Help from '@/components/Help'
import Exchange from '@/components/Exchange'
import Advert from '@/components/french/Advert'
import AdvertDetail from '@/components/french/AdvertDetail'
import LoginLog from '@/components/my/LoginLog'
import OrderList from '@/components/french/OrderList'
import OrderDetail from '@/components/french/OrderDetail'
import Version from '@/components/Version'
import News from '@/components/news/News'


Vue.use(Router)

export default new Router({
  mode:"hash",
  base:__dirname,
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/register',
      name: 'Register',
      component: Register
    },
    {
      path: '/forgetPass',
      name: 'ForgetPass',
      component: ForgetPass
    },
    {
      path: '/version',
      name: 'Version',
      component: Version
    },
    {
      path: '/quotation',
      name: 'Quotation',
      component: Quotation
    },
    {
      path: '/frenchCurrenry',
      name: 'FrenchCurrenry',
      component: FrenchCurrenry
    },
    {
      path: '/my/personal',
      name: 'Personal',
      component: Personal
    },
    {
      path: '/my/certification',
      name: 'Certification',
      component: Certification
    },
    {
      path: '/information',
      name: 'Information',
      component: Information
    },
    {
      path: '/infoDetail',
      name: 'InfoDetail',
      component: InfoDetail
    },
    {
      path: '/help',
      name: 'Help',
      component: Help
    },
    {
      path: '/exchange',
      name: 'Exchange',
      component: Exchange
    },
    {
      path: '/advert',
      name: 'Advert',
      component: Advert
    },
    {
      path: '/advertDetail',
      name: 'AdvertDetail',
      component: AdvertDetail
    },
    {
      path: '/my/loginLog',
      name: 'LoginLog',
      component: LoginLog
    },
    {
      path: '/orderList',
      name: 'OrderList',
      component: OrderList
    },
    {
      path: '/orderDetail',
      name: 'OrderDetail',
      component: OrderDetail
    },
    {
      path: '/news',
      name: 'News',
      component: News
    }
  ]
})
