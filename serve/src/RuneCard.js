import ItemCard from './ItemCard'

export default class RuneCard extends ItemCard {
  static runeCards = []
  constructor() {
    super()
    this.type = 'runeCard'
  }
}
