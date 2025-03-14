export const validateOptionalHexColor = (color: string | null) => {
  if (color === null) return true;
  return /^#[0-9A-F]{6}$/i.test(color);
};
