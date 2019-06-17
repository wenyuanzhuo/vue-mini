const randomProb = (prob) => {
    return prob * Math.random()
  }
const randomCount = (count, min, max) => {
  
    let ranC
    if (Math.random() <= 0.5) {
      const prob = randomProb(1 - min)
      ranC = (1 - prob) * count
    } else {
      const prob = randomProb(max - 1)
      ranC = (1 + prob) * count
    }
    return Math.floor(ranC)
}

for (let i = 0; i < 2000; i++) {
    const res = randomCount(1000, 0.5, 1.5)
    if (res > 1500 || res < 500) {
        console.log('fial')
    }
}