import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Types for PixelFrame Studio Database
export interface StudioInfo {
  id?: string;
  name: string;
  tagline: string;
  description: string;
  about_rich: string;
  location: string;
  email: string;
  phone: string;
  instagram: string;
  youtube: string;
  behance: string;
  dribbble: string;
}

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  icon: string; // lucide icon name
  price_range?: string;
}

export interface PortfolioItem {
  id: string;
  title: string;
  category: 'Branding' | 'Design Systems' | 'Digital Platforms' | 'Media Solutions' | 'Marketing';
  image_url: string;
  client: string;
  year: string;
  description: string;
  link?: string;
  featured: boolean;
}

export interface TestimonialItem {
  id: string;
  name: string;
  role: string;
  company: string;
  comment: string;
  rating: number;
  avatar_url: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  image_url: string;
  instagram?: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  company?: string;
  subject: string;
  message: string;
  created_at: string;
}

// Initial Data for pre-seeding
const DEFAULT_STUDIO_INFO: StudioInfo = {
  name: "PixelFrame Studio Indonesia",
  tagline: "BRAND. CONTENT. IMPACT.",
  description: "Crafting Visual Stories That Inspire & Accelerate Growth",
  about_rich: "Kami adalah rumah produksi kreatif dan studio desain terintegrasi yang berbasis di Jakarta, Indonesia. Kami memadukan seni bercerita visual dengan strategi performa bisnis untuk menciptakan brand identity, media sinematik, serta produk digital interaktif yang tidak hanya estetis namun juga berdampak nyata.",
  location: "Jakarta, Indonesia",
  email: "pixelframe.indonesia@gmail.com",
  phone: "+62 821-4455-8899",
  instagram: "https://instagram.com/pixelframe.id",
  youtube: "https://youtube.com/@pixelframestudio",
  behance: "https://behance.net/pixelframe_id",
  dribbble: "https://dribbble.com/pixelframe_id"
};

const DEFAULT_SERVICES: ServiceItem[] = [
  {
    id: "s1",
    title: "Creative Branding",
    description: "Membangun identitas merek yang otentik dan memorable di benak audiens, mulai dari logo hingga panduan brand book.",
    icon: "Palette"
  },
  {
    id: "s2",
    title: "Design Systems",
    description: "Merancang ekosistem desain yang konsisten, scalable, dan modern agar mempercepat proses pengembangan produk Anda.",
    icon: "Layers"
  },
  {
    id: "s3",
    title: "Marketing Strategies",
    description: "Merumuskan strategi pemasaran digital berbasis data guna mendorong pertumbuhan berkelanjutan dan konversi maksimal.",
    icon: "TrendingUp"
  },
  {
    id: "s4",
    title: "Digital Platforms",
    description: "Mengembangkan aplikasi web dan mobile yang responsif, berkinerja tinggi, serta ramah pengguna (exceptional UX).",
    icon: "Globe"
  },
  {
    id: "s5",
    title: "Media Solutions",
    description: "Memproduksi video komersial sinematik, materi promosi sosial, dan motion graphics kelas dunia yang bercerita.",
    icon: "Film"
  },
  {
    id: "s6",
    title: "Growth Acceleration",
    description: "Mengoptimalkan funnel pemasaran digital dari awareness hingga loyalitas pelanggan lewat kreativitas tanpa batas.",
    icon: "Flame"
  }
];

