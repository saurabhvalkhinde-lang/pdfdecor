/**
 * Home.tsx — PDFDecor Landing Page v5
 * SaaS-style hero, animated carousel, document cards, template gallery,
 * trust section, stats, FAQ, Free vs Pro comparison, SEO content.
 */
import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router';
import {
  FileText, Award, Receipt, FileSpreadsheet, Sparkles, Check, Zap,
  Download, Shield, FileCheck, Briefcase, Users, CreditCard, Ticket,
  Crown, Star, ArrowRight, Play, ChevronLeft, ChevronRight, Globe,
  Building2, TrendingUp, Clock, Layers, Lock, Eye, BarChart3,
  Quote, CheckCircle2, Cpu, Smartphone, Printer
} from 'lucide-react';
import { AdBanner } from '../components/AdBanner';
import { useAuth } from '../contexts/AuthContext';

// ─── Document Types ─────────────────────────────────────────────────────────
const DOC_TYPES = [
  {
    icon: FileText, title: 'Invoice', description: 'GST invoices with UPI QR codes for instant payment',
    path: '/invoice', color: 'from-blue-500 to-blue-600', badge: 'Popular', templates: 5,
    keywords: 'GST Invoice, UPI QR, Auto-calculation',
  },
  {
    icon: Receipt, title: 'Bill', description: 'Itemized bills for products and services',
    path: '/bill', color: 'from-orange-500 to-orange-600', badge: null, templates: 5,
    keywords: 'Retail, Service, GST Bill',
  },
  {
    icon: FileCheck, title: 'Receipt', description: 'Payment receipts for completed transactions',
    path: '/receipt', color: 'from-green-500 to-green-600', badge: null, templates: 5,
    keywords: 'Payment, Acknowledgment',
  },
  {
    icon: FileSpreadsheet, title: 'Quotation', description: 'Detailed cost quotations for clients',
    path: '/quotation', color: 'from-purple-500 to-purple-600', badge: null, templates: 5,
    keywords: 'Cost Estimate, Proposal',
  },
  {
    icon: FileText, title: 'Estimate', description: 'Project estimates and cost breakdowns',
    path: '/estimate', color: 'from-yellow-500 to-yellow-600', badge: null, templates: 5,
    keywords: 'Project Cost, Breakdown',
  },
  {
    icon: Award, title: 'Certificate', description: 'Professional certificates for any achievement',
    path: '/certificate', color: 'from-pink-500 to-pink-600', badge: 'Bulk Pro', templates: 5,
    keywords: 'Achievement, Appreciation, Training',
  },
  {
    icon: Briefcase, title: 'Offer Letter', description: 'Formal job offer letters with HR details',
    path: '/offer-letter', color: 'from-indigo-500 to-indigo-600', badge: null, templates: 5,
    keywords: 'HR, Recruitment, Joining',
  },
  {
    icon: Users, title: 'Appointment Letter', description: 'Appointment letters for new employees',
    path: '/appointment-letter', color: 'from-cyan-500 to-cyan-600', badge: null, templates: 5,
    keywords: 'Appointment, Employee',
  },
  {
    icon: CreditCard, title: 'ID Card', description: 'Employee and student ID cards',
    path: '/id-card', color: 'from-red-500 to-red-600', badge: null, templates: 5,
    keywords: 'Employee, Student, Identity',
  },
  {
    icon: Ticket, title: 'Event Pass', description: 'Event passes with QR code access control',
    path: '/event-pass', color: 'from-teal-500 to-teal-600', badge: null, templates: 5,
    keywords: 'Event, Entry Pass, QR Code',
  },
];

