'use client'

import { getRandomFloat, getRandomNum } from "@/lib/utils";
import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { useClassicGame } from "./ClassicGameProvider";
import { InvaderType } from "@/types/types";
import clsx from "clsx";

interface InvaderWordProps {
  word: InvaderType,
  speed?: number,
  removeWordById: (id: number) => void;
}

export default function InvaderWord({ 
    word: { delay, id, invaded, hitted, word}, 
    speed=400,
    removeWordById
}: InvaderWordProps) {
  
  const renderInvaderRef = useCallback((node: HTMLDivElement) => {
    if (!node) return;
    var intervalId: NodeJS.Timeout;
    const timeoutId = setTimeout(() => {
      const parentElement = node.parentElement;
      if (!parentElement) return;
      const { offsetHeight, offsetWidth } = parentElement;
      const heightInRem = (offsetHeight / 16) -1;
      const widthInRem = (offsetWidth / 16) -1;
      const startLeft = getRandomNum(widthInRem - word.length);
      node.style.left = `${startLeft}rem`;
  
      var top = 0;
      intervalId = setInterval(() => {
        top = top + 0.5;
        if (top < heightInRem) {
          node.style.top = `${top}rem`
        } else {
          removeWordById(id)
          clearInterval(intervalId);
          return;
        }
      }, speed)
    }, delay);
  }, [])

  return (
    <div 
      className="absolute -top-8 font-extrabold text-lg" 
      ref={renderInvaderRef}
    >
      {word.split("").map((letter, index) => 
        <span 
          key={index}
          className={`${hitted[index] == letter ? "text-red-500" : "text-yellow-500"}`}
        >
          {letter}
        </span>
      )}
    </div>
  )

}