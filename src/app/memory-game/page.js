"use client";
import Link from "next/link";
import { useEffect, useState} from "react";
export default function MemoryGame() {
    const [cards, setCards] = useState([
        { id: 1, name: "Strawberry", flipped: false, matched: false},
        {id: 2, name: "Blueberry", flipped : false, matched: false},
        {id: 3, name: "Lemon", flipped: false, matched: false},
        {id: 4, name: "Strawberry", flipped: false, matched: false},
        {id: 5, name: "Blueberry", flipped: false, matched: false},
        {id: 6, name: "Lemon",  flipped: false, matched: false},
    ]);
    const [firstCard, setFirstCard] = useState(null);
    const [locked, setLocked] = useState(false);
    const shuffleCards = (array) => {
        return [...array].sort(() => Math.random() - 0.5);
    };
    useEffect(() => {
        setCards(shuffleCards([...cards]));
        const link = document.createElement("link");
        link.href = "https://fonts.googleapis.com/css2?family=Press+Start+2P&family=VT323&display=swap";
        link.rel = "stylesheet";
        document.head.appendChild(link);
        return () => {
            if (document.head.contains(link)) document.head.removeChild(link);
        };
    }, []);
    const handleClick = (id) => {
        if (locked) return;
        const clicked = cards.find((c) => c.id === id);
        if (clicked.flipped || clicked.matched) return;
        setCards(cards.map((c) => (c.id === id ? {...c, flipped: true} : c )));
        if (!firstCard) {
            setFirstCard(clicked);
        } else {
            setLocked(true);
            if (firstCard.name === clicked.name) {
                setCards(cards.map((c) => (c.name === clicked.name ? {...c, matched: true} : c)));
                resetTurn(); 
            } else {
                setTimeout(() => {setCards(cards.map((c) => (c.id === firstCard.id || c.id === clicked.id ? {...c, flipped: false} : c))
            )
            resetTurn();
    }, 750);
            }
        }
    }
    const resetTurn = () => {
        setFirstCard(null);
        setLocked(false);
    };
    const resetGame = () => {
        setCards(cards.map((c) => ({...c, flipped: false, matched: false})));
        setFirstCard(null);
        setLocked(false);
    };
    const IsWinner = cards.every((c) => c.matched);
    return (
        <div className="flex flex-col items-center justify-center h-full min-h-screen p-4 sm:p-8 bg-[#f7eed3] text-black font-[VT323]">
            <div className="w-full max-w-sm space-y-4">
                <div>
                    <Link className="font-['Press_Start_2P'] text-sm px-3 py-2 border-2 border-black bg-yellow-200 shadow-[3px_3px_0px_0px_#000] hover:bg-yellow-100 uppercase inline-block active:translate-y-[1px] active:shadow-none" href="/">Back to the Password Game</Link>
                </div>
                <div className="border-4 border-black p-4 bg-amber-100 shadow-[4px_4px_0px_0px_#000] text-center">
                    <h1 className="font-['Press_Start_2P'] text-base uppercase mb-1 ">Memory Game</h1>
                    <p className="text-2xl tracking-wider">
                        {IsWinner ? "You Wonnn!!!" : "Match the cards!"}
                    </p>
                </div>
                <div className="grid grid-cols-3 gap-3 bg-amber-50 border-4 border-black p-4 shadow-[4px_4px_0px_0px_#000]">
                    {cards.map((card) => {
                        return (
                            <div key={card.id} onClick={() => handleClick(card.id)} className={`h-24 border-3 border-black flex items-center justify-center text-xl p-1 text-center shadow-[2px_2px_0px_0px_#000] cursor-pointer transition-colors font-bold ${card.flipped || card.matched ? "bg-white text-red-500" : "bg-amber-200 hover:bg-amber-300 text-transparent"}`}> 
                                {card.flipped || card.matched ? card.name : "?"}
                            </div>
                        );
                    })}
                </div>
                <div>
                    <div></div>
                    <button onClick={resetGame} className="font-['Press_Start_2P'] text-[10px] px-6 py-3 border-black border-4 bg-red-400 hover:bg-red-300 shadow-[4px_4px_0px_0px_#000] active:translate-y-[1px] active:shadow-none uppercase">Reset Game</button>
                </div>
                <input placeholder="Any recommedations are okau"/>
            </div>
        </div>
    )
}