const fs = require('fs')
const path = require('path')

const puppeteer = require('puppeteer-core')
const sleep = timeout => new Promise(resolve=>{
    setTimeout(resolve,timeout)
})

;(async () => {
    let url = 'http://poedb.tw/item.php?cn=Shield'

    const browser = await puppeteer.launch({
      executablePath:'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
      args:['--no-sandbox'],
      dumpio:false
    });

    // await sleep(3000)
    
    const page = await browser.newPage();
    // await page.goto(url+tableCell04Val, {waitUntil: 'load', timeout: 0});

    await page.goto(url, {
        // waitUntil: 'load',
        waitUntil: 'networkidle2',
        // timeout: 0
    });

    // await page.waitForSelector('.more')
    // await page.click('.more')

    const result = await page.evaluate(() => {
      return document.body.innerHTML
      // return $('table').html()
    });
    console.log('result')

    // await page.screenshot({path: 'example.png'});

    // fs.writeFileSync(path.resolve(__dirname,'./table.html'),tablehtml);
  
    await browser.close();
    process.send({result})
    process.exit(0)
})();