import { z } from "zod";

export const materialItemSchema = z.object({
  materialId: z.number(),
  persentageUsed: z.number().min(0).max(100),
  meterUsed: z.number().min(0),
});

export const featureSchema = z.object({
  reduceWaste: z.boolean(),
  lowImpactDyes: z.boolean(),
  durable: z.boolean(),
  ethicallyManufactured: z.boolean(),
});

export const createDesignSchema = z.object({
  name: z.string().min(1, { message: "Cần Thêm Tên Của Sản Phẩm" }),
  description: z.string().min(1, { message: "Cần Thêm Mô Tả Sản Phẩm" }),
  recycledPercentage: z
    .number({ message: "Cần Thêm Phần Trăn Bền Vững" })
    .min(0, { message: "Phần Trăn Bền Vững Ít Nhất Là 0" })
    .max(100, { message: "Phần Trăn Bền Vững Nhiều Nhất Là 100" }),
  careInstructions: z
    .string()
    .min(1, { message: "Cần Thêm Cách Bảo Quản Sản Phẩm" }),
  salePrice: z
    .number({ message: "Cần Thêm Giá Tiền" })
    .min(10000, { message: "Giá Tiền Nhỏ Nhất là 10.000đ" }),
  productScore: z
    .number({ message: "Cần Thêm Điểm Của Sản Phẩm" })
    .int({ message: "Product score must be an integer" })
    .min(0, { message: "Product score must be at least 0" })
    .max(5, { message: "Product score must be at most 5" }),
  status: z.string().min(1, { message: "Status is required" }),
  designTypeId: z.number({ message: "Cần Chọn Loại Thời Trang" }),

  feature: featureSchema,

  materialsJson: z.any().refine(
    (val) => {
      try {
        const parsed = JSON.parse(val);
        return (
          Array.isArray(parsed) &&
          parsed.every((item) => materialItemSchema.safeParse(item).success)
        );
      } catch {
        return false;
      }
    },
    {
      message: "Cần Thêm Chất Liệu",
    }
  ),

  imageFiles: z
    .any()
    .refine((files) => Array.isArray(files) && files.length > 0, {
      message: "Cần Thêm Hình",
    }),
});
export type CreateDesignFormValues = z.infer<typeof createDesignSchema>;

// Schema cho Response từ API
// Define the material response item schema
const materialResponseSchema = z.object({
  materialId: z.number(),
  name: z.string(),
  usagePercentage: z.number(),
  recycledPercentage: z.number(),
});

// Response schema
export const createDesignModelResponseSchema = z.object({
  name: z.string(),
  recycledPercentage: z.number(),
  salePrice: z.number(),
  productScore: z.number(),
  status: z.string().nullable().optional(),
  designTypeId: z.number().nullable().optional(),
  feature: featureSchema,
  materials: z.array(materialResponseSchema),
  imageUrls: z.array(z.string().url()),
  createdAt: z.string(), // or z.coerce.date() if you want to parse it into a Date
});

export type CreateDesignModelResponse = z.infer<
  typeof createDesignModelResponseSchema
>;
