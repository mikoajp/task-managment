import { AddTask } from "@/components/tasks/addTask";
import { AnimatePresence, motion } from "framer-motion";

interface CreateTaskModalProps {
    isOpen: boolean;
    onClose: () => void;
    pocketId: string;
    onTaskAdded: () => void;
}

export function CreateTaskModal({ isOpen, onClose, pocketId, onTaskAdded }: CreateTaskModalProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-40 flex justify-center items-end md:items-center pb-2">
                    {/* Overlay */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="fixed inset-0 bg-black bg-opacity-50"
                        onClick={onClose}
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "100%" }}
                        transition={{ type: "spring", stiffness: 100, damping: 20 }}
                        className="relative bg-white w-full max-w-lg max-h-[85vh] md:max-h-[70vh] rounded-t-3xl md:rounded-lg shadow-xl p-6 pb-6 overflow-y-auto"
                    >
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold text-gray-800">Add Task</h3>
                            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                                ✕
                            </button>
                        </div>

                        {/* Zawartość przewijana */}
                        <div className="max-h-[60vh] md:max-h-[50vh] overflow-y-auto px-1">
                            <AddTask
                                pocketId={pocketId}
                                onTaskAdded={() => {
                                    onTaskAdded();
                                    onClose();
                                }}
                            />
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