// ─── Carousel Slides ─────────────────────────────────────────────────────────
const CAROUSEL_SLIDES = [
  {
    type: 'invoice',
    title: 'Professional Invoice',
    subtitle: 'GST compliant with UPI QR',
    color: 'from-blue-600 to-blue-800',
    accent: '#3B82F6',
    preview: (
      <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', minWidth: '220px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', fontSize: '11px', fontFamily: 'Arial, sans-serif' }}>
        <div style={{ borderBottom: '3px solid #2563eb', paddingBottom: '10px', marginBottom: '10px' }}>
          <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#2563eb' }}>INVOICE</div>
          <div style={{ color: '#6b7280', marginTop: '4px' }}>#INV-001 · 01 Jan 2025</div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
          <div><div style={{ fontWeight: 'bold', color: '#111' }}>Acme Pvt Ltd</div><div style={{ color: '#6b7280' }}>Mumbai, MH</div></div>
          <div style={{ textAlign: 'right' }}><div style={{ fontWeight: 'bold', color: '#111' }}>Client Name</div><div style={{ color: '#6b7280' }}>Delhi</div></div>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '10px' }}>
          <thead><tr style={{ background: '#eff6ff' }}>
            <th style={{ padding: '4px', textAlign: 'left', color: '#374151' }}>Item</th>
            <th style={{ padding: '4px', textAlign: 'right', color: '#374151' }}>Amt</th>
          </tr></thead>
          <tbody>
            <tr><td style={{ padding: '3px 4px' }}>Service A</td><td style={{ padding: '3px 4px', textAlign: 'right' }}>₹5,000</td></tr>
            <tr><td style={{ padding: '3px 4px' }}>Service B</td><td style={{ padding: '3px 4px', textAlign: 'right' }}>₹3,000</td></tr>
          </tbody>
        </table>
        <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#6b7280' }}>Subtotal</span><span>₹8,000</span></div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#6b7280' }}>GST 18%</span><span>₹1,440</span></div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '13px', color: '#2563eb', marginTop: '4px' }}>
            <span>Total</span><span>₹9,440</span>
          </div>
        </div>
      </div>
    ),
  },
  {
    type: 'certificate',
    title: 'Achievement Certificate',
    subtitle: 'Premium designs with bulk generation',
    color: 'from-pink-600 to-pink-800',
    accent: '#EC4899',
    preview: (
      <div style={{ background: 'linear-gradient(135deg, #fdf2f8, #fce7f3)', padding: '20px', borderRadius: '8px', minWidth: '220px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', border: '2px solid #f9a8d4', textAlign: 'center', fontFamily: 'Georgia, serif' }}>
        <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#9d174d', marginBottom: '6px' }}>CERTIFICATE</div>
        <div style={{ fontSize: '11px', color: '#6b7280', marginBottom: '10px' }}>of Achievement</div>
        <div style={{ borderTop: '1px solid #f9a8d4', borderBottom: '1px solid #f9a8d4', padding: '8px 0', margin: '8px 0' }}>
          <div style={{ fontStyle: 'italic', color: '#374151', marginBottom: '4px', fontSize: '11px' }}>This is to certify that</div>
          <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#9d174d' }}>Rahul Sharma</div>
        </div>
        <div style={{ fontSize: '10px', color: '#6b7280', marginTop: '8px' }}>has successfully completed the program</div>
        <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'space-around', fontSize: '9px', color: '#9ca3af' }}>
          <span>____<br/>Director</span><span>____<br/>Date</span>
        </div>
      </div>
    ),
  },
  {
    type: 'id-card',
    title: 'Employee ID Card',
    subtitle: 'With barcode and photo support',
    color: 'from-red-600 to-red-800',
    accent: '#EF4444',
    preview: (
      <div style={{ background: 'linear-gradient(180deg, #1e3a8a 0%, #1e40af 40%, #fff 40%)', padding: '0', borderRadius: '10px', minWidth: '160px', maxWidth: '160px', boxShadow: '0 4px 20px rgba(0,0,0,0.2)', overflow: 'hidden', fontFamily: 'Arial, sans-serif' }}>
        <div style={{ padding: '14px', textAlign: 'center' }}>
          <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#fff' }}>Acme Corp</div>
          <div style={{ width: '48px', height: '48px', background: '#93c5fd', borderRadius: '50%', margin: '8px auto', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>👤</div>
        </div>
        <div style={{ background: '#fff', padding: '10px', textAlign: 'center' }}>
          <div style={{ fontWeight: 'bold', color: '#1e3a8a', fontSize: '12px' }}>Priya Mehta</div>
          <div style={{ color: '#6b7280', fontSize: '10px', margin: '2px 0' }}>Software Engineer</div>
          <div style={{ color: '#6b7280', fontSize: '9px' }}>EMP-2024-001</div>
          <div style={{ background: '#f3f4f6', borderRadius: '4px', padding: '4px', marginTop: '6px', fontFamily: 'monospace', fontSize: '8px', letterSpacing: '2px', color: '#374151' }}>
            ||||| |||| |||
          </div>
        </div>
      </div>
    ),
  },
  {
    type: 'event-pass',
    title: 'Event Pass',
    subtitle: 'QR-secured access passes',
    color: 'from-teal-600 to-teal-800',
    accent: '#14B8A6',
    preview: (
      <div style={{ background: 'linear-gradient(135deg, #0d9488, #0f766e)', padding: '20px', borderRadius: '10px', minWidth: '200px', boxShadow: '0 4px 20px rgba(0,0,0,0.2)', color: '#fff', fontFamily: 'Arial, sans-serif' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ fontSize: '9px', textTransform: 'uppercase', letterSpacing: '2px', opacity: 0.7 }}>Event Pass</div>
            <div style={{ fontSize: '16px', fontWeight: 'bold', marginTop: '4px' }}>TechConf 2025</div>
            <div style={{ fontSize: '10px', opacity: 0.8, marginTop: '4px' }}>Jan 15–16 · Mumbai</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.2)', borderRadius: '6px', padding: '8px', fontSize: '11px', textAlign: 'center' }}>
            <div style={{ fontFamily: 'monospace', fontSize: '8px' }}>█▀▀▄<br/>█  █<br/>▄▀▀█</div>
          </div>
        </div>
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.3)', marginTop: '12px', paddingTop: '10px' }}>
          <div style={{ fontSize: '11px', opacity: 0.8 }}>Attendee: Amit Kumar</div>
          <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: '20px', padding: '3px 10px', marginTop: '6px', fontSize: '10px', display: 'inline-block' }}>
            VIP · #EP-001
          </div>
        </div>
      </div>
    ),
  },
];

