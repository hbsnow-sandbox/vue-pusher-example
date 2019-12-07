export default {
  setError(state: any, error: any) {
    state.error = error
  },
  setLoading(state: any, loading: any) {
    state.loading = loading
  },
  setUser(state: any, user: any) {
    state.user = user
  },
  setReconnect(state: any, reconnect: any) {
    state.reconnect = reconnect
  },
  setActiveRoom(state: any, room: any) {
    state.activeRoom = room
  },
  setRooms(state: any, rooms: any) {
    state.rooms = rooms
  },
  setUsers(state: any, users: any) {
    state.users = users
  },
  clearChatRoom(state: any) {
    state.users = []
    state.messages = []
  },
  setMessages(state: any, messages: any) {
    state.messages = messages
  },
  addMessage(state: any, message: any) {
    state.messages.push(message)
  },
  setSending(state: any, status: any) {
    state.sending = status
  },
  setUserTyping(state: any, userId: any) {
    state.userTyping = userId
  },
  reset(state: any) {
    state.error = null
    state.users = []
    state.messages = []
    state.rooms = []
    state.user = null
  },
}
