import React from 'react';
import { 
  GridIcon, 
  BoxCubeIcon, 
  ListIcon, 
  BoxIcon, 
  PieChartIcon, 
  UserCircleIcon, 
  PlugInIcon 
} from '../../assets/icons/index.tsx';


const SupplierDashboardHome: React.FC = () => {
  const statsData = [
    {
      title: "Tổng Đơn Hàng",
      value: "1,234",
      change: "+12.5%",
      changeType: "positive" as const,
      icon: <ListIcon className="text-blue-500" />,
      bgColor: "bg-blue-500",
    },
    {
      title: "Doanh Thu",
      value: "₫45.2M",
      change: "+8.2%",
      changeType: "positive" as const,
      icon: <PieChartIcon className="text-green-500" />,
      bgColor: "bg-green-500",
    },
    {
      title: "Vật Liệu Trong Kho",
      value: "156",
      change: "-2.1%",
      changeType: "negative" as const,
      icon: <BoxIcon className="text-orange-500" />,
      bgColor: "bg-orange-500",
    },
    {
      title: "Khách Hàng Mới",
      value: "89",
      change: "+15.3%",
      changeType: "positive" as const,
      icon: <UserCircleIcon className="text-purple-500" />,
      bgColor: "bg-purple-500",
    },
  ];

  const quickActions = [
    {
      title: "Thêm Vật Liệu",
      description: "Thêm vật liệu mới vào kho",
      icon: <BoxCubeIcon className="text-brand-500" />,
      path: "/supplier/materials/add",
    },
    {
      title: "Xem Đơn Hàng",
      description: "Kiểm tra đơn hàng mới",
      icon: <ListIcon className="text-brand-500" />,
      path: "/supplier/orders",
    },
    {
      title: "Báo Cáo",
      description: "Xem báo cáo doanh thu",
      icon: <PieChartIcon className="text-brand-500" />,
      path: "/supplier/analytics",
    },
  ];

  const recentActivity = [
    {
      message: "Đơn hàng #12345 đã được đặt",
      time: "2 phút trước",
      type: "order" as const,
    },
    {
      message: "Vật liệu Cotton đã được thêm vào kho",
      time: "1 giờ trước",
      type: "material" as const,
    },
    {
      message: "Báo cáo tháng 12 đã được tạo",
      time: "3 giờ trước",
      type: "report" as const,
    },
    {
      message: "Khách hàng mới đã đăng ký",
      time: "5 giờ trước",
      type: "customer" as const,
    },
  ];

  return (
    <div className="dashboard-main">
      <div className="dashboard-container">
        <div className="dashboard-content">
          {/* Header */}
          <div className="dashboard-header">
            <h1 className="dashboard-title">Dashboard</h1>
            <p className="dashboard-subtitle">Chào mừng bạn trở lại! Đây là tổng quan về hoạt động kinh doanh của bạn.</p>
          </div>

          {/* Stats Grid */}
          <div className="grid-stats mb-8">
            {statsData.map((stat, index) => (
              <div key={index} className="stats-card hover-lift">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="stats-label">{stat.title}</p>
                    <p className="stats-value">{stat.value}</p>
                    <p className={`stats-trend ${stat.changeType === 'positive' ? 'stats-trend-positive' : 'stats-trend-negative'}`}>
                      {stat.change} so với tháng trước
                    </p>
                  </div>
                  <div className={`stats-icon-container ${stat.bgColor}`}>
                    {stat.icon}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Charts Grid */}
          <div className="grid-charts mb-8">
            {/* Sales Chart */}
            <div className="chart-container">
              <h3 className="chart-title">Doanh Thu Tháng Này</h3>
              <div className="chart-placeholder">
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <PieChartIcon className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-500">Biểu đồ doanh thu sẽ được hiển thị ở đây</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Orders Chart */}
            <div className="chart-container">
              <h3 className="chart-title">Đơn Hàng Gần Đây</h3>
              <div className="chart-placeholder">
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <ListIcon className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-500">Biểu đồ đơn hàng sẽ được hiển thị ở đây</p>
                  </div>
                </div>
              </div>
            </div>
          </div>



          {/* Quick Actions & Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Quick Actions */}
            <div className="chart-container">
              <h3 className="chart-title">Thao Tác Nhanh</h3>
              <div className="grid-actions">
                {quickActions.map((action, index) => (
                  <div key={index} className="quick-action-card hover-lift">
                    <div className="quick-action-icon">
                      {action.icon}
                    </div>
                    <h4 className="quick-action-title">{action.title}</h4>
                    <p className="quick-action-description">{action.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="chart-container">
              <h3 className="chart-title">Hoạt Động Gần Đây</h3>
              <div className="activity-list">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="activity-item">
                    <div className={`activity-dot activity-dot-${activity.type}`}></div>
                    <div className="activity-content">
                      <p className="activity-message">{activity.message}</p>
                      <p className="activity-time">{activity.time}</p>
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

export default SupplierDashboardHome; 