import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Paper, TextInput, PasswordInput, Button, Anchor, Center, Stack, Title } from '@mantine/core';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { loginRequest, mapApiUser } from '../api/auth';
import { useState } from 'react';
const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});
export const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState(null);
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(loginSchema),
    });
    const onSubmit = async (data) => {
        setIsSubmitting(true);
        setSubmitError(null);
        try {
            const response = await loginRequest({
                email: data.email,
                password: data.password,
            });
            const user = mapApiUser(response.user);
            login(user, response.access_token, response.refresh_token);
            navigate('/dashboard');
        }
        catch {
            setSubmitError('Unable to sign in. Please verify your credentials.');
        }
        finally {
            setIsSubmitting(false);
        }
    };
    return (_jsx(Center, { style: { minHeight: 'calc(100vh - 120px)' }, children: _jsx(Paper, { p: "lg", radius: "md", withBorder: true, style: { width: '100%', maxWidth: 400 }, children: _jsxs(Stack, { gap: "lg", children: [_jsx("div", { children: _jsx(Title, { order: 2, mb: "xs", children: "Sign In" }) }), _jsx("form", { onSubmit: handleSubmit(onSubmit), children: _jsxs(Stack, { gap: "md", children: [_jsx(TextInput, { label: "Email", placeholder: "you@example.com", error: errors.email?.message, ...register('email') }), _jsx(PasswordInput, { label: "Password", placeholder: "Your password", error: errors.password?.message, ...register('password') }), _jsx(Button, { fullWidth: true, type: "submit", disabled: isSubmitting, children: isSubmitting ? 'Signing in...' : 'Sign In' }), submitError && _jsx("span", { style: { color: 'var(--mantine-color-red-6)' }, children: submitError })] }) }), _jsx(Stack, { gap: 0, children: _jsxs("span", { children: ["Don't have an account?", ' ', _jsx(Anchor, { component: RouterLink, to: "/register", children: "Sign up" })] }) })] }) }) }));
};
