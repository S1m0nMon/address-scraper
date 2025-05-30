import fetch from "node-fetch";
import { JSDOM } from "jsdom";
import { writeFileSync } from "fs";

async function scrape(fgnRegNo, regYmd) {
  const form = new URLSearchParams({
    fgnRegNo,
    regYmd,
    authType:      "1",
    orgnCvlapplCd: "J14",
    fgnStsGb:      "1",
    applGb:        "N",
    orgnCvlapplCdList: "[J14]",
    TRAN_TYPE:     "ComSubmit"
  });

  const res = await fetch(
    "https://www.hikorea.go.kr/cvlappl/CvlapplStep2Cert.pt",
    {
      method:  "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body:    form
    }
  );
  const html = await res.text();
  const dom  = new JSDOM(html);
  const td   = dom.window.document.querySelector("td.tdData[colspan='3']");
  const address = td?.textContent.trim() || null;

  writeFileSync(
    `results/${fgnRegNo}.json`,
    JSON.stringify({ fgnRegNo, regYmd, address }, null, 2),
    "utf-8"
  );
}

const [,, fgnRegNo, regYmd] = process.argv;
scrape(fgnRegNo, regYmd).catch(err => {
  console.error(err);
  process.exit(1);
});
