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
            className={`
        p-3 rounded-lg cursor-pointer transition-colors
        ${isSelected ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-100'}
        border
      `}
            onClick={() => onSelect(id)}
        >
            <div className="flex items-center justify-between">
                {/* Wyświetlanie nazwy z emoji */}
                <span className="font-medium">
                    {emoji} {name}
                </span>
                {onDelete && (
                    <Button
                        variant="danger"
                        size="sm"
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete(id);
                        }}
                    >
                        Usuń
                    </Button>
                )}
            </div>
        </motion.div>
    );
};
