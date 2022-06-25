import CheckerBoard from '../../serve/src/CheckerBoard'
import Player from '../../serve/src/Player'

it('addPlayer', () => {
  let checkBoard = new CheckerBoard()

  let p1 = new Player()
  p1.id = 1
  let p2 = new Player()
  p2.id = 2
  let p3 = new Player()
  p3.id = 3
  checkBoard.addPlayer(p1)

  expect(checkBoard.players.length).toBe(1)

  checkBoard.addPlayer(p1)
  expect(checkBoard.players.length).toBe(1)
  checkBoard.addPlayer(p2)
  expect(checkBoard.players.length).toBe(2)
  checkBoard.addPlayer(p3)
  expect(checkBoard.players.length).toBe(2)
})

it('create', () => {
  let checkBoard = new CheckerBoard()
  checkBoard.create()

  expect(checkBoard.grids.length).toBe(25)
})
