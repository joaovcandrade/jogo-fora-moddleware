import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
} from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import { Button } from "@chakra-ui/react";

function AlertDialogComponent(props) {
  const [isOpen, setIsOpen] = React.useState(props.isOpen);
  const onClose = () => setIsOpen(false);

  return (
    <>
      <AlertDialog isOpen={props.isOpen} onClose={onClose}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              {props.title}
            </AlertDialogHeader>

            <AlertDialogBody>{props.body}</AlertDialogBody>

            <AlertDialogFooter>
              <Button
                colorScheme="red"
                onClick={() => {
                  window.location.reload();
                }}
                ml={3}
              >
                {props.opt}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
}

export default AlertDialogComponent;
