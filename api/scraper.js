import puppeteer from "puppeteer";

export default async function handler(req, res) {
  const { url } = req.query;

  // ✅ Prueba mínima: si no hay url, devolvemos mensaje de prueba
  if (!url) {
    return res.status(200).json({
      message: "Funciona el endpoint",
      ejemplo: "Agrega ?url=https://librefutboltv.su/tyc-sports/ para probar Puppeteer"
    });
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
