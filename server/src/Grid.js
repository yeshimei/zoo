import { find, uniqueId } from 'lodash'
import CheckerBoard from './CheckerBoard'

export default class Grid {
  constructor() {
    this.id = uniqueId()
    this.x = 0
    this.y = 0
    this.card = null
  }

  adjacent() {
    let grids = CheckerBoard.grids
    return [find(grids, { x: this.x, y: this.y - 1 }), find(grids, { x: this.x, y: this.y + 1 }), find(grids, { y: this.y, x: this.x + 1 }), find(grids, { y: this.y, x: this.x - 1 })].filter(Boolean)
  }

  addCard(card) {
    this.card = card
    card.grid = this
  }

  removeCard() {
    this.card = null
  }
}
