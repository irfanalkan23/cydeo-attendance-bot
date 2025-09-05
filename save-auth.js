// save-auth.js
const { chromium } = require('playwright');

(async () => {
    const browser = await chromium.launch({ headless: false });
    const context = await browser.newContext();
    const page = await context.newPage();

    await page.goto('https://cydeoanalytics.com/login');
    console.log('🔑 Please log in manually...');

    // Wait for navigation after login
    console.log('Waiting for you to log in...');
    await page.waitForURL(url => !url.pathname.includes('login'), { timeout: 0 });
    console.log('Login detected!');

    // Save session
    await context.storageState({ path: 'auth.json' });
    console.log('✅ Session saved to auth.json');

    await browser.close();
})();