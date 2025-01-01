import clsx from 'clsx';
import React from 'react';

interface CharBoxProps {
  char: string,
  position: number[],
  active?: boolean,
  onMouseDown: (position: number[]) => void,
  onMouseUp: (position: number[]) => void
}

export default function CharBox({ 
  char, 
  position,
  active, 
  onMouseDown, 
  onMouseUp 
}: CharBoxProps) {
  return (
    <div 
      className={clsx(`
          border-[1px] cursor-pointer border-gray-500/40 rounded h-8 w-8 flex items-center justify-center 
        `, {
           "bg-amber-600/90": active,
          "hover:bg-amber-600/60": !active
        }
      )}
      onMouseDown={() => onMouseDown(position)}
      onMouseUp={() => onMouseUp(position)}
    >
      <span 
        data-char={char} 
        className={`after:content-[attr(data-char)] after:font-semibold`}
      />
    </div>
  )
}