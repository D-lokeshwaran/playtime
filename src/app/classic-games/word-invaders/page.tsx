'use client'

import { useClassicGame } from "@/components/ClassicGameProvider";
import InvaderWord from "@/components/InvaderWord";
import { InvaderType } from "@/types/types";
import clsx from "clsx";
import { generate } from "random-words"
import React, { useCallback, useEffect, useRef, useState, useTransition } from "react";

export default function WordInvadersGame() {

  const invadersRef = useRef<Map<number, HTMLDivElement | null>>(null!);
  const { tickTimmer } = useClassicGame();

  const totalWords = 20;
  const generateRandomWords = useCallback(() => {
    var words = [] as InvaderType[];
    const generatedWords = generate({ 
      exactly: totalWords,
      formatter: (word) => word.toUpperCase(),
      min: 6
    });
    for(var i=0; i < generatedWords.length; i++) {
      const word = generatedWords[i];
      const delay = i * 2250;
      words.push({ 
        id: i, 
        word, 
        delay, 
        hitted: [],
        invaded: false 
      });
    }
    return words;
  }, [])
  const [ words, setWords ] = useState<InvaderType[]>(generateRandomWords);
  const [isPending, startTransition] = useTransition();

  const initializeTypeEvent = (event: KeyboardEvent) => {
    const pressedKey = event.key.toUpperCase();
    startTransition(() => {
      setWords(prevWords => {
        var updatedWords = prevWords;
        const notInvadedWords = prevWords
          .filter(wrd => !wrd.invaded && wrd.word.length > 0)
          .sort(wrd => wrd.id);
        if (notInvadedWords.length > 0) {
          var firstWord = notInvadedWords[0];
          const { word, hitted, id } = firstWord;
          if (word == hitted.join("")) {
            updatedWords = updatedWords.filter(wrd => wrd.id !== id);
          } 
          if (word.substring(hitted.length).startsWith(pressedKey)) {
            firstWord.hitted.push(pressedKey);
            updatedWords = updatedWords.map(wrd => wrd.id === firstWord.id ? firstWord : wrd);
          }
        }
        return updatedWords;
      })
    });
  };
  useEffect(() => {
    document.addEventListener("keydown", initializeTypeEvent)
    return () => {
      document.removeEventListener("keydown", initializeTypeEvent)
    }
  })

  const removeWordById = useCallback((id: number) => {
    setWords(prevWords => {
      return prevWords.filter(wrd => wrd.id !== id);
    })
  }, [])

  const angle = 80;
  //bg-[url('/images/space.jpg')]
  return (
    <div 
      className="h-[28rem] w-[30rem] border relative rounded px-4  object-contain bg-cover overflow-hidden" 
    >
      {words.map((word) => 
        <InvaderWord
          key={word.id}
          word={word}
          removeWordById={removeWordById}
        />
      )}

      {/* <div className="absolute bottom-0 left-1/2 border px-2">
        S
      </div>
      <div className="absolute rounded-full h-2 w-2 bg-orange-600"/> */}
    </div>
  )
}