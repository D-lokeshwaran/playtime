'use client';

import React from "react";
import ClassicGameProvider, { useClassicGame } from "./ClassicGameProvider";
import ReactConfetti from "react-confetti";

interface ClassicType {
    name: string,
    timeLimit?: string,
    onRestart?: () => void,
    children: React.ReactNode
}
function ClassicGame({ name, timeLimit, onRestart, children }: ClassicType) {
  
  return (
    <ClassicGameProvider id={name} timeLimit={timeLimit || "0.45"}>
        <div className="flex flex-col gap-2 min-h-screen items-center justify-center">
            {children}
            <ClassicGameApplause/>
        </div>
    </ClassicGameProvider>
  )
}
const ClassicGameHeader = ({ children, className, ...props }: { children: React.ReactNode, className?: string}) => (
    <div className={`flex flex-col min-h-full w-full items-center justify-center ${className}`} {...props}>
        {children}
    </div>
)
const ClassicGameTitle = ({ children, title }: { children?: React.ReactNode, title: string}) => (
    <div className="py-2 lg:py-5 flex flex-col gap-2 items-center justify-center">
        {title 
            ? <h5 className="text-2xl font-bold">{title}</h5>
            : children
        }
    </div>
)
interface StatusProps extends React.HTMLAttributes<HTMLDivElement> {
    found?: number,
    timmer?: string,
}
function ClassicGameStatus({ found, timmer, className, ...props }: StatusProps) {
    const {result, timeLimit } = useClassicGame();
    const leftTime = timmer || timeLimit;
    const lessTime = Number(leftTime) < 0.20;
    const renderTimmer = (timeLeft: string) => {
        const [ min, sec ] = timeLeft.split('.');
        return `${min}:${sec}`;
    }
    return (
        <div className={`flex justify-between items-center w-full ${className}`} {...props}>
            <span>found: <b className="font-bold">{found || result.found}</b></span>
            <span className={`${lessTime && "text-red-500"} font-bold`}>{renderTimmer(leftTime)}</span>
        </div>
    )
}
function ClassicGameBody({ children, ...props }: {children: React.ReactNode}) {
    return (
        <div {...props}>{children}</div>
    )
}
function ClassicGameApplause() {
    const { result: { won } } = useClassicGame();
    if (!won) return false;

    return (<ReactConfetti gravity={0.2}/>)
}


export {
    ClassicGame,
    ClassicGameTitle,
    ClassicGameHeader,
    ClassicGameBody,
    ClassicGameStatus
}