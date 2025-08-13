import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BoxIcon, ListIcon, PieChartIcon, PlusIcon } from '../../assets/icons/index.tsx';
import { formatViDateTime, parseApiDate } from '../../utils/date';
import MaterialDetailModal from '../../components/admin/MaterialDetailModal';
import { useSupplierMaterials } from '../../hooks/useSupplierMaterials';
import { useAuthStore } from '../../store/authStore';

type ApprovalStatus = 'all' | 'Pending' | 'Approved' | 'Rejected';

const SupplierMaterials: React.FC = () => {
  const [selectedStatus, setSelectedStatus] = useState<ApprovalStatus>('all');
  const supplierId = useAuthStore((s) => s.supplierProfile?.supplierId);
  const loadUserProfile = useAuthStore((s) => s.loadUserProfile);
  
  // Load profile if not available
  React.useEffect(() => {
    if (!supplierId) {
      loadUserProfile();
    }
  }, [supplierId, loadUserProfile]);
  
  const { data: materialsResponse, isLoading, error, refetch } = useSupplierMaterials(
    selectedStatus === 'all' ? undefined : selectedStatus
  );

  const materials = (materialsResponse as any) || [];
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Approved':
        return <span className="status-badge status-completed">Đã Duyệt</span>;
      case 'Pending':
        return <span className="status-badge status-warning">Chờ Duyệt</span>;
      case 'Rejected':
        return <span className="status-badge status-critical">Từ Chối</span>;
      default:
        return <span className="status-badge status-pending">Không xác định</span>;
    }
  };

  const getAvailabilityBadge = (isAvailable: boolean) => {
    if (isAvailable) {
      return <span className="status-badge status-completed">Còn hàng</span>;
    } else {
      return <span className="status-badge status-critical">Hết hàng</span>;
    }
  };

  // Calculate stats based on current data
  const stats = [
    {
      title: "Tổng Vật Liệu",
      value: materials.length.toString(),
      icon: <BoxIcon className="text-blue-500" />,
      bgColor: "bg-blue-500"
    },
    {
      title: "Chờ Duyệt",
      value: materials.filter(m => m.approvalStatus === 'Pending').length.toString(),
      icon: <ListIcon className="text-orange-500" />,
      bgColor: "bg-orange-500"
    },
    {
      title: "Đã Duyệt",
      value: materials.filter(m => m.approvalStatus === 'Approved').length.toString(),
      icon: <PieChartIcon className="text-green-500" />,
      bgColor: "bg-green-500"
    },
    {
      title: "Bị Từ Chối",
      value: materials.filter(m => m.approvalStatus === 'Rejected').length.toString(),
      icon: <BoxIcon className="text-red-500" />,
      bgColor: "bg-red-500"
    }
  ];

  const formatDate = (dateString: string) => {
    // Chuẩn hóa thời gian về VN để tránh lệch múi giờ, sau đó tính relative
    const d = parseApiDate(dateString);
    const vn = new Date(
      d.toLocaleString('en-US', { timeZone: 'Asia/Ho_Chi_Minh' })
    );
    const now = new Date(
      new Date().toLocaleString('en-US', { timeZone: 'Asia/Ho_Chi_Minh' })
    );
    const diffMs = now.getTime() - vn.getTime();
    const diffInHours = Math.floor(diffMs / (1000 * 60 * 60));
    if (diffInHours < 1) return 'Vừa xong';
    if (diffInHours < 24) return `${diffInHours} giờ trước`;
    const days = Math.floor(diffInHours / 24);
    if (days < 7) return `${days} ngày trước`;
    const weeks = Math.floor(days / 7);
    return `${weeks} tuần trước`;
  };

  const formatPrice = (price: number) => {
    return `${(price * 1000).toLocaleString()}đ/m`;
  };

  const formatQuantity = (quantity: number) => {
    return `${quantity}m`;
  };

  const [detailOpen, setDetailOpen] = useState(false);
  const [detailId, setDetailId] = useState<number | null>(null);

  if (isLoading) {
    return (
      <div className="dashboard-main">
        <div className="dashboard-container">
          <div className="dashboard-content">
            <div className="dashboard-card">
              <div className="card-body text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500 mx-auto mb-4"></div>
                <p className="text-gray-600">Đang tải danh sách vật liệu...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-main">
        <div className="dashboard-container">
          <div className="dashboard-content">
            <div className="dashboard-card">
              <div className="card-body text-center py-8">
                <div className="text-red-500 mb-4">
                  <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Không thể tải dữ liệu</h3>
                <p className="text-gray-600 mb-4">{error?.message || 'Đã xảy ra lỗi không xác định'}</p>
                <button
                  onClick={() => refetch()}
                  className="btn-primary"
                >
                  Thử lại
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
    <div className="dashboard-main">
      <div className="dashboard-container">
        <div className="dashboard-content">
          {/* Header */}
          <div className="dashboard-header">
            <h1 className="dashboard-title">Quản Lý Vật Liệu</h1>
            <p className="dashboard-subtitle">Thêm, sửa và quản lý vật liệu trong kho</p>
          </div>

          {/* Stats */}
          <div className="grid-stats mb-8">
            {stats.map((stat, index) => (
              <div key={index} className="stats-card hover-lift">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="stats-label">{stat.title}</p>
                    <p className="stats-value">{stat.value}</p>
                  </div>
                  <div className={`stats-icon-container ${stat.bgColor}`}>
                    {stat.icon}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Filter and Actions */}
          <div className="chart-container">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <h3 className="chart-title">Danh Sách Vật Liệu</h3>
                
                {/* Filter Tabs */}
                <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setSelectedStatus('all')}
                    className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                      selectedStatus === 'all'
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Tất Cả
                  </button>
                  <button
                    onClick={() => setSelectedStatus('Pending')}
                    className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                      selectedStatus === 'Pending'
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Chờ Duyệt
                  </button>
                  <button
                    onClick={() => setSelectedStatus('Approved')}
                    className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                      selectedStatus === 'Approved'
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Đã Duyệt
                  </button>
                  <button
                    onClick={() => setSelectedStatus('Rejected')}
                    className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                      selectedStatus === 'Rejected'
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Từ Chối
                  </button>
                </div>
              </div>
              
              <Link to="/supplier/dashboard/materials/add" className="btn-primary">
                <PlusIcon className="w-4 h-4 mr-2" />
                Thêm Vật Liệu
              </Link>
            </div>
            
            {/* Materials Table */}
            <div className="overflow-x-auto">
              {materials.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <BoxIcon className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {selectedStatus === 'all' 
                      ? 'Chưa có vật liệu nào'
                      : `Không có vật liệu ${selectedStatus === 'Pending' ? 'chờ duyệt' : selectedStatus === 'Approved' ? 'đã duyệt' : 'bị từ chối'}`
                    }
                  </h3>
                  <p className="text-gray-500 mb-4">
                    {selectedStatus === 'all' 
                      ? 'Bắt đầu bằng cách thêm vật liệu đầu tiên của bạn'
                      : 'Tất cả vật liệu đều đã được xử lý'
                    }
                  </p>
                  {selectedStatus === 'all' && (
                    <Link to="/supplier/dashboard/materials/add" className="btn-primary">
                      <PlusIcon className="w-4 h-4 mr-2" />
                      Thêm Vật Liệu Đầu Tiên
                    </Link>
                  )}
                </div>
              ) : (
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Tên Vật Liệu</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Loại Vật Liệu</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Số Lượng</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Giá</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Trạng Thái Duyệt</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Tình Trạng Kho</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Cập Nhật</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Thao Tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {materials.map((material) => (
                      <tr key={material.materialId} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800">
                        <td className="py-3 px-4">
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">{material.name}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{material.description}</p>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {material.materialTypeName}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {formatQuantity(material.quantityAvailable)}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {formatPrice(material.pricePerUnit)}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          {getStatusBadge(material.approvalStatus)}
                        </td>
                        <td className="py-3 px-4">
                          {getAvailabilityBadge(material.isAvailable)}
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {formatDate(material.lastUpdated)}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => { setDetailId(material.materialId); setDetailOpen(true); }}
                              className="p-1 text-gray-500 hover:text-brand-500 dark:text-gray-400 dark:hover:text-brand-400"
                              title="Xem chi tiết"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
    <MaterialDetailModal open={detailOpen} materialId={detailId} onClose={() => setDetailOpen(false)} />
    </>
  );
};

export default SupplierMaterials; 