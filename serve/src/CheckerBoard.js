import { castArray, find, last, uniqueId } from 'lodash'
import Grid from './Grid'

export default class CheckerBoard {
  constructor() {
    this.id = uniqueId()
    this.grids = []
    this.row = 5
    this.col = 5
    this.itemCardCount = 10
    this.playerNumber = 4
  }

  addGrid(grid) {
    this.grids.push(grid)
  }

  getGrid(id) {
    return find(this.grids, { id })
  }

  getPointOfBirth() {
    return find(this.grids, { birth: true })
  }

  create() {
    for (var i = 0; i < this.row; i++) {
      for (var j = 0; j < this.col; j++) {
        let grid = new Grid()
        grid.x = j
        grid.y = i
        this.grids.push(grid)
      }
    }

    // 设置出生点
    this.grids[0].birth = true
    // 设置商店
    last(this.grids).shop = true
  }

  action(grid = this.grids, opts = {}) {
    const { immediate, id } = opts
    castArray(grid).forEach(grid => {
      grid.actions.forEach(({ ctx, judge, trigger, fast }) => {
        if (judge(grid) || immediate || ctx.depletion) {
          if (!id || id === ctx.id) {
            let outputCard = trigger(grid)
            fast && ctx.destroy()
            if (outputCard) {
              grid.removeItemCard(ctx.id)
              grid.addItemCard(outputCard, { force: true })
              this.action(grid, { id: outputCard.id })
            }
          }
        }
      })
    })
  }
}
