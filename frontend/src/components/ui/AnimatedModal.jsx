import React, { useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// --- 1. Animation Variants ---

const backdropVariants = {
  visible: { opacity: 1 },
  hidden: { opacity: 0 },
};

const modalVariants = {
  hidden: {
    y: '-100px',
    opacity: 0,
    scale: 0.9,
  },
  visible: {
    y: '0',
    opacity: 1,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 15,
    },
  },
  exit: {
    y: '50px',
    opacity: 0,
    transition: {
        duration: 0.2
    }
  }
};


// --- 2. Main Modal Component ---

const AnimatedModal = ({ isOpen, handleClose, children, title, footer }) => {
  const modalRef = useRef(null);

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        // Backdrop adjusted for translucent white
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-70 backdrop-blur-sm p-4 overflow-y-auto" // <-- Changed here
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          onClick={handleBackdropClick}
        >
          {/* Modal Content */}
          <motion.div
            ref={modalRef}
            className="bg-white rounded-xl shadow-2xl w-full max-w-lg mx-auto transform transition-all"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
          >
            
            {/* Modal Header */}
            <div className="flex justify-between items-center p-5 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">{title || 'Modal Title'}</h3>
              <button
                onClick={handleClose}
                className="text-gray-400 hover:text-gray-600 transition duration-150 p-1 rounded-full hover:bg-gray-100"
                aria-label="Close modal"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              {children}
            </div>

            {/* Modal Footer (Optional) */}
            {footer && (
                <div className="p-5 border-t border-gray-200 flex justify-end space-x-3">
                    {footer}
                </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AnimatedModal;