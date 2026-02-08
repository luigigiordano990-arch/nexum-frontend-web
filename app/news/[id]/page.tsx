"use client";

import { useEffect, useState, Suspense } from 'react';
import { useParams } from 'next/navigation';

export const dynamic = 'force-dynamic';

function PostDetailContent() {
    const params = useParams();
    const [post, setPost] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Sostituisci con il tuo URL reale di Render
        fetch(`https://nexum-backend.onrender.com/posts`) 
            .then(res => res.json())
            .then(data => {
                // Cerchiamo il post specifico nella lista
                const trovato = data.find((p: any) => p.id.toString() === params.id);
                setPost(trovato);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [params.id]);

    if (loading) return <div className="p-10 text-white">Caricamento post...</div>;
    if (!post) return <div className="p-10 text-white">Post non trovato.</div>;

    return (
        <div className="min-h-screen bg-black text-white p-8">
            <h1 className="text-3xl font-bold mb-4">{post.autore}</h1>
            <p className="text-lg text-slate-300">{post.contenuto}</p>
            <div className="mt-4 text-sm text-slate-500">{post.data}</div>
        </div>
    );
}

export default function PostDetailPage() {
    return (
        <Suspense fallback={<div className="bg-black h-screen"></div>}>
            <PostDetailContent />
        </Suspense>
    );
}
