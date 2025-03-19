const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { 
        path: '', 
        name: 'home',
        component: () => import('pages/IndexPage.vue') 
      },
      { 
        path: '/stats/course/:name', 
        name: 'course',
        component: () => import('pages/StatsCoursePage.vue') 
      },
      { 
        path: '/:name/admin', 
        name: 'admin',
        component: () => import('pages/AdminPage.vue') 
      },
      { 
        path: '/:name', 
        name: 'room',
        component: () => import('pages/RoomPage.vue') 
      }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
