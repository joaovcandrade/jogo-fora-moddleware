const { uniqueNamesGenerator, adjectives, colors, animals } = require('unique-names-generator');
const { words } = require('./json/words.json');
const { roullete } = require("./json/roullete.json");
const cors = require('cors');
const jayson = require('jayson');
const connect = require('connect');
const jsonParser = require('body-parser').json;
const app = connect();


var counter = Date.now();
var round = 0;
var all_words = choiceWords();
var word = all_words[round].word;
var tip = all_words[round].tip;
var partial_word = initialPlaceholder(word);
var turn_player = false;
var already_chosen_letters = [];
var roullete_value = runRoullete();
var data_players = {};
var end_game = false

function runRoullete() {
    return roullete[Math.floor(Math.random() * roullete.length)];
};

function initialPlaceholder(word) {
    let placeholder = "";

    word.split("").forEach((letter) => {
        placeholder += "_ ";
    });


    return placeholder;
};

function placeholder(letter) {
    console.log('before', partial_word);
    partial_word = partial_word.split(' ')
    splitWord = word.split('');
    for (i = 0; i < splitWord.length; i++) {
        if (splitWord[i] == letter) {
            partial_word[i] = letter;
        }
    }
    partial_word = partial_word.join(' ');
    console.log("after", partial_word);
    return partial_word;
};

function choiceWords() {
    console.log(words)
    let selected = words.sort(() => Math.random() - Math.random()).slice(0, 3);
    return selected;
}

function createUser() {
    let randomName = "";
    do {
        randomName = uniqueNamesGenerator({
            dictionaries: [adjectives, animals, colors], // colors can be omitted here as not used
            length: 2
        });

    } while (randomName in data_players);

    if (turn_player == false) {
        counter = Date.now()-5000;
        turn_player = randomName;
    }
    console.log("Turn player", turn_player)

    data_players[randomName] = ({
        "clientId": randomName,
        "name": randomName,
        "points": 0
    });

    if (data_players.length == 0) {
        turn_player = randomName;
    }

    console.log(data_players);
    return  randomName
}

function removeUser(clientId, emit) {
    console.log(Object.keys(data_players).length)
    if (Object.keys(data_players).length == 1) turn_player = false
    let players = Object.keys(data_players)
    if (players.indexOf(clientId) + 1 < players.length) {
        turn_player = players[players.indexOf(clientId) + 1]
    } else {
        turn_player = players[0]
    }
    delete data_players[clientId];
    roullete_value = runRoullete()
}

const server = new jayson.server({
    add: function(args, callback) {
      callback(null, args[0] + args[1]);
    },

    start: async (_, callback) => {
        let client_id = await createUser();
        let data = {
            round,
            all_words,
            word,
            tip,
            partial_word,
            turn_player,
            already_chosen_letters,
            roullete_value,
            data_players,
            end_game
        }
        callback(null, {"user_id": client_id, "data": data})
    },

    disconect: async (user_id, callback) => {
        console.log("removi ", user_id)
        removeUser(user_id)
        callback(null, notes)
    },

    choice_letter:  async (data, callback) => {
        letter = data.letter.toLowerCase()
        if (data.user_id == turn_player) {
            counter = Date.now();
            if (word.split('').includes(letter)) {
                already_chosen_letters.push(letter)
                partial_word = placeholder(letter)
                data_players[data.user_id]["points"] += roullete_value
                roullete_value = runRoullete()
                if (partial_word.split(' ').indexOf('_') < 0) {
                    round = round + 1;
                    if (round > 2) {
                        round = 0;
                        all_words = choiceWords();
                        end_game = true
                        setTimeout(async () => {
                            end_game = false
                        }, 5000);
                        let players = Object.keys(data_players);
                        players.forEach(p => {
                            data_players[p].points = 0;
                        });
                    }
                    word = all_words[round].word;
                    tip = all_words[round].tip;
                    partial_word = initialPlaceholder(word);
                    already_chosen_letters = [];
                }
            } else {

                let players = Object.keys(data_players)
                if (players.indexOf(data.user_id) + 1 < players.length) {
                    turn_player = players[players.indexOf(data.user_id) + 1]
                } else {
                    turn_player = players[0]
                }
                roullete_value = runRoullete()

            }
        } else {
            console.log("Not turn of ", data.user_id)
        }

        callback(null, null)

    },

    update: async (_, callback) => {
        let date_now = Date.now()
        let diff_time = date_now - counter // tempo decorrido em milisegundos
        if (diff_time >= 30000){
            removeUser(turn_player);
            counter = Date.now();
        }
        let data = {
            round,
            all_words,
            word,
            tip,
            partial_word,
            turn_player,
            already_chosen_letters,
            roullete_value,
            data_players,
            end_game
        }        
        callback(null, data)
    }
});

app.use(cors({methods: ['POST']}));
app.use(jsonParser());
app.use(server.middleware());

app.listen(3001);


/*
io.on("connection", async (socket) => {

    socket.join("room1")


    const emit = () => {
        io.to('room1').emit("update", {
            round,
            all_words,
            word,
            tip,
            partial_word,
            turn_player,
            already_chosen_letters,
            roullete_value,
            data_players,
            end_game
        });
    }
    console.log(turn_player)
    await emit();

    socket.on("disconnect", async () => {
        removeUser(socket.id, emit);
        await emit()
        console.log("Alguem desconectou");
        console.log("----------------------------");
    });

    socket.on("letter", async (letter) => {
        letter = letter.toLowerCase()
        if (socket.id == turn_player) {
            if (word.split('').includes(letter)) {
                already_chosen_letters.push(letter)
                partial_word = placeholder(letter)
                data_players[socket.id]["points"] += roullete_value
                roullete_value = runRoullete()
                if (partial_word.split(' ').indexOf('_') < 0) {
                    round = round + 1;
                    if (round > 2) {
                        round = 0;
                        all_words = choiceWords();
                        end_game = true
                        setTimeout(async () => {
                            end_game = false
                            await emit();
                        }, 5000);
                        let players = Object.keys(data_players);
                        players.forEach(p => {
                            data_players[p].points = 0;
                        });
                    }
                    word = all_words[round].word;
                    tip = all_words[round].tip;
                    partial_word = initialPlaceholder(word);
                    already_chosen_letters = [];
                    await emit();
                }
            } else {

                let players = Object.keys(data_players)
                if (players.indexOf(socket.id) + 1 < players.length) {
                    turn_player = players[players.indexOf(socket.id) + 1]
                } else {
                    turn_player = players[0]
                }
                roullete_value = runRoullete()

            }
        } else {
            console.log("Not turn of ", socket.id)
        }

        await emit()
    });

    console.log(socket.id);
    console.log("Alguem conectou");
});


io.onmessage = (data) => {
    console.log(data);
};
 */
