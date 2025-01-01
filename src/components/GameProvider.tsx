'use client';

import React, { Suspense } from "react"

export default function GameProvider({ gameId, children }: {
    gameId: string,
    children: React.ReactNode
}) {
  return (
        <Suspense fallback={"Loading..."}>
            {children}
        </Suspense>
  )
}