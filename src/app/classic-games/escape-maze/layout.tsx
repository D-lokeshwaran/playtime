import React from 'react';
import { 
    ClassicGame, 
    ClassicGameBody, 
    ClassicGameHeader, 
    ClassicGameStatus, 
    ClassicGameTitle 
} from '@/components/ClassicGame';

export default function EscapeMazeLayout({ children }: { children: React.ReactNode }) {
    return (
        <ClassicGame name='escape-maze' timeLimit={"0.45"}>
            <ClassicGameHeader>
                <ClassicGameTitle title='Escape Maze'/>
                <ClassicGameStatus/>
            </ClassicGameHeader>
            <ClassicGameBody>
                {children}
            </ClassicGameBody>
        </ClassicGame>
    )
}