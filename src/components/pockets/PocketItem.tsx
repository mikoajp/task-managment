'use client';

import { motion } from 'framer-motion';
import {useState} from "react";

interface PocketItemProps {
    id: string;
    name: string;
    emoji: string;
    taskCount: number;
    isSelected: boolean;
    onSelect: (id: string) => void;
    onDelete?: (id: string) => void;
}

export const PocketItem = ({
                               id,
                               name,
                               emoji,
                               taskCount,
                               isSelected,
                               onSelect,
                               onDelete,
                           }: PocketItemProps) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <motion.div
            className={`relative flex items-center justify-between p-3 rounded-lg cursor-pointer border ${
                isSelected
                    ? 'bg-purple-500 text-white'
                    : 'bg-gray-50 hover:bg-gray-100'
            }`}
            onClick={() => onSelect(id)}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="flex items-center gap-2 flex-1">
                <span className="text-lg">{emoji}</span>
                <span className="font-medium">{name}</span>
            </div>

            {/* Liczba tasków lub przycisk Delete */}
            {isHovered && onDelete ? (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete(id);
                    }}
                    className={`
                       text-sm px-2 py-1 rounded-lg
                       ${isSelected
                        ? 'bg-white text-red-500 hover:bg-red-50'
                        : 'bg-red-50 text-red-500 hover:bg-red-100'}
                       transition-colors
                   `}
                >
                    Delete
                </button>
            ) : (
                <span
                    className={`text-sm ${
                        isSelected
                            ? 'bg-white text-purple-500'
                            : 'bg-gray-200 text-gray-800'
                    } px-2 py-1 rounded-lg`}
                >
                   {taskCount}
               </span>
            )}
        </motion.div>
    );
};
