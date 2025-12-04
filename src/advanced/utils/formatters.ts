export const formatPrice = (price: number, type: "kr" | "en" = "kr") => {
  const formatters = {
    kr: `${price.toLocaleString()}원`,
    en: `₩${price.toLocaleString()}`,
  };

  return formatters[type];
};
