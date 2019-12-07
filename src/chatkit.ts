import { ChatManager, TokenProvider } from '@pusher/chatkit-client'
import dayjs from 'dayjs'
import store from './store/index'

const INSTANCE_LOCATOR = process.env.VUE_APP_INSTANCE_LOCATOR
const TOKEN_URL = process.env.VUE_APP_TOKEN_URL
const MESSAGE_LIMIT = Number(process.env.VUE_APP_MESSAGE_LIMIT) || 10

let currentUser: any = null
let activeRoom: any = null

async function connectUser(userId: string) {
  const chatManager = new ChatManager({
    instanceLocator: INSTANCE_LOCATOR,
    tokenProvider: new TokenProvider({ url: TOKEN_URL }),
    userId,
  })
  currentUser = await chatManager.connect()
  return currentUser
}

function setMembers() {
  const members = activeRoom.users.map((user: any) => ({
    username: user.id,
    name: user.name,
    presence: user.presence.state,
  }))
  store.commit('setUsers', members)
}

async function subscribeToRoom(roomId: any) {
  store.commit('clearChatRoom')
  activeRoom = await currentUser.subscribeToRoom({
    roomId,
    messageLimit: MESSAGE_LIMIT,
    hooks: {
      onMessage: (message: any) => {
        store.commit('addMessage', {
          name: message.sender.name,
          username: message.senderId,
          text: message.text,
          date: dayjs(message.createdAt).format('h:mm:ss a D-MM-YYYY'),
        })
      },
      onPresenceChanged: () => {
        setMembers()
      },
      onUserStartedTyping: (user: any) => {
        store.commit('setUserTyping', user.id)
      },
      onUserStoppedTyping: () => {
        store.commit('setUserTyping', null)
      },
    },
  })
  setMembers()
  return activeRoom
}

async function sendMessage(text: any) {
  const messageId = await currentUser.sendMessage({
    text,
    roomId: activeRoom.id,
  })
  return messageId
}

export function isTyping(roomId: any) {
  currentUser.isTypingIn({ roomId })
}

function disconnectUser() {
  currentUser.disconnect()
}

export default {
  connectUser,
  subscribeToRoom,
  sendMessage,
  disconnectUser,
}
