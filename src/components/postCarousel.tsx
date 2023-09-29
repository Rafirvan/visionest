/* eslint-disable react-hooks/exhaustive-deps */
import { useRef } from "react";
import { ArrowRight, ArrowLeft } from "lucide-react";
import PostCard from "./postCard";
import { trpc } from "~/utils/api";

export default function PostCarousel() {
    const carouselRef = useRef<HTMLDivElement>(null);
    const { data: CardContents, isLoading } = trpc.db.callpostid.useQuery({ many: 5 })

    const scroll = (direction: 'left' | 'right') => {
        if (carouselRef.current) {
            console.log("scroll")
            carouselRef.current.scrollBy({
                top: 0,
                left: direction === 'left' ? -332 : 332,
                behavior: 'smooth'
            });
        }
    };

    return (
        <div className="relative">
            <div>
                <button
                    className="absolute top-1/2 left-[-30px] transform -translate-y-1/2 z-10"
                    onClick={() => scroll('left')}
                >
                    <ArrowLeft className="hover:text-white" />
                </button>
                <button
                    className="absolute top-1/2 right-[-30px]  transform -translate-y-1/2 z-10"
                    onClick={() => scroll('right')}
                >
                    <ArrowRight className="hover:text-white" />
                </button>
            </div>


            <div id="carousel" className="relative overflow-x-auto snap-x snap-mandatory" ref={carouselRef}>
                <div
                    className="flex w-[1628px] h-[350px] gap-[32px]"
                >
                    {isLoading ? <div>LOADING...</div> : CardContents?.map((id, index) => (
                        <PostCard key={index} postID={id} />
                    ))}
                </div>

            </div>
        </div >
    );
}
