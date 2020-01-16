const data = require('../../data')
const generateConfigs = require('./generateConfigs')

module.exports = (room) => {
    if (room.playersCount == data.const.MIN_PLAYERS_IN_ROOM_TO_START_GAME) {
        startGame(room)

        room.on('newPos', (newPos, player) => {
            if (player.socket != undefined) {
                room.everyOther(player.socket.id, 'updateOtherPlayer', newPos)
            }
        })

        room.on('newBallOwner', (player) => {
            if (player.socket != undefined) {
                room.everyOther(player.socket.id, 'newBallOwner')
            }
        })

        let restartEvent = true
        room.on('restart', (player) => {
            if (restartEvent && room.gameplay) {
                room.emit('stopGame')
                restartEvent = false
                room.gameplay = false
                player.score++

                const score = {}
                for (const playerId in room.players) {
                    const player = room.players[playerId]
                    score[player.socket.id] = player.score
                }

                startGame(room, false, { score })
                setTimeout(() => { restartEvent = true }, 4000);
            }
        })

    }
}



function startGame(room, changePlayers, addToConf = {}) {
    room.emit('startGame', { ...generateConfigs(room, changePlayers), ...addToConf })
    room.gameplay = true
}