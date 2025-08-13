// DTO for Designer Application in camelCase
export interface ApplyDesignerRequest {
  avatarFile?: File;
  bannerFile?: File;
  portfolioUrl?: string;
  portfolioFiles?: File[];
  specializationUrl?: string;
  bio?: string;
  socialLinks?: string;
  identificationNumber?: string;
  identificationPictureFront?: File;
  identificationPictureBack?: File;
  note?: string;
  phoneNumber?: string;
  address?: string;
  taxNumber?: string;
  certificates?: string;
}
