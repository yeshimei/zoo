import CheckerBoard from 'server/src/CheckerBoard'
import Player from '../../server/src/Player'
import Card from '../../server/src/Card'
import { go } from '../index'
import { times } from 'lodash'

it('move', () => {
  let { card, grids } = go('象0 | 狮1')
  card.action(grids[1])
  expect(grids[0].card).toBeFalsy()
  expect(grids[1].card).toBe(card)
})

describe('action', () => {
  it('卡牌未反转', () => {
    let { card, grids } = go('鼠0 | grid')
    card.reverse = false
    card.action(grids[1])
    expect(grids[0].card).toBe(card)
    expect(grids[1].card).toBeFalsy()
  })
  it('移动到空格', () => {
    let { card, grids } = go('象0 | grid')
    card.action(grids[1])
    expect(grids[0].card).toBeFalsy()
    expect(grids[1].card).toBe(card)
  })
  it('仅允许选中动物牌', () => {
    let { card, grids } = go('生命0 | grid')
    card.action(grids[1])
    expect(grids[0].card).toBe(card)
    expect(grids[1].card).toBeFalsy()
  })

  it('移动范围（相邻格）', () => {
    let { card, grids } = go('鼠0 | grid  | grid')
    card.action(grids[2])
    expect(grids[0].card).toBe(card)
    expect(grids[2].card).toBeFalsy()
  })

  it('细菌 - 消除己方能力牌', () => {
    let { cards, grids } = go('细菌0 | 穿越0 | 穿越1')
    cards[0].action(grids[1])
    expect(grids[1].card).toBe(cards[0])
    cards[0].action(grids[2])
    expect(grids[2].card.power).toBe('穿越')
  })

  it('细菌 - 吃掉敌方附着能力的动物牌', () => {
    let { cards, grids } = go('细菌0 | 进化0 | 狮1')
    cards[2].action(grids[1])
    expect(grids[1].card.power).toBe('进化')
    cards[0].action(grids[1])
    expect(grids[1].card).toBe(cards[0])
  })

  it('细菌 - 敌方附着能力的动物牌不能吃掉细菌', () => {
    let { cards, grids } = go('细菌0 | 进化0 | 狮1')
    cards[2].action(grids[1])
    expect(grids[1].card.power).toBe('进化')
    cards[2].action(grids[0])
    expect(grids[0].card).toBe(cards[0])
  })

  it('[bug√] - 细菌不能一次性吃掉附着生命的动物牌', () => {
    let { cards, grids } = go('细菌0 | 生命0 | 狮1')
    cards[2].action(grids[1])
    cards[0].action(grids[1])
    expect(grids[1].card).toBe(cards[0])
  })

  it('动物牌仅允许对敌方阵营的卡牌展开行动（细菌除外）', () => {
    let { cards, grids } = go('象0 | 狗0')
    cards[0].action(grids[1])
    expect(grids[0].card).toBe(cards[0])
    expect(grids[1].card).toBe(cards[1])
  })

  it('附着一张能力牌', () => {
    let { card, grids } = go('狮0 | 进化1')
    card.action(grids[1])
    expect(grids[1].card.power).toBe('进化')
  })
  it('象不能附着能力牌', () => {
    let { card, grids } = go('象0 | 进化1')
    card.action(grids[1])
    expect(grids[1].card.power).toBeFalsy()
  })

  it('鼠 -> 象 √', () => {
    let { card, grids } = go('鼠0 | 象1')
    card.action(grids[1])
    expect(grids[0].card).toBeFalsy()
    expect(grids[1].card).toBe(card)
  })
  it('象 -> 鼠 ×', () => {
    let { cards, grids } = go('象0 | 鼠1')
    cards[0].action(grids[1])
    expect(grids[0].card).toBe(cards[0])
    expect(grids[1].card).toBe(cards[1])
  })

  it('大吃小', () => {
    let { card, grids } = go('象0 | 狮1')
    card.action(grids[1])
    expect(grids[0].card).toBeFalsy()
    expect(grids[1].card).toBe(card)
  })

  it('同归于尽', () => {
    let { card, grids } = go('象0 | 象1')
    card.action(grids[1])
    expect(grids[0].card).toBeFalsy()
    expect(grids[1].card).toBeTruthy
  })
})

