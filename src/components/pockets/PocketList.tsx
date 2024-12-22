'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePocketStore } from '@/store/pocketStore';
import { useTaskStore } from '@/store/taskStore';
import { LogoutButton } from '@/components/LogoutButton';

export function PocketList() {
    const {
        pockets,
        selectedPocketId,
        fetchPockets,
        createPocket,
        selectPocket,
    } = usePocketStore();
    const { tasks } = useTaskStore();

    const [newPocketName, setNewPocketName] = useState('');
    const [selectedEmoji, setSelectedEmoji] = useState('📂');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const commonEmojis = ['📂', '📚', '🏠', '💼', '🎮', '🎵', '🎨', '💪', '🍔', '✈️'];

    useEffect(() => {
        fetchPockets().catch((err) => console.error('Error fetching pockets:', err));
    }, [fetchPockets]);

    const pocketsWithCounts = pockets.map((pocket) => {
        const taskCount = tasks.filter((task) => task.pocketId === pocket._id).length;
        return { ...pocket, count: taskCount };
    });

    const handleCreatePocket = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newPocketName.trim()) return;

        try {
            await createPocket(newPocketName.trim(), selectedEmoji);
            setNewPocketName('');
            setSelectedEmoji('📂');
            setIsModalOpen(false);
            await fetchPockets();
        } catch (error) {
            console.error('Error creating pocket:', error);
        }
    };

    return (
        <div className="flex flex-col h-screen justify-between p-4 bg-white rounded-lg shadow-md">
            {/* Header */}
            <div>
                <h2 className="text-lg font-semibold mb-4">Pockets</h2>

                {/* Pocket List */}
                <div className="space-y-2">
                    <AnimatePresence>
                        {pocketsWithCounts.map((pocket) => (
                            <motion.div
                                key={pocket._id}
                                initial={{opacity: 0, y: 10}}
                                animate={{opacity: 1, y: 0}}
                                exit={{opacity: 0, y: -10}}
                                className={`flex items-center justify-between p-3 rounded-lg cursor-pointer border ${
                                    selectedPocketId === pocket._id
                                        ? 'bg-purple-500 text-white'
                                        : 'bg-gray-50 hover:bg-gray-100'
                                }`}
                                onClick={() => selectPocket(pocket._id)}
                            >
                                <div className="flex items-center gap-2">
                                    <span className="text-lg">{pocket.emoji}</span>
                                    <span className="font-medium">{pocket.name}</span>
                                </div>
                                <span
                                    className={`text-sm ${
                                        selectedPocketId === pocket._id
                                            ? 'bg-white text-purple-500'
                                            : 'bg-gray-200 text-gray-800'
                                    } px-2 py-1 rounded-lg`}
                                >
                                    {pocket.count}
                                </span>
                            </motion.div>
                        ))}

                        {/* Add Pocket Button */}
                        <motion.div
                            key="create-pocket-button"
                            initial={{opacity: 0, y: 10}}
                            animate={{opacity: 1, y: 0}}
                            exit={{opacity: 0, y: -10}}
                            className="flex items-center justify-between gap-4 p-3 bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200"
                            onClick={() => setIsModalOpen(true)}
                        >
                            <div className="flex items-center gap-2">
                                <span className="text-lg">➕</span>
                                <span className="font-medium">Create new pocket</span>
                            </div>
                            <span className="text-sm bg-gray-300 text-gray-800 px-2 py-1 rounded-lg">
                                ⌘ P
                            </span>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>

            {/* Create Pocket Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
                        <h3 className="text-lg font-semibold mb-4">Create New Pocket</h3>
                        <form onSubmit={handleCreatePocket} className="space-y-4">
                            <div className="flex gap-2">
                                <div className="relative">
                                    <button
                                        type="button"
                                        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                                        className="p-3 border rounded-lg hover:bg-gray-50 text-xl"
                                    >
                                        {selectedEmoji}
                                    </button>
                                    {showEmojiPicker && (
                                        <div
                                            className="absolute top-12 left-0 bg-white border rounded-lg shadow-lg p-3 z-50">
                                            <div className="grid grid-cols-5 gap-3 w-[250px]">
                                                {commonEmojis.map((emoji) => (
                                                    <button
                                                        key={emoji}
                                                        type="button"
                                                        onClick={() => {
                                                            setSelectedEmoji(emoji);
                                                            setShowEmojiPicker(false);
                                                        }}
                                                        className="p-2 hover:bg-gray-100 rounded-md transition-colors duration-200 text-xl flex items-center justify-center"
                                                    >
                                                        {emoji}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <input
                                    type="text"
                                    value={newPocketName}
                                    onChange={(e) => setNewPocketName(e.target.value)}
                                    className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                                    placeholder="Enter pocket name"
                                    autoFocus
                                />
                            </div>
                            <div className="flex justify-between">
                                <button
                                    type="button"
                                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
                                    onClick={() => {
                                        setIsModalOpen(false);
                                        setShowEmojiPicker(false);
                                        setSelectedEmoji('📂');
                                    }}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
                                >
                                    Create
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            <div
                className="flex items-center justify-between p-4 bg-gray-50 border-t border-gray-200 mt-4 rounded-lg shadow-sm">
                {/* User Profile */}
                <div className="flex items-center gap-4">
                    <img
                        src="https://via.placeholder.com/40"
                        alt="User profile"
                        className="w-12 h-12 rounded-full object-cover border border-gray-300 shadow"
                    />
                    <div>
                        <p className="font-semibold text-gray-900">Claudia Doumit</p>
                        <p className="text-sm text-gray-500">User Profile</p>
                    </div>
                </div>

                {/* Logout Button */}
                <div>
                    <LogoutButton
                        className=" text-sm text-gray-500 hover:text-gray-700 cursor-pointer"
                    />
                </div>
            </div>
        </div>
    );
}
