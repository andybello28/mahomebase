const fs = require("fs");
const csvParser = require("csv-parser");

async function parseCSVToMap(csvPath) {
  return new Promise((resolve, reject) => {
    const lookup = new Map();

    fs.createReadStream(csvPath)
      .pipe(csvParser())
      .on("data", (row) => {
        const key = `${row.player_display_name
          ?.toLowerCase()
          .trim()}|${row.position?.trim()}`;
        lookup.set(key, row);
      })
      .on("end", () => resolve(lookup))
      .on("error", reject);
  });
}

module.exports = parseCSVToMap;
