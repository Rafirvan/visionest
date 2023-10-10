import { AnimatePresence,motion } from "framer-motion"
import { useState, useEffect } from "react"



interface ratingtype{
    rate: (rating: number) => void
    show:boolean
}



export default function Rating({rate, show}:ratingtype) {
    const[rated,setRated] = useState(false)

    useEffect(() => {
        if (!show) {
            setRated(false);
        }
    }, [show]);

    return (show &&
        <AnimatePresence >
                <motion.div
                    initial={{ y: 600 }}
                    animate={{ y: 0, transition: { ease: 'easeInOut', duration: 0.5 } }}
                    id="rate"
                    className="min-w-[300px] w-[40%] h-[120px] fixed bottom-10  right-10 opacity-70 hover:opacity-100 overflow-hidden border bg-gray-600 border-black p-4 z-30 rounded-lg shadow-lg">

                    <header className="text-2xl text-white font-bold mb-4 text-center">Beri Nilai Jawaban Ini!</header>

                    <AnimatePresence mode="wait">

                        {!rated ? <motion.ol
                            id="rating"
                            animate={{ x: 0 }}
                            exit={{ x: -1000, transition: { ease: 'easeInOut', duration: 0.5 } }}
                            className="flex justify-center gap-1 md:gap-7 list-none">
                            {[1, 2, 3, 4, 5].map((c) => (
                                <li className="decoration-none" key={c} onClick={() => { setRated(true); rate(c) }}>
                                    <div
                                        className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center hover:bg-blue-500 hover:text-white cursor-pointer"
                                    >
                                        {c}
                                    </div>
                                </li>
                            ))}
                        </motion.ol> : <p key="thanks" className="text-white text-xl text-center">Terima Kasih</p>}

                    </AnimatePresence>

                </motion.div>
            </AnimatePresence>
    
)

}