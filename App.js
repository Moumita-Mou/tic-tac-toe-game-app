import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, SafeAreaView, TouchableOpacity } from 'react-native';

const screenWidth = Dimensions.get('window').width; //calculating screen dimension
const boxSize = screenWidth * 0.3; //calculating box-size as per screen width
const borderWeight = 2;

export default function App() {
  
  //storing state
  const [boardUI, setBoardUI] = useState({
    board: ['O', 'O', 'X', 'X', 'O', 'O', 'X', 'X', 'O'],
    gameStarted: false,
    currentPlayer: 'X',
    gameEnded: false,
    winner: '',
  });

  useEffect(() => {
    checkGameStatus();
  }, [boardUI.board]); // eslint-disable-line react-hooks/exhaustive-deps

//checking game-status
  const checkGameStatus = () => {
    const { board } = boardUI;

//calculating the scenerios for victory   
    const victoryLine = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], //Rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], //Columns
      [0, 4, 8], [2, 4, 6] //Diagonals
    ];

    for (const line of victoryLine) {
      const [a, b, c] = line;
      if (board[a] !== ' ' && board[a] === board[b] && board[b] === board[c]) {
        setBoardUI((prevState) => ({
          ...prevState,
          gameEnded: true,
          winner: board[a],
        }));
        break;
      }
    }

    if (!board.includes(' ')) {
      setBoardUI((prevState) => ({
        ...prevState,
        gameEnded: true,
        winner: 'Both',
      }));
    }
  };

//Manage each player's click on the board boxes
  const manageBoxClick = (index) => {
    const { board, currentPlayer, gameStarted, gameEnded } = boardUI;

    if (gameStarted && !gameEnded && board[index] === ' ') {
      const updatedBoard = [...board];
      updatedBoard[index] = currentPlayer;

      setBoardUI((prevState) => ({
        ...prevState,
        board: updatedBoard,
        currentPlayer: currentPlayer === 'X' ? 'O' : 'X',
      }));
    }
  };

//Manage click on the play button
  const managePlayButtonClick = () => {
    const { gameStarted } = boardUI;

    if (gameStarted) {
      setBoardUI((prevState) => ({
        ...prevState,
        board: ['O', 'O', 'X', 'X', 'O', 'O', 'X', 'X', 'O'],
        gameStarted: false,
        gameEnded: false,
        winner: '',
      }));
    } else {
      setBoardUI((prevState) => ({
        ...prevState,
        board: [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        gameStarted: true,
        gameEnded: false,
        winner: '',
      }));
    }
  };

  return (
    //allowing safe margins
    <SafeAreaView style={styles.safeAreaView}>
      <View style={styles.container}>
        <Text style={styles.title}>Tic-Tac-Toe</Text>
        {boardUI.gameStarted ? (
          <>
           {/*Game-board interaction*/}
            <View style={styles.boardContainer}>
              {boardUI.board.map((box, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.box}
                  onPress={() => manageBoxClick(index)}
                  disabled={box !== ' ' || boardUI.gameEnded}
                >
                  <Text style={styles.boxText}>{box}</Text>
                </TouchableOpacity>
              ))}
            </View> 

            {/*Game-status message*/}
            <Text style={styles.message}>
              {boardUI.gameEnded ? `Game Over! Winner: ${boardUI.winner}` : `Current Player: ${boardUI.currentPlayer}`}
            </Text> 

            {/*Exit button*/}
            <TouchableOpacity style={styles.playButton} onPress={managePlayButtonClick}>
              <Text style={styles.buttonText}>Exit Game</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
           {/*Game Board*/}
            <View style={styles.boardContainer}>
              {boardUI.board.map((box, index) => (
                <View key={index} style={styles.box}>
                  <Text style={styles.boxText}>{box}</Text>
                </View>
              ))}
            </View>

             {/*Play button*/}
            <TouchableOpacity style={styles.playButton} onPress={managePlayButtonClick}>
              <Text style={styles.buttonText}>Play Game</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  //container styling
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  //safe margins
  safeAreaView: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  //Game title styling
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    fontStyle: "italic",
    marginBottom: 20,
    color: 'green'
  },

  //board styling
  boardContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    width: boxSize * 3 + borderWeight * 2,
    display: 'flex',
  },
  box: {
    width: boxSize,
    height: boxSize,
    borderWidth: borderWeight,
    borderColor: 'teal',
    alignItems: 'center',
    justifyContent: 'center',
    display: 'flex',
  },
  boxText: {
    fontSize: boxSize * 0.4,
    fontWeight: 'bold',
    color: 'indigo',
  },
  //play and exit button styling
  playButton: {
    marginTop: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: 'red',
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  //win or lose game status message styling
  message: {
    marginTop: 10,
    fontSize: 25,
    fontWeight: 'bold',
    color: 'indigo',
  },
});
