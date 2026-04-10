export type ProcessorFunction = (value: string) => string;

export const processorInteger: ProcessorFunction = (
  value: string | undefined | null
): string => {
  if (!value) return "";
  return value.replace(/[^0-9]/g, "");
};

export const processorPositiveNumber = (
  value: string | undefined | null,
  allowSpace?: boolean
): string => {
  if (!value) return "";
  const expression = allowSpace ? /[^\d. ]/g : /[^\d.]/g;
  const onlyDigitsAndDots = value.replace(expression, "");
  const firstDotIndex = onlyDigitsAndDots.indexOf(".");

  // Note: Workaround for Browsers that lack support for Lookbehind
  // .replace(/(?<=\d*\.\d*)\./g, "")
  return onlyDigitsAndDots
    .split("")
    .filter(
      (char, index) => char !== "." || (char === "." && index === firstDotIndex)
    )
    .join("");
};