const DEFAULT_PORTFOLIO: PortfolioItem[] = [
  {
    id: "p1",
    title: "Rebranding Nusantara Coffee Co.",
    category: "Branding",
    image_url: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?q=80&w=1200&auto=format&fit=crop",
    client: "Nusantara Coffee Group",
    year: "2025",
    description: "Revitalisasi visual menyeluruh yang menggabungkan heritage Indonesia modern dengan kemasan ramah lingkungan, meningkatkan sales hingga 40%.",
    link: "https://nusantaracoffee.co",
    featured: true
  },
  {
    id: "p2",
    title: "Halaman App - Fintech Design System",
    category: "Design Systems",
    image_url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop",
    client: "PT Halaman Solusi Finansial",
    year: "2026",
    description: "Konsolidasi visual framework mencakup 200+ reusable UI component yang mempercepat deployment fitur hingga 3x lipat.",
    link: "https://halaman-fintech.id",
    featured: true
  },
  {
    id: "p3",
    title: "Simfoni Bumi - Video Campaign",
    category: "Media Solutions",
    image_url: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=1200&auto=format&fit=crop",
    client: "Lestari Foundation",
    year: "2025",
    description: "Serangkaian video dokumenter komersial yang menampilkan kisah pelestarian hutan Kalimantan. Menjangkau 2 juta+ pemirsa digital.",
    link: "https://youtube.com/watch?v=simfoni-bumi",
    featured: true
  },
  {
    id: "p4",
    title: "E-Commerce Pasar Lokal",
    category: "Digital Platforms",
    image_url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200&auto=format&fit=crop",
    client: "Kementerian Ekonomi Kreatif",
    year: "2026",
    description: "Platform web progresif (PWA) yang memberdayakan lebih dari 10.000 UMKM di seluruh Indonesia untuk berjualan go-digital.",
    link: "https://pasarlokal.go.id",
    featured: false
  },
  {
    id: "p5",
    title: "Social Media Kits - Toko Roti Wangi",
    category: "Marketing",
    image_url: "https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=1200&auto=format&fit=crop",
    client: "Wangi Bakery & Co.",
    year: "2025",
    description: "Desain feed Instagram tematik dan template interaktif TikTok yang meningkatkan organic footprint sebesar 250% dalam 2 bulan.",
    link: "https://instagram.com/wangibakery",
    featured: false
  }
];

const DEFAULT_TEAM: TeamMember[] = [
  {
    id: "t1",
    name: "Aria Satria",
    role: "Founder & Creative Director",
    image_url: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=600&auto=format&fit=crop",
    instagram: "https://instagram.com/ariasatria"
  },
  {
    id: "t2",
    name: "Rissa Amalia",
    role: "Lead UI/UX Architect",
    image_url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=600&auto=format&fit=crop",
    instagram: "https://instagram.com/rissa.amalia"
  },
  {
    id: "t3",
    name: "Bagas Yudha",
    role: "Lead Cinematographer & Motion Designer",
    image_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=600&auto=format&fit=crop",
    instagram: "https://instagram.com/bagasyudha"
  }
];

const DEFAULT_TESTIMONIALS: TestimonialItem[] = [
  {
    id: "m1",
    name: "Andi Wijaya",
    role: "CEO & Co-Founder",
    company: "Nusantara Coffee Co.",
    comment: "PixelFrame mengubah total pandangan kami tentang branding. Prosedur riset mendalam dan eksekusi visual mereka luar biasa keren serta mendongkrak penjualan cabang utama kami hingga berlipat ganda.",
    rating: 5,
    avatar_url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150&auto=format&fit=crop"
  },
  {
    id: "m2",
    name: "Citra Lestari",
    role: "Program Associate",
    company: "Lestari Foundation",
    comment: "Sangat profesional! Video kampanye 'Simfoni Bumi' dibuat dengan sentuhan sinematik yang menggugah hati emosional pemirsa. Sangat direkomendasikan untuk karya multimedia berkelas tinggi.",
    rating: 5,
    avatar_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop"
  },
  {
    id: "m3",
    name: "Zidan Permana",
    role: "VP of Product",
    company: "PT Halaman Solusi Finansial",
    comment: "Design system yang dirancang oleh tim PixelFrame sangat detail, terdokumentasi rapi, dan langsung bisa diintegrasikan dengan lancar ke codebase engineering kami. Menghemat ribuan jam timeline!",
    rating: 5,
    avatar_url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=150&auto=format&fit=crop"
  }
];

const DEFAULT_FAQ: FAQItem[] = [
  {
    id: "f1",
    question: "Apa itu PixelFrame Studio Indonesia?",
    answer: "PixelFrame Studio Indonesia adalah creative agency dan production house modern yang menyediakan layanan komprehensif mulai dari rebranding, pembuatan design system, strategi pemasaran kreatif, pengembangan aplikasi web/mobile, hingga media komersial sinematik."
  },
  {
    id: "f2",
    question: "Bagaimana cara memesan layanan atau menjalin kolaborasi?",
    answer: "Sangat mudah! Anda dapat mengisi langsung formulir kontak di bawah situs web ini dengan melampirkan email serta deskripsi singkat proyek Anda, atau bisa hubungi kami via WhatsApp dan email resmi kami."
  },
  {
    id: "f3",
    question: "Apakah PixelFrame melayani proyek di luar Jakarta?",
    answer: "Tentu saja! Kami melayani klien di seluruh wilayah Indonesia maupun jaringan global secara remote, dan siap melakukan syuting lapangan atau sesi workshop on-site jika diperlukan oleh proyek."
  },
  {
    id: "f4",
    question: "Apakah hasil portfolio di atas diperbarui secara realtime?",
    answer: "Ya, situs portfolio ini berbasis fullstack dynamic database. Setiap ada karya baru atau perubahan, tim kami memperbaruinya langsung melalui panel admin yang terintegrasi dengan database Supabase."
  }
];

