import * as React from "react";

// 1. import `ChakraProvider` component
import { ChakraProvider } from "@chakra-ui/react";
import { Button, ButtonGroup } from "@chakra-ui/react";
import Routes from "./routes/Routes";
function App({ Component }) {
  // 2. Use at the root of your app
  return (
    <ChakraProvider>
      <Routes />
    </ChakraProvider>
  );
}

export default App;
