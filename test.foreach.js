let arr = new Array(10).fill(1)

let dely = val=> new Promise((res,rej)=>{
  // time = 1000
  setTimeout(function(){
    res(Math.random()*10>5)
  },1000)
})

let pfn = ()=>{
  return new Promise((resolve,reject)=>{
    setTimeout(()=>{
      return resolve(1)
    },500)
  })
}

async function runPfn(){
  let r = await pfn()
  console.log(r)
}

// runPfn()
// 模拟队列
async function addTeam(fns){
  let len = fns.length
  let index = 0
  let next=async()=>{
    console.log(`执行中...${index}`)
    let bool = await fns[index]()
    if(bool){
      console.log('执行成功next')
      index ++
      if(index >len-1){
        return 'over'
      }
      return await next()
    }else{
      console.log('执行失败restart')
      return await next()
    }
  }
  return await next()
}

async function asy(){
  let res = await addTeam([dely,dely])
  console.log(res)
}
asy()

// console.log(res)

// arr.forEach(async (v,i)=>{
//   await dely(3000)
//   console.log(i)
// })

// function team(){

// }