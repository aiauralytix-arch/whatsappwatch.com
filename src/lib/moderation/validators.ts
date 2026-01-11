export const requireGroupId = (groupId?: string) => {
  if (!groupId) {
    throw new Error("Group is required.");
  }
  return groupId;
};

export const requireGroupLink = (groupLink?: string | null) => {
  if (!groupLink) {
    throw new Error("Group link is required.");
  }
  return groupLink;
};

export const requireDefaultsConfigured = (hasDefaults: boolean) => {
  if (!hasDefaults) {
    throw new Error("No default lists configured.");
  }
};

export const enforceGroupLimit = (count: number | null, max: number) => {
  if ((count ?? 0) >= max) {
    throw new Error("Group limit reached.");
  }
};
