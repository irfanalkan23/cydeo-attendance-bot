// login.js
const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
    const browser = await chromium.launch({ headless: false });
    const context = await browser.newContext();
    const page = await context.newPage();

    await page.goto('https://cydeoanalytics.com/login');

    console.log('⏳ Please log in manually...');
    await page.waitForTimeout(30000); // You can adjust this timeout

    // Save session
    await context.storageState({ path: 'auth.json' });
    console.log('✅ Session saved to auth.json');

    await browser.close();
})();