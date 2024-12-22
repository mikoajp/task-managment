'use client';

import React, { useState } from 'react';
import { useTaskStore } from '@/store/taskStore';
import { usePocketStore } from '@/store/pocketStore';

export function AddTask({ onTaskAdded }: { onTaskAdded: () => void }) {
    const { createTask } = useTaskStore();
    const { pockets, selectedPocketId, selectPocket } = usePocketStore(); // Dodano `selectPocket`
    const [description, setDescription] = useState('');
    const [completed, setCompleted] = useState(false);
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
            await createTask(selectedPocketId, { description, completed });
            setDescription('');
            setCompleted(false);
            onTaskAdded();
        } catch (error) {
            console.error('Error adding task:', error);
            setError('Failed to add task. Please try again.');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {error && <div className="text-sm text-red-500">{error}</div>}

            {/* Pocket Selector */}
            <div>
                <label htmlFor="pocketSelector" className="block text-sm font-medium text-gray-700">
                    Select Pocket
                </label>
                <div className="space-y-2 mt-2">
                    {pockets.map((pocket) => (
                        <div
                            key={pocket._id}
                            className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer ${
                                selectedPocketId === pocket._id
                                    ? 'bg-blue-50 border-blue-300'
                                    : 'bg-white border-gray-200 hover:bg-gray-100'
                            }`}
                            onClick={() => selectPocket(pocket._id)} // Ustaw aktywną kieszeń
                        >
                            <div className="flex items-center gap-2">
                                <span className="text-lg">{pocket.emoji}</span>
                                <span className="text-sm font-medium">{pocket.name}</span>
                            </div>
                            {selectedPocketId === pocket._id && (
                                <span className="text-sm text-blue-500">Selected</span>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Task Description */}
            <div>
                <label
                    htmlFor="taskDescription"
                    className="block text-sm font-medium text-gray-700"
                >
                    Task Description
                </label>
                <input
                    id="taskDescription"
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter task description"
                    className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
            </div>


            {/* Submit Button */}
            <div className="flex justify-end">
                <button
                    type="submit"
                    className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:ring-2 focus:ring-blue-500"
                >
                    Add Task
                </button>
            </div>
        </form>
    );
}