// ─── Testimonials ─────────────────────────────────────────────────────────────
const TESTIMONIALS = [
  { name: 'Rajesh Patel', role: 'Shop Owner, Ahmedabad', text: 'I create 20+ invoices daily. PDFDecor saves me 2 hours every day. The GST calculation is perfect!', rating: 5, avatar: 'RP' },
  { name: 'Sneha Kulkarni', role: 'HR Manager, Pune', text: 'Generated 200 certificates in bulk for our training program. The Pro plan paid for itself in one day!', rating: 5, avatar: 'SK' },
  { name: 'Amit Verma', role: 'Freelancer, Delhi', text: 'Clean, professional invoices with UPI QR codes. Clients pay faster now. Best free tool for freelancers.', rating: 5, avatar: 'AV' },
  { name: 'Priya Sharma', role: 'Event Organizer, Mumbai', text: 'Bulk event passes with QR codes saved us hours of manual work. The templates look very premium!', rating: 5, avatar: 'PS' },
  { name: 'Deepak Nair', role: 'CA, Kochi', text: 'GST compliance, CGST/SGST split, and proper number formatting — this tool knows Indian business needs.', rating: 5, avatar: 'DN' },
  { name: 'Meera Joshi', role: 'School Principal, Nagpur', text: 'We use PDFDecor for all appointment letters, ID cards, and certificates. Completely replaced our old Word templates.', rating: 5, avatar: 'MJ' },
];

// ─── Stats ─────────────────────────────────────────────────────────────────────
const STATS = [
  { value: '5 Lakh+', label: 'PDFs Generated', icon: FileText, color: 'text-blue-600' },
  { value: '50K+', label: 'Happy Users', icon: Users, color: 'text-green-600' },
  { value: '10', label: 'Document Types', icon: Layers, color: 'text-purple-600' },
  { value: '100%', label: 'Free to Start', icon: CheckCircle2, color: 'text-orange-600' },
];

// ─── How It Works ──────────────────────────────────────────────────────────────
const HOW_IT_WORKS = [
  { step: '01', icon: FileText, title: 'Choose Document Type', desc: 'Pick from 10 professional document categories — Invoice, Certificate, ID Card, Event Pass and more.', color: 'from-blue-500 to-blue-600' },
  { step: '02', icon: Eye, title: 'Select a Template', desc: 'Browse 5 unique templates per document type. Free users get 3; Pro unlocks all 5 with exclusive premium designs.', color: 'from-purple-500 to-purple-600' },
  { step: '03', icon: Cpu, title: 'Fill Your Details', desc: 'Enter your business and client information. Pro users get instant autofill from Business Profile.', color: 'from-pink-500 to-pink-600' },
  { step: '04', icon: Download, title: 'Download & Share', desc: 'Download high-resolution A4 PDF. Share via WhatsApp or email in one click.', color: 'from-green-500 to-green-600' },
];

// ─── Features ──────────────────────────────────────────────────────────────────
const FEATURES = [
  { icon: Zap, color: 'from-blue-500 to-blue-600', title: 'Lightning Fast', desc: 'Generate print-ready PDFs in under 3 seconds with our optimized html2canvas + jsPDF engine.' },
  { icon: Shield, color: 'from-green-500 to-green-600', title: 'GST Compliant', desc: 'Full GST support: GSTIN, CGST/SGST/IGST split, auto-calculation, and Indian number formatting.' },
  { icon: Download, color: 'from-purple-500 to-purple-600', title: 'Multiple Export Options', desc: 'Download PDF, share via WhatsApp with a formatted message, send by email — all built-in.' },
  { icon: Crown, color: 'from-yellow-500 to-yellow-600', title: 'Pro Features', desc: 'Business profile autofill, PDF history, bulk certificates, custom logo, branding, no watermark.' },
  { icon: Smartphone, color: 'from-pink-500 to-pink-600', title: 'Mobile Friendly', desc: 'Fully responsive design works perfectly on phones, tablets, and desktops — any browser.' },
  { icon: Globe, color: 'from-teal-500 to-teal-600', title: 'Multi-Language', desc: 'Interface available in English, Hindi (हिंदी), and Marathi (मराठी) for regional users.' },
  { icon: Printer, color: 'from-orange-500 to-orange-600', title: 'Print Ready', desc: 'A4 format, high-resolution 2× rendering, proper margins — ready for office printers.' },
  { icon: BarChart3, color: 'from-indigo-500 to-indigo-600', title: 'Analytics Dashboard', desc: 'Pro users get a full analytics dashboard tracking PDF generation by type, template usage, and more.' },
];

