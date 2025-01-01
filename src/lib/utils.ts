import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getRandom(array: any[]) {
  const randomIndex = getRandomNum(array.length);
  return array[randomIndex];
}

export function getRandomNum(max: number, min: number = 0, floor: boolean =true): number {
  const randomNum = Math.random() * (max - min) + min;
  return floor ? Math.floor(randomNum) : randomNum;
}

export function getRandomFloat(max: number, toFixed: number = 2) {
  const min = 0.00
  const floatNum = getRandomNum(max, min, false).toFixed(toFixed);
  return Number(floatNum);
}

export function stringToColor(str: string) {
  let hash = 0;
  for (var i =0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const c = (hash & 0x00ffffff).toString(16).toUpperCase();
  return "#" + "00000".substring(0, 6 - c.length) + c;
}
