import GameNavigateButton from "@/components/GameNavigateButton";
import Link from "next/link"

export default function Home() {
    return (
        <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
            <header className="text-center">
                <h3 className="text-3xl font-bold">PLAYTIME</h3>
                <p className="text-md">Sometimes the most productive thing you can do is relax.</p>
            </header>
            <main className="flex gap-4 flex-wrap">
                <GameNavigateButton name="Memorize the Cards" icon="brain" href="/classic-games/memorize"/>
                <GameNavigateButton name="Word Hunt" icon="search" href="/classic-games/word-hunt"/>
                <GameNavigateButton name="Escape the Maze" icon="shell" href="/classic-games/escape-maze"/>
                <GameNavigateButton name="Gusses the Word" icon="whole-word" href="/classic-games/word-invaders"/>
            </main>
            <footer>
                @{new Date().getFullYear()} ProvideFun. Inc, | <Link href="/send-feedback">Send Feedback</Link>
            </footer>
        </div>
    );
}
