'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';

interface LoginFormData {
    login: string;
    password: string;
}

export default function LoginPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState<LoginFormData>({
        login: '',
        password: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Login failed');
            }

            localStorage.setItem('token', data.token);
            document.cookie = `token=${data.token}; path=/`;

            router.push('/');
        } catch (err) {
            console.error('Login error:', err);
            setError(err instanceof Error ? err.message : 'Login failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex">
            {/* Left Column */}
            <motion.div
                className="flex flex-col justify-center items-center w-full max-w-lg px-6 lg:px-12 bg-white"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
            >
                <div className="w-full max-w-md space-y-8">
                    <h2 className="text-3xl font-bold text-gray-900">Login</h2>

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {error && (
                            <div className="rounded-md bg-red-50 p-4">
                                <p className="text-sm text-red-700">{error}</p>
                            </div>
                        )}

                        <div className="space-y-4">
                            {/* Username Input */}
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 emoji">
                                    👤
                                </span>
                                <input
                                    id="login"
                                    name="login"
                                    type="text"
                                    placeholder="Username"
                                    required
                                    className="w-full px-10 py-3 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500 text-sm placeholder-gray-500"
                                    value={formData.login}
                                    onChange={(e) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            login: e.target.value,
                                        }))
                                    }
                                />
                            </div>

                            {/* Password Input */}s
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 emoji">
                                   🔑
                                </span>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    placeholder="Password"
                                    required
                                    className="w-full px-10 py-3 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500 text-sm placeholder-gray-500"
                                    value={formData.password}
                                    onChange={(e) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            password: e.target.value,
                                        }))
                                    }
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div>
                            <Button
                                type="submit"
                                isLoading={isLoading}
                                className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3"
                            >
                                Login
                            </Button>
                        </div>
                    </form>

                    <div className="text-center mt-4">
                        <p className="text-sm text-gray-500">
                            Don’t have an account?{' '}
                            <Link
                                href="/auth/register"
                                className="text-purple-600 hover:underline"
                            >
                                Register now.
                            </Link>
                        </p>
                    </div>
                </div>
            </motion.div>

            {/* Right Column */}
            <div className="hidden lg:flex w-full bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500">
                <div className="w-full h-full" style={{ backgroundSize: 'cover' }}></div>
            </div>
        </div>
    );
}
