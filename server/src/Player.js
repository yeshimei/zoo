export default class Player {
  constructor() {
    this.id = null
    this.socketId = null
    this.username = null
    /**
     * join - 新加入
     * reconnection - 重连
     * leave - 离开
     */
    this.status = 'join'
    this.camp = 0
    this.extraRound = 0
  }
}