describe('能力卡', () => {
  it('进化', () => {
    let { card, grids } = go('狮0 | 进化1 | 狮1')
    card.action(grids[1])
    expect(card.power).toBe('进化')
    card.action(grids[2])
    expect(grids[1].card).toBeFalsy()
    expect(grids[2].card.camp).toBe(0)
  })

  it('生命', () => {
    let { cards, grids } = go('象0 | 生命0 | 猫1')
    cards[2].action(grids[1])
    expect(cards[2].power).toBe('生命')
    cards[0].action(grids[1])
    expect(grids[0].card).toBe(cards[0])
    expect(grids[1].card).toBe(cards[2])
    expect(cards[2].power).toBeFalsy()
    cards[0].action(grids[1])
    expect(grids[0].card).toBeFalsy()
    expect(grids[1].card).toBe(cards[0])
  })

  it('生命 - 等级相同 - 双方都附着生命能力，同归于尽', () => {
    let { cards, grids } = go('狮0 | 生命1 | 生命0 | 狮1')
    cards[0].action(grids[1])
    cards[3].action(grids[2])
    cards[0].action(grids[1])
    grids.every(grid => expect(grid.card).toBeFalsy)
  })

  it('生命 - 等级相同 - 一方有生命能力，其生命能力消除，另一方死亡', () => {
    let { cards, grids } = go('狮0 | 生命1 | 狮1 | 狮1 | 生命0 | 狮0')
    cards[0].action(grids[1])
    cards[0].action(grids[2])
    expect(grids[1].card.camp).toBe(0)
    expect(grids[1].card.power).toBeFalsy()
    expect(grids[2].card).toBeFalsy()
    cards[3].action(grids[4])
    cards[5].action(grids[4])
    expect(grids[4].card.camp).toBe(1)
    expect(grids[4].card.power).toBeFalsy()
    expect(grids[5].card).toBeFalsy()
  })

  it('穿越 - 正常移动，不会消耗穿越能力', () => {
    let { card, grids } = go('狮0 | 穿越1 | grid')
    card.action(grids[1])
    card.action(grids[2])
    expect(grids[2].card.power).toBe('穿越')
  })
  it('穿越 - 允许移动到任意格一次', () => {
    let { card, grids } = go('狮0 | 穿越1 | grid | grid')
    card.action(grids[1])
    card.action(grids[3])
    expect(grids[3].card.name).toBe('狮')
    expect(grids[3].card.power).toBeFalsy()
  })
  it('穿越 - 吃掉一张敌方动物牌', () => {
    let { card, grids } = go('狮0 | 穿越1 | grid | 猫1')
    card.action(grids[1])
    card.action(grids[3])
    expect(grids[3].card.name).toBe('狮')
    let a = grids[3].card.power
    expect(grids[3].card.power).toBeFalsy()
  })

  it('穿越 - 附着能力', () => {
    let { card, grids } = go('狮0 | 穿越1 | grid | 进化1')
    card.action(grids[1])
    card.action(grids[3])
    expect(grids[3].card.name).toBe('狮')
    expect(grids[3].card.power).toBe('进化')
  })
  it('[bug√] 穿越- 吃掉附着生命能力的敌方动物牌', () => {
    // 原地不移动，己方的穿越能力消失，敌方生命能力消失，
    let { cards, grids } = go('狮0 | 穿越1 | grid | 生命0 | 狼1')
    cards[0].action(grids[1])
    cards[3].action(grids[3])
    expect(grids[3].card.power).toBe('生命')
    cards[0].action(grids[3])
    expect(grids[1].card.name).toBe('狮')
    expect(grids[1].card.power).toBeFalsy()
    expect(grids[3].card.name).toBe('狼')
    expect(grids[3].card.power).toBeFalsy()
  })

  it('[bug√] 穿越 - 吃比自身等级高的，再次移动后穿越能力消失', () => {
    let { cards, grids } = go('狮0 | 穿越1 | grid | 细菌1')
    cards[0].action(grids[1])
    cards[0].action(grids[3])
    let a = grids[3].card
    expect(grids[1].card.name).toBe('狮')
    expect(grids[1].card.power).toBe('穿越')
    expect(grids[3].card).toBe(cards[2])
    cards[0].action(grids[2])

    expect(grids[2].card.name).toBe('狮')
    expect(grids[2].card.power).toBe('穿越')
  })
})

describe('幸运卡', () => {
  it('阳光 - 明牌', () => {
    let { cards, grids } = go('狮1 | 狼0 | grid')
    let luck = new Card()
    luck.name = '阳光'
    luck.type = 'luck'
    cards[0].reverse = false
    cards[1].reverse = false
    grids[2].addCard(luck)
    luck.setReverse()
    expect(cards[0].reverse).toBe(true)
    expect(cards[1].reverse).toBe(true)
  })

  it('汹涌 - 打乱所有牌', () => {
    let { cards, grids } = go('狮1 | 狼0 | grid')
    let luck = new Card()
    luck.name = '汹涌'
    luck.type = 'luck'
    grids[2].addCard(luck)
    luck.setReverse()
    // 随机数，无法测试
  })

  it('礼物 - 额外的回合', () => {
    let { grids } = go('狮1 | 狼0 | grid')
    let luck = new Card()
    luck.name = '礼物'
    luck.type = 'luck'
    grids[2].addCard(luck)
    let p1 = new Player()
    let p2 = new Player()
    CheckerBoard.join(p1)
    CheckerBoard.join(p2)
    CheckerBoard.play()
    luck.setReverse()
    let n = CheckerBoard.currentPlayer.extraRound
    times(n, () => {
      CheckerBoard.next()
      expect(CheckerBoard.currentPlayer).toBe(p1)
    })
    expect(CheckerBoard.currentPlayer.extraRound).toBe(0)
    CheckerBoard.next()
    expect(CheckerBoard.currentPlayer).toBe(p2)
  })
})
