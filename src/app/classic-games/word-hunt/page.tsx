'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { generate } from "random-words";
import CharBox from '@/components/CharBox';
import { getRandom, getRandomNum } from '@/lib/utils';
import { Position } from '@/types/types';
import clsx from 'clsx';
import { Button } from '@/components/ui/button';
import { useClassicGame } from '@/components/ClassicGameProvider';
import GameOver from '@/components/GameOver';

const directions = [
    "left",
    "right",
    "top",
    "bottom",
    "bottomLeft",
    "bottomRight",
    "topLeft",
    "topRight",
];

type RandomWordType = {
    word: string,
    position: number[][],
    found: boolean,
}

export default function WordHuntGamePlay() {
    const totalWords = 10;
    const gridSize = 12;
    const maxRetries = 100;
    const [randomWords, setRandomWords] = useState<RandomWordType[]>([]);
    const [charBlocks, setClarBlocks] = useState<string[][]>([]);
    const [currentPosition, setCurrentPosition] = useState<Position>({});
   const { result, gameStarted, updateResult, tickTimer, resetTimer } = useClassicGame();

    useEffect(() => {
        const randomWords = generatedRandomWords();
        const charBlocks = initializeCharsBlocks(randomWords);
        setClarBlocks(charBlocks);
    }, []);

    const generatedRandomWords = useCallback(() => {
        return generate({
            exactly: totalWords,
            maxLength: gridSize - 3,
            formatter: (word) => word.toUpperCase(),
            seed: `rdwordsltr${Math.random() * 1000}`,
        }) as string[];
    }, [totalWords])

    const initializeCharsBlocks = useCallback((randomWords: string[]) => {
        const grid = Array(gridSize).fill(null).map(() => Array(gridSize).fill(null));

        const incrementPosition = (direction: string, x: number, y: number) => {
            let newX = x, newY = y;
            switch (direction) {
                case "left":
                    --newY;
                    break;
                case "right":
                    ++newY;
                    break;
                case "top":
                    --newX;
                    break;
                case "bottom":
                    ++newX;
                    break;
                case "bottomLeft":
                    ++newX;
                    --newY;
                    break;
                case "bottomRight":
                    ++newX;
                    ++newY;
                    break;
                case "topLeft":
                    --newX;
                    --newY;
                    break;
                case "topRight":
                    --newX;
                    ++newY;
                    break;
            }
            return [newX, newY];
        }

        const canPlaceWord = (word: string, x: number, y: number, direction: string) => {
            for (let i = 0; i < word.length; i++) {
                const letter = word[i];
                const [newX, newY] = incrementPosition(direction, x, y);
                var x = newX, y = newY;
                if (
                    newX < 0 || newY < 0 ||
                    newX >= gridSize || newY >= gridSize ||
                    (grid[newX][newY] !== null && grid[newX][newY] !== letter)
                ) {
                    return false;
                }
            }
            return true;
        };

        const placeWord = (word: string, x: number, y: number, direction: string) => {
            var position = Array();
            for (let i = 0; i < word.length; i++) {
                const letter = word[i];
                const [newX, newY] = incrementPosition(direction, x, y);
                var x = newX, y = newY;
                grid[x][y] = letter;
                position.push([x, y]);
            }
            setRandomWords(prevWords => {
                if (prevWords.length < totalWords) {
                    return [...prevWords, { 
                        word, 
                        position, 
                        found: false
                    }]
                } 
                return prevWords;
            })
        };

        const fillEmptyCells = () => {
            const alphabets = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
            for (let row = 0; row < gridSize; row++) {
                for (let col = 0; col < gridSize; col++) {
                    if (grid[row][col] === null) {
                        grid[row][col] = alphabets[getRandomNum(alphabets.length)];
                    }
                }
            }
        };

        for (let word of randomWords) {
            let placed = false;
            let attempts = 0;
            while (!placed && attempts < maxRetries) {
                const x = getRandomNum(gridSize);
                const y = getRandomNum(gridSize);
                const direction = getRandom(directions);
                if (canPlaceWord(word, x, y, direction)) {
                    placeWord(word, x, y, direction);
                    placed = true;
                }
                attempts++;
            }

            if (!placed) {
                console.warn(`Could not place word: ${word}`);
            }
        }

        fillEmptyCells();
        return grid;
    }, [gridSize]);

    const verifyAndUpdateWordFound = (mouseStart: number[], mouseEnd: number[]) => {
        var isFound = false;
        randomWords.forEach(randomWord => {
            const { word, position } = randomWord;
            const wordStart = JSON.stringify(position[0]);
            const wordEnd = JSON.stringify(position[position.length -1]);
            if (JSON.stringify(mouseStart) === wordStart && JSON.stringify(mouseEnd) === wordEnd) {
                const updatedWords = randomWords.map(storedWord => {
                    if (storedWord.word == word) {
                        storedWord.found = true;
                    }
                    return storedWord;
                }) 
                setRandomWords(updatedWords)
                const allFound = updatedWords.every(word => word.found);
                updateResult({...result, found: result.found +1, won: allFound });
                isFound = true
            }
        })
        return isFound;
    };

    const handleStartPosition = (position: number[]) => {
        setCurrentPosition({ 
            start: position,
            end: []
        })
        tickTimer();
    }

    const handleEndPosition = (position: number[]) => {
        if (currentPosition.start) {
            const found = verifyAndUpdateWordFound(currentPosition.start, position);
            setCurrentPosition(found ? { ...currentPosition, end: position } : {});
        }
    }
    const handleReset = (gameStarted?: boolean) => {
        if (gameStarted !== undefined && gameStarted === false) return;
        setRandomWords([]);
        const randomWords = generate({
            exactly: totalWords,
            maxLength: gridSize - 3,
            formatter: (word) => word.toUpperCase(),
            seed: `rdwordsltr${Math.random() * 1000}`,
        }) as string[];
        const charBlocks = initializeCharsBlocks(randomWords);
        setClarBlocks(charBlocks);
        setCurrentPosition({});
        resetTimer();
        updateResult({ found: 0, gameOver: false, won: false })
    }

    return (
        <div className='flex gap-3 flex-col'>
            <div className='flex gap-4'>
                <div className={`flex flex-col w-[${gridSize + 10}rem] select-none`}>
                    {charBlocks.map((char, row) => (
                        <div className="flex" key={row}>
                            {char.map((char, col) => {
                                const { start, end }= currentPosition;
                                var isActive = 
                                    (start && start[0] == row && start[1] == col) ||
                                    (end && end[0] == row && end[1] == col);
                                randomWords.forEach(randomWord => {
                                    const { found, position } = randomWord;
                                    if (found) {
                                        position.forEach(pos => {
                                            if (JSON.stringify(pos) === `[${row},${col}]`) {
                                                isActive = true;
                                            }
                                        })
                                    }
                                })
                                return (
                                    <CharBox 
                                        key={`${row}-${col}`}
                                        position={[row, col]}
                                        active={isActive}
                                        char={char} 
                                        onMouseDown={handleStartPosition}
                                        onMouseUp={handleEndPosition}
                                    />
                                
                                )}
                            )}
                        </div>
                    ))}
                </div>
                <div className="flex flex-col">
                    {randomWords.map(({ word, found }) => (
                        <div
                            className={clsx("rounded border-l-2 border-gray-500/50 text-sm min-w-32 border p-1 px-2 font-extrabold", {
                                "line-through": found
                            })}
                            key={word}
                        >
                            {word}
                        </div>
                    ))}
                </div>
            </div>
            <Button 
                variant={'default'} 
                size={'lg'} 
                className={clsx("bg-gradient-to-r from-violet-500 to-fuchsia-500 font-extrabold text-lg", {
                    'cursor-not-allowed opacity-[0.8]': !gameStarted
                })}
                onClick={() => handleReset(gameStarted)}
            >
                Restart
            </Button>
            <GameOver 
                gameOver={result.gameOver} 
                result={{totalFound: result.found}}
                onReset={() => handleReset()}
            />
        </div>
    );
}
