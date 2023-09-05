/* eslint-disable react/no-unescaped-entities */
import React, { useState, useEffect } from 'react';

import Image from "next/image";
import arrow from "../../public/downarrow.png"
import nestimg from "../../public/nest.png"
import { Button } from '~/components/ui/button';
import { ArrowUpRight } from 'lucide-react';
import pixelbird from "../../public/pixelbird.png"
import Link from 'next/link';




export default function Home() {

  return (
    <>

      <IndexScrollNavigation />

      <section id="Section1"
        className="h-[100vh] w-full full-bg-white flex flex-col-reverse justify-between place-items-center bg-[100vw] md:flex-row text-justify">
        <div id='Text' className='basis-2/5'>
          <h2 className='font-bold text-4xl mb-2 text-left'>Discover Innovations</h2>
          <p>{`"The Nest" is a place where you can dive into a curated collection of projects 
        from around the world. Explore diverse ideas, groundbreaking solutions, and the brilliant
        minds behind them. Whether you're seeking inspiration or simply curious, there's a world of
        innovation waiting for you.`}</p>
          <Link href="/submit"><Button variant="destructive" className='my-3'>{`Check Out "The Nest (submit fornow)"`}
            <ArrowUpRight />
          </Button>
          </Link>
        </div>

        <div className='basis-3/5'>
          <Image src={nestimg} alt='NEST' className='scale-125 relative md:left-[100px] lg:left-[150px]' />
        </div>
      </section>




      <section id="Section2" className="h-[100vh] w-full full-bg-blue text-justify"></section>




      <section id="Section3" className="h-[100vh] w-full full-bg-green flex flex-col-reverse justify-between place-items-center md:flex-row text-justify">

        <div id='Text' className='basis-2/5'>
          <h2 className='font-bold text-4xl mb-2 text-left'>Ignite Your Imagination</h2>
          <p>{`Out of ideas? Let our AI, "The Vision" assist you! Generate unique project ideas tailored to your interests and expertise. 
        It's time to embark on a new journey of innovation and creativity with a little help from cutting-edge technology.`}</p>


          <Link href="/vision" scroll={false}>{<Button className='my-3'>Check Out "The Vision" <ArrowUpRight /></Button>}</Link>

        </div>

        <div className='basis-3/5 flex justify-items-end'>
          <Image src={pixelbird} alt='VISION' className='scale-125 relative md:left-[100px] lg:left-[150px]' />
        </div>

      </section>

    </>

  );
}


function IndexScrollNavigation() {

  const [currentSection, setCurrentSection] = useState<number>(1);

  useEffect(() => {
    const handleScroll = () => {
      const section2Top = document.getElementById('Section2')?.offsetTop ?? 0
      const section3Top = document.getElementById('Section3')?.offsetTop ?? 0


      if (window.scrollY < section2Top - 81) {
        setCurrentSection(1);
      } else if (window.scrollY < section3Top - 81) {
        setCurrentSection(2);
      } else {
        setCurrentSection(3);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  function handleNavigationScroll() {
    let targetSection: HTMLElement | null
    if (currentSection !== 3) {
      targetSection = document.getElementById(`Section${currentSection + 1}`);
    } else {
      targetSection = document.getElementById('Section1');
    }

    targetSection?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="fixed flex place-content-center bottom-5 right-5 rounded-full h-[calc(8vw)] aspect-square bg-white outline outline-green-300 hover:scale-110 cursor-pointer z-40" onClick={handleNavigationScroll}>
      <Image src={arrow} alt="Navigate" className={`scale-50 ${currentSection === 3 ? "rotate-180" : ""}`} />
    </div>
  )
}

