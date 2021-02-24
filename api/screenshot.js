const puppeteer = require("puppeteer");

module.exports = async (req, res) => {
  const pageQuery = req.query.page;

  try {
    console.log("Trying");
    console.log("pageQuery: ", pageQuery);

    if (!pageQuery.includes("https://")) {
      res.statusCode = 404;
      res.json({
        body: "Sorry, we couldn't screenshot that page. Did you include https://?",
      });
    }

    // launch a new headless browser
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    console.log("Browser and page launched");

    // set the viewport size
    await page.setViewport({
      width: 1920,
      height: 1080,
      deviceScaleFactor: 1,
    });

    console.log("Viewport size set");

    // tell the page to visit the url
    await page.goto(pageQuery);

    // take a screenshot and save it in the screenshots directory
    const file = await page.screenshot({
      type: "png",
    });

    console.log("File done?");

    // close the browser
    await browser.close();

    console.log("Browser closed");

    res.statusCode = 200;
    res.setHeader("Content-Type", `image/png`);
    res.setHeader(
      "Cache-Control",
      `public, immutable, no-transform, s-maxage=31536000, max-age=31536000`
    );

    // return the file!
    res.end(file);
  } catch (e) {
    res.statusCode = 500;
    res.json({
      body: "Sorry, Something went wrong!",
    });
  }
};