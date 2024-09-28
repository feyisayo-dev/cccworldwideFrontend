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
        title: 'Add Children',
        to: 'dashboards-analytics',
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
