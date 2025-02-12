'use client'

import { useClassicGame } from "@/components/ClassicGameProvider";
import GameOver from "@/components/GameOver";
import InvaderWord from "@/components/InvaderWord";
import { Button } from "@/components/ui/button";
import { getRandomNum } from "@/lib/utils";
import { InvaderType } from "@/types/types";
import Image from "next/image";
import { generate } from "random-words"
import React, { startTransition, useCallback, useEffect, useRef, useState } from "react";

export default function WordInvadersGame() {

  const { resetTimer, updateResult, result } = useClassicGame();

  const totalLives = 4;
  const perLevel = 10;
  const [ invaders, setInvaders ] = useState<InvaderType[]>([]);
  const [ lives, setLives ] = useState<number>(totalLives);
  const invadersCount = useRef<number>(0);
  const intervalRef = useRef<NodeJS.Timeout>(null!);

  const startInvading = () => {
    invadersCount.current = 0;
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    intervalRef.current = setInterval(() => {
      const invaders = invadersCount.current;
      const level = invaders / perLevel;
      const delay = invaders == 0 ? 0 : invaders * getRandomNum(2250, 1200) - (320 * level);
      const speed = getRandomNum(56, 45) - (5 * level);
      const generatedWord = generate({ 
        exactly: 1,
        formatter: (word) => word.toUpperCase(),
        minLength: 6
      })[0];
      const invader = { 
        id: invadersCount.current, 
        word: generatedWord, 
        delay, 
        hitted: [],
        invaded: false,
        speed
      };
      setInvaders(prevInvaders => [...prevInvaders, invader]);
      invadersCount.current++;
    }, getRandomNum(1500, 1000))
  }

  useEffect(() => {
    startInvading();
    return () => {
      clearInterval(intervalRef.current);
    }
  }, [])

  useEffect(() => {
    if (lives == 0) {
      updateResult({ ...result, gameOver: true });
      setInvaders([]);
    }
  }, [lives])

  const handleKeyDown = (event: KeyboardEvent) => {
    const pressedKey = event.key.toUpperCase();
    startTransition(() => {
      var updatedWords = invaders;
      const notInvadedWords = invaders.filter(wrd => !wrd.invaded && wrd.word.length > 0)
      for (let firstWord of notInvadedWords) {
        firstWord.hitted.push(pressedKey);
        const typedText = firstWord.hitted.join("");
        const closestWords = notInvadedWords
          .filter(wrd => wrd.word.startsWith(typedText))
          .sort(wrd => wrd.delay && wrd.speed);
        if (!closestWords.includes(firstWord)) {
          firstWord.hitted = [];
        }
        updatedWords = updatedWords.map(wrd => wrd.id === firstWord.id ? firstWord : wrd);
      }
      updatedWords = updatedWords.filter(({ id, word, hitted }) => {
        if (word == hitted.join("")) {
          const newFound = result.found +1;
          const newResult = { 
            ...result, 
            found: newFound,
            highScore: result.highScore && result.highScore > newFound ? result.highScore : newFound
          };
          updateResult(newResult)
          return false;
        } 
        return true;
      })
      
      setInvaders(updatedWords);
    });
  };
  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown)
    return () => {
      resetTimer();
      document.removeEventListener("keydown", handleKeyDown)
    }
  })

  const removeWordById = useCallback((id: number) => {
    startTransition(() => {
      setInvaders(prevWords => {
        const foundWord = prevWords.find(wrd => wrd.id == id);
        if (foundWord?.word !== foundWord?.hitted.join("")) {      
          setLives(prevLives => prevLives > 0 ? prevLives -1 : prevLives);
        }
        return prevWords.filter(wrd => wrd.id !== id);
      })
    })
  }, [invaders]);

  const handleReset = useCallback(() => {
    updateResult({ found: 0, gameOver: false, won: false })
    setInvaders([]);
    startInvading();
    setLives(totalLives);
    resetTimer();
  }, [])

  return (
    <>
      <div className="flex justify-between items-center">
        <div className="font-bold">SCORE: <span className="font-extrabold">{result.found}</span></div>
        <div className="flex my-2">
          {Array(4).fill(0).map((_, index) => 
            <Image 
              src={index < lives ? "/images/heart.png" : "/images/heart-empty.png"} 
              alt="life" 
              width={24} 
              height={24} 
              key={index}
            />
          )}
        </div>
      </div>
      <div 
        className="bg-[url('/images/nature.png')] h-[25rem] w-[28rem] relative rounded px-4 object-contain bg-cover overflow-hidden" 
      >
        {invaders.length > 0 && invaders.sort(wrd => wrd.delay).map((word) => 
          <InvaderWord
            key={word.id}
            invader={word}
            removeWordById={removeWordById}
          />
        )}
      </div>
      <GameOver
        result={{totalFound: result.found}}
        gameOver={result.gameOver}
        onReset={handleReset}
      />
      <div className="flex my-3 justify-between items-center">
        <Button onClick={() => handleReset()}>
          Restart
        </Button>
        <div className="font-semibold text-lg">HIGH SCORE: <span className="font-extrabold">{result.highScore}</span></div>
      </div>
    </>
  )
}