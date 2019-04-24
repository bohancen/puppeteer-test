const rp = require('request-promist-native')

async function request(url){
    const res = await rp(url)
    return res
}