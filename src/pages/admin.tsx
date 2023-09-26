import { trpc } from "~/utils/api"
import { useEffect, useState } from "react"
import { useUser } from "@clerk/nextjs"
import Link from "next/link"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "~/components/ui/table"
import { CheckCheck } from "lucide-react"
import { XCircle } from "lucide-react"
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "~/components/ui/dialog"
import { Button } from "~/components/ui/button"



interface posttype {
    id: string,
    title: string
}


export default function Page() {
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [rejectionMessage, setRejectionMessage] = useState("")
    const { user, isLoaded } = useUser()
    const accept = trpc.db.acceptpost.useMutation()
    const reject = trpc.db.rejectpost.useMutation()
    const [postCall, setPostCall] = useState<posttype[]>()
    const Call = trpc.db.callpostforadmin.useMutation({
        onSuccess: (result) => {
            setPostCall(result)
        }
    })

    useEffect(() => {
        Call.mutate()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    function handleAccept(id: string) {
        console.log(id, "accepted")
        accept.mutate({ id: id, tags: selectedTags })
        setPostCall(postCall?.filter((postCall) => postCall.id != id))
    }

    function handleReject(id: string) {
        console.log(id, "rejected")
        console.log("with reasoning:", rejectionMessage)
        reject.mutate({
            id: id,
            rejectionmessage: rejectionMessage
        })
        setRejectionMessage("")
        setPostCall(postCall?.filter((postCall) => postCall.id != id))
    }

    function tagUpdate(array: string[]) {
        setSelectedTags(array)
        console.log(selectedTags)
    }


    if (!isLoaded) return <div></div>

    if (user?.publicMetadata.role != "admin") return <section>UNATUTHORIZED ACCESS, ADMIN ONLY</section>


    return (
        <section className="pb-20">
            <div className="text-2xl  font-bold text-orange-400 ">ADMIN PAGE</div>
            <hr className="mb-5 bg-amber-800 h-2 rounded-md"></hr>
            <p className="text-xl text-slate-400">Pending Posts</p>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Judul Post</TableHead>
                        <TableHead>Aksi</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {postCall?.map((post =>
                        <TableRow key={post.id}>
                            <TableCell><Link href={`nest/${post.id}`} className="text-blue-600 underline overflow-ellipsis">{post.title}</Link></TableCell>
                            <TableCell className="flex gap-10">

                                {/* Acceptance */}
                                <Dialog>
                                    <DialogTrigger>
                                        <CheckCheck onClick={() => setSelectedTags([])} className="hover:text-green-600 scale-150 cursor-pointer" />
                                    </DialogTrigger>
                                    <DialogContent >
                                        <DialogTitle>{`Pilih Tag Untuk "${post.title}"`}</DialogTitle>
                                        <Tags tagUpdate={tagUpdate} />
                                        <div className="flex justify-center gap-10">
                                            <DialogTrigger asChild>
                                                <Button variant="secondary">Cancel</Button>
                                            </DialogTrigger>
                                            <DialogTrigger asChild>
                                                <Button onClick={() => handleAccept(post.id)}>Accept</Button>
                                            </DialogTrigger>
                                        </div>
                                    </DialogContent>
                                </Dialog>

                                {/* rejection */}
                                <Dialog>
                                    <DialogTrigger>
                                        <XCircle className="hover:text-red-600 scale-150 cursor-pointer" />
                                    </DialogTrigger>
                                    <DialogContent >
                                        <DialogTitle>{`Tulis Pesan Rejeksi Untuk "${post.title}"`}</DialogTitle>
                                        <textarea
                                            value={rejectionMessage}
                                            onChange={(e) => { setRejectionMessage(e.target.value) }}
                                            rows={5}
                                            className="px-1"
                                        />
                                        <div className="flex justify-center gap-10">
                                            <DialogTrigger asChild>
                                                <Button>Cancel</Button>
                                            </DialogTrigger>
                                            <DialogTrigger asChild>
                                                <Button variant="destructive" onClick={() => handleReject(post.id)}>Reject</Button>
                                            </DialogTrigger>
                                        </div>
                                    </DialogContent>
                                </Dialog>

                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </section>
    )

}

function Tags({ tagUpdate }: { tagUpdate: (array: string[]) => void }) {
    const [selectedTags, setSelectedTags] = useState<string[]>([]);

    useEffect(() => {
        tagUpdate(selectedTags);
    }, [selectedTags, tagUpdate]);

    const handleTagToggle = (tag: string) => {
        if (selectedTags.includes(tag)) {
            setSelectedTags((prev) => prev.filter((t) => t !== tag));
        } else {
            setSelectedTags((prev) => [...prev, tag]);
        }
    };

    return (
        <div className="flex flex-wrap gap-2">
            {allTags.map((tag) => (
                <button
                    key={tag}
                    onClick={() => handleTagToggle(tag)}
                    className={`text-sm px-2 py-1 border rounded 
                      ${selectedTags.includes(tag) ? 'bg-orange-500 text-white' : 'bg-gray-300 text-gray-700'}`}
                >
                    {tag}
                </button>
            ))}
        </div>
    );
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