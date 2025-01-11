let users = require('../mocks/users')

const USER_NOT_FOUND_OBJ = { error: 'User not found' }

function listUsers(request, response) {
    const { order } = request.query
    const { send } = response

    const sortedUsers =  users.sort((prev, curr) => {
        if(order === 'desc') {
            return prev.id < curr.id ? 1 : -1
        }

        return prev.id > curr.id ? 1 : -1
    })

    send(200, sortedUsers)
}

function getUserById(request, response) {
    const { id } = request.params
    const { send } = response

    const user = users.find(user => user.id === Number(id))

    if (!user) {
        return send(400, USER_NOT_FOUND_OBJ)
    }

    send(200, user)
}

function createUser(request, response) {
    const { send } = response
    const { body } = request

    const lastUserId = users[users.length - 1].id
    const newUser = {
        id: lastUserId + 1,
        name: body.name
    }

    users.push(newUser)

    send(200, newUser)
}

function updateUser(request, response) {
    const { send } = response
    let { params: { id }, body: { name }} = request

    id = Number(id)

    const userExists =  users.find(user => user.id === id)

    if (!userExists) {
        return send(400, USER_NOT_FOUND_OBJ)
    }

    users = users.map(user => user.id === userExists.id ? {...user, name} : user)

    send(200, users)

}

function deleteUser(request, response) {
    const { send } = response
    let { id } = request.params

    id = Number(id)

    const userExists =  users.find(user => user.id === id)

    if (!userExists) {
        return send(400, USER_NOT_FOUND_OBJ)
    }

    users = users.filter(user => user.id !== userExists.id)

    send(200, users)
}


module.exports = {
    listUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser
}