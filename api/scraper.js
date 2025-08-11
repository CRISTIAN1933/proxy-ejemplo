import puppeteer from "puppeteer";

export default async function handler(req, res) {
  const { url } = req.query;
  if (!url) {
    return res.status(400).json({ error: "Falta parámetro url" });
  }

  try {
    const browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();

    const requests = [];
    page.on("request", request => {
      requests.push(request.url());
    });

    await page.goto(url, { waitUntil: "networkidle2" });

    await browser.close();

    res.status(200).json({
      target: url,
      total: requests.length,
      requests
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
