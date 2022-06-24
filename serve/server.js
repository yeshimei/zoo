import Koa from 'koa'
import koaStatic from 'koa-static'
import body from 'koa-body'
import http from 'http'
import { Server } from 'socket.io'
import { stringify, parse } from './src'

const app = new Koa()
const server = http.createServer(app.callback())
const io = new Server(server, { cors: true })
const port = 3002

app
  .use(
    body({
      multipart: true,
      formidable: {
        maxFileSize: 200 * 1024 * 1024
      }
    })
  )
  .use(koaStatic(__dirname + '/public'))

io.on('connection', socket => {
  socket.on('game data', data => {
    if (data.name === 'player join') data.args.push(socket.id)
    parse(data)
    io.emit('game data', stringify())
  })

  socket.on('disconnect', () => {
    parse({
      name: 'player leave',
      args: [socket.id]
    })
    io.emit('game data', stringify())
  })
})

server.listen(port, () => {
  console.log(`listening on *:${port}`)
})
