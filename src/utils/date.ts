export function parseApiDate(value: string | Date): Date {
  if (value instanceof Date) return value;
  if (!value) return new Date(NaN);
  const str = String(value);
  // Nếu thiếu thông tin múi giờ, giả định là UTC để tránh lệch giờ
  const hasTz = /Z$|[+-]\d{2}:?\d{2}$/.test(str);
  const iso = hasTz ? str : str + "Z";
  const d = new Date(iso);
  return d;
}

export function formatViDateTime(value: string | Date): string {
  const d = parseApiDate(value);
  if (isNaN(d.getTime())) return "";
  return d.toLocaleString("vi-VN", {
    timeZone: "Asia/Ho_Chi_Minh",
    hour12: false,
  });
}

export function formatViDate(value: string | Date): string {
  const d = parseApiDate(value);
  if (isNaN(d.getTime())) return "";
  return d.toLocaleDateString("vi-VN", {
    timeZone: "Asia/Ho_Chi_Minh",
  });
}


