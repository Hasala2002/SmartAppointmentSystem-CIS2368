import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Paper, TextInput, PasswordInput, Button, Anchor, Center, Stack, Title } from '@mantine/core';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { registerRequest, mapApiUser } from '../api/auth';
import { useState } from 'react';
const registerSchema = z.object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    email: z.string().email('Invalid email address'),
    phone: z.string().min(10, 'Phone number must be at least 10 characters'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(6, 'Password must be at least 6 characters'),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});
export const Register = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState(null);
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(registerSchema),
    });
    const onSubmit = async (data) => {
        setIsSubmitting(true);
        setSubmitError(null);
        try {
            const response = await registerRequest({
                email: data.email,
                password: data.password,
                first_name: data.firstName,
                last_name: data.lastName,
                phone: data.phone,
            });
            login(mapApiUser(response.user), response.access_token, response.refresh_token);
            navigate('/dashboard');
        }
        catch {
            setSubmitError('Unable to create account. Please try again.');
        }
        finally {
            setIsSubmitting(false);
        }
    };
    return (_jsx(Center, { style: { minHeight: 'calc(100vh - 120px)' }, children: _jsx(Paper, { p: "lg", radius: "md", withBorder: true, style: { width: '100%', maxWidth: 400 }, children: _jsxs(Stack, { gap: "lg", children: [_jsx("div", { children: _jsx(Title, { order: 2, mb: "xs", children: "Create Account" }) }), _jsx("form", { onSubmit: handleSubmit(onSubmit), children: _jsxs(Stack, { gap: "md", children: [_jsx(TextInput, { label: "First Name", placeholder: "John", error: errors.firstName?.message, ...register('firstName') }), _jsx(TextInput, { label: "Last Name", placeholder: "Doe", error: errors.lastName?.message, ...register('lastName') }), _jsx(TextInput, { label: "Email", placeholder: "you@example.com", error: errors.email?.message, ...register('email') }), _jsx(TextInput, { label: "Phone", placeholder: "(555) 123-4567", error: errors.phone?.message, ...register('phone') }), _jsx(PasswordInput, { label: "Password", placeholder: "Create a password", error: errors.password?.message, ...register('password') }), _jsx(PasswordInput, { label: "Confirm Password", placeholder: "Confirm password", error: errors.confirmPassword?.message, ...register('confirmPassword') }), _jsx(Button, { fullWidth: true, type: "submit", disabled: isSubmitting, children: "Create Account" }), submitError && _jsx("span", { style: { color: 'var(--mantine-color-red-6)' }, children: submitError })] }) }), _jsx(Stack, { gap: 0, children: _jsxs("span", { children: ["Already have an account?", ' ', _jsx(Anchor, { component: RouterLink, to: "/login", children: "Sign in" })] }) })] }) }) }));
};