// Supabase Configuration Store keys in LocalStorage
const SUPABASE_URL_KEY = 'pixelframe_supabase_url';
const SUPABASE_KEY_KEY = 'pixelframe_supabase_key';

export class DbManager {
  private supabase: SupabaseClient | null = null;
  private useSupabase: boolean = false;

  constructor() {
    this.initSupabase();
  }

  public initSupabase() {
    const url = localStorage.getItem(SUPABASE_URL_KEY) || (import.meta as any).env.VITE_SUPABASE_URL || '';
    const key = localStorage.getItem(SUPABASE_KEY_KEY) || (import.meta as any).env.VITE_SUPABASE_ANON_KEY || '';

    if (url && key) {
      try {
        this.supabase = createClient(url, key);
        this.useSupabase = true;
        console.log("Supabase Client initialized successfully.");
      } catch (e) {
        console.error("Failed to initialize Supabase client:", e);
        this.useSupabase = false;
        this.supabase = null;
      }
    } else {
      this.useSupabase = false;
      this.supabase = null;
    }
  }

  public isUsingSupabase(): boolean {
    return this.useSupabase;
  }

  public getSupabaseConfig() {
    return {
      url: localStorage.getItem(SUPABASE_URL_KEY) || '',
      key: localStorage.getItem(SUPABASE_KEY_KEY) || ''
    };
  }

  public saveSupabaseConfig(url: string, key: string) {
    if (url && key) {
      localStorage.setItem(SUPABASE_URL_KEY, url);
      localStorage.setItem(SUPABASE_KEY_KEY, key);
    } else {
      localStorage.removeItem(SUPABASE_URL_KEY);
      localStorage.removeItem(SUPABASE_KEY_KEY);
    }
    this.initSupabase();
  }

  // --- Local DB helper methods (acting as fallback or standard local dynamic database) ---
  private getLocal<T>(key: string, defaultValue: T): T {
    const val = localStorage.getItem(key);
    if (!val) {
      localStorage.setItem(key, JSON.stringify(defaultValue));
      return defaultValue;
    }
    try {
      return JSON.parse(val);
    } catch {
      return defaultValue;
    }
  }

  private setLocal<T>(key: string, value: T) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  // --- STUDIO INFO ACTIONS ---
  public async getStudioInfo(): Promise<StudioInfo> {
    if (this.useSupabase && this.supabase) {
      try {
        const { data, error } = await this.supabase.from('studio_info').select('*').single();
        if (!error && data) return data as StudioInfo;
        console.warn("Supabase query error or no data on studio_info, falling back to LocalStorage:", error);
      } catch (err) {
        console.error("Failed to fetch studio_info from Supabase:", err);
      }
    }
    return this.getLocal<StudioInfo>('pf_studio_info', DEFAULT_STUDIO_INFO);
  }

  public async updateStudioInfo(info: StudioInfo): Promise<StudioInfo> {
    if (this.useSupabase && this.supabase) {
      try {
        const { error } = await this.supabase.from('studio_info').upsert({ id: 'main', ...info });
        if (!error) return info;
        console.error("Supabase upsert error on studio_info:", error);
      } catch (err) {
        console.error("Failed to update studio_info in Supabase:", err);
      }
    }
    this.setLocal<StudioInfo>('pf_studio_info', info);
    return info;
  }

  // --- SERVICES ACTIONS ---
  public async getServices(): Promise<ServiceItem[]> {
    if (this.useSupabase && this.supabase) {
      try {
        const { data, error } = await this.supabase.from('services').select('*').order('id', { ascending: true });
        if (!error && data) return data as ServiceItem[];
        console.warn("Supabase error (services), falling back to LocalStorage:", error);
      } catch (err) {
        console.error("Failed to fetch services:", err);
      }
    }
    return this.getLocal<ServiceItem[]>('pf_services', DEFAULT_SERVICES);
  }

