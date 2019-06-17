const ballTypeInfo = {
  'step': {
    id: 'ball_step',
    classname: 'step init',
    invite: {},
    run: null,
    title: '微信运动',
    type: 'step',
    animationData: '',
  },
  'sign': {
    id: 'ball_sign',
    classname: 'sign init',
    invite: {},
    run: null,
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
  }
}

const ballList = []

function ballPush (type, obj) {
  const result = JSON.parse(JSON.stringify(ballTypeInfo))
  const ball = result[type]
  for (let key in obj) {
    ball[key] = obj[key]
  }
  console.log(ball)
  if (obj.show) {
    ballList.push(ball)
  }
  return
}

Object.keys(ballType).forEach((item => {
  ballPush(item, ballType[item])
}))
console.log('-------', ballList)
// const nextBall = ballList.filter(res => res.show)