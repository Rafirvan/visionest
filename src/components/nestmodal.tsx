import React, { useRef, type ReactNode, type MouseEvent } from 'react';

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
        </section>
    );
};

export default Modal;
