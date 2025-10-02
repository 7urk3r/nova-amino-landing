const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  // Listen for console messages
  page.on('console', msg => console.log('CONSOLE:', msg.type(), msg.text()));
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message));
  
  await page.goto('http://localhost:5173');
  await page.waitForTimeout(3000);
  
  // Check if TailwindCSS classes are being applied
  const hasClasses = await page.evaluate(() => {
    const element = document.querySelector('.bg-white');
    if (element) {
      const styles = window.getComputedStyle(element);
      return {
        backgroundColor: styles.backgroundColor,
        hasElement: true
      };
    }
    return { hasElement: false };
  });
  
  console.log('TailwindCSS class check:', hasClasses);
  
  await browser.close();
})();