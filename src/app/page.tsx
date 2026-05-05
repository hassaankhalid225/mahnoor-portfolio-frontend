'use client'
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { 
  Play, 
  ArrowRight, 
  Mail, 
  Smartphone, 
  Video, 
  Layers, 
  CheckCircle2,
  X,
  Target,
  Zap,
  Star,
  Quote,
  ArrowUpRight,
  TrendingUp,
  Award,
  Users,
  MessageCircle
} from "lucide-react";

const RAW_API_URL = process.env.NEXT_PUBLIC_API_URL || "https://mahnoor-portfolio-backend-production.up.railway.app";
const API_URL = RAW_API_URL.startsWith("http://") && !RAW_API_URL.includes("localhost") ? RAW_API_URL.replace("http://", "https://") : RAW_API_URL;

/* ---------------- DATA ---------------- */

const profile = {
  name: "Mahnoor Fatima",
  role: "Lead Creative Editor",
  company: "Visual Edge Media",
  bio: "Transforming raw footage into high-conversion digital assets. With a focus on the 'Psychology of the Cut', I help global creators and brands dominate the attention economy through strategic storytelling and cinematic precision.",
  stats: [
    { label: "Views Generated", value: "15M+" },
    { label: "Projects Completed", value: "120+" },
    { label: "Retention Rate", value: "85%+" },
    { label: "Client Satisfaction", value: "4.9/5" }
  ],
  services: [
    {
      title: "Viral Short-Form",
      desc: "Retention-optimized Reels & Shorts with custom motion graphics.",
      icon: <Zap className="w-8 h-8" />
    },
    {
      title: "Cinematic Long-Form",
      desc: "Story-driven YouTube editing that keeps viewers watching until the end.",
      icon: <Video className="w-8 h-8" />
    },
    {
      title: "Post-Production",
      desc: "Color grading, sound design, and professional B-roll integration.",
      icon: <Layers className="w-8 h-8" />
    }
  ],
  workflow: [
    { step: "01", title: "Strategy Call", desc: "We define your hook, audience, and goals." },
    { step: "02", title: "First Cut", desc: "Focusing on narrative flow and core story." },
    { step: "03", title: "The Polish", desc: "Sound design, color, and motion graphics." },
    { step: "04", title: "Final Delivery", desc: "Ready-to-post assets for all platforms." }
  ],
  faq: [
    { q: "What is your typical turnaround time?", a: "Short-form edits usually take 24-48 hours, while long-form projects range from 3-5 days depending on complexity." },
    { q: "Do you offer sound design and color grading?", a: "Yes, every edit includes professional sound design and cinematic color grading as standard." },
    { q: "Which software do you use?", a: "I primarily work in Adobe Premiere Pro and After Effects, with DaVinci Resolve for high-end color grading." }
  ]
};

/* ---------------- HELPERS ---------------- */

function extractYouTubeId(raw: string): string {
  if (!raw) return "";
  const s = raw.trim();
  if (s.includes("/shorts/")) return s.split("/shorts/")[1].split("?")[0];
  if (s.includes("youtu.be/")) return s.split("youtu.be/")[1].split("?")[0];
  if (s.includes("watch?v=")) return s.split("watch?v=")[1].split("&")[0];
  return s;
}

function thumbUrl(id: string) {
  const cleanId = extractYouTubeId(id);
  return `https://img.youtube.com/vi/${cleanId}/maxresdefault.jpg`;
}

/* ---------------- COMPONENTS ---------------- */

function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'py-4 bg-background/90 backdrop-blur-xl border-b border-white/5' : 'py-8'}`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center font-black">M</div>
          <span className="text-xl font-bold tracking-tighter uppercase">Mahnoor Fatima</span>
        </div>
        <div className="hidden lg:flex items-center gap-10">
          {['Portfolio', 'Services', 'Workflow', 'FAQ'].map((item) => (
            <a key={item} href={`#${item.toLowerCase()}`} className="text-xs font-bold uppercase tracking-[0.2em] text-foreground/50 hover:text-primary transition-colors">
              {item}
            </a>
          ))}
        </div>
        <a href="#contact" className="btn-primary py-3 px-8 text-xs font-bold">Start A Project</a>
      </div>
    </nav>
  );
}

