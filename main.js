let peer;
let connectios = [];
let isHost = false;
let players = {};

const creatBtn = document.getElementById('createBtn');
const joinBtn = document.getElementById('joinBtn');
const roomInput = document.getElementById('roomInput');
const lobbyDiv = document.getElementById('lobby');
const roomCodeSpan = document.getElementById('roomCode');
const playerList = document.getElementById('playerList');

// Create a new room

createBtn.onclick = () => {

    isHost = true;
    peer = new Peer();

    peer.on('open', id => {
        roomCodeSpan
        showLobby();
        players[id] = { name: "host"};
        updatePlayerList();
    });

    peer.on('connection', conn => {

        connection.push(conn);

        conn.on('data', data => {
            if (data.type === 'join') {
                players[conn.peer] = { name: data.name };
                broadcastPlayerList();
                updatePlayerList();
            }
        });
        conn.on('close', () => {
            delete players[conn.peer];
            broadcastPlayerList();
            updatePlayerList();
        });
    });
};


//JOIN A ROOM

joinBtn.onclick = () => {

    const roomCode = roomInput.value.trim();
    if (!roomCode) return;

    peer = new Peer();

    peer.on('open', id => {

        const conn = peer.connect(roomCode);

        conn.on('open', () => {

            showLobby();

            conn.send({
                type: 'join',
                name: "player"
            });
            conn

                if (data.type === "playerList") {
                    players = data.players;
                    updatePlayerList();
                    roomCodeSpan.textContent = roomCode;
                }
        });
    });
};

//functions

function showLobby() {
    const menu = document.getElementById("menu");

    if (menu) menu.style.display = 'none';
    lobbyDiv.style.display = 'block';
}

function updatePlayerList() {
    playerList.innerHTML = '';

    Object.values(players).forEach(player => {
        const li = document.createElement('li');
        li.textContent = player.name;
        playerList.appendChild(li);
    });
}

function broadcastPlayerList() {
    connection.forEach(conn => {
        conn.send({
            type: 'playerList',
            players
        });
    });
}