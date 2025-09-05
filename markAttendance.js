const { chromium } = require('playwright');
const fs = require('fs');

async function getStudentNames() {
    const browser = await chromium.launch(); // Headless by default
    const context = await browser.newContext({ storageState: 'auth.json' });
    const page = await context.newPage();

    try {
        await page.goto('https://cydeoanalytics.com/attendance/class?size=20', { waitUntil: 'domcontentloaded' });
        
        await page.locator('//table/tbody[.//span]//tr[1]/td[2]/span').waitFor({ timeout: 30000 });

        const namesLocator = page.locator('//table/tbody[.//span]//td[2]/span');
        const count = await namesLocator.count();
        const names = [];

        for (let i = 0; i < count; i++) {
            const name = await namesLocator.nth(i).textContent();
            names.push(name.trim());
        }

        await browser.close();
        return names;
    } catch (err) {
        console.error('❌ Failed to load student names:', err.message);
        await browser.close();
        return [];
    }
}

async function markAttendance(selectedNames) {
    let browser;
    try {
        browser = await chromium.launch(); // Headless by default
        const context = await browser.newContext({ storageState: 'auth.json' });
        const page = await context.newPage();

        await page.goto('https://cydeoanalytics.com/attendance/class?size=20', { waitUntil: 'domcontentloaded' });
        
        await page.locator('//table/tbody[.//span]//tr[1]/td[2]/span').waitFor({ timeout: 30000 });

        const rowsLocator = page.locator('//table/tbody[.//span]/tr');
        const rowCount = await rowsLocator.count();
        console.log(`Found ${rowCount} student rows. Processing...`);
        const log = [];
        let studentsUpdated = 0;

        for (let i = 0; i < rowCount; i++) {
            const row = rowsLocator.nth(i);
            const nameSpan = row.locator('td:nth-child(2) > span');
            const name = await nameSpan.textContent();
            
            if (selectedNames.includes(name.trim())) {
                console.log(`Processing "${name.trim()}"...`);
                let updated = false;
                
                const dropdownButtons = row.locator('button.status-icon');
                const buttonCount = await dropdownButtons.count();

                for (let j = 0; j < buttonCount; j++) {
                    const button = dropdownButtons.nth(j);
                    const currentStatus = await button.textContent();

                    if (currentStatus.trim() !== '4' && currentStatus.trim() !== '2') {
                        await button.click();
                        await page.locator('div.dropdown-menu.show a:has-text("4")').click();
                        updated = true;
                    }
                }

                if(updated) {
                    studentsUpdated++;
                    log.push(`[${new Date().toISOString()}] Updated attendance for "${name.trim()}"`);
                    console.log(`  -> Marked all as "4".`);
                } else {
                    console.log(`  -> All attendance already marked as "4".`);
                }
            }
        }

        if (log.length > 0) {
            fs.writeFileSync('attendance-log.txt', log.join('\n') + '\n', { flag: 'a' });
            console.log(`✅ Attendance marking complete. Updated ${studentsUpdated} students.`);
        } else {
            console.log('✅ No students needed an attendance update.');
        }

    } catch (err) {
        console.error('❌ Failed to mark attendance:', err);
    } finally {
        if (browser) {
            await browser.close();
        }
    }
}

module.exports = { markAttendance, getStudentNames };

