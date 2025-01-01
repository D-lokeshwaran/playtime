import React from 'react';
import { 
    ClassicGame, 
    ClassicGameBody, 
    ClassicGameHeader, 
    ClassicGameStatus, 
    ClassicGameTitle 
} from '@/components/ClassicGame';

export default function GamePlayLayout({ children }: { children: React.ReactNode }) {
    return (
        <ClassicGame name='word-hunt' timeLimit={"1.30"}>
            <ClassicGameHeader>
                <ClassicGameTitle title='Word Hunt'/>
                <ClassicGameStatus/>
            </ClassicGameHeader>
            <ClassicGameBody>
                {children}
            </ClassicGameBody>
        </ClassicGame>
    )
}