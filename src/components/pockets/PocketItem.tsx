'use client';

import { motion } from 'framer-motion';
import { Button } from '../ui/Button';

interface PocketItemProps {
    id: string;
    name: string;
    emoji: string;
    isSelected: boolean;
    onSelect: (id: string) => void;
    onDelete?: (id: string) => void;
}

export const PocketItem = ({ id, name, emoji, isSelected, onSelect, onDelete }: PocketItemProps) => {
    return (
        <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`
                p-4 rounded-lg cursor-pointer transition-all shadow-sm border flex items-center justify-between gap-4
                ${isSelected ? 'bg-purple-100 border-purple-400' : 'bg-white border-gray-200 hover:bg-gray-50'}
            `}
            onClick={() => onSelect(id)}
        >
            {/* Pocket Content */}
            <div className="flex items-center gap-3">
                <div
                    className={`
                        flex items-center justify-center w-10 h-10 text-lg font-bold rounded-full
                        ${isSelected ? 'bg-purple-500 text-white' : 'bg-gray-200 text-gray-700'}
                    `}
                >
                    {emoji}
                </div>
                <span className="text-base font-medium truncate">
                    {name}
                </span>
            </div>

            {/* Delete Button */}
            {onDelete && (
                <Button
                    variant="danger"
                    size="sm"
                    className="flex-shrink-0"
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete(id);
                    }}
                >
                    Delete
                </Button>
            )}
        </motion.div>
    );
};
