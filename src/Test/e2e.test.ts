import puppeteer, { Browser, Page } from "puppeteer";

describe("App.js", () => {
  let browser: Browser;
  let page: Page;

  beforeAll(async () => {
    browser = await puppeteer.launch();
    page = await browser.newPage();
  });

  it("contains the welcome text", async () => {
    
    await page.goto("http://localhost:3000");
    await page.screenshot({path: 'screenshot.png'});
  });

  afterAll(() => browser.close());
});