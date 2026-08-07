const AVATAR_COLORS = [
  "bg-main-500",
  "bg-complete",
  "bg-success",
  "bg-warning",
];

export const getAvatarColorByIndex = (index: number): string =>
  AVATAR_COLORS[index % AVATAR_COLORS.length];
