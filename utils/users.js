const users = [];

// Usuario se une al chat
function userJoin(id, username, room) {
    const user = {id, username, room};

    users.push(user);

    return user;
}

// Obtener el usuario Actual
function getCurrentUser(id) {
    return users.find(user => user.id === id);
}

// usuario sale del Chat
function userLeave(id) {
    const index = users.findIndex(user => user.id === id);

    if(index !== -1) {
        return users.splice(index, 1)[0];
    }
}

// Obtener usuarios en Sala
function getRoomUsers(room) {
    return users.filter(user => user.room === room)
}

module.exports = {
    userJoin,
    getCurrentUser,
    userLeave,
    getRoomUsers
}