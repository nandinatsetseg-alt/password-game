"use client";

import confetti from "canvas-confetti";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function TicTacToe() {
    const [ board, setBoard] = useState(Array(9).fill(null));
    const [ xIsNext, setXIsNext] = useState(true);
    const [scores, setScores] = useState({ X: 0, O: 0, draws: 0 });
    const lines = [
        [ 0, 1, 2], [ 3, 4, 5], [ 6, 7, 8],
        [ 0, 3, 6], [ 1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];
    useEffect(() => {
        const link = document.createElement("link");
        link.href = "https://fonts.googleapis.com/css2?family=Press+Start+2P&family=VT323&display=swap";
        link.rel = "stylesheet";
        document.head.appendChild(link);
        return () => {
            if (document.head.contains(link)) document.head.removeChild(link);
        };
    }, []);
    const Ylagch = (squares) => {
        for ( let i = 0; i < lines.length; i++) {
            const [ a, b, c] = lines[i];
            if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
                return squares[a];
            }
        }
        return null;
    }
    const winner = Ylagch(board);
    const isDraw = !winner && board.every((square) => square !== null);
    const winningCombo = lines.find(([a, b, c]) => board[a] && board[a] === board[b] && board[a] === board[c] 
); 
    const hadnleResetScores = () => {
        setScores({ X: 0, O: 0, draws: 0});
    };
    useEffect(() => {
        if (winner) {
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6}
            });
            if (winner === "X") {
                setScores({ X: scores.X + 1, O: scores.O, draws: scores.draws})
            } else if (winner === "O") {
                setScores({ X: scores.X, O: scores.O + 1, draws: scores.draws});
            }
        } else if (isDraw) {
            setScores({ X: scores.X, O: scores.O, draws: scores.draws + 1});
        }
    }, [winner, isDraw]);
    const handleClick = (index) => {
        if (winner || board[index]) return;
        const newBoard = [...board];
        newBoard[index] = xIsNext ? "X" : "O";
        setBoard(newBoard);
        setXIsNext(!xIsNext);
    };
    const handleReset = () => {
        setBoard(Array(9).fill(null));
        setXIsNext(true);
    };
    let status;
    if (winner) {
        status = `Winner: ${winner}`;
    } else if (isDraw) {
        status = "Draw!";
    } else {
        status = `Next player: ${xIsNext ? "X" : "O"}`;
    }
    return (
        <div className="flex flex-col items-center justify-center h-full min-h-screen p-4 sm:p-8 bg-[#f7eed3] text-black font-[VT323]">
            <div className="w-full max-w-sm space-y-4">
                    <div>
                        <Link className="font-['Press_Start_2P'] text-sm px-3 py-2 border-2 border-black bg-yellow-200 shadow-[3px_3px_0px_0px_#000] hover:bg-yellow-100 uppercase inline-block active:translate-y-[1px] active:shadow-none" href="/">Back to Password Game</Link>
                    </div>
                    <div>
                        <div className="text-center font-['Press_Start_2P'] text-[8px] bg-amber-200 border-2 border-black p-1 shadow-[2px_2px_0px_0px_#000]">ROUND: {scores.X + scores.O + scores.draws +1}</div>
                    <div className="grid grid-cols-3 gap-2 text-center font-['Press_Start_2P'] text-[10px]">
                        <div className="border-2 border-black bg-white p-2 shadow-[2px_2px_0px_0px_#000]">X: {scores.X}</div>
                        <div className="border-2 border-black bg-white p-2 shadow-[2px_2px_0px_0px_#000]">DRAWS: {scores.draws}</div>
                        <div className="border-2 border-black bg-white p-2 shadow-[2px_2px_0px_0px_#000]">O: {scores.O}</div>
                    </div>
                    </div>
                    <div className="border-4 border-black p-4 bg-amber-100 shadow-[4px_4px_0px_0px_#000] text-center">
                        <h1 className="font-['Press_Start_2P'] text-base uppercase mb-1">Tic-Tac-Toe</h1>
                        <p className={`text-2xl tracking-wider ${winner ? "text-black" : xIsNext ? "text-red-500" : "text-blue-600"}`}>{status}</p>
                    </div>
                    <div className="grid grid-cols-3 gap-2 bg-amber-50 border-4 border-black p-4 shadow-[4px_4px_0px_0px_#000]">
                        {board.map((square, index) => {
                            const isWinnerSquare = winningCombo?.includes(index);
                            return (
                            <button key={index} onClick={() => handleClick(index)} className={`h-24 border-3 border-black bg-white flex items-center justify-center text-4xl shadow-[2px_2px_0px_0px_#000] active:translate-y-[1px] active:shadow-none hover:bg-amber-100 transition-colors font-bold ${isWinnerSquare ? "bg-green-300" : "bg-white hover:bg-amber-100"}`}>
                                <span className={square === "X" ? "text-red-500" : "text-blue-600"}>{square}</span>
                            </button>
                            )
                        })}
                    </div>
                    <div className="text-center">
                        <button onClick={handleReset} className="font-['Press_Start_2P'] text-[10px] px-6 py-3 border-4 border-black bg-red-400 hover:bg-red-300 shadow-[4px_4px_0px_0px_#000] active:translate-y-[1px] active:shadow-none uppercase">
                            Reset Game
                        </button>
                    </div>
            </div>
        </div>
    )
}