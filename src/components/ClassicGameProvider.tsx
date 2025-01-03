'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from 'react';

type Result = {
  found: number;
  won?: boolean;
  gameOver?: boolean;
  highScore?: number;
};

interface ClassicContextType {
  result: Result;
  timeLimit: string;
  gameStarted: boolean;
  updateResult: (newResult: Result) => void;
  tickTimer: () => void;
  resetTimer: () => void;
}

const initialResult: Result = {
  found: 0,
  won: false,
  gameOver: false,
  highScore: 0,
};

const ClassicGameContext = createContext<ClassicContextType | undefined>(undefined);

export default function ClassicGameProvider({
  id,
  children,
  timeLimit,
}: {
  id: string;
  children: React.ReactNode;
  timeLimit: string;
}) {
  const [result, setResult] = useState<Result>(() => {
    if (typeof window !== "undefined") {
        const storedHighScore = Number(localStorage.getItem('highScore')) || 0;
        return { ...initialResult, highScore: storedHighScore };
    }
    return initialResult;
  });
  const [timer, setTimer] = useState<string>(timeLimit);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const gameStarted = timer !== timeLimit;

  const resetTimer = useCallback(() => {
    setTimer(timeLimit);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, [timeLimit]);

  const tickTimer = useCallback(() => {
    if (intervalRef.current) return;
    intervalRef.current = setInterval((result) => {
        const { won } = result;
        if (won) return;
        setTimer(prevTimmer => {
            var newTimmer = Number(prevTimmer) - 0.01; // simple timmer
            const stringTimmer = newTimmer.toString();
            const [min, sec] = stringTimmer.split(".");
            if (sec == "99") newTimmer = Number(`${min}.59`);

            const roundedTime = newTimmer.toFixed(2);
            if (roundedTime == "0.00") {
                resetTimer();
                setResult(prevResult => {
                    return {...prevResult, gameOver: true};
                });
            }
            return roundedTime;
        });
    }, 1000, result);
}, [resetTimer, setTimer, setResult, result])

  const updateResult = useCallback(
    (newResult: Result) => {
      setResult((prev) => {
        const updatedResult = { ...prev, ...newResult };
        if (updatedResult.highScore && updatedResult.highScore > (prev.highScore || 0)
            && typeof window !== "undefined") {
          localStorage.setItem('highScore', updatedResult.highScore.toString());
        }
        return updatedResult;
      });
    },
    [setResult],
  );

  const value = useMemo(
    () => ({
      result,
      timeLimit: timer,
      gameStarted,
      updateResult,
      tickTimer,
      resetTimer,
    }),
    [result, timer, gameStarted, updateResult, tickTimer, resetTimer],
  );

  return <ClassicGameContext.Provider value={value}>{children}</ClassicGameContext.Provider>;
}

export const useClassicGame = () => {
  const context = useContext(ClassicGameContext);
  if (!context) {
    throw new Error('useClassicGame must be used within ClassicGameProvider');
  }
  return context;
};
