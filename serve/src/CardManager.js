import { find, sample, some, filter } from 'lodash'
import OutputCard from './OutputCard'
import PutCard from './PutCard'
import GoodsCard from './GoodsCard'
import RuneCard from './RuneCard'

/**
 * 已实现，允许出现在游戏里的卡牌
 */
let usages = ['地雷', '炸药', '燃烧瓶', '火']

let cards = [
  ...sortOut(PutCard.putCards, 'put'),
  ...sortOut(OutputCard.outputCards, 'output'),
  ...sortOut(GoodsCard.goodsCards, 'goods'),
  ...sortOut(RuneCard.runeCards, 'rune')
]

if (process.env.NODE_ENV !== 'test') {
  cards = cards.filter(card => usages.includes(card.name))
}

class CardManager {
  constructor() {
    this.cards = cards
  }

  /**
   * 拿取一张指定卡牌
   * @param name
   * @returns ItemCard
   */
  take(name) {
    let card = find(this.cards, { name })
    if (card) {
      return new card.create()
    }
  }
  /**
   * 随机拿取一张指定类型的卡牌
   * @param type put 放置物， output 衍生物， goods 道具牌， rune 符文牌
   * @returns ItemCard
   */
  sample(type) {
    let cards = this.cards
    type && (cards = filter(cards, { type }))
    let card = sample(cards)
    return new card.create()
  }
}

function sortOut(data, type) {
  return data.map(el => ({
    name: el.name,
    create: el,
    type
  }))
}

export default new CardManager()
