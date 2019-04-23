const fs = require('fs')
const path = require('path')


const express = require('express')
const puppeteer = require('puppeteer-core')
const port = 2019

const app = express()

app.get('/',(req,res)=>{
  let url = req.query.url || ''
  if(url == ''){
    res.send('none')
    return 
  }
  console.log(url)
  


  ;(async () => {
    const browser = await puppeteer.launch({executablePath:'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe'});
    // linux centos 手动下载chrome 下载地址
    // https://www.cnblogs.com/sxdcgaq8080/p/7517357.html
    // const browser = await puppeteer.launch({executablePath:'/usr/bin/google-chrome-stable',headless:true,args:['--no-sandbox','--disable-setuid-sandbox']})
    const page = await browser.newPage();
    await page.goto(url);
    const tablehtml = await page.evaluate(() => {
      return $('table').html()
    });
    // console.log('tablehtml')
    res.send(tablehtml)
    fs.writeFileSync(path.resolve(__dirname,'./table.html'),tablehtml);
  
    await browser.close();
  })();

})


app.listen(port,()=>{
  console.log('run '+port)
})
