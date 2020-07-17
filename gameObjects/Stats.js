let stats = {
  power: {
    lvl: 1,
    val: 1,
    next: (lvl) => lvl + 1,
    cost: (lvl) => Math.floor(10 * Math.pow(lvl, 2.5)),
  },
  speed: {
    lvl: 1,
    val: 1,
    next: (lvl) => Math.floor((lvl * 0.1)*10)/10 + 1,
    cost: (lvl) => Math.floor(Math.pow(lvl/10+1, 4)),
  }
}

export default stats;