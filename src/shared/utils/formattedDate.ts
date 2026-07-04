export const formatDate = (dateString?: string) => {
  if (!dateString) return "N/A";

  return new Date(dateString).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};