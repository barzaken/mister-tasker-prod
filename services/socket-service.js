const logger = require('./logger.service')
var gIo = null

function setupSocketAPI(http) {
    gIo = require('socket.io')(http, {
        cors: {
            origin: '*',
        }
    })
    gIo.on('connection', socket => {
        logger.info(`New connected socket [id: ${socket.id}]`)
        socket.on('disconnect', socket => {
            logger.info(`Socket disconnected [id: ${socket.id}]`)
        })
    })
}

async function broadcast({ type, data}) {
    console.log('emit from backend');
        logger.info(`Emit to all`)
        gIo.emit(type, data)
}



module.exports = {
    // set up the sockets service and define the API
    setupSocketAPI,
    broadcast
}
