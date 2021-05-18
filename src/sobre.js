import * as React from "react";

// 1. import `ChakraProvider` component
import { ChakraProvider } from "@chakra-ui/react";
import { Button, ButtonGroup } from "@chakra-ui/react";
function Sobre({ Component }) {
  // 2. Use at the root of your app
  return <Button colorScheme="blue">Sobre</Button>;
}

export default Sobre;
