import fs from "fs";

let html = fs.readFileSync("urunler.html", "utf8");
const clinicStart = html.indexOf('<article class="product-detail" id="softenwise-clinic"');
const limanStart = html.indexOf(
  '<article class="product-detail product-detail--alt" id="softenwise-liman"'
);
const otominiStart = html.indexOf('<article class="product-detail" id="otomini"');
if (clinicStart < 0 || limanStart < 0 || otominiStart < 0) {
  throw new Error("markers missing");
}
if (!(clinicStart < limanStart && limanStart < otominiStart)) {
  console.log("already ordered or unexpected", { clinicStart, limanStart, otominiStart });
  process.exit(0);
}
const clinic = html.slice(clinicStart, limanStart);
let liman = html.slice(limanStart, otominiStart);
liman = liman.replace(
  'class="product-detail product-detail--alt" id="softenwise-liman"',
  'class="product-detail" id="softenwise-liman"'
);
const clinicAlt = clinic.replace(
  'class="product-detail" id="softenwise-clinic"',
  'class="product-detail product-detail--alt" id="softenwise-clinic"'
);
html = html.slice(0, clinicStart) + liman + clinicAlt + html.slice(otominiStart);

html = html
  .replaceAll(
    "Clinic, SoftenWise Liman, Otomini, SoftenWise Maps ve BLOC",
    "SoftenWise Liman, Clinic, Otomini, SoftenWise Maps ve BLOC"
  )
  .replace(
    'content="Clinic, SoftenWise Liman, liman yazılımı',
    'content="SoftenWise Liman, Clinic, liman yazılımı'
  )
  .replace(
    "<title>Ürün Ekosistemimiz | SoftenWise Clinic, Liman, Otomini, SoftenWise Maps, BLOC</title>",
    "<title>Ürün Ekosistemimiz | SoftenWise Liman, Clinic, Otomini, SoftenWise Maps, BLOC</title>"
  );

fs.writeFileSync("urunler.html", html);
console.log("swapped detail order + meta Liman first");
