import ItemCard from './ItemCard'

export default class GoodsCard extends ItemCard {
  static goodsCards = []
  constructor() {
    super()
    this.type = 'goodsCard'
  }
}
