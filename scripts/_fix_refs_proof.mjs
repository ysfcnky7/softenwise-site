import fs from "fs";

let src = fs.readFileSync("js/locales.js", "utf8");
src = src
  .replaceAll(
    '"home.refs.proof": "Dest Clinic · Kaleiçi Yat Limanı · Point Croissant · Sharingo"',
    '"home.refs.proof": "Kaleiçi Yat Limanı · Dest Clinic · Point Croissant · Sharingo"'
  )
  .replaceAll(
    '"home.refs.proof": "Dest Clinic · Kaleiçi Yacht Marina · Point Croissant · Sharingo"',
    '"home.refs.proof": "Kaleiçi Yacht Marina · Dest Clinic · Point Croissant · Sharingo"'
  );
fs.writeFileSync("js/locales.js", src);

let index = fs.readFileSync("index.html", "utf8");
index = index.replace(
  "Dest Clinic · Kaleiçi Yat Limanı · Point Croissant · Sharingo",
  "Kaleiçi Yat Limanı · Dest Clinic · Point Croissant · Sharingo"
);
fs.writeFileSync("index.html", index);
console.log("refs.proof Kaleiçi first");
