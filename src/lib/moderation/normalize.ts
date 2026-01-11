export const normalizeGroupLink = (groupLink: string) => {
  const trimmed = groupLink.trim();
  if (trimmed.length === 0) return null;
  if (trimmed.length > 512) {
    throw new Error("Group link is too long.");
  }
  return trimmed;
};

export const normalizeGroupName = (groupName?: string) => {
  if (groupName === undefined) return undefined;
  const trimmed = groupName.trim();
  if (trimmed.length === 0) return null;
  if (trimmed.length > 80) {
    throw new Error("Group name is too long.");
  }
  return trimmed;
};

export const normalizeKeywords = (keywords?: string[]) => {
  if (!keywords) return undefined;
  return keywords
    .filter((entry): entry is string => typeof entry === "string")
    .map((entry) => entry.trim())
    .filter(Boolean)
    .slice(0, 100);
};

export const normalizePhoneNumbers = (numbers?: string[]) => {
  if (!numbers) return undefined;
  const normalized = numbers
    .filter((entry): entry is string => typeof entry === "string")
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
  return Array.from(new Set(normalized)).slice(0, 50);
};

export const mergeUnique = (current: string[], next: string[]) =>
  Array.from(new Set([...current, ...next]));
