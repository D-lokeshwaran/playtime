'use client'

import React, { useState, useCallback } from 'react';
import { icons } from 'lucide-react';
import FlipCard from "@/components/FlipCard";
import { Button } from '@/components/ui/button';
import { Card } from '@/types/types';
import { useClassicGame } from '@/components/ClassicGameProvider';
import GameOver from '@/components/GameOver';

export default function MemorizeGamePlay() {

    const totalPairs = 20;
    const generateInitialCards = useCallback(() => {
        const iconNames = Object.keys(icons);
        const selectedCards = Array.from(
            {length: totalPairs},
            () => iconNames[Math.floor(Math.random() * iconNames.length)]
        );

        const cards = selectedCards.flatMap((icon, index) => [
            { id: index * 2, found: false, icon, flip: false },
            { id: index * 2 +1, found: false, icon, flip: false }
        ]) as Card[]

        for (let i = cards.length -1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i +1));
            [cards[i], cards[j]] = [cards[j], cards[i]];
        }
        
        return cards;
    }, []);
    const [ cards, setCards ] = useState<Card[]>(generateInitialCards);
    const { result, resetTimer, tickTimer, updateResult} = useClassicGame();

    const handleFlipCard = useCallback((cardId: number) => {
        setCards((prevCards) => {
            const updatedCards = prevCards.map((card) =>
                card.id === cardId ? { ...card, flip: true } : card
            );
    
            const currentlyFlipped = updatedCards.filter((card) => card.flip && !card.found);
    
            if (currentlyFlipped.length === 2) {
                const [firstCard, secondCard] = currentlyFlipped;
    
                if (firstCard.icon === secondCard.icon) {
                    setTimeout(() => {
                        const isWon = result.found +1 == totalPairs ? true : false;
                        updateResult({ 
                            ...result, 
                            found: result.found +1, 
                            won: isWon
                        })
                        if (isWon) {
                            resetTimer();
                        }
                    }, 360);
                    return updatedCards.map((card) =>
                        card.icon === firstCard.icon ? { ...card, found: true, flip: false } : card
                    );
                } else {
                    setTimeout(() => {
                        setCards((prev) =>
                            prev.map((card) =>
                                card.id === firstCard.id || card.id === secondCard.id
                                ? { ...card, flip: false }
                                : card
                            )
                        );
                    }, 360);
                }
            }
            return updatedCards;
        });
        tickTimer();
    }, [updateResult, result, setCards]);

    const handleReset = () => {
        setCards(generateInitialCards)
        updateResult({ gameOver: false, won: false, found: 0})
        resetTimer();
    }

    return (
        <div className='flex flex-col gap-2 items-center'>
            <div className="flex justify-center flex-wrap gap-2 object-center sm:py-14 w-[32rem]">
                {cards.map(card => 
                    <FlipCard card={card} key={card.id} onFlip={handleFlipCard}/>
                )}
            </div>
            <Button variant={'secondary'} onClick={handleReset}>
                Restart
            </Button>
            <GameOver
                gameOver={result.gameOver}
                result={{ totalFound: result.found }}
                onReset={() => handleReset()}
            />
        </div>
    )
}