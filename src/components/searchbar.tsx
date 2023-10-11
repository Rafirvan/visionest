/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable react-hooks/exhaustive-deps */
import { Input } from "./ui/input";
import { Search } from "lucide-react";
import { Label } from "./ui/label";
import React, { useState, useRef, useEffect } from "react";
import { trpc } from "~/utils/api";
import { ScrollArea } from "./ui/scroll-area";
import Image from "next/image";
import { useRouter } from "next/router";
import { Skeleton } from "./ui/skeleton";
import getRandomHexColor from "~/utils/getRandomHexColor";






interface post {
    posttag: {
        tag: { name: string }
    }[]
    title: string,
    authors: string,
    university: string,
    id: string,
    imageURL: string
}



export default function Searchbar() {


    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [input, setInput] = useState("")
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const { data: callposts, isLoading: isLoading } = trpc.db.callforsearch.useQuery()
    const [filteredPosts, setFilteredPosts] = useState<post[] | undefined>();
    const dropdownRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const router = useRouter()

    //set tags on or off
    useEffect(() => {
        const filterbytag = callposts?.filter(post => selectedTags.every(entry => post.posttag.map(pt => pt.tag.name).includes(entry)))
        const filterbytext = filterbytag?.filter(post =>
            (post.title + post.authors + post.university).toLowerCase().replace(/\s+/g, '').includes(input.toLowerCase().replace(/\s+/g, ''))
        )
        if (filterbytext) setFilteredPosts(filterbytext)
    }, [input, selectedTags,callposts])

    
    const handleTagToggle = (tag: string) => {
        if (selectedTags.includes(tag)) {
            setSelectedTags((prev) => prev.filter((t) => t !== tag));
        } else {
            setSelectedTags((prev) => [...prev, tag]);
        }
    };



    //close if click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent | TouchEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node) &&
                inputRef.current &&
                !inputRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('touchstart', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('touchstart', handleClickOutside);
        };
    }, []);


    //close if route change
    useEffect(() => {
        const handleRouteChange = () => {
            setIsOpen(false);
        };
        router.events.on('routeChangeStart', handleRouteChange);
        return () => {
            router.events.off('routeChangeStart', handleRouteChange);
        };
    }, [router]);




    return (<div id="search" className="w-[10%] lg:w-[40%] place-items-center gap-5 flex">
        <Label htmlFor="searchbar" className="cursor-pointer" onClick={() => setIsOpen(!isOpen)}><Search /></Label>
        <Input
            ref={inputRef}
            className={`${!isOpen && "hidden"} fixed top-[80px] left-[10%] lg:left-[20%]  w-[80%] lg:w-full lg:static lg:flex rounded-md border-2`}
            id="searchbar"
            autoComplete="off"
            placeholder="Cari judul/penulis/universitas..."
            onChange={(e) => setInput(e.target.value)}
            onFocus={(e) => {
                e.preventDefault();
                setIsOpen(true);
            }}
        />


        {(isOpen) && (
            <div
                id="dropdown"
                ref={dropdownRef}
                className=" w-full border-4 rounded-xl bg-white absolute left-[6%]  lg:left-[20%]  max-w-[88%]  lg:max-w-[60%] top-[125px] lg:top-full"
            >
                <p className=" underline decoration-slate-300">Rekomendasi</p>
                <ScrollArea id="posts" className="h-[280px]">
                    
                    {isLoading ? [1, 2, 3, 4, 5].map((e) => { return <div key={e} className=" px-4 py-1 rounded-md h-[55px] w-full "><Skeleton delay={200 * e} className="h-full w-full" /></div> }) :
                        
                        filteredPosts?.map(post => (
                        <div key={post.id}
                            onClick={async () => {
                                await router.push(`/nest/${post.id}`, undefined, {scroll:false});
                                if (document.activeElement) {
                                    // unfocus the input
                                    (document.activeElement as HTMLElement).blur();
                                }
                            }}
                            className="flex pl-4 hover:bg-gray-200 cursor-pointer rounded-md h-[55px] overflow-hidden">
                            <p className="overflow-hidden overflow-ellipsis line-clamp-2 p-1 w-[90%]">
                                {post.title}&mdash;{post.authors}&mdash;{post.university}
                            </p>
                            <div id="image" className="w-[100px] flex place-items-center pr-2">
                                <Image
                                    src={post.imageURL}
                                    alt=""
                                        placeholder="empty"
                                        style={{backgroundColor:getRandomHexColor()}}
                                    height={200}
                                    width={200}
                                />
                            </div>
                        </div>
                    ))}
                </ScrollArea>
                <div id="tags" className="pl-4 border-t-2 border-black pb-5">
                    <p className="p-1 underline decoration-slate-300">Filter Berdasarkan Kategori</p>
                    <ScrollArea className="h-[200px]">
                        {allTags.map((tag) => (
                            <button
                                key={tag}
                                onClick={() => handleTagToggle(tag)}
                                className={` text-sm px-2 py-1 m-1 border rounded 
                      ${selectedTags.includes(tag) ? 'bg-orange-500 text-white' : 'bg-gray-300 text-gray-700'}`}
                            >
                                {tag}
                            </button>
                        ))}
                    </ScrollArea>
                </div>
            </div>
        )}
    </div>)
}


const allTags = [
    "Bahasa Indonesia", "Bahasa Inggris", "Agama", "Agrikultur", "Astronomi",
    "Bangunan", "Biologi", "Desain Grafis", "Edukasi", "Ekonomi", "Energi",
    "Fauna", "Filosofi", "Fisika", "Flora", "Geografi", "Geologi",
    "Hukum", "Jurnalistik", "Kedokteran", "Kehutanan", "Kesenian", "Kesehatan",
    "Kewarganegaraan", "Kimia", "Komputer", "Komunikasi", "Manajemen", "Maritim",
    "Makanan", "Matematika", "Musik", "Olahraga", "Pariwisata", "Pemrograman",
    "Politik", "Psikologi", "Sastra Indonesia", "Sastra Internasional", "Sejarah",
    "Sosiologi", "Teknologi"
];