  public async updateServices(services: ServiceItem[]): Promise<ServiceItem[]> {
    if (this.useSupabase && this.supabase) {
      try {
        // Clear all then insert
        const { error: delError } = await this.supabase.from('services').delete().neq('id', 'dummy_prevent_empty');
        if (!delError) {
          const { error: insError } = await this.supabase.from('services').insert(services);
          if (!insError) return services;
          console.error("Supabase insert error (services):", insError);
        } else {
          console.error("Supabase delete error (services):", delError);
        }
      } catch (err) {
        console.error("Failed to sync services with Supabase:", err);
      }
    }
    this.setLocal<ServiceItem[]>('pf_services', services);
    return services;
  }

  // --- PORTFOLIO ACTIONS ---
  public async getPortfolio(): Promise<PortfolioItem[]> {
    if (this.useSupabase && this.supabase) {
      try {
        const { data, error } = await this.supabase.from('portfolios').select('*').order('year', { ascending: false });
        if (!error && data) return data as PortfolioItem[];
        console.warn("Supabase error (portfolios), falling back to LocalStorage:", error);
      } catch (err) {
        console.error("Failed to fetch portfolios:", err);
      }
    }
    return this.getLocal<PortfolioItem[]>('pf_portfolios', DEFAULT_PORTFOLIO);
  }

  public async savePortfolioItem(item: PortfolioItem): Promise<PortfolioItem> {
    if (this.useSupabase && this.supabase) {
      try {
        const { error } = await this.supabase.from('portfolios').upsert(item);
        if (!error) return item;
        console.error("Supabase upsert error (portfolio item):", error);
      } catch (err) {
        console.error("Failed to save portfolio item in Supabase:", err);
      }
    }
    const current = this.getLocal<PortfolioItem[]>('pf_portfolios', DEFAULT_PORTFOLIO);
    const index = current.findIndex(p => p.id === item.id);
    if (index >= 0) {
      current[index] = item;
    } else {
      current.push(item);
    }
    this.setLocal<PortfolioItem[]>('pf_portfolios', current);
    return item;
  }

  public async deletePortfolioItem(id: string): Promise<boolean> {
    if (this.useSupabase && this.supabase) {
      try {
        const { error } = await this.supabase.from('portfolios').delete().eq('id', id);
        if (!error) return true;
        console.error("Supabase delete error (portfolio item):", error);
      } catch (err) {
        console.error("Failed to delete portfolio item in Supabase:", err);
      }
    }
    const current = this.getLocal<PortfolioItem[]>('pf_portfolios', DEFAULT_PORTFOLIO);
    const filtered = current.filter(p => p.id !== id);
    this.setLocal<PortfolioItem[]>('pf_portfolios', filtered);
    return true;
  }

  // --- TEAM ACTIONS ---
  public async getTeam(): Promise<TeamMember[]> {
    if (this.useSupabase && this.supabase) {
      try {
        const { data, error } = await this.supabase.from('team').select('*');
        if (!error && data) return data as TeamMember[];
        console.warn("Supabase error (team), falling back to LocalStorage:", error);
      } catch (err) {
        console.error("Failed to fetch team members:", err);
      }
    }
    return this.getLocal<TeamMember[]>('pf_team', DEFAULT_TEAM);
  }

  public async saveTeamMember(member: TeamMember): Promise<TeamMember> {
    if (this.useSupabase && this.supabase) {
      try {
        const { error } = await this.supabase.from('team').upsert(member);
        if (!error) return member;
        console.error("Supabase upsert error (team member):", error);
      } catch (err) {
        console.error("Failed to save team member in Supabase:", err);
      }
    }
    const current = this.getLocal<TeamMember[]>('pf_team', DEFAULT_TEAM);
    const index = current.findIndex(t => t.id === member.id);
    if (index >= 0) {
      current[index] = member;
    } else {
      current.push(member);
    }
    this.setLocal<TeamMember[]>('pf_team', current);
    return member;
  }

  public async deleteTeamMember(id: string): Promise<boolean> {
    if (this.useSupabase && this.supabase) {
      try {
        const { error } = await this.supabase.from('team').delete().eq('id', id);
        if (!error) return true;
        console.error("Supabase delete error (team member):", error);
      } catch (err) {
        console.error("Failed to delete team member in Supabase:", err);
      }
    }
    const current = this.getLocal<TeamMember[]>('pf_team', DEFAULT_TEAM);
    const filtered = current.filter(t => t.id !== id);
    this.setLocal<TeamMember[]>('pf_team', filtered);
    return true;
  }

