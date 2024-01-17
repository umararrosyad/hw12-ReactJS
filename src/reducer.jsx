import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    history: [Array(9).fill(null)],
    currentMove: 0,
    xIsNext : true,
    winner : null,
  };

  export const gameSlice = createSlice({
    name: 'game',
    initialState,
    reducers: {
      playSquare(state, action) {
        const nextSquares = [...state.history[state.currentMove]];
        nextSquares[action.payload] = state.xIsNext ? 'X' : 'O';
        // const nextHistory = [...state.history, nextSquares];
        const nextHistory = [...state.history.slice(0, state.currentMove + 1), nextSquares];
  
        state.history = nextHistory;
        state.currentMove = nextHistory.length - 1;
        state.xIsNext = !state.xIsNext;
      },
      jumpToMove(state, action) {
        state.currentMove = action.payload;
        state.xIsNext = state.currentMove % 2 === 0
      },
      setWinner(state, action){
        state.winner = action.payload
      },
      newGame(state){
        state.history = [Array(9).fill(null)]
        state.currentMove = 0
        state.xIsNext = true
        state.winner = null
      }
    },
  });

  export const { playSquare, jumpToMove, setWinner, newGame} = gameSlice.actions;

  export default gameSlice.reducer;