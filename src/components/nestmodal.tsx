import React, { useRef, type ReactNode, type MouseEvent } from 'react';
import { motion } from 'framer-motion';

interface ModalProps {
    children: ReactNode;
    onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ children, onClose }) => {
    const modalRef = useRef<HTMLDivElement>(null);

    const handleClickOutside = (e: MouseEvent<HTMLDivElement>) => {
        if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
            onClose();
        }
    };

    return (
        <section
            className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50 "
            onClick={handleClickOutside}
        >
            <motion.div
                initial={{ y: "100vh", opacity: 0 }}  // Initial state: Positioned at the bottom with opacity 0
                animate={{ y: "0", opacity: 1 }}  // Animated state: Positioned at its natural position with opacity 1
                exit={{ y: "100vh", opacity: 0 }}  // Exit state: Positioned back at the bottom with opacity 0
                transition={{ duration: 0.2 }}  // Optional: Control the animation duration and easing
                className="bg-white rounded-lg p-8"
            >
                <div
                    ref={modalRef}
                    className="bg-white p-6 rounded-lg shadow-lg relative "
                >
                    {children}
                    <button
                        className="absolute top-2 right-2 text-xl font-bold"
                        onClick={onClose}
                    >
                        &times;
                    </button>
                </div>
            </motion.div>
        </section>

    );
};

export default Modal;
