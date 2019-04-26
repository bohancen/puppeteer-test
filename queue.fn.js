// 模拟队列
async function queueFn(PromiseFns){
  let len = PromiseFns.length
  let index = 0
  let next=async()=>{
    console.log(`执行中...${index}`)
    let bool = await PromiseFns[index]()
    if(bool){
      console.log('执行成功next')
      index ++
      if(index >len-1){
        return '--执行完毕--'
      }
      return await next()
    }else{
      console.log('执行失败restart')
      return await next()
    }
  }
  return await next()
}

// 测试Promise函数
let testPromiseFn = ()=> new Promise((res,rej)=>{
  // time = 1000
  setTimeout(function(){
    // 55开机率 真假
    res(Math.random()*10>5)
  },1000)
})

// async函数模拟运行

;(async()=>{
  let arrFn = new Array(10).fill(testPromiseFn)
  let res = await queueFn(arrFn)
  console.log(res)
})();
