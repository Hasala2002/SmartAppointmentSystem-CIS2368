import { ReactNode } from 'react';
interface StatsCardProps {
    icon: ReactNode;
    value: string | number;
    label: string;
    trend?: {
        value: number;
        positive: boolean;
    };
}
export declare function StatsCard({ icon, value, label, trend }: StatsCardProps): import("react").JSX.Element;
export declare function StatsCardRow({ cards }: {
    cards: StatsCardProps[];
}): import("react").JSX.Element;
export {};
