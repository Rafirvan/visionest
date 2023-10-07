

import { useState, useEffect } from 'react';

function useIsLandscape() {
  const [isLandscape, setIsLandscape] = useState(false);

  useEffect(() => {
    const checkOrientation = () => {      
      setIsLandscape(window.innerWidth > window.innerHeight);
    };

    //initial check
    checkOrientation();

    window.addEventListener('resize', checkOrientation);

    return () => {
      window.removeEventListener('resize', checkOrientation);
    };
  }, []);

  return isLandscape;
}

export default useIsLandscape;
