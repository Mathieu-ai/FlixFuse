import type { Peer } from 'crossws'

export default defineWebSocketHandler({
  message(peer: Peer, message) {
    const msgStr = typeof message === 'string' ? message : String(message)
    peer.publish('chat', msgStr)
  },
  
  open(peer: Peer) {
    peer.subscribe('chat')
  },
  
  close(_peer: Peer) {
    // console.log('[ws] close:', _peer)
  },
  
  error(_peer: Peer, _error) {
    // console.error('[ws] error:', _error)
  }
})