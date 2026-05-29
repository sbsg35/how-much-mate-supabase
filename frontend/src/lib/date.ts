// Convert dates into human-readable relative times without date-fns.

type FormatDistanceOptions = {
  addSuffix?: boolean;
};

export const formatDistanceToNow = (
  date: Date | string,
  options: FormatDistanceOptions = {},
): string => {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  const diffMs = Date.now() - dateObj.getTime();
  const isFuture = diffMs < 0;
  const absDiffMs = Math.abs(diffMs);

  const seconds = Math.floor(absDiffMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  let label: string;

  if (seconds < 60) {
    label = seconds <= 1 ? "1 second" : `${seconds} seconds`;
  } else if (minutes < 60) {
    label = minutes === 1 ? "1 minute" : `${minutes} minutes`;
  } else if (hours < 24) {
    label = hours === 1 ? "1 hour" : `${hours} hours`;
  } else if (days < 30) {
    label = days === 1 ? "1 day" : `${days} days`;
  } else if (months < 12) {
    label = months === 1 ? "1 month" : `${months} months`;
  } else {
    label = years === 1 ? "1 year" : `${years} years`;
  }

  if (!options.addSuffix) {
    return label;
  }

  return isFuture ? `in ${label}` : `${label} ago`;
};

export const timeAgo = (date: Date | string): string => {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  const hoursDiff = (Date.now() - dateObj.getTime()) / (1000 * 60 * 60);

  if (hoursDiff < 24) {
    return "today";
  }

  return formatDistanceToNow(dateObj, { addSuffix: true });
};

export const formatDate = (date: Date | string): string => {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return dateObj.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};
