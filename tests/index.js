import Grid from '../server/src/Grid'
import { getCards } from '../serve/src/Card'
import CheckerBoard from '../server/src/CheckerBoard'

export function go(data) {
  let checkerBoard = CheckerBoard
  checkerBoard.grids = []
  let cards = []
  data = data.split('\n').map(row => row.trim())
  for (let i = 0; i < data.length; i++) {
    let row = data[i].split('|').map(text => text.trim())
    for (let j = 0; j < row.length; j++) {
      let grid = new Grid()
      grid.x = j
      grid.y = i
      checkerBoard.addGrid(grid)
      let text = row[j].split('+').map(word => word.trim())
      for (let k = 0; k < text.length; k++) {
        let word = text[k]
        let card = getCards().find(card => card.name + card.camp === word)
        if (card) {
          card.reverse = true
          grid.addCard(card)
          card.addGrid(grid)
          cards.push(card)
        }
      }
    }
  }

  return {
    checkerBoard,
    card: cards[0],
    cards,
    grids: checkerBoard.grids,
    grid: checkerBoard.grids[0]
  }
}
