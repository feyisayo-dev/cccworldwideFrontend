export default [
  {
    title: 'User',
    icon: { icon: 'tabler-smart-home' },

    children: [
      {
        title: 'Dashboard',
        to: 'access-control',
      },

      {
        title: 'Add Children',
        to: 'dashboards-analytics',
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
