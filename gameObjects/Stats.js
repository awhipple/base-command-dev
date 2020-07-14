export default {
  power: {
    lvl: 1,
    val: 1,
    next: (lvl) => lvl + 1,
    cost: (lvl) => 10 * Math.pow(lvl, 2),
  },
  speed: {
    lvl: 1,
    val: 1,
    next: (lvl) => lvl + 1,
    cost: (lvl) => 10 * Math.pow(lvl, 2),
  }
}