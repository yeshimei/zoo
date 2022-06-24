export default class Player {
  constructor() {
    this.id = null
    this.username = null
    this.socketId = null
    /**
     * join - 新加入
     * reconnection - 重连
     * leave - 离开
     */
    this.status = 'join'
    this.role = null
    // 是否准备就绪
    this.ready = false
  }

  setRole(role) {
    this.role = role
  }
}
