import logo from "../assets/img/logo.svg";
import "../assets/css/App.css";
import { qwerty_alphabet } from "../assets/json/qwert.json";
import { roullete } from "../assets/json/roullete.json";
import { Button } from "@chakra-ui/react";
import React, { useState, useEffect } from "react";

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
import { PinInput, PinInputField } from "@chakra-ui/react";
import { words } from "../assets/json/words.json";
import Confetti from "react-confetti";
import AlertDialogComponent from "./Components/Alert";
import { useToast } from "@chakra-ui/react";

function Forca(props) {
  const toast = useToast();

  const runRoullete = () => {
    return roullete[Math.floor(Math.random() * roullete.length)];
  };

  const getRandomInt = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
  };

  const generatePlaceholder = (word) => {
    let placeholder = "";
    word.split("").forEach((letter) => {
      placeholder += " _ ";
    });

    return placeholder;
  };

  const newRound = () => {
    setTimeout(async () => {
      if (!toast.isActive("começa")) {
        await toast.closeAll();
        await toast({
          id: "começa",
          title: "Início de jogo!",
          description: `${state.players[state.player_turn]} você começa.`,
          position: "top-right",
          status: "success",
          duration: null,
          isClosable: true,
        });
      }
    }, 4000);
  };

  const choiceLetter = async (letter) => {
    let new_chosen_letters = [...state.already_chosen_letters, letter];
    let new_word_placeholder = "";
    let new_player_turn;
    let new_points;
    let new_roullete = runRoullete();

    let letter_match = state.secretWord.indexOf(letter);

    if (letter_match >= 0) {
      state.secretWord.split("").forEach((letter) => {
        let match = new_chosen_letters.includes(letter);
        new_word_placeholder += match ? letter : " _ ";
      });
      new_player_turn = state.player_turn;
      new_points = [...state.points];
      new_points[state.player_turn] += state.roullete_value;
      await toast.close("começa");
      await toast({
        title: "Wohoo!",
        description: `Acertou! ${state.players[state.player_turn]} ganhou ${
          state.roullete_value
        } pontos`,
        position: "top-right",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
      setTimeout(async () => {
        if (!toast.isActive("continue")) {
          await toast.closeAll();
          await toast({
            id: "continue",
            title: "Continue",
            description: `${state.players[new_player_turn]} tente mais uma letra`,
            position: "top-right",
            status: "warning",
            duration: null,
            isClosable: true,
          });
        }
      }, 2000);
    } else {
      new_player_turn = state.player_turn + 1 > 2 ? 0 : state.player_turn + 1;
      new_word_placeholder = state.word_placeholder;

      new_points = [...state.points];
      await toast({
        title: "Oops!",
        description: "Acho que não",
        position: "top-right",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
      setTimeout(async () => {
        await toast.closeAll();
        await toast({
          title: "Próximo!",
          description: `${state.players[new_player_turn]} agora é sua vez!`,
          position: "top-right",
          status: "warning",
          duration: null,
          isClosable: true,
        });
        await toast({
          title: `Valendo ${new_roullete} pontos`,
          description: ``,
          position: "top-right",
          status: "warning",
          duration: 3000,
          isClosable: true,
        });
      }, 2000);
    }

    //Verifica se a palavra está completa
    let end_turn = state.secretWord == new_word_placeholder ? true : false;

    if (!end_turn) {
      //se ainda mesma palavra
      setState({
        ...state,
        already_chosen_letters: [...state.already_chosen_letters, letter],
        word_placeholder: new_word_placeholder,
        player_turn: new_player_turn,
        roullete_value: new_roullete,
        points: new_points,
      });
    } else {
      if (
        state.secretWord == new_word_placeholder && state.turn == 2
          ? true
          : false
      ) {
        //FIX ENDGAMEEEE
        setState({ ...state, points: new_points, end_game: true });
      } else {
        //Se novo turno
        let new_round = state.round + 1;
        console.log("aqui", state.all_words, state.round, new_round);

        await toast.closeAll();
        setState(
          {
            ...state,
            player_turn: new_player_turn,
            roullete_value: new_roullete,
            points: new_points,
            word_placeholder: generatePlaceholder(
              state.all_words[new_round].word
            ),
            round: new_round,
            word: state.all_words[new_round],
            secretWord: state.all_words[new_round].word.toUpperCase(),
            tip: state.all_words[new_round].tip,
            already_chosen_letters: [],
            break_time_round: true,
          },
          () => {
            newRound();
          }
        );
      }
    }
  };

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
              choiceLetter(letter);
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
    let table = [];
    state.players.forEach((player, index) => {
      table.push(
        <Tr>
          <Td>{player}</Td>
          <Td isNumeric>{state.points[index]}</Td>
        </Tr>
      );
    });
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

  const getWinnerIdx = () => {
    let winner_idx = 0;
    for (let i = 1; i < state.points.length; i++) {
      if (state.players[winner_idx] < state.players[i]) winner_idx = i;
    }
    return winner_idx;
  };

  const selected = words.sort(() => Math.random() - Math.random()).slice(0, 3);
  console.log(selected);
  let round = 0;
  const [state, setState] = useState({
    round: 0,
    all_words: selected,
    word: selected[round],
    secretWord: selected[round].word.toUpperCase(),
    tip: selected[round].tip,
    already_chosen_letters: [],
    word_placeholder: generatePlaceholder(selected[round].word),
    players: ["Jogador 1", "Jogador 2", "Jogador 3"],
    points: [0, 0, 0],
    roullete_value: runRoullete(),
    player_turn: getRandomInt(0, 2),
    end_game: false,
    break_time_round: true,
  });

  //UseEffect sempre que tem um novo round, ele muda o estado para exibir o game
  useEffect(() => {
    if (state.break_time_round == true) {
      setTimeout(() => {
        setState({
          ...state,
          break_time_round: false,
        });
      }, 4000);
    }
  }, [state]);

  useEffect(async () => {
    newRound();
    setTimeout(async () => {
      if (!toast.isActive("começa")) {
        await toast.closeAll();
        await toast({
          id: "começa",
          title: "Início de jogo!",
          description: `${state.players[state.player_turn]} você começa.`,
          position: "top-right",
          status: "success",
          duration: null,
          isClosable: true,
        });
      }
    }, 4000);
  }, []);

  function renderGame() {
    return (
      <div className="App">
        <header className="App-header">
          {state?.end_game && <Confetti />}

          <Stack spacing={5} marginBottom={2}>
            <Box w="100%" p={4} color="white">
              <Badge width={"100%"}>
                <Text fontSize="3xl">{state.tip}</Text>
              </Badge>
            </Box>

            <Text fontSize="6xl" color="success">
              {state.word_placeholder}
            </Text>
            <Text fontSize="xl" color="white">
              Vez do {state.players[state.player_turn]}
            </Text>
            <Text color="gray.500" fontSize="md">
              Valendo{" "}
              <Badge colorScheme="green">{state.roullete_value} pontos</Badge>
            </Text>
          </Stack>

          {QwertyAlphabetKeyboard()}

          {state.end_game && `O ${state.players[getWinnerIdx()]} ganhou`}

          {renderTablePlacar()}
        </header>
      </div>
    );
  }

  function renderRound() {
    return (
      <div className="App">
        <header
          className="App-header"
          style={{ position: "relative", zIndex: 9999 }}
        >
          <Center>
            <Text fontSize="6xl">Round {state.round}</Text>
          </Center>
        </header>
      </div>
    );
  }
  console.log(state);
  //Inicio
  if (!state.break_time_round) {
    return renderGame();
  } else {
    return renderRound();
  }
}

export default Forca;
