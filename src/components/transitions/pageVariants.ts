const RightInLeftOut = {
    initial: { x: '-150vw' },
    enter: { x: 0, transition: { type: 'stiff', stiffness: 80 } },
    exit: { x: '-150vw', transition: { ease: 'easeInOut' } }
};

const noAnimation = {
    initial: { x: '0' },
    enter: { x: 0, transition: { type: 'stiff', stiffness: 80 } },
    exit: { x: '0', transition: { ease: 'easeInOut' } }
};

const LeftInRightOut = {
    initial: { x: '100vw' },
    enter: { x: 0, transition: { type: 'stiff', stiffness: 80 } },
    exit: { x: '100vw', transition: { ease: 'easeInOut' } }
};

const UpInDownOut = {
    initial: { y: '100vh' },
    enter: { y: 0, transition: { type: 'stiff', stiffness: 80 } },
    exit: { y: '100vh', transition: { ease: 'easeInOut' } }
};



export { RightInLeftOut, LeftInRightOut, UpInDownOut, noAnimation }