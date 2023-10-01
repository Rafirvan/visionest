/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable react-hooks/exhaustive-deps */
import { Input } from "./ui/input";
import { Search } from "lucide-react";
import { Label } from "./ui/label";
import React, { useState, useRef, useEffect } from "react";
import { trpc } from "~/utils/api";
import { ScrollArea } from "./ui/scroll-area";
import Image from "next/image";
import Loadingimage from "public/loadingimage.gif"
import { useRouter } from "next/router";





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
    const router = useRouter()

    useEffect(() => {
        if (input == "" && (!selectedTags || selectedTags.length == 0)) {
            setFilteredPosts(undefined); setTimeout(() => {
                setFilteredPosts([])
            }, 1);
            return
        }
        const filterbytag = callposts?.filter(post => selectedTags.every(entry => post.posttag.map(pt => pt.tag.name).includes(entry)))
        const filterbytext = filterbytag?.filter(post =>
            (post.title + post.authors + post.university).toLowerCase().replace(/\s+/g, '').includes(input.toLowerCase().replace(/\s+/g, ''))
        )
        if (filterbytext) setFilteredPosts(filterbytext)
    }, [input, selectedTags])

    const handleTagToggle = (tag: string) => {
        if (selectedTags.includes(tag)) {
            setSelectedTags((prev) => prev.filter((t) => t !== tag));
        } else {
            setSelectedTags((prev) => [...prev, tag]);
        }
    };




    return (<div id="search" className="w-[10%] lg:w-[40%] place-items-center gap-5 flex">
        <Label htmlFor="searchbar" className="cursor-pointer" onClick={() => setIsOpen(!isOpen)}><Search /></Label>
        <Input
            className={`${!isOpen && "hidden"} fixed top-[80px] left-[10%] lg:left-[20%]  w-[80%] lg:w-full lg:static lg:flex rounded-md border-2`}
            id="searchbar"
            autoComplete="off"
            placeholder="Cari judul/penulis/universitas..."
            onChange={(e) => setInput(e.target.value)}
            onBlur={(e) => { if (dropdownRef.current && !dropdownRef.current.contains(e.relatedTarget)) setIsOpen(false) }}
            onFocus={() => setIsOpen(true)}
        />

        {(isOpen && callposts) && (
            <div
                id="dropdown"
                ref={dropdownRef}
                className=" w-full border-4 rounded-xl bg-white absolute left-0  lg:left-[20%]  max-w-[100%]  lg:max-w-[60%] top-[125px] lg:top-full"
                onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation()
                }}
            >
                <p className=" underline decoration-slate-300">Rekomendasi</p>
                <ScrollArea id="posts" className="h-[280px]">
                    {isLoading ? <div>Loading...</div> : filteredPosts?.map(post => (
                        <div key={post.id}
                            onClick={async () => {
                                await router.push(`/nest/${post.id}`);
                                if (document.activeElement) {
                                    (document.activeElement as HTMLElement).blur();
                                }
                            }}
                            className="flex pl-4 hover:bg-gray-200 cursor-pointer rounded-md h-[55px] overflow-hidden">
                            <p className="overflow-hidden overflow-ellipsis line-clamp-2 p-1 w-[90%]">
                                {post.title}&mdash;{post.authors}&mdash;{post.university}
                            </p>
                            <div id="image" className="w-[10%] flex place-items-center pr-2">
                                <Image
                                    src={post.imageURL}
                                    alt=""
                                    placeholder="blur"
                                    blurDataURL={Loadingimage.src}
                                    height={55}
                                    width={55}

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