let socket = io()

let  clientsTotal = document.getElementById('client-total')

let messageContainer = document.getElementById('message-container')
let nameInput = document.getElementById('name-input')
let messageForm = document.getElementById('message-form')
let messageInput = document.getElementById('message-input')

messageForm.addEventListener('submit', (e) => {
    e.preventDefault()
    sendMessage()
})

socket.on('clients-total', (data) => {
    clientsTotal.innerText = `Total Clients : ${data}`
    console.log("data ######", data);
})

function sendMessage(){

    if(messageInput.value === '') return
    console.log("message value ++++++++++++++++++",messageInput.value);
    let data = {
        name : nameInput.value,
        message : messageInput.value,
        dateTime : new Date (),
    }
    socket.emit('message', data)
    addMessageToUI(true, data)
    messageInput.value = ''
}

socket.on('chat-message', (data) => {
    console.log(data);
    addMessageToUI(false, data)
})

function addMessageToUI(isOwnMessage, data){
    const element = `
    <li class="${isOwnMessage ? 'message-right' : 'message-left'}">
        <p class="message">
          ${data.message}
          <span>${data.name} ● ${moment(data.dateTime).fromNow()}</span>
        </p>
      </li>
      `

    messageContainer.innerHTML += element
    scrollToBottom()
}


function scrollToBottom(){
    messageContainer.scrollTo(0, messageContainer.scrollHeight)
}

messageInput.addEventListener('focus', (e) => {
    socket.emit('feedback', {
      feedback: `${nameInput.value} is typing ...`,
    })
  })
  
  messageInput.addEventListener('keypress', (e) => {
    socket.emit('feedback', {
      feedback: `${nameInput.value} is typing ...`,
    })
  })
  messageInput.addEventListener('blur', (e) => {
    socket.emit('feedback', {
      feedback: '',
    })
  })
  
  socket.on('feedback', (data) => {
    clearFeedback()
    const element = `
          <li class="message-feedback">
            <p class="feedback" id="feedback">${data.feedback}</p>
          </li>
    `
    messageContainer.innerHTML += element

  })

  function clearFeedback() {
    document.querySelectorAll('li.message-feedback').forEach((element) => {
      element.parentNode.removeChild(element)
    })
  }