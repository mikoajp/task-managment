'use client';

import React, { useState } from 'react';
import { useTaskStore } from '@/store/taskStore';

export function AddTask({ pocketId }: { pocketId: string }) {
    const { createTask } = useTaskStore();
    const [description, setDescription] = useState('');
    const [completed, setCompleted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!description.trim()) {
            alert('Task description is required');
            return;
        }

        try {
            await createTask(pocketId, { description, completed });
            setDescription('');
            setCompleted(false);
        } catch (error) {
            console.error('Error adding task:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Task description"
                className="w-full px-3 py-2 border rounded-md"
            />
            <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-md">
                Add Task
            </button>
        </form>
    );
}
