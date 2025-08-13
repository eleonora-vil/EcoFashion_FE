import React, { useState, useEffect } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { materialCreationFormRequestSchema, MaterialCreationFormRequest } from '../../schemas/materialSchema';
import { useAuthStore } from '../../store/authStore';
import { useMaterialTypes } from '../../hooks/useMaterialTypes';
import { useCountries } from '../../hooks/useCountries';
import { useTransportDetails } from '../../hooks/useTransportDetails';
import { useCreateMaterial } from '../../hooks/useCreateMaterial';
import { useUploadMaterialImages } from '../../hooks/useUploadMaterialImages';
import { PlusIcon, UploadIcon, SaveIcon, CancelIcon } from '../../assets/icons/index.tsx';
import { ApiError } from '../../services/api/baseApi';

// Toast notification component
const Toast: React.FC<{ message: string; type: 'success' | 'error' | 'info'; onClose: () => void }> = ({ message, type, onClose }) => {
  React.useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : 'bg-blue-500';
  const icon = type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ';

  return (
    <div 
      className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg text-white ${bgColor} min-w-80 max-w-md transform transition-all duration-300 ease-in-out`}
      style={{
        animation: 'slideIn 0.3s ease-out',
        transform: 'translateX(0)',
      }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-lg">{icon}</span>
          <p className="text-sm font-medium">{message}</p>
        </div>
        <button onClick={onClose} className="text-white hover:text-gray-200 transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
};

const AddMaterial: React.FC = () => {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toasts, setToasts] = useState<Array<{ id: string; message: string; type: 'success' | 'error' | 'info' }>>([]);
  const [isLocked, setIsLocked] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const supplierId = useAuthStore((s) => s.supplierProfile?.supplierId);
  const loadUserProfile = useAuthStore((s) => s.loadUserProfile);
  
  // React Query hooks for data fetching
  const { data: materialTypes = [], isLoading: isLoadingTypes, error: typesError } = useMaterialTypes();
  const { data: countries = [], isLoading: isLoadingCountries, error: countriesError } = useCountries();
  
  // Mutation hooks
  const createMaterialMutation = useCreateMaterial();
  const uploadImagesMutation = useUploadMaterialImages();
  
  const isLoadingData = isLoadingTypes || isLoadingCountries;
  const hasError = typesError || countriesError;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
    setError,
  } = useForm<MaterialCreationFormRequest>({
    resolver: zodResolver(materialCreationFormRequestSchema) as any,
    defaultValues: {
      supplierId: supplierId ?? '',
      typeId: 0,
      name: '',
      description: '',
      recycledPercentage: 0,
      quantityAvailable: 0,
      pricePerUnit: 0,
      documentationUrl: '',
      carbonFootprint: undefined,
      waterUsage: undefined,
      wasteDiverted: undefined,
      productionCountry: '',
      productionRegion: '',
      manufacturingProcess: '',
      certificationDetails: '',
      certificationExpiryDate: '',
      transportDistance: null,
      transportMethod: '',
      sustainabilityCriteria: [],
    },
  });

  // Watch productionCountry to preview transport details
  const productionCountry = watch('productionCountry');
  const { data: transportPreview, isLoading: isLoadingTransport } = useTransportDetails(productionCountry || null);

  // Ensure supplierId is synced into form for schema validation (uuid required)
  useEffect(() => {
    if (supplierId) {
      setValue('supplierId', supplierId);
    }
  }, [supplierId, setValue]);

  // Load supplier profile if missing (to obtain SupplierId GUID)
  useEffect(() => {
    if (!supplierId) {
      try { loadUserProfile(); } catch {}
    }
  }, [supplierId, loadUserProfile]);

  // Add toast function
  const addToast = (message: string, type: 'success' | 'error' | 'info') => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts(prev => [...prev, { id, message, type }]);
  };

  // Remove toast function
  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  // Lock form for 5 minutes after successful submission
  const lockForm = () => {
    setIsLocked(true);
    setCountdown(300); // 5 minutes = 300 seconds
    
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsLocked(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Format countdown time
  const formatCountdown = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const onSubmit: SubmitHandler<MaterialCreationFormRequest> = async (data) => {
    if (isSubmitting) return; // Prevent spam
    // Backend will override SupplierId from claims; allow submit even if supplierId chưa load
    
    setIsSubmitting(true);
    
    try {
      // Add delay to prevent spam
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Ensure supplierId present
      const supplierGuid = supplierId ?? '';
      const payload: MaterialCreationFormRequest = {
        ...data,
        supplierId: supplierGuid,
        // Add missing fields that backend expects
        isCertified: false,
        hasOrganicCertification: false,
        organicCertificationType: null,
        qualityStandards: null,
        isAvailable: false, // Backend will override to false for new materials
        // Ensure date format is correct
        certificationExpiryDate: data.certificationExpiryDate || null,
        // Ensure sustainabilityCriteria is an array
        sustainabilityCriteria: data.sustainabilityCriteria || [],
        // Ensure transport fields are not sent (backend will auto-calculate)
        transportDistance: null,
        transportMethod: null,
      };

      addToast('Đang tạo vật liệu mới...', 'info');

      const creation = await createMaterialMutation.mutateAsync(payload);
      
      addToast('Vật liệu đã được tạo thành công!', 'success');

      // Upload images if any
      if (uploadedFiles.length > 0) {
        try {
          addToast('Đang tải lên hình ảnh...', 'info');
          
          await uploadImagesMutation.mutateAsync({
            materialId: creation.materialId,
            files: uploadedFiles,
          });
          
          addToast(`${uploadedFiles.length} hình ảnh đã được tải lên thành công!`, 'success');
        } catch (e) {
          console.warn('Upload images failed:', e);
          addToast('Lỗi tải lên hình ảnh. Vật liệu đã được tạo nhưng không có hình ảnh.', 'error');
        }
      }
      
      // Final success message
      setTimeout(() => {
        addToast('Vật liệu của bạn sẽ được admin duyệt trước khi lên kệ hàng.', 'info');
      }, 1000);
      
      // Lock form and reset after successful submission
      lockForm();
      setTimeout(() => {
        reset();
        setUploadedFiles([]);
      }, 2000);
      
    } catch (error) {
      console.error('Error creating material:', error);
      if (error instanceof ApiError) {
        const message = error.message || 'Lỗi tạo vật liệu.';
        // Bắt lỗi trùng tên từ backend và hiển thị ngay tại field Name
        if (message.toLowerCase().includes('cùng tên')) {
          setError('name', { type: 'server', message });
          addToast(message, 'error');
        } else {
          addToast(message, 'error');
        }
      } else {
        addToast('Lỗi tạo vật liệu. Vui lòng thử lại.', 'error');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);

    // Filter only image files
    const imageFiles = files.filter((f) => f.type.startsWith('image/'));
    const nonImageCount = files.length - imageFiles.length;
    if (nonImageCount > 0) {
      addToast(`${nonImageCount} tệp không phải hình ảnh đã bị bỏ qua.`, 'info');
    }

    setUploadedFiles((prev) => {
      if (prev.length >= 3) {
        addToast('Bạn chỉ có thể tải tối đa 3 ảnh.', 'error');
        return prev;
      }

      const remainingSlots = 3 - prev.length;
      const filesToAdd = imageFiles.slice(0, remainingSlots);

      if (imageFiles.length > remainingSlots) {
        addToast(`Chỉ có thể thêm ${remainingSlots} ảnh nữa (tối đa 3).`, 'error');
      }

      return [...prev, ...filesToAdd];
    });

    // Reset input value to allow re-selecting the same file if needed
    event.currentTarget.value = '';
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  // Generate and cleanup preview URLs when uploadedFiles changes
  useEffect(() => {
    const urls = uploadedFiles.map((file) => URL.createObjectURL(file));
    setImagePreviews(urls);
    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [uploadedFiles]);

  return (
    <>
      <style>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
      <div className="dashboard-main">
        <div className="dashboard-container">
          <div className="dashboard-content">
            {/* Header */}
            <div className="dashboard-header">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="dashboard-title">Thêm Vật Liệu Mới</h1>
                  <p className="dashboard-subtitle">Tạo danh sách vật liệu mới cho kho hàng của bạn</p>
                  <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="text-sm text-blue-800">
                        <span className="font-medium">Lưu ý:</span> Vật liệu mới của bạn sẽ được admin duyệt trước khi lên kệ hàng
                      </p>
                    </div>
                  </div>
                  
                  {/* Countdown Lock Notification */}
                  {isLocked && countdown > 0 && (
                    <div className="mt-2 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                      <div className="flex items-center gap-2">
                        <svg className="w-5 h-5 text-orange-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-sm text-orange-800">
                          <span className="font-medium">Tạm khóa:</span> Vui lòng chờ{' '}
                          <span className="font-bold text-orange-900">{formatCountdown(countdown)}</span> 
                          {' '}trước khi thêm vật liệu mới
                        </p>
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => window.history.back()}
                    className="btn-secondary"
                  >
                    <CancelIcon className="w-4 h-4" />
                    Cancel
                  </button>
                </div>
              </div>
            </div>

            {/* Loading State */}
            {isLoadingData && (
              <div className="dashboard-card">
                <div className="card-body text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500 mx-auto mb-4"></div>
                  <p className="text-gray-600">Đang tải loại vật liệu và quốc gia...</p>
                </div>
              </div>
            )}

            {/* Error State */}
            {hasError && !isLoadingData && (
              <div className="dashboard-card">
                <div className="card-body text-center py-8">
                  <div className="text-red-500 mb-4">
                    <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Không thể tải dữ liệu</h3>
                  <p className="text-gray-600 mb-4">{hasError?.message || 'Đã xảy ra lỗi không xác định'}</p>
                  <button
                    onClick={() => window.location.reload()}
                    className="btn-primary"
                  >
                    Thử lại
                  </button>
                </div>
              </div>
            )}

            {/* Form */}
            {!isLoadingData && !hasError && (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                {/* hidden supplierId field for validation binding */}
                <input type="hidden" {...register('supplierId')} />
                {/* Basic Information */}
                <div className="dashboard-card">
                  <div className="card-header">
                    <h3 className="card-title">Thông Tin Cơ Bản</h3>
                    <p className="card-subtitle">Chi tiết cơ bản về vật liệu</p>
                  </div>
                  <div className="card-body">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Material Name */}
                      <div className="form-group">
                        <label className="form-label">Tên Vật Liệu *</label>
                        <input
                          type="text"
                          {...register('name')}
                          className={`form-input ${errors.name ? 'form-input-error' : ''}`}
                          placeholder="Nhập tên vật liệu"
                        />
                        {errors.name && (
                          <p className="form-error">{errors.name.message}</p>
                        )}
                      </div>

                      {/* Material Type */}
                      <div className="form-group">
                        <label className="form-label">Loại Vật Liệu *</label>
                        <select
                          {...register('typeId', { valueAsNumber: true })}
                          className={`form-select ${errors.typeId ? 'form-select-error' : ''}`}
                        >
                          <option value="">Chọn loại vật liệu</option>
                          {materialTypes.map((type) => (
                            <option key={type.typeId} value={type.typeId}>
                              {type.typeName} {type.category ? `(${type.category})` : ''}
                            </option>
                          ))}
                        </select>
                        {errors.typeId && (
                          <p className="form-error">{errors.typeId.message}</p>
                        )}
                      </div>

                      {/* Description */}
                      <div className="form-group md:col-span-2">
                        <label className="form-label">Mô Tả</label>
                        <textarea
                          {...register('description')}
                          rows={4}
                          className={`form-textarea ${errors.description ? 'form-textarea-error' : ''}`}
                          placeholder="Mô tả vật liệu, tính chất và lợi ích"
                        />
                        {errors.description && (
                          <p className="form-error">{errors.description.message}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Pricing & Inventory */}
                <div className="dashboard-card">
                  <div className="card-header">
                    <h3 className="card-title">Giá Cả & Kho Hàng</h3>
                    <p className="card-subtitle">Thông tin giá cả và tồn kho</p>
                  </div>
                  <div className="card-body">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {/* Quantity Available */}
                      <div className="form-group">
                        <label className="form-label">Số Lượng Có Sẵn *</label>
                        <input
                          type="number"
                          {...register('quantityAvailable', { valueAsNumber: true })}
                          className={`form-input ${errors.quantityAvailable ? 'form-input-error' : ''}`}
                          placeholder="0"
                          min="0"
                        />
                        {errors.quantityAvailable && (
                          <p className="form-error">{errors.quantityAvailable.message}</p>
                        )}
                      </div>

                      {/* Price Per Unit */}
                      <div className="form-group">
                        <label className="form-label">Giá (x1000 VNĐ/mét) ví dụ 50 = 50.000 VNĐ/mét *</label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                          <input
                            type="number"
                            {...register('pricePerUnit', { valueAsNumber: true })}
                            className={`form-input pl-8 ${errors.pricePerUnit ? 'form-input-error' : ''}`}
                            placeholder="0.00"
                            min="0"
                            step="0.01"
                          />
                        </div>
                        {errors.pricePerUnit && (
                          <p className="form-error">{errors.pricePerUnit.message}</p>
                        )}
                      </div>

                      {/* Recycled Percentage */}
                      <div className="form-group">
                        <label className="form-label">Tỷ Lệ Tái Chế (%)</label>
                        <input
                          type="number"
                          {...register('recycledPercentage', { valueAsNumber: true })}
                          className={`form-input ${errors.recycledPercentage ? 'form-input-error' : ''}`}
                          placeholder="0"
                          min="0"
                          max="100"
                        />
                        {errors.recycledPercentage && (
                          <p className="form-error">{errors.recycledPercentage.message}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Production & Certification */}
                <div className="dashboard-card">
                  <div className="card-header">
                    <h3 className="card-title">Sản Xuất & Chứng Chỉ</h3>
                    <p className="card-subtitle">Thông tin sản xuất và chứng chỉ bền vững</p>
                  </div>
                  <div className="card-body">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Production Country */}
                      <div className="form-group">
                        <label className="form-label">Quốc Gia Sản Xuất *</label>
                        <select
                          {...register('productionCountry')}
                          className={`form-select ${errors.productionCountry ? 'form-select-error' : ''}`}
                        >
                          <option value="">Chọn quốc gia</option>
                          {countries.map((country) => (
                            <option key={country} value={country}>
                              {country}
                            </option>
                          ))}
                        </select>
                        {errors.productionCountry && (
                          <p className="form-error">{errors.productionCountry.message}</p>
                        )}
                      </div>

                      {/* Production Region */}
                      <div className="form-group">
                        <label className="form-label">Khu Vực Sản Xuất</label>
                        <input
                          type="text"
                          {...register('productionRegion')}
                          className={`form-input ${errors.productionRegion ? 'form-input-error' : ''}`}
                          placeholder="Ví dụ: Đông Nam Bộ"
                        />
                        {errors.productionRegion && (
                          <p className="form-error">{errors.productionRegion.message}</p>
                        )}
                      </div>

                      {/* Manufacturing Process */}
                      <div className="form-group">
                        <label className="form-label">Quy Trình Sản Xuất</label>
                        <input
                          type="text"
                          {...register('manufacturingProcess')}
                          className={`form-input ${errors.manufacturingProcess ? 'form-input-error' : ''}`}
                          placeholder="Mô tả quy trình sản xuất"
                        />
                        {errors.manufacturingProcess && (
                          <p className="form-error">{errors.manufacturingProcess.message}</p>
                        )}
                      </div>

                      {/* Certification Expiry Date */}
                      <div className="form-group">
                        <label className="form-label">Ngày Hết Hạn Chứng Chỉ</label>
                        <input
                          type="date"
                          {...register('certificationExpiryDate')}
                          className={`form-input ${errors.certificationExpiryDate ? 'form-input-error' : ''}`}
                        />
                        {errors.certificationExpiryDate && (
                          <p className="form-error">{errors.certificationExpiryDate.message}</p>
                        )}
                      </div>

                      {/* Certification Details */}
                      <div className="form-group md:col-span-2">
                        <label className="form-label">Chi Tiết Chứng Chỉ</label>
                        <textarea
                          {...register('certificationDetails')}
                          rows={3}
                          className={`form-textarea ${errors.certificationDetails ? 'form-textarea-error' : ''}`}
                          placeholder="Nhập chi tiết chứng chỉ (GOTS, OEKO-TEX, GRS, OCS, v.v.)"
                        />
                        {errors.certificationDetails && (
                          <p className="form-error">{errors.certificationDetails.message}</p>
                        )}
                      </div>

                      {/* Documentation URL */}
                      <div className="form-group md:col-span-2">
                        <label className="form-label">URL Chứng Chỉ (optional)</label>
                        <input
                          type="url"
                          {...register('documentationUrl')}
                          className={`form-input ${errors.documentationUrl ? 'form-input-error' : ''}`}
                          placeholder="https://example.com/documentation"
                        />
                        {errors.documentationUrl && (
                          <p className="form-error">{errors.documentationUrl.message}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sustainability Metrics */}
                <div className="dashboard-card">
                  <div className="card-header">
                    <h3 className="card-title">Chỉ Số Bền Vững</h3>
                    <p className="card-subtitle">Các chỉ số đánh giá tính bền vững</p>
                  </div>
                  <div className="card-body">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {/* Carbon Footprint */}
                      <div className="form-group">
                        <label className="form-label">Dấu Chân Carbon (kg CO2e/mét)</label>
                        <input
                          type="number"
                          {...register('carbonFootprint', { valueAsNumber: true })}
                          className={`form-input ${errors.carbonFootprint ? 'form-input-error' : ''}`}
                          placeholder="0.00"
                          min="0"
                          step="0.01"
                        />
                        {errors.carbonFootprint && (
                          <p className="form-error">{errors.carbonFootprint.message}</p>
                        )}
                      </div>

                      {/* Water Usage */}
                      <div className="form-group">
                        <label className="form-label">Sử Dụng Nước (lít/mét)</label>
                        <input
                          type="number"
                          {...register('waterUsage', { valueAsNumber: true })}
                          className={`form-input ${errors.waterUsage ? 'form-input-error' : ''}`}
                          placeholder="0.00"
                          min="0"
                          step="0.01"
                        />
                        {errors.waterUsage && (
                          <p className="form-error">{errors.waterUsage.message}</p>
                        )}
                      </div>

                      {/* Waste Diverted */}
                      <div className="form-group">
                        <label className="form-label">Chất Thải Chuyển Hướng (%)</label>
                        <input
                          type="number"
                          {...register('wasteDiverted', { valueAsNumber: true })}
                          className={`form-input ${errors.wasteDiverted ? 'form-input-error' : ''}`}
                          placeholder="0"
                          min="0"
                          max="100"
                        />
                        {errors.wasteDiverted && (
                          <p className="form-error">{errors.wasteDiverted.message}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Transport Information */}
                {productionCountry && (
                  <div className="dashboard-card">
                    <div className="card-header">
                      <h3 className="card-title">Thông Tin Vận Chuyển</h3>
                      <p className="card-subtitle">Tự động tính toán điểm bền vững dựa trên quốc gia sản xuất</p>
                    </div>
                    <div className="card-body">
                      {isLoadingTransport ? (
                        <div className="flex items-center justify-center py-4">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-brand-500 mr-3"></div>
                          <span className="text-gray-600">Đang tính toán thông tin vận chuyển...</span>
                        </div>
                      ) : transportPreview ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div className="bg-blue-50 p-4 rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                              <span className="font-medium text-blue-800">Khoảng Cách</span>
                            </div>
                            <p className="text-2xl font-bold text-blue-900">{transportPreview.distance} km</p>
                            <p className="text-sm text-blue-700">Từ {productionCountry} đến Việt Nam</p>
                          </div>
                          
                          <div className="bg-green-50 p-4 rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                              </svg>
                              <span className="font-medium text-green-800">Phương Thức</span>
                            </div>
                            <p className="text-lg font-semibold text-green-900">{transportPreview.method}</p>
                            <p className="text-sm text-green-700">Phương thức vận chuyển tối ưu</p>
                          </div>
                          
                          <div className="bg-purple-50 p-4 rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                              <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <span className="font-medium text-purple-800">Điểm Bền Vững</span>
                            </div>
                            <p className="text-sm text-purple-900">{transportPreview.description}</p>
                            <p className="text-xs text-purple-700 mt-1">Dựa trên khoảng cách và phương thức vận chuyển</p>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-4 text-gray-500">
                          Chọn quốc gia sản xuất để xem thông tin vận chuyển và tính điểm bền vững
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* File Upload */}
                <div className="dashboard-card">
                  <div className="card-header">
                    <h3 className="card-title">Hình Ảnh</h3>
                    <p className="card-subtitle">Tải lên hình ảnh vật liệu</p>
                  </div>
                  <div className="card-body">
                    {/* File Upload Area */}
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-brand-500 transition-colors">
                      <UploadIcon className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                      <h4 className="text-lg font-semibold text-gray-800 mb-2">
                        Tải Lên Hình Ảnh
                      </h4>
                      <p className="text-gray-600 mb-4">
                        Kéo thả hình ảnh vào đây hoặc nhấp để duyệt
                      </p>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                        id="file-upload"
                        disabled={uploadedFiles.length >= 3}
                      />
                      <label
                        htmlFor="file-upload"
                        className={`btn-secondary cursor-pointer inline-flex items-center gap-2 ${uploadedFiles.length >= 3 ? 'opacity-50 cursor-not-allowed' : ''}`}
                        onClick={(e) => {
                          if (uploadedFiles.length >= 3) {
                            e.preventDefault();
                            addToast('Đã đạt giới hạn 3 ảnh.', 'info');
                          }
                        }}
                      >
                        <PlusIcon className="w-4 h-4" />
                        {uploadedFiles.length >= 3 ? 'Đã đạt tối đa (3 ảnh)' : 'Chọn Hình Ảnh'}
                      </label>
                    </div>

                    {/* Uploaded Images Preview Grid */}
                    {imagePreviews.length > 0 && (
                      <div className="mt-6">
                        <div className="flex items-center justify-between mb-3">
                          <h5 className="font-medium text-gray-800">Xem trước hình ảnh</h5>
                          <span className="text-sm text-gray-600">{uploadedFiles.length}/3 ảnh</span>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                          {imagePreviews.map((url, index) => (
                            <div key={index} className="relative group">
                              <img src={url} alt={`preview-${index}`} className="w-full h-32 object-cover rounded-lg border border-gray-200" />
                              <button
                                type="button"
                                onClick={() => removeFile(index)}
                                className="absolute top-2 right-2 bg-white/90 hover:bg-white text-red-600 border border-red-200 rounded-full p-1 shadow transition"
                                aria-label="Xoá ảnh"
                              >
                                <CancelIcon className="w-4 h-4" />
                              </button>
                              {uploadedFiles[index]?.size !== undefined && (
                                <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-0.5 rounded">
                                  {(uploadedFiles[index]!.size / 1024 / 1024).toFixed(2)} MB
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => window.history.back()}
                    className="btn-secondary"
                  >
                    <CancelIcon className="w-4 h-4" />
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isLocked || isSubmitting || createMaterialMutation.isPending || uploadImagesMutation.isPending}
                    className={`btn-primary ${isLocked ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {isLocked ? (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        Đã Khóa ({formatCountdown(countdown)})
                      </>
                    ) : isSubmitting || createMaterialMutation.isPending || uploadImagesMutation.isPending ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        {isSubmitting ? 'Đang xử lý...' : createMaterialMutation.isPending ? 'Đang tạo vật liệu...' : 'Đang tải lên hình ảnh...'}
                      </>
                    ) : (
                      <>
                        <SaveIcon className="w-4 h-4" />
                        Lưu Vật Liệu
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
      
      {/* Toast Notifications */}
      {toasts.map(toast => (
        <Toast key={toast.id} {...toast} onClose={() => removeToast(toast.id)} />
      ))}
    </>
  );
};

export default AddMaterial;
