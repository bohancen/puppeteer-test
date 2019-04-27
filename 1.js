const fs = require('fs')
const path = require('path')
const puppeteer = require('puppeteer-core')
const sleep = timeout => new Promise(resolve => {
    setTimeout(resolve, timeout)
})



let arr = ["gem.php?cn=Active+Skill+Gem", "gem.php?cn=Support+Skill+Gem", "item.php?cn=Claw", "item.php?cn=Dagger", "item.php?cn=Wand", "item.php?cn=One+Hand+Sword", "item.php?cn=Thrusting+One+Hand+Sword", "item.php?cn=One+Hand+Axe", "item.php?cn=One+Hand+Mace", "item.php?cn=Sceptre", "item.php?cn=Bow", "item.php?cn=Staff", "item.php?cn=Two+Hand+Sword", "item.php?cn=Two+Hand+Axe", "item.php?cn=Two+Hand+Mace", "item.php?cn=FishingRod", "item.php?cn=Shield", "item.php?cn=Quiver", "item.php?cn=Gloves", "item.php?cn=Boots", "item.php?cn=Body+Armour", "item.php?cn=Helmet", "item.php?cn=Amulet", "item.php?cn=Ring", "item.php?cn=Belt", "item.php?cn=LifeFlask", "item.php?cn=ManaFlask", "item.php?cn=HybridFlask", "item.php?cn=UtilityFlask", "item.php?cn=UtilityFlaskCritical", "item.php?cn=StackableCurrency", "item.php?cn=MapFragment", "item.php?cn=HideoutDoodad", "item.php?cn=DivinationCard", "item.php?cn=MiscMapItem", "item.php?cn=PantheonSoul", "item.php?cn=UniqueFragment", "item.php?cn=Jewel", "item.php?cn=AbyssJewel", "item.php?cn=Chest", "item.php?cn=LabyrinthItem", "item.php?cn=LabyrinthTrinket", "item.php?cn=LabyrinthMapItem"]
let data = arr.reduce((pre,cur)=>{
    pre[cur] = []
    return pre
},{})

    ; (async () => {
        console.log('创建浏览器')
        const browserOS = await puppeteer.launch({
            headless: true,
            executablePath: 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
            args: [
                '--disable-gpu',
                '--disable-dev-shm-usage',
                '--disable-setuid-sandbox',
                '--no-first-run',
                '--no-sandbox',
                '--no-zygote',
                // '--single-process'
            ]
        });
        console.log('创建wsEndpoint')
        const browserWSEndpoint = await browserOS.wsEndpoint();
        

        let index = 0
        const next = async () => {
            console.log(`当前:${index}`)
            let url = 'http://poedb.tw/' + arr[index]
            const browser = await puppeteer.connect({ browserWSEndpoint });
            console.log('创建标签页')
            const page = await browser.newPage();
            console.log(`访问地址:${url}`)
            let isTrue = await page.goto(url, {
                waitUntil: 'networkidle2',
            }).catch(e=>{
                return false
            })
            if(isTrue == false){
                console.log('访问地址错误，重试')
                return await next()
            }
            console.log('获取页面数据')
            let result = await page.evaluate(() => {
                let item = $('[data-hasqtip]')
                let arrlinks = []
                item.each(function (i, o) {
                    arrlinks.push([
                        $(o).attr('href'),
                        $(o).text()
                    ])
                })
                return arrlinks
            });
            // result = result.filter(v=>(v&&v.indexOf('?')>-1))

            console.log('关闭标签页')
            await page.close();

            data[arr[index]] = result
            index ++
            console.log('写入数据')
            fs.writeFileSync(path.resolve(__dirname,'.data/test.json'),JSON.stringify(data))

            // if(index>2){
            //     console.log('--执行完毕--')
            //     return '--执行完毕--'
            // }
            if(arr[index] == undefined){
                console.log('--执行完毕--')
                return '--执行完毕--'
            }
            // if(index>arr.length-1){
            //     console.log('--执行完毕--')
            //     return '--执行完毕--'
            // }
            await next()
        }
        await next()
        // await next()
        // console.log(data)
        console.log('写入数据完毕')
        fs.writeFileSync(path.resolve(__dirname,'.data/test.json'),JSON.stringify(data))
    })();



