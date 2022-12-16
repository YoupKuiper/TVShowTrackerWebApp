import puppeteer, { Browser, ElementHandle, Page } from "puppeteer";

describe("App.js", () => {
  let browser: Browser;
  let page: Page;

  const delay = (time: number | undefined) => {
    return new Promise(function (resolve) {
      setTimeout(resolve, time)
    });
  }

  const expectToastAndCloseIt = async (page: Page, toastText?: string) => {
    await page.waitForSelector('div > div.Toastify > div')
    const toast = await page.$('div > div.Toastify > div')
    let value = await page.evaluate(el => el?.textContent, toast)
    if(toastText){
      expect(value).toBe(toastText)
    }
    await page.waitForSelector('.Toastify__close-button', { hidden: false, visible: true })
    await page.click('.Toastify__close-button')
    await page.click('.Toastify__close-button')
    await page.waitForSelector('div > div.Toastify > div', { hidden: true, visible: false })
  }

  beforeAll(async () => {
    browser = await puppeteer.launch({
      args: ['--start-maximized'],
      // headless: false,
      defaultViewport: {
        width: 1920,
        height: 1080
      }
    });
    page = await browser.newPage();
  });

  it('loads popular tv shows', async () => {

    await page.goto("http://localhost:3000");
    await page.waitForSelector('.tst-tvshow')
    let popularTVShows = await page.$$('.tst-tvshow');
    //Expect 20 tvshows to be loaded
    expect(popularTVShows.length).toBe(20)

    //Expect Search to be current page
    let navBarButtons = await page.$$('.tst-navButton')
    expect(navBarButtons.length).toBe(2)
    expect(await page.evaluate(el => el.ariaCurrent, navBarButtons[0])).toBe('page')

    //Expect login modal to appear when not logged in and clicking on my tracked shows
    await navBarButtons[1].click()
    await page.waitForSelector('.tst-loginModal')

    //Login
    await page.waitForSelector('#email-address')
    await page.focus('#email-address')
    await page.keyboard.type('youpje@gmail.comm')
    await page.keyboard.press('Tab')
    await page.keyboard.type('test123')
    await page.keyboard.press('Enter')

    // Expect toast because wrong login info, close toast
    await expectToastAndCloseIt(page, 'Email address or password incorrect')
    console.log('toast for wrong login dissapeared');

    //Re-login with correct info
    await page.waitForSelector('#email-address')
    await page.focus('#email-address')
    await page.keyboard.press('Backspace')
    await page.keyboard.press('Enter')
    console.log('trying to log in now')

    // Expect to be logged in
    await page.waitForSelector('.tst-loginModal', { hidden: true })
    expect(await page.evaluate(el => el.ariaCurrent, navBarButtons[1])).toBe('page')
    const userButton = await page.waitForSelector('.tst-userButton')
    await userButton?.click()
    await page.waitForSelector('.tst-logged-in', { visible: true, timeout: 10000 })

    // Test adding a show to tracked list
    navBarButtons = await page.$$('.tst-navButton')
    await navBarButtons[0].click()
    await page.waitForSelector('.tst-tvshow')
    let tvShows = await page.$$('.tst-tvshow');
    const tvShowsCount = tvShows.length
    let showName = await page.evaluate(el => el.textContent, tvShows[0]);
    console.log(showName)
    await tvShows[0].click()
    await page.waitForSelector('.animate-spin', { visible: true, hidden: false })
    await page.waitForSelector('.animate-spin', { visible: false, hidden: true })
    console.log('spinner came and went');
    await page.waitForSelector('.tst-modal-add-button', { visible: true, hidden: false })
    await page.click('.tst-modal-add-button')
    await page.waitForSelector('.animate-spin', { visible: true, hidden: false })
    await page.waitForSelector('.animate-spin', { visible: false, hidden: true })
    console.log('spinner came and went');
    await page.waitForSelector('.tst-modal-remove-button', { visible: true, hidden: false })

    // Close the modal
    await page.click('.tst-main-div')

    // Go back to search and that show should not have a button, in the details view as well
    await page.waitForNetworkIdle()
    const addButtons = await page.$$('.tst-add-button')
    expect(tvShowsCount - 1).toBe(addButtons.length)
    console.log('expectation succeeded');

    // Check if the show is in tracked list
    await navBarButtons[1].click()
    await navBarButtons[1].click()
    await page.waitForSelector('.tst-tvshow')
    tvShows = await page.$$('.tst-tvshow');
    console.log('found tracked shows');

    // Expect the showname in the tracked list to be the same as the show we just added
    expect(await page.evaluate(el => el.textContent, tvShows[0])).toBe(showName)
    console.log('show name of added is same as in tracked list');
    await tvShows[0].click()

    // should have remove button on details view
    await page.waitForSelector('.tst-modal-remove-button');
    console.log('found remove button in detail modal');
    await page.click('.tst-main-div')

    // Test removing the show from tracked list
    let removeButtons = await page.$$('.tst-remove-button');
    await removeButtons[0].click()
    await removeButtons[0].click()
    console.log('clicked remove button in trackedlist listview');
    await page.waitForSelector('.animate-spin', { visible: true, hidden: false })
    console.log('spinner spinning');
    await page.waitForSelector('.animate-spin', { visible: false, hidden: true })
    console.log('spinner stopped spinning');


    // Test logging out
    await page.click('.tst-userButton')
    await page.waitForSelector('.tst-sign-out-button')
    console.log('sign out button is visible');
    await page.click('.tst-sign-out-button')
    await page.waitForSelector('.tst-logged-in', { visible: false, hidden: true })

    // After logout we should be back at the search page and see 20 tv shows
    popularTVShows = []
    popularTVShows = await page.$$('.tst-tvshow');
    //Expect 20 tvshows to be loaded
    expect(popularTVShows.length).toBe(20)
    console.log('20 tv shows found');

    // Test creating an account
    await page.waitForSelector('.tst-userButton')
    await page.click('.tst-userButton')
    await page.waitForSelector('.tst-create-account')
    await page.click('.tst-create-account')
    await page.waitForSelector('.tst-create-account-modal')
    await page.waitForSelector('#email-address')
    await page.focus('#email-address')
    await page.type('#email-address', 'abc')
    await page.type('#password', 'asd')
    await page.type('#password1', 'asd')
    await page.click('.tst-create-account-button')

    // Expect a toast saying invalid email address
    await expectToastAndCloseIt(page, 'Invalid email address')
    console.log('so far so good');

    await page.waitForSelector('#email-address')
    await page.type('#email-address', '@abc.nl')
    await page.type('#password1', 'a')
    await page.click('.tst-create-account-button')
    await expectToastAndCloseIt(page, 'Passwords don\'t match')
    console.log('toast for not matching passwords dissapeared');

    await page.waitForSelector('#password1')
    await page.focus('#password1')
    console.log('focused password 1');
    await page.keyboard.press('Backspace')
    await page.keyboard.press('Enter')
    console.log('trying to create a new account');
    //Fails because account already exists
    await expectToastAndCloseIt(page, 'Account creation failed')


    // Test dark mode
    await page.waitForSelector('.dark')
    console.log('dark mode found');
    await page.waitForSelector('.toggle-dark-state')
    console.log('dark mode button found');
    await page.click('.toggle-dark-state')
    await page.click('.toggle-dark-state')
    console.log('dark mode button clicked');
    await page.waitForSelector('.dark', {visible: false, hidden: true})
    console.log('dark mode toggled');
    await page.click('.toggle-dark-state')
    await page.waitForSelector('.dark')

    await page.screenshot({path: 'screenshot.png'})
  }, 20000);

  afterAll(() => browser.close());
});