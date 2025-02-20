// src/components/AnimatedWrapper.js


import { motion, AnimatePresence } from 'framer-motion';

// Reusable animation variants
const defaultVariants = {
  hidden: { opacity: 0, scaleY: 0, originY: 0.5 },
  visible: {
    opacity: 1,
    scaleY: 1,
    originY: 0.5,
    transition: { duration: 0.5 },
  },
  exit: { opacity: 0, scaleY: 0, originY: 0.5, transition: { duration: 0.5 } },
};

// AnimatedWrapper component
const AnimatedWrapper = ({
  children,
  variants = defaultVariants,
  className = '',
  ...props
}) => {
  return (
    <AnimatePresence>
      <motion.div
        className={className}
        initial='hidden'
        animate='visible'
        exit='exit'
        variants={variants}
        {...props}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

export default AnimatedWrapper;
