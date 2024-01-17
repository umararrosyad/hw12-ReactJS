/* eslint-disable react/jsx-key */
/* eslint-disable react/prop-types */
import React, { useEffect } from "react";
import { Provider, useSelector, useDispatch } from "react-redux";
import { Container, Button, HStack, VStack } from "@chakra-ui/react";
import { Card, CardHeader, CardBody, Heading, useDisclosure } from "@chakra-ui/react";
import { Grid, GridItem } from "@chakra-ui/react";

import { AlertDialog, AlertDialogFooter, AlertDialogHeader, AlertDialogContent, AlertDialogOverlay } from "@chakra-ui/react";

import store from "./store";
import { jumpToMove, playSquare, setWinner, newGame } from "./reducer";
import "./App.css";

function AlertDialogExample() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef();

  const dispatch = useDispatch();
  const winner = useSelector((state) => state.game.winner);
  // Menggunakan useEffect untuk membuka dialog saat komponen dirender
  useEffect(() => {
    onOpen();
  }, [onOpen]);

  let status;
  let bg;
  if (winner == "X") {
    status = "The Winner Is X";
    bg = "red"
  } else if (winner == "O") {
    status = "The Winner Is O";
    bg = "green"
  } else {
    status = "Draw game";
    bg = "teal"
  }
  return (
    <>
      <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose}>
        <AlertDialogOverlay>
          <AlertDialogContent alignItems="center">
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              <Heading as="h1">{status}</Heading>
            </AlertDialogHeader> 

            {/* <AlertDialogBody>{winner()}</AlertDialogBody> */}

            <AlertDialogFooter>
              <Button m={0.5} px={4} py={2} size={2} colorScheme={bg} fontSize={18} onClick={() => dispatch(newGame())}>
                Start New Game
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
}

function Square({ value, onSquareClick }) {
  let bg;
  if (value == "X") {
    bg = "red";
  } else if (value == "O") {
    bg = "green";
  } else {
    bg = "teal";
  }

  return (
    <Button boxSize={24} className="square" fontSize={30} colorScheme={bg} m={2} onClick={onSquareClick}>
      {value}
    </Button>
  );
}

function Board() {
  const dispatch = useDispatch();
  // const xIsNext = useSelector((state) => state.game.xIsNext);
  const squares = useSelector((state) => state.game.history[state.game.currentMove]);

  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    dispatch(playSquare(i));
  }

  const winner = calculateWinner(squares);
  let gotWiner;
  if (winner) {
    gotWiner = () => {
      return <AlertDialogExample />;
    };
  } else {
    gotWiner = () => {
      return;
    };
  }

  useEffect(() => {
    if (winner) {
      dispatch(setWinner(winner));
    }
  }, [dispatch, winner]);

  return (
    <>
      <Card align="center">
        <CardBody>
          <div className="board-row">
            <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
            <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
            <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
          </div>
          <div className="board-row">
            <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
            <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
            <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
          </div>
          <div className="board-row">
            <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
            <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
            <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
          </div>
          {gotWiner(winner)}
        </CardBody>
      </Card>
    </>
  );
}

function Game() {
  const history = useSelector((state) => state.game.history);
  const xIsNext = useSelector((state) => state.game.xIsNext);
  const dispatch = useDispatch();
  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = "#" + move;
    } else {
      return;
    }
    return (
      <GridItem key={move}>
        <Button m={0.5} p={2} size={2} boxSize={10} colorScheme="teal"  border={0.5} borderColor="black" borderStyle="solid" fontSize={14} onClick={() => dispatch(jumpToMove(move))}>
          {description}
        </Button>
      </GridItem>
    );
  });

  const turn = () => {
    let status;
    let bg;
    if (xIsNext) {
      status = "Next player: X";
      bg = "red";
    } else {
      status = "Next player: O";
      bg = "green";
    }
    return (
      <Button mb={2} py={2} px={4} size={2} colorScheme={bg} fontSize={18}>
        {status}
      </Button>
    );
  };
  return (
    <>
      <Heading as="h1" mb={10} color="white">
        Lets Play Tic Tac Toe
      </Heading>
      <HStack gap={5} alignItems="flex-start">
        {/* <Container alignItems="center">
         
        </Container> */}
        <Container maxW="container.sm">
          <Board />
        </Container>
        <VStack>
          <Card align="center" width={200}>
            <CardBody m={0} p={2}>
              <Button m={0.5} px={4} py={2} size={2} colorScheme="red" fontSize={18} onClick={() => dispatch(newGame())}>
                Start New Game
              </Button>
            </CardBody>
          </Card>

          <Card align="center" width={200}>
            <CardBody>
              {turn()}
              <Card align="center" width={170} bg="white" color="black" border={2} borderColor="black" borderStyle="solid">
                <CardHeader>
                  <Heading as="p" fontSize={18} color="black" m={0} p={0}>
                    History Move
                  </Heading>
                </CardHeader>
                <CardBody mt={0} pt={0}>
                  <Grid templateColumns="repeat(3, 1fr)" gap={1}>
                    {moves}
                  </Grid>
                </CardBody>
              </Card>
            </CardBody>
          </Card>
        </VStack>
      </HStack>
    </>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  for (let i = 0; i < lines.length; i++) {
    if (squares[i] == null) {
      return null;
    }
  }
  return "Draw";
}

function App() {
  return (
    <>
      <Provider store={store}>
        <Container maxW="container.xl" rounded={10} m={5} pos="fix" bg={"black"} p={7}>
          <Game />
        </Container>
      </Provider>
    </>
  );
}

export default App;
