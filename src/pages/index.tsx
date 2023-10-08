/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
/* eslint-disable react/no-unescaped-entities */
import React, {useRef} from "react"
import Image from "next/image";
import nestimg from "../../public/nest3.png"
import { Button } from '~/components/ui/button';
import { ArrowUpRight } from 'lucide-react';
import visionimg from "../../public/vision.png"
import Link from 'next/link';
import PostCarousel from '~/components/postCarousel';
import { motion, useInView } from "framer-motion"
import { LeftOut } from "~/components/transitions/pageVariants";
import useIsMobile from "~/hooks/useIsMobile";
import { TypeAnimation } from 'react-type-animation';






export default function Home() {
  const s3ref = useRef(null)
  const isInView = useInView(s3ref,{once:true})
  const isMobile = useIsMobile()

  const animationProps = isMobile ? {} : {
    animate: { rotate: [0, 360] },
    transition: { duration: 100, repeat: Infinity, ease: "linear" }
  };


  const textAnimationVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1},
  };
  const descriptionVariants = {
    hidden: { opacity: 0, height: 0, overflow: "hidden" },
    visible: { opacity: 1, height: "auto", overflow: "visible" }
  };

  return (
    <motion.div
      animate="enter"
      exit="exit"
      variants={LeftOut}>
      <section id="Section1"
        className="min-h-[700px] w-[90%] left-[5%] flex text-center justify-center place-items-center relative">
        <div id='Text' className='md:basis-3/5 z-10 max-w-[710px]'>
          <motion.h1
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.5 }}
            variants={textAnimationVariants}
            className='font-bold text-5xl xs:text-6xl sm:text-7xl md:text-9xl text-center'>Discover Innovations </motion.h1>
          <motion.div
            initial="hidden"
            animate="visible"
            variants={descriptionVariants}
            transition={{ duration: 0.8, delay: 0.8,}}>
          <p
            className="font-mono">{`"The Nest" adalah tempat di mana Anda dapat melihat koleksi blogpost yang telah dikurasi
              dari seluruh dunia. Jelajahi ide-ide beragam, solusi inovatif, dan pikiran cerdas di baliknya.
              Apakah Anda mencari inspirasi atau hanya sekedar penasaran? ada dunia inovasi yang menunggu Anda.`}</p>
          <Link href="nest" scroll={false}><Button variant="destructive" className='my-3 scale-110'>{`"The Nest"`}
            <ArrowUpRight />
          </Button>
            </Link>
          </motion.div>
        </div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={textAnimationVariants}
          className={`absolute z-0 ${isMobile? "scale-300": "scale-200"}`}
          transition={{ duration: 0.8, delay: 0.8 }}>
          <motion.div 
          className="opacity-30"
          {...animationProps}
        >
          <Image src={nestimg} placeholder="empty" alt='NEST' quality={50} priority />
          </motion.div>
        </motion.div>
      </section>


      <section id="Section2"
        className="  bg-center py-10 bg-cover relative z-30 w-full text-justify flex flex-col justify-between  sm:py-8 place-content-center justify-items-center"
      >
        <div id='postslider' className='scale-90 sm:scale-100 basis-3/5  from-blue-400  to-blue-500 rounded-lg py-8 px-[32px] w-[364px] lg:w-[696px] xl:w-[1028px] overflow-x-hidden mx-auto'>
          <PostCarousel />
        </div>
        <div id='submitintro' className=' basis-2/5 justify-center '>
          <p id="text" className='font-bold text-4xl sm:text-5xl md:mb-2 text-center flex-1'>Beri Inspirasi Bagi Dunia</p>
          <p className='text-center'>
            <Link href="submit" scroll={false}>
              <Button variant="outline" className=' flex-1 text-green-700 text-2xl h-fit outline-none border-none'>Upload Post<ArrowUpRight /></Button>
            </Link>

          </p>
        </div>

      </section>




      <section id="Section3" className="bg-[100vw] px-2 text-center md:text-left full-bg-green w-full flex justify-center place-items-center min-h-[500px]">

        <div id='Text' ref={s3ref} className="relative z-10 w-fit  md:basis-3/5 text-center">
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: isInView ? 1 : 0 }}
            transition={{ duration: 0.5, }}
            className='font-bold text-4xl mb-2'>Ignite Your Imagination
          </motion.h2>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{opacity:isInView?1:0}}
            transition={{ duration: 0.5, }}
            className="flex flex-col"
            >
             
            {isInView&&<TypeAnimation
              sequence={[`Ingin mencari ide untuk penelitian anda yang selanjutnya? AI kami, 
              "The Vision", akan membantu Anda! Hasilkan ide proyek unik yang disesuaikan 
              dengan minat dan keahlian Anda.
              Saatnya memulai perjalanan baru dalam inovasi dan kreativitas dengan bantuan teknologi canggih`]}
              className="font-mono inline-block"
              wrapper="p"
              speed={80}
            ></TypeAnimation>}
          

            
            <Link href="vision" scroll={false}>{<Button className='my-3'>Check Out "The Vision" <ArrowUpRight /></Button>}</Link>
          </motion.div>

        </div>

        <div className='opacity-60 absolute z-0 '>
          <Image src={visionimg} alt='VISION' placeholder="empty" style={{ objectFit: "contain", }} />
        </div>
      

      </section>

    </motion.div>

  );
}



