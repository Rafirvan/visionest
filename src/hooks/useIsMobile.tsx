import { useState, useEffect } from 'react';

// Custom hook to detect if user is on a mobile device
function useIsMobile() {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const userAgent =
            typeof navigator === 'undefined' ? '' : navigator.userAgent;
        const mobile = Boolean(
            userAgent.match(
                /Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i
            )
        );
        setIsMobile(mobile);
    }, []);

    return isMobile;
}

export default useIsMobile;