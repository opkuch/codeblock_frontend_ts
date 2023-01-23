import io from 'socket.io-client'

export const SOCKET_EMIT_SET_TOPIC = 'block-set-topic'
export const SOCKET_EMIT_UPDATE_BLOCK = 'update-block'
export const SOCKET_EMIT_USER_CONNECTED = 'user-connected'
export const SOCKET_EVENT_BLOCK_UPDATED = 'block-updated'
export const SOCKET_EVENT_ROOM_UPDATED = 'update-room-counter'


const baseUrl = import.meta.env.MODE === 'development' ? '//localhost:3030/' : ''

export const socketService = createSocketService()

// for debugging from console
// window.socketService = socketService
socketService.setup()

function createSocketService() {
  var socket: any = null
  const socketService = {
    setup() {
      socket = io(baseUrl)
    },
    on(eventName: string, cb: Function) {
      socket.on(eventName, cb)
    },
    off(eventName: string, cb = null) {
      if (!socket) return;
      if (!cb) socket.removeAllListeners(eventName)
      else socket.off(eventName, cb)
    },
    emit(eventName: string, data: any) {
      data = JSON.parse(JSON.stringify(data))
      socket.emit(eventName, data)
    },
  }
  return socketService
}