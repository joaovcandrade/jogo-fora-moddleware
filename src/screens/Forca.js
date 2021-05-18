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

class Forca extends React.Component {
  constructor(props) {
    super(props);
    let selected = words[this.getRandomInt(0, words.length)];
    this.state = {
      secretWord: selected.word.toUpperCase(),
      tip: selected.tip,
      already_chosen_letters: [],
      word_placeholder: this.generatePlaceholder(selected.word),
      players: ["Jogador 1", "Jogador 2", "Jogador 3"],
      points: [0, 0, 0],
      roullete_value: this.runRollete(),
      round: this.getRandomInt(0, 2),
      end_game: false,
    };
  }

  runRollete() {
    return roullete[Math.floor(Math.random() * roullete.length)];
  }

  getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
  }

  generatePlaceholder(word) {
    let placeholder = "";
    word.split("").forEach((letter) => {
      placeholder += " _ ";
    });

    return placeholder;
  }

  choiceLetter(letter) {
    let new_chosen_letters = [...this.state.already_chosen_letters, letter];
    let new_word_placeholder = "";
    let new_round;
    let new_points;

    let letter_match = this.state.secretWord.indexOf(letter);
    if (letter_match >= 0) {
      this.state.secretWord.split("").forEach((letter) => {
        let match = new_chosen_letters.includes(letter);
        new_word_placeholder += match ? letter : " _ ";
      });
      new_round = this.state.round;
      new_points = [...this.state.points];
      new_points[this.state.round] += this.state.roullete_value;
    } else {
      new_round = this.state.round + 1 > 2 ? 0 : this.state.round + 1;
      new_word_placeholder = this.state.word_placeholder;

      new_points = [...this.state.points];
    }

    this.setState({
      already_chosen_letters: [...this.state.already_chosen_letters, letter],
      word_placeholder: new_word_placeholder,
      end_game: this.state.secretWord == new_word_placeholder ? true : false,
      round: new_round,
      roullete_value: this.runRollete(),
      points: new_points,
    });
  }

  QwertyAlphabetKeyboard() {
    let keyboard = [];

    qwerty_alphabet.forEach((line) => {
      let buttons = [];

      line.forEach((letter) => {
        let already_chosen = this.state.already_chosen_letters.includes(letter);

        buttons.push(
          <Button
            colorScheme="blue"
            isDisabled={already_chosen}
            onClick={() => {
              this.choiceLetter(letter);
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
  }

  renderTablePlacar() {
    let table = [];
    this.state.players.forEach((player, index) => {
      table.push(
        <Tr>
          <Td>{player}</Td>
          <Td isNumeric>{this.state.points[index]}</Td>
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
  }

  getWindowDimensions() {
    const { innerWidth: width, innerHeight: height } = window;
    return {
      width,
      height,
    };
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          {this.state.end_game && <Confetti />}

          <Stack spacing={5} marginBottom={2}>
            <Box w="100%" p={4} color="white">
              <Badge width={"100%"}>
                <Text fontSize="3xl">{this.state.tip}</Text>
              </Badge>
            </Box>

            <Text fontSize="6xl" color="success">
              {this.state.word_placeholder}
            </Text>
            <Text fontSize="xl" color="white">
              {console.log(this.state.round)}
              {console.log(this.state.players)}
              Vez do {this.state.players[this.state.round]}
            </Text>
            <Text color="gray.500" fontSize="md">
              Valendo{" "}
              <Badge colorScheme="green">
                {this.state.roullete_value} pontos
              </Badge>
            </Text>
          </Stack>

          {this.QwertyAlphabetKeyboard()}

          {this.state.end_game &&
            `${this.state.players[this.state.round]} ganhou`}

          {this.renderTablePlacar()}
        </header>
        <AlertDialogComponent
          isOpen={this.state.end_game}
          title={"Fim de jogo"}
          body={`O Jogador ${this.state.players[this.state.round]} ganhou com ${
            this.state.points[this.state.round]
          } pontos`}
          opt={"Novo Jogo"}
        />
      </div>
    );
  }
}

export default Forca;
