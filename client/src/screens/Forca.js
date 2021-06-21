import {
  Stack,
  Box,
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  Center,
  Text,
  Badge,
} from "@chakra-ui/react";
import logo from "../assets/img/logo.svg";
import "../assets/css/App.css";
import { qwerty_alphabet } from "../assets/json/qwert.json";
import { roullete } from "../assets/json/roullete.json";
import { Button } from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import { PinInput, PinInputField } from "@chakra-ui/react";
import { words } from "../assets/json/words.json";
import Confetti from "react-confetti";
import AlertDialogComponent from "./Components/Alert";
import { useToast } from "@chakra-ui/react";
const jaysonPromiseBrowserClient = require('jayson/promise/lib/client/browser');
const fetch = require('node-fetch');


function Forca(props) {

  const [user_id, setUser_id] = useState("0");
  const [loading, setLoading] = useState(true);
  const [state, setState] = useState({
    "round": null,
    "all_words": null,
    "word": null,
    "tip": null,
    "partial_word": null,
    "turn_player": null,
    "already_chosen_letters": null,
    "roullete_value": null,
    "data_players": null,
    "end_game": null
  });

  const callServer = function(request) {
    const options = {
      method: 'POST',
      body: request,
      headers: {
        'Content-Type': 'application/json',
      }
    };
    return fetch('http://localhost:3001', options).then(res => res.text());
  };
  
  const client = new jaysonPromiseBrowserClient(callServer, {
    // other options go here
  });

  useEffect(() => {    

    
    start()

  }, [])

  const start = () => {
    client.request('start', null, async function(err, error, result) {
      if(err) {
        start()
      }else{
        await setUser_id(result.user_id)
        await setState(result.data);
        await setLoading(false);
        getUpdate()
      }      
    });

  }


  

  const getUpdate = () => {
    

    client.request('update', null, async function(err, error, result) {
      if(err) {
        getUpdate()
      }else{
        await setState(result);
      }
    });


    setTimeout(() => {
      getUpdate()
    }, 1000);
  }




  const choiceLetter = (letter) => {

    client.request('choice_letter', {"letter": letter, "user_id": user_id},function(err, error,result) {
      if(err) {
        choiceLetter(letter)
      }else{
        //getUpdate()
     }
    });

  }

  const winner = () => {
    let players = Object.keys(state.data_players)
    let winner = state.data_players[players[0]]
    players.forEach((player) => {
      if (state.data_players[player].points > winner.points) {
        winner = state.data_players[player]
      }
    })
    return winner.name
  }


  const QwertyAlphabetKeyboard = () => {
    let keyboard = [];

    qwerty_alphabet.forEach((line) => {
      let buttons = [];

      line.forEach((letter) => {
        let already_chosen = state.already_chosen_letters.includes(letter);
        buttons.push(
          <Button
            colorScheme="blue"
            isDisabled={already_chosen}
            onClick={() => {
              choiceLetter(letter)

            }}
          >
            {letter}
          </Button>
        );
      });

      keyboard.push(
        <Stack direction="row" spacing={4} align="center" marginY={2}>
          {buttons}
        </Stack>
      );
    });
    return keyboard;
  };

  const renderTablePlacar = () => {
    let players = Object.keys(state.data_players)
    let table = [];

    players.forEach(player => {
      table.push(
        <Tr>
          <Td>{state.data_players[player].name}</Td>
          <Td isNumeric>{state.data_players[player].points}</Td>
        </Tr>
      );
    })



    return (
      <Box marginTop={2}>
        <Table size="sm">
          <Thead>
            <Tr>
              <Th>Jogador</Th>
              <Th isNumeric>Pontos</Th>
            </Tr>
          </Thead>
          <Tbody>{table}</Tbody>
        </Table>
      </Box>
    );
  };

  function renderGame() {
    return (
      <div className="App">
        <header className="App-header">

          <Stack spacing={5} marginBottom={2}>
            <Text>Jogador {state.data_players[user_id].name}</Text>

            <Box w="100%" p={4} color="white">
              <Badge width={"100%"}>
                <Text fontSize="3xl">{state.tip}</Text>
              </Badge>
            </Box>

            <Text fontSize="6xl" color="success">
              {state.partial_word}
            </Text>
            <Text fontSize="xl" color="white">
              {(user_id === state.turn_player) && "Sua vez"}
              {(user_id !== state.turn_player) && "Vez de " + state.data_players[state.turn_player].name}

            </Text>
            <Text color="gray.500" fontSize="md">
              Valendo{" "}
              <Badge colorScheme="green">{state.roullete_value} pontos</Badge>
            </Text>
          </Stack>

          {QwertyAlphabetKeyboard()}
          {renderTablePlacar()}

        </header>

      </div>
    );
  }


  function renderLoading() {
    return (
      <div className="App">
        <header
          className="App-header"
          style={{ position: "relative", zIndex: 9999 }}
        >
          <Center>
            <Text fontSize="6xl">Loading...</Text>
          </Center>
        </header>
      </div>
    );
  }

  function renderEndGame() {
    return (
      <div className="App">
        <header
          className="App-header"
          style={{ position: "relative", zIndex: 9999 }}
        >
          <Confetti />
          <Center>
            <Stack spacing={4} align="center" marginY={2}>
              <Text fontSize="6xl">Fim de jogo, jogador {winner()} ganhou</Text>
              <Text>Novo jogo em 5 segundos...</Text>
            </Stack>

          </Center>
        </header>
      </div>
    );
  }


  if (loading) {
    return renderLoading();
  } else {
    if (!state.end_game) {
      //getUpdate();
      return renderGame();
    } else {
      return renderEndGame()
    }

  }
}

export default Forca;