  // --- TESTIMONIAL ACTIONS ---
  public async getTestimonials(): Promise<TestimonialItem[]> {
    if (this.useSupabase && this.supabase) {
      try {
        const { data, error } = await this.supabase.from('testimonials').select('*');
        if (!error && data) return data as TestimonialItem[];
        console.warn("Supabase error (testimonials), falling back to LocalStorage:", error);
      } catch (err) {
        console.error("Failed to fetch testimonials:", err);
      }
    }
    return this.getLocal<TestimonialItem[]>('pf_testimonials', DEFAULT_TESTIMONIALS);
  }

  public async saveTestimonial(testi: TestimonialItem): Promise<TestimonialItem> {
    if (this.useSupabase && this.supabase) {
      try {
        const { error } = await this.supabase.from('testimonials').upsert(testi);
        if (!error) return testi;
        console.error("Supabase upsert error (testimonial):", error);
      } catch (err) {
        console.error("Failed to save testimonial in Supabase:", err);
      }
    }
    const current = this.getLocal<TestimonialItem[]>('pf_testimonials', DEFAULT_TESTIMONIALS);
    const index = current.findIndex(t => t.id === testi.id);
    if (index >= 0) {
      current[index] = testi;
    } else {
      current.push(testi);
    }
    this.setLocal<TestimonialItem[]>('pf_testimonials', current);
    return testi;
  }

  public async deleteTestimonial(id: string): Promise<boolean> {
    if (this.useSupabase && this.supabase) {
      try {
        const { error } = await this.supabase.from('testimonials').delete().eq('id', id);
        if (!error) return true;
        console.error("Supabase delete error (testimonial):", error);
      } catch (err) {
        console.error("Failed to delete testimonial in Supabase:", err);
      }
    }
    const current = this.getLocal<TestimonialItem[]>('pf_testimonials', DEFAULT_TESTIMONIALS);
    const filtered = current.filter(t => t.id !== id);
    this.setLocal<TestimonialItem[]>('pf_testimonials', filtered);
    return true;
  }

  // --- FAQS ACTIONS ---
  public async getFAQs(): Promise<FAQItem[]> {
    if (this.useSupabase && this.supabase) {
      try {
        const { data, error } = await this.supabase.from('faqs').select('*');
        if (!error && data) return data as FAQItem[];
        console.warn("Supabase error (faqs), falling back to LocalStorage:", error);
      } catch (err) {
        console.error("Failed to fetch FAQs:", err);
      }
    }
    return this.getLocal<FAQItem[]>('pf_faqs', DEFAULT_FAQ);
  }

  public async saveFAQItem(faq: FAQItem): Promise<FAQItem> {
    if (this.useSupabase && this.supabase) {
      try {
        const { error } = await this.supabase.from('faqs').upsert(faq);
        if (!error) return faq;
        console.error("Supabase upsert error (FAQ):", error);
      } catch (err) {
        console.error("Failed to save FAQ in Supabase:", err);
      }
    }
    const current = this.getLocal<FAQItem[]>('pf_faqs', DEFAULT_FAQ);
    const index = current.findIndex(f => f.id === faq.id);
    if (index >= 0) {
      current[index] = faq;
    } else {
      current.push(faq);
    }
    this.setLocal<FAQItem[]>('pf_faqs', current);
    return faq;
  }

  public async deleteFAQItem(id: string): Promise<boolean> {
    if (this.useSupabase && this.supabase) {
      try {
        const { error } = await this.supabase.from('faqs').delete().eq('id', id);
        if (!error) return true;
        console.error("Supabase delete error (FAQ):", error);
      } catch (err) {
        console.error("Failed to delete FAQ in Supabase:", err);
      }
    }
    const current = this.getLocal<FAQItem[]>('pf_faqs', DEFAULT_FAQ);
    const filtered = current.filter(f => f.id !== id);
    this.setLocal<FAQItem[]>('pf_faqs', filtered);
    return true;
  }

  // --- CONTACT MESSAGES ACTIONS ---
  public async getContactMessages(): Promise<ContactMessage[]> {
    if (this.useSupabase && this.supabase) {
      try {
        const { data, error } = await this.supabase.from('contact_messages').select('*').order('created_at', { ascending: false });
        if (!error && data) return data as ContactMessage[];
        console.warn("Supabase error (contact_messages), falling back to LocalStorage:", error);
      } catch (err) {
        console.error("Failed to fetch contact messages:", err);
      }
    }
    return this.getLocal<ContactMessage[]>('pf_contact_messages', []);
  }

