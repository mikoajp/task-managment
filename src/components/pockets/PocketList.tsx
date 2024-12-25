'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { usePocketStore } from '@/store/pocketStore';
import { PocketItem } from './PocketItem';
import EmojiPicker from 'emoji-picker-react';
import { UserInfo } from '@/components/UserInfo';

export function PocketList() {
    const {
        pockets,
        selectedPocketId,
        fetchAllPocketsWithTasks,
        createPocket,
        selectPocket,
        deletePocket,
    } = usePocketStore();

    const [newPocketName, setNewPocketName] = useState('');
    const [selectedEmoji, setSelectedEmoji] = useState('📂');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);

    useEffect(() => {
        fetchAllPocketsWithTasks().catch((err) =>
            console.error('Error fetching pockets with tasks:', err)
        );
    }, [fetchAllPocketsWithTasks]);

    const handleCreatePocket = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newPocketName.trim()) return;

        try {
            await createPocket(newPocketName.trim(), selectedEmoji);
            setNewPocketName('');
            setSelectedEmoji('📂');
            setIsModalOpen(false);
            await fetchAllPocketsWithTasks();
        } catch (error) {
            console.error('Error creating pocket:', error);
        }
    };

    return (
        <div className="flex flex-col h-full p-4 bg-white rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-4">Pockets</h2>

            {/* Pocket List */}
            <div className="flex-grow space-y-2 overflow-y-auto">
                {pockets.map((pocket) => {
                    const incompleteTasks = pocket.tasks?.filter((task) => !task.isCompleted) || [];

                    return (
                        <PocketItem
                            key={pocket._id}
                            id={pocket._id}
                            name={pocket.name}
                            emoji={pocket.emoji}
                            taskCount={incompleteTasks.length}
                            isSelected={selectedPocketId === pocket._id}
                            onSelect={(id) => selectPocket(id)}
                            onDelete={deletePocket}
                        />
                    );
                })}

                {/* Add Pocket Button */}
                <motion.div
                    className="flex items-center justify-between p-3 bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200"
                    onClick={() => setIsModalOpen(true)}
                >
                    <div className="flex items-center gap-2">
                        <span className="text-lg">➕</span>
                        <span className="font-medium">Create new pocket</span>
                    </div>
                    <span className="text-lg font-bold">⌘ N</span>
                </motion.div>
            </div>

            {/* User Info */}
            <UserInfo/>

            {/* Create Pocket Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <motion.div
                        initial={{opacity: 0, y: -50}}
                        animate={{opacity: 1, y: 0}}
                        exit={{ opacity: 0, y: 50 }}
                        className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6 relative"
                    >
                        {/* Close Button */}
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 focus:outline-none"
                        >
                            ✕
                        </button>

                        {/* Modal Header */}
                        <h3 className="text-lg font-semibold mb-4">Create a new pocket</h3>

                        {/* Form */}
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
                                    placeholder="Pocket name"
                                    className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                                />
                            </div>

                            {/* Emoji Picker */}
                            {showEmojiPicker && (
                                <div className="mt-4 border rounded-lg bg-white p-4">
                                    <EmojiPicker
                                        onEmojiClick={(emoji) => {
                                            setSelectedEmoji(emoji.emoji);
                                            setShowEmojiPicker(false);
                                        }}
                                        width="100%"
                                    />
                                </div>
                            )}

                            <button
                                type="submit"
                                className="w-full px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
                            >
                                Create
                            </button>
                        </form>
                    </motion.div>
                </div>
            )}
        </div>
    );
}
