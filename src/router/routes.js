const routes = [
  {
    path: '/',
    component: () => import('../pages/EventList.vue'),
  },
  {
    path: '/user/all',
    component: () => import('../pages/UserList.vue'),
  },
  {
    path: '/register',
    component: () => import('../pages//UserRegister.vue'),
  },
]

export default routes