  public async createContactMessage(msg: Omit<ContactMessage, 'id' | 'created_at'>): Promise<ContactMessage> {
    const newMsg: ContactMessage = {
      id: "msg_" + Math.random().toString(36).substr(2, 9),
      created_at: new Date().toISOString(),
      ...msg
    };

    if (this.useSupabase && this.supabase) {
      try {
        const { error } = await this.supabase.from('contact_messages').insert(newMsg);
        if (!error) return newMsg;
        console.error("Supabase insert error (contact message):", error);
      } catch (err) {
        console.error("Failed to create contact message in Supabase:", err);
      }
    }

    const current = this.getLocal<ContactMessage[]>('pf_contact_messages', []);
    current.unshift(newMsg);
    this.setLocal<ContactMessage[]>('pf_contact_messages', current);
    return newMsg;
  }

  public async deleteContactMessage(id: string): Promise<boolean> {
    if (this.useSupabase && this.supabase) {
      try {
        const { error } = await this.supabase.from('contact_messages').delete().eq('id', id);
        if (!error) return true;
        console.error("Supabase delete error (contact message):", error);
      } catch (err) {
        console.error("Failed to delete contact message in Supabase:", err);
      }
    }
    const current = this.getLocal<ContactMessage[]>('pf_contact_messages', []);
    const filtered = current.filter(m => m.id !== id);
    this.setLocal<ContactMessage[]>('pf_contact_messages', filtered);
    return true;
  }

