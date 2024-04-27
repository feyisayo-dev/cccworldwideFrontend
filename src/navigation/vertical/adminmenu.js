export default [
  {
    title: 'Admin',
    icon: { icon: 'tabler-smart-home' },
    children: [
      {
        title: 'Dashboard',
        to: 'dashboards-admin-dashboard',
      },
      {
        title: 'User',
        icon: { icon: 'tabler-users' },
        children: [
          { title: 'View Members', to: 'dashboards-viewuser-dashboard' },
          { title: 'Add Parish', to: 'dashboards-parish-dashboard' },
       

          // { title: 'Add Parish', to: { name: 'dashboards-parish-dashboard', params: { id: 21 } } },
        ],
      },

      // {
      //   title: 'Users',
      //   icon: { icon: 'tabler-smart-home' },
      //   to: 'dashboards-viewuser-dashboard',
      // },
      // {
      //   title: 'Add Parish',
      //   to: 'dashboards-parish-dashboard',
      // },
      // {
      //   title: 'Add Event',
      //   to: 'dashboards-analytics',
      // },

      // {
      //   title: 'eCommerce',
      //   to: 'dashboards-ecommerce',
      // },
      // {
      //   title: 'CRM',
      //   to: 'dashboards-crm',
      // },
    ],
    badgeClass: 'bg-primary',
  },
]
