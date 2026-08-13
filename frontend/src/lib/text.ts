// format currency, don't include cents
export const formatCurrency = (
  amount: number | string,
  currency: string = "USD"
) => {
  if (typeof amount === "string") {
    amount = parseFloat(amount);
  }
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
};
