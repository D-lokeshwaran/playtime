import React from 'react';
import { 
    ClassicGame, 
    ClassicGameBody, 
    ClassicGameHeader, 
    ClassicGameStatus, 
    ClassicGameTitle 
} from '@/components/ClassicGame';

export default function MemorizeLayout({ children }: { children: React.ReactNode }) {
    return (
        <ClassicGame name='memorize' timeLimit={"1.60"}>
            <ClassicGameHeader>
                <ClassicGameTitle title='Memorize'/>
                <ClassicGameStatus/>
            </ClassicGameHeader>
            <ClassicGameBody>
                {children}
            </ClassicGameBody>
        </ClassicGame>
    )
}