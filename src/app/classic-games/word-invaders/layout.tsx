import React from 'react';
import { 
    ClassicGame, 
    ClassicGameBody, 
    ClassicGameHeader, 
    ClassicGameStatus, 
    ClassicGameTitle 
} from '@/components/ClassicGame';

export default function WordInvadersLayout({ children }: { children: React.ReactNode }) {
    return (
        <ClassicGame name='word-invaders' timeLimit={"0.45"}>
            <ClassicGameHeader className='w-1/2'>
                <ClassicGameTitle title='Word Invaders'/>
            </ClassicGameHeader>
            <ClassicGameBody>
                {children}
            </ClassicGameBody>
        </ClassicGame>
    )
}