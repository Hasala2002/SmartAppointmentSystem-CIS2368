import { ReactNode } from 'react';
interface EmptyStateProps {
    icon: ReactNode;
    title: string;
    description: string;
    action?: {
        label: string;
        onClick: () => void;
    };
}
export declare function EmptyState({ icon, title, description, action }: EmptyStateProps): import("react").JSX.Element;
export {};
