import { Appointment } from '../../types';
interface AppointmentRowProps {
    appointment: Appointment;
    onClick: (id: string) => void;
    showLocation?: boolean;
}
export declare function AppointmentRow({ appointment, onClick, showLocation }: AppointmentRowProps): import("react").JSX.Element;
export {};
