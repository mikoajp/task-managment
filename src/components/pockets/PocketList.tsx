'use client';

import React, { useEffect, useState } from 'react';
import { usePocketStore } from '@/store/pocketStore';
import { useTaskStore } from '@/store/taskStore';
import EmojiPicker from 'emoji-picker-react';
import { motion } from 'framer-motion';

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
        } catch (error) {
            console.error('Error creating pocket:', error);
        }
    };

    return (
        <div className="flex flex-col h-screen p-4 bg-white rounded-lg shadow-md">
            {/* Header */}
            <h2 className="text-lg font-semibold mb-4">Pockets</h2>

            {/* Pocket List */}
            <div className="space-y-2">
                {pocketsWithCounts.map((pocket) => (
                    <motion.div
                        key={pocket._id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
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
                <div
                    className="flex items-center justify-between gap-4 p-3 bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200"
                    onClick={() => setIsModalOpen(true)}
                >
                    <div className="flex items-center gap-2">
                        <span className="text-lg">➕</span>
                        <span className="font-medium">Create new pocket</span>
                    </div>
                </div>
            </div>

            {/* Create Pocket Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6"
                    >
                        {/* Back Button */}
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="text-purple-600 text-sm mb-4"
                        >
                            ← Go back
                        </button>

                        {/* Form Header */}
                        <h3 className="text-lg font-bold mb-4">Create a new pocket</h3>

                        {/* Emoji Picker */}
                        <form onSubmit={handleCreatePocket} className="space-y-4">
                            <div className="flex gap-2 items-center">
                                <button
                                    type="button"
                                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                                    className="p-2 border rounded-lg hover:bg-gray-50 text-xl"
                                >
                                    {selectedEmoji}
                                </button>
                                <input
                                    type="text"
                                    value={newPocketName}
                                    onChange={(e) => setNewPocketName(e.target.value)}
                                    placeholder="My new pocket"
                                    className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                                />
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
                                >
                                    Create
                                </button>
                            </div>

                            {showEmojiPicker && (
                                <div className="mt-4 overflow-auto border rounded-lg">
                                    <p className="font-medium mb-2">Select emoji</p>
                                    <div className="rounded-lg bg-white">
                                        <EmojiPicker
                                            onEmojiClick={(emoji) => {
                                                setSelectedEmoji(emoji.emoji);
                                                setShowEmojiPicker(false);
                                            }}
                                            theme="light"
                                            width="100%"
                                            disableSearchBar={true}
                                        />
                                    </div>
                                </div>
                            )}
                        </form>
                    </motion.div>
                </div>
            )}
        </div>
    );
}
