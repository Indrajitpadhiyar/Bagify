const colorMap = {
  A: "bg-red-500",
  B: "bg-orange-500",
  C: "bg-amber-500",
  D: "bg-yellow-500",
  E: "bg-lime-500",
  F: "bg-green-500",
  G: "bg-emerald-500",
  H: "bg-teal-500",
  I: "bg-cyan-500",
  J: "bg-sky-500",
  K: "bg-blue-500",
  L: "bg-indigo-500",
  M: "bg-violet-500",
  N: "bg-purple-500",
  O: "bg-fuchsia-500",
  P: "bg-pink-500",
  Q: "bg-rose-500",
  R: "bg-orange-400",
  S: "bg-red-400",
  T: "bg-yellow-400",
  U: "bg-lime-400",
  V: "bg-emerald-400",
  W: "bg-teal-400",
  X: "bg-cyan-400",
  Y: "bg-sky-400",
  Z: "bg-blue-400",
};

export const hasCustomAvatar = (user) =>
  Boolean(user?.avatar?.url && user.avatar.public_id !== "default");

export const getAvatarLetter = (user) =>
  user?.name?.charAt(0)?.toUpperCase() || "U";

export const getAvatarColorClass = (user) => {
  const letter = getAvatarLetter(user);
  return colorMap[letter] || "bg-orange-400";
};