function VideoModal({ video, onClose }: { video: any; onClose: () => void }) {
  if (!video) return null;
  const cleanId = extractYouTubeId(video.id);
  const src = `https://www.youtube.com/embed/${cleanId}?autoplay=1&rel=0`;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4 backdrop-blur-2xl"
      onClick={onClose}
    >
      <button onClick={onClose} className="absolute top-8 right-8 text-white/20 hover:text-white transition-colors">
        <X className="w-12 h-12" />
      </button>
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className={`relative w-full overflow-hidden rounded-[2rem] bg-black shadow-2xl ${video.vertical ? 'max-w-[450px]' : 'max-w-6xl'}`}
        style={{ aspectRatio: video.vertical ? "9/16" : "16/9" }}
        onClick={(e) => e.stopPropagation()}
      >
        <iframe src={src} className="absolute inset-0 w-full h-full" allowFullScreen />
      </motion.div>
    </motion.div>
  );
}

export default function Home() {
  const [selectedVideo, setSelectedVideo] = useState<any>(null);
  
  const { data: videos = [] } = useQuery({ queryKey: ["/videos"], queryFn: async () => {
    const res = await fetch(`${API_URL}/videos/`);
    return res.ok ? res.json() : [];
  }});

  const { data: shorts = [] } = useQuery({ queryKey: ["/shorts"], queryFn: async () => {
    const res = await fetch(`${API_URL}/shorts/`);
    return res.ok ? res.json() : [];
  }});

  const { data: posters = [] } = useQuery({ queryKey: ["/posters"], queryFn: async () => {
    const res = await fetch(`${API_URL}/posters/`);
    return res.ok ? res.json() : [];
  }});

  return (
    <main className="relative bg-background">
      <div className="noise" />
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 px-6 text-center">
        <div className="glow top-0 left-1/2 -translate-x-1/2 bg-primary/20 opacity-30" />
        
        <div className="max-w-5xl mx-auto z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/5 bg-white/5 text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-8 animate-pulse">
              <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
              Available for Q3 Projects
            </div>
            <h1 className="text-6xl md:text-[10vw] font-black leading-[0.85] tracking-tighter mb-10">
              CRAFTING <br />
              <span className="text-gradient italic">CINEMATIC</span> <br />
              NARRATIVES.
            </h1>
            <p className="text-lg md:text-2xl text-foreground/50 max-w-2xl mx-auto mb-12 leading-relaxed font-medium">
              High-impact video post-production for digital-first brands and creators. I turn raw footage into attention-grabbing stories.
            </p>
            <div className="flex flex-col md:flex-row items-center justify-center gap-6">
              <a href="#portfolio" className="btn-primary w-full md:w-auto">Explore Portfolio</a>
              <a href="#contact" className="flex items-center gap-3 text-sm font-bold tracking-widest uppercase hover:text-primary transition-colors">
                Book a Strategy Call <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </motion.div>
        </div>

        <motion.div 
          animate={{ y: [0, 15, 0] }} 
          transition={{ duration: 3, repeat: Infinity }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-foreground/20"
        >
          <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Scroll</span>
          <div className="w-px h-10 bg-gradient-to-b from-primary/50 to-transparent" />
        </motion.div>
      </section>

      {/* Trust & Stats */}
      <section className="py-24 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 text-center md:text-left">
          {profile.stats.map((stat, i) => (
            <div key={i} className="space-y-2 border-l border-white/10 pl-8">
              <div className="text-4xl font-black text-primary">{stat.value}</div>
              <div className="text-xs font-bold tracking-widest uppercase text-foreground/30">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Portfolio Section */}
      <section id="portfolio" className="section-padding overflow-hidden">
        <div className="max-w-7xl mx-auto mb-20 flex flex-col md:flex-row md:items-end justify-between gap-10 px-6">
          <div className="max-w-2xl">
            <div className="text-xs font-bold tracking-[0.3em] uppercase text-primary mb-6">Recent Work</div>
            <h2 className="text-5xl md:text-8xl font-black mb-8 leading-tight">THE <br />SHOWREEL.</h2>
            <p className="text-lg text-foreground/40 leading-relaxed">A selection of premium edits focused on high retention and cinematic storytelling across all formats.</p>
          </div>
          <div className="flex gap-4">
             <div className="w-20 h-20 rounded-full border border-white/10 flex items-center justify-center text-foreground/20 hover:text-primary hover:border-primary transition-all cursor-pointer">
                <Play className="w-6 h-6 fill-current" />
             </div>
          </div>
        </div>

        {/* Bento Grid */}
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-8 auto-rows-[350px] md:auto-rows-[450px]">
          {videos.slice(0, 5).map((v: any, i: number) => {
            const span = i === 0 ? "md:col-span-8 md:row-span-1" : i === 1 ? "md:col-span-4 md:row-span-2" : "md:col-span-4";
            return (
              <motion.div 
                key={v.id} 
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
                className={`${span} relative rounded-[3rem] overflow-hidden border border-white/5 cursor-pointer group glass`}
                onClick={() => setSelectedVideo({ id: v.youtube_id, vertical: false })}
              >
                <Image src={thumbUrl(v.youtube_id)} alt={v.title} fill className="object-cover transition-transform duration-1000 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90 group-hover:opacity-100 transition-opacity" />
                <div className="absolute inset-0 flex flex-col justify-end p-12">
                   <div className="text-[10px] font-bold tracking-widest uppercase text-primary mb-3">Long-Form Feature</div>
                   <h3 className="text-3xl font-black mb-4 leading-tight">{v.title}</h3>
                   <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all translate-y-4 group-hover:translate-y-0">
                     Play Case Study <ArrowUpRight className="w-4 h-4" />
                   </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Vertical Shorts */}
      <section className="section-padding bg-[#050508]">
        <div className="max-w-7xl mx-auto px-6 mb-16 text-center">
          <div className="text-xs font-bold tracking-[0.3em] uppercase text-primary mb-6">Social Growth</div>
          <h2 className="text-5xl md:text-7xl font-black">VERTICAL MASTERY</h2>
        </div>
        
        <div className="flex gap-8 overflow-x-auto no-scrollbar pb-16 px-12 -mx-12">
          {shorts.map((s: any, i: number) => (
            <motion.div 
              key={s.id}
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="min-w-[320px] h-[580px] relative rounded-[3rem] overflow-hidden border border-white/10 group cursor-pointer glass"
              onClick={() => setSelectedVideo({ id: s.youtube_id, vertical: true })}
            >
              <Image src={thumbUrl(s.youtube_id)} alt={s.title} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-95" />
              <div className="absolute bottom-10 left-10 right-10">
                <h4 className="text-xl font-bold mb-3">{s.title}</h4>
                <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest">
                  <Play className="w-4 h-4 fill-current" /> Watch Short
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Services & Workflow */}
      <section id="services" className="section-padding">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-24 items-start">
            <div>
              <div className="text-xs font-bold tracking-[0.3em] uppercase text-primary mb-6">Expertise</div>
              <h2 className="text-5xl md:text-7xl font-black mb-12 leading-tight">HOW I <br />HELP YOU <br /><span className="text-gradient">GROW.</span></h2>
              <div className="space-y-8">
                {profile.services.map((s, i) => (
                  <div key={i} className="flex gap-8 p-10 rounded-[2.5rem] glass glass-hover">
                    <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                      {s.icon}
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold mb-3">{s.title}</h3>
                      <p className="text-foreground/40 leading-relaxed">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="text-xs font-bold tracking-[0.3em] uppercase text-primary mb-6">Workflow</div>
              <h2 className="text-5xl font-black mb-12">THE PROCESS.</h2>
              <div className="space-y-12">
                {profile.workflow.map((w, i) => (
                  <div key={i} className="relative pl-16">
                    <div className="absolute left-0 top-0 text-4xl font-black text-white/5">{w.step}</div>
                    <h3 className="text-xl font-bold mb-3 flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-primary" />
                      {w.title}
                    </h3>
                    <p className="text-foreground/40 leading-relaxed">{w.desc}</p>
                  </div>
                ))}
              </div>
              
              <div className="mt-20 p-12 rounded-[3rem] bg-gradient-to-br from-primary/10 to-indigo-500/10 border border-primary/5">
                <div className="flex items-center gap-4 mb-6 text-primary">
                   <Award className="w-8 h-8" />
                   <div className="text-xl font-bold">Premium Quality Guaranteed</div>
                </div>
                <p className="text-sm text-foreground/50 leading-relaxed mb-8">Every edit undergoes a rigorous multi-pass review focusing on pacing, clarity, and emotional resonance.</p>
                <a href="#contact" className="btn-primary w-full inline-block text-center">Start Your Journey</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="section-padding bg-[#050508]">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-black mb-6">F.A.Q</h2>
            <p className="text-foreground/40 uppercase text-xs font-bold tracking-widest">Common questions about working together</p>
          </div>
          <div className="space-y-6">
            {profile.faq.map((item, i) => (
              <div key={i} className="p-10 rounded-[2.5rem] glass border-white/5">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-4">
                  <MessageCircle className="w-5 h-5 text-primary" />
                  {item.q}
                </h3>
                <p className="text-foreground/40 leading-relaxed pl-9">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="section-padding">
        <div className="max-w-7xl mx-auto px-6">
          <div className="relative rounded-[4rem] overflow-hidden bg-white/[0.02] border border-white/10 p-12 md:p-24">
            <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/10 blur-[150px] -z-10" />
            <div className="grid lg:grid-cols-2 gap-24 items-center">
              <div>
                <h2 className="text-5xl md:text-8xl font-black mb-10 leading-tight">READY TO <br /><span className="text-gradient">SCALE?</span></h2>
                <p className="text-xl text-foreground/40 mb-12 max-w-md">Let's create something that stands the test of time. Reach out today for a custom quote.</p>
                
                <div className="space-y-8">
                  <div className="flex items-center gap-6 group cursor-pointer">
                    <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                      <Mail className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-widest text-foreground/30">Email Us</div>
                      <div className="text-xl font-bold">mahnoorfatim09@gmail.com</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 group cursor-pointer">
                    <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                      <Smartphone className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-widest text-foreground/30">WhatsApp Direct</div>
                      <div className="text-xl font-bold">+92 329 7765694</div>
                    </div>
                  </div>
                </div>
              </div>

              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <input type="text" placeholder="Name" className="w-full p-6 rounded-3xl bg-white/5 border border-white/10 outline-none focus:border-primary transition-all" />
                  <input type="email" placeholder="Email" className="w-full p-6 rounded-3xl bg-white/5 border border-white/10 outline-none focus:border-primary transition-all" />
                </div>
                <select className="w-full p-6 rounded-3xl bg-white/5 border border-white/10 outline-none focus:border-primary transition-all text-foreground/40">
                  <option>Select Service</option>
                  <option>Short-Form Package</option>
                  <option>Long-Form Production</option>
                  <option>Full Channel Management</option>
                </select>
                <textarea rows={5} placeholder="Project Details" className="w-full p-6 rounded-3xl bg-white/5 border border-white/10 outline-none focus:border-primary transition-all resize-none" />
                <button className="w-full btn-primary py-6">Send Message</button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <footer className="py-20 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center font-black">M</div>
            <span className="text-xl font-bold tracking-tighter uppercase">Mahnoor Fatima</span>
          </div>
          <div className="flex gap-10">
            {['Instagram', 'LinkedIn', 'Behance'].map(s => (
              <a key={s} href="#" className="text-[10px] font-bold uppercase tracking-[0.3em] text-foreground/30 hover:text-primary transition-colors">{s}</a>
            ))}
          </div>
          <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-foreground/20">&copy; 2026 Visual Edge Media.</div>
        </div>
      </footer>

      <AnimatePresence>
        {selectedVideo && <VideoModal video={selectedVideo} onClose={() => setSelectedVideo(null)} />}
      </AnimatePresence>
    </main>
  );
}
