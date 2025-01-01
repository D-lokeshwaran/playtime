import { Ghost, icons } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"

interface GameOverProps {
    gameOver?: boolean,
    result: {
        totalFound: number,
        [int:string]: any
    },
    onReset: () => void
}

export default function GameOver({ gameOver, result, onReset }: GameOverProps) {

  return (
    <Dialog open={gameOver}>
        <DialogContent className='bg-[#12110f] w-fit px-20' hideClose={true}>
            <DialogHeader className='flex flex-col items-center justify-center gap-4 text-lg'>
                <Ghost size={80}/>
                <DialogTitle className='text-red-500 text-3xl font-bold'>GAME OVER</DialogTitle>
                <DialogDescription className='flex flex-col items-center gap-1'>
                    <div className='text-lg font-bold'>Found: <b>{result.totalFound}</b></div>
                    <p>Better luck next time</p>
                </DialogDescription>
                <DialogFooter>
                    <Button variant={'ghost'} onClick={onReset} className='font-bold text-2xl'>
                        Try another shot
                    </Button>
                </DialogFooter>
            </DialogHeader>
        </DialogContent>
    </Dialog>
  )
}