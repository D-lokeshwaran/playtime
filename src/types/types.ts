import { icons } from "lucide-react"

export type Card = {
    id: number,
    found: boolean,
    icon: keyof typeof icons,
    flip: boolean
}   

export type Position = {
    start?: number[],
    end?: number[]
}

export type InvaderType = {
    id: number,
    word: string,
    delay: number,
    invaded: boolean,
    hitted: string[]
    speed: number
}
  