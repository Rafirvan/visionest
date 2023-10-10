import { Dialog, DialogTrigger, DialogContent, DialogTitle } from "./ui/dialog"
import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { trpc } from "~/utils/api";

// interface AImodalType {
//     aiLoading:boolean
// }


export default function AImodal({ setDescriptionValue, setShowRatingDelay, setAiLoadingHoist }: { setDescriptionValue: React.Dispatch<React.SetStateAction<string>>, setShowRatingDelay: React.Dispatch<React.SetStateAction<boolean>>, setAiLoadingHoist: React.Dispatch<React.SetStateAction<boolean>> }) {
    const [abstractValue, setAbstractValue] = useState('');
    const [aiLoading, setAiLoading] = useState(false);


    useEffect(() => { if (aiLoading) setAiLoadingHoist(true); else setAiLoadingHoist(false) },[aiLoading])
    

    const AIcall = trpc.completion.content.useMutation({
        onSuccess: (result) => {
            if (result) {
                setDescriptionValue(result)
                setAiLoading(false)
                setTimeout(() => {
                    setShowRatingDelay(false);
                }, 5000);
            }
        }
    });
    //alert if abstract too little/big
    function generateDescription() {
        const len = abstractValue.replace(/\s/g, '').length
        if (len < 300 || len > 3000)
            alert("Anda membutuhkan input minimal 300 karakter dan maksimal 3000 karakter")

        else {
            setDescriptionValue("AI sedang menggenerasi output, JANGAN HAPUS PESAN INI, harap tunggu beberapa menit...")
            setAiLoading(true)
            AIcall.mutate({ text: abstractValue })
        }

    }

    return (<span>
        {/* Ai button dialog */}
        <Dialog>
            <DialogTrigger disabled={aiLoading} className=" text-blue-700 disabled:text-white disabled:select-none disabled:cursor-default">
                <p className=" hover:underline pl-2">{`Coba generasi deskripsi menggunakan AI!`}</p>
            </DialogTrigger>
            <DialogContent>
                <DialogTitle>{`Insert your paper's abstract`}</DialogTitle>
                <textarea
                    id="abstract"
                    value={abstractValue}
                    onChange={(e) => setAbstractValue(e.target.value)}
                    className="text-justify my-2 flex w-full rounded-md border-2 border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50  dark:border-slate-800 dark:bg-slate-950 dark:ring-offset-slate-950 dark:placeholder:text-slate-400 dark:focus-visible:ring-slate-300"
                    placeholder="minimum of 300 non-whitespace characters, maximum of 3000 characters"
                    rows={15}
                />
                <div>Character count = {abstractValue.replace(/\s/g, '').length}</div>
                <DialogTrigger asChild>
                    <Button onClick={generateDescription}>Generate</Button>
                </DialogTrigger>
            </DialogContent>
        </Dialog>
    </span>)
}