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
import { io } from "socket.io-client";



const socket = io("http://localhost:3002");


function Forca(props) {

  var user_id = null
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

  useEffect(() => {
    socket.on("connect", () => {
      user_id = socket.id
      console.log("Conectado!")
    });
    socket.on("update", async data => {
      console.log(data);

      await setState(data);
      setLoading(false);
    });


  }, [])





  useEffect(() => {
    console.log("ATUALIZOU", state);
  }, state)


  const choiceLetter = (letter) => {
    socket.emit("letter", letter)
    if (user_id == state.turn_player) {

    }

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
            <Text>Jogador {state.data_players[socket.id].name}</Text>

            <Box w="100%" p={4} color="white">
              <Badge width={"100%"}>
                <Text fontSize="3xl">{state.tip}</Text>
              </Badge>
            </Box>

            <Text fontSize="6xl" color="success">
              {state.partial_word}
            </Text>
            <Text fontSize="xl" color="white">
              {(socket.id == state.turn_player) && "Sua vez"}
              {(socket.id != state.turn_player) && "Vez de " + state.data_players[state.turn_player].name}

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
      return renderGame();
    } else {
      return renderEndGame()
    }

  }
}

export default Forca;
