export const getDiffDaysFromToday = (date: Date) => {
  const DIFFS = {
    FUT: { isFuture: true, label: "ERROR: Future date or time" },
    TOD: { isFuture: false, label: "Today" },
    YST: { isFuture: false, label: "Yesterday" },
    DBY: { isFuture: false, label: "Day before yesterday" },
    XDB: (x: number) => ({
      isFuture: false,
      label: `${x} days back`,
    }),
  };
  const oneDayInMs = 24 * 60 * 60 * 1000;
  const now = new Date();
  const localMidnight = new Date(
    now.getTime() -
      now.getHours() * 60 * 60 * 1000 -
      now.getMinutes() * 60 * 1000 -
      now.getSeconds() * 1000 -
      now.getMilliseconds()
  );
  const nowTime = now.getTime();
  const dateTime = date.getTime();
  const localMidnightTime = localMidnight.getTime();
  if (dateTime > nowTime) return DIFFS.FUT;
  if (dateTime <= nowTime && dateTime > localMidnightTime) return DIFFS.TOD;

  const diffTime = localMidnightTime - dateTime;
  const diffDays = Math.ceil(diffTime / oneDayInMs);
  if (diffDays <= 1) return DIFFS.YST;
  if (diffDays <= 2) return DIFFS.DBY;

  return DIFFS.XDB(diffDays);
};

export const getDateInputLocaleValue = (gmtDate: Date) => {
  const localeDate = gmtDate
    .toLocaleDateString()
    .split("/")
    .reverse()
    .join("-");
  const localeTimeArr = gmtDate.toLocaleTimeString().split(":");
  localeTimeArr.pop();
  const localeTime = localeTimeArr.join(":");
  const localeDateLabel = `${localeDate}T${localeTime}`;

  return localeDateLabel;
};