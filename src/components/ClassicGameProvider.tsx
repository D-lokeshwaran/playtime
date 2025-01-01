'use client'

import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';

type Result = {
    found: number,
    won?: boolean,
    gameOver?: boolean
}
interface ClassicContextType {
    result: Result,
    timeLimit: string,
    gameStarted: boolean,
    updateResult: (newResult: Result) => void,
    tickTimmer: () => void,
    resetTimmer: () => void
}

const initialResult = {
    found: 0,
    won: false,
    gameOver: false
}
const ClassicGameContext = createContext<ClassicContextType>({
    result: initialResult,
    timeLimit: '0.00',
    gameStarted: false,
    updateResult: () => undefined,
    tickTimmer: () => undefined,
    resetTimmer: () => undefined
});

export default function ClassicGameProvider({ 
    id, 
    children,
    timeLimit
}: {
    id: string,
    children: React.ReactNode,
    timeLimit: string
}) {

    const [result, setResult] = useState<Result>(initialResult);
    const [timmer, setTimmer] = useState<string>(timeLimit);
    const intervalRef = useRef<any>(null!);
    const gameStarted = timmer !== timeLimit;

    const resetTimmer = () => {
        setTimmer(timeLimit);
        clearInterval(intervalRef.current);
        intervalRef.current = undefined;
    }

    const tickTimmer = useCallback(() => {
        if (intervalRef.current) return;
        intervalRef.current = setInterval((result) => {
            const { won } = result;
            if (won) return;
            setTimmer(prevTimmer => {
                var newTimmer = Number(prevTimmer) - 0.01; // simple timmer
                const stringTimmer = newTimmer.toString();
                const [min, sec] = stringTimmer.split(".");
                if (sec == "99") newTimmer = Number(`${min}.59`);

                const roundedTime = newTimmer.toFixed(2);
                if (roundedTime == "0.00") {
                    resetTimmer();
                    setResult(prevResult => {
                        return {...prevResult, gameOver: true};
                    });
                }
                return roundedTime;
            });
        }, 1000, result);
    }, [resetTimmer, setTimmer, setResult, result])

    const updateResult = (newResult: Result) => {
        setResult({...result, ...newResult});
    }
    const value = useMemo(() => {
        return {
            result,
            timeLimit: timmer,
            gameStarted,
            updateResult,
            tickTimmer,
            resetTimmer
        }
    }, [result, timmer, gameStarted, updateResult, tickTimmer, resetTimmer])

    return (
        <ClassicGameContext.Provider value={value}>
            {children}
        </ClassicGameContext.Provider>
    )
}

export const useClassicGame = () => {
    const newClasicGame = useContext(ClassicGameContext);
    if (!newClasicGame) {
        throw Error("We should use useClassicGame within ClassicGameProvider");
    }
    return newClasicGame;
}