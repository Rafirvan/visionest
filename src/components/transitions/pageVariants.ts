const LeftOut = {
    enter: { x: 0, transition: { type: 'stiff', stiffness: 80 } },
    exit: { x: '-120vw', transition: { ease: 'easeInOut', duration:0.5 } }, 
};


const RightOut = {
    enter: { x: 0, transition: { type: 'stiff', stiffness: 80 } },
    exit: { x: '120vw', transition: { ease: 'easeInOut', duration: 0.5 } }
};

const DownOut = {
    enter: { y: 0, transition: { type: 'stiff', stiffness: 80 } },
    exit: { y: '100vh', transition: { ease: 'easeInOut' } }
};



export { LeftOut, RightOut, DownOut }