import { Location } from '../../types';
interface LocationPickerProps {
    locations: Location[];
    selectedId?: string;
    onSelect: (locationId: string) => void;
}
export declare const LocationPicker: ({ locations, selectedId, onSelect }: LocationPickerProps) => import("react/jsx-runtime").JSX.Element;
export {};
