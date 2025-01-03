'use client';

import React from "react";
import { clsx } from "clsx";
import { icons, LucideProps } from 'lucide-react';
import { Card } from "@/types/types";

const FlipCard = ({ card, onFlip }: {
    card: Card,
    onFlip: (cardId: number) => void
}) => {
    const LucideIcon = icons[card.icon];

    return (
        <div 
            className="h-14 w-14 [perspective:1000px] cursor-pointer select-none"
            onClick={() => onFlip(card.id)}
        >
            <div className={clsx("relative h-full w-full rounded-xl shadow-xl transition-all duration-500 [transform-style:preserve-3d]", {
                    "[transform:rotateY(180deg)]": card.found === true ? true : card.flip
                })}>
                <div className="absolute bg-black/80 inset-0 h-full w-full rounded-md [backface-visibility:hidden]">
                    <div className="flex min-h-full items-center justify-center">C</div>
                </div>
                <div 
                    className={clsx(
                        "absolute inset-0 h-full w-full rounded-md bg-black/80 text-center text-slate-200 [transform:rotateY(180deg)] [backface-visibility:hidden]", {
                            "bg-yellow-500/60 text-black/80": card.found
                        })}>
                    <div className="flex min-h-full items-center justify-center">
                        <LucideIcon/>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FlipCard;