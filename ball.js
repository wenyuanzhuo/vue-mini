const ballTypeInfo = {
  'step': {
    id: 'ball_step',
    classname: 'step init',
    invite: { step: { run: 11 } },
    run: 0,
    title: '微信运动',
    type: 'step',
    animationData: '',
  },
  'sign': {
    id: 'ball_sign',
    classname: 'sign init',
    invite: { step: { run: { addr: 'test'} } },
    run: 0,
    title: '每日签到',
    type: 'sign',
    animationData: ''
  }
}

const ballType = {
  'step': {
    run: 1000,
    show: true
  },
  'sign': {
    run: 2000,
    show: true
  },
  'task': {
    show: true,
    data: []
  }
}

const ballList = []

function ballPush (type, obj) {
  if (!obj.show) {
    return
  }
  const result = JSON.parse(JSON.stringify(ballTypeInfo))
  const ball = result[type]
  
  if (obj.data && obj.data.constructor === Array) {
    obj.forEach(tmp => {
      for (let key in tmp) {
        ball[key] = tmp[key]
      }
      ballList.push(ball)
    })
    return
  }

  for (let key in obj) {
    ball[key] = obj[key]
  }
  ballList.push(ball)
  return
}

// Object.keys(ballType).forEach((item => {
//   ballPush(item, ballType[item])
// }))

function deepCopy(obj) {
  const resObj = Object.prototype.toString.call(obj) === '[object Aarry]' ? [] : {}
  if (typeof obj === 'object') {
    for(key in obj) {
      if (typeof obj[key] === 'object') {
        resObj[key] = deepCopy(obj[key])
      } else {
        resObj[key] = obj[key]
      }
    }
  }
  return resObj
}

// const ballNext = deepCopy(ballTypeInfo)
// ballTypeInfo.step.run = 1000
// console.log(ballNext)

let res = 0, deep = {}
function deepLength(obj, i = 0) {
  if (typeof obj === 'object') {
    for(key in obj) {
      if (typeof obj[key] === 'object') {
        deepLength(obj[key], i + 1 )
      } else {
        if( i + 1 > res) {
          deep = {
            num: i + 1,
            value: { [key]: obj[key]},
          }
        }
        res = i + 1 > res ? i + 1 : res;
      }
    }

  }
}
const ballNext = deepLength(ballTypeInfo)
console.log('--', deep)
// console.log('===', ballNext)
