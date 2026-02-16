import { Appointment } from '../../types';
interface AppointmentModalProps {
    opened: boolean;
    onClose: () => void;
    appointment: Appointment | null;
    onViewDetails?: (id: string) => void;
}
export declare function AppointmentModal({ opened, onClose, appointment, onViewDetails }: AppointmentModalProps): import("react").JSX.Element;
export {};
