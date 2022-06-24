import { invokeMap, random, sum, times } from 'lodash'
import Fan from './Fan'

export default class Dice {
  constructor() {
    // 默认情况下，每回合仅允许 roll 一次
    this.disabled = false
    // 骰子数量
    this.count = 2
    // 记录每个骰子的点数
    this.points = []
    // 骰子点数
    this.dicePoint = 0
    this.movePoint = 0
    // 额外的骰子点数 #水壶
    this.extraPoint = 0
  }

  reset() {}

  /**
   * 获得骰子点数
   * @param n 骰子颗数
   */
  getPoints(n) {
    let points = []
    times(n, () => points.push(random(1, 6)))
    return points
  }

  /**
   * 掷骰子
   */
  roll() {
    if (this.disabled) return
    this.points = this.getPoints(this.count)
    let totalPoints = sum(this.points)
    this.movePoint = totalPoints
    this.dicePoint = totalPoints
    this.disabled = true
  }

  /**
   * 更新骰子点数
   * @param n{number} 加减
   */
  updateMovePoint(n) {
    this.movePoint = Math.max(0, this.movePoint + n)
  }

  /**
   * 骰子点数是否为大
   */
  isLarge() {
    return this.dicePoint > this.count * 3
  }
  /**
   * 骰子点数是否为小
   */
  isSmall() {
    return this.dicePoint <= this.count * 3
  }
  /**
   * 骰子点数是否为最大
   */
  isMax() {
    return this.dicePoint === this.count * 6
  }
  /**
   * 骰子点数是否为最小
   */
  isMin() {
    return this.dicePoint === 1
  }
  /**
   * 骰子点数为相等
   */
  isEq() {
    return this.points.every(n => n === this.points[0])
  }
  /**
   * 骰子点数为大相等
   */
  isLargeEq() {
    return this.points.every(n => [4, 5, 6].includes(n))
  }
  /**
   * 骰子点数为小相等
   */
  isSmallEq() {
    return this.points.every(n => [1, 2, 3].includes(n))
  }
  /**
   * 剩余的骰子点数为大
   */
  isRemainderLarge() {
    return this.movePoint > this.count * 3
  }
  /**
   * 剩余的骰子点数为小
   */
  isRemainderSmall() {
    return this.movePoint <= this.count * 3
  }
}
