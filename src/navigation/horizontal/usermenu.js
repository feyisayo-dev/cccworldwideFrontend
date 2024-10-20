export default [
  {
    title: 'User',
    icon: { icon: 'tabler-smart-home' },
    children: [
      {
        title: 'User Dashboard',
        to: 'dashboards-user-dashboard',
        action: 'read',        // Define specific action
        subject: 'Children',
      },
      {
        title: 'User Setting',
        to: {
          name: 'pages-account-settings-tab',
          params: { tab: 'account' },
        },
        icon: { icon: 'tabler-settings' },
        action: 'read',        // Define specific action
        subject: 'Children',
      },
      {
        title: 'Events',
        to: 'dashboards-addevent-dashboard',
        icon: { icon: 'tabler-calendar' },
        action: 'read',        // Define specific action
        subject: 'Children',
      },
      {
        title: 'Add Children',
        to: 'dashboards-addChildren-dashboard',
        action: 'read',
        subject: 'User',
      },
      {
        title: 'Baptism Registration',
        icon: { icon: 'tabler:user-pause' },
        to: 'dashboards-baptism-dashboard',
        action: 'read',
        subject: 'Children',
      },
      {
        title: 'Payments',
        icon: { icon: 'tabler:user-pause' },
        to: 'dashboards-addmemberpayment-dashboard',
        action: 'read',
        subject: 'Children',
      },
    ],
    badgeClass: 'bg-primary',
  },
]
