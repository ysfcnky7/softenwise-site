const fs=require("fs");
const items=JSON.parse(fs.readFileSync("scripts/_softenwise_checklist.json","utf8"));
// print items for sira 1-12, 39-52, 59-71, 87, 114, 124-125, 130-131
const want=new Set([1,2,3,4,5,11,12,39,40,46,47,48,49,50,51,52,55,56,59,60,61,62,63,64,65,68,70,71,77,79,84,87,88,103,110,113,114,124,125,130,131]);
for (const it of items) {
  if (!want.has(it.sira)) continue;
  console.log(`S${it.sira}.${it.maddeNo}| ${it.kontrol}`);
}
