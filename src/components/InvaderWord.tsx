'use client'

import { getRandomNum } from "@/lib/utils";
import React, { useCallback } from "react";
import { InvaderType } from "@/types/types";

interface InvaderWordProps {
  invader: InvaderType,
  removeWordById: (id: number) => void;
}

export default function InvaderWord({ 
    invader: { delay, id, invaded, hitted, word, speed}, 
    removeWordById
}: InvaderWordProps) {
  const renderInvaderRef = useCallback((node: HTMLDivElement) => {
    if (!node) return;
    var intervalId: NodeJS.Timeout;
    const timeoutId = setTimeout(() => {
      const parentElement = node.parentElement;
      if (!parentElement) return;
      const { offsetHeight, offsetWidth } = parentElement;
      const parentHeight = (offsetHeight / 16) -1;
      const parentWidth = (offsetWidth / 16) -1;
      const startLeft = getRandomNum(parentWidth - word.length);
      node.style.left = `${startLeft}rem`;
  
      var top = 0;
      intervalId = setInterval(() => {
        top = top + 0.1;
        console.log(Math.floor(top), parentHeight, word)
        if (Math.floor(top) < parentHeight) {
          node.style.top = `${top}rem`
        } else if (Math.floor(top) == parentHeight) {
          removeWordById(id)
          clearInterval(intervalId);
          return;
        }
      }, speed)
    }, delay);
    return () => {
      removeWordById(id)
      clearTimeout(timeoutId);
    }
  }, [InvaderWord])

  return (
    <div 
      className="absolute -top-8 " 
      ref={renderInvaderRef}
    >
      {word.split("").map((letter, index) => 
        <span 
          key={index}
          className={`font-extrabold text-lg ${hitted[index] == letter ? "text-red-500" : "text-yellow-500"}`}
        >
          {letter}
        </span>
      )}
    </div>
  )

}