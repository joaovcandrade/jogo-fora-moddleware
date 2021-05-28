import { useToast } from "@chakra-ui/react";

import React, { useState, useEffect } from "react";

function AlertToast(props) {
  const toast = useToast();

  return toast({
    title: "props.title",
    status: "props.status",
    description: "props.description",
    position: "top",
    duration: 2000,
    isClosable: true,
  });
}

export default AlertToast;
