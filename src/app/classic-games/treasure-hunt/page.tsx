'use client'

import { useClassicGame } from "@/components/ClassicGameProvider";
import { getRandom } from "@/lib/utils";
import clsx from "clsx";
import Image from "next/image";
import { useEffect, useRef, useState } from "react"

type Cell = {top: number, right: number, bottom: number, left: number};
const defaultCell: Cell = { top: 1, right: 1, bottom: 1, left: 1};

// to clear neighbour cell wall
const oppositeDirection = {
    top: "bottom",
    right: "left",
    bottom: "top",
    left: "right"
}

export default function TreasureHuntGame() {
    const size = 12;

    const [maze, setMaze] = useState<Cell[]>(
        Array.from({length: size*size}, () => defaultCell)
    );
    const [playerIdx, setPlayerIdx] = useState<number>(0);
    const { result, updateResult } = useClassicGame();
    const stack = useRef<number[]>([]);
    const visitedCells = useRef<Set<number>>(new Set());

    useEffect(() => {
        generateMaze();
    }, []);

    useEffect(() => {
        if (playerIdx !== size * size -1) {
            document.addEventListener("keydown", handleUpdatePlayerPosition);
        }
        return () => {
            document.removeEventListener('keydown', handleUpdatePlayerPosition);
        }
    }, [maze, playerIdx])

    function getNeighbourCells(currentIdx: number) {
        return {
            top: currentIdx % size === 0 ? -1 : currentIdx - size,
            right: (currentIdx + 1) % size === 0 ? -1 : currentIdx +1,
            bottom: currentIdx >= size * size - size ? -1 : currentIdx + size,
            left: currentIdx % size === 0 ? -1 : currentIdx -1
        }
    }

    function generateMaze(currentIdx=0) {
        if (visitedCells.current.size < maze.length) {
            visitedCells.current.add(currentIdx);

            const neighbouringCellIdxs = getNeighbourCells(currentIdx);
            
            const availableDirections = Object.keys(neighbouringCellIdxs).filter(dir => {
                const neighbourCellIdx = neighbouringCellIdxs[dir as keyof Cell];
                const neighbourCell = maze[neighbourCellIdx];
                return !!neighbourCell && !visitedCells.current.has(neighbourCellIdx)
            })

            const randomNeighbourDirection = getRandom(availableDirections) as keyof Cell;

            if (randomNeighbourDirection) {
                stack.current.push(currentIdx);

                setMaze(prevMaze => 
                    prevMaze.map((cell, idx) => {
                        if (idx === currentIdx) {
                            return {...cell, [randomNeighbourDirection]: 0};
                        } 
                        if (idx === neighbouringCellIdxs[randomNeighbourDirection]) {
                            return { ...cell, [oppositeDirection[randomNeighbourDirection]]: 0}
                        }
                        return cell;
                    })
                )

                return generateMaze(neighbouringCellIdxs[randomNeighbourDirection])
            }

            if (stack.current.length > 0) {
                const lastStackIdx = stack.current.pop(); 
                return generateMaze(lastStackIdx); // recurse back to cell with neighbours
            }

        }
        return null;
    }

    function handleUpdatePlayerPosition(event: KeyboardEvent) {
        if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
        if (event.key.includes("Arrow")) {
            event.preventDefault();
            const currentCell = maze[playerIdx];
            const keys = {
                ArrowUp: {
                    move: size * -1,
                    check: playerIdx >= size && !currentCell.top,
                },
                ArrowRight: {
                    move: 1,
                    check: playerIdx % size !== size - 1 && !currentCell.right,
                },
                ArrowDown: {
                    move: size,
                    check: playerIdx < maze.length - size && !currentCell.bottom,
                },
                ArrowLeft: {
                    move: -1,
                    check: playerIdx % size !== 0 && !currentCell.left,
                },
            };
            const key = keys[event.key as keyof typeof keys];
            if (key.check) {
                const nextIdx = playerIdx + key.move;
                setPlayerIdx(nextIdx);
                if (nextIdx == size * size -1) {
                    updateResult({...result, won: true });
                    document.removeEventListener("keydown", handleUpdatePlayerPosition);
                }
            }
        }
    }
    
    return (
        <div className="flex w-[30rem] flex-wrap">
            {maze?.map((cell, cellIndex) => 
                <div key={cellIndex} className={clsx(`border border-white h-10 w-10`, {
                    'border-l-transparent': cell.left == 0,
                    'border-r-transparent': cell.right == 0,
                    'border-t-transparent': cell.top == 0,
                    'border-b-transparent': cell.bottom == 0,
                })}>
                    {cellIndex === playerIdx && <Image
                        src={"/images/adventurer.png"}
                        alt="adventurer help"
                        height={50}
                        width={50}
                    />}
                    {cellIndex === size * size -1 && cellIndex != playerIdx && <Image
                        src={"/images/treasure.png"}
                        alt="adventurer help"
                        height={50}
                        width={50}
                    />}
                </div>
            )}
        </div>
    )
}