import * as React from "react";
import { useState } from "react";

function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    // é necessário estabelecer uma condição primeiro para saber se o meu quadrado está preenchido ou não, para depois executar a marcação com x ou 0.
    const nextSquares = squares.slice();
    // Aqui estou copiando o meu array de squares para fazer a modificação nesse segundo array e não no original, principio da imutabilidade de reutilizar um estado.
    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "0";
    }
    onPlay(nextSquares);

    // Essa inversão do valor de true para false refere-se a próxima jogada,ou seja, se o valor da minha jogada for x, inverte o proximo valor para false que assim não será x e sim a condição else, 0.
  }

  const winner = calculateWinner(squares);

  let status;
  if (winner) {
    status = "Winner:" + winner;
  } else {
    status = "Next player:" + (xIsNext ? "X" : "0");
  }

  return (
    <>
      <div className="status">{status}</div>
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
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  // [Array(9).fill(null)] representa um Array que contém outro array de 9 posições preenchidos pelo conteúdo nulo. [[null,null...null]]
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];
  // Quando eu tenho uma array seguida de [] eu estou dizendo que quero pegar o index desse array. Com esse movimento eu pego o último board atualizado. Porque a cada joagada pelo metodo do slice eu crio um board atualizado.
  // O history é um array com outros arrays de 9 posições, ou seja, todos os boards da minha jogada. Conforme vou fazendo joagadas vou aumentando meu array único e fazendo o lenght -1 eu pego sempre o ultimo board, ou seja, se tenho 8 jogadas, eu tenho um array de tamanho 8. -1 forma 7. então eu desejo pegar o board que ocupa a posição 7.

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }
  // condição de que seu número deve ser divisível por 2, sem resto, alcançando assim as condições que você estava tentando.
  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = "Go to move #" + move;
    } else {
      description = "Go to game start";
    }
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });
  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
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
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    console.log(squares);
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
// Esse array lines traz todas as combinações possíveis de posições do X ou do 0 para que haja um vencedor. Ou seja, quadrado 0,1,2 é uma das possibilidades.
// for está executando uma coisa, adicionando +1 ao i que começa como zero de acordo com a condição, i ser menor que 8 tamanho do array lines até a condiçaõ não ser mais verdadeira e retornar nulo.
// https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Statements/for
// i++ = i+1, essa condição deve ser adicionada no final enquanto a condição do for, for atendida.

// const[a,b,c] é uma desestruturação,ou seja,basicamente estou dizendo que o conteúdo de cada array do meu array lines será a,b e c. EX: array na posição, i=0: a=0,b=1,c=2. https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment
// O if sempre avalia se algo é true e neste exemplo temos três expressões sendo avaliadas como true separadas pelo e &&.
// Então, se o valor do conteúdo do meu array de posição i for diferente de nulo e undefined ambos com valor de false e o valor desse conteúdo for igual ao conteúdo do lado e igual ao conteúdo do ultimo valor então retorne o valor do conteúdo do meu array, ou seja, X ou 0.
// Se o valor do quadrado de posição 0,X ou 0, determinado pelo value, for igual ao do quadrado de posição 1 e igual ao de posição 2, então retorne o valor do quadrado de posição 0.

// Essa expressão do if me ajuda a saber se no final X ou 0 ganhou.
