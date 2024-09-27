importScripts("excel.js");
importScripts("buffer.js");

const formatISODate = (isoDate, options) => {
  if (!isoDate) return "";
  if (!options) options = {};

  const dt = new Date(isoDate);
  const year = new Intl.DateTimeFormat("en", { year: "numeric" }).format(dt);
  const month = new Intl.DateTimeFormat("en", { month: "short" }).format(dt);
  const day = new Intl.DateTimeFormat("en", { day: "2-digit" }).format(dt);
  const minute = dt.getMinutes();
  const hour = dt.getHours();
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const hourStr =
    hour === 0 ? "12" : hour > 12 ? String(hour - 12) : String(hour);

  const minuteStr = minute < 10 ? `0${minute}` : String(minute);
  const time = `${hourStr}:${minuteStr} ${hour > 11 ? "PM" : "AM"}`;
  const dayName = days[dt.getDay()];

  if (options.withDayName) {
    return `${dayName.toUpperCase()}, ${month.toUpperCase()} ${day}, ${year} ${time}`;
  }

  if (options.dateOnly) {
    return `${month.toUpperCase()} ${day}, ${year}`;
  }

  return `${month.toUpperCase()} ${day}, ${year} ${time}`;
};

const { Buffer } = self.buffer;

self.onmessage = async (e) => {
  const [rows, columns] = e.data;
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("INFIRMARY APE REPORT");

  sheet.columns = columns.map((c) => {
    return {
      key: c.field,
      header: c.label,
      width: 50,
    };
  });

  const typesToNumFmtsMap = {
    text: "@",
    decimal: "0.00",
    integer: "0",
  };

  // APPLY COLUMN STYLES BASED ON COLUMN TYPE
  sheet.columns.forEach((c, idx) => {
    sheet.getColumn(idx + 1).numFmt = columns[idx].type
      ? typesToNumFmtsMap[columns[idx].type] || typesToNumFmtsMap.text
      : "@";

    sheet.getColumn(idx + 1).alignment = {
      wrapText: true,
      horizontal: columns[idx].align || "left",
    };

    //   sheet.getColumn(idx + 1).border = {
    //     top: borderStyle,
    //     left: borderStyle,
    //     bottom: borderStyle,
    //     right: borderStyle,
    //   };
  });

  // COLUMN HEADER STYLE
  sheet.getRow(1).font = { bold: true };

  sheet.getRow(1).alignment = {
    vertical: "middle",
    horizontal: "center",
  };

  for (const row of rows) {
    sheet.addRow(
      columns.reduce((acc, c) => {
        acc[c.field] = c.isISODate ? formatISODate(row[c.field]) : row[c.field];
        return acc;
      }, {})
    );
  }

  const fileBuffer = await workbook.xlsx.writeBuffer();
  const fileBase64 = Buffer.from(fileBuffer).toString("base64");
  postMessage(fileBase64);
};
