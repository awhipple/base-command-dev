export default {
  power: {
    lvl: 1,
    val: 1,
    next: (lvl) => lvl + 1,
    cost: (lvl) => Math.floor(10 * Math.pow(lvl, 2.2)),
  },
  speed: {
    lvl: 1,
    val: 1,
    next: (lvl) => lvl + 1,
    cost: (lvl) => Math.floor(10 * Math.pow(lvl, 2.2)),
  }
}