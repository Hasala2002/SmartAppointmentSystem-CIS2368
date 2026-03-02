import { UseFormReturn } from 'react-hook-form';
import { PatientInfo } from '../../types';
interface PatientFormProps {
    form: UseFormReturn<Partial<PatientInfo>>;
    onDemoFill: () => void;
}
export declare const PatientForm: ({ form, onDemoFill }: PatientFormProps) => import("react/jsx-runtime").JSX.Element;
export {};
