import { ApiTimeSlot } from '../../types';
interface TimeSlotPickerProps {
    selectedTime?: string;
    onSelect: (time: string) => void;
    slots: ApiTimeSlot[];
    isLoading: boolean;
}
export declare const TimeSlotPicker: ({ selectedTime, onSelect, slots, isLoading }: TimeSlotPickerProps) => import("react/jsx-runtime").JSX.Element;
export {};
