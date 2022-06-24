import { uniqueId } from 'lodash'
import Fan from './Fan'

class Message {
  constructor() {
    this.messages = []
  }

  send(text) {
    this.messages.push({
      id: uniqueId(),
      text
    })
  }
}

export default new Message()
