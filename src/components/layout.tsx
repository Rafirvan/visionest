
import Navbar from './navbar'
import React from 'react'
import { motion } from 'framer-motion'



type LayoutProps = {
    children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
    return (
        <>
            <Navbar />
            <motion.div
                initial={{ x: 700, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -700, opacity: 0 }}
                transition={{
                    type: "Tween",
                    stiffness: 260,
                    damping: 20,
                }}

            >{children}</motion.div>
        </>
    )
}