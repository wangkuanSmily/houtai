/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const tableRouter = [
  {
    path: '/',
    component: Layout,
    redirect: '/app-config',
    children: [
      {
        path: 'app-config',
        component: () => import('@/views/mini-program/app-config/index'),
        name: 'app-config',
        meta: { icon: 'qq', title: '全局配置' }
      }
    ]
  },
  {
    path: '/banner',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/mini-program/banner/index'),
        name: 'banner',
        meta: { icon: 'table', title: 'Banner' }
      }
    ]
  },
  {
    path: '/product',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/mini-program/product/index'),
        name: 'product',
        icon: 'table',
        meta: { icon: 'table', title: '商品' }
      }
    ]
  },
  {
    path: '/facility',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/mini-program/facility/index'),
        name: 'facility',
        meta: { icon: 'star', title: '设施' }
      }
    ]
  },
  {
    path: '/hotel-room',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/mini-program/hotel-room/index'),
        name: 'hotel-room',
        meta: { icon: 'star', title: '酒店客房' }
      }
    ]
  },
  {
    path: '/map',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/mini-program/map/index'),
        name: 'map',
        meta: { icon: 'message', title: '地图数据' }
      }
    ]
  },
  {
    path: '/users',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/mini-program/users/index'),
        name: 'users',
        meta: { icon: 'user', title: '用户' }
      }
    ]
  },
  {
    path: '/coupon',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/mini-program/coupon/index'),
        name: 'coupon',
        meta: {
          icon: 'money',
          title: '优惠券'
        }
      }
    ]
  },
  {
    path: '/activity',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/mini-program/activity/index'),
        name: 'activity',
        meta: {
          title: '活动',
          icon: 'shopping'
        }
      }
    ]
  }
]
export default tableRouter
