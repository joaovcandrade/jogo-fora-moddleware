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

  const choiceLetter = (letter) => {
    let new_chosen_letters = [...state.already_chosen_letters, letter];
    let new_word_placeholder = "";
    let new_round;
    let new_points;
    let new_roullete = runRoullete();

    let letter_match = state.secretWord.indexOf(letter);

    if (letter_match >= 0) {
      state.secretWord.split("").forEach((letter) => {
        let match = new_chosen_letters.includes(letter);
        new_word_placeholder += match ? letter : " _ ";
      });
      new_round = state.round;
      new_points = [...state.points];
      new_points[state.round] += state.roullete_value;
      toast.closeAll();
      toast({
        title: "Wohoo!",
        description: `Acertou! ${state.players[state.round]} ganhou ${
          state.roullete_value
        } pontos`,
        position: "top-right",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
      setTimeout(() => {
        toast({
          title: "Continue",
          description: `${state.players[new_round]} tente mais uma letra`,
          position: "top-right",
          status: "warning",
          duration: null,
          isClosable: true,
        });
      }, 2000);
    } else {
      new_round = state.round + 1 > 2 ? 0 : state.round + 1;
      new_word_placeholder = state.word_placeholder;

      new_points = [...state.points];
      toast.closeAll();
      toast({
        title: "Oops!",
        description: "Acho que não",
        position: "top-right",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
      setTimeout(() => {
        toast({
          title: "Próximo!",
          description: `${state.players[new_round]} agora é sua vez!`,
          position: "top-right",
          status: "warning",
          duration: null,
          isClosable: true,
        });
        toast({
          title: `Valendo ${new_roullete} pontos`,
          description: ``,
          position: "top-right",
          status: "warning",
          duration: 3000,
          isClosable: true,
        });
      }, 2000);
    }

    setState({
      ...state,
      already_chosen_letters: [...state.already_chosen_letters, letter],
      word_placeholder: new_word_placeholder,
      end_game: state.secretWord == new_word_placeholder ? true : false,
      round: new_round,
      roullete_value: new_roullete,
      points: new_points,
    });
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

  var selected = words[getRandomInt(0, words.length)];
  const [state, setState] = useState({
    secretWord: selected.word.toUpperCase(),
    tip: selected.tip,
    already_chosen_letters: [],
    word_placeholder: generatePlaceholder(selected.word),
    players: ["Jogador 1", "Jogador 2", "Jogador 3"],
    points: [0, 0, 0],
    roullete_value: runRoullete(),
    round: getRandomInt(0, 2),
    end_game: false,
  });

  useEffect(() => {
    toast({
      title: "Início de jogo!",
      description: `${state.players[state.round]} você começa.`,
      position: "top-right",
      status: "success",
      duration: null,
      isClosable: true,
    });
  }, []);

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
            Vez do {state.players[state.round]}
          </Text>
          <Text color="gray.500" fontSize="md">
            Valendo{" "}
            <Badge colorScheme="green">{state.roullete_value} pontos</Badge>
          </Text>
        </Stack>

        {QwertyAlphabetKeyboard()}

        {state.end_game && `${state.players[state.round]} ganhou`}

        {renderTablePlacar()}
      </header>
      <AlertDialogComponent
        isOpen={state.end_game}
        title={"Fim de jogo"}
        body={`O Jogador ${state.players[state.round]} ganhou com ${
          state.points[state.round]
        } pontos`}
        opt={"Novo Jogo"}
      />
    </div>
  );
}

export default Forca;
