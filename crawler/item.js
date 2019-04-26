const fs = require('fs')
const path = require('path')

const puppeteer = require('puppeteer-core')
const sleep = timeout => new Promise(resolve=>{
    setTimeout(resolve,timeout)
})
// const sleep = timeout => new Promise(resolve=>{
//     setTimeout(resolve,timeout)
// })




;(async () => {
    // const pageCrawler = require('../crawler/page')
    let url = 'http://poedb.tw/item.php?cn=Shield'

    // const browser = await puppeteer.launch({
    //   // executablePath:'"C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe"',
    //   executablePath:'/mnt/c/Program Files (x86)/Google/Chrome/Application/chrome.exe',
    //   args:['--no-sandbox'],
    //   dumpio:false
    // });

    const browserOS = await puppeteer.launch({
      headless:true,
      executablePath:'/mnt/c/Program Files (x86)/Google/Chrome/Application/chrome.exe',
      args: [
      '--disable-gpu',
      '--disable-dev-shm-usage',
      '--disable-setuid-sandbox',
      '--no-first-run',
      '--no-sandbox',
      '--no-zygote',
      // '--single-process'
    ]});
    const browserWSEndpoint = await browserOS.wsEndpoint();

    const browser = await puppeteer.connect({browserWSEndpoint});
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
      // return document.body.innerHTML
      // return $('table').html()
      // let table = $('table')
      let item = $('[data-hasqtip]')
      let arrlinks = []
      item.each(function(i,o){
        arrlinks.push($(o).attr('href'))
      })
      return arrlinks
    });
    console.log('result')
    console.log(result)

    result.reduce(()=>{
      
    },[])

    result.forEach(async (val,index)=>{
      // await sleep(1000)
      // if(index>10){return}
      if(val && typeof val == 'string' && val.indexOf('?n=')>-1){
        let url = 'http://poedb.tw/' + val
        let browser = await puppeteer.connect({browserWSEndpoint});
        let page = await browser.newPage();
        await page.goto(url, {
            waitUntil: 'networkidle2',
        });
        const result = await page.evaluate(() => {
          return $('.table-striped').html() || ''
        },function(){
          return ''
        }) || ''
        console.log(index)
        await page.close();
        let filename = val.replace('item.php?','') + '.txt'
        fs.writeFileSync(path.resolve(__dirname,'../.data/'+ filename),result)
      }
    })



    await page.close();
    
})();