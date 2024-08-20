export default function convertTimestamp(timestamp) {
  if (!timestamp) {
    return null;
  }
  const date = new Date(timestamp * 1000);
  const now = new Date();

  const secondsAgo = Math.floor((now.getTime() - date.getTime()) / 1000);

  const minutesAgo = Math.floor(secondsAgo / 60);

  const hoursAgo = Math.floor(minutesAgo / 60);
  const hours = hoursAgo % 24;
  const daysAgo = Math.floor(hoursAgo / 24);
  const days = daysAgo % 365;
  const yearsAgo = Math.floor(daysAgo / 365);

  const options = {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    timeZone: "UTC",
  };
  const formattedDate = new Intl.DateTimeFormat("en-US", options).format(date);

  const timeElapsed = [];
  if (yearsAgo) timeElapsed.push(`${yearsAgo} year${yearsAgo > 1 ? "s" : ""}`);
  if (days) timeElapsed.push(`${days} day${days > 1 ? "s" : ""}`);
  if (hours) timeElapsed.push(`${hours} hour${hours > 1 ? "s" : ""}`);
  if (!yearsAgo && !days && minutesAgo)
    timeElapsed.push(`${minutesAgo} minute${minutesAgo > 1 ? "s" : ""}`);
  if (!timeElapsed.length)
    timeElapsed.push(`${secondsAgo} second${secondsAgo > 1 ? "s" : ""}`);

  return `${formattedDate} (UTC) (${timeElapsed.join(", ")} ago)`;
}
