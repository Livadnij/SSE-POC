import React, { useState, useEffect } from "react";

const SERVER_URL = "ws://localhost:8080";

const App: React.FC = () => {
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [roomId, setRoomId] = useState<string | null>(null);
  const [inputRoomId, setInputRoomId] = useState("");
  const [gameStarted, setGameStarted] = useState(false);
  const [choice, setChoice] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [playerWins, setPlayerWins] = useState(0);
  const [opponentWins, setOpponentWins] = useState(0);
  const [matchOver, setMatchOver] = useState(false);

  useEffect(() => {
    const socket = new WebSocket(SERVER_URL);

    socket.onopen = () => console.log("Connected to server");

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("Received:", data);

      if (data.type === "roomCreated") {
        setRoomId(data.roomId);
      } else if (data.type === "roomJoined") {
        setRoomId(data.roomId);
        setGameStarted(true);
        resetGame();
      } else if (data.type === "gameStart") {
        setGameStarted(true);
        resetGame();
      } else if (data.type === "gameResult") {
        setResult(
          `Player 1 chose ${data.player1}, Player 2 chose ${data.player2}. ${data.result}`
        );

        if (data.result.includes("wins")) {
          if (data.winner === "player1") {
            setPlayerWins((prev) => prev + 1);
          } else {
            setOpponentWins((prev) => prev + 1);
          }
        }
      }
    };

    socket.onclose = () => console.log("Disconnected from server");

    setWs(socket);
    return () => socket.close();
  }, []);

  useEffect(() => {
    if (playerWins === 3 || opponentWins === 3) {
      setMatchOver(true);
    }
  }, [playerWins, opponentWins]);

  const createRoom = () => {
    if (ws) {
      ws.send(JSON.stringify({ type: "createRoom" }));
    }
  };

  const joinRoom = () => {
    if (ws && inputRoomId) {
      ws.send(JSON.stringify({ type: "joinRoom", roomId: inputRoomId }));
    }
  };

  const makeChoice = (playerChoice: string) => {
    if (matchOver || !gameStarted) return;

    setChoice(playerChoice);
    if (ws && roomId) {
      ws.send(JSON.stringify({ type: "play", choice: playerChoice, roomId }));
    }
  };

  const nextRound = () => {
    setChoice(null);
    setResult(null);
    if (ws && roomId) {
      ws.send(JSON.stringify({ type: "nextRound", roomId }));
    }
  };

  const restartMatch = () => {
    setPlayerWins(0);
    setOpponentWins(0);
    setMatchOver(false);
    nextRound();
  };

  const resetGame = () => {
    setChoice(null);
    setResult(null);
    setMatchOver(false);
  };

  return (
    <div>
      <h1>Rock Paper Scissors - Best of 3</h1>

      {!roomId && (
        <>
          <button onClick={createRoom}>Create Room</button>
          <br />
          <input
            type="text"
            placeholder="Enter Room ID"
            value={inputRoomId}
            onChange={(e) => setInputRoomId(e.target.value)}
          />
          <button onClick={joinRoom}>Join Room</button>
        </>
      )}

      {roomId && <p>Room ID: {roomId}</p>}

      <h3>Score</h3>
      <p>
        You: {playerWins} | Opponent: {opponentWins}
      </p>

      {gameStarted && !choice && !matchOver && (
        <div>
          <h2>Choose your move:</h2>
          <button onClick={() => makeChoice("rock")}>Rock</button>
          <button onClick={() => makeChoice("paper")}>Paper</button>
          <button onClick={() => makeChoice("scissors")}>Scissors</button>
        </div>
      )}

      {choice && !matchOver && <p>You chose: {choice}</p>}

      {result && <h2>{result}</h2>}

      {matchOver ? (
        <>
          <h2>
            🎉{" "}
            {playerWins === 3
              ? "You win the match!"
              : "Opponent wins the match!"}{" "}
            🎉
          </h2>
          <button onClick={restartMatch}>Restart Match</button>
        </>
      ) : (
        result && <button onClick={nextRound}>Next Round</button>
      )}
    </div>
  );
};

export default App;
