import { Appointment } from '../../types';
interface AppointmentsTableProps {
    appointments: Appointment[];
    onRowClick: (id: string) => void;
    showLocation?: boolean;
}
export declare function AppointmentsTable({ appointments, onRowClick, showLocation }: AppointmentsTableProps): import("react").JSX.Element;
export {};
