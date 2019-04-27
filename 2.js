const fs = require('fs')
const path = require('path')
const rp = require('request-promise-native');
let urls = require('./.data/test.json')

const sleep = timeout => new Promise(resolve => {
    setTimeout(resolve, timeout)
})




;(async function(){
    // urls 去重
    let tmpobj = {}
    // urls = Object.keys(urls).reduce((pre,key,index)=>{
    //     let arr = urls[key].reduce((pre,cur)=>{
    //         let url = cur[0]
    //         let url2 = cur[1]
    //         if(url == null){
    //             return pre
    //         }
    //         if(url.indexOf('?')<0){
    //             return pre
    //         }
    //         if(url2 == ''){
    //             return pre
    //         }
    //         if(tmpobj[url]){
    //             return pre
    //         }
    //         tmpobj[url] = true
    //         pre.push(cur)
    //         return pre
    //     },[])
        
    //     pre[key] = arr
    //     return pre
    // },{})
    urls = Object.keys(urls).reduce((pre,key,index)=>{
        let arr = urls[key].reduce((pre,cur)=>{
            let url = cur[0]
            let url2 = cur[1]
            if(url == null){
                return pre
            }
            if(url.indexOf('?')<0){
                return pre
            }
            if(url2 == ''){
                return pre
            }
            if(tmpobj[url]){
                return pre
            }
            tmpobj[url] = true
            pre.push(cur)
            return pre
        },[])
        
        pre.push(...arr)
        return pre
    },[])
    // fs.writeFileSync(path.resolve(__dirname,'.data/test.format.json'),JSON.stringify(urls))
    fs.writeFileSync(path.resolve(__dirname,'.data/test.format.arr.json'),JSON.stringify(urls))

    // urls = ["item.php?n=Assassin%27s+Garb","item.php?n=Courthouse+Bust","item.php?n=Courthouse+Armchair","item.php?n=Scriptorium+Map","item.php?n=Time-Lost+Relic","item.php?n=Cobalt+Jewel"]

    let index = 0
    let maxTryTime = 3
    let curTryTime = 0
    let errorUrlarr = []
    const next = async function(rindex){
        if(rindex){
            index = rindex
        }
        if(urls[index] == undefined){
            console.log('--执行完毕--')
            return '--执行完毕--'
        }
        
        // let cururl = urls[index]
        let cururl = urls[index][0]
        let url = 'http://poedb.tw/' + cururl
        console.log(`开始获取数据,共:${urls.length},当前:${index}地址:${url}`)
        let res = await rp(url)
        .then(function (htmlString) {
            return htmlString
        })
        .catch(function (err) {
            return false
        });
        
        if(res == false){
            console.log('获取失败,记录错误地址')
            index ++
            errorUrlarr.push(cururl)
            fs.writeFileSync(path.resolve(__dirname,'.html/error.json'),JSON.stringify(errorUrlarr))
            return await next()
        }

        console.log('获取成功写入数据')
        fs.writeFileSync(path.resolve(__dirname,'.html/'+cururl.split('=')[1]+'.html'),JSON.stringify(res))

        
        index ++

        await next()
    }
    next()
    // next(0)
    // next(1)
    // next(2)
    // next(3)
    // next(4)
    // next(5)
    // next(6)
    // next(7)
    // next(8)
    // next(9)
})();

