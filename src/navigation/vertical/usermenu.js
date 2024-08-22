export default [
  {
    title: 'User',
    icon: { icon: 'tabler-smart-home' },

    children: [
      {
        title: 'User Dashboard',
        to: 'access-control',
      },

      {
        title: 'Add Children',
        to: 'dashboards-analytics',
      },

      {
        title: 'Baptism Registration',
        icon: { icon: 'tabler:user-pause' },
        to: 'dashboards-baptism-dashboard',
      },

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
