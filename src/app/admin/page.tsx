'use client'
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowUp, ArrowDown, Trash2, Upload, Plus, Video, PlaySquare, Image as ImageIcon, Loader2, RefreshCcw, CheckCircle2, XCircle } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

const API_URL = process.env.NEXT_PUBLIC_VITE_API_URL || "http://localhost:8000";

function TabButton({ active, onClick, icon, label }: any) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-1 items-center justify-center rounded-lg py-3 text-sm font-medium transition-all ${
        active
          ? "bg-cinema-accent text-white shadow-[0_0_15px_rgba(236,72,153,0.3)]"
          : "text-cinema-muted hover:bg-white/5 hover:text-white"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

function StatusBanner({ status, message }: { status: "success" | "error" | null; message: string }) {
  if (!status) return null;
  return (
    <div
      className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-sm font-medium transition-all animate-in fade-in slide-in-from-top-2 duration-300 ${
        status === "success"
          ? "border-green-500/30 bg-green-500/10 text-green-400"
          : "border-red-500/30 bg-red-500/10 text-red-400"
      }`}
    >
      {status === "success" ? (
        <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
      ) : (
        <XCircle className="h-5 w-5 flex-shrink-0" />
      )}
      {message}
    </div>
  );
}

function VideoManager({ type, endpoint }: { type: string; endpoint: string }) {
  const queryClient = useQueryClient();
  const [title, setTitle] = useState("");
  const [youtubeId, setYoutubeId] = useState("");
  const [banner, setBanner] = useState<{ status: "success" | "error"; message: string } | null>(null);

  const { data: items = [], isLoading } = useQuery({
    queryKey: [endpoint],
    queryFn: async () => {
      const res = await fetch(`${API_URL}${endpoint}/`);
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      return res.json();
    },
  });

  const createMutation = useMutation({
    mutationFn: async (newItem: any) => {
      const res = await fetch(`${API_URL}${endpoint}/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newItem),
      });
      if (!res.ok) throw new Error("Failed to add");
      return res.json();
    },
    onMutate: async (newItem: any) => {
      await queryClient.cancelQueries({ queryKey: [endpoint] });
      const previous = queryClient.getQueryData([endpoint]);
      queryClient.setQueryData([endpoint], (old: any[]) => [
        ...(old || []),
        { ...newItem, id: `temp-${Date.now()}` },
      ]);
      return { previous };
    },
    onSuccess: (savedItem) => {
      queryClient.setQueryData([endpoint], (old: any[]) =>
        old.map((item) => (String(item.id).startsWith("temp-") ? savedItem : item))
      );
      setTitle("");
      setYoutubeId("");
      setBanner({ status: "success", message: `✓ ${type === "video" ? "Video" : "Short"} added successfully!` });
      toast.success(`${type === "video" ? "Video" : "Short"} added!`);
      setTimeout(() => setBanner(null), 4000);
    },
    onError: (err: any, _vars, context: any) => {
      queryClient.setQueryData([endpoint], context?.previous);
      setBanner({ status: "error", message: `✗ Failed to add: ${err.message}` });
      toast.error("Failed to add. Please try again.");
      setTimeout(() => setBanner(null), 5000);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`${API_URL}${endpoint}/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
    },
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: [endpoint] });
      const previous = queryClient.getQueryData([endpoint]);
      queryClient.setQueryData([endpoint], (old: any[]) => old.filter((i) => i.id !== id));
      return { previous };
    },
    onSuccess: () => toast.success("Deleted successfully"),
    onError: (err: any, _id, context: any) => {
      queryClient.setQueryData([endpoint], context?.previous);
      toast.error(`Delete failed: ${err.message}`);
    },
  });

  const reorderMutation = useMutation({
    mutationFn: async (updates: any) => {
      const res = await fetch(`${API_URL}${endpoint}/reorder`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      if (!res.ok) throw new Error("Failed to reorder");
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [endpoint] }),
  });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !youtubeId) {
      setBanner({ status: "error", message: "✗ Please fill in both Title and YouTube ID." });
      toast.error("Please fill all fields");
      setTimeout(() => setBanner(null), 4000);
      return;
    }
    createMutation.mutate({
      title,
      url: `https://youtube.com/watch?v=${youtubeId}`,
      youtube_id: youtubeId,
      type,
      order: items.length,
    });
  };

  const moveItem = (index: number, direction: "up" | "down") => {
    if (direction === "up" && index === 0) return;
    if (direction === "down" && index === items.length - 1) return;
    const newItems = [...items];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    const currentOrder = newItems[index].order;
    newItems[index].order = newItems[targetIndex].order;
    newItems[targetIndex].order = currentOrder;
    reorderMutation.mutate([
      { id: newItems[index].id, order: newItems[index].order },
      { id: newItems[targetIndex].id, order: newItems[targetIndex].order },
    ]);
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleAdd} className="flex flex-col gap-4 md:flex-row md:items-end">
        <div className="flex-1">
          <label className="mb-2 block text-xs text-cinema-muted uppercase tracking-wider">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="E.g., Cinematic B-Roll"
            className="w-full rounded-lg border border-white/10 bg-black/50 p-3 text-white placeholder-white/30 outline-none focus:border-cinema-accent"
          />
        </div>
        <div className="flex-1">
          <label className="mb-2 block text-xs text-cinema-muted uppercase tracking-wider">YouTube Video ID</label>
          <input
            type="text"
            value={youtubeId}
            onChange={(e) => setYoutubeId(e.target.value)}
            placeholder="E.g., dQw4w9WgXcQ"
            className="w-full rounded-lg border border-white/10 bg-black/50 p-3 text-white placeholder-white/30 outline-none focus:border-cinema-accent"
          />
        </div>
        <button
          type="submit"
          disabled={createMutation.isPending}
          className="flex h-12 items-center justify-center gap-2 rounded-lg bg-cinema-accent px-6 font-medium text-white transition hover:bg-pink-600 disabled:opacity-50"
        >
          {createMutation.isPending ? <Loader2 className="animate-spin h-5 w-5" /> : <Plus className="h-5 w-5" />}
          Add {type === "video" ? "Video" : "Short"}
        </button>
      </form>
      <StatusBanner status={banner?.status ?? null} message={banner?.message ?? ""} />
      <div className="space-y-3">
        {isLoading ? (
          <div className="animate-pulse h-16 w-full rounded-lg bg-white/5" />
        ) : items.length === 0 ? (
          <div className="p-8 text-center text-cinema-muted border border-dashed border-white/10 rounded-xl">
            No items found. Add some above!
          </div>
        ) : (
          items.map((item: any, idx: number) => (
            <div
              key={item.id}
              className={`flex items-center justify-between rounded-lg border bg-white/5 p-4 transition hover:bg-white/10 ${
                String(item.id).startsWith("temp-")
                  ? "border-cinema-accent/50 bg-cinema-accent/5 animate-pulse"
                  : "border-white/5"
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-cinema-accent/20 text-xs font-bold text-cinema-accent border border-cinema-accent/30">
                  {idx + 1}
                </div>
                <img
                  src={`https://img.youtube.com/vi/${item.youtube_id}/hqdefault.jpg`}
                  className="h-12 w-20 flex-shrink-0 rounded object-cover"
                  alt="thumb"
                />
                <div className="min-w-0">
                  <h3 className="truncate font-medium text-white">{item.title}</h3>
                  <p className="text-xs text-cinema-muted">ID: {item.youtube_id}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {!String(item.id).startsWith("temp-") && (
                  <>
                    <div className="flex items-center rounded-lg bg-black/30 p-1">
                      <button
                        onClick={() => moveItem(idx, "up")}
                        disabled={idx === 0}
                        className="p-1.5 text-cinema-muted hover:text-white disabled:opacity-20 transition"
                      >
                        <ArrowUp className="h-4 w-4" />
                      </button>
                      <div className="h-4 w-px bg-white/10 mx-1" />
                      <button
                        onClick={() => moveItem(idx, "down")}
                        disabled={idx === items.length - 1}
                        className="p-1.5 text-cinema-muted hover:text-white disabled:opacity-20 transition"
                      >
                        <ArrowDown className="h-4 w-4" />
                      </button>
                    </div>
                    <button
                      onClick={() => window.confirm("Delete this?") && deleteMutation.mutate(item.id)}
                      className="rounded-lg bg-red-500/10 p-2.5 text-red-500 transition hover:bg-red-500 hover:text-white"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </>
                )}
                {String(item.id).startsWith("temp-") && (
                  <Loader2 className="animate-spin h-5 w-5 text-cinema-accent" />
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function PosterManager() {
  const queryClient = useQueryClient();
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [banner, setBanner] = useState<{ status: "success" | "error"; message: string } | null>(null);

  const { data: posters = [], isLoading } = useQuery({
    queryKey: ["/posters"],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/posters/`);
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    },
  });

  const uploadMutation = useMutation({
    mutationFn: async (uploadFile: File) => {
      const formData = new FormData();
      formData.append("file", uploadFile);
      const res = await fetch(`${API_URL}/posters/upload/`, { method: "POST", body: formData });
      if (!res.ok) throw new Error("Upload failed");
      return res.json();
    },
    onMutate: async (uploadFile: File) => {
      await queryClient.cancelQueries({ queryKey: ["/posters"] });
      const previous = queryClient.getQueryData(["/posters"]);
      const tempUrl = URL.createObjectURL(uploadFile);
      queryClient.setQueryData(["/posters"], (old: any[]) => [
        ...(old || []),
        { id: `temp-${Date.now()}`, public_id: uploadFile.name, secure_url: tempUrl, order: 999 },
      ]);
      return { previous };
    },
    onSuccess: (savedPoster) => {
      queryClient.setQueryData(["/posters"], (old: any[]) =>
        old.map((p) => (String(p.id).startsWith("temp-") ? savedPoster : p))
      );
      setBanner({ status: "success", message: "✓ Poster uploaded and saved successfully!" });
      toast.success("Poster uploaded successfully!");
      setFile(null);
      setPreviewUrl(null);
      setTimeout(() => setBanner(null), 4000);
    },
    onError: (err: any, _vars, context: any) => {
      queryClient.setQueryData(["/posters"], context?.previous);
      setBanner({ status: "error", message: `✗ Upload failed: ${err.message}` });
      toast.error(`Upload failed: ${err.message}`);
      setTimeout(() => setBanner(null), 5000);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`${API_URL}/posters/${id}/`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
    },
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: ["/posters"] });
      const previous = queryClient.getQueryData(["/posters"]);
      queryClient.setQueryData(["/posters"], (old: any[]) => old.filter((p) => p.id !== id));
      return { previous };
    },
    onSuccess: () => toast.success("Poster deleted!"),
    onError: (err: any, _id, context: any) => {
      queryClient.setQueryData(["/posters"], context?.previous);
      toast.error(`Delete failed: ${err.message}`);
    },
  });

  const moveItem = (index: number, direction: "up" | "down") => {
    if (direction === "up" && index === 0) return;
    if (direction === "down" && index === posters.length - 1) return;
    const newItems = [...posters];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    const currentOrder = newItems[index].order;
    newItems[index].order = newItems[targetIndex].order;
    newItems[targetIndex].order = currentOrder;
    // Assuming a reorder endpoint exists for posters too, or just invalidate
    queryClient.invalidateQueries({ queryKey: ["/posters"] });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] || null;
    setFile(f);
    if (f) setPreviewUrl(URL.createObjectURL(f));
    else setPreviewUrl(null);
  };

  const handleUpload = () => {
    if (!file) {
      toast.error("Please select a file");
      return;
    }
    uploadMutation.mutate(file);
  };

  return (
    <div className="space-y-6">
      <div
        onClick={() => fileInputRef.current?.click()}
        className={`cursor-pointer rounded-2xl border-2 border-dashed p-8 transition-colors ${
          file ? "border-cinema-accent bg-cinema-accent/5" : "border-white/20 bg-white/5 hover:border-white/40"
        }`}
      >
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*"
          onChange={handleFileChange}
        />
        {previewUrl ? (
          <div className="flex flex-col items-center gap-3">
            <img src={previewUrl} alt="preview" className="h-32 rounded-lg object-cover shadow-lg border border-cinema-accent/30" />
            <p className="text-sm text-cinema-accent font-medium">{file?.name}</p>
            <p className="text-xs text-cinema-muted">Click to change</p>
          </div>
        ) : (
          <>
            <Upload className="mx-auto h-10 w-10 mb-3 text-cinema-muted" />
            <h3 className="text-base font-medium text-white mb-1 text-center">Select a poster image</h3>
            <p className="text-xs text-cinema-muted text-center">Click to browse</p>
          </>
        )}
      </div>
      <div className="flex gap-4">
        <button
          onClick={handleUpload}
          disabled={!file || uploadMutation.isPending}
          className="flex-1 flex h-12 items-center justify-center gap-2 rounded-xl bg-cinema-accent font-medium text-white transition hover:bg-pink-600 disabled:opacity-50"
        >
          {uploadMutation.isPending ? <Loader2 className="animate-spin h-5 w-5" /> : <Upload className="h-5 w-5" />}
          Upload Poster
        </button>
      </div>
      <StatusBanner status={banner?.status ?? null} message={banner?.message ?? ""} />
      <div className="space-y-3">
        {isLoading ? (
          <div className="animate-pulse h-20 w-full rounded-lg bg-white/5" />
        ) : posters.length === 0 ? (
          <div className="p-8 text-center text-cinema-muted border border-dashed border-white/10 rounded-xl">
            No posters yet. Upload one above!
          </div>
        ) : (
          posters.map((p: any, idx: number) => (
            <div
              key={p.id}
              className={`flex items-center justify-between rounded-lg border p-3 transition ${
                String(p.id).startsWith("temp-")
                  ? "border-cinema-accent/50 bg-cinema-accent/5 animate-pulse"
                  : "border-white/5 bg-white/5 hover:bg-white/10"
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-cinema-accent/20 text-[10px] font-bold text-cinema-accent">
                  {idx + 1}
                </div>
                <img
                  src={p.secure_url}
                  className="h-14 w-12 rounded object-cover border border-white/10"
                  alt="poster"
                />
                <p className="text-xs text-cinema-muted truncate max-w-[150px]">{p.public_id}</p>
              </div>
              <div className="flex items-center gap-2">
                {!String(p.id).startsWith("temp-") && (
                  <button
                    onClick={() => window.confirm("Delete this poster?") && deleteMutation.mutate(p.id)}
                    className="rounded bg-red-500/10 p-2 text-red-500 hover:bg-red-500 hover:text-white transition"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<"videos" | "shorts" | "posters">("videos");

  return (
    <div className="min-h-screen bg-cinema-bg text-cinema-text font-body p-6 md:p-12">
      <div className="mx-auto max-w-5xl space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-4xl text-cinema-accent md:text-5xl">
              Admin Panel
            </h1>
            <p className="text-cinema-muted mt-2 text-sm">
              Manage your portfolio content dynamically.
            </p>
          </div>
          <Link href="/" className="text-xs uppercase tracking-widest text-cinema-muted hover:text-cinema-accent transition">
            ← Back to Portfolio
          </Link>
        </div>

        <div className="flex space-x-2 rounded-xl bg-white/5 p-1 backdrop-blur-md">
          <TabButton
            active={activeTab === "videos"}
            onClick={() => setActiveTab("videos")}
            icon={<Video className="mr-2 h-4 w-4" />}
            label="Videos"
          />
          <TabButton
            active={activeTab === "shorts"}
            onClick={() => setActiveTab("shorts")}
            icon={<PlaySquare className="mr-2 h-4 w-4" />}
            label="Shorts"
          />
          <TabButton
            active={activeTab === "posters"}
            onClick={() => setActiveTab("posters")}
            icon={<ImageIcon className="mr-2 h-4 w-4" />}
            label="Posters"
          />
        </div>

        <div className="rounded-2xl border border-white/10 bg-black/40 p-6 md:p-8">
          {activeTab === "videos" && <VideoManager type="video" endpoint="/videos" />}
          {activeTab === "shorts" && <VideoManager type="short" endpoint="/shorts" />}
          {activeTab === "posters" && <PosterManager />}
        </div>
      </div>
    </div>
  );
}
