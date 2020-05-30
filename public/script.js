const socket = io()

const messageContainer = document.querySelector('.message-container')
const messageForm = document.querySelector('.message-form')
const messageInput = document.getElementById('inputBox')
const sendMessageBtn = document.getElementById('sendBtn')
const roomWelcomeMessage = document.querySelector('h2')

const userInfo = Qs.parse(location.search, {
    ignoreQueryPrefix : true
})
const username = userInfo.usernameInput
const room = userInfo.roomSelector

roomWelcomeMessage.innerText = `WELCOME TO ${room}`
setMessage({sender : 'Chatol', message : 'You joined', time : getCurrentTime()})

socket.emit('user-join', {sender : 'Chatol', message : `${username} joined`, time : getCurrentTime()}, username, room)
socket.on('new-user', msg => {
    setMessage(msg)
})
socket.on('message', msg => {
    setMessage(msg)
})
socket.on('user-disconnected', user => {
    setMessage({sender : 'Chatol', message : `${user.username} disconnected`, time : getCurrentTime()})
})

messageForm.addEventListener('submit', e => {
    e.preventDefault()
    const message = messageInput.value
    const time = getCurrentTime()
    setMessage({sender: 'You', message: message, time: time})
    socket.emit('sent-message', {sender: username, message: message, time: time}, room)
    messageInput.value = ''
    messageInput.focus()
})

function setMessage(msg) {
    const messageBox = document.createElement('div')
    const messageHeader = document.createElement('div')
    const messageBody = document.createElement('div')
    const sender = document.createElement('h4')
    const message = document.createElement('p')
    const messageTime = document.createElement('h4')

    messageBox.classList.add('message')
    messageHeader.classList.add('message-header')
    messageBody.classList.add('message-body')

    sender.innerText = msg.sender
    message.innerText = msg.message
    messageTime.innerText = msg.time

    messageContainer.appendChild(messageBox)
    messageBox.appendChild(messageHeader)
    messageBox.appendChild(messageBody)
    messageHeader.appendChild(sender)
    messageBody.appendChild(message)
    messageBody.appendChild(messageTime)

    messageContainer.scrollTop = messageContainer.scrollHeight
}

function getCurrentTime() {
    return new Date().toLocaleTimeString('en-US')
}