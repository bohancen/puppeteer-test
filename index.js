const express = require('express')
const puppeteer = require('puppeteer-core')
const Tesseract = require('tesseract.js')

// const path = require('path')
const port = 444

const app = express()

app.get('/render',(req,res)=>{
  let url = req.query.url || ''
  if(url == ''){
    res.send('none')
    return 
  }
  


  ;(async () => {
    const browser = await puppeteer.launch({executablePath:'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe'});
    // linux centos 手动下载chrome 下载地址
    // https://www.cnblogs.com/sxdcgaq8080/p/7517357.html
    // const browser = await puppeteer.launch({executablePath:'/usr/bin/google-chrome-stable',headless:true,args:['--no-sandbox','--disable-setuid-sandbox']})
    const page = await browser.newPage();
    await page.goto(url);
  
    // Get the "viewport" of the page, as reported by the page.
    const clip = await page.evaluate(() => {
      $('.strongbox').html(
        $('.strongbox').html().replace('万','')
      )
      return {
        y: $('.strongbox').offset().top,
        x: $('.strongbox').offset().left,
        width: $('.strongbox').width(),
        height: $('.strongbox').height(),
      };
    });
    console.log(clip)
    let myImage = await page.screenshot({type:'jpeg',path: 'example.png',clip});

    Tesseract.recognize(myImage)
    .then(function(result){
      console.log(Object.keys(result))
      console.log(result.text)
      res.send(result.text)
    })
  
    await browser.close();
  })();

})


app.listen(port,()=>{
  console.log('run '+port)
})
