
const routes = [
  {
    name: '活動頁面',
    path: '/',
    component: () => import('../pages/EventHome.vue'),
    children: [
      {
        name: '圖片列表',
        path: '/image',
        component: () => import('../pages/PicList.vue'),

      },
      {
        name: '活動列表',
        path: '/event',
        component: () => import('../pages/EventList.vue'),
      },
    ],
  },
  {
    name: '新增活動',
    path: '/addEvent',
    component: () => import('../pages/EventAdd.vue'),
  },
  {
    name: '使用者列表',
    path: '/user/all',
    component: () => import('../pages/UserList.vue'),
  },
  { name:'註冊',
    path: '/register',
    component: () => import('../pages//UserRegister.vue'),
  },
]

export default routes
