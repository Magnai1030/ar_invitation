import { FC } from "react";

const formatDuration = (startISO: string) => {
    const start = new Date(startISO).getTime();
    const now = Date.now();
    const diff = Math.max(0, now - start);
    const seconds = Math.floor(diff / 1000) % 60;
    const minutes = Math.floor(diff / (60 * 1000)) % 60;
    const hours = Math.floor(diff / (60 * 60 * 1000)) % 24;
    const days = Math.floor(diff / (24 * 60 * 60 * 1000));
    const years = Math.floor(days / 365);
    const remDays = days % 365;
    return { years, remDays, hours, minutes, seconds };
};

type Props = {
    date: string;
}
const Counter: FC<Props> = ({ date }) => {
    const dur = formatDuration(date);

    return <div className="mx-auto mt-6 grid max-w-2xl gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-white/20 bg-white/10 p-4">
            <div className="text-2xl sm:text-3xl font-extrabold">{dur.years}</div>
            <div className="text-sm opacity-80">years</div>
        </div>
        <div className="rounded-xl border border-white/20 bg-white/10 p-4">
            <div className="text-2xl sm:text-3xl font-extrabold">{dur.remDays}</div>
            <div className="text-sm opacity-80">days</div>
        </div>
        <div className="rounded-xl border border-white/20 bg-white/10 p-4">
            <div className="text-2xl sm:text-3xl font-extrabold tabular-nums">
                {String(dur.hours).padStart(2, '0')}:{String(dur.minutes).padStart(2, '0')}:{String(dur.seconds).padStart(2, '0')}
            </div>
            <div className="text-sm opacity-80">hrs : min : sec</div>
        </div>
    </div>
}
export default Counter;