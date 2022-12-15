import puppeteer, { Browser, ElementHandle, Page } from "puppeteer";

describe("App.js", () => {
  let browser: Browser;
  let page: Page;

  function delay(time: number | undefined) {
    return new Promise(function(resolve) { 
        setTimeout(resolve, time)
    });
 }
  // const getProperty = async (element: any, property: string): Promise<string> => {
  //   return await (await element.getProperty(property)).jsonValue();
  // }

  beforeAll(async () => {
    browser = await puppeteer.launch({
      // headless: false
    });
    page = await browser.newPage();
  });

  it('loads popular tv shows', async () => {
    
    await page.goto("http://localhost:3000");
    await page.waitForSelector('.tst-tvshow')
    const popularTVShows = await page.$$('.tst-tvshow');
    //Expect 20 tvshows to be loaded
    expect(popularTVShows.length).toBe(20)

    //Expect Search to be current page
    let navBarButtons = await page.$$('.tst-navButton')
    expect(navBarButtons.length).toBe(2)
    expect(await (await navBarButtons[0].evaluateHandle(el => el.ariaCurrent)).jsonValue()).toBe('page')

    //Expect login modal to appear when not logged in and clicking on my tracked shows
    await navBarButtons[1].click()
    await page.waitForSelector('.tst-loginModal')

    //Login
    await page.focus('#email-address')
    await page.keyboard.type('youpje@gmail.comm')
    await page.keyboard.press('Tab')
    await page.keyboard.type('test123')
    await page.keyboard.press('Enter')

    // Expect toast because wrong login info, close toast
    await page.waitForSelector('div > div.Toastify > div')
    await page.waitForSelector('.Toastify__close-button', {hidden: false, visible: true})
    await delay(1000)
    await page.click('.Toastify__close-button')
    await page.waitForSelector('div > div.Toastify > div', {hidden:true})

    //Re-login with correct info
    await page.focus('#email-address')
    await page.keyboard.press('Backspace')
    await page.keyboard.press('Enter')
    
    // Expect to be logged in
    await page.waitForSelector('.tst-loginModal', {hidden:true})
    expect(await (await navBarButtons[1].evaluateHandle(el => el.ariaCurrent)).jsonValue()).toBe('page')
    const element = await page.waitForSelector('.tst-userButton')
    await element?.click()
    await page.waitForSelector('.tst-logged-in',{visible: true, timeout: 10000})
    
    // Test adding a show to tracked list
    navBarButtons = await page.$$('.tst-navButton')
    await navBarButtons[0].click()
    await page.waitForSelector('.tst-tvshow')
    const tvShows = await page.$$('.tst-tvshow');
    await tvShows[0].click()
    await page.waitForSelector('.tst-details-modal')
    await page.click('.tst-add-button')

    // Check if the show is in tracked list

    // should have remove button on details view

    // Go back to search and that show should not have a button, in the details view as well

    // Test removing the show from tracked list

  },15000);

  afterAll(() => browser.close());
});