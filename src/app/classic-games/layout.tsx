import React from 'react';

export default function GamesLayout({ children }: { children: React.ReactNode }) {
   /* Need to add GameContextProvider */
    return (
        <div className="flex items-center justify-center h-screen">
            {children}
        </div>
    )
}