const feathers = require('@feathersjs/feathers')
const express = require('@feathersjs/express');
const socketio = require('@feathersjs/socketio')
const cors = require('cors')


class MessageService {
    constructor() {
        this.messages = []
    }

    async find() {
        return this.messages
    }

    async create(data) {
        const message = {
            id: this.messages.length,
            text: data.text
        };
        this.messages.push(message)
        return message
    }
}
const app = express(feathers());

app.use(express.json())
app.use(cors())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(__dirname)); 
app.configure(express.rest())
app.configure(socketio());

// register the service
app.use('/messages', new MessageService())

app.use(express.errorHandler())


app.on('connection', (connection) => {
    app.channel('everybody').join(connection);
    console.log('user connected')
})

app.publish(() => app.channel('everybody'))

const PORT = process.env.PORT || 3030;

app.listen(PORT).on('listening', () => {
    console.log(`Feathers server listening on port ${PORT}`)
})


app.service('messages').create({
    text: "Hello world from the server!"
})