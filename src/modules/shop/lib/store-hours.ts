import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

const LAGOS = "Africa/Lagos";

function parseTimeToToday(timeString: string) {
  const [time, modifier] = timeString.split(" ");
  if (!time || !modifier) return null;

  let [hours, minutes] = time.split(":").map(Number);
  if (Number.isNaN(hours) || Number.isNaN(minutes)) return null;

  if (modifier.toLowerCase() === "pm" && hours !== 12) hours += 12;
  if (modifier.toLowerCase() === "am" && hours === 12) hours = 0;

  return dayjs()
    .tz(LAGOS)
    .set("hour", hours)
    .set("minute", minutes)
    .set("second", 0)
    .set("millisecond", 0);
}

/** Whether the kitchen is open right now (Lagos time). */
export function isStoreOpenNow(
  openingTime?: string | null,
  closingTime?: string | null
): boolean {
  if (!openingTime || !closingTime) return false;

  const opening = parseTimeToToday(openingTime);
  const closing = parseTimeToToday(closingTime);
  if (!opening || !closing) return false;

  const now = dayjs().tz(LAGOS);
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
