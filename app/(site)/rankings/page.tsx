import { RankingsWidget } from "@/components/public-components/RankingsWidget";

export default function Rankings() {
    return (
        <>
            <header className="bg-bullet-panel border-b border-white/10 py-12 px-8 mb-8">
                <div className="max-w-[1600px] mx-auto">
                    <h1 className="text-4xl text-white font-normal uppercase tracking-wide mb-2">
                        Rankings
                    </h1>
                    <p className="text-bullet-muted text-sm tracking-widest">
                        Search rankings for field operator or event.
                    </p>
                </div>
            </header>
            <RankingsWidget />
        </>
    );
}