import { PatientInfo } from '../../types';
interface BookingSummaryProps {
    locationName: string;
    locationAddress: string;
    date: string;
    time: string;
    patientInfo: PatientInfo;
    onEdit: (step: number) => void;
}
export declare const BookingSummary: ({ locationName, locationAddress, date, time, patientInfo, onEdit, }: BookingSummaryProps) => import("react/jsx-runtime").JSX.Element;
export {};
