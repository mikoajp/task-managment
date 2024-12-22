'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTaskStore } from '@/store/taskStore';

interface TaskItemProps {
    task: {
        _id: string;
        description: string;
        completed: boolean;
    };
    pocketId: string;
}

export function TaskItem({ task, pocketId }: TaskItemProps) {
    const { updateTask, deleteTask } = useTaskStore();
    const [showMenu, setShowMenu] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editedDescription, setEditedDescription] = useState(task.description);

    const handleToggleComplete = async () => {
        try {
            await updateTask(pocketId, task._id, {
                isCompleted: !task.completed
            });
            setShowMenu(false);
        } catch (err) {
            console.error('Error toggling task completion:', err);
        }
    };

    const handleEdit = () => {
        setIsEditing(true);
        setShowMenu(false);
    };

    const handleSaveEdit = async () => {
        if (editedDescription.trim() !== '') {
            try {
                await updateTask(pocketId, task._id, {
                    description: editedDescription.trim(),
                    isCompleted: task.completed
                });
                setIsEditing(false);
            } catch (err) {
                console.error('Error updating task:', err);
            }
        }
    };

    const handleCancelEdit = () => {
        setEditedDescription(task.description);
        setIsEditing(false);
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSaveEdit();
        } else if (e.key === 'Escape') {
            handleCancelEdit();
        }
    };

    if (isEditing) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-4 p-4 rounded-lg border border-purple-300 bg-purple-50"
            >
                <input
                    type="text"
                    value={editedDescription}
                    onChange={(e) => setEditedDescription(e.target.value)}
                    onKeyDown={handleKeyPress}
                    className="flex-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-800 bg-white"
                    autoFocus
                />
                <div className="flex gap-2">
                    <button
                        onClick={handleSaveEdit}
                        className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700 transition-colors"
                    >
                        Save
                    </button>
                    <button
                        onClick={handleCancelEdit}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                    >
                        Cancel
                    </button>
                </div>
            </motion.div>
        );
    }

    return (
        <div className="relative">
            <motion.div
                initial={{opacity: 0, y: 20}}
                animate={{opacity: 1, y: 0}}
                exit={{opacity: 0, y: -20}}
                className={`
                flex items-center gap-4 p-4 rounded-lg border
                ${task.completed ? 'bg-purple-100 border-purple-300' : 'bg-white border-gray-200'}
                hover:shadow-md transition-shadow
            `}
            >
                {/* Checkbox for Task Completion */}
                <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={handleToggleComplete}
                    className="w-5 h-5 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                />

                {/* Task Description */}
                <span
                    className={`flex-1 ${
                        task.isCompleted ? 'line-through text-gray-500' : 'text-gray-800'
                    }`}
                >
                {task.description}
            </span>
                {/* Three-Dot Menu */}
                <button
                    onClick={() => setShowMenu(!showMenu)}
                    className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
                >
                    <svg
                        className="w-5 h-5 text-gray-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                        />
                    </svg>
                </button>
            </motion.div>

            {/* Dropdown Menu */}
            {showMenu && (
                <div
                    className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-md z-10 border border-gray-200"
                    onClick={() => setShowMenu(false)}
                >
                    <div className="py-1">
                        <button
                            onClick={handleToggleComplete}
                            className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                            {task.completed ? 'Mark as incomplete' : 'Mark as completed'}
                        </button>
                        <button
                            onClick={handleEdit}
                            className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                            Edit task
                        </button>
                        <button
                            onClick={() => deleteTask(pocketId, task._id)}
                            className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
                        >
                            Delete task
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}