  // --- SQL GENERATOR FOR SELF-SERVICE DEPLOYMENT ---
  public getSQLSchemaScript(): string {
    return `-- SQL SETUP Untuk database Supabase (PixelFrame Studio Indonesia)
-- Salin dan jalankan script ini di menu "SQL Editor" pada dashboard Supabase Anda.

-- 1. Tabel Studio Info (Tentang Kami & Biodata Utama)
CREATE TABLE IF NOT EXISTS public.studio_info (
  id TEXT PRIMARY KEY DEFAULT 'main',
  name TEXT NOT NULL,
  tagline TEXT,
  description TEXT,
  about_rich TEXT,
  location TEXT,
  email TEXT,
  phone TEXT,
  instagram TEXT,
  youtube TEXT,
  behance TEXT,
  dribbble TEXT
);

-- Isi profil default
INSERT INTO public.studio_info (id, name, tagline, description, about_rich, location, email, phone, instagram, youtube, behance, dribbble)
VALUES (
  'main',
  'PixelFrame Studio Indonesia',
  'BRAND. CONTENT. IMPACT.',
  'Crafting Visual Stories That Inspire & Accelerate Growth',
  'Kami adalah rumah produksi kreatif dan studio desain terintegrasi yang berbasis di Jakarta, Indonesia. Kami memadukan seni bercerita visual dengan strategi performa bisnis untuk menciptakan brand identity, media sinematik, serta produk digital interaktif yang tidak hanya estetis namun juga berdampak nyata.',
  'Jakarta, Indonesia',
  'pixelframe.indonesia@gmail.com',
  '+62 821-4455-8899',
  'https://instagram.com/pixelframe.id',
  'https://youtube.com/@pixelframestudio',
  'https://behance.net/pixelframe_id',
  'https://dribbble.com/pixelframe_id'
) ON CONFLICT (id) DO NOTHING;

-- 2. Tabel Layanan (Services)
CREATE TABLE IF NOT EXISTS public.services (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  icon TEXT
);

-- Isi default services
INSERT INTO public.services (id, title, description, icon) VALUES
('s1', 'Creative Branding', 'Membangun identitas merek yang otentik dan memorable di benak audiens, mulai dari logo hingga panduan brand book.', 'Palette'),
('s2', 'Design Systems', 'Merancang ekosistem desain yang konsisten, scalable, dan modern agar mempercepat proses pengembangan produk Anda.', 'Layers'),
('s3', 'Marketing Strategies', 'Merumuskan strategi pemasaran digital berbasis data guna mendorong pertumbuhan berkelanjutan dan konversi maksimal.', 'TrendingUp'),
('s4', 'Digital Platforms', 'Mengembangkan aplikasi web dan mobile yang responsif, berkinerja tinggi, serta ramah pengguna (exceptional UX).', 'Globe'),
('s5', 'Media Solutions', 'Memproduksi video komersial sinematik, materi promosi sosial, dan motion graphics kelas dunia yang bercerita.', 'Film'),
('s6', 'Growth Acceleration', 'Mengoptimalkan funnel pemasaran digital dari awareness hingga loyalitas pelanggan lewat kreativitas tanpa batas.', 'Flame')
ON CONFLICT (id) DO NOTHING;

-- 3. Tabel Portofolio (Portfolios)
CREATE TABLE IF NOT EXISTS public.portfolios (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  image_url TEXT NOT NULL,
  client TEXT NOT NULL,
  year TEXT NOT NULL,
  description TEXT,
  link TEXT,
  featured BOOLEAN DEFAULT false
);

-- Isi default portfolios
INSERT INTO public.portfolios (id, title, category, image_url, client, year, description, link, featured) VALUES
('p1', 'Rebranding Nusantara Coffee Co.', 'Branding', 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?q=80&w=1200&auto=format&fit=crop', 'Nusantara Coffee Group', '2025', 'Revitalisasi visual menyeluruh yang menggabungkan heritage Indonesia modern dengan kemasan ramah lingkungan, meningkatkan sales hingga 40%.', 'https://nusantaracoffee.co', true),
('p2', 'Halaman App - Fintech Design System', 'Design Systems', 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop', 'PT Halaman Solusi Finansial', '2026', 'Konsolidasi visual framework mencakup 200+ reusable UI component yang mempercepat deployment fitur hingga 3x lipat.', 'https://halaman-fintech.id', true),
('p3', 'Simfoni Bumi - Video Campaign', 'Media Solutions', 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=1200&auto=format&fit=crop', 'Lestari Foundation', '2025', 'Serangkaian video dokumenter komersial yang menampilkan kisah pelestarian hutan Kalimantan. Menjangkau 2 juta+ pemirsa digital.', 'https://youtube.com/watch?v=simfoni-bumi', true),
('p4', 'E-Commerce Pasar Lokal', 'Digital Platforms', 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200&auto=format&fit=crop', 'Kementerian Ekonomi Kreatif', '2026', 'Platform web progresif (PWA) yang memberdayakan lebih dari 10.000 UMKM di seluruh Indonesia untuk berjualan go-digital.', 'https://pasarlokal.go.id', false),
('p5', 'Social Media Kits - Toko Roti Wangi', 'Marketing', 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=1200&auto=format&fit=crop', 'Wangi Bakery & Co.', '2025', 'Desain feed Instagram tematik dan template interaktif TikTok yang meningkatkan organic footprint sebesar 250% dalam 2 bulan.', 'https://instagram.com/wangibakery', false)
ON CONFLICT (id) DO NOTHING;

-- 4. Tabel Tim (Team Members)
CREATE TABLE IF NOT EXISTS public.team (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  image_url TEXT,
  instagram TEXT
);

-- Isi default team
INSERT INTO public.team (id, name, role, image_url, instagram) VALUES
('t1', 'Aria Satria', 'Founder & Creative Director', 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=600&auto=format&fit=crop', 'https://instagram.com/ariasatria'),
('t2', 'Rissa Amalia', 'Lead UI/UX Architect', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=600&auto=format&fit=crop', 'https://instagram.com/rissa.amalia'),
('t3', 'Bagas Yudha', 'Lead Cinematographer & Motion Designer', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=600&auto=format&fit=crop', 'https://instagram.com/bagasyudha')
ON CONFLICT (id) DO NOTHING;

-- 5. Tabel Testimoni (Testimonials)
CREATE TABLE IF NOT EXISTS public.testimonials (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  company TEXT,
  comment TEXT,
  rating INTEGER DEFAULT 5,
  avatar_url TEXT
);

-- Isi default testimonials
INSERT INTO public.testimonials (id, name, role, company, comment, rating, avatar_url) VALUES
('m1', 'Andi Wijaya', 'CEO & Co-Founder', 'Nusantara Coffee Co.', 'PixelFrame mengubah total pandangan kami tentang branding. Prosedur riset mendalam dan eksekusi visual mereka luar biasa keren serta mendongkrak penjualan cabang utama kami hingga berlipat ganda.', 5, 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150&auto=format&fit=crop'),
('m2', 'Citra Lestari', 'Program Associate', 'Lestari Foundation', 'Sangat profesional! Video kampanye ''Simfoni Bumi'' dibuat dengan sentuhan sinematik yang menggugah hati emosional pemirsa. Sangat direkomendasikan untuk karya multimedia berkelas tinggi.', 5, 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop'),
('m3', 'Zidan Permana', 'VP of Product', 'PT Halaman Solusi Finansial', 'Design system yang dirancang oleh tim PixelFrame sangat detail, terdokumentasi rapi, dan langsung bisa diintegrasikan dengan lancar ke codebase engineering kami. Menghemat ribuan jam timeline!', 5, 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=150&auto=format&fit=crop')
ON CONFLICT (id) DO NOTHING;

-- 6. Tabel FAQs (Frequently Asked Questions)
CREATE TABLE IF NOT EXISTS public.faqs (
  id TEXT PRIMARY KEY,
  question TEXT NOT NULL,
  answer TEXT NOT NULL
);

-- Isi default FAQs
INSERT INTO public.faqs (id, question, answer) VALUES
('f1', 'Apa itu PixelFrame Studio Indonesia?', 'PixelFrame Studio Indonesia adalah creative agency dan production house modern yang menyediakan layanan komprehensif mulai dari rebranding, pembuatan design system, strategi pemasaran kreatif, pengembangan aplikasi web/mobile, hingga media komersial sinematik.'),
('f2', 'Bagaimana cara memesan layanan atau menjalin kolaborasi?', 'Sangat mudah! Anda dapat mengisi langsung formulir kontak di bawah situs web ini dengan melampirkan email serta deskripsi singkat proyek Anda, atau bisa hubungi kami via WhatsApp dan email resmi kami.'),
('f3', 'Apakah PixelFrame melayani proyek di luar Jakarta?', 'Tentu saja! Kami melayani klien di seluruh wilayah Indonesia maupun jaringan global secara remote, dan siap melakukan syuting lapangan atau sesi workshop on-site jika diperlukan oleh proyek.'),
('f4', 'Apakah hasil portfolio di atas diperbarui secara realtime?', 'Ya, situs portfolio ini berbasis fullstack dynamic database. Setiap ada karya baru atau perubahan, tim kami memperbaruinya langsung melalui panel admin yang terintegrasi dengan database Supabase.')
ON CONFLICT (id) DO NOTHING;

-- 7. Tabel Pesan Kontak (Contact Messages)
CREATE TABLE IF NOT EXISTS public.contact_messages (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT clock_timestamp()
);

-- AKTIFKAN ROW LEVEL SECURITY ATAU BUAT ACCESS RULES AGAR DAPAT DIAKSES TANPA AUTH (READ-ONLY public read, INSERT public contact)
ALTER TABLE public.studio_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- Buat Policy agar anonymous user bisa membaca (SELECT) data
CREATE POLICY "Allow public read studio_info" ON public.studio_info FOR SELECT USING (true);
CREATE POLICY "Allow public read services" ON public.services FOR SELECT USING (true);
CREATE POLICY "Allow public read portfolios" ON public.portfolios FOR SELECT USING (true);
CREATE POLICY "Allow public read team" ON public.team FOR SELECT USING (true);
CREATE POLICY "Allow public read testimonials" ON public.testimonials FOR SELECT USING (true);
CREATE POLICY "Allow public read faqs" ON public.faqs FOR SELECT USING (true);
CREATE POLICY "Allow public read contact_messages" ON public.contact_messages FOR SELECT USING (true);

-- Buat Policy agar anonymous user bisa mengisi (INSERT) pesan kontak
CREATE POLICY "Allow public insert messages" ON public.contact_messages FOR INSERT WITH CHECK (true);

-- Buat Policy agar full write diizinkan (Lakukan RLS bypass pada admin atau gunakan supabase service_role)
-- Untuk kemudahan admin sederhana dari web (jika tidak menggunakan AUTH JWT):
CREATE POLICY "Allow public write on everything for demo" ON public.studio_info FOR ALL USING (true);
CREATE POLICY "Allow public write on services for demo" ON public.services FOR ALL USING (true);
CREATE POLICY "Allow public write on portfolios for demo" ON public.portfolios FOR ALL USING (true);
CREATE POLICY "Allow public write on team for demo" ON public.team FOR ALL USING (true);
CREATE POLICY "Allow public write on testimonials for demo" ON public.testimonials FOR ALL USING (true);
CREATE POLICY "Allow public write on faqs for demo" ON public.faqs FOR ALL USING (true);
CREATE POLICY "Allow public write on contact_messages for demo" ON public.contact_messages FOR ALL USING (true);
`;
  }
}

export const db = new DbManager();
