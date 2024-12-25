'use client';

import React, { useState } from 'react';
import { useTaskStore } from '@/store/taskStore';
import { usePocketStore } from '@/store/pocketStore';

export function AddTask({ onTaskAdded }: { onTaskAdded: () => void }) {
    const { createTask } = useTaskStore();
    const { pockets, selectedPocketId, selectPocket } = usePocketStore();
    const [description, setDescription] = useState('');
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!description.trim()) {
            setError('Task description is required.');
            return;
        }
        if (!selectedPocketId) {
            setError('Please select a pocket.');
            return;
        }

        setError(null);

        try {
            await createTask(selectedPocketId, { description, completed: false });
            setDescription('');
            onTaskAdded();
        } catch (error) {
            console.error('Error adding task:', error);
            setError('Failed to add task. Please try again.');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="p-4 bg-white rounded-lg shadow-md space-y-6">
            {/* Error Message */}
            {error && <div className="text-sm text-red-500">{error}</div>}

            {/* Task Input */}
            <div className="relative">
                <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Create a new task"
                    className="w-full px-4 py-2 text-sm focus:outline-none focus:ring-0"
                />
                <button
                    type="submit"
                    className="absolute top-1/2 transform -translate-y-1/2 right-2 bg-purple-500 text-white px-4 py-2 text-sm font-medium rounded-lg hover:bg-purple-600 focus:ring-2 focus:ring-purple-500"
                >
                    Create
                </button>
            </div>

            {/* Pocket Selector */}
            <div>
                <h3 className="text-sm font-medium text-gray-900 mb-2">Select pocket</h3>
                <div className="space-y-2">
                    {pockets.map((pocket) => {
                        const activeTasks = pocket.tasks?.filter((task) => !task.isCompleted) || [];

                        return (
                            <div
                                key={pocket._id}
                                className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer ${
                                    selectedPocketId === pocket._id
                                        ? 'bg-gray-100 border-purple-500'
                                        : 'bg-white border-gray-200 hover:bg-gray-100'
                                }`}
                                onClick={() => selectPocket(pocket._id)}
                            >
                                <div className="flex items-center gap-3">
                                    <span className="text-lg">{pocket.emoji}</span>
                                    <span className="text-sm font-medium text-gray-900">{pocket.name}</span>
                                </div>
                                <span className="text-xs font-medium text-gray-500">{activeTasks.length}</span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Create New Pocket Button */}
            <div
                className="flex justify-between items-center mt-4 text-sm text-gray-500 cursor-pointer hover:text-gray-700">
                <div className="flex items-center gap-2">
                    <span className="text-lg font-medium text-purple-500">+</span>
                    <span>Create new pocket</span>
                </div>
                <span className="px-2 py-1 rounded-lg border text-xs text-gray-400">⌘ P</span>
            </div>
        </form>
    );
}