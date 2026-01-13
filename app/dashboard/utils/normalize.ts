export const normalizeKeywordsInput = (input: string) =>
  input
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean);

export const normalizeAllowlistNumbersInput = (numbers: string[]) => {
  const normalized = numbers
    .map((entry) => entry.trim())
    .filter(Boolean)
    .map((entry) => {
      const cleaned = entry.replace(/[^\d+]/g, "");
      if (!cleaned) return "";
      return cleaned.startsWith("+")
        ? `+${cleaned.slice(1).replace(/\+/g, "")}`
        : cleaned.replace(/\+/g, "");
    })
    .filter(Boolean);
  return Array.from(new Set(normalized));
};
