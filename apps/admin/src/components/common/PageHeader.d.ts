import { ReactNode } from 'react';
interface PageHeaderProps {
    title: string;
    subtitle?: string;
    actions?: ReactNode;
}
export declare function PageHeader({ title, subtitle, actions }: PageHeaderProps): import("react").JSX.Element;
export {};
