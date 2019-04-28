const fs = require('fs')
const path = require('path')
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const filePath = path.resolve('./\.html')
fs.readdir(filePath, (err, data) => {
  if (err) throw err;

  data.forEach((fileName,index) => {
    if(index>10){return}
    console.log(`---- ${fileName} ----`)
    let str = fs.readFileSync(`${filePath}/${fileName}`)
    str = String(str)
    const dom = new JSDOM(str);

    console.log(dom.window.document.querySelector('table').textContent);
  });
  
});