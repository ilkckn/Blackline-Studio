// "Nursel Bal" → "Nursel B."  (herkese açık yerlerde soyadı kısaltılır)
export const shortName = (name = "") => {
  const parts = name.trim().split(/\s+/).filter(Boolean);

  if (parts.length === 0) return "Anonymous";
  if (parts.length === 1) return parts[0];

  return `${parts[0]} ${parts[parts.length - 1][0]}.`;
};