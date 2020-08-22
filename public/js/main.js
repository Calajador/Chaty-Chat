const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');


// Obtener Nombre de Usuario y Sala desde la URL
const {username, room} = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});

const socket = io();

// Unirse a la Sala
socket.emit('joinRoom', {username, room});

// Obtener Usuarios en la sala
socket.on('roomUsers', ({room, users}) => {
    outputRoomName(room);
    outputUsers(users);
})

// Mensaje desde el servidor
socket.on('message', message => {
    console.log(message);
    outputMessage(message);

    // Bajar Scroll
    chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Mensaje enviado
chatForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Obtener el texto del mensaje
    const msg = e.target.elements.msg.value
    
    // Emitir elmensaje al servidor
    socket.emit('chatMessage', msg);

    // Limpiar Input
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();
});


// Enviar mensaje al DOM
function outputMessage(message) {
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">
      ${message.text}
    </p>`;
    document.querySelector('.chat-messages').appendChild(div);
}
 

// Incluir Nombre de sala al DOM
function outputRoomName(room) {
    roomName.innerText = room
}


// Incluir Usuarios al DOM
function outputUsers(users) {
    userList.innerHTML = `
    ${users.map(user => `<li>${user.username}</li>`).join('')}
  `;
}