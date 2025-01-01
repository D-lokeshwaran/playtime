import React, { lazy, Suspense } from 'react';
import dynamicIconImports from 'lucide-react/dynamicIconImports';
import Link from "next/link";
import { Button, ButtonProps } from "@/components/ui/button";

const fallback = <div style={{ background: '#ddd', width: 24, height: 24 }}/>

interface GameNavigationButtonTypes extends ButtonProps {
    name: string,
    icon: string,
    href: string,
}

export function GameNavigationButton({ name, icon, href, className, ...props }: GameNavigationButtonTypes) {
    const LucideIcon = lazy(dynamicIconImports[icon]);

    return (
        <Button
            variant="outline"
            size="icon"
            asChild
            className={`bg-[#12110f] h-14 w-14 ${className}`}
            {...props}
        >
            <Link href={href} title={name}>
                <Suspense fallback={fallback}>
                    <LucideIcon className="!w-8 !h-8"/>
                </Suspense>
            </Link>
        </Button>
    )
}

export default GameNavigationButton;