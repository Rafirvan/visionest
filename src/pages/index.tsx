/* eslint-disable react/no-unescaped-entities */
import React from "react"
import Image from "next/image";
import nestimg from "../../public/nest.png"
import { Button } from '~/components/ui/button';
import { ArrowUpRight } from 'lucide-react';
import pixelbird from "../../public/pixelbird.png"
import Link from 'next/link';
import PostCarousel from '~/components/postCarousel';




export default function Home() {

  return (
    <>


      <section id="Section1"
        className="min-h-[700px] w-full full-bg-white flex flex-col-reverse justify-between place-items-center bg-[100vw] md:flex-row ">
        <div id='Text' className='basis-2/5'>
          <h2 className='font-bold text-4xl mb-2 text-left'>Discover Innovations</h2>
          <p>{`"The Nest" adalah tempat di mana Anda dapat menyelam ke dalam koleksi tulisan yang telah dikurasi
              dari seluruh dunia. Jelajahi ide-ide beragam, solusi inovatif, dan pikiran cerdas di baliknya.
              Apakah Anda mencari inspirasi atau hanya sekedar penasaran? ada dunia inovasi yang menunggu Anda.`}</p>
          <Link href="nest" scroll={false}><Button variant="destructive" className='my-3 scale-x-200'>{`"The Nest"`}
            <ArrowUpRight />
          </Button>
          </Link>
        </div>

        <div className='basis-3/5'>
          <Image src={nestimg} alt='NEST' className='scale-125 relative md:left-[100px] lg:left-[150px]' />
        </div>
      </section>


      <section id="Section2" className="min-h-[650px] w-full full-bg-blue text-justify flex flex-col justify-between py-8 place-content-center justify-items-center">
        <div id='postslider' className='scale-75 md:scale-100 basis-3/5 bg-gradient-to-b from-blue-400  to-blue-500 rounded-lg py-8 px-[32px] w-[364px] lg:w-[696px] xl:w-[1028px] mx-auto overflow-x-hidden '>
          <PostCarousel />
        </div>
        <div id='submitintro' className=' basis-2/5 justify-center gap-10'>
          <p id="text" className='font-bold text-5xl mb-2 text-center flex-1'>Beri Inspirasi Bagi Dunia</p>
          <p className='text-center'>
            <Link href="submit" scroll={false}>
              <Button variant='ghost' className='my-3 flex-1 text-green-700 text-4xl h-fit'>Mulai Upload Karya Anda<ArrowUpRight /></Button>
            </Link>

          </p>
        </div>

      </section>




      <section id="Section3" className="min-h-full w-full full-bg-green flex flex-col-reverse justify-between place-items-center md:flex-row ">

        <div id='Text' className='basis-2/5'>
          <h2 className='font-bold text-4xl mb-2 text-left'>Ignite Your Imagination</h2>
          <p>{`Ingin mencari ide untuk penelitian anda yang selanjutnya? AI kami, "The Vision", akan membantu Anda! Hasilkan ide proyek unik yang disesuaikan dengan minat dan keahlian Anda.
Saatnya memulai perjalanan baru dalam inovasi dan kreativitas dengan bantuan teknologi canggih`}</p>


          <Link href="vision" scroll={false}>{<Button className='my-3'>Check Out "The Vision" <ArrowUpRight /></Button>}</Link>

        </div>

        <div className='basis-3/5 flex justify-items-end'>
          <Image src={pixelbird} alt='VISION' className=' relative md:left-[100px] lg:left-[150px]' />
        </div>

      </section>

    </>

  );
}



