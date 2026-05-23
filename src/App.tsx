/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Palette, 
  Layers, 
  TrendingUp, 
  Globe, 
  Film, 
  Flame, 
  Shield, 
  Database, 
  Menu, 
  X, 
  ChevronDown, 
  ChevronUp, 
  Mail, 
  Phone, 
  MapPin, 
  ExternalLink, 
  Plus, 
  Trash, 
  Edit, 
  Check, 
  Lock, 
  Unlock, 
  ArrowRight, 
  Star, 
  MessageSquare, 
  Settings, 
  Instagram, 
  Youtube, 
  Cpu, 
  Copy, 
  Sparkles, 
  Send, 
  Search, 
  AlertCircle, 
  Calendar,
  CheckCircle2,
  Eye,
  EyeOff
} from 'lucide-react';
import { 
  db, 
  StudioInfo, 
  ServiceItem, 
  PortfolioItem, 
  TeamMember, 
  TestimonialItem, 
  FAQItem, 
  ContactMessage 
} from './db';

// Render Lucide custom icon mapping dynamically
function renderLucideIcon(iconName: string, className = "w-6 h-6") {
  switch (iconName) {
    case 'Palette': return <Palette className={className} />;
    case 'Layers': return <Layers className={className} />;
    case 'TrendingUp': return <TrendingUp className={className} />;
    case 'Globe': return <Globe className={className} />;
    case 'Film': return <Film className={className} />;
    case 'Flame': return <Flame className={className} />;
    default: return <Sparkles className={className} />;
  }
}

