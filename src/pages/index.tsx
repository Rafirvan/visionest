/* eslint-disable react/no-unescaped-entities */
import React, {useEffect, useState} from "react"
import Image from "next/image";
import nestimg from "../../public/nest3.png"
import { Button } from '~/components/ui/button';
import { ArrowUpRight } from 'lucide-react';
import visionimg from "../../public/vision.png"
import Link from 'next/link';
import PostCarousel from '~/components/postCarousel';
import s2bg from "../../public/s2mosaic.jpg"
import {motion} from "framer-motion"




export default function Home() {
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
  const animationProps = isMobile ? {} : {
    animate: { rotate: [0, 360] },
    transition: { duration: 100, repeat: Infinity, ease: "linear" }
  };

  return (
    <>


      <section id="Section1"
        className="min-h-[700px] w-full flex text-center justify-center place-items-center relative">
        <div id='Text' className=' md:basis-3/5 z-10'>
          <h1 className='font-bold text-6xl md:text-9xl mb-2 text-center'>Discover Innovations</h1>
          <p>{`"The Nest" adalah tempat di mana Anda dapat menyelam ke dalam koleksi tulisan yang telah dikurasi
              dari seluruh dunia. Jelajahi ide-ide beragam, solusi inovatif, dan pikiran cerdas di baliknya.
              Apakah Anda mencari inspirasi atau hanya sekedar penasaran? ada dunia inovasi yang menunggu Anda.`}</p>
          <Link href="nest" scroll={false}><Button variant="destructive" className='my-3 scale-x-200'>{`"The Nest"`}
            <ArrowUpRight />
          </Button>
          </Link>
        </div>

        <motion.div className=' opacity-30 absolute z-0'
          {...animationProps}
        >
          <Image src={nestimg} placeholder="empty" alt='NEST' />
        </motion.div>
      </section>


      <section id="Section2"
        className="bg-center py-10 bg-cover relative z-30 w-full text-justify flex flex-col justify-between  sm:py-8 place-content-center justify-items-center"
        style={{ backgroundImage: `url(${s2bg.src})`, }}>
        <div id='postslider' className='scale-75 sm:scale-100 basis-3/5  from-blue-400  to-blue-500 rounded-lg py-8 px-[32px] w-[364px] lg:w-[696px] xl:w-[1028px] overflow-x-hidden mx-auto'>
          <PostCarousel />
        </div>
        <div id='submitintro' className=' basis-2/5 justify-center '>
          <p id="text" className='font-bold text-5xl md:mb-2 text-center flex-1'>Beri Inspirasi Bagi Dunia</p>
          <p className='text-center'>
            <Link href="submit" scroll={false}>
              <Button variant="outline" className=' flex-1 text-green-700 text-2xl h-fit'>Upload Post<ArrowUpRight /></Button>
            </Link>

          </p>
        </div>

      </section>




      <section id="Section3" className="bg-[100vw] px-2 text-center md:text-left full-bg-green w-full flex justify-center place-items-center min-h-[500px]">

        <div id='Text' className="relative z-10 w-fit  md:basis-3/5 text-center">
          <h2 className='font-bold text-4xl mb-2'>Ignite Your Imagination</h2>
          <p>{`Ingin mencari ide untuk penelitian anda yang selanjutnya? AI kami, "The Vision", akan membantu Anda! Hasilkan ide proyek unik yang disesuaikan dengan minat dan keahlian Anda.
Saatnya memulai perjalanan baru dalam inovasi dan kreativitas dengan bantuan teknologi canggih`}</p>


          <Link href="vision" scroll={false}>{<Button className='my-3'>Check Out "The Vision" <ArrowUpRight /></Button>}</Link>

        </div>

        <div className='opacity-60 absolute z-0 '>
          <Image src={visionimg} alt='VISION' placeholder="empty" style={{ objectFit: "contain", }} />
        </div>

      </section>

    </>

  );
}



