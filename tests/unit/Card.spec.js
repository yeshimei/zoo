import { go } from '../index'

it('move', () => {
  let { card, grids } = go('象0 | 狮1')
  card.action(grids[1])
  expect(grids[0].card).toBeFalsy
  expect(grids[1].card).toBe(card)
})

it('action - 只能选中 zoo card', () => {
  let { card, grids } = go('生命0 | grid')
  card.action(grids[1])
  expect(grids[0].card).toBe(card)
  expect(grids[1].card).toBeFalsy
})

it('action - 相邻格', () => {
  let { card, grids } = go('鼠0 | grid  | grid')
  card.action(grids[2])
  expect(grids[0].card).toBe(card)
  expect(grids[2].card).toBeFalsy
})

it('action -  未反转', () => {
  let { card, grids } = go('鼠0 | grid')
  card.reverse = false
  card.action(grids[1])
  expect(grids[0].card).toBe(card)
  expect(grids[1].card).toBeFalsy
})

it('action -  只能对敌对阵营展开行动', () => {
  let { card, grids } = go('象0 | 狗0')
  card.action(grids[1])
  expect(grids[0].card).toBe(card)
  expect(grids[1].card).toBeFalsy
})
it('action - 移动到空格', () => {
  let { card, grids } = go('象0 | grid')
  card.action(grids[1])
  expect(grids[0].card).toBeFalsy
  expect(grids[1].card).toBe(card)
})

it('action - 大吃小', () => {
  let { card, grids } = go('象0 | 狮1')
  card.action(grids[1])
  expect(grids[0].card).toBeFalsy
  expect(grids[1].card).toBe(card)
})

it('action - 同归于尽', () => {
  let { card, grids } = go('象0 | 象1')
  card.action(grids[1])
  expect(grids[0].card).toBeFalsy
  expect(grids[1].card).toBeTruthy
})
it('action - 鼠吃象', () => {
  let { card, grids } = go('鼠0 | 象1')
  card.action(grids[1])
  expect(grids[0].card).toBeFalsy
  expect(grids[1].card).toBe(card)
})
it('action - 象不能吃鼠', () => {
  let { cards, grids } = go('象0 | 鼠1')
  cards[0].action(grids[1])
  expect(grids[0].card).toBe(cards[0])
  expect(grids[1].card).toBe(cards[1])
})

it('action - 细菌清理自己的能力卡', () => {
  let { card, grids } = go('细菌0 | 生命0')
  card.action(grids[1])
  expect(grids[0].card).toBeFalsy
  expect(grids[1].card).toBe(card)
})

it('action - 进化', () => {
  let { card, grids } = go('狮0 | 进化1 | 狮1')
  card.action(grids[1])
  expect(card.power).toBe('进化')
  expect(card.name).toBe('象')
  expect(card.level).toBe(8)
  card.action(grids[2])
  expect(grids[0].card).toBeFalsy
  expect(grids[1].card).toBe(card)
})

it('action - 生命', () => {
  let { cards, grids } = go('象0 | 生命0 | 猫1')
  cards[2].action(grids[1])
  expect(cards[2].power).toBe('生命')
  cards[0].action(grids[1])
  expect(grids[0].card).toBe(cards[0])
  expect(grids[1].card).toBe(cards[2])
  expect(cards[2].power).toBeFalsy
  cards[0].action(grids[1])
  expect(grids[0].card).toBeFalsy
  expect(grids[1].card).toBe(cards[0])
})

it('luck card - 阳光（翻开所有卡牌）', () => {})