export default function App() {
  // Database States
  const [studioInfo, setStudioInfo] = useState<StudioInfo>({
    name: "PixelFrame Studio Indonesia",
    tagline: "BRAND. CONTENT. IMPACT.",
    description: "Crafting Visual Stories That Inspire & Accelerate Growth",
    about_rich: "Kami adalah rumah produksi kreatif dan studio desain terintegrasi...",
    location: "Jakarta, Indonesia",
    email: "pixelframe.indonesia@gmail.com",
    phone: "+62 821-4455-8899",
    instagram: "",
    youtube: "",
    behance: "",
    dribbble: ""
  });
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [portfolios, setPortfolios] = useState<PortfolioItem[]>([]);
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>([]);
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);

  // System States
  const [loading, setLoading] = useState(true);
  const [isUsingSupabase, setIsUsingSupabase] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() => {
    return sessionStorage.getItem('isAdminLoggedIn') === 'true';
  });
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [activeAdminTab, setActiveAdminTab] = useState<'supabase' | 'studio' | 'portfolios' | 'messages' | 'testimonials'>('supabase');
  
  // Custom Portfolio Grid Filtering
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [portfolioSearch, setPortfolioSearch] = useState<string>('');
  const [selectedPortfolioItem, setSelectedPortfolioItem] = useState<PortfolioItem | null>(null);

  // FAQ Expand/Collapse Map
  const [expandedFAQId, setExpandedFAQId] = useState<string | null>(null);

  // Client Submitting Form States
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    company: '',
    subject: '',
    message: ''
  });
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);

  // Admin CRUD Editor States
  const [editPortfolioForm, setEditPortfolioForm] = useState<Omit<PortfolioItem, 'id'> & { id?: string }>({
    title: '',
    category: 'Branding',
    image_url: '',
    client: '',
    year: '2026',
    description: '',
    link: '',
    featured: false
  });
  const [editStudioForm, setEditStudioForm] = useState<StudioInfo | null>(null);
  
  // Supabase Setup State Editor
  const [supabaseConfigInput, setSupabaseConfigInput] = useState({
    url: '',
    key: ''
  });
  const [sqlCopied, setSqlCopied] = useState(false);
  const [dbSyncing, setDbSyncing] = useState(false);
  const [dbSyncSuccess, setDbSyncSuccess] = useState<string | null>(null);

  // Load All DB data
  const loadDatabaseData = async () => {
    setLoading(true);
    try {
      setIsUsingSupabase(db.isUsingSupabase());
      
      const [info, svcs, port, tm, test, fq, msgs] = await Promise.all([
        db.getStudioInfo(),
        db.getServices(),
        db.getPortfolio(),
        db.getTeam(),
        db.getTestimonials(),
        db.getFAQs(),
        db.getContactMessages()
      ]);

      setStudioInfo(info);
      setServices(svcs);
      setPortfolios(port);
      setTeam(tm);
      setTestimonials(test);
      setFaqs(fq);
      setMessages(msgs);
      
      setEditStudioForm(info);
    } catch (e) {
      console.error("Error loading fullstack db data:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDatabaseData();
    // Load existing Supabase configuration inside inputs
    const config = db.getSupabaseConfig();
    setSupabaseConfigInput({
      url: config.url,
      key: config.key
    });
  }, []);

  // Sync / Re-initialize DB
  const handleSaveSupabaseConfig = (e: React.FormEvent) => {
    e.preventDefault();
    setDbSyncing(true);
    db.saveSupabaseConfig(supabaseConfigInput.url, supabaseConfigInput.key);
    
    setTimeout(() => {
      setIsUsingSupabase(db.isUsingSupabase());
      loadDatabaseData();
      setDbSyncing(false);
      setDbSyncSuccess("Konfigurasi database berhasil disimpan dan disinkronisasikan!");
      setTimeout(() => setDbSyncSuccess(null), 4000);
    }, 1200);
  };

  // Submit Contact Form
  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.email || !contactForm.subject || !contactForm.message) {
      alert("Harap isi semua kolom formulir wajib.");
      return;
    }

    setFormSubmitting(true);
    try {
      await db.createContactMessage(contactForm);
      setFormSuccess(true);
      setContactForm({
        name: '',
        email: '',
        company: '',
        subject: '',
        message: ''
      });
      // Refresh messages list in background
      const updatedMessages = await db.getContactMessages();
      setMessages(updatedMessages);
    } catch (err) {
      console.error(err);
    } finally {
      setFormSubmitting(false);
    }
  };

  // Secure admin login submission
  const handleAdminLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedEmail = loginEmail.trim();
    const trimmedPassword = loginPassword.trim();
    
    if (trimmedEmail === 'pixelframe.indonesia@gmail.com' && trimmedPassword === 'Masitohddx1') {
      setIsAdminLoggedIn(true);
      sessionStorage.setItem('isAdminLoggedIn', 'true');
      setLoginError('');
    } else if (!trimmedEmail || !trimmedPassword) {
      setLoginError('Harap masukkan email dan secure access key.');
    } else {
      setLoginError('Akses Ditolak: Kredensial tidak valid!');
    }
  };

  // Save Portfolio CRUD Action
  const handleSavePortfolioItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editPortfolioForm.title || !editPortfolioForm.image_url || !editPortfolioForm.client) {
      alert("Mohon isi minimal judul, client, dan URL gambar portfolio.");
      return;
    }

    const itemId = editPortfolioForm.id || "port_" + Math.random().toString(36).substr(2, 9);
    const itemToSave: PortfolioItem = {
      id: itemId,
      title: editPortfolioForm.title,
      category: editPortfolioForm.category,
      image_url: editPortfolioForm.image_url,
      client: editPortfolioForm.client,
      year: editPortfolioForm.year || '2026',
      description: editPortfolioForm.description || '',
      link: editPortfolioForm.link || '',
      featured: editPortfolioForm.featured
    };

    try {
      await db.savePortfolioItem(itemToSave);
      // Reload lists
      const pList = await db.getPortfolio();
      setPortfolios(pList);
      // Clear Editor
      setEditPortfolioForm({
        title: '',
        category: 'Branding',
        image_url: '',
        client: '',
        year: '2026',
        description: '',
        link: '',
        featured: false
      });
      alert("Item portofolio berhasil disimpan!");
    } catch (err) {
      console.error(err);
    }
  };

  // Delete Portfolio Item
  const handleDeletePortfolioItem = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus item portofolio ini?")) return;
    try {
      await db.deletePortfolioItem(id);
      const pList = await db.getPortfolio();
      setPortfolios(pList);
    } catch (err) {
      console.error(err);
    }
  };

  // Save Studio Info Action
  const handleSaveStudioInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editStudioForm) return;

    try {
      await db.updateStudioInfo(editStudioForm);
      setStudioInfo(editStudioForm);
      alert("Biodata studio berhasil diperbarui secara dynamic!");
    } catch (err) {
      console.error(err);
    }
  };

  // Delete message submission
  const handleDeleteMessage = async (id: string) => {
    if (!confirm("Hapus pesan masuk ini?")) return;
    try {
      await db.deleteContactMessage(id);
      const updatedMessages = await db.getContactMessages();
      setMessages(updatedMessages);
    } catch (err) {
      console.error(err);
    }
  };

  // Filter Portfolios
  const filteredPortfolio = portfolios.filter(p => {
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesSearch = p.title.toLowerCase().includes(portfolioSearch.toLowerCase()) || 
                          p.client.toLowerCase().includes(portfolioSearch.toLowerCase()) ||
                          p.description.toLowerCase().includes(portfolioSearch.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Copy SQL script tool helper
  const handleCopySql = () => {
    navigator.clipboard.writeText(db.getSQLSchemaScript());
    setSqlCopied(true);
    setTimeout(() => setSqlCopied(false), 2000);
  };

  // Auto-fill beautiful high-def background image URL preset templates
  const UNSPLASH_PRESETS = [
    { name: "Camera Tech", url: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=1200" },
    { name: "Neon Studio", url: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=1200" },
    { name: "Premium Packaging", url: "https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?q=80&w=1200" },
    { name: "Design Setup", url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200" }
  ];

  return (
    <div id="app-root" className="min-h-screen bg-[#050505] text-[#F0F0F0] font-sans selection:bg-[#00F0FF] selection:text-[#050505] scroll-smooth">
      
      {/* HEADER NAVBAR */}
      <header id="main-header" className="sticky top-0 z-40 bg-[#050505]/95 backdrop-blur-md border-b border-[#222] transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Logo with interactive custom shape */}
          <a href="#hero" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-sm bg-[#050505] border border-[#222] group-hover:border-[#00F0FF] p-[2px] shadow-[0_0_15px_rgba(0,240,255,0.15)] group-hover:shadow-[0_0_25px_rgba(0,240,255,0.4)] transition-all duration-300 overflow-hidden">
              <div className="w-full h-full bg-[#050505] flex items-center justify-center">
                <img 
                  src="/logo_pixelframe.webp" 
                  alt="PixelFrame Logo" 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-black italic uppercase tracking-tighter text-lg text-[#F0F0F0]">
                PIXEL<span className="text-[#00F0FF]">FRAME</span>
              </span>
              <span className="text-[9px] text-[#888] tracking-[0.3em] font-bold">
                STUDIO INDONESIA
              </span>
            </div>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8 text-[11px] tracking-widest uppercase font-bold text-[#888]">
            <a href="#about" className="hover:text-white transition-colors">Biodata</a>
            <a href="#services" className="hover:text-white transition-colors">Layanan</a>
            <a href="#portfolio" className="hover:text-white transition-colors">Portofolio</a>
            <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
            <a href="#contact" className="hover:text-[#00F0FF] transition-colors">Hubungi</a>
          </nav>

          {/* Right Action buttons */}
          <div className="flex items-center gap-3">
            {/* Database indicator */}
            <div className={`hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-sm text-[10px] tracking-wider uppercase font-bold ${
              isUsingSupabase 
                ? 'bg-[#00F0FF]/10 text-[#00F0FF] border border-[#00F0FF]/30' 
                : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
            }`}>
              <Database className="w-3 h-3 text-[#00F0FF]" />
              <span>{isUsingSupabase ? 'Supabase Connected' : 'Local Dynamic DB'}</span>
            </div>

            {/* Admin toggle button */}
            <button 
              onClick={() => setShowAdmin(true)}
              className="flex items-center gap-2 px-4 py-2 text-[10px] tracking-widest uppercase font-black rounded-sm bg-[#050505] hover:bg-neutral-900 text-[#888] hover:text-white border border-[#222] hover:border-[#00F0FF] transition-all"
              id="admin-panel-btn"
            >
              <Settings className="w-3.5 h-3.5 text-[#00F0FF] animate-spin-slow" />
              <span>Admin Panel</span>
            </button>
          </div>
        </div>
      </header>

      {/* REVOLUTIONARY HERO SECTION */}
      <section id="hero" className="relative pt-28 pb-24 md:pt-40 md:pb-36 overflow-hidden flex flex-col items-center justify-center">
        {/* Tech Cyber Matrix background grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 w-full">
          {/* Slogan badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-sm bg-[#050505] border border-[#222] hover:border-[#00F0FF] text-[#888] hover:text-[#00F0FF] text-[10px] font-bold uppercase tracking-[0.25em] mb-8 transition-colors">
            <Sparkles className="w-3.5 h-3.5 text-[#00F0FF]" />
            <span>Creative Production House & Studio</span>
          </div>

          {/* Heading BRAND. CONTENT. IMPACT. in design aesthetic */}
          <div className="mb-8 max-w-5xl mx-auto">
            <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-[120px] font-black uppercase tracking-tighter italic leading-[0.85] select-none text-left md:text-center">
              <span>{studioInfo.tagline.split('.')[0] || "BRAND"}</span><br />
              <span className="text-[#00F0FF]">{studioInfo.tagline.split('.')[1] || "CONTENT"}</span><br />
              <span className="text-transparent text-stroke-40" style={{ WebkitTextStroke: "1px rgba(255,255,255,0.4)" }}>
                {studioInfo.tagline.split('.')[2] || "IMPACT"}
              </span>
            </h1>
          </div>

          {/* Subtitle with vertical divider */}
          <div className="flex flex-col md:flex-row gap-8 items-start justify-between max-w-5xl mx-auto border-l-2 border-[#00F0FF] pl-6 md:pl-8 text-left py-2 mb-12">
            <p className="max-w-xl text-sm sm:text-base text-[#AAA] leading-relaxed">
              {studioInfo.description}
            </p>
            <div className="flex flex-col justify-end text-left">
              <span className="text-[10px] uppercase tracking-widest text-[#666] mb-1 font-bold">LOKASI UTAMA // HUB</span>
              <span className="text-xs font-black text-[#F0F0F0] uppercase tracking-wider font-mono">
                {studioInfo.location || "Jakarta // Indonesia"}
              </span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-start max-w-5xl mx-auto gap-4 mb-20">
            <a 
              href="#portfolio" 
              className="w-full sm:w-auto px-8 py-4 rounded-sm font-black uppercase tracking-wider bg-[#00F0FF] text-neutral-950 hover:bg-white hover:text-neutral-950 hover:shadow-[0_0_30px_rgba(0,240,255,0.4)] transition-all duration-300 flex items-center justify-center gap-2.5 text-xs"
            >
              <span>Lihat Portofolio Karya</span>
              <ArrowRight className="w-4 h-4" />
            </a>
            <a 
              href="#contact" 
              className="w-full sm:w-auto px-8 py-4 rounded-sm font-black uppercase tracking-wider bg-[#050505] border border-[#222] hover:border-[#00F0FF] text-[#F0F0F0] hover:text-[#00F0FF] transition-all duration-300 flex items-center justify-center gap-2 text-xs"
            >
              <span>Mulai Kolaborasi</span>
            </a>
          </div>

          {/* Big Statistics Info Box */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto p-10 border border-[#222] hover:border-[#00F0FF] bg-[#050505] transition-colors text-left">
            <div className="space-y-1">
              <div className="text-[10px] uppercase tracking-widest text-[#444] font-bold">01. CREATIVE VALUE</div>
              <div className="text-[40px] font-black text-[#00F0FF] leading-none mb-1">5K+</div>
              <div className="text-[10px] uppercase tracking-widest text-[#666] font-mono">Creative Hours</div>
            </div>
            <div className="space-y-1 border-t sm:border-t-0 sm:border-l border-[#222] pt-6 sm:pt-0 sm:pl-6">
              <div className="text-[10px] uppercase tracking-widest text-[#444] font-bold">02. SELECTION</div>
              <div className="text-[40px] font-black text-[#F0F0F0] leading-none mb-1">{portfolios.length}+</div>
              <div className="text-[10px] uppercase tracking-widest text-[#666] font-mono">Portofolio Live</div>
            </div>
            <div className="space-y-1 border-t sm:border-t-0 sm:border-l border-[#222] pt-6 sm:pt-0 sm:pl-6">
              <div className="text-[10px] uppercase tracking-widest text-[#444] font-bold">03. EXCELLENCE</div>
              <div className="text-[40px] font-black text-[#F0F0F0] leading-none mb-1">100%</div>
              <div className="text-[10px] uppercase tracking-widest text-[#666] font-mono">Dukungan Klien</div>
            </div>
            <div className="space-y-1 border-t sm:border-t-0 sm:border-l border-[#222] pt-6 sm:pt-0 sm:pl-6">
              <div className="text-[10px] uppercase tracking-widest text-[#444] font-bold">04. CREATIVE TEAM</div>
              <div className="text-[40px] font-black text-[#00F0FF] leading-none mb-1">3+</div>
              <div className="text-[10px] uppercase tracking-widest text-[#666] font-mono font-mono">Head Creatives</div>
            </div>
          </div>
        </div>
      </section>

      {/* BIODATA & PHILOSOPHY SECTION */}
      <section id="about" className="py-24 bg-[#050505] border-t border-b border-[#222] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            {/* Left Column: Stunning Visual Card representing Indonesian heritage + studio tools */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-none overflow-hidden group border border-[#222] hover:border-[#00F0FF] transition-colors duration-500">
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/30 to-transparent z-10" />
                <img 
                  src="https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=800&auto=format&fit=crop" 
                  alt="PixelFrame Studio Workshop Setup" 
                  className="w-full aspect-[4/5] object-cover filter brightness-50 group-hover:brightness-75 group-hover:scale-102 transition-all duration-700" 
                />
                <div className="absolute bottom-0 left-0 right-0 p-8 z-25 text-left bg-[#050505]/30 backdrop-blur-xs">
                  <p className="text-[10px] text-[#00F0FF] uppercase font-mono tracking-widest mb-1.5 font-bold">Motto Kami</p>
                  <h4 className="text-xl font-black uppercase tracking-tight text-white mb-3">
                    "Crafting Visual Stories That Inspire & Impact."
                  </h4>
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#888]">
                    <MapPin className="w-3.5 h-3.5 text-[#00F0FF]" />
                    <span>Jakarta, Indonesia</span>
                  </div>
                </div>
              </div>
              
              {/* Overlay small interactive chip */}
              <div className="absolute -bottom-6 -right-6 bg-[#050505] border border-[#222] hover:border-[#00F0FF] p-4 max-w-[200px] z-30 hidden sm:block transition-all">
                <div className="flex items-center gap-3 text-left">
                  <div className="w-2.5 h-2.5 bg-[#00F0FF] animate-ping" />
                  <div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-[#F0F0F0]">Fullstack Active</div>
                    <div className="text-[9px] text-[#666] uppercase font-mono tracking-wider">Dikuasai Supabase API</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Dynamic Profile & Bio Details */}
            <div className="lg:col-span-7 text-left">
              <span className="text-[10px] text-[#00F0FF] font-extrabold uppercase tracking-[0.3em] block mb-3 font-mono">
                BIODATA & PROFIL RESMI
              </span>
              <h2 className="text-3xl sm:text-5xl font-black text-white mb-6 uppercase tracking-tighter italic">
                {studioInfo.name}
              </h2>
              
              <div className="text-sm sm:text-base text-[#AAA] mb-8 leading-relaxed space-y-4 font-medium">
                <p>{studioInfo.about_rich}</p>
                <p className="text-xs text-[#666] leading-relaxed uppercase tracking-wider">
                  Melalui kolaborasi erat lintas keahlian (desain visual, branding strategi, dan teknologi digital), kami mendampingi pemilik unit usaha dalam memenangkan persaingan digital secara terukur dan penuh impak estetika.
                </p>
              </div>

              {/* Contact point listings */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-[#222] py-6 mb-8 text-xs font-bold tracking-wider">
                <div className="flex items-center gap-3 text-[#F0F0F0]">
                  <div className="w-8 h-8 rounded-none bg-[#050505] flex items-center justify-center text-[#00F0FF] border border-[#222]">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[9px] text-[#666] uppercase font-mono tracking-widest">EMAIL KAMI</p>
                    <a href={`mailto:${studioInfo.email}`} className="hover:text-[#00F0FF] transition-colors">
                      {studioInfo.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-[#F0F0F0]">
                  <div className="w-8 h-8 rounded-none bg-[#050505] flex items-center justify-center text-[#00F0FF] border border-[#222]">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[9px] text-[#666] uppercase font-mono tracking-widest">WHATSAPP / MOBILE</p>
                    <a href={`tel:${studioInfo.phone}`} className="hover:text-[#00F0FF] transition-colors">
                      {studioInfo.phone}
                    </a>
                  </div>
                </div>
              </div>

              {/* Social Channels links */}
              <div className="flex items-center gap-4">
                <span className="text-[10px] text-[#444] uppercase tracking-widest font-mono font-bold">Kanal Kreatif:</span>
                <div className="flex items-center gap-2.5">
                  <a href={studioInfo.instagram || "https://instagram.com"} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-none bg-[#050505] border border-[#222] flex items-center justify-center text-[#888] hover:text-[#00F0FF] hover:border-[#00F0FF] transition">
                    <Instagram className="w-4 h-4" />
                  </a>
                  <a href={studioInfo.youtube || "https://youtube.com"} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-none bg-[#050505] border border-[#222] flex items-center justify-center text-[#888] hover:text-[#00F0FF] hover:border-[#00F0FF] transition">
                    <Youtube className="w-4 h-4" />
                  </a>
                  <a href={studioInfo.behance || "https://behance.net"} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-none bg-[#050505] border border-[#222] flex items-center justify-center text-[#888] hover:text-[#00F0FF] hover:border-[#00F0FF] transition">
                    <span className="font-extrabold text-[10px]">Bē</span>
                  </a>
                  <a href={studioInfo.dribbble || "https://dribbble.com"} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-none bg-[#050505] border border-[#222] flex items-center justify-center text-[#888] hover:text-[#00F0FF] hover:border-[#00F0FF] transition">
                    <span className="font-extrabold text-[10px]">Dr</span>
                  </a>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* CORE SERVICES SECTION */}
      <section id="services" className="py-24 relative overflow-hidden bg-[#050505]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <span className="text-[10px] text-[#00F0FF] font-bold uppercase tracking-[0.3em] block mb-3">LAYANAN TERBAIK</span>
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white uppercase tracking-tighter italic mb-4">
            Innovative Business Performance
          </h2>
          <p className="max-w-xl mx-auto text-[#888] mb-16 text-xs uppercase tracking-wider leading-relaxed">
            Kombinasi layanan kreatif strategis terintegrasi untuk menyajikan performa maksimum bagi brand modern Anda.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
            {services.map((svc) => (
              <div 
                key={svc.id} 
                className="p-8 rounded-none bg-[#050505] border border-[#222] hover:border-[#00F0FF] transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-none bg-[#050505] border border-[#222] group-hover:bg-[#00F0FF] group-hover:text-black flex items-center justify-center text-[#00F0FF] mb-6 transition-all duration-300">
                  {renderLucideIcon(svc.icon, "w-5 h-5")}
                </div>
                <h3 className="text-lg font-black uppercase text-white tracking-tight mb-3 group-hover:text-[#00F0FF] transition-colors">
                  {svc.title}
                </h3>
                <p className="text-xs text-[#AAA] leading-relaxed">
                  {svc.description}
                </p>
                {/* Visual Accent Arrow */}
                <div className="mt-6 flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-[#444] group-hover:text-[#00F0FF] transition-colors cursor-pointer">
                  <span>Pelajari Selengkapnya</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WORKFLOW STEPS / SYSTEM METHODOLOGY */}
      <section id="workflow" className="py-24 bg-[#050505]/40 border-t border-b border-[#222] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-[10px] text-[#00F0FF] font-bold uppercase tracking-[0.3em] block mb-3 font-mono">METODOLOGI</span>
          <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tighter italic text-white mb-16">
            Langkah Kerja Sistematis Kreatif Kami
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative text-left">
            {/* Visual connecting line for desktop */}
            <div className="hidden lg:block absolute top-[40px] left-[15%] right-[15%] h-[1px] bg-[#222] z-0" />

            {/* Step 1 */}
            <div className="relative z-10 p-6 rounded-none bg-[#050505] border border-[#222] hover:border-[#00F0FF] transition-colors">
              <div className="w-9 h-9 rounded-none bg-[#050505] text-[#00F0FF] font-extrabold font-mono text-xs border border-[#222] flex items-center justify-center mb-6">
                01
              </div>
              <h4 className="text-sm font-black uppercase tracking-tight text-white mb-2">Konsultasi Awal</h4>
              <p className="text-xs text-[#888] leading-relaxed">
                Kami mendengarkan visi bisnis, target market, tantangan pokok, dan mimpi estetika brand yang ingin Anda capai secara detail.
              </p>
            </div>

            {/* Step 2 */}
            <div className="relative z-10 p-6 rounded-none bg-[#050505] border border-[#222] hover:border-[#00F0FF] transition-colors">
              <div className="w-9 h-9 rounded-none bg-[#050505] text-[#00F0FF] font-extrabold font-mono text-xs border border-[#222] flex items-center justify-center mb-6">
                02
              </div>
              <h4 className="text-sm font-black uppercase tracking-tight text-white mb-2">Perencanaan & Strategi</h4>
              <p className="text-xs text-[#888] leading-relaxed">
                Menyusun moodboard visual, arsitektur informasi, serta timeline pengerjaan yang transparan dan terukur targetnya.
              </p>
            </div>

            {/* Step 3 */}
            <div className="relative z-10 p-6 rounded-none bg-[#050505] border border-[#222] hover:border-[#00F0FF] transition-colors">
              <div className="w-9 h-9 rounded-none bg-[#050505] text-[#00F0FF] font-extrabold font-mono text-xs border border-[#222] flex items-center justify-center mb-6">
                03
              </div>
              <h4 className="text-sm font-black uppercase tracking-tight text-white mb-2">Proses Pengembangan</h4>
              <p className="text-xs text-[#888] leading-relaxed">
                Tahap eksekusi produksi kreatif, syuting multimedia, desain layout UI/UX, hingga koding platform berkinerja mutakhir.
              </p>
            </div>

            {/* Step 4 */}
            <div className="relative z-10 p-6 rounded-none bg-[#050505] border border-[#222] hover:border-[#00F0FF] transition-colors">
              <div className="w-9 h-9 rounded-none bg-[#050505] text-[#00F0FF] font-extrabold font-mono text-xs border border-[#222] flex items-center justify-center mb-6">
                04
              </div>
              <h4 className="text-sm font-black uppercase tracking-tight text-white mb-2">Peluncuran & Support</h4>
              <p className="text-xs text-[#888] leading-relaxed">
                Uji kelayakan mutu, optimalisasi rilis, workshop serah-terima aset, dan dukungan pemeliharaan jangka panjang.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* DYNAMIC PORTFOLIO SHOWCASE SECTION */}
      <section id="portfolio" className="py-24 relative bg-[#050505]">
        <div className="absolute top-1/3 right-10 w-[400px] h-[400px] bg-purple-600/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 gap-6 text-left">
            <div>
              <span className="text-[10px] text-[#00F0FF] font-bold uppercase tracking-[0.3em] block mb-3">GALLERY KARYA KOSMIK</span>
              <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tighter italic text-white leading-tight">
                Portofolio Pilihan
              </h2>
              <p className="text-[#888] mt-2 text-xs uppercase tracking-wider max-w-xl leading-relaxed">
                Jelajahi karya desain dari branding estetis, sistem digital modern, hingga materi video komersial bernilai seni tinggi.
              </p>
            </div>

            {/* Search Input Filter */}
            <div className="relative w-full lg:w-80">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-[#666]">
                <Search className="w-4 h-4" />
              </span>
              <input 
                type="text" 
                placeholder="Cari nama project atau client..."
                value={portfolioSearch}
                onChange={(e) => setPortfolioSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-3 rounded-none bg-[#050505] border border-[#222] text-xs uppercase tracking-wider text-white placeholder-[#444] focus:outline-none focus:border-[#00F0FF] transition-colors"
              />
            </div>
          </div>

          {/* Categories Tab selector */}
          <div className="flex flex-wrap items-center gap-2 mb-10 overflow-x-auto pb-2 scrollbar-none">
            {['All', 'Branding', 'Design Systems', 'Digital Platforms', 'Media Solutions', 'Marketing'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-3 rounded-none text-[10px] tracking-widest uppercase font-black whitespace-nowrap transition-all duration-300 ${
                  selectedCategory === cat 
                    ? 'bg-[#00F0FF] text-neutral-950 shadow-[0_0_20px_rgba(0,240,255,0.25)] border border-[#00F0FF]' 
                    : 'bg-[#050505] text-[#888] hover:text-white border border-[#222] hover:border-[#00F0FF]'
                }`}
              >
                {cat === 'All' ? 'Semua Kategori' : cat}
              </button>
            ))}
          </div>

          {/* Dynamic Portfolio list with responsive grid */}
          {filteredPortfolio.length === 0 ? (
            <div className="p-16 rounded-none bg-[#050505] border border-[#222] text-center text-[#888]">
              <AlertCircle className="w-12 h-12 text-[#444] mx-auto mb-4" />
              <p className="text-sm font-black uppercase tracking-wider mb-1">Karya Tidak Ditemukan</p>
              <p className="text-xs max-w-md mx-auto leading-relaxed">Silakan ganti kata kunci pencarian Anda atau tambahkan portofolio baru melalui panel admin.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
              {filteredPortfolio.map((item) => (
                <div 
                  key={item.id}
                  onClick={() => setSelectedPortfolioItem(item)}
                  className="group cursor-pointer rounded-none overflow-hidden bg-[#050505] border border-[#222] hover:border-[#00F0FF] transition-all duration-500"
                >
                  {/* Photo Visual Section */}
                  <div className="aspect-[4/3] w-full overflow-hidden relative bg-[#050505]">
                    <img 
                      src={item.image_url} 
                      alt={item.title} 
                      className="w-full h-full object-cover filter brightness-75 group-hover:brightness-95 group-hover:scale-102 transition-all duration-700"
                    />
                    {/* Floating Category Indicator */}
                    <div className="absolute top-4 left-4 z-10 px-3 py-1.5 text-[9px] font-black uppercase tracking-widest bg-[#050505]/95 text-[#00F0FF] border border-[#222]">
                      {item.category}
                    </div>
                    {/* Featured Star Award */}
                    {item.featured && (
                      <div className="absolute top-4 right-4 z-10 w-7 h-7 bg-[#00F0FF] flex items-center justify-center text-neutral-950 border border-[#00F0FF] shadow-lg">
                        <Star className="w-3.5 h-3.5 fill-current text-current" />
                      </div>
                    )}
                  </div>

                  {/* Portfolio Text detail card */}
                  <div className="p-6">
                    <div className="flex items-center gap-2 text-[9px] text-[#666] font-mono font-bold uppercase tracking-widest mb-2">
                      <span>{item.client}</span>
                      <span>•</span>
                      <span>{item.year}</span>
                    </div>
                    <h3 className="text-lg font-black uppercase tracking-tight text-white mb-2 group-hover:text-[#00F0FF] transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-xs text-[#888] line-clamp-2 leading-relaxed mb-4">
                      {item.description}
                    </p>
                    <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-[#00F0FF]">
                      <span>Lihat Rincian Detil</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* PORTFOLIO DETAIL MODAL */}
      {selectedPortfolioItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/95 backdrop-blur-sm overflow-y-auto">
          <div className="absolute inset-0" onClick={() => setSelectedPortfolioItem(null)} />
          
          <div className="relative w-full max-w-4xl bg-[#050505] border border-[#222] rounded-none overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.9)] z-10 text-left my-8">
            <button 
              onClick={() => setSelectedPortfolioItem(null)}
              className="absolute top-4 right-4 p-2.5 rounded-none bg-[#050505]/90 border border-[#222] text-[#888] hover:text-white z-20 hover:border-[#00F0FF] transition-all"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2">
              {/* Photo Display */}
              <div className="bg-[#050505] aspect-[4/3] md:aspect-auto md:h-full relative border-r border-[#222]">
                <img 
                  src={selectedPortfolioItem.image_url} 
                  alt={selectedPortfolioItem.title} 
                  className="w-full h-full object-cover filter brightness-90"
                />
              </div>

              {/* Text / Data content section */}
              <div className="p-8 flex flex-col justify-between">
                <div>
                  <div className="inline-block px-3 py-1.5 text-[9px] font-black uppercase tracking-widest bg-[#050505] text-[#00F0FF] border border-[#222] mb-4 font-mono">
                    {selectedPortfolioItem.category}
                  </div>
                  
                  <h3 className="text-2xl font-black uppercase tracking-tight text-white mb-4">
                    {selectedPortfolioItem.title}
                  </h3>

                  <p className="text-xs text-[#AAA] leading-relaxed mb-6 font-medium">
                    {selectedPortfolioItem.description}
                  </p>

                  {/* Fact sheet list */}
                  <div className="space-y-3.5 border-t border-b border-[#222] py-5 mb-6 text-xs uppercase tracking-wider font-bold">
                    <div className="flex items-center justify-between">
                      <span className="text-[#666]">Klien Resmi:</span>
                      <span className="text-white">{selectedPortfolioItem.client}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[#666]">Tahun Produksi:</span>
                      <span className="text-[#00F0FF] font-mono">{selectedPortfolioItem.year}</span>
                    </div>
                  </div>
                </div>

                {/* Submitting link button */}
                {selectedPortfolioItem.link && (
                  <a 
                    href={selectedPortfolioItem.link} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="w-full py-4 text-center rounded-none font-black uppercase tracking-widest text-xs bg-[#00F0FF] text-neutral-950 hover:bg-white transition-all flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(0,240,255,0.3)]"
                  >
                    <span>Kunjungi Pranala Proyek</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CORE TEAM SHOWCASE */}
      <section id="team" className="py-24 bg-[#050505] border-t border-[#222] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-[10px] text-[#00F0FF] font-bold uppercase tracking-[0.3em] block mb-3">HEAD CREATIVE CREW</span>
          <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tighter italic text-white mb-16">
            Tim Utama Kreatif
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
            {team.map((member) => (
              <div 
                key={member.id}
                className="group rounded-none overflow-hidden bg-[#050505] border border-[#222] p-5 hover:border-[#00F0FF] transition-all duration-300"
              >
                <div className="aspect-[3/4] rounded-none overflow-hidden mb-5 relative bg-[#050505]">
                  <img 
                    src={member.image_url} 
                    alt={member.name} 
                    className="w-full h-full object-cover filter brightness-75 group-hover:brightness-95 group-hover:scale-102 transition-all duration-500"
                  />
                  {/* Floating Instagram Icon overlay */}
                  {member.instagram && (
                    <a 
                      href={member.instagram} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="absolute bottom-4 right-4 w-8 h-8 rounded-none bg-[#050505] border border-[#222] flex items-center justify-center text-neutral-300 hover:text-[#00F0FF] hover:border-[#00F0FF]"
                    >
                      <Instagram className="w-4 h-4" />
                    </a>
                  )}
                </div>
                <h4 className="text-sm font-black uppercase tracking-tight text-white">{member.name}</h4>
                <p className="text-[10px] text-[#00F0FF] font-black font-mono uppercase tracking-widest mt-1">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DYNAMIC CLIENT TESTIMONIALS */}
      <section id="testimonials" className="py-24 bg-[#050505] border-t border-[#222]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-[10px] text-[#00F0FF] font-bold uppercase tracking-[0.3em] block mb-3 font-mono">TESTIMONIAL</span>
          <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tighter italic text-white mb-16">
            Apa Kata Mitra Sukses Kami
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
            {testimonials.map((testi) => (
              <div 
                key={testi.id} 
                className="p-8 rounded-none bg-[#050505] border border-[#222] flex flex-col justify-between hover:border-[#00F0FF] transition-all duration-300"
              >
                <div>
                  {/* Dynamic Rating stars */}
                  <div className="flex items-center gap-1 text-[#00F0FF] mb-6">
                    {[...Array(testi.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current text-current" />
                    ))}
                  </div>

                  <p className="text-xs text-[#AAA] leading-relaxed italic mb-8">
                    " {testi.comment} "
                  </p>
                </div>

                {/* Sender card metadata */}
                <div className="flex items-center gap-4">
                  <img 
                    src={testi.avatar_url} 
                    alt={testi.name} 
                    className="w-10 h-10 rounded-none object-cover border border-[#222]"
                  />
                  <div>
                    <h5 className="font-black uppercase tracking-tight text-white text-xs">{testi.name}</h5>
                    <p className="text-[10px] text-[#666] font-bold uppercase mt-0.5">{testi.role}, {testi.company}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FREQUENTLY ASKED QUESTIONS (FAQ) ACCORDION */}
      <section id="faq" className="py-24 bg-[#050505] border-t border-[#222] relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
          <div className="text-center mb-16">
            <span className="text-[10px] text-[#00F0FF] font-bold uppercase tracking-[0.3em] block mb-3">TANYA JAWAB</span>
            <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tighter italic text-white">
              Ada Pertanyaan?
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq) => {
              const isExpanded = expandedFAQId === faq.id;
              return (
                <div 
                  key={faq.id} 
                  className="rounded-none border border-[#222] bg-[#050505] hover:border-[#00F0FF] overflow-hidden transition-all duration-300"
                >
                  <button
                    onClick={() => setExpandedFAQId(isExpanded ? null : faq.id)}
                    className="w-full p-6 flex items-center justify-between text-left font-black uppercase text-xs text-white hover:text-[#00F0FF] transition-colors"
                  >
                    <span className="tracking-wide">{faq.question}</span>
                    <span className="p-1.5 rounded-none bg-[#050505] border border-[#222] text-[#888] group-hover:border-[#00F0FF]">
                      {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </span>
                  </button>
                  
                  {isExpanded && (
                    <div className="px-6 pb-6 text-xs text-[#AAA] leading-relaxed border-t border-[#222] pt-4 font-medium">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* REVOLUTIONARY INTERACTIVE CONTACT FORM */}
      <section id="contact" className="py-24 bg-[#050505] relative border-t border-[#222]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 text-left">
            
            {/* Detail info columns */}
            <div className="lg:col-span-5 flex flex-col justify-between">
              <div>
                <span className="text-[10px] text-[#00F0FF] font-bold uppercase tracking-[0.3em] block mb-3 font-mono">MULAI SEKARANG</span>
                <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tighter italic text-white mb-6 leading-none">
                  Ready to Craft Your Story?
                </h2>
                <p className="text-[#888] mb-8 leading-relaxed text-xs uppercase tracking-wider">
                  Isi formulir kontak interaktif di sebelah kanan. Pesan Anda akan langsung tersimpan di database fullstack secara realtime dan terbaca langsung oleh tim administrator kami di dashboard.
                </p>
              </div>

              {/* Live contact point details */}
              <div className="space-y-4 text-xs font-bold uppercase tracking-wider">
                <div className="p-4 rounded-none bg-[#050505] border border-[#222] flex items-center gap-4">
                  <div className="w-9 h-9 rounded-none bg-[#050505] text-[#00F0FF] flex items-center justify-center border border-[#222]">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[9px] text-[#666] font-mono tracking-widest">KANTOR UTAMA</p>
                    <p className="text-white mt-0.5">Jakarta Selatan, DKI Jakarta, Indonesia</p>
                  </div>
                </div>

                <div className="p-4 rounded-none bg-[#050505] border border-[#222] flex items-center gap-4">
                  <div className="w-9 h-9 rounded-none bg-[#050505] text-[#00F0FF] flex items-center justify-center border border-[#222]">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[9px] text-[#666] font-mono tracking-widest">SUPORT EMAIL</p>
                    <p className="text-white mt-0.5">{studioInfo.email}</p>
                  </div>
                </div>

                <div className="p-4 rounded-none bg-[#050505] border border-[#222] flex items-center gap-4">
                  <div className="w-9 h-9 rounded-none bg-[#050505] text-[#00F0FF] flex items-center justify-center border border-[#222]">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[9px] text-[#666] font-mono tracking-widest">LAYANAN WHATSAPP</p>
                    <p className="text-white mt-0.5">{studioInfo.phone}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Submitting Form Column */}
            <div className="lg:col-span-7 bg-[#050505] border border-[#222] rounded-none p-8 relative hover:border-[#00F0FF] transition-colors">
              
              {formSuccess ? (
                <div className="py-12 text-center">
                  <div className="w-16 h-16 bg-[#00F0FF]/10 text-[#00F0FF] border border-[#00F0FF]/30 rounded-none flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-9 h-9" />
                  </div>
                  <h4 className="text-xl font-black uppercase tracking-tight text-white mb-2">Pesan Berhasil Terkirim!</h4>
                  <p className="text-xs text-[#888] max-w-md mx-auto leading-relaxed mb-8 uppercase tracking-wider">
                    Terima kasih telah menghubungi PixelFrame Studio Indonesia. Pesan Anda telah terekam di database fullstack dan tim kami akan segera memverifikasi serta membalas secepatnya.
                  </p>
                  <button 
                    onClick={() => setFormSuccess(false)}
                    className="px-6 py-3 rounded-none font-black text-xs uppercase tracking-widest bg-[#00F0FF] hover:bg-white text-neutral-950 transition-all cursor-pointer"
                  >
                    Kirim Pesan Baru
                  </button>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[10px] font-black tracking-[0.2em] text-[#666] uppercase mb-2 font-mono">
                        Nama Lengkap <span className="text-rose-500">*</span>
                      </label>
                      <input 
                        type="text" 
                        required
                        value={contactForm.name}
                        onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                        placeholder="Masukkan nama Anda..."
                        className="w-full px-4 py-3 bg-[#050505] border border-[#222] rounded-none text-[#F0F0F0] placeholder-[#333] focus:outline-none focus:border-[#00F0FF] text-xs uppercase tracking-wide transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-black tracking-[0.2em] text-[#666] uppercase mb-2 font-mono">
                        Alamat Email <span className="text-rose-500">*</span>
                      </label>
                      <input 
                        type="email" 
                        required
                        value={contactForm.email}
                        onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                        placeholder="nama@email.com"
                        className="w-full px-4 py-3 bg-[#050505] border border-[#222] rounded-none text-[#F0F0F0] placeholder-[#333] focus:outline-none focus:border-[#00F0FF] text-xs uppercase tracking-wide transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[10px] font-black tracking-[0.2em] text-[#666] uppercase mb-2 font-mono">
                        Nama Perusahaan <span className="text-neutral-604 font-normal">(Opsional)</span>
                      </label>
                      <input 
                        type="text" 
                        value={contactForm.company}
                        onChange={(e) => setContactForm({ ...contactForm, company: e.target.value })}
                        placeholder="PT Maju Bersama..."
                        className="w-full px-4 py-3 bg-[#050505] border border-[#222] rounded-none text-[#F0F0F0] placeholder-[#333] focus:outline-none focus:border-[#00F0FF] text-xs uppercase tracking-wide transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-black tracking-[0.2em] text-[#666] uppercase mb-2 font-mono">
                        Subjek Pesan <span className="text-rose-500">*</span>
                      </label>
                      <input 
                        type="text" 
                        required
                        value={contactForm.subject}
                        onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                        placeholder="Contoh: Penawaran Project Rebranding..."
                        className="w-full px-4 py-3 bg-[#050505] border border-[#222] rounded-none text-[#F0F0F0] placeholder-[#333] focus:outline-none focus:border-[#00F0FF] text-xs uppercase tracking-wide transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black tracking-[0.2em] text-[#666] uppercase mb-2 font-mono">
                      Isi Pesan / Detil Kebutuhan Proyek <span className="text-rose-500">*</span>
                    </label>
                    <textarea 
                      rows={5}
                      required
                      value={contactForm.message}
                      onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                      placeholder="Dekripsikan kebutuhan visual creative studio, tenggat waktu pengerjaan, atau budget pengerjaan Anda di sini..."
                      className="w-full px-4 py-3 bg-[#050505] border border-[#222] rounded-none text-[#F0F0F0] placeholder-[#333] focus:outline-none focus:border-[#00F0FF] text-xs uppercase tracking-wide transition-colors"
                    />
                  </div>

                  <button 
                    type="submit" 
                    disabled={formSubmitting}
                    className="w-full py-4 rounded-none font-black text-xs uppercase tracking-widest text-neutral-950 bg-[#00F0FF] hover:bg-white transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>{formSubmitting ? 'Mengirim...' : 'Kirim Sekarang'}</span>
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER COID */}
      <footer className="border-t border-[#222] bg-[#050505] py-12 relative font-bold">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-none bg-[#050505] border border-[#222] flex items-center justify-center overflow-hidden">
              <img 
                src="/logo_pixelframe.webp" 
                alt="PixelFrame Logo" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="text-left">
              <p className="font-black uppercase tracking-tight text-white text-xs">PixelFrame Studio Indonesia</p>
              <p className="text-[10px] text-neutral-500 font-mono mt-0.5">© {new Date().getFullYear()} All Rights Reserved.</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-[10px] font-black uppercase tracking-widest text-[#666]">
            <a href="#about" className="hover:text-white transition-colors">Biodata</a>
            <span>•</span>
            <a href="#portfolio" className="hover:text-white transition-colors">Portofolio</a>
            <span>•</span>
            <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
            <span>•</span>
            <button onClick={() => setShowAdmin(true)} className="text-[#00F0FF] hover:underline font-bold">Sistem Admin</button>
          </div>
        </div>
      </footer>

      {/* ADMIN PANEL FULLSTACK TABBED CONTROLLER MODAL */}
      {showAdmin && (
        <div className="fixed inset-0 z-50 bg-neutral-950/95 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="absolute inset-0" onClick={() => setShowAdmin(false)} />
          
          {!isAdminLoggedIn ? (
            /* SECURE HIGH-POLISHED BRUTALIST LOGIN CARD */
            <div className="relative w-full max-w-md bg-[#050505] border border-[#222] rounded-none p-8 hover:border-[#00F0FF] transition-all duration-500 shadow-[0_0_50px_rgba(0,240,255,0.1)] z-10 text-left my-8 select-none">
              <button 
                type="button"
                onClick={() => setShowAdmin(false)}
                className="absolute top-4 right-4 p-1 rounded-none border border-[#222] bg-[#050505] text-[#888] hover:text-[#00F0FF] hover:border-[#00F0FF] transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="text-center mb-8">
                {/* Visual Lock Accent Icon inside PixelFrame square border */}
                <div className="w-16 h-16 rounded-none bg-[#050505] border-2 border-[#222] flex items-center justify-center mx-auto mb-4 p-2 relative">
                  <Lock className="w-6 h-6 text-[#00F0FF]" />
                  <div className="absolute -inset-0.5 border border-dashed border-[#00F0FF]/30 animate-pulse pointer-events-none rounded-none" />
                </div>
                <h3 className="text-lg font-black uppercase tracking-[0.2em] text-white">SYSTEM DECRYPTION</h3>
                <p className="text-[9px] text-[#666] font-mono tracking-widest uppercase mt-1">PIXELFRAME REVOLUTIONARY ENGINE v1.0</p>
              </div>

              {loginError && (
                <div className="mb-6 p-4 bg-rose-950/20 border border-rose-800/80 text-rose-400 text-[10px] font-black uppercase tracking-wider flex items-center gap-2">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{loginError}</span>
                </div>
              )}

              <form onSubmit={handleAdminLoginSubmit} className="space-y-5">
                <div>
                  <label className="block text-[9px] font-black tracking-[0.25em] text-[#666] uppercase mb-1.5 font-mono">
                    ADMIN IDENTITY CARD
                  </label>
                  <div className="relative">
                    <input 
                      type="email" 
                      required
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="Enter Admin Email"
                      className="w-full px-4 py-3 bg-[#050505] border border-[#222] rounded-none text-[#F0F0F0] placeholder-[#333] focus:outline-none focus:border-[#00F0FF] text-xs uppercase tracking-wider transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[9px] font-black tracking-[0.25em] text-[#666] uppercase mb-1.5 font-mono">
                    SECURE ACCESS PIN / DECRYPT PASS
                  </label>
                  <div className="relative">
                    <input 
                      type={showPassword ? 'text' : 'password'} 
                      required
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="Enter Access Key"
                      className="w-full pl-4 pr-10 py-3 bg-[#050505] border border-[#222] rounded-none text-[#F0F0F0] placeholder-[#333] focus:outline-none focus:border-[#00F0FF] text-xs uppercase tracking-wider transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-3 flex items-center text-[#555] hover:text-[#00F0FF]"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button 
                  type="submit"
                  className="w-full py-4 rounded-none font-black text-xs uppercase tracking-[0.25em] text-neutral-950 bg-[#00F0FF] hover:bg-white transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer mt-2"
                >
                  <Unlock className="w-3.5 h-3.5" />
                  <span>AUTHORIZE ENTRY</span>
                </button>
              </form>

              {/* Secure Developer Hint Card */}
              <div className="mt-8 pt-6 border-t border-[#111] text-center">
                <div className="inline-block p-3.5 bg-[#080808] border border-[#111] w-full text-left">
                  <p className="text-[8px] font-mono text-[#444] tracking-[0.2em] font-black uppercase mb-1">DEVELOPER SIGN-IN SCHEME</p>
                  <p className="text-[10px] text-[#888] font-mono leading-relaxed mt-1">
                    <span className="text-[#00F0FF]">USER:</span> pixelframe.indonesia@gmail.com
                  </p>
                  <p className="text-[10px] text-[#888] font-mono leading-relaxed">
                    <span className="text-[#00F0FF]">KEY:</span> Masitohddx1
                  </p>
                </div>
              </div>

            </div>
          ) : (
            <div className="relative w-full max-w-5xl bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.9)] z-10 text-left my-4 flex flex-col h-[90vh]">
              
              {/* Header of Admin Panel */}
              <div className="px-6 py-4 bg-neutral-950 border-b border-neutral-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Settings className="w-5 h-5 text-cyan-400 animate-spin-slow" />
                  <div>
                    <h3 className="text-lg font-bold text-white">PixelFrame Control Center</h3>
                    <p className="text-xs text-neutral-500">Urus database, biodata, dan data portofolio real-time Supabase</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setIsAdminLoggedIn(false);
                      sessionStorage.removeItem('isAdminLoggedIn');
                    }}
                    className="px-3 py-1.5 rounded-none border border-rose-950 bg-rose-950/20 text-rose-400 hover:bg-rose-900 hover:text-white transition text-[9px] uppercase tracking-wider font-extrabold flex items-center gap-1.5"
                    title="Sign Out Session"
                  >
                    <Lock className="w-3 h-3" />
                    <span>LOGOUT</span>
                  </button>
                  <button 
                    type="button"
                    onClick={() => setShowAdmin(false)}
                    className="p-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white transition"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

            {/* Layout Split: Left Toggles vs Right Panel Content */}
            <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
              
              {/* Left sidebar nav triggers inside modal */}
              <div className="w-full md:w-64 bg-neutral-950/40 border-r border-neutral-800 p-4 space-y-1 overflow-y-auto">
                <button
                  onClick={() => setActiveAdminTab('supabase')}
                  className={`w-full text-left px-4 py-3 rounded-lg text-sm font-semibold flex items-center gap-2.5 transition ${
                    activeAdminTab === 'supabase' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' : 'text-neutral-400 hover:bg-neutral-900 hover:text-neutral-100'
                  }`}
                >
                  <Database className="w-4 h-4" />
                  <span>Koneksi Supabase</span>
                </button>

                <button
                  onClick={() => setActiveAdminTab('studio')}
                  className={`w-full text-left px-4 py-3 rounded-lg text-sm font-semibold flex items-center gap-2.5 transition ${
                    activeAdminTab === 'studio' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' : 'text-neutral-400 hover:bg-neutral-900 hover:text-neutral-100'
                  }`}
                >
                  <Cpu className="w-4 h-4" />
                  <span>Edit Profil & Biodata</span>
                </button>

                <button
                  onClick={() => setActiveAdminTab('portfolios')}
                  className={`w-full text-left px-4 py-3 rounded-lg text-sm font-semibold flex items-center gap-2.5 transition ${
                    activeAdminTab === 'portfolios' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' : 'text-neutral-400 hover:bg-neutral-900 hover:text-neutral-100'
                  }`}
                >
                  <Palette className="w-4 h-4" />
                  <span>Karya Portofolio (CRUD)</span>
                </button>

                <button
                  onClick={() => setActiveAdminTab('messages')}
                  className={`w-full text-left px-4 py-3 rounded-lg text-sm font-semibold flex items-center justify-between gap-2.5 transition ${
                    activeAdminTab === 'messages' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' : 'text-neutral-400 hover:bg-neutral-900 hover:text-neutral-100'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Mail className="w-4 h-4" />
                    <span>Pesan Masuk (Inbox)</span>
                  </div>
                  {messages.length > 0 && (
                    <span className="bg-cyan-500 text-neutral-950 text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                      {messages.length}
                    </span>
                  )}
                </button>

                <div className="pt-6 border-t border-neutral-850 mt-4">
                  <div className="p-3 bg-neutral-900/60 rounded-xl border border-neutral-800 text-xs">
                    <div className="font-semibold text-neutral-300 mb-1">Status Sinkronisasi</div>
                    <div className="flex items-center gap-2 text-neutral-500">
                      <div className={`w-2 h-2 rounded-full ${isUsingSupabase ? 'bg-emerald-400' : 'bg-indigo-400'}`} />
                      <span>{isUsingSupabase ? 'Database Supabase Aktif' : 'Status Local Fallback'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Panel dynamic screen editor view */}
              <div className="flex-1 p-6 md:p-8 overflow-y-auto bg-neutral-900/40">
                
                {/* 1. SUPABASE CONNECTION CONFIG */}
                {activeAdminTab === 'supabase' && (
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-xl font-extrabold text-white mb-1.5 flex items-center gap-2">
                        <span>Integrasi Database Supabase</span>
                        <Database className="w-5 h-5 text-cyan-400" />
                      </h4>
                      <p className="text-xs text-neutral-400 leading-relaxed">
                        Sambungkan situs portofolio ini dengan database cloud Supabase Anda! Setelah dikonfigurasi, semua profil, services, portfolio baru, dan pesan kontak masuk akan langsung tersimpan & terbaca dari Supabase project secara mutakhir. Jika kosong, web otomatis menggunakan basis data lokal terisolasi di browser (LocalStorage).
                      </p>
                    </div>

                    {dbSyncSuccess && (
                      <div className="p-4 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs flex items-center gap-2">
                        <Check className="w-4 h-4 flex-shrink-0" />
                        <span>{dbSyncSuccess}</span>
                      </div>
                    )}

                    <form onSubmit={handleSaveSupabaseConfig} className="bg-neutral-950 p-5 rounded-2xl border border-neutral-800 space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-neutral-400 uppercase tracking-widest mb-1.5 font-mono">
                          SUPABASE URL
                        </label>
                        <input 
                          type="url" 
                          value={supabaseConfigInput.url}
                          onChange={(e) => setSupabaseConfigInput({ ...supabaseConfigInput, url: e.target.value })}
                          placeholder="https://abcde1234.supabase.co"
                          className="w-full px-4 py-2.5 bg-neutral-900 border border-neutral-800 rounded-xl text-neutral-200 placeholder-neutral-600 focus:outline-none focus:border-cyan-500 text-sm transition"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-neutral-400 uppercase tracking-widest mb-1.5 font-mono">
                          SUPABASE ANON PUBLIC KEY
                        </label>
                        <input 
                          type="password" 
                          value={supabaseConfigInput.key}
                          onChange={(e) => setSupabaseConfigInput({ ...supabaseConfigInput, key: e.target.value })}
                          placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                          className="w-full px-4 py-2.5 bg-neutral-900 border border-neutral-800 rounded-xl text-neutral-200 placeholder-neutral-600 focus:outline-none focus:border-cyan-500 text-sm transition font-mono text-xs"
                        />
                      </div>

                      <div className="flex flex-wrap gap-2.5 pt-2">
                        <button
                          type="submit"
                          className="px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-neutral-950 hover:text-white rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                        >
                          {dbSyncing ? 'Sinkronisasi...' : 'Simpan & Hubungkan Database'}
                        </button>
                        
                        {supabaseConfigInput.url && (
                          <button
                            type="button"
                            onClick={() => {
                              setSupabaseConfigInput({ url: '', key: '' });
                              db.saveSupabaseConfig('', '');
                              setIsUsingSupabase(false);
                              loadDatabaseData();
                              alert("Koneksi Supabase dihapus. Web beralih kembali ke Database Lokal.");
                            }}
                            className="px-4 py-2.5 bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-red-400 hover:border-red-500/20 rounded-xl text-xs font-bold transition"
                          >
                            Putuskan Hubungan
                          </button>
                        )}
                      </div>
                    </form>

                    {/* Step-by-step SQL Setup code trigger helper tutorial */}
                    <div className="border border-neutral-800 p-5 rounded-2xl space-y-3 bg-neutral-950/20">
                      <div className="flex items-center justify-between">
                        <h5 className="font-bold text-sm text-neutral-200">Panduan Skema SQL Supabase</h5>
                        <button 
                          onClick={handleCopySql}
                          className="px-3 py-1.5 text-xs rounded-lg bg-neutral-900 hover:bg-neutral-800 text-cyan-400 border border-neutral-800 hover:border-cyan-500/20 flex items-center gap-1.5 transition"
                        >
                          {sqlCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{sqlCopied ? 'Tersalin' : 'Salin Script SQL'}</span>
                        </button>
                      </div>
                      <p className="text-xs text-neutral-500 leading-relaxed">
                        Jika Anda menghubungkan Supabase baru, Anda perlu membuat tabel-tabel data di Supabase. Cukup tekan tombol <span className="text-cyan-400">"Salin Script SQL"</span> di kanan atas, lalu buka <span className="text-neutral-300">Supabase Dashboard → Project Anda → SQL Editor → Paste Script & Tekan Run</span>. Script ini akan membuat semua struktur tabel (portfolios, studio_info, services, team, dll.) secara otomatis!
                      </p>
                    </div>
                  </div>
                )}

                {/* 2. PROFILE & BIODATA STUDIO EDITOR */}
                {activeAdminTab === 'studio' && editStudioForm && (
                  <form onSubmit={handleSaveStudioInfo} className="space-y-6">
                    <div>
                      <h4 className="text-xl font-extrabold text-white mb-1.5">Edit Biodata & Profil Studio</h4>
                      <p className="text-xs text-neutral-400">Perbarui penyesuaian teks tagline utama, alamat kantor, no handphone WhatsApp, dan kanal sosial media PixelFrame.</p>
                    </div>

                    <div className="bg-neutral-950 p-6 rounded-2xl border border-neutral-800 space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-neutral-400 uppercase tracking-widest mb-1.5 font-mono">
                          Nama Studio Resmi
                        </label>
                        <input 
                          type="text"
                          required
                          value={editStudioForm.name}
                          onChange={(e) => setEditStudioForm({ ...editStudioForm, name: e.target.value })}
                          className="w-full px-4 py-2.5 bg-neutral-900 border border-neutral-800 rounded-xl text-neutral-200 text-sm focus:outline-none focus:border-cyan-500 font-bold"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-neutral-400 uppercase tracking-widest mb-1.5 font-mono">
                            Tagline Utama (Gunakan pemisah titik .)
                          </label>
                          <input 
                            type="text"
                            required
                            value={editStudioForm.tagline}
                            onChange={(e) => setEditStudioForm({ ...editStudioForm, tagline: e.target.value })}
                            className="w-full px-4 py-2.5 bg-neutral-900 border border-neutral-800 rounded-xl text-neutral-200 text-sm focus:outline-none focus:border-cyan-500"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-neutral-400 uppercase tracking-widest mb-1.5 font-mono">
                            Deskripsi Pendek Slogan
                          </label>
                          <input 
                            type="text"
                            required
                            value={editStudioForm.description}
                            onChange={(e) => setEditStudioForm({ ...editStudioForm, description: e.target.value })}
                            className="w-full px-4 py-2.5 bg-neutral-900 border border-neutral-800 rounded-xl text-neutral-200 text-sm focus:outline-none focus:border-cyan-500"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-neutral-400 uppercase tracking-widest mb-1.5 font-mono">
                          Narasi Panjang Profil Studio (Tentang Kami)
                        </label>
                        <textarea 
                          rows={4}
                          required
                          value={editStudioForm.about_rich}
                          onChange={(e) => setEditStudioForm({ ...editStudioForm, about_rich: e.target.value })}
                          className="w-full px-4 py-2.5 bg-neutral-900 border border-neutral-800 rounded-xl text-neutral-200 text-sm focus:outline-none focus:border-cyan-500 leading-relaxed"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-neutral-400 uppercase tracking-widest mb-1.5 font-mono">
                            Alamat Kota Lokasi
                          </label>
                          <input 
                            type="text"
                            required
                            value={editStudioForm.location}
                            onChange={(e) => setEditStudioForm({ ...editStudioForm, location: e.target.value })}
                            className="w-full px-4 py-2.5 bg-neutral-900 border border-neutral-800 rounded-xl text-neutral-200 text-sm"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-neutral-400 uppercase tracking-widest mb-1.5 font-mono">
                            Email Bisnis Utama
                          </label>
                          <input 
                            type="email"
                            required
                            value={editStudioForm.email}
                            onChange={(e) => setEditStudioForm({ ...editStudioForm, email: e.target.value })}
                            className="w-full px-4 py-2.5 bg-neutral-900 border border-neutral-800 rounded-xl text-neutral-200 text-sm"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-neutral-400 uppercase tracking-widest mb-1.5 font-mono">
                            Telpon / WhatsApp (+62...)
                          </label>
                          <input 
                            type="text"
                            required
                            value={editStudioForm.phone}
                            onChange={(e) => setEditStudioForm({ ...editStudioForm, phone: e.target.value })}
                            className="w-full px-4 py-2.5 bg-neutral-900 border border-neutral-800 rounded-xl text-neutral-200 text-sm"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-neutral-400 uppercase tracking-widest mb-1.5 font-mono">
                            URL Instagram
                          </label>
                          <input 
                            type="url"
                            value={editStudioForm.instagram}
                            onChange={(e) => setEditStudioForm({ ...editStudioForm, instagram: e.target.value })}
                            className="w-full px-4 py-2.5 bg-neutral-900 border border-neutral-800 rounded-xl text-neutral-200 text-sm"
                          />
                        </div>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="px-6 py-3 bg-cyan-400 hover:bg-cyan-300 text-neutral-950 rounded-xl text-xs font-bold uppercase tracking-widest cursor-pointer"
                    >
                      Perbarui Profil Studio
                    </button>
                  </form>
                )}

                {/* 3. CRUD PORTFOLIO MANAGER */}
                {activeAdminTab === 'portfolios' && (
                  <div className="space-y-8">
                    <div>
                      <h4 className="text-xl font-extrabold text-white mb-1.5">Kelola Portofolio Karya (CRUD)</h4>
                      <p className="text-xs text-neutral-400">Tambahkan hasil karya rancangan studio, perbarui tautan demo secara realtime, atau hapus item lama.</p>
                    </div>

                    {/* NEW / EDIT PORTFOLIO FORM */}
                    <form onSubmit={handleSavePortfolioItem} className="bg-neutral-950 p-6 rounded-2xl border border-neutral-800 space-y-4 text-left">
                      <div className="font-bold text-sm text-cyan-400 border-b border-neutral-800 pb-2 mb-3">
                        {editPortfolioForm.id ? "Edit Item Portofolio" : "Tambah Portofolio Karya Baru"}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-neutral-400 uppercase tracking-widest mb-1.5 font-mono">
                            Judul Proyek / Nama Produk
                          </label>
                          <input 
                            type="text"
                            value={editPortfolioForm.title}
                            onChange={(e) => setEditPortfolioForm({ ...editPortfolioForm, title: e.target.value })}
                            placeholder="Rebranding Kopi Merdeka..."
                            className="w-full px-4 py-2 bg-neutral-900 border border-neutral-800 rounded-xl text-neutral-200 text-sm focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-neutral-400 uppercase tracking-widest mb-1.5 font-mono">
                            Kategori Karya
                          </label>
                          <select 
                            value={editPortfolioForm.category}
                            onChange={(e) => setEditPortfolioForm({ ...editPortfolioForm, category: e.target.value as any })}
                            className="w-full px-4 py-2 bg-neutral-900 border border-neutral-800 rounded-xl text-neutral-250 text-sm focus:outline-none"
                          >
                            <option value="Branding">Branding</option>
                            <option value="Design Systems">Design Systems</option>
                            <option value="Digital Platforms">Digital Platforms</option>
                            <option value="Media Solutions">Media Solutions</option>
                            <option value="Marketing">Marketing</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-neutral-400 uppercase tracking-widest mb-1.5 font-mono">
                            Nama Klien Resmi
                          </label>
                          <input 
                            type="text"
                            value={editPortfolioForm.client}
                            onChange={(e) => setEditPortfolioForm({ ...editPortfolioForm, client: e.target.value })}
                            placeholder="PT Mitra Nusantara..."
                            className="w-full px-4 py-2 bg-neutral-900 border border-neutral-800 rounded-xl text-neutral-200 text-sm"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-xs font-bold text-neutral-400 uppercase tracking-widest mb-1.5 font-mono">
                              Tahun Rilis
                            </label>
                            <input 
                              type="text"
                              value={editPortfolioForm.year}
                              onChange={(e) => setEditPortfolioForm({ ...editPortfolioForm, year: e.target.value })}
                              placeholder="2026"
                              className="w-full px-4 py-2 bg-neutral-900 border border-neutral-800 rounded-xl text-neutral-200 text-sm"
                            />
                          </div>

                          <div className="flex items-center pt-6 justify-center">
                            <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-neutral-400">
                              <input 
                                type="checkbox"
                                checked={editPortfolioForm.featured}
                                onChange={(e) => setEditPortfolioForm({ ...editPortfolioForm, featured: e.target.checked })}
                                className="rounded bg-neutral-900 border-neutral-800 text-cyan-500 w-4 h-4 focus:ring-0"
                              />
                              <span>Featured (Bintang)</span>
                            </label>
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-neutral-400 uppercase tracking-widest mb-1.5 font-mono">
                          Tautan URL Proyek (https://site.com)
                        </label>
                        <input 
                          type="url"
                          value={editPortfolioForm.link}
                          onChange={(e) => setEditPortfolioForm({ ...editPortfolioForm, link: e.target.value })}
                          placeholder="https://clientproject.co"
                          className="w-full px-4 py-2 bg-neutral-900 border border-neutral-800 rounded-xl text-neutral-200 text-sm"
                        />
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-1.5 flex-wrap gap-2">
                          <label className="block text-xs font-bold text-neutral-400 uppercase tracking-widest font-mono">
                            URL Tautan Gambar Visual (Unsplash / Eksternal)
                          </label>
                          <div className="flex gap-2">
                            {UNSPLASH_PRESETS.map((p, ix) => (
                              <button
                                key={ix}
                                type="button"
                                onClick={() => setEditPortfolioForm({ ...editPortfolioForm, image_url: p.url })}
                                className="px-2 py-1 bg-neutral-900 hover:bg-neutral-800 text-[10px] text-cyan-400 rounded border border-neutral-850"
                              >
                                {p.name}
                              </button>
                            ))}
                          </div>
                        </div>
                        <input 
                          type="text"
                          required
                          value={editPortfolioForm.image_url}
                          onChange={(e) => setEditPortfolioForm({ ...editPortfolioForm, image_url: e.target.value })}
                          placeholder="Salin/Paste link gambar visual di sini..."
                          className="w-full px-4 py-2 bg-neutral-900 border border-neutral-800 rounded-xl text-neutral-200 text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-neutral-400 uppercase tracking-widest mb-1.5 font-mono">
                          Deskripsi Teknis Proyek
                        </label>
                        <textarea 
                          rows={3}
                          value={editPortfolioForm.description}
                          onChange={(e) => setEditPortfolioForm({ ...editPortfolioForm, description: e.target.value })}
                          placeholder="Tuliskan latar belakang, penyelesaian desain, dan implikasi bagi pertumbuhan usaha klien..."
                          className="w-full px-4 py-2 bg-neutral-900 border border-neutral-800 rounded-xl text-neutral-200 text-sm leading-relaxed focus:outline-none"
                        />
                      </div>

                      <div className="flex gap-2.5 pt-2">
                        <button
                          type="submit"
                          className="px-5 py-2.5 bg-cyan-400 hover:bg-cyan-300 text-neutral-950 font-bold text-xs rounded-xl transition cursor-pointer"
                        >
                          {editPortfolioForm.id ? "Perbarui Portofolio" : "Tambah Karya Portofolio"}
                        </button>

                        {editPortfolioForm.id && (
                          <button
                            type="button"
                            onClick={() => setEditPortfolioForm({
                              title: '',
                              category: 'Branding',
                              image_url: '',
                              client: '',
                              year: '2026',
                              description: '',
                              link: '',
                              featured: false
                            })}
                            className="px-4 py-2.5 bg-neutral-900 border border-neutral-850 text-neutral-400 rounded-xl text-xs font-semibold"
                          >
                            Batal Edit
                          </button>
                        )}
                      </div>
                    </form>

                    {/* PORTFOLIO LIST INSPECTOR */}
                    <div className="space-y-4 text-left">
                      <div className="font-bold text-sm text-neutral-300 border-b border-neutral-800 pb-2 mb-2">
                        Daftar Portofolio Saat Ini ({portfolios.length})
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {portfolios.map((p) => (
                          <div 
                            key={p.id}
                            className="p-4 bg-neutral-950 rounded-xl border border-neutral-800 flex items-center gap-4 justify-between"
                          >
                            <div className="flex items-center gap-3 overflow-hidden">
                              <img src={p.image_url} className="w-12 h-12 object-cover rounded-lg bg-neutral-900 flex-shrink-0" />
                              <div className="truncate">
                                <p className="font-bold text-neutral-250 text-sm truncate">{p.title}</p>
                                <p className="text-[10px] text-neutral-500 uppercase tracking-wider">{p.client} • {p.category}</p>
                              </div>
                            </div>

                            <div className="flex items-center gap-1.5 flex-shrink-0">
                              <button
                                onClick={() => setEditPortfolioForm({
                                  id: p.id,
                                  title: p.title,
                                  category: p.category,
                                  image_url: p.image_url,
                                  client: p.client,
                                  year: p.year,
                                  description: p.description,
                                  link: p.link,
                                  featured: p.featured
                                })}
                                className="p-1.5 rounded bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white transition"
                                title="Edit item"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeletePortfolioItem(p.id)}
                                className="p-1.5 rounded bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-red-400 transition"
                                title="Hapus item"
                              >
                                <Trash className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                )}

                {/* 4. INCOMING MESSAGES VIEWER */}
                {activeAdminTab === 'messages' && (
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-xl font-extrabold text-white mb-1.5 flex items-center gap-2">
                        <span>Pesan Masuk Kolaborasi (Inbox)</span>
                        <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800/30">
                          {messages.length} Submissions
                        </span>
                      </h4>
                      <p className="text-xs text-neutral-400 leading-relaxed">
                        Berikut adalah daftar unit usaha atau perorangan yang mengirim pesan melalui formulir kontak. Seluruh pengiriman tersimpan secara solid di database Supabase atau LocalStorage.
                      </p>
                    </div>

                    {messages.length === 0 ? (
                      <div className="p-12 text-center border border-neutral-850 bg-neutral-950/20 rounded-2xl">
                        <Mail className="w-10 h-10 text-neutral-700 mx-auto mb-3" />
                        <p className="text-sm font-bold text-neutral-400 mb-1">Inbox Masih Kosong</p>
                        <p className="text-xs text-neutral-500">Belum ada mitra usaha yang mengirimkan formulir permohonan kolaborasi saat ini.</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {messages.map((msg) => (
                          <div 
                            key={msg.id}
                            className="p-6 bg-neutral-950/80 rounded-2xl border border-neutral-850 hover:border-neutral-750 transition-all text-left relative"
                          >
                            <button
                              onClick={() => handleDeleteMessage(msg.id)}
                              className="absolute top-4 right-4 p-1.5 rounded-lg bg-neutral-900 hover:bg-red-950/30 text-neutral-500 hover:text-red-400 transition cursor-pointer"
                              title="Delete Submission"
                            >
                              <Trash className="w-4 h-4" />
                            </button>

                            <div className="flex items-center gap-2.5 mb-4">
                              <div className="w-9 h-9 rounded-lg bg-cyan-950/50 flex items-center justify-center text-cyan-400 border border-cyan-800/30 font-bold text-sm uppercase">
                                {msg.name.charAt(0)}
                              </div>
                              <div>
                                <h5 className="font-bold text-white text-sm shrink">{msg.name}</h5>
                                <p className="text-[10px] text-neutral-500 font-mono mt-0.5">
                                  {msg.email}  {msg.company ? `• ${msg.company}` : ''}
                                </p>
                              </div>
                            </div>

                            <div className="border-t border-neutral-900 pt-3.5 space-y-2">
                              <p className="text-xs font-bold text-cyan-400 font-mono">
                                PERIHAL: {msg.subject}
                              </p>
                              <p className="text-sm text-neutral-300 leading-relaxed bg-neutral-900/60 p-4 rounded-xl border border-neutral-850 whitespace-pre-wrap">
                                {msg.message}
                              </p>
                              <div className="flex items-center gap-1 text-[10px] text-neutral-500 uppercase tracking-wider pl-1 font-mono pt-1">
                                <Calendar className="w-3.5 h-3.5" />
                                <span>Tercatat: {new Date(msg.created_at).toLocaleString('id-ID')}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* 5. TESTIMONIALS & CREDIT CONTROL */}
                {activeAdminTab === 'testimonials' && (
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-xl font-extrabold text-white mb-1.5">Kelola Testimoni Pelanggan</h4>
                      <p className="text-xs text-neutral-400">Sunting testimoni mitra usaha digital demi memperkuat kredibilitas PixelFrame Studio Indonesia.</p>
                    </div>

                    <div className="p-8 text-center border border-neutral-850 bg-neutral-950/20 rounded-2xl">
                      <Star className="w-10 h-10 text-amber-500 mx-auto mb-3" />
                      <p className="text-sm font-bold text-neutral-300 mb-1">Penyuntingan Testimonial Aktif</p>
                      <p className="text-xs text-neutral-500 leading-relaxed max-w-md mx-auto">
                        Untuk kustomisasi manual testimoni, Anda dapat melacak langsung tabel <code className="text-cyan-400 font-mono">testimonials</code> di dashboard Supabase atau menu local state di codebase.
                      </p>
                    </div>
                  </div>
                )}

              </div>
            </div>
            
            {/* Control Panel footer indicators */}
            <div className="px-6 py-3.5 bg-neutral-950 border-t border-neutral-800 flex items-center justify-between text-[11px] text-neutral-500">
              <span>PixelFrame App Engine v1.0 • Multi-Tenant Ready</span>
              <span className="font-mono">User: pixelframe.indonesia@gmail.com</span>
            </div>

          </div>
          )}
        </div>
      )}

    </div>
  );
}
