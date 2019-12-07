import { Commit, ActionContext } from 'vuex'
import chatkit from '../chatkit'

// Helper function for displaying error messages
function handleError(commit: Commit, error: any) {
  const message = error.message || error.info.error_description
  commit('setError', message)
}

const actions = {
  async login({ commit, state }: ActionContext<any, any>, userId: any) {
    try {
      commit('setError', '')
      commit('setLoading', true)

      // Connect user to ChatKit service
      const currentUser = await chatkit.connectUser(userId)
      commit('setUser', {
        username: currentUser.id,
        name: currentUser.name,
      })
      commit('setReconnect', false)

      const rooms = currentUser.rooms.map((room: any) => ({
        id: room.id,
        name: room.name,
      }))
      commit('setRooms', rooms)

      // Subscribe user to a room
      const activeRoom = state.activeRoom || rooms[0] // pick last used room, or the first one
      commit('setActiveRoom', {
        id: activeRoom.id,
        name: activeRoom.name,
      })
      await chatkit.subscribeToRoom(activeRoom.id)

      return true
    } catch (error) {
      handleError(commit, error)
    } finally {
      commit('setLoading', false)
    }
  },
  async changeRoom({ commit }: ActionContext<any, any>, roomId: string) {
    try {
      const { id, name } = await chatkit.subscribeToRoom(roomId)
      commit('setActiveRoom', { id, name })
    } catch (error) {
      handleError(commit, error)
    }
  },
  async sendMessage({ commit }: ActionContext<any, any>, message: any) {
    try {
      commit('setError', '')
      commit('setSending', true)
      const messageId = await chatkit.sendMessage(message)
      return messageId
    } catch (error) {
      handleError(commit, error)
    } finally {
      commit('setSending', false)
    }
  },
  async logout({ commit }: any) {
    commit('reset')
    chatkit.disconnectUser()
    window.localStorage.clear()
  },
}

export default actions
