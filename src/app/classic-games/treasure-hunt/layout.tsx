import React from 'react';
import { 
    ClassicGame, 
    ClassicGameBody, 
    ClassicGameHeader, 
    ClassicGameStatus, 
    ClassicGameTitle 
} from '@/components/ClassicGame';

export default function TreasureHuntLayout({ children }: { children: React.ReactNode }) {
    return (
        <ClassicGame name='treasure-hunt' timeLimit={"0.20"}>
            <ClassicGameHeader>
                <ClassicGameTitle title='Treasure Hunt'/>
            </ClassicGameHeader>
            <ClassicGameBody>
                {children}
            </ClassicGameBody>
        </ClassicGame>
    )
}