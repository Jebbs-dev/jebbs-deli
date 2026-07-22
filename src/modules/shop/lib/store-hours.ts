import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

const LAGOS = "Africa/Lagos";

/** Accept "9:00", "09:00", "21:00", "9:00 AM", "9:00 pm". Bare H:mm is 24-hour. */
function parseTimeToToday(timeString: string) {
  const cleaned = timeString.trim();
  const match = cleaned.match(/^(\d{1,2}):(\d{2})(?:\s*(am|pm))?$/i);
  if (!match) return null;

  let hours = Number(match[1]);
  const minutes = Number(match[2]);
  const modifier = match[3]?.toLowerCase();

  if (modifier === "pm" && hours !== 12) hours += 12;
  if (modifier === "am" && hours === 12) hours = 0;
  // no modifier → treat as 24-hour (9:00 = 9 AM, 21:00 = 9 PM)

  if (hours > 23 || minutes > 59) return null;

  return dayjs()
    .tz(LAGOS)
    .hour(hours)
    .minute(minutes)
    .second(0)
    .millisecond(0);
}

/** Format store hour strings for display (e.g. "9:00" → "9:00 AM"). */
export function formatStoreTime(timeString?: string | null): string {
  if (!timeString) return "—";
  const t = parseTimeToToday(timeString);
  return t ? t.format("h:mm A") : timeString;
}

/** Whether the kitchen is open right now (Lagos time). Supports overnight windows. */
export function isStoreOpenNow(
  openingTime?: string | null,
  closingTime?: string | null
): boolean {
  if (!openingTime || !closingTime) return false;

  const opening = parseTimeToToday(openingTime);
  const closing = parseTimeToToday(closingTime);
  if (!opening || !closing) return false;

  const now = dayjs().tz(LAGOS);

  // Overnight window (e.g. 22:00–02:00)
  if (closing.isBefore(opening) || closing.isSame(opening)) {
    return now.isAfter(opening) || now.isBefore(closing);
  }

  return now.isAfter(opening) && now.isBefore(closing);
}

/** Upper bound minutes from strings like "26 - 26 min" or "19 - 29 min". */
export function parsePrepMaxMinutes(
  preparationTime?: string | null
): number | null {
  if (!preparationTime) return null;
  const matches = preparationTime.match(/\d+/g);
  if (!matches?.length) return null;
  return Math.max(...matches.map(Number));
}
