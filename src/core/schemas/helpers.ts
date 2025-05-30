import emojiRegex from "emoji-regex";

export const validateOptionalHexColor = (color: string | null) => {
  if (color === null) return true;
  return /^#[0-9A-F]{6}$/i.test(color);
};

export const isValidEmoji = (value: string) => {
  const trimmed = value.trim();
  return (
    trimmed.length > 0 &&
    [...trimmed.matchAll(emojiRegex())].join("") === trimmed
  );
};
