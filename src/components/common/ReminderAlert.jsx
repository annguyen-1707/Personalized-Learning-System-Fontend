import { useEffect } from 'react';
import { motion } from "framer-motion";
import { X } from 'lucide-react';

function ReminderAlert({ reminder, onClose }) {
    useEffect(() => {
        if (!reminder) return;
        const timer = setTimeout(() => {
            onClose();
        }, 10000);
        return () => clearTimeout(timer);
    }, [reminder, onClose]);

    if (!reminder) return null;

    return (
        <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ duration: 0.4 }}
            className="fixed top-[60%] right-8 bg-white border-l-4 border-blue-500 shadow-2xl p-6 rounded-2xl w-[400px] z-50"
        >
            <div className="flex items-start justify-between">
                <div>
                    <h2 className="text-lg font-semibold text-blue-700 flex items-center gap-2">
                        📢 Nhắc học bài!
                    </h2>
                    <p className="mt-2 text-gray-700">{reminder.note}</p>
                </div>
                <button
                    onClick={onClose}
                    className="ml-4 text-gray-400 hover:text-red-500 transition"
                >
                    <X size={22} />
                </button>
            </div>
        </motion.div>
    );
};

export default ReminderAlert;