// ─── Template Gallery ─────────────────────────────────────────────────────────
const TEMPLATE_GALLERY = [
  { name: 'Modern Blue Invoice', type: 'Invoice', path: '/invoice', color: '#2563eb', locked: false },
  { name: 'Classic Dark Invoice', type: 'Invoice', path: '/invoice', color: '#1f2937', locked: false },
  { name: 'Minimal Green Invoice', type: 'Invoice', path: '/invoice', color: '#059669', locked: false },
  { name: 'Corporate Invoice', type: 'Invoice', path: '/invoice', color: '#7c3aed', locked: true },
  { name: 'Executive Invoice', type: 'Invoice', path: '/invoice', color: '#dc2626', locked: true },
  { name: 'Elegant Certificate', type: 'Certificate', path: '/certificate', color: '#be185d', locked: false },
  { name: 'Gold Border Certificate', type: 'Certificate', path: '/certificate', color: '#b45309', locked: false },
  { name: 'Premium Certificate', type: 'Certificate', path: '/certificate', color: '#7c3aed', locked: true },
  { name: 'Corporate ID Card', type: 'ID Card', path: '/id-card', color: '#1e3a8a', locked: false },
  { name: 'Modern ID Card', type: 'ID Card', path: '/id-card', color: '#065f46', locked: true },
  { name: 'Teal Event Pass', type: 'Event Pass', path: '/event-pass', color: '#0d9488', locked: false },
  { name: 'Dark Event Pass', type: 'Event Pass', path: '/event-pass', color: '#1e293b', locked: true },
];

// ─── FAQs ──────────────────────────────────────────────────────────────────────
const FAQS = [
  { q: 'Is PDFDecor free to use?', a: 'Yes! All 10 document types are completely free with unlimited PDF generation. Free PDFs include a small watermark. Upgrade to Pro (₹249/month) to remove watermark and access premium features.' },
  { q: 'Do I need to sign up to use PDFDecor?', a: 'No signup required for free use. Create PDFs instantly without any registration. Login is only required to access Pro features like PDF history, business profile, and bulk generation.' },
  { q: 'What is included in the Pro plan?', a: 'Pro plan removes all watermarks and ads, enables business profile auto-fill across all documents, PDF history with re-edit, custom invoice numbering, bulk certificate & event pass generation from CSV/Excel, ZIP download, custom logo, brand colors, and priority rendering.' },
  { q: 'Does PDFDecor support GST invoicing?', a: 'Yes! All financial documents support GSTIN fields, customizable tax rates, automatic CGST/SGST/IGST breakdown, and are fully GST-compliant for Indian businesses.' },
  { q: 'Can I generate certificates in bulk?', a: 'Yes, bulk certificate generation is a Pro feature. Upload a CSV/Excel file with recipient names and details, configure your template, and download hundreds of certificates as a ZIP file in minutes.' },
  { q: 'What languages does PDFDecor support?', a: 'The interface supports English, Hindi (हिंदी), and Marathi (मराठी). You can switch languages using the selector in the top navigation bar.' },
  { q: 'How does the UPI QR code work in invoices?', a: 'Enter your UPI ID in the invoice form. PDFDecor automatically generates a QR code that clients can scan with any UPI app (PhonePe, GPay, Paytm) to pay the exact invoice amount directly.' },
  { q: 'Is my data safe? Do you store my information?', a: 'PDFDecor stores data only in your browser\'s localStorage. Your business and client information never leaves your device on the Free plan. Pro users\' data is also stored locally with optional cloud sync coming soon.' },
];

