import { z } from "zod";
// Schema cho form Apply Designer
// Sử dụng Zod để xác định các trường và kiểu dữ liệu
export const applyApplicationSchema = z.object({
  // Basic Info (from user claims)
  phoneNumber: z
    .string()
    .min(1, "Số điện thoại là bắt buộc")
    .regex(/^(0\d{9}|\+84\d{9,10})$/, {
      message: "Số điện thoại phải bắt đầu bằng 0 (10 số) hoặc +84 (11-12 số)",
    }),
  address: z.string().min(1, "Địa chỉ là bắt buộc"),

  // Professional Info
  bio: z.string().optional(),
  certificates: z.string().optional(),
  specializationUrl: z.string().url().optional().or(z.literal("")),
  taxNumber: z
    .string()
    .optional()
    .refine((val) => !val || val.length === 10 || val.length === 12, {
      message: "Mã số thuế phải có 10 hoặc 12 chữ số",
    }
  ),

  // Portfolio & Media
  avatarFile: z
    .any()
    .optional()
    .refine(
      (fileList) => {
        if (!fileList || fileList.length === 0) return true; // optional
        const file = fileList[0];
        return file.size <= 2 * 1024 * 1024; // 2MB
      },
      {
        message: "Ảnh đại diện phải nhỏ hơn hoặc bằng 2MB",
      }
    ),
  bannerFile: z
    .any()
    .optional()
    .refine(
      (fileList) => {
        if (!fileList || fileList.length === 0) return true; // optional
        const file = fileList[0];
        return file.size <= 10 * 1024 * 1024; // 10MB
      },
      {
        message: "Ảnh banner phải nhỏ hơn hoặc bằng 10MB",
      }
    ),
  portfolioUrl: z.string().url().optional().or(z.literal("")),
  portfolioFiles: z
    .any()
    .optional()
    .refine(
      (fileList) => {
        if (!fileList || fileList.length === 0) return true; // optional
        const files = Array.from(fileList); // FileList hoặc File[]
        return files.every((file) => (file as File).size <= 7 * 1024 * 1024);
      },
      {
        message: "Mỗi file trong portfolio không được vượt quá 7MB",
      }
    ),
  socialLinks: z.string().optional(),

  // Identity Verification
  identificationNumber: z.string().min(1, "Số CCCD là bắt buộc"),
  identificationPictureFront: z.any().optional(),
  identificationPictureBack: z.any().optional(),

  // Agreement
  note: z.string().optional(),
  agreedToTerms: z
    .boolean()
    .refine((val) => val === true, "Bạn phải đồng ý với điều khoản"),
});

export type ApplyApplicationFormValues = z.infer<typeof applyApplicationSchema>;

// Schema cho Response từ API
export const applicationModelResponseSchema = z.object({
  applicationId: z.number(),
  userId: z.number(),
  targetRoleId: z.number(),

  // Portfolio & Profile Images
  avatarUrl: z.string().nullable().optional(),
  bannerUrl: z.string().nullable().optional(),
  portfolioUrl: z.string().nullable().optional(),
  portfolioFiles: z.string().nullable().optional(),
  specializationUrl: z.string().nullable().optional(),
  bio: z.string().nullable().optional(),

  // Social Media
  socialLinks: z.string().nullable().optional(),

  // Identification / Xác minh
  identificationNumber: z.string().nullable().optional(),
  identificationPictureFront: z.string().nullable().optional(),
  identificationPictureBack: z.string().nullable().optional(),
  isIdentificationVerified: z.boolean(),

  // Tracking
  createdAt: z.string(),
  processedAt: z.string().nullable().optional(),

  // Kết quả xử lý
  processedBy: z.number().nullable().optional(),
  rejectionReason: z.string().nullable().optional(),
  note: z.string().nullable().optional(),

  status: z.enum(["pending", "approved", "rejected"]),

  // Thông tin liên hệ
  phoneNumber: z.string().nullable().optional(),
  address: z.string().nullable().optional(),
  taxNumber: z.string().nullable().optional(),
  certificates: z.string().nullable().optional(),

  // Navigation properties
  user: z
    .object({
      userId: z.number(),
      fullName: z.string().nullable().optional(),
      email: z.string().nullable().optional(),
    })
    .nullable()
    .optional(),

  role: z
    .object({
      roleId: z.number(),
      roleName: z.string(),
    })
    .nullable()
    .optional(),

  processedByUser: z
    .object({
      userId: z.number(),
      fullName: z.string().nullable().optional(),
      email: z.string().nullable().optional(),
    })
    .nullable()
    .optional(),
});

export type ApplicationModelResponse = z.infer<
  typeof applicationModelResponseSchema
>;
