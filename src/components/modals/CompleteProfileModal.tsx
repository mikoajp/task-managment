'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useUserStore } from '@/store/userStore';

export function CompleteProfileModal({ onClose }: { onClose: () => void }) {
    const { updateUserInfo, updateUserAvatar, fetchUser } = useUserStore();
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [avatar, setAvatar] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            await updateUserInfo(firstName, lastName);

            if (avatar) {
                await updateUserAvatar(avatar);
            }
            await fetchUser();
            localStorage.setItem('hasCompletedProfile', 'true');
            onClose();
        } catch (error) {
            console.error('Error updating profile:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-lg p-6 w-full max-w-md"
            >
                <h2 className="text-xl font-bold mb-2">Almost there!</h2>
                <p className="text-gray-600 mb-6">
                    We just need some more information...
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="First Name"
                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                        required
                    />

                    <input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Last Name"
                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                        required
                    />

                    <div>
                        <button
                            type="button"
                            onClick={() => document.getElementById('avatar-input')?.click()}
                            className="w-full p-2 border rounded-lg text-left text-gray-600 hover:bg-gray-50"
                        >
                            {avatar ? avatar.name : 'Click to upload your avatar'}
                        </button>
                        <input
                            id="avatar-input"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                    console.log('Selected file:', file);
                                    setAvatar(file);
                                }
                            }}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-purple-500 text-white py-2 rounded-lg hover:bg-purple-600 disabled:opacity-50"
                    >
                        {'Complete Information'}
                    </button>
                </form>
            </motion.div>
        </div>
    );
}