// ─── Component ─────────────────────────────────────────────────────────────────
export function Home() {
  const { isPro } = useAuth();
  const [carouselIdx, setCarouselIdx] = useState(0);
  const [testimonialIdx, setTestimonialIdx] = useState(0);
  const [activeCategory, setActiveCategory] = useState('Invoice');
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const carouselRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-advance carousel
  useEffect(() => {
    carouselRef.current = setInterval(() => {
      setCarouselIdx(i => (i + 1) % CAROUSEL_SLIDES.length);
    }, 3500);
    return () => { if (carouselRef.current) clearInterval(carouselRef.current); };
  }, []);

  // Auto-advance testimonials
  useEffect(() => {
    const t = setInterval(() => setTestimonialIdx(i => (i + 1) % TESTIMONIALS.length), 4000);
    return () => clearInterval(t);
  }, []);

  const slide = CAROUSEL_SLIDES[carouselIdx];
  const testimonial = TESTIMONIALS[testimonialIdx];
  const galleryItems = TEMPLATE_GALLERY.filter(t => t.type === activeCategory);
  const categories = [...new Set(TEMPLATE_GALLERY.map(t => t.type))];

  return (
    <div className="max-w-7xl mx-auto">
      <AdBanner position="top" />

      {/* ── Hero Section ──────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white px-6 py-16 md:py-20 mb-14 shadow-2xl">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -right-20 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: Copy */}
          <div>
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 backdrop-blur-sm text-blue-200 px-4 py-1.5 rounded-full text-sm font-medium mb-6">
              <Sparkles className="h-4 w-4 text-yellow-400" />
              India's #1 Free PDF Generator for Businesses
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4">
              Create Professional<br />
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Documents in Seconds
              </span>
            </h1>

            <p className="text-lg text-blue-100/80 mb-8 max-w-lg leading-relaxed">
              Free online PDF generator for invoices, certificates, quotations, bills, ID cards & more.
              <span className="font-semibold text-white"> 10 document types · 5 templates each · GST ready · UPI QR.</span>
            </p>

            <div className="flex flex-wrap gap-3 mb-8">
              <Link to="/invoice" className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-semibold transition-all hover:shadow-lg hover:shadow-blue-500/30 text-sm">
                <FileText className="h-4 w-4" /> Generate Invoice
                <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
              <Link to="/certificate" className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white px-6 py-3 rounded-xl font-semibold transition-all text-sm backdrop-blur-sm">
                <Eye className="h-4 w-4" /> View Templates
              </Link>
              <Link to="/pricing" className="flex items-center gap-2 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-white px-6 py-3 rounded-xl font-semibold transition-all text-sm shadow-lg">
                <Crown className="h-4 w-4" /> View Pro Plans
              </Link>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap gap-4">
              {[
                { icon: '✅', text: 'No signup required' },
                { icon: '🔒', text: 'Data stays on device' },
                { icon: '📱', text: 'Mobile friendly' },
              ].map(b => (
                <div key={b.text} className="flex items-center gap-1.5 text-sm text-blue-200/70">
                  <span>{b.icon}</span> {b.text}
                </div>
              ))}
            </div>
          </div>

          {/* Right: Animated Template Carousel */}
          <div className="relative flex flex-col items-center">
            <div className="relative">
              {/* Glow effect */}
              <div
                className="absolute inset-0 blur-2xl opacity-30 rounded-3xl"
                style={{ background: `linear-gradient(135deg, ${slide.accent}, transparent)` }}
              />

              {/* Card */}
              <div className="relative bg-white/5 border border-white/10 backdrop-blur-sm rounded-2xl p-6 shadow-2xl">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="text-xs text-blue-300 uppercase tracking-widest mb-1">Template Preview</div>
                    <div className="font-bold text-white text-lg">{slide.title}</div>
                    <div className="text-blue-200/70 text-sm">{slide.subtitle}</div>
                  </div>
                  <div className={`bg-gradient-to-br ${slide.color} p-2.5 rounded-xl`}>
                    <Play className="h-5 w-5 text-white" />
                  </div>
                </div>

                {/* Template preview */}
                <div className="flex justify-center py-2 overflow-hidden" style={{ maxHeight: '220px' }}>
                  <div style={{ transform: 'scale(0.75)', transformOrigin: 'top center' }}>
                    {slide.preview}
                  </div>
                </div>
              </div>
            </div>

            {/* Carousel controls */}
            <div className="flex items-center gap-3 mt-4">
              <button
                onClick={() => setCarouselIdx(i => (i - 1 + CAROUSEL_SLIDES.length) % CAROUSEL_SLIDES.length)}
                className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
              >
                <ChevronLeft className="h-4 w-4 text-white" />
              </button>
              {CAROUSEL_SLIDES.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCarouselIdx(i)}
                  className={`rounded-full transition-all ${i === carouselIdx ? 'w-6 h-2 bg-blue-400' : 'w-2 h-2 bg-white/30'}`}
                />
              ))}
              <button
                onClick={() => setCarouselIdx(i => (i + 1) % CAROUSEL_SLIDES.length)}
                className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
              >
                <ChevronRight className="h-4 w-4 text-white" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats ─────────────────────────────────────────────────────────── */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-14">
        {STATS.map((s, i) => (
          <div key={i} className="bg-white rounded-2xl border border-gray-100 p-6 text-center shadow-sm hover:shadow-md transition-shadow">
            <s.icon className={`h-8 w-8 ${s.color} mx-auto mb-3`} />
            <div className="text-3xl font-bold text-gray-900 mb-1">{s.value}</div>
            <div className="text-sm text-gray-500">{s.label}</div>
          </div>
        ))}
      </section>

      {/* ── Document Category Cards ───────────────────────────────────────── */}
      <section className="mb-14">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Choose Your Document Type</h2>
          <p className="text-gray-500 text-lg">10 professional document types · 5 templates each · GST ready</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {DOC_TYPES.map((doc) => (
            <Link
              key={doc.path}
              to={doc.path}
              className="group relative bg-white rounded-2xl border-2 border-gray-100 p-5 hover:shadow-xl hover:border-gray-200 transition-all hover:-translate-y-2 cursor-pointer"
            >
              {doc.badge && (
                <span className="absolute -top-2.5 -right-2.5 bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md">
                  {doc.badge}
                </span>
              )}
              <div className={`bg-gradient-to-br ${doc.color} p-3 rounded-xl text-white w-fit mb-3 group-hover:scale-110 transition-transform shadow-lg`}>
                <doc.icon className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-gray-900 mb-1 text-sm group-hover:text-blue-600 transition-colors">{doc.title}</h3>
              <p className="text-xs text-gray-400 leading-relaxed mb-2">{doc.description}</p>
              <div className="flex items-center gap-1 text-[10px] text-gray-400">
                <Layers className="h-3 w-3" />
                <span>{doc.templates} templates</span>
              </div>
              <div className="mt-2 flex flex-wrap gap-1">
                {doc.keywords.split(', ').slice(0, 2).map(kw => (
                  <span key={kw} className="text-[9px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-full">{kw}</span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Template Preview Gallery ──────────────────────────────────────── */}
      <section className="mb-14">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Template Gallery</h2>
          <p className="text-gray-500">Click any template to open the live editor</p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-6">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                activeCategory === cat
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {galleryItems.map((tmpl, i) => (
            <Link
              key={i}
              to={tmpl.path}
              className="group relative bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all hover:-translate-y-1"
            >
              {/* Color preview */}
              <div
                className="h-32 relative overflow-hidden"
                style={{ background: `linear-gradient(135deg, ${tmpl.color}22, ${tmpl.color}44)` }}
              >
                <div
                  className="absolute top-4 left-4 right-4 bg-white rounded-lg shadow-md p-3"
                  style={{ borderTop: `3px solid ${tmpl.color}` }}
                >
                  <div className="h-2 rounded bg-current mb-1.5 w-3/4" style={{ color: tmpl.color, background: tmpl.color }} />
                  <div className="h-1.5 rounded bg-gray-200 mb-1 w-full" />
                  <div className="h-1.5 rounded bg-gray-200 mb-1 w-5/6" />
                  <div className="h-1.5 rounded bg-gray-100 w-2/3" />
                </div>
                {tmpl.locked && (
                  <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="flex flex-col items-center gap-1 text-white">
                      <Lock className="h-5 w-5" />
                      <span className="text-xs font-bold">Pro Template</span>
                    </div>
                  </div>
                )}
              </div>
              <div className="p-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-gray-800">{tmpl.name}</span>
                  {tmpl.locked ? (
                    <span className="flex items-center gap-0.5 text-[10px] bg-yellow-100 text-yellow-700 px-1.5 py-0.5 rounded-full font-bold">
                      <Crown className="h-2.5 w-2.5" /> PRO
                    </span>
                  ) : (
                    <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full font-medium">Free</span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-6">
          <Link
            to="/certificate"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold text-sm border border-blue-200 hover:border-blue-400 px-5 py-2 rounded-xl transition-all"
          >
            Explore All Templates <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* ── How It Works ──────────────────────────────────────────────────── */}
      <section className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-3xl p-8 md:p-12 border border-blue-100 mb-14">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">How It Works</h2>
          <p className="text-gray-500">Create your first professional PDF in under 2 minutes</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {HOW_IT_WORKS.map((step, i) => (
            <div key={i} className="relative">
              {i < HOW_IT_WORKS.length - 1 && (
                <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-gray-200 to-transparent z-0" />
              )}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center relative z-10">
                <div className="text-xs font-bold text-gray-400 mb-3 tracking-widest">{step.step}</div>
                <div className={`bg-gradient-to-br ${step.color} p-3.5 rounded-xl text-white w-fit mx-auto mb-4 shadow-lg`}>
                  <step.icon className="h-6 w-6" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2 text-sm">{step.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features Grid ─────────────────────────────────────────────────── */}
      <section className="mb-14">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Everything You Need</h2>
          <p className="text-gray-500">Built specifically for Indian businesses, freelancers & MSMEs</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {FEATURES.map((f, i) => (
            <div key={i} className={`bg-gradient-to-br ${f.color} text-white rounded-2xl p-6 hover:scale-105 transition-transform cursor-default`}>
              <f.icon className="h-10 w-10 mb-3 opacity-90" />
              <h3 className="text-base font-bold mb-2">{f.title}</h3>
              <p className="text-white/75 text-xs leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Free vs Pro Comparison ────────────────────────────────────────── */}
      <section className="bg-white rounded-3xl border-2 border-gray-100 p-8 md:p-12 mb-14 shadow-sm">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Free vs Pro</h2>
          <p className="text-gray-500">Start free, upgrade when you need more power</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* Free */}
          <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-xl font-bold text-gray-700">Free Plan</h3>
              <span className="text-2xl font-bold text-gray-900">₹0</span>
            </div>
            <ul className="space-y-2.5 mb-6">
              {[
                'All 10 document types', 'Unlimited PDF generation', '3 templates per type',
                'UPI QR for invoices', 'GST calculation', 'WhatsApp & email share', 'Mobile responsive',
              ].map(f => (
                <li key={f} className="flex items-center gap-2.5 text-sm text-gray-700">
                  <Check className="h-4 w-4 text-green-500 flex-shrink-0" /> {f}
                </li>
              ))}
              {['Watermark on PDFs', 'Ads displayed', 'No PDF history', 'No business autofill'].map(f => (
                <li key={f} className="flex items-center gap-2.5 text-sm text-gray-400">
                  <span className="text-red-400 flex-shrink-0 font-bold text-base leading-none">✗</span> {f}
                </li>
              ))}
            </ul>
            <Link to="/invoice" className="block text-center bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-2.5 rounded-xl font-semibold text-sm transition-all">
              Start Free →
            </Link>
          </div>

          {/* Pro */}
          <div className="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 rounded-2xl p-6 border-2 border-blue-300 relative">
            <div className="absolute -top-3 right-6 bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
              MOST POPULAR
            </div>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Crown className="h-5 w-5 text-yellow-500" /> Pro Plan
              </h3>
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-600">₹249<span className="text-sm font-normal text-gray-500">/mo</span></div>
              </div>
            </div>
            <ul className="space-y-2.5 mb-6">
              {[
                'Everything in Free', 'Remove all watermarks', 'No ads ever',
                '5 templates per type (2 exclusive Pro)', 'Business profile auto-fill all docs',
                'PDF history & re-edit', 'Custom invoice numbering', 'Bank details in documents',
                'Bulk certificate generation (CSV/Excel)', 'Bulk event pass generation',
                'ZIP download for bulk', 'Custom logo & brand color',
                'Custom footer text', 'Analytics dashboard',
              ].map(f => (
                <li key={f} className="flex items-center gap-2.5 text-sm text-gray-700">
                  <Check className="h-4 w-4 text-blue-600 flex-shrink-0" /> {f}
                </li>
              ))}
            </ul>
            <Link to="/pricing" className="block text-center bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-bold text-sm transition-all shadow-lg">
              <Crown className="inline h-4 w-4 mr-1" /> Get Pro — ₹249/month
            </Link>
          </div>
        </div>
      </section>

      {/* ── Testimonials ─────────────────────────────────────────────────── */}
      <section className="mb-14">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Loved by Indian Businesses</h2>
          <p className="text-gray-500">Join 50,000+ users who trust PDFDecor</p>
        </div>

        {/* Featured testimonial */}
        <div className="bg-gradient-to-br from-blue-600 to-purple-700 rounded-3xl p-8 text-white mb-6 text-center relative overflow-hidden">
          <div className="absolute top-4 left-6 text-6xl font-serif text-white/20">"</div>
          <Quote className="h-8 w-8 text-white/30 mx-auto mb-4" />
          <p className="text-lg md:text-xl font-medium mb-6 max-w-2xl mx-auto leading-relaxed">
            "{testimonial.text}"
          </p>
          <div className="flex items-center justify-center gap-4">
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center font-bold text-white">
              {testimonial.avatar}
            </div>
            <div className="text-left">
              <div className="font-bold text-white">{testimonial.name}</div>
              <div className="text-white/70 text-sm">{testimonial.role}</div>
            </div>
          </div>
          <div className="flex justify-center gap-1 mt-4">
            {[...Array(testimonial.rating)].map((_, i) => (
              <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            ))}
          </div>
          {/* Dots */}
          <div className="flex justify-center gap-2 mt-4">
            {TESTIMONIALS.map((_, i) => (
              <button
                key={i}
                onClick={() => setTestimonialIdx(i)}
                className={`rounded-full transition-all ${i === testimonialIdx ? 'w-5 h-2 bg-white' : 'w-2 h-2 bg-white/30'}`}
              />
            ))}
          </div>
        </div>

        {/* Grid testimonials */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {TESTIMONIALS.filter((_, i) => i !== testimonialIdx).slice(0, 3).map((t, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex gap-0.5 mb-3">
                {[...Array(t.rating)].map((_, j) => (
                  <Star key={j} className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-sm text-gray-700 mb-4 leading-relaxed">"{t.text}"</p>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold text-xs">
                  {t.avatar}
                </div>
                <div>
                  <div className="font-semibold text-gray-900 text-sm">{t.name}</div>
                  <div className="text-xs text-gray-500">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FAQ Section ──────────────────────────────────────────────────── */}
      <section className="mb-14">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Frequently Asked Questions</h2>
          <p className="text-gray-500">Everything you need to know about PDFDecor</p>
        </div>
        <div className="space-y-3 max-w-3xl mx-auto">
          {FAQS.map((faq, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
              <button
                className="w-full text-left px-5 py-4 flex items-center justify-between gap-4 hover:bg-gray-50 transition-colors"
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
              >
                <span className="font-semibold text-gray-900 text-sm">{faq.q}</span>
                <ChevronRight className={`h-4 w-4 text-gray-400 flex-shrink-0 transition-transform ${openFaq === i ? 'rotate-90' : ''}`} />
              </button>
              {openFaq === i && (
                <div className="px-5 pb-4">
                  <p className="text-gray-600 text-sm leading-relaxed">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── Pro CTA Banner ────────────────────────────────────────────────── */}
      {!isPro && (
        <section className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl p-8 md:p-12 text-white text-center mb-14 shadow-2xl">
          <Crown className="h-12 w-12 text-yellow-300 mx-auto mb-4" />
          <h2 className="text-3xl md:text-4xl font-bold mb-3">Upgrade to PDFDecor Pro</h2>
          <p className="text-white/80 text-lg mb-6 max-w-xl mx-auto">
            Remove watermarks, unlock all 5 templates, get bulk generation, business profile autofill & analytics dashboard.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/pricing" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3.5 rounded-xl font-bold text-sm transition-all shadow-lg">
              <Crown className="inline h-4 w-4 mr-1.5" /> Get Pro — ₹249/month
            </Link>
            <Link to="/invoice" className="bg-white/10 hover:bg-white/20 border border-white/30 text-white px-8 py-3.5 rounded-xl font-bold text-sm transition-all backdrop-blur-sm">
              Try Free First
            </Link>
          </div>
        </section>
      )}

      {/* ── SEO Content ──────────────────────────────────────────────────── */}
      <section className="bg-gray-50 rounded-2xl p-8 border border-gray-200 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Free PDF Generator for Indian Businesses — PDFDecor
        </h2>
        <div className="text-gray-600 text-sm space-y-3 leading-relaxed max-w-4xl">
          <p>
            <strong>PDFDecor</strong> is India's leading free online PDF generation platform built for small businesses,
            freelancers, shopkeepers, traders, and MSMEs. Generate GST-compliant invoices, receipts, quotations,
            certificates, offer letters, ID cards, and event passes in seconds — no design skills or signup required.
          </p>
          <p>
            Our platform supports <strong>UPI payment QR codes</strong> embedded directly in invoices, auto-calculated GST
            (CGST/SGST/IGST split), Indian Rupee (₹) formatting, GSTIN fields, and mobile-first responsive design.
            Works on any device — phone, tablet, or desktop — with any modern browser.
          </p>
          <p>
            With the <strong>Pro plan at ₹249/month</strong>, businesses can set up a Business Profile that auto-fills
            across all 10 document types, save PDF history with re-edit functionality, use custom invoice numbering with
            auto-increment, generate bulk certificates from Excel/CSV files, and remove all watermarks, ads, and
            PDFDecor branding for a completely professional experience.
          </p>
          <p>
            Target keywords: Free Invoice Generator India, GST Invoice Generator, Free Certificate Generator,
            Online Bill Generator India, Event Pass Generator, Bulk Certificate Generator, Free Quotation Maker.
          </p>
        </div>
      </section>

      <AdBanner position="bottom" />
    </div>
  );
}
