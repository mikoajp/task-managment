'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { useAuthStore } from '@/store/authStore';

export default function LoginForm() {
    const router = useRouter();
    const { login, isLoading, error } = useAuthStore();
    const [formData, setFormData] = useState({
        login: '',
        password: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await login(formData);
            router.push('/dashboard');
        } catch (error) {
            console.error('Login failed:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto p-8">
            <h1 className="text-2xl font-bold text-center mb-6">Login</h1>

            <Input
                label="Login"
                type="login"
                value={formData.login}
                onChange={(e) => setFormData(prev => ({ ...prev, login: e.target.value }))}
                required
            />

            <Input
                label="Password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                required
            />

            {error && (
                <p className="text-red-500 text-sm">{error}</p>
            )}

            <Button
                type="submit"
                isLoading={isLoading}
                className="w-full"
            >
                Login
            </Button>
        </form>
    );
}