const fs = require('fs')
const path = require('path')

const puppeteer = require('puppeteer-core')
// const sleep = timeout => new Promise(resolve=>{
//     setTimeout(resolve,timeout)
// })

module.exports = async (query)=>{
  const browser = await puppeteer.launch({
    // executablePath:'"C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe"',
    executablePath:'/mnt/c/Program Files (x86)/Google/Chrome/Application/chrome.exe',
    args:['--no-sandbox'],
    dumpio:false
  });

  let url = 'http://poedb.tw/' + query
  
  const page = await browser.newPage();

  await page.goto(url, {
      waitUntil: 'networkidle2',
  });

  const result = await page.evaluate(() => {
    // return document.body.innerHTML
    return $('.table-striped').html()
    // // return $('table').html()
    // // let table = $('table')
    // let item = $('[data-hasqtip]')
    // let arrlinks = []
    // item.each(function(i,o){
    //   arrlinks.push($(o).attr('href'))
    // })
    // return arrlinks
  });
  console.log('result')

  // await page.screenshot({path: 'example.png'});
  let filename = query.replace('item.php?','') + '.txt'
  fs.writeFileSync(path.resolve(__dirname,'../data/'+ filename),result);

  await browser.close();
  return result
}

// ;(async () => {
//     let url = 'http://poedb.tw/item.php?cn=Shield'

//     const browser = await puppeteer.launch({
//       // executablePath:'"C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe"',
//       executablePath:'/mnt/c/Program Files (x86)/Google/Chrome/Application/chrome.exe',
//       args:['--no-sandbox'],
//       dumpio:false
//     });

    
//     const page = await browser.newPage();

//     await page.goto(url, {
//         waitUntil: 'networkidle2',
//     });

//     const result = await page.evaluate(() => {
//       // return document.body.innerHTML
//       // return $('table').html()
//       // let table = $('table')
//       let item = $('[data-hasqtip]')
//       let arrlinks = []
//       item.each(function(i,o){
//         arrlinks.push($(o).attr('href'))
//       })
//       return arrlinks
//     });
//     console.log('result')

//     // await page.screenshot({path: 'example.png'});

//     // fs.writeFileSync(path.resolve(__dirname,'./table.html'),tablehtml);
  
//     await browser.close();
//     process.send({result})
//     process.exit(0)
// })();