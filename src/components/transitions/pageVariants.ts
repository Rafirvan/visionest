const RightInLeftOut = {
    initial: { x: '-100vw' },
    enter: { x: 0, transition: { type: 'stiff', stiffness: 80 } },
    exit: { x: '-100vw', transition: { ease: 'easeInOut' } }
};


const LeftInRightOut = {
    initial: { x: '100vw' },
    enter: { x: 0, transition: { type: 'stiff', stiffness: 80 } },
    exit: { x: '100vw', transition: { ease: 'easeInOut' } }
};



export { RightInLeftOut, LeftInRightOut }