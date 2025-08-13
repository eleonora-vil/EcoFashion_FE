import React from 'react';
import {
  GridIcon,
  BoxCubeIcon,
  ListIcon,
  BoxIcon,
  PieChartIcon,
  UserCircleIcon,
  PlugInIcon
} from '../../assets/icons/index.tsx'; // Updated import path and icons

const DashboardHome: React.FC = () => {
  const statsData = [
    {
      title: "Total Users",
      value: "1,234",
      change: "+12%",
      changeType: "positive",
      icon: <UserCircleIcon className="w-6 h-6" />,
      color: "bg-brand-500"
    },
    {
      title: "Total Designs",
      value: "567",
      change: "+8%",
      changeType: "positive",
      icon: <BoxIcon className="w-6 h-6" />,
      color: "bg-success-500"
    },
    {
      title: "Applications",
      value: "89",
      change: "+15%",
      changeType: "positive",
      icon: <ListIcon className="w-6 h-6" />,
      color: "bg-warning-500"
    },
    {
      title: "Revenue",
      value: "$12,345",
      change: "+23%",
      changeType: "positive",
      icon: <PieChartIcon className="w-6 h-6" />,
      color: "bg-purple-500"
    }
  ];

  const quickActions = [
    {
      title: "Review Applications",
      description: "Check pending applications",
      icon: <ListIcon className="w-6 h-6" />,
      color: "bg-brand-500"
    },
    {
      title: "Approve Designs",
      description: "Review submitted designs",
      icon: <BoxIcon className="w-6 h-6" />,
      color: "bg-success-500"
    },
    {
      title: "Manage Users",
      description: "View and manage users",
      icon: <UserCircleIcon className="w-6 h-6" />,
      color: "bg-warning-500"
    },
    {
      title: "Analytics",
      description: "View platform analytics",
      icon: <PieChartIcon className="w-6 h-6" />,
      color: "bg-purple-500"
    },
    {
      title: "Settings",
      description: "Configure platform settings",
      icon: <PlugInIcon className="w-6 h-6" />,
      color: "bg-gray-500"
    },
    {
      title: "Materials",
      description: "Manage materials inventory",
      icon: <BoxCubeIcon className="w-6 h-6" />,
      color: "bg-orange-500"
    }
  ];

  const recentActivity = [
    {
      id: 1,
      type: "application",
      message: "New designer application submitted by John Doe",
      time: "2 minutes ago",
      status: "pending"
    },
    {
      id: 2,
      type: "design",
      message: "Design 'Summer Collection' approved by admin",
      time: "1 hour ago",
      status: "approved"
    },
    {
      id: 3,
      type: "user",
      message: "New user registered: Sarah Johnson",
      time: "3 hours ago",
      status: "completed"
    },
    {
      id: 4,
      type: "material",
      message: "New material 'Organic Cotton' added to inventory",
      time: "5 hours ago",
      status: "completed"
    },
    {
      id: 5,
      type: "report",
      message: "Monthly analytics report generated",
      time: "1 day ago",
      status: "completed"
    }
  ];

  return (
    <div className="dashboard-main">
      <div className="dashboard-container">
        <div className="dashboard-content">
          <div className="dashboard-header">
            <h1 className="dashboard-title">Dashboard</h1>
            <p className="dashboard-subtitle">Welcome back! Here's what's happening with your platform.</p>
          </div>
          <div className="grid-stats mb-8">
            {statsData.map((stat, index) => (
              <div key={index} className="stats-card hover-lift">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="stats-label">
                      {stat.title}
                    </p>
                    <p className="stats-value">
                      {stat.value}
                    </p>
                  </div>
                  <div className={`stats-icon-container ${stat.color}`}>
                    {stat.icon}
                  </div>
                </div>
                <div className="mt-4">
                  <span className={`stats-trend ${
                    stat.changeType === 'positive' ? 'stats-trend-positive' : 'stats-trend-negative'
                  }`}>
                    {stat.change}
                  </span>
                  <span className="text-sm text-gray-600 ml-1">
                    from last month
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="grid-charts mb-8">
            <div className="chart-container">
              <h3 className="chart-title">Platform Growth</h3>
              <div className="chart-placeholder">
                <div className="text-center">
                  <PieChartIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">
                    Chart will be implemented here
                  </p>
                </div>
              </div>
            </div>
            <div className="chart-container">
              <h3 className="chart-title">User Analytics</h3>
              <div className="chart-placeholder">
                <div className="text-center">
                  <UserCircleIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">
                    User analytics chart will be implemented here
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="chart-container">
              <h3 className="chart-title">Quick Actions</h3>
              <div className="grid-actions">
                {quickActions.map((action, index) => (
                  <button key={index} className="quick-action-card">
                    <div className={`quick-action-icon ${action.color} text-white`}>
                      {action.icon}
                    </div>
                    <h4 className="quick-action-title">{action.title}</h4>
                    <p className="quick-action-description">{action.description}</p>
                  </button>
                ))}
              </div>
            </div>
            <div className="chart-container">
              <h3 className="chart-title">Recent Activity</h3>
              <div className="activity-list">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="activity-item">
                    <div className={`activity-dot ${
                      activity.type === 'application' ? 'activity-dot-order' :
                      activity.type === 'design' ? 'activity-dot-material' :
                      activity.type === 'user' ? 'activity-dot-customer' :
                      activity.type === 'material' ? 'activity-dot-material' :
                      'activity-dot-report'
                    }`}></div>
                    <div className="activity-content">
                      <p className="activity-message">
                        {activity.message}
                      </p>
                      <p className="activity-time">
                        {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome; 