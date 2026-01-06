import React, { useState, useEffect, useRef } from 'react';
import { supabase } from './lib/supabase';
import { Routes, Route, useNavigate, useParams, useLocation } from "react-router-dom";
import { SiZalo } from "react-icons/si";
import { 
  Search, Bell, Menu, X, Plus, TrendingUp, Bookmark, Share2, 
  Upload, Calendar, Volume2, VolumeX, School, BookOpen, Film, 
  Lightbulb, ArrowLeft, Clock, User, Link as LinkIcon, Check, 
  MessageSquare, Image as ImageIcon, Send, MessageCircle, FileText, 
  ThumbsUp, ThumbsDown, Loader2, VideoOff, Trash2, Edit3, Bold, Italic, Underline, List, Type, Link2, Heart
} from 'lucide-react';
import LightPillar from './LightPillar';

// --- 1. GLOBAL CONSTANTS & STYLES ---
// Supabase storage helper for uploads
const uploadFile = async (bucketName, file) => {
  if (!file || !bucketName) throw new Error('File or bucket missing');
  if (!supabase) throw new Error('Supabase client is not configured');
  const ext = (file.name || '').split('.').pop() || (file.type && file.type.includes('video') ? 'mp4' : 'bin');
  const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const { error: uploadError } = await supabase.storage.from(bucketName).upload(path, file, {
    contentType: file.type || 'application/octet-stream',
    cacheControl: '3600',
    upsert: false,
  });
  if (uploadError) throw uploadError;
  const { data } = supabase.storage.from(bucketName).getPublicUrl(path);
  return data?.publicUrl || '';
};

const GLOBAL_STYLES = `
  :root, body, #root {
    width: 100%;
    min-height: 100vh;
    margin: 0;
    padding: 0;
    overflow-x: hidden;
    background-color: #050505;
    scroll-behavior: smooth;
  }
  * { box-sizing: border-box; }
  *:focus { outline: none !important; }
  
  /* Custom Scrollbar */
  ::-webkit-scrollbar { width: 8px; }
  ::-webkit-scrollbar-track { background: #09090b; }
  ::-webkit-scrollbar-thumb { background: #27272a; border-radius: 4px; }
  ::-webkit-scrollbar-thumb:hover { background: #3f3f46; }
  
  /* Animations */
  @keyframes spin { 100% { transform: rotate(360deg); } }

  @keyframes ambientCycle { 
    0% { transform: scale(1); opacity: 0.5; } 
    50% { transform: scale(1.2); opacity: 0.7; } 
    100% { transform: scale(1); opacity: 0.5; } 
  }
  @keyframes pulseGlow {
    0% { transform: scale(1); opacity: 0.6; }
    100% { transform: scale(1.1); opacity: 0.8; }
  }
  /* NEW: Micro-animation to prevent browser clipping optimization */
  @keyframes antiClip {
    0% { transform: scale(1.08) translate3d(0, 0, 0); }
    100% { transform: scale(1.08) translate3d(0.1px, 0.1px, 0); }
  }

  @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
  
  /* Fix Input Autofill Background */
  input:-webkit-autofill,
  input:-webkit-autofill:hover, 
  input:-webkit-autofill:focus, 
  input:-webkit-autofill:active{
      -webkit-box-shadow: 0 0 0 30px #18181b inset !important;
      -webkit-text-fill-color: white !important;
  }

  /* Utility Classes */
  .reveal-section {
    opacity: 0;
    transform: translateY(30px);
    transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1);
    will-change: opacity, transform;
  }
  .reveal-section.is-visible {
    opacity: 1;
    transform: translateY(0);
  }
  .page-transition-enter {
    animation: fadeIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }


  /* Sticky header offset for anchor scrolling */
  #video-section, #articles-section { scroll-margin-top: 96px; }

  /* Ambient background (luxury breathe + hue cycle) */
  :root { --ambient-intensity: 1; }

  @keyframes luxeHue {
    0% { filter: hue-rotate(0deg) saturate(1.12) brightness(1); }
    50% { filter: hue-rotate(35deg) saturate(1.22) brightness(1.05); }
    100% { filter: hue-rotate(70deg) saturate(1.15) brightness(1); }
  }
  @keyframes luxeBreathA {
    0% { transform: translate3d(0,0,0) scale(1); opacity: 0.34; }
    50% { transform: translate3d(0,-1.6%,0) scale(1.08); opacity: 0.55; }
    100% { transform: translate3d(0,0,0) scale(1.02); opacity: 0.40; }
  }
  @keyframes luxeBreathB {
    0% { transform: translate3d(0,0,0) scale(1); opacity: 0.28; }
    50% { transform: translate3d(0,1.4%,0) scale(1.12); opacity: 0.48; }
    100% { transform: translate3d(0,0,0) scale(1.04); opacity: 0.32; }
  }

  .ambient-root { position: fixed; inset: 0; z-index: 0; overflow: hidden; pointer-events: none; }
  .ambient-hue { position: absolute; inset: -12%; animation: luxeHue 16s ease-in-out infinite alternate; }
  .ambient-noise { position: absolute; inset: 0; opacity: 0.04; background: url("https://grainy-gradients.vercel.app/noise.svg"); }
  .ambient-blob {
    position: absolute;
    width: 90vw;
    height: 90vw;
    filter: blur(110px);
    will-change: transform, opacity, filter;
    mix-blend-mode: screen;
    opacity: calc(0.55 * var(--ambient-intensity));
  }
  .ambient-blob.a {
    top: -20%;
    right: -18%;
    background: radial-gradient(circle, rgba(139, 92, 246, 0.55), transparent 62%);
    animation: luxeBreathA 10.5s cubic-bezier(0.16,1,0.3,1) infinite;
  }
  .ambient-blob.b {
    bottom: -22%;
    left: -18%;
    background: radial-gradient(circle, rgba(56, 189, 248, 0.45), transparent 62%);
    animation: luxeBreathB 12s cubic-bezier(0.16,1,0.3,1) infinite;
  }
  .ambient-blob.c {
    top: 35%;
    left: 55%;
    width: 65vw;
    height: 65vw;
    background: radial-gradient(circle, rgba(236, 72, 153, 0.22), transparent 65%);
    animation: luxeBreathA 14s cubic-bezier(0.16,1,0.3,1) infinite;
  }
  .ambient-vignette {
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at 50% 30%, transparent 0%, rgba(0,0,0,0.55) 68%, rgba(0,0,0,0.85) 100%);
    opacity: 0.9;
  }

  /* Ambient controls (intensity slider) */
  .ambient-controls { padding: 12px 14px 14px; border-top: 1px solid rgba(255,255,255,0.08); }
  .ambient-label { display:flex; justify-content: space-between; align-items:center; font-size: 12px; color:#a1a1aa; margin-bottom: 10px; }
  .ambient-range { width: 100%; }
  .ambient-range input[type="range"] { width: 100%; }

  /* Responsive helpers (no Tailwind dependency) */
  .nav-links { display: flex; }
  .mobile-nav-toggle { display: none; }
  .mobile-menu-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.6);
    backdrop-filter: blur(8px);
    z-index: 10001;
    display: flex;
    align-items: flex-start;
    justify-content: flex-end;
    padding: 12px;
  }
  .mobile-menu-panel {
    width: min(360px, 92vw);
    background: rgba(15, 15, 20, 0.98);
    border: 1px solid rgba(255,255,255,0.12);
    border-radius: 16px;
    box-shadow: 0 20px 60px rgba(0,0,0,0.8);
    overflow: hidden;
    animation: fadeIn 0.18s ease-out;
  }
  .mobile-menu-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 14px 14px;
    border-bottom: 1px solid rgba(255,255,255,0.08);
  }
  .mobile-menu-list { display: flex; flex-direction: column; padding: 10px; gap: 8px; }
  .mobile-menu-item {
    width: 100%;
    text-align: left;
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.08);
    color: #e5e7eb;
    padding: 12px 14px;
    border-radius: 12px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
  }
  .mobile-menu-item.is-active {
    border-color: rgba(255, 255, 255, 0.25);
    box-shadow: none;
    color: #e5e7eb;
  }
  .mobile-profile {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 12px;
    margin: 6px;
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 12px;
  }
  .mobile-profile-name {
    font-size: 14px;
    color: #e5e7eb;
    font-weight: 600;
  }
  .mobile-profile-cta {
    display: flex;
    gap: 8px;
    padding: 10px;
  }
  .mobile-profile-cta button {
    flex: 1;
  }

  /* Mobile adjustments */
  @media (max-width: 768px) {
    .nav-links { display: none !important; }
    .mobile-nav-toggle { display: inline-flex; }
    .btn-label { display: none; }
    .create-post-btn { display: none !important; }
    .profile-name { display: none; }
    nav .logo-wrap { flex-direction: row; }
    .brand-title { font-size: 18px !important; }
  }
  
  /* Admin Panel Styles */
  .admin-panel {
    background: rgba(239, 68, 68, 0.05);
    border: 1px solid rgba(239, 68, 68, 0.2);
    border-radius: 16px;
    padding: 20px;
    margin-bottom: 30px;
    animation: fadeIn 0.3s;
  }
  .admin-panel-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
    border-bottom: 1px solid rgba(239, 68, 68, 0.1);
    padding-bottom: 12px;
  }
  .admin-panel-title {
    color: #f87171;
    font-weight: 700;
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 16px;
  }
  .admin-controls-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
    gap: 16px;
  }
  .admin-input-group {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  .admin-input-label {
    font-size: 12px;
    color: #9ca3af;
    font-weight: 500;
  }
  .admin-input {
    background: rgba(0,0,0,0.3);
    border: 1px solid rgba(255,255,255,0.1);
    color: #fff;
    padding: 8px 12px;
    border-radius: 8px;
    font-size: 14px;
  }
  
  /* Rich Text Editor Toolbar */
  .rte-toolbar {
    display: flex;
    gap: 4px;
    background: #27272a;
    padding: 8px;
    border-radius: 8px 8px 0 0;
    border: 1px solid #3f3f46;
    border-bottom: none;
    flex-wrap: wrap;
  }
  .rte-btn {
    padding: 6px;
    background: transparent;
    border: none;
    color: #a1a1aa;
    cursor: pointer;
    border-radius: 4px;
    transition: all 0.2s;
  }
  .rte-btn:hover {
    background: rgba(255,255,255,0.1);
    color: #fff;
  }
  .rte-btn:active, .rte-btn.is-active {
    background: rgba(147,51,234,0.15);
    color: #c084fc;
    border: 1px solid rgba(147,51,234,0.35);
  }

  /* Content editable placeholder */
  .editable[contenteditable]:empty:before {
    content: attr(data-placeholder);
    color: #6b7280;
  }

  /* Article content formatting */
  .article-content {
    line-height: 1.7;
    color: #e2e8f0;
  }
  .article-content a {
    color: #c084fc;
    font-weight: 700;
    text-decoration: underline;
    text-underline-offset: 3px;
    border-bottom: 1px dashed rgba(192, 132, 252, 0.6);
    padding-bottom: 1px;
  }
  .article-content a.article-link {
    color: #a855f7;
    background: rgba(168, 85, 247, 0.12);
    padding: 1px 4px;
    border-radius: 6px;
  }
  .inline-image-placeholder {
    color: #c084fc;
    background: rgba(192, 132, 252, 0.12);
    padding: 2px 6px;
    border-radius: 6px;
    border: 1px dashed rgba(192,132,252,0.5);
    font-weight: 600;
  }
  .article-content a:hover {
    color: #a855f7;
    border-bottom-color: rgba(168, 85, 247, 0.9);
  }
  .article-content img {
    width: 100%;
    max-width: 100%;
    height: auto;
    border-radius: 12px;
    display: block;
    margin: 18px auto;
  }
  .article-figure {
    margin: 18px 0;
  }
  .article-figure img {
    width: 100%;
    max-width: 100%;
    height: auto;
    border-radius: 12px;
    display: block;
    margin: 0 auto;
  }
  .article-figure figcaption {
    margin-top: 6px;
    margin-bottom: 14px;
    font-size: 13px;
    font-style: italic;
    color: #a1a1aa;
    text-align: center;
  }
  .image-caption-block {
    display: block;
    background: transparent;
    border: none;
    color: #a1a1aa;
    font-size: 13px;
    font-style: italic;
    line-height: 1.5;
    padding: 4px 0;
    margin: 6px auto 16px;
    max-width: 90%;
    text-align: center;
  }
  .image-caption-block:focus {
    outline: 1px solid rgba(255,255,255,0.2);
    outline-offset: 2px;
  }
  @media (max-width: 640px) {
    .article-content img {
      max-width: 90%;
    }
  }
`;

const BRAND = {
  primary: '#9333EA',
  primaryHover: '#A855F7',
  soft: 'rgba(147, 51, 234, 0.14)',
  border: 'rgba(147, 51, 234, 0.35)',
  logo: 'https://i.ibb.co/twbnpPDK/d93ab92f-7d17-4f7e-8d6a-a2601020866b.png',
  storageKey: 'eightDucksUsername',
  avatarKey: 'eightDucksAvatar'
};

const PRIMARY_GRADIENT = `linear-gradient(90deg, ${BRAND.primary} 0%, ${BRAND.primaryHover} 100%)`;

// --- 3. ICONS ---
const FacebookIcon = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047v-2.6c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/></svg>);
const TikTokIcon = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/></svg>);


// --- 4. HELPERS ---
const getCategoryIcon = (cat) => {
  switch (cat) {
    case 'Tình cảm tuổi học trò': return <Heart size={14} />;
    case 'Ký ức tuổi đẹp của thanh xuân': return <BookOpen size={14} />;
    case 'Chia sẻ cảm hứng': return <Lightbulb size={14} />;
    default: return null; 
  }
};

// Estimate reading time based on text length and media
const calculateReadingTime = (article = {}) => {
  const plainText = (article.content || article.excerpt || '').replace(/<[^>]*>/g, ' ');
  const words = plainText.trim() ? plainText.trim().split(/\s+/).length : 0;
  const content = article.content || '';
  const imagesInContent = (content.match(/<img\b[^>]*>/gi) || []).length;
  const videosInContent = (content.match(/<video\b[^>]*>/gi) || []).length;
  const mediaCount = imagesInContent + videosInContent + (article.image ? 1 : 0) + (article.video ? 1 : 0);
  const extraSeconds = Math.min(mediaCount * 10, 60); // simplified: +10s per image/video, max 60s
  const totalMinutes = Math.ceil(words / 225 + extraSeconds / 60);
  return Math.max(totalMinutes, 1);
};

// Normalize links to always open in new tab with consistent style
const enhanceLinks = (html = '') => {
  if (!html) return '';
  const withTargets = html.replace(/<a\s+([^>]*href=["'][^"']+["'][^>]*)>/gi, (match, attrs) => {
    // Preserve other attributes but enforce target/rel and a highlight class
    const hasTarget = /target=/i.test(attrs);
    const hasRel = /rel=/i.test(attrs);
    const hasClass = /class=/i.test(attrs);
    const nextAttrs = [
      attrs,
      hasClass ? '' : 'class="article-link"',
      hasTarget ? '' : 'target="_blank"',
      hasRel ? '' : 'rel="noopener noreferrer"'
    ].filter(Boolean).join(' ');
    return `<a ${nextAttrs}>`;
  });
  return withTargets;
};

// Remove blob/file URLs that will break after a reload; allow http(s)/data URLs only.
const sanitizeMediaUrl = (url, fallback = '') => {
  if (!url || typeof url !== 'string') return fallback;
  const trimmed = url.trim();
  if (!trimmed) return fallback;
  const lower = trimmed.toLowerCase();
  if (lower.startsWith('blob:') || lower.startsWith('file:')) return fallback;
  if (lower.startsWith('/storage/v1')) {
    const base = (import.meta.env.VITE_SUPABASE_URL || '').replace(/\/$/, '');
    return `${base}${trimmed}`;
  }
  if (lower.startsWith('http://') || lower.startsWith('https://') || lower.startsWith('data:')) return trimmed;
  return trimmed;
};

// Strip broken blob images inside rich content to avoid ERR_FILE_NOT_FOUND on reloads
const stripInvalidMediaFromContent = (html = '') => {
  if (!html) return '';
  return html.replace(/<img([^>]+)src=["']blob:[^"']+["']([^>]*)>/gi, '<img$1src=""$2>');
};

// Normalize DB rows before putting them into state
const normalizePost = (post = {}) => {
  const cleanImage = sanitizeMediaUrl(post.image);
  const cleanVideo = sanitizeMediaUrl(post.video);
  return {
    ...post,
    image: cleanImage || null,
    video: cleanVideo || null,
    content: stripInvalidMediaFromContent(post.content || ''),
    views: post.view_count ?? post.views ?? 0
  };
};

// Basic paste sanitization for editor (keeps structure, strips unsafe tags/attrs)
const sanitizePasteContent = (rawHtml = '') => {
  if (!rawHtml) return '';
  const wrapper = document.createElement('div');
  wrapper.innerHTML = rawHtml;

  wrapper.querySelectorAll('script,style,iframe,noscript,meta,link').forEach((n) => n.remove());

  const allowedTags = new Set([
    'P', 'BR', 'B', 'STRONG', 'I', 'EM', 'U', 'A', 'SPAN', 'DIV',
    'UL', 'OL', 'LI',
    'FIGURE', 'IMG', 'FIGCAPTION',
    'TABLE', 'THEAD', 'TBODY', 'TR', 'TH', 'TD'
  ]);

  const unwrap = (el) => {
    const parent = el.parentNode;
    if (!parent) return;
    while (el.firstChild) parent.insertBefore(el.firstChild, el);
    parent.removeChild(el);
  };

  wrapper.querySelectorAll('*').forEach((el) => {
    const tag = el.tagName;
    if (!allowedTags.has(tag)) {
      unwrap(el);
      return;
    }

    Array.from(el.attributes).forEach((attr) => {
      const name = attr.name.toLowerCase();
      const isAllowed = ['href', 'src', 'alt', 'class', 'data-img', 'contenteditable'].includes(name);
      if (name.startsWith('on') || !isAllowed) el.removeAttribute(attr.name);
    });

    if (tag === 'A') {
      const href = el.getAttribute('href') || '';
      if (!/^https?:\/\//i.test(href)) {
        unwrap(el);
        return;
      }
      el.setAttribute('target', '_blank');
      el.setAttribute('rel', 'noopener noreferrer');
    }

    if (tag === 'IMG') {
      const src = sanitizeMediaUrl(el.getAttribute('src') || '');
      if (!src) {
        el.remove();
        return;
      }
      el.setAttribute('src', src);
    }
  });

  wrapper.querySelectorAll('figure').forEach((fig) => {
    const img = fig.querySelector('img');
    if (!img) {
      fig.remove();
      return;
    }
    const src = sanitizeMediaUrl(img.getAttribute('src') || '');
    if (!src) {
      fig.remove();
      return;
    }
    const name = img.getAttribute('alt') || 'image';
    const captionText = fig.querySelector('figcaption')?.textContent?.trim()
      || img.getAttribute('alt')
      || '';
    const span = document.createElement('span');
    span.className = 'inline-image-placeholder';
    span.setAttribute('contenteditable', 'false');
    span.setAttribute('data-img', src);
    span.textContent = name.trim();
    const caption = document.createElement('div');
    caption.className = 'image-caption-block';
    caption.setAttribute('contenteditable', 'true');
    caption.setAttribute('data-placeholder', 'Nhập chú thích ảnh...');
    caption.textContent = captionText;
    const wrapperBlock = document.createElement('div');
    wrapperBlock.append(span, caption);
    fig.replaceWith(wrapperBlock);
  });

  wrapper.querySelectorAll('img').forEach((img) => {
    if (img.closest('figure')) return;
    const src = sanitizeMediaUrl(img.getAttribute('src') || '');
    if (!src) {
      img.remove();
      return;
    }
    const alt = img.getAttribute('alt') || '';
    const captionText = alt || '';
    const span = document.createElement('span');
    span.className = 'inline-image-placeholder';
    span.setAttribute('contenteditable', 'false');
    span.setAttribute('data-img', src);
    span.textContent = alt || 'image';
    const caption = document.createElement('div');
    caption.className = 'image-caption-block';
    caption.setAttribute('contenteditable', 'true');
    caption.setAttribute('data-placeholder', 'Nhập chú thích ảnh...');
    caption.textContent = captionText;
    const wrapperBlock = document.createElement('div');
    wrapperBlock.append(span, caption);
    img.replaceWith(wrapperBlock);
  });

  return wrapper.innerHTML.trim();
};

const formatDate = (iso) => {
  if (!iso) return '';
  try {
    return new Date(iso).toLocaleString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  } catch (e) {
    return '';
  }
};

const AmbientBackground = ({ ambientIntensity = 1, scrollY = 0 }) => (
  <div className="ambient-root" style={{ '--ambient-intensity': String(ambientIntensity) }}>
    <div className="ambient-hue">
      <div className="ambient-noise" />
      <div className="ambient-blob a" style={{ transform: `translateY(${scrollY * 0.06}px)` }} />
      <div className="ambient-blob b" style={{ transform: `translateY(-${scrollY * 0.05}px)` }} />
      <div className="ambient-blob c" style={{ transform: `translateY(${scrollY * 0.03}px)` }} />
      <div className="ambient-vignette" />
    </div>
  </div>
);

// --- 5. SUB-COMPONENTS ---

const FadeInSection = ({ children, delay = 0, className = "" }) => {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef();
  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => { if (entry.isIntersecting) setIsVisible(true); });
    }, { threshold: 0.1 }); 
    const currentRef = domRef.current;
    if (currentRef) observer.observe(currentRef);
    return () => { if (currentRef) observer.unobserve(currentRef); };
  }, []);
  return (
    <div ref={domRef} className={`reveal-section ${isVisible ? 'is-visible' : ''} ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
};

const NotificationDropdown = ({ notifications, onClose, onMarkAllRead }) => {
  return (
    <div style={{ position: 'absolute', top: 'calc(100% + 15px)', right: '0', width: 'min(340px, calc(100vw - 24px))', background: 'rgba(15, 15, 20, 0.98)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '16px', boxShadow: '0 20px 50px rgba(0,0,0,0.8)', zIndex: 9999, padding: '8px', animation: 'fadeIn 0.2s ease-out', transformOrigin: 'top right' }}>
       <div style={{ position: 'absolute', top: '-6px', right: '20px', width: '12px', height: '12px', background: 'rgba(15, 15, 20, 0.98)', borderLeft: '1px solid rgba(255, 255, 255, 0.1)', borderTop: '1px solid rgba(255, 255, 255, 0.1)', transform: 'rotate(45deg)', zIndex: 1 }} />
      <div style={{ padding: '16px', borderBottom: '1px solid rgba(255, 255, 255, 0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', zIndex: 2 }}>
        <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '600', color: '#f9fafb' }}>Thông báo</h3>
        <button onClick={onMarkAllRead} style={{ fontSize: '12px', color: '#a78bfa', cursor: 'pointer', background: 'transparent', border: 'none', padding: '4px 8px', borderRadius: '4px', transition: 'background 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(167, 139, 250, 0.1)'} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>Đánh dấu đã đọc</button>
      </div>
      <div style={{ maxHeight: '350px', overflowY: 'auto', position: 'relative', zIndex: 2 }}>
        {notifications.length > 0 ? notifications.map(notif => (
          <div key={notif.id} style={{ padding: '16px', borderBottom: '1px solid rgba(255, 255, 255, 0.03)', background: notif.isRead ? 'transparent' : 'rgba(167, 139, 250, 0.05)', cursor: 'pointer', transition: 'background 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'} onMouseLeave={(e) => e.currentTarget.style.background = notif.isRead ? 'transparent' : 'rgba(167, 139, 250, 0.05)'}>
            <p style={{ margin: '0 0 6px 0', fontSize: '14px', color: '#e5e7eb', lineHeight: '1.5' }}>{notif.text}</p>
            <span style={{ fontSize: '12px', color: BRAND.primary }}>{notif.time}</span>
          </div>
        )) : (
          <div style={{ padding: '20px', textAlign: 'center', color: '#6b7280', fontSize: '13px' }}>Không có thông báo mới</div>
        )}
      </div>
    </div>
  );
};

const ShareButton = ({ icon, color, onClick }) => (
  <button onClick={onClick} style={{ width: '40px', height: '40px', borderRadius: '50%', border: '1px solid rgba(255, 255, 255, 0.1)', background: 'rgba(255, 255, 255, 0.03)', color: '#e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s ease' }} onMouseEnter={(e) => { e.currentTarget.style.background = color; e.currentTarget.style.color = '#fff'; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.borderColor = color; }} onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)'; e.currentTarget.style.color = '#e5e7eb'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)'; }}>{icon}</button>
);

// Updated CommentSection to handle admin deletion & async submit
const CommentSection = ({ comments = [], onAddComment, isAdmin, onDeleteComment, isLoading = false, isSubmitting = false, currentUser, currentAvatar }) => {
  const isImageLike = (src) => typeof src === 'string' && (src.startsWith('data:') || src.startsWith('http://') || src.startsWith('https://'));
  const [newComment, setNewComment] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [visibleCount, setVisibleCount] = useState(5);
  const visibleComments = comments.slice(0, visibleCount);
  const hasMoreComments = comments.length > visibleCount;

  useEffect(() => {
    setVisibleCount(5);
  }, [comments.length]);

  const handleSubmit = async () => {
    const value = newComment.trim();
    if (!value || isSubmitting) return;
    try {
      const ok = await onAddComment(value);
      if (ok) setNewComment('');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ marginTop: '40px' }}>
      <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#f9fafb', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <MessageSquare size={20} color="#a78bfa" /> Bình luận ({comments.length})
      </h3>
      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '32px', padding: '20px', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '20px', border: `1px solid ${isFocused ? 'rgba(139, 92, 246, 0.4)' : 'rgba(255, 255, 255, 0.05)'}`, transition: 'all 0.3s ease', boxShadow: isFocused ? '0 0 20px rgba(139, 92, 246, 0.1)' : 'none' }}>
        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: PRIMARY_GRADIENT, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 'bold', flexShrink: 0, overflow: 'hidden' }}>
          {isImageLike(currentAvatar)
            ? <img src={currentAvatar} alt={currentUser || 'Bạn'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            : (currentUser ? currentUser.charAt(0).toUpperCase() : <User size={18} color="#fff" />)}
        </div>
        <div style={{ flex: 1, position: 'relative' }}>
          <textarea value={newComment} onChange={(e) => setNewComment(e.target.value)} onFocus={() => setIsFocused(true)} onBlur={() => setIsFocused(false)} placeholder="Chia sẻ suy nghĩ của bạn..." rows={2} style={{ width: '100%', padding: '10px 0', background: 'transparent', border: 'none', color: '#e4e4e7', fontSize: '15px', resize: 'none', outline: 'none', minHeight: '24px' }} />
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
            <button
              onClick={handleSubmit}
              disabled={!newComment.trim() || isSubmitting}
              style={{
                background: newComment.trim() && !isSubmitting ? BRAND.primary : 'rgba(255,255,255,0.1)',
                color: newComment.trim() && !isSubmitting ? '#fff' : '#71717a',
                border: 'none',
                padding: '8px 20px',
                borderRadius: '20px',
                fontSize: '13px',
                fontWeight: '600',
                cursor: newComment.trim() && !isSubmitting ? 'pointer' : 'default',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                opacity: isSubmitting ? 0.7 : 1
              }}
            >
              {isSubmitting ? 'Đang gửi...' : 'Gửi'} <Send size={14} />
            </button>
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {isLoading ? (
          <p style={{ color: '#71717a' }}>Đang tải bình luận...</p>
        ) : visibleComments.length > 0 ? visibleComments.map(comment => {
            const author = comment.author || comment.user_name || comment.user || currentUser || 'Ẩn danh';
            const avatarSrc = (comment.avatar && isImageLike(comment.avatar))
              ? comment.avatar
              : ((comment.author === currentUser || comment.user_name === currentUser || author === currentUser) && isImageLike(currentAvatar) ? currentAvatar : null);
            const authorInitial = author ? author.charAt(0).toUpperCase() : '';
            const time = comment.created_at
              ? new Date(comment.created_at).toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric' })
              : (comment.time || '');
            const content = comment.content || comment.text || '';
            return (
            <div key={comment.id} style={{ display: 'flex', gap: '16px', position: 'relative' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg, #3b82f6, #06b6d4)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '14px', fontWeight: 'bold', flexShrink: 0, overflow: 'hidden' }}>
                  {avatarSrc
                    ? <img src={avatarSrc} alt={author} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    : (authorInitial || <User size={16} color="#fff" />)}
                </div>
                <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginBottom: '6px' }}>
                        <span style={{ fontSize: '15px', fontWeight: '600', color: '#f4f4f5' }}>{author}</span>
                        <span style={{ fontSize: '12px', color: '#71717a' }}>{time}</span>
                        {isAdmin && (
                            <button
                                onClick={() => { if(window.confirm('Xóa bình luận này?')) onDeleteComment(comment.id); }}
                                style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '4px', marginLeft: 'auto', color: '#ef4444' }}
                                title="Xóa bình luận"
                            >
                                <Trash2 size={14} />
                            </button>
                        )}
                    </div>
                    <p style={{ fontSize: '15px', color: '#d4d4d8', lineHeight: '1.6', background: 'rgba(255,255,255,0.03)', padding: '12px 16px', borderRadius: '0 16px 16px 16px', display: 'inline-block', border: '1px solid rgba(255,255,255,0.05)' }}>{content}</p>
                </div>
            </div>
        ); }) : (<p style={{ color: '#71717a', fontStyle: 'italic' }}>Chưa có bình luận nào. Hãy là người đầu tiên!</p>)}
        {hasMoreComments && (
          <button
            onClick={() => setVisibleCount((prev) => prev + 5)}
            style={{ alignSelf: 'flex-start', background: 'linear-gradient(135deg, rgba(147,51,234,0.16), rgba(59,130,246,0.12))', border: '1px dashed rgba(255,255,255,0.35)', color: '#e9d5ff', padding: '10px 14px', borderRadius: '12px', cursor: 'pointer', boxShadow: '0 8px 20px rgba(0,0,0,0.35)', transition: 'transform 0.2s' }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-1px)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            Nhấn vào đây để xem thêm bình luận
          </button>
        )}
      </div>
    </div>
  );
};

const SurveySection = () => {
    const handleClick = (type) => { alert(`Cảm ơn bạn đã quan tâm đến mục "${type}". Form khảo sát sẽ được mở trong tab mới!`); }
  return (
    <div style={{ marginTop: '60px', padding: 'clamp(18px, 4vw, 40px)', background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.08), rgba(6, 182, 212, 0.05))', borderRadius: '24px', border: '1px solid rgba(139, 92, 246, 0.2)', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'relative', zIndex: 2 }}>
        <h3 style={{ fontSize: '24px', fontWeight: '700', color: '#f9fafb', marginBottom: '12px' }}>Ý kiến của bạn rất quan trọng!</h3>
        <p style={{ color: '#a1a1aa', fontSize: '15px', marginBottom: '24px', maxWidth: '600px', margin: '0 auto 32px', lineHeight: '1.6' }}>Hãy giúp Eight Ducks cải thiện chất lượng nội dung bằng cách dành 1 phút để làm khảo sát nhỏ này hoặc gửi góp ý trực tiếp cho chúng tôi.</p>
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
          <button onClick={() => { handleClick('Khảo sát'); window.open('https://forms.gle/zUcp6voSQga6nzvQ8', '_blank'); }} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 28px', background: BRAND.primary, borderRadius: '100px', border: 'none', color: '#fff', fontWeight: '600', cursor: 'pointer', transition: 'transform 0.2s', boxShadow: `0 4px 15px ${BRAND.soft}` }}><FileText size={18} /> Làm khảo sát</button>
          <button onClick={() => { handleClick('Góp ý'); window.open('https://forms.gle/9DfnG5uGaF8uaGnv8', '_blank'); }} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 28px', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '100px', border: '1px solid rgba(255, 255, 255, 0.2)', color: '#e4e4e7', fontWeight: '600', cursor: 'pointer', transition: 'background 0.2s' }}><MessageCircle size={18} /> Gửi góp ý</button>
        </div>
      </div>
      <div style={{ position: 'absolute', top: '-50%', left: '-20%', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(139, 92, 246, 0.15), transparent 70%)', filter: 'blur(60px)' }} />
      <div style={{ position: 'absolute', bottom: '-50%', right: '-20%', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(6, 182, 212, 0.1), transparent 70%)', filter: 'blur(60px)' }} />
    </div>
  );
};

// --- DEFINING NewsArticle BEFORE ArticleDetail ---
const NewsArticle = ({ title, category, excerpt, author, date, created_at, image, video, views = 0, view_count, isNew, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);
  const baseViews = typeof views === "number" ? views : (view_count ?? 0);
  const [displayViews, setDisplayViews] = useState(baseViews);
  const authorSafe = author || 'Ẩn danh';
  const authorInitial = authorSafe.charAt(0).toUpperCase();
  const fallbackCover = 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&h=600&fit=crop';
  const displayImage = image || (!video ? fallbackCover : '');
  const displayCategory = category || 'Tất cả';

  useEffect(() => {
    if (isHovered) {
      let start = 0;
      const end = views;
      const duration = 800;
      const startTime = performance.now();

      const animate = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const ease = (t) => t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
        setDisplayViews(Math.floor(ease(progress) * end));
        if (progress < 1) requestAnimationFrame(animate);
      };
      requestAnimationFrame(animate);
    } else {
        setDisplayViews(baseViews);
    }
  }, [isHovered, baseViews]);

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        background: isHovered ? 'rgba(30, 41, 59, 0.6)' : 'rgba(17, 24, 39, 0.3)',
        backdropFilter: 'blur(12px)',
        border: isHovered 
          ? `1px solid ${BRAND.border}`
          : '1px solid rgba(255, 255, 255, 0.05)',
        borderRadius: '20px',
        padding: '24px',
        transition: 'all 400ms cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        transform: isHovered ? 'translateY(-8px) scale(1.01)' : 'translateY(0) scale(1)',
        boxShadow: isHovered
           ? `0 15px 30px -10px rgba(0, 0, 0, 0.4), 0 0 15px ${BRAND.soft}`
           : '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        cursor: 'pointer',
        position: 'relative',
        overflow: 'hidden',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        zIndex: isHovered ? 10 : 1
      }}
    >
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(105deg, transparent 40%, rgba(255, 255, 255, 0.03) 45%, rgba(255, 255, 255, 0.02) 50%, transparent 54%)', transform: isHovered ? 'translateX(100%)' : 'translateX(-100%)', transition: 'transform 0.6s', pointerEvents: 'none', zIndex: 2 }} />

      {!image && !video && isNew && (
        <span style={{ position: 'absolute', top: '24px', right: '24px', background: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa', padding: '4px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: '500', border: '1px solid rgba(59, 130, 246, 0.2)', zIndex: 10 }}>Mới</span>
      )}

      {(displayImage || video) && (
        <div style={{ width: '100%', height: '200px', borderRadius: '16px', overflow: 'hidden', marginBottom: '20px', background: 'rgba(255, 255, 255, 0.02)', flexShrink: 0, position: 'relative' }}>
          {video ? (
            <video src={video} style={{ width: '100%', height: '100%', objectFit: 'cover' }} muted loop playsInline />
          ) : (
            <img src={displayImage} alt={title} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 600ms cubic-bezier(0.4, 0, 0.2, 1)', transform: isHovered ? 'scale(1.05)' : 'scale(1)' }} />
          )}
          {isNew && <span style={{ position: 'absolute', top: '12px', right: '12px', background: 'rgba(17, 24, 39, 0.75)', backdropFilter: 'blur(4px)', color: '#60a5fa', padding: '4px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: '600', border: '1px solid rgba(59, 130, 246, 0.3)', zIndex: 10, boxShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>Mới</span>}
        </div>
      )}
      <div style={{ flex: 1, position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: isHovered ? 'rgba(147, 51, 234, 0.2)' : 'rgba(147, 51, 234, 0.1)', color: BRAND.primaryHover, padding: '4px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: '500', marginBottom: '12px', border: `1px solid ${BRAND.border}`, transition: 'all 300ms' }}>
          {getCategoryIcon(displayCategory)} {displayCategory}
        </div>
        <h3 style={{ fontSize: '20px', fontWeight: '600', color: isHovered ? '#fff' : '#f9fafb', marginBottom: '12px', lineHeight: '1.4', transition: 'color 300ms' }}>{title}</h3>
        <p style={{ color: isHovered ? '#e2e8f0' : '#9ca3af', fontSize: '14px', lineHeight: '1.4', marginBottom: '8px', transition: 'color 300ms' }}>{excerpt}</p>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '16px', borderTop: isHovered ? '1px solid rgba(255, 255, 255, 0.15)' : '1px solid rgba(255, 255, 255, 0.05)', marginTop: 'auto', transition: 'border-color 300ms' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: PRIMARY_GRADIENT, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: '600', color: '#fff', boxShadow: isHovered ? `0 0 10px ${BRAND.soft}` : 'none', transition: 'box-shadow 300ms' }}>{authorInitial}</div>
          <div><div style={{ fontSize: '13px', color: isHovered ? '#fff' : '#e5e7eb', fontWeight: '500', transition: 'color 300ms' }}>{authorSafe}</div><div style={{ fontSize: '12px', color: '#6b7280', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}><Calendar size={12} /><span>{formatDate(created_at || date)}</span></div></div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: isHovered ? BRAND.primaryHover : '#6b7280', fontSize: '13px', transition: 'color 300ms' }}><TrendingUp size={14} /><span>{displayViews.toLocaleString()}</span></div>
      </div>
    </div>
  );
};

// 7. Article Detail Component (DEPENDS ON NewsArticle)
// Updated to include Admin Controls
const ArticleDetail = ({ article, onBack, allArticles, onArticleClick, onUpdateArticle, isAdmin, onDeleteArticle, onDeleteComment, currentUser, currentAvatar }) => {
  const [copied, setCopied] = useState(false);
  const [likes, setLikes] = useState(article.likes || 0);
  const [likeCount, setLikeCount] = useState(0);
  const [dislikes, setDislikes] = useState(article.dislikes || 0);
  const [views, setViews] = useState(article.views || 0);
  const [userDisliked, setUserDisliked] = useState(false);
  const [userLiked, setUserLiked] = useState(false);
  const [likePending, setLikePending] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentsLoading, setCommentsLoading] = useState(true);
  const [commentSubmitting, setCommentSubmitting] = useState(false);
  const [toast, setToast] = useState(null);
  const lastCommentTimeRef = useRef(0);
  const lastCommentTextRef = useRef('');
  const dislikeStorageKey = 'eightDucksDislikes';
  const COMMENT_COOLDOWN_MS = 8000;
  const toastTimerRef = useRef(null);
  const fallbackCover = 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&h=600&fit=crop';
  const displayAuthor = article.author || currentUser || 'Ẩn danh';
  const articleCategory = article.category || 'Tất cả';
  const coverImage = article.image || (!article.video ? fallbackCover : '');

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => setToast(null), 2500);
  };

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    };
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setLikes(article.likes || 0);
    setLikeCount(0);
    setUserLiked(false);
    setDislikes(article.dislikes || 0);
    setViews(article.views || 0);
    setComments([]);
    setUserDisliked(false);
  }, [article.id]);

  useEffect(() => {
    try {
      if (typeof window === 'undefined') return;
      const raw = localStorage.getItem(dislikeStorageKey);
      const saved = raw ? JSON.parse(raw) : [];
      const disliked = saved.includes(String(article.id));
      setUserDisliked(disliked);
    } catch (err) {
      console.error('Failed to load local dislikes', err);
    }
  }, [article.id]);

  const readingMinutes = calculateReadingTime(article);

  useEffect(() => {
    let mounted = true;
    const loadComments = async () => {
      setCommentsLoading(true);
      try {
        const { data, error } = await supabase
          .from("comments")
          .select("*")
          .eq("post_id", article.id)
          .order("created_at", { ascending: false });
        if (!mounted) return;
        if (error) throw error;
        const normalized = (data || []).map((c) => {
          const baseAvatar = sanitizeMediaUrl(c.avatar || c.author_avatar || '');
          const selfAvatar = (c.author === currentUser || c.user_name === currentUser) ? sanitizeMediaUrl(currentAvatar) : '';
          return { ...c, avatar: baseAvatar || selfAvatar || '' };
        });
        setComments(normalized);
      } catch (err) {
        console.error(err);
        if (mounted) setComments([]);
      } finally {
        if (mounted) setCommentsLoading(false);
      }
    };
    loadComments();
    return () => { mounted = false; };
  }, [article.id]);

  // Increment view count when opening article
  useEffect(() => {
    let alive = true;
    const bumpView = async () => {
      try {
        if (!article?.id || !supabase) return;
        // Try RPC first; if not exists, fallback to update
        let newCount = null;
        const rpcRes = await supabase.rpc("increment_view_count", { post_id: article.id });
        if (!rpcRes.error && typeof rpcRes.data === "number") {
          newCount = rpcRes.data;
        } else {
          const current = article.view_count ?? article.views ?? 0;
          const { data, error } = await supabase
            .from("posts")
            .update({ view_count: current + 1 })
            .eq("id", article.id)
            .select("view_count")
            .single();
          if (error) throw error;
          newCount = data?.view_count ?? current + 1;
        }
        if (alive && typeof newCount === "number") {
          onUpdateArticle?.({ ...article, view_count: newCount });
          setViews(newCount);
        }
      } catch (err) {
        console.error(err);
      }
    };
    bumpView();
    return () => { alive = false; };
  }, [article.id]);

  // Load likes count + user liked
  useEffect(() => {
    let mounted = true;
    const loadLikes = async () => {
      try {
        const { count, error } = await supabase
          .from("likes")
          .select("*", { count: "exact", head: true })
          .eq("post_id", article.id);
        if (error) throw error;
        if (mounted) setLikeCount(count || 0);
      } catch (err) {
        console.error(err);
        if (mounted) setLikeCount(0);
      }
      try {
        if (!currentUser) { if (mounted) setUserLiked(false); return; }
        const { data } = await supabase
          .from("likes")
          .select("id")
          .eq("post_id", article.id)
          .eq("user_name", currentUser)
          .maybeSingle(); // tolerate no row without 406
        if (mounted) setUserLiked(!!data);
      } catch (err) {
        if (mounted) setUserLiked(false);
      }
    };
    loadLikes();
    return () => { mounted = false; };
  }, [article.id, currentUser]);

  const handleCopyLink = () => {
    try {
        const textArea = document.createElement("textarea");
        textArea.value = window.location.href;
        textArea.style.position = "fixed";
        textArea.style.left = "-9999px";
        textArea.style.top = "0";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        const successful = document.execCommand('copy');
        document.body.removeChild(textArea);
        if (successful) { setCopied(true); setTimeout(() => setCopied(false), 2000); return; }
    } catch (err) { console.error(err); }
    if (navigator.clipboard) { navigator.clipboard.writeText(window.location.href).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); }).catch(err => { console.error(err); alert("Không thể sao chép liên kết."); }); }
  };

  const handleLike = async () => {
    const name = currentUser || 'Khách';
    if (likePending) return;
    if (!supabase) {
      showToast('Chưa kết nối database.', 'error');
      return;
    }
    const nextLiked = !userLiked;
    setLikePending(true);
    setUserLiked(nextLiked);
    if (nextLiked && userDisliked) {
      setUserDisliked(false);
      persistDislike(false);
    }
    setLikeCount((prev) => Math.max(0, prev + (nextLiked ? 1 : -1)));
    try {
      if (nextLiked) {
        await supabase.from("likes").insert({
          post_id: article.id,
          user_name: name
        });
      } else {
        const { data } = await supabase
          .from("likes")
          .select("id")
          .eq("post_id", article.id)
          .eq("user_name", name)
          .maybeSingle(); // tolerate no row without 406
        if (data) {
          await supabase.from("likes").delete().eq("id", data.id);
        }
      }
      const { count } = await supabase
        .from("likes")
        .select("*", { count: "exact", head: true })
        .eq("post_id", article.id);
      setLikeCount(count || 0);
      const { data } = await supabase
        .from("likes")
        .select("id")
        .eq("post_id", article.id)
        .eq("user_name", name)
        .maybeSingle(); // tolerate no row without 406
      setUserLiked(!!data);
    } catch (err) {
      console.error(err);
      setUserLiked((prev) => !prev);
      setLikeCount((prev) => Math.max(prev + (nextLiked ? -1 : 1), 0));
    } finally {
      setLikePending(false);
    }
  };

  const persistDislike = (next) => {
    try {
      if (typeof window === 'undefined') return;
      const raw = localStorage.getItem(dislikeStorageKey);
      const saved = raw ? JSON.parse(raw) : [];
      const updated = next
        ? Array.from(new Set([...saved, String(article.id)]))
        : saved.filter((id) => id !== String(article.id));
      localStorage.setItem(dislikeStorageKey, JSON.stringify(updated));
    } catch (err) {
      console.error('Failed to persist dislike', err);
    }
  };

  const handleDislike = async () => {
    if (likePending) return;
    if (!supabase) {
      showToast('Chưa kết nối database.', 'error');
      return;
    }
    const next = !userDisliked;
    setUserDisliked(next);
    persistDislike(next);

    if (next && userLiked) {
      // Force unlike first to avoid dual state
      const name = currentUser || 'Khách';
      setUserLiked(false);
      setLikeCount((prev) => Math.max(prev - 1, 0));
      setLikePending(true);
      try {
        const { data } = await supabase
          .from("likes")
          .select("id")
          .eq("post_id", article.id)
          .eq("user_name", name)
          .single();
        if (data) {
          await supabase.from("likes").delete().eq("id", data.id);
        }
        const { count } = await supabase
          .from("likes")
          .select("*", { count: "exact", head: true })
          .eq("post_id", article.id);
        setLikeCount(count || 0);
      } catch (err) {
        console.error(err);
        setUserLiked(true);
      } finally {
        setLikePending(false);
      }
    }

    showToast(next ? 'Bạn đã dislike bài viết (lưu trên thiết bị).' : 'Đã bỏ dislike.', 'success');
  };

  // Admin handlers to directly set values
  const handleAdminUpdate = (field, value) => {
    const newValue = parseInt(value) || 0;
    if (field === 'views') setViews(newValue);
    if (field === 'likes') setLikes(newValue);
    if (field === 'dislikes') setDislikes(newValue);
    
    onUpdateArticle({ ...article, [field]: newValue });
  };

  const handleAddComment = async (content) => {
    const text = content?.trim();
    if (!text) return false;
    if (!supabase) { showToast('Chưa kết nối database.', 'error'); return false; }
    const postId = article?.id;
    if (!postId) return false;
    const authorName = currentUser || 'Ẩn danh';
    const cleanAvatar = sanitizeMediaUrl(currentAvatar);

    if (handleAddComment._pending) return false;
    handleAddComment._pending = true;
    setCommentSubmitting(true);

    const tempId = `tmp-${Date.now()}`;
    const optimisticComment = {
      id: tempId,
      post_id: postId,
      author: authorName,
      content: text,
      avatar: cleanAvatar || '',
      created_at: new Date().toISOString(),
      __optimistic: true,
    };

    setComments((prev) => [optimisticComment, ...(prev || [])]);

    try {
      const payload = { post_id: postId, author: authorName, content: text, avatar: cleanAvatar || null };
      let insertRes = await supabase
        .from('comments')
        .insert([payload])
        .select('*')
        .single();

      const shouldRetryAvatar =
        insertRes.error &&
        ((insertRes.error.code && ['PGRST204', '42703'].includes(insertRes.error.code)) ||
         (insertRes.error.message || '').toLowerCase().includes('avatar'));

      if (shouldRetryAvatar) {
        insertRes = await supabase
          .from('comments')
          .insert([{ post_id: postId, author: authorName, content: text }])
          .select('*')
          .single();
      }

      if (insertRes.error) throw insertRes.error;
      const saved = insertRes.data ? { ...insertRes.data, avatar: sanitizeMediaUrl(insertRes.data.avatar) || cleanAvatar || '' } : null;
      if (!saved) throw new Error('Missing comment data');

      setComments((prev) =>
        prev.map((c) => (c.id === tempId ? saved : c))
      );
      showToast('Gửi bình luận thành công!', 'success');
      return true;
    } catch (err) {
      console.error(err);
      setComments((prev) => prev.filter((c) => c.id !== tempId));
      showToast('Không gửi được bình luận, vui lòng thử lại.', 'error');
      return false;
    } finally {
      setCommentSubmitting(false);
      handleAddComment._pending = false;
    }
  };

  const handleDeleteComment = async (commentId) => {
      try {
        const { error } = await supabase.from("comments").delete().eq("id", commentId);
        if (error) throw error;
        setComments((prev) => (prev || []).filter(c => c.id !== commentId));
      } catch (err) {
        console.error(err);
        alert("Không xóa được bình luận, thử lại sau.");
      }
  };

  const relatedArticles = allArticles.filter(a => a.id !== article.id).slice(0, 2);

  return (
    <div className="page-transition-enter" style={{ maxWidth: '1200px', margin: '0 auto', padding: 'clamp(20px, 4vw, 40px) clamp(16px, 3vw, 24px) 80px', position: 'relative', zIndex: 10 }}>
      <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', padding: '10px 20px', borderRadius: '30px', color: '#e5e7eb', cursor: 'pointer', marginBottom: '32px', transition: 'all 0.3s ease', fontSize: '14px', fontWeight: '500', backdropFilter: 'blur(10px)' }} onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'; e.currentTarget.style.transform = 'translateX(-4px)'; }} onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'; e.currentTarget.style.transform = 'translateX(0)'; }}>
        <ArrowLeft size={18} /> Quay lại trang chủ
      </button>

      {/* --- ADMIN PANEL START --- */}
      {isAdmin && (
        <div className="admin-panel">
          <div className="admin-panel-header">
            <div className="admin-panel-title"><Edit3 size={18} /> Admin Control Panel</div>
            <button 
                onClick={() => { if(window.confirm("Bạn có chắc muốn xóa bài viết này không?")) onDeleteArticle(article.id); }}
                style={{ background: '#7f1d1d', color: '#fca5a5', border: '1px solid #991b1b', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}>
                <Trash2 size={14} /> Xóa bài viết
            </button>
          </div>
          <div className="admin-controls-grid">
            <div className="admin-input-group">
                <label className="admin-input-label">Lượt xem</label>
                <input className="admin-input" type="number" value={views} onChange={(e) => handleAdminUpdate('views', e.target.value)} />
            </div>
            <div className="admin-input-group">
                <label className="admin-input-label">Lượt thích</label>
                <input className="admin-input" type="number" value={likes} onChange={(e) => handleAdminUpdate('likes', e.target.value)} />
            </div>
            <div className="admin-input-group">
                <label className="admin-input-label">Dislike</label>
                <input className="admin-input" type="number" value={dislikes} onChange={(e) => handleAdminUpdate('dislikes', e.target.value)} />
            </div>
          </div>
        </div>
      )}
      {/* --- ADMIN PANEL END --- */}

      <FadeInSection>
        <div style={{ marginBottom: '32px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(147, 51, 234, 0.15)', color: BRAND.primaryHover, padding: '6px 16px', borderRadius: '20px', fontSize: '14px', fontWeight: '600', marginBottom: '16px', border: `1px solid ${BRAND.border}` }}>{getCategoryIcon(articleCategory)} {articleCategory}</div>
          <h1 style={{ fontSize: 'clamp(28px, 6vw, 40px)', fontWeight: '700', color: '#ffffff', lineHeight: '1.25', marginBottom: '18px' }}>{article.title}</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px', color: '#9ca3af', fontSize: '14px', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', paddingBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><User size={16} color="#a78bfa" /><span style={{ color: '#e5e7eb', fontWeight: '500' }}>{displayAuthor}</span></div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Calendar size={16} color="#a78bfa" /><span>{formatDate(article.created_at || article.date)}</span></div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Clock size={16} color="#a78bfa" /><span>{readingMinutes} phút đọc</span></div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><TrendingUp size={16} color="#a78bfa" /><span>{views.toLocaleString()} lượt xem</span></div>
      </div>
        </div>

        <div style={{ marginBottom: '40px' }}>
          {(coverImage || article.video) && (
            <div style={{ width: '100%', height: 'clamp(240px, 45vw, 500px)', borderRadius: '24px', overflow: 'hidden', marginBottom: '20px', boxShadow: '0 20px 60px rgba(0, 0, 0, 0.4)', border: '1px solid rgba(255, 255, 255, 0.1)', background: '#000' }}>
              {article.video ? (
                <video src={article.video} controls style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              ) : (
                <img src={coverImage} alt={article.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              )}
            </div>
          )}
           
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', padding: '16px 20px', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '16px', backdropFilter: 'blur(10px)' }}>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <span style={{ fontSize: '14px', color: '#9ca3af', marginRight: '8px', fontWeight: '500' }}>Chia sẻ:</span>
              <ShareButton
                icon={<FacebookIcon />}
                color="#1877F2"
                onClick={() => {
                  const url = encodeURIComponent(window.location.href);
                  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
                  const shareChannelUrl = `https://www.facebook.com/share_channel/?type=reshare&link=${encodeURIComponent(url)}&source_surface=external_reshare`;

                  if (isMobile) {
                    // Mở app Facebook (nếu có)
                    window.location.href = `fb://facewebmodal/f?href=${encodeURIComponent(shareChannelUrl)}`;

                    // fallback nếu không mở được app
                    setTimeout(() => {
                      window.open(shareChannelUrl, "_blank");
                    }, 1200);
                  } else {
                    window.open(shareChannelUrl, "_blank", "width=600,height=500");
                  }
                }}
              />
              <ShareButton icon={<TikTokIcon />} color="#000000" onClick={async () => {
                const url = window.location.href;
                const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
                await navigator.clipboard.writeText(url);
                if (isMobile) window.location.href = 'tiktok://';
                alert('✓ Đã copy link!');
                window.open('https://tiktok.com', '_blank', 'width=600,height=500');
              }} />
              <ShareButton icon={<SiZalo size={24} />} color="#1DA1F2" onClick={() => {
                const url = window.location.href;
                const shareUrl = `https://zalo.me/share/v2?link=${encodeURIComponent(url)}`;
                window.open(shareUrl, '_blank', 'width=600,height=500');
              }} />
              <button onClick={handleCopyLink} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0 16px', height: '40px', background: copied ? 'rgba(34, 197, 94, 0.15)' : 'rgba(255, 255, 255, 0.05)', border: copied ? '1px solid rgba(34, 197, 94, 0.3)' : '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '20px', color: copied ? '#4ade80' : '#e5e7eb', fontSize: '13px', fontWeight: '500', cursor: 'pointer', transition: 'all 0.2s ease' }}>
                {copied ? <Check size={16} /> : <LinkIcon size={16} />} {copied ? 'Đã sao chép' : 'Sao chép link'}
              </button>
            </div>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <button onClick={handleLike} disabled={likePending} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', background: userLiked ? 'rgba(34, 197, 94, 0.18)' : 'transparent', border: `1px solid ${userLiked ? 'rgba(34,197,94,0.4)' : 'rgba(255,255,255,0.1)'}`, borderRadius: '20px', color: userLiked ? '#22c55e' : '#9ca3af', cursor: likePending ? 'not-allowed' : 'pointer', transition: 'all 0.2s', opacity: likePending ? 0.65 : 1 }}>
                    <ThumbsUp size={18} fill={userLiked ? "currentColor" : "none"} /> <span>{likeCount}</span>
                </button>
                <button onClick={handleDislike} disabled={likePending} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', background: userDisliked ? 'rgba(239, 68, 68, 0.15)' : 'transparent', border: `1px solid ${userDisliked ? '#ef4444' : 'rgba(255,255,255,0.1)'}`, borderRadius: '20px', color: userDisliked ? '#f87171' : '#9ca3af', cursor: likePending ? 'not-allowed' : 'pointer', transition: 'all 0.2s', opacity: likePending ? 0.65 : 1 }}>
                    <ThumbsDown size={18} fill={userDisliked ? "currentColor" : "none"} />
                </button>
            </div>
          </div>
        </div>

        <div style={{ fontSize: '18px', lineHeight: '1.6', color: '#e2e8f0', background: 'rgba(17, 24, 39, 0.4)', backdropFilter: 'blur(12px)', padding: '40px', borderRadius: '24px', border: '1px solid rgba(255, 255, 255, 0.05)', boxShadow: '0 4px 20px rgba(0,0,0,0.2)', marginBottom: 'clamp(32px, 6vw, 56px)' }} className="article-content">
          {article.content ? (<div dangerouslySetInnerHTML={{ __html: enhanceLinks(article.content) }} />) : (<><p style={{ marginBottom: '20px' }}>Nội dung chi tiết của bài viết...</p></>)}
          {article.sources && article.sources.length > 0 && (
            <div style={{ marginTop: '40px', paddingTop: '20px', borderTop: '1px dashed rgba(255,255,255,0.1)' }}>
               <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#9ca3af', marginBottom: '12px' }}>Nguồn tham khảo:</h4>
               <ul style={{ listStyle: 'disc', paddingLeft: '20px', color: '#6b7280', fontSize: '14px' }}>
                  {article.sources.map((src, i) => (<li key={i} style={{ marginBottom: '4px' }}>{src}</li>))}
               </ul>
            </div>
          )}
        </div>
      </FadeInSection>
       
      <FadeInSection delay={100}><SurveySection /></FadeInSection>
      <FadeInSection delay={200}>
        <CommentSection
          comments={comments}
          onAddComment={handleAddComment}
          isAdmin={isAdmin}
          onDeleteComment={handleDeleteComment}
          isLoading={commentsLoading}
          isSubmitting={commentSubmitting}
          currentUser={currentUser}
          currentAvatar={currentAvatar}
        />
      </FadeInSection>

      <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)', paddingTop: '40px', marginTop: '60px' }}>
        <h3 style={{ fontSize: '28px', fontWeight: '700', color: '#f9fafb', marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          Tin liên quan <div style={{ flex: 1, height: '1px', background: 'rgba(255, 255, 255, 0.1)' }} />
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '32px' }}>
          {relatedArticles.map((relArticle, idx) => (
             <FadeInSection key={relArticle.id} delay={idx * 100}>
                <NewsArticle {...relArticle} onClick={() => onArticleClick(relArticle)} />
             </FadeInSection>
          ))}
        </div>
      </div>
      {toast && (
        <div style={{ position: 'fixed', right: '20px', bottom: '20px', padding: '12px 16px', background: toast.type === 'success' ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)', border: `1px solid ${toast.type === 'success' ? 'rgba(34,197,94,0.4)' : 'rgba(239,68,68,0.4)'}`, color: '#e5e7eb', borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.45)', zIndex: 20000, backdropFilter: 'blur(10px)' }}>
          {toast.message}
        </div>
      )}
    </div>
  );
};

const ArticleDetailRoute = ({ posts, ambientIntensity, scrollY, currentUser, currentAvatar, onSyncArticleViews }) => {
  const { id: paramId } = useParams();
  const navigate = useNavigate();
  const queryId = typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('id') : null;
  const id = paramId || queryId;
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    const load = async () => {
      try {
        if (!id) throw new Error("missing id");
        const baseQuery = supabase.from("posts").select("*");
        let res;
        if (typeof baseQuery.eq === "function") {
          res = await baseQuery.eq("id", id).single();
        } else {
          const { data, error } = await supabase.from("posts").select("*");
          if (error) throw error;
          const match = (data || []).find((row) => String(row.id) === String(id)) || null;
          res = { data: match, error: match ? null : { message: "not found" } };
        }
        if (!mounted) return;
        if (!res.error && res.data) {
          setArticle(normalizePost(res.data));
          return;
        }
        // Fallback: try find from current state (stub/local dev)
        const fallback = (posts || []).find((p) => String(p.id) === String(id)) || null;
        setArticle(fallback ? normalizePost(fallback) : null);
      } catch (err) {
        if (!mounted) return;
        console.error(err);
        const fallback = (posts || []).find((p) => String(p.id) === String(id)) || null;
        setArticle(fallback ? normalizePost(fallback) : null);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, [id]);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#050505', color: '#f9fafb', position: 'relative' }}>
        <AmbientBackground ambientIntensity={ambientIntensity} scrollY={scrollY} />
        <div style={{ padding: '40px', position: 'relative', zIndex: 2 }}>Đang tải bài viết...</div>
      </div>
    );
  }

  if (!article) {
    return (
      <div style={{ minHeight: '100vh', background: '#050505', color: '#f9fafb', position: 'relative' }}>
        <AmbientBackground ambientIntensity={ambientIntensity} scrollY={scrollY} />
        <div style={{ padding: '40px', position: 'relative', zIndex: 2 }}>Không tìm thấy bài viết</div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#050505', color: '#f9fafb', position: 'relative', overflowX: 'hidden' }}>
      <AmbientBackground ambientIntensity={ambientIntensity} scrollY={scrollY} />
      <div style={{ position: 'relative', zIndex: 2 }}>
        <ArticleDetail
          article={article}
          onBack={() => { navigate('/'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          allArticles={posts}
          onArticleClick={(next) => navigate(`/post/${next.id}`)}
          onUpdateArticle={(updated) => { 
            setArticle(updated); /* keep detail in sync */ 
            if (updated?.id && onSyncArticleViews) {
              const nextViews = updated.view_count ?? updated.views ?? 0;
              onSyncArticleViews(updated.id, nextViews);
            }
          }}
          isAdmin={false}
          onDeleteArticle={() => {}}
          onDeleteComment={() => {}}
          currentUser={currentUser}
          currentAvatar={currentAvatar}
        />
      </div>
    </div>
  );
};

// 5. Video Showcase - FIX GLOW WITH MICRO-ANIMATION TO PREVENT CLIPPING
const VideoShowcase = () => {
  const videoRef = useRef(null);
  const glowRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const videoUrl = "https://github.com/SniffenBaka/KDC/releases/download/v2/video.mp4";

  // --- NEW LOADING STATE ---
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const current = videoRef.current.currentTime;
      const duration = videoRef.current.duration;
      if (duration) {
        setProgress((current / duration) * 100);
      }
    }
  };

  const toggleMute = () => setIsMuted(!isMuted);

  // --- NEW VIDEO HANDLERS ---
  const handleLoadStart = () => setIsLoading(true);
  const handleCanPlay = () => setIsLoading(false);
  const handleWaiting = () => setIsLoading(true); // Khi mạng yếu, video buffer
  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  // Safe Play Logic
  useEffect(() => {
    const mainVid = videoRef.current;
    const glowVid = glowRef.current;
    if (!mainVid || !glowVid) return;

    const safePlay = async (video) => {
        try { await video.play(); } 
        catch (err) { if (err.name !== 'AbortError') console.error("Playback failed", err); }
    };

    const syncPlay = () => safePlay(glowVid);
    const syncPause = () => glowVid.pause();

    mainVid.addEventListener('play', syncPlay);
    mainVid.addEventListener('pause', syncPause);
    mainVid.addEventListener('waiting', syncPause);
    mainVid.addEventListener('playing', syncPlay);

    if (!mainVid.paused) safePlay(glowVid);

    return () => {
        mainVid.removeEventListener('play', syncPlay);
        mainVid.removeEventListener('pause', syncPause);
        mainVid.removeEventListener('waiting', syncPause);
        mainVid.removeEventListener('playing', syncPlay);
    };
  }, []);

  useEffect(() => { if (videoRef.current) videoRef.current.muted = isMuted; }, [isMuted]);
   
  // Time Sync
  useEffect(() => {
      let rafId;
      const syncTime = () => {
          if (videoRef.current && glowRef.current && !videoRef.current.paused) {
              const diff = Math.abs(videoRef.current.currentTime - glowRef.current.currentTime);
              if (diff > 0.15) { 
                  glowRef.current.currentTime = videoRef.current.currentTime;
              }
          }
          rafId = requestAnimationFrame(syncTime);
      };
      syncTime();
      return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <div 
      id="video-section" 
      onMouseEnter={() => setIsHovered(true)} 
      onMouseLeave={() => setIsHovered(false)} 
      style={{ 
        position: 'relative', 
        width: '100%', 
        maxWidth: '900px', 
        margin: '0 auto', 
        zIndex: 1 
      }}
    >
      {/* GLOW LAYER - FIX: Larger size, no overflow hidden, forced GPU, and micro-animation */}
      <div style={{
        position: 'absolute',
        top: '1%', // Extended top
        left: '2%', // Extended left
        width: '95%', // Larger than container
        height: '103%', // Larger than container
        zIndex: -1,
        opacity: 0.9,
        // The magic sauce: translate3d forces GPU, scale makes it big, blur makes it glow
        transform: 'translate3d(0,0,0) scale(1.08)', 
        filter: 'blur(40px) saturate(1.5)',
        transition: 'all 0.5s ease',
        // Anti-clipping animation to force continuous repaint
        animation: 'antiClip 0.1s infinite alternate',
        pointerEvents: 'none' // Click-through
      }}>
         <video 
            ref={glowRef} 
            src={videoUrl} 
            muted 
            loop 
            playsInline 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
         />
      </div>

      {/* MAIN VIDEO CONTAINER */}
      <div style={{
        position: 'relative',
        borderRadius: '20px',
        overflow: 'hidden',
        background: '#000', // Black background for loading state
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: isHovered ? '0 10px 30px rgba(0,0,0,0.5)' : '0 5px 15px rgba(0,0,0,0.3)',
        transition: 'transform 0.5s ease',
        transform: isHovered ? 'scale(1.01)' : 'scale(1)',
        aspectRatio: '16/9'
      }}>
        {/* === LOADING / ERROR OVERLAY === */}
        {/* Style: Minimalist, centered vector, black background */}
        {(isLoading || hasError) && (
          <div style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#000', // Solid black to hide the poster flickering
            zIndex: 20,
            transition: 'opacity 0.3s'
          }}>
            {hasError ? (
              <VideoOff size={32} color="#ef4444" style={{ opacity: 0.6 }} />
            ) : (
              <Loader2 size={40} color="#a78bfa" style={{ animation: 'spin 1s linear infinite' }} />
            )}
          </div>
        )}

        <video 
          ref={videoRef} 
          src={videoUrl} 
          onTimeUpdate={handleTimeUpdate} 
          // New Event Handlers
          onLoadStart={handleLoadStart}
          onWaiting={handleWaiting}
          onCanPlay={handleCanPlay}
          onLoadedData={handleCanPlay}
          onError={handleError}
          
          autoPlay 
          loop 
          muted={isMuted} 
          playsInline 
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} 
        />

        {/* CONTROLS - Only show when video is ready */}
        {!isLoading && !hasError && (
          <>
            <button onClick={toggleMute} style={{ position: 'absolute', top: '20px', right: '20px', background: 'rgba(0, 0, 0, 0.4)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#fff', backdropFilter: 'blur(4px)', transition: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)', padding: 0, opacity: isHovered ? 1 : 0, transform: isHovered ? 'scale(1)' : 'scale(0.8)', pointerEvents: isHovered ? 'auto' : 'none', zIndex: 10 }} onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(0, 0, 0, 0.6)'} onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(0, 0, 0, 0.4)'}>
              {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
            </button>
            <div style={{ position: 'absolute', bottom: '20px', left: '20px', right: '20px', display: 'flex', gap: '12px', alignItems: 'center' }}>
              <div style={{ flex: 1, height: '4px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '2px', overflow: 'hidden' }}>
                <div style={{ height: '100%', background: PRIMARY_GRADIENT, width: `${progress}%`, transition: 'width 100ms linear' }} />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// 8. Welcome Modal for first-time users
const WelcomeModal = ({ isOpen, initialName = '', onSubmit }) => {
  const [name, setName] = useState(initialName);

  useEffect(() => {
    if (isOpen) setName(initialName || '');
  }, [isOpen, initialName]);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    onSubmit(trimmed);
  };

  const isDisabled = !name.trim();

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 12000, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(12px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ width: '100%', maxWidth: '420px', background: '#0b0b10', border: '1px solid rgba(139, 92, 246, 0.35)', borderRadius: '24px', padding: '40px 32px', textAlign: 'center', boxShadow: '0 0 50px rgba(139, 92, 246, 0.15)', animation: 'slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1)' }}>
        <div style={{ width: '80px', height: '80px', margin: '0 auto 24px', borderRadius: '20px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)' }}>
            <img src={BRAND.logo} alt="Eight Ducks" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
        <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#fff', marginBottom: '10px' }}>Chào bạn mới!</h2>
        <p style={{ color: '#a1a1aa', marginBottom: '28px', lineHeight: '1.5' }}>Chào mừng đến với Eight Ducks.<br/>Chúng mình nên gọi bạn là gì nhỉ?</p>
        
        <div style={{ marginBottom: '24px' }}>
          <input 
            autoFocus
            type="text" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && !isDisabled) { e.preventDefault(); handleSubmit(); } }}
            placeholder="Nhập tên hoặc biệt danh..."
            style={{ width: '100%', padding: '16px', borderRadius: '12px', background: '#18181b', border: '1px solid #27272a', color: '#fff', fontSize: '16px', textAlign: 'center', outline: 'none', transition: 'border 0.2s' }}
            onFocus={(e) => e.target.style.borderColor = BRAND.primary}
            onBlur={(e) => e.target.style.borderColor = '#27272a'}
          />
        </div>
        
        <button
          onClick={handleSubmit}
          disabled={isDisabled}
          style={{ 
            width: '100%', 
            padding: '14px 20px', 
            borderRadius: '10px', 
            background: isDisabled ? '#27272a' : PRIMARY_GRADIENT,
            border: 'none', 
            color: isDisabled ? '#52525b' : '#fff',
            fontSize: '15px', 
            fontWeight: 600, 
            cursor: isDisabled ? 'not-allowed' : 'pointer',
            boxShadow: isDisabled ? 'none' : `0 10px 30px ${BRAND.soft}`,
            opacity: isDisabled ? 0.5 : 1,
            transition: 'all 0.3s'
          }}
          onMouseEnter={(e) => { 
  if (!isDisabled) {
    e.currentTarget.style.background = `linear-gradient(90deg, ${BRAND.primaryHover} 0%, ${BRAND.primary} 100%)`;
    e.currentTarget.style.transform = 'translateY(-2px)';
    e.currentTarget.style.boxShadow = `0 15px 45px rgba(139, 92, 246, 0.35)`;
    e.currentTarget.style.letterSpacing = '0.5px';
  }
}}
onMouseLeave={(e) => { 
  if (!isDisabled) {
    e.currentTarget.style.background = PRIMARY_GRADIENT;
    e.currentTarget.style.transform = 'translateY(0)';
    e.currentTarget.style.boxShadow = `0 10px 30px ${BRAND.soft}`;
    e.currentTarget.style.letterSpacing = '0px';
  }
}}
        >
          Bắt đầu khám phá
        </button>
      </div>
    </div>
  );
};

// 9. Create Post Modal - UPDATED WITH RICH TEXT EDITOR
const CreatePostModal = ({ isOpen, onClose, onPost }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('Tình cảm tuổi học trò');
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null); // Reference for hidden file input
  const inlineImageInputRef = useRef(null);
  const editorRef = useRef(null);
  const [formatState, setFormatState] = useState({ bold: false, italic: false, underline: false, ul: false });

  // Reset form on open
  useEffect(() => {
    if (isOpen) {
        setTitle('');
        setContent('');
        setCategory('Tình cảm tuổi học trò');
        setFile(null);
        if (editorRef.current) editorRef.current.innerHTML = '';
        setFormatState({ bold: false, italic: false, underline: false, ul: false });
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onSelection = () => refreshFormatState();
    document.addEventListener('selectionchange', onSelection);
    return () => document.removeEventListener('selectionchange', onSelection);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = () => { setIsDragging(false); };
  const handleDrop = (e) => { e.preventDefault(); setIsDragging(false); if (e.dataTransfer.files && e.dataTransfer.files[0]) { setFile(e.dataTransfer.files[0]); } };
  
  // Handle file selection from explorer
  const handleFileSelect = (e) => {
      if (e.target.files && e.target.files[0]) {
          setFile(e.target.files[0]);
      }
  };

  const normalizeEditorDom = () => {
    if (!editorRef.current) return;
    if (hasInvalidEditorDom(editorRef.current)) {
      const blocks = extractBlocksFromHtml(editorRef.current.innerHTML, editorRef.current.textContent || '');
      editorRef.current.innerHTML = '';
      blocks.forEach((b) => editorRef.current.appendChild(b));
    }
  };

  const syncContent = () => {
    if (!editorRef.current) return;
    setContent(editorRef.current.innerHTML);
  };

  const normalizeAndSyncContent = () => {
    if (!editorRef.current) return;
    normalizeEditorDom();
    setContent(editorRef.current.innerHTML);
  };

  const applyCommand = (command, value = null) => {
    if (!editorRef.current) return;
    editorRef.current.focus();
    document.execCommand(command, false, value);
    syncContent();
    refreshFormatState();
  };

  const handleCreateLink = () => {
    if (!editorRef.current) return;
    const url = prompt('Dán link (https://...)');
    if (!url) return;
    editorRef.current.focus();
    document.execCommand('createLink', false, url);
    const selection = window.getSelection();
    const anchor = selection?.anchorNode?.parentElement?.closest('a');
    if (anchor) {
      anchor.target = '_blank';
      anchor.rel = 'noopener noreferrer';
      anchor.classList.add('article-link');
    }
    syncContent();
    refreshFormatState();
  };

  const insertImageBlock = ({ src, name = 'image', caption = '', focusCaption = true } = {}) => {
    if (!editorRef.current || !src) return;
    const wrapper = document.createElement('div');
    wrapper.className = 'image-block';
    const span = document.createElement('span');
    span.className = 'inline-image-placeholder';
    span.setAttribute('contenteditable', 'false');
    span.setAttribute('data-img', src);
    span.textContent = name || 'image';

    const captionBlock = document.createElement('div');
    captionBlock.className = 'image-caption-block';
    captionBlock.setAttribute('contenteditable', 'true');
    captionBlock.setAttribute('data-placeholder', 'Nh\u1eadp ch\u00fa th\u00edch \u1ea3nh...');
    captionBlock.textContent = caption || '';

    const breakBlock = document.createElement('p');
    breakBlock.innerHTML = '<br/>';

    const sel = window.getSelection();
    const range = sel && sel.rangeCount ? sel.getRangeAt(0) : null;
    wrapper.append(span, captionBlock, breakBlock);

    const anchorEl = sel?.anchorNode?.nodeType === Node.ELEMENT_NODE
      ? sel.anchorNode
      : sel?.anchorNode?.parentElement;
    const parentImageBlock = anchorEl?.closest?.('.image-block');

    if (parentImageBlock) {
      parentImageBlock.insertAdjacentElement('afterend', wrapper);
    } else if (range) {
      range.deleteContents();
      range.insertNode(wrapper);
    } else {
      editorRef.current.append(wrapper);
    }

    if (sel) {
      const nextRange = document.createRange();
      if (focusCaption) nextRange.setStart(captionBlock, 0);
      else nextRange.setStart(breakBlock, 0);
      nextRange.collapse(true);
      sel.removeAllRanges();
      sel.addRange(nextRange);
    }

    syncContent();
    refreshFormatState();
  };

  const handleInlineImageInsert = async (chosenFile) => {
    if (!chosenFile) return;
    try {
      const url = await uploadFile('content', chosenFile);
      const fileName = chosenFile.name || 'image.png';
      if (url) {
        insertImageBlock({ src: url, name: fileName, caption: '', focusCaption: true });
      }
    } catch (err) {
      console.error('Upload inline image failed', err);
      alert('Không upload được ảnh, vui lòng thử lại.');
    }
  };

  const handleInlineImagePick = (e) => {
    const chosen = e.target.files && e.target.files[0];
    if (chosen) handleInlineImageInsert(chosen);
    e.target.value = '';
  };

  const buildFigureBlock = (src, caption = '') => {
    const fig = document.createElement('figure');
    fig.className = 'article-figure';
    fig.setAttribute('data-img', src);
    const img = document.createElement('img');
    img.src = src;
    img.alt = '';
    const cap = document.createElement('figcaption');
    cap.setAttribute('contenteditable', 'true');
    cap.className = 'image-caption';
    cap.setAttribute('data-placeholder', 'Nh\u1eadp ch\u00fa th\u00edch \u1ea3nh...');
    cap.textContent = caption || '';
    fig.append(img, cap);
    return fig;
  };

  const buildParagraphsFromText = (text = '') => {
    const blocks = [];
    const normalized = String(text).replace(/\r\n?/g, '\n');
    const parts = normalized.split(/\n{2,}/);
    parts.forEach((part) => {
      const lines = part.split('\n');
      const p = document.createElement('p');
      lines.forEach((line, idx) => {
        const cleaned = line.replace(/[ \t]+/g, ' ');
        if (cleaned) p.appendChild(document.createTextNode(cleaned));
        if (idx < lines.length - 1) p.appendChild(document.createElement('br'));
      });
      if (p.textContent || p.querySelector('br')) blocks.push(p);
    });
    return blocks;
  };

  const extractBlocksFromHtml = (html = '', fallbackText = '') => {
    const blocks = [];
    if (!html) return buildParagraphsFromText(fallbackText);
    const doc = new DOMParser().parseFromString(html, 'text/html');
    doc.querySelectorAll('script,style,iframe,noscript,meta').forEach((n) => n.remove());

    const appendInline = (node, parent) => {
      if (node.nodeType === Node.TEXT_NODE) {
        const parts = node.textContent.split('\n');
        parts.forEach((part, idx) => {
          if (part) parent.appendChild(document.createTextNode(part));
          if (idx < parts.length - 1) parent.appendChild(document.createElement('br'));
        });
        return;
      }
      if (node.nodeType !== Node.ELEMENT_NODE) return;
      const tag = node.tagName;
      if (tag === 'BR') {
        parent.appendChild(document.createElement('br'));
        return;
      }
      if (tag === 'SPAN' && node.classList.contains('inline-image-placeholder')) {
        const src = sanitizeMediaUrl(node.getAttribute('data-img') || '');
        if (!src) return;
        const name = node.textContent?.trim() || 'image';
        const span = document.createElement('span');
        span.className = 'inline-image-placeholder';
        span.setAttribute('contenteditable', 'false');
        span.setAttribute('data-img', src);
        span.textContent = name;
        parent.appendChild(span);
        return;
      }
      if (tag === 'DIV' && node.classList.contains('image-caption-block')) {
        const caption = document.createElement('div');
        caption.className = 'image-caption-block';
        caption.setAttribute('contenteditable', 'true');
        caption.setAttribute('data-placeholder', 'Nhập chú thích ảnh...');
        caption.textContent = node.textContent || '';
        parent.appendChild(caption);
        return;
      }
      if (tag === 'A') {
        const href = node.getAttribute('href') || '';
        if (!/^https?:\/\//i.test(href)) {
          Array.from(node.childNodes).forEach((child) => appendInline(child, parent));
          return;
        }
        const a = document.createElement('a');
        a.setAttribute('href', href);
        a.setAttribute('target', '_blank');
        a.setAttribute('rel', 'noopener noreferrer');
        Array.from(node.childNodes).forEach((child) => appendInline(child, a));
        parent.appendChild(a);
        return;
      }
      if (['B', 'STRONG', 'I', 'EM', 'U'].includes(tag)) {
        const el = document.createElement(tag.toLowerCase());
        Array.from(node.childNodes).forEach((child) => appendInline(child, el));
        parent.appendChild(el);
        return;
      }
      Array.from(node.childNodes).forEach((child) => appendInline(child, parent));
    };

    const pushParagraphText = (text) => {
      if (!text) return;
      buildParagraphsFromText(text).forEach((p) => blocks.push(p));
    };

    const handleImage = (img, caption = '') => {
      const src = sanitizeMediaUrl(img.getAttribute('src') || '');
      if (src) blocks.push(buildFigureBlock(src, caption));
    };

    const handleList = (node) => {
      const list = document.createElement(node.tagName.toLowerCase());
      Array.from(node.children).forEach((child) => {
        if (child.tagName !== 'LI') return;
        const li = document.createElement('li');
        Array.from(child.childNodes).forEach((c) => {
          if (c.nodeType === Node.ELEMENT_NODE && (c.tagName === 'UL' || c.tagName === 'OL')) {
            const nested = handleList(c);
            if (nested) li.appendChild(nested);
          } else {
            appendInline(c, li);
          }
        });
        if (li.textContent || li.querySelector('br') || li.querySelector('ul,ol')) list.appendChild(li);
      });
      if (list.childNodes.length) blocks.push(list);
    };

    const handleTable = (node) => {
      const table = document.createElement('table');
      node.querySelectorAll('tr').forEach((row) => {
        const tr = document.createElement('tr');
        row.querySelectorAll('th,td').forEach((cell) => {
          const td = document.createElement(cell.tagName.toLowerCase());
          Array.from(cell.childNodes).forEach((c) => appendInline(c, td));
          if (td.textContent || td.querySelector('br')) tr.appendChild(td);
        });
        if (tr.childNodes.length) table.appendChild(tr);
      });
      if (table.childNodes.length) blocks.push(table);
    };

    const walk = (node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        pushParagraphText(node.textContent);
        return;
      }
      if (node.nodeType !== Node.ELEMENT_NODE) return;
      const tag = node.tagName;
      if (tag === 'FIGURE') {
        const img = node.querySelector('img');
        const caption = node.querySelector('figcaption')?.textContent
          || img?.getAttribute('alt')
          || '';
        if (img) {
          const src = sanitizeMediaUrl(img.getAttribute('src') || '');
          if (src) {
            const span = document.createElement('span');
            span.className = 'inline-image-placeholder';
            span.setAttribute('contenteditable', 'false');
            span.setAttribute('data-img', src);
            span.textContent = img.getAttribute('alt') || 'image';
            const p = document.createElement('p');
            p.appendChild(span);
            blocks.push(p);
            const cap = document.createElement('div');
            cap.className = 'image-caption-block';
            cap.setAttribute('contenteditable', 'true');
            cap.setAttribute('data-placeholder', 'Nhập chú thích ảnh...');
            cap.textContent = caption.trim();
            blocks.push(cap);
          }
        }
        return;
      }
      if (tag === 'IMG') {
        const src = sanitizeMediaUrl(node.getAttribute('src') || '');
        if (src) {
          const caption = node.getAttribute('alt') || '';
          const span = document.createElement('span');
          span.className = 'inline-image-placeholder';
          span.setAttribute('contenteditable', 'false');
          span.setAttribute('data-img', src);
          span.textContent = node.getAttribute('alt') || 'image';
          const p = document.createElement('p');
          p.appendChild(span);
          blocks.push(p);
          const cap = document.createElement('div');
          cap.className = 'image-caption-block';
          cap.setAttribute('contenteditable', 'true');
          cap.setAttribute('data-placeholder', 'Nhập chú thích ảnh...');
          cap.textContent = caption.trim();
          blocks.push(cap);
        }
        return;
      }
      if (tag === 'DIV' && node.classList.contains('image-caption-block')) {
        const cap = document.createElement('div');
        cap.className = 'image-caption-block';
        cap.setAttribute('contenteditable', 'true');
        cap.setAttribute('data-placeholder', 'Nhập chú thích ảnh...');
        cap.textContent = node.textContent || '';
        blocks.push(cap);
        return;
      }
      if (tag === 'P' || tag === 'DIV') {
        const p = document.createElement('p');
        Array.from(node.childNodes).forEach((child) => appendInline(child, p));
        if (p.textContent || p.querySelector('br')) blocks.push(p);
        return;
      }
      if (tag === 'BR') {
        pushParagraphText('\n\n');
        return;
      }
      if (tag === 'UL' || tag === 'OL') {
        handleList(node);
        return;
      }
      if (tag === 'TABLE') {
        handleTable(node);
        return;
      }
      Array.from(node.childNodes).forEach(walk);
    };

    Array.from(doc.body.childNodes).forEach(walk);
    return blocks.length ? blocks : buildParagraphsFromText(doc.body.textContent || fallbackText);
  };

  const insertBlocksAtSelection = (blocks) => {
    if (!editorRef.current) return;
    const sel = window.getSelection();
    const range = sel && sel.rangeCount ? sel.getRangeAt(0) : null;
    if (!range) {
      blocks.forEach((b) => editorRef.current.appendChild(b));
      const last = blocks[blocks.length - 1];
      if (last && last.tagName === 'FIGURE') {
        const cap = last.querySelector('figcaption');
        if (cap) {
          const r = document.createRange();
          r.setStart(cap, 0);
          r.collapse(true);
          sel.removeAllRanges();
          sel.addRange(r);
        }
      }
      return;
    }
    range.deleteContents();
    blocks.forEach((block) => {
      range.insertNode(block);
      range.setStartAfter(block);
      range.collapse(true);
    });
    const last = blocks[blocks.length - 1];
    if (last && last.tagName === 'FIGURE') {
      const cap = last.querySelector('figcaption');
      if (cap) {
        const r = document.createRange();
        r.setStart(cap, 0);
        r.collapse(true);
        sel.removeAllRanges();
        sel.addRange(r);
        return;
      }
    }
    sel.removeAllRanges();
    sel.addRange(range);
  };

  const hasInvalidEditorDom = (root) => {
    if (!root) return false;
    if (root.querySelector('p img, p figure, span img, div img, figure figure')) return true;
    if (Array.from(root.childNodes).some((n) => n.nodeType === Node.TEXT_NODE && n.textContent.trim())) return true;
    if (Array.from(root.querySelectorAll('img')).some((img) => !img.closest('figure'))) return true;
    if (Array.from(root.querySelectorAll('figure')).some((fig) => !fig.querySelector('figcaption'))) return true;
    const allowed = new Set(['P', 'FIGURE', 'UL', 'OL', 'TABLE']);
    return Array.from(root.childNodes).some((n) => {
      if (n.nodeType !== Node.ELEMENT_NODE) return false;
      if (allowed.has(n.tagName)) return false;
      if (n.tagName === 'DIV' && (n.classList.contains('image-block') || n.classList.contains('image-caption-block'))) {
        return false;
      }
      return true;
    });
  };

  const sanitizeInlineImages = (html = '') => {
    if (!html) return '';
    const wrapper = document.createElement('div');
    wrapper.innerHTML = html;

    // Remove disallowed tags
    wrapper.querySelectorAll('script,style,iframe,noscript').forEach((n) => n.remove());

    // Normalize figures/images
    wrapper.querySelectorAll('figure').forEach((fig) => {
      const img = fig.querySelector('img');
      if (!img) { fig.remove(); return; }
      const src = img.getAttribute('src') || '';
      const alt = img.getAttribute('alt') || '';
      const captionText = fig.querySelector('figcaption')?.textContent || '';
      const newFig = document.createElement('figure');
      newFig.className = 'article-figure';
      newFig.setAttribute('data-img', src);
      const newImg = document.createElement('img');
      newImg.src = src;
      newImg.alt = alt;
      const newCap = document.createElement('figcaption');
      newCap.setAttribute('contenteditable', 'true');
      newCap.className = 'image-caption';
      newCap.setAttribute('data-placeholder', 'Nh\u1eadp ch\u00fa th\u00edch \u1ea3nh...');
      newCap.textContent = captionText;
      newFig.append(newImg, newCap);
      fig.replaceWith(newFig);
    });

    // Images not wrapped -> wrap
    wrapper.querySelectorAll('img').forEach((img) => {
      if (img.closest('figure')) return;
      const src = img.getAttribute('src') || '';
      const alt = img.getAttribute('alt') || '';
      const fig = document.createElement('figure');
      fig.className = 'article-figure';
      fig.setAttribute('data-img', src);
      const newImg = document.createElement('img');
      newImg.src = src;
      newImg.alt = alt;
      const cap = document.createElement('figcaption');
      cap.setAttribute('contenteditable', 'true');
      cap.className = 'image-caption';
      cap.setAttribute('data-placeholder', 'Nh\u1eadp ch\u00fa th\u00edch \u1ea3nh...');
      fig.append(newImg, cap);
      img.replaceWith(fig);
    });

    return wrapper.innerHTML;
  };

  const handleEditorInput = (e) => {
    const raw = e.currentTarget.innerHTML;
    const current = editorRef.current ? editorRef.current.innerHTML : raw;
    const plain = current.replace(/<[^>]*>/g, '').trim();
    if (!plain && editorRef.current && !editorRef.current.textContent.trim()) {
      editorRef.current.innerHTML = '';
    }
    setContent(editorRef.current ? editorRef.current.innerHTML : current);
    refreshFormatState();
  };

  const handleInsertTable = () => {
    if (!editorRef.current) return;
    const rows = parseInt(prompt('Số dòng? (>=1)', '2'), 10);
    const cols = parseInt(prompt('Số cột? (>=1)', '2'), 10);
    if (!rows || rows < 1 || !cols || cols < 1) return;
    const headerCells = Array.from({ length: cols }).map((_, idx) => `<th style="border:1px solid #27272a; padding:8px;">Tiêu đề ${idx + 1}</th>`).join('');
    const bodyRows = Array.from({ length: rows }).map(() => {
      const cells = Array.from({ length: cols }).map(() => `<td style="border:1px solid #27272a; padding:8px;">Nội dung</td>`).join('');
      return `<tr>${cells}</tr>`;
    }).join('');
    const tableHtml = `<table style="width:100%; border-collapse:collapse; margin:10px 0;">${headerCells ? `<tr>${headerCells}</tr>` : ''}${bodyRows}</table><p><br/></p>`;
    editorRef.current.focus();
    document.execCommand('insertHTML', false, tableHtml);
    syncContent();
    refreshFormatState();
  };

  const refreshFormatState = () => {
    setFormatState({
      bold: document.queryCommandState('bold'),
      italic: document.queryCommandState('italic'),
      underline: document.queryCommandState('underline'),
      ul: document.queryCommandState('insertUnorderedList')
    });
  };

  // Handle Post Submission
  const handleSubmit = async () => {
    let contentToSubmit = content;
    if (editorRef.current) {
      normalizeAndSyncContent();
      contentToSubmit = editorRef.current.innerHTML;
    }
    const cleanText = contentToSubmit.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    if (!title.trim() || !cleanText) {
      alert("Vui lòng nhập tiêu đề và nội dung bài viết!");
      return;
    }

    const isVideo = file && file.type && file.type.startsWith('video');
    let coverUrl = 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&h=600&fit=crop';
    if (file) {
      try {
        coverUrl = await uploadFile(isVideo ? 'videos' : 'covers', file);
      } catch (err) {
        console.error('Upload cover failed', err);
        alert('Không tải được ảnh/video bìa, vui lòng thử lại.');
        return;
      }
    }
    const excerptText = cleanText.length > 140 ? `${cleanText.substring(0, 140)}...` : cleanText;

    const contentWithFigures = (() => {
      const wrapper = document.createElement('div');
      wrapper.innerHTML = contentToSubmit;

      const placeholders = Array.from(wrapper.querySelectorAll('span.inline-image-placeholder[data-img]'));
      placeholders.forEach((span) => {
        const src = span.getAttribute('data-img') || '';
        if (!src) return;
        const captionBlock = span.nextElementSibling && span.nextElementSibling.classList.contains('image-caption-block')
          ? span.nextElementSibling
          : null;
        const captionText = captionBlock ? captionBlock.textContent.trim() : '';
        const fig = document.createElement('figure');
        fig.className = 'article-figure';
        const img = document.createElement('img');
        img.src = src;
        img.alt = span.textContent.trim() || '';
        const cap = document.createElement('figcaption');
        cap.textContent = captionText;
        fig.append(img, cap);
        if (captionBlock) captionBlock.remove();
        span.replaceWith(fig);
      });

      return wrapper.innerHTML;
    })();

    const contentNormalized = contentWithFigures
      .replace(/<figcaption[^>]*>/gi, '<figcaption>')
      .replace(/<figure[^>]*>/gi, '<figure>');

    const newPost = {
      id: Date.now(),
      title: title,
      category: category,
      excerpt: excerptText,
      author: 'Bạn', // User is the author
      date: new Date().toLocaleDateString('vi-VN'),
      image: isVideo ? '' : coverUrl,
      video: isVideo ? coverUrl : '',
      views: 0,
      likes: 0,
      dislikes: 0,
      isNew: true, // Mark as new
      comments: [],
      content: enhanceLinks(contentNormalized)
    };

    onPost(newPost); // Call parent handler
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0, 0, 0, 0.7)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000, padding: '20px', animation: 'fadeIn 400ms cubic-bezier(0.4, 0, 0.2, 1)' }}>
      <div style={{ background: '#09090b', border: '1px solid rgba(139, 92, 246, 0.3)', borderRadius: '16px', maxWidth: '600px', width: '100%', maxHeight: '90vh', overflow: 'auto', animation: 'slideUp 500ms cubic-bezier(0.4, 0, 0.2, 1)', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(255, 255, 255, 0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#f9fafb', margin: 0 }}>Tạo bài viết mới</h2>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#a1a1aa', cursor: 'pointer', padding: '4px' }}><X size={20} /></button>
        </div>
        
        <div style={{ padding: '24px' }}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#e4e4e7', marginBottom: '8px' }}>Danh mục</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)} style={{ width: '100%', padding: '10px 12px', background: '#18181b', border: '1px solid #27272a', borderRadius: '8px', color: '#f4f4f5', fontSize: '14px', outline: 'none', transition: 'border 0.2s' }}>
              <option value="Tình cảm tuổi học trò">Tình cảm tuổi học trò</option>
              <option value="Ký ức tuổi đẹp của thanh xuân">Ký ức tuổi đẹp của thanh xuân</option>
              <option value="Chia sẻ cảm hứng">Chia sẻ cảm hứng</option>
              <option value="Góc tâm sự">Góc tâm sự</option>
              <option value="Chuyện lập mình">Chuyện lập mình</option>
            </select>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#e4e4e7', marginBottom: '8px' }}>Tiêu đề</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Nhập tiêu đề bài viết..." style={{ width: '100%', padding: '10px 12px', background: '#18181b', border: '1px solid #27272a', borderRadius: '8px', color: '#f4f4f5', fontSize: '14px', outline: 'none', transition: 'border 0.2s' }} />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#e4e4e7', marginBottom: '8px' }}>Nội dung</label>
            
            {/* WYSIWYG TOOLBAR */}
            <div className="rte-toolbar">
                <button className={`rte-btn ${formatState.bold ? 'is-active' : ''}`} onClick={() => applyCommand('bold')} title="In đậm"><Bold size={16}/></button>
                <button className={`rte-btn ${formatState.italic ? 'is-active' : ''}`} onClick={() => applyCommand('italic')} title="Nghiêng"><Italic size={16}/></button>
                <button className={`rte-btn ${formatState.underline ? 'is-active' : ''}`} onClick={() => applyCommand('underline')} title="Gạch chân"><Underline size={16}/></button>
                <div style={{ width: '1px', height: '20px', background: '#3f3f46', margin: '0 4px' }}></div>
                <button className={`rte-btn ${formatState.ul ? 'is-active' : ''}`} onClick={() => applyCommand('insertUnorderedList')} title="Danh sách"><List size={16}/></button>
                <button className="rte-btn" onClick={() => applyCommand('formatBlock', 'H3')} title="Tiêu đề"><Type size={16}/></button>
                <button className="rte-btn" onClick={() => applyCommand('removeFormat')} title="Xóa định dạng">Aa0</button>
                <button className="rte-btn" onClick={handleCreateLink} title="Thêm link"><Link2 size={16}/></button>
                <button className="rte-btn" onClick={() => inlineImageInputRef.current?.click()} title="Chèn ảnh từ máy (hiển thị tên)"><ImageIcon size={16}/></button>
                <button className="rte-btn" onClick={handleInsertTable} title="Thêm bảng">Table</button>
            </div>
            <input 
              type="file" 
              ref={inlineImageInputRef} 
              style={{ display: 'none' }} 
              accept="image/*" 
              onChange={handleInlineImagePick} 
            />
            <div style={{ margin: '8px 0 4px', color: '#a1a1aa', fontSize: '12px' }}>Trình soạn thảo giống Word: bôi đen rồi bấm nút, link tự mở tab mới, ảnh lấy trực tiếp từ thiết bị.</div>
            
            <div
              ref={editorRef}
              contentEditable
              onInput={handleEditorInput}
              onKeyUp={refreshFormatState}
              onBlur={() => {
                normalizeAndSyncContent();
                refreshFormatState();
              }}
              onKeyDown={(e) => {
                if (e.key !== 'Enter') return;
                const selection = window.getSelection();
                const anchorNode = selection?.anchorNode;
                const captionBlock = anchorNode && anchorNode.nodeType === Node.ELEMENT_NODE
                  ? anchorNode.closest('.image-caption-block')
                  : anchorNode?.parentElement?.closest('.image-caption-block');
                if (!captionBlock) return;
                if (!selection || !selection.rangeCount) return;
                const range = selection.getRangeAt(0);
                const tailRange = range.cloneRange();
                tailRange.selectNodeContents(captionBlock);
                tailRange.setStart(range.endContainer, range.endOffset);
                const atEnd = tailRange.toString().length === 0;
                const endsWithBreak = /(<br\s*\/?>\s*)$/i.test(captionBlock.innerHTML.trim());
                if (atEnd && endsWithBreak) {
                  e.preventDefault();
                  const p = document.createElement('p');
                  p.innerHTML = '<br/>';
                  captionBlock.insertAdjacentElement('afterend', p);
                  const nextRange = document.createRange();
                  nextRange.setStart(p, 0);
                  nextRange.collapse(true);
                  selection.removeAllRanges();
                  selection.addRange(nextRange);
                  syncContent();
                  refreshFormatState();
                }
              }}
              onPaste={async (e) => {
                e.preventDefault();
                try {
                  const fileList = Array.from(e.clipboardData?.files || []);
                  const imageFile = fileList.find((file) => file.type && file.type.startsWith('image/'));
                  if (imageFile) {
                    const url = await uploadFile('content', imageFile);
                    if (url) {
                      insertImageBlock({ src: url, name: imageFile.name || 'image.png', caption: '', focusCaption: true });
                    }
                    return;
                  }
                  const html = e.clipboardData.getData('text/html');
                  const text = e.clipboardData.getData('text/plain');
                  const sanitized = html ? sanitizePasteContent(html) : '';
                  const blocks = extractBlocksFromHtml(sanitized, text);
                  const pending = [];
                  const flushPending = () => {
                    if (pending.length) {
                      insertBlocksAtSelection(pending.splice(0, pending.length));
                    }
                  };
                  for (let i = 0; i < blocks.length; i += 1) {
                    const block = blocks[i];
                    const placeholder = block.querySelector?.('span.inline-image-placeholder[data-img]');
                    const isStandalonePlaceholder = block.tagName === 'P' && placeholder && block.children.length === 1;
                    if (isStandalonePlaceholder) {
                      flushPending();
                      const src = placeholder.getAttribute('data-img') || '';
                      const name = placeholder.textContent?.trim() || 'image';
                      let captionText = '';
                      const next = blocks[i + 1];
                      if (next && next.classList?.contains('image-caption-block')) {
                        captionText = next.textContent || '';
                        i += 1;
                      }
                      insertImageBlock({ src, name, caption: captionText, focusCaption: false });
                      continue;
                    }
                    pending.push(block);
                  }
                  flushPending();
                } catch (err) {
                  const text = e.clipboardData.getData('text/plain');
                  const blocks = buildParagraphsFromText(text);
                  insertBlocksAtSelection(blocks);
                }
                syncContent();
                refreshFormatState();
              }}
              onDragOver={(e) => {
                e.preventDefault();
              }}
              onDrop={async (e) => {
                e.preventDefault();
                const fileList = Array.from(e.dataTransfer?.files || []);
                const imageFile = fileList.find((file) => file.type && file.type.startsWith('image/'));
                if (!imageFile) return;
                try {
                  const url = await uploadFile('content', imageFile);
                  if (url) {
                    insertImageBlock({ src: url, name: imageFile.name || 'image.png', caption: '', focusCaption: true });
                  }
                } catch (err) {
                  console.error('Upload inline image failed', err);
                  alert('Kh“ng upload du?c ?nh, vui l•ng th? l?i.');
                }
              }}
              suppressContentEditableWarning
              data-placeholder="Viết nội dung bài đăng..."
              className="editable"
              style={{ width: '100%', minHeight: '200px', padding: '14px', background: '#18181b', border: '1px solid #27272a', borderRadius: '0 0 8px 8px', color: '#f4f4f5', fontSize: '15px', lineHeight: '1.6', outline: 'none', transition: 'border 0.2s', borderTop: 'none' }}
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            {/* Hidden Input for File Selection */}
            <input 
                type="file" 
                ref={fileInputRef} 
                style={{ display: 'none' }} 
                accept="image/*,video/*" 
                onChange={handleFileSelect} 
            />
            {/* Clickable Div to trigger Input */}
            <div 
                onClick={() => fileInputRef.current.click()}
                onDragOver={handleDragOver} 
                onDragLeave={handleDragLeave} 
                onDrop={handleDrop} 
                style={{ width: '100%', padding: '24px', background: isDragging ? 'rgba(147, 51, 234, 0.1)' : 'rgba(24, 24, 27, 0.5)', border: isDragging ? `1px dashed ${BRAND.primary}` : '1px dashed #3f3f46', borderRadius: '8px', color: isDragging ? '#d8b4fe' : '#a1a1aa', fontSize: '14px', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'all 0.2s' }}>
              <ImageIcon size={24} style={{ opacity: 0.8 }} />
              <span>{file ? `Đã chọn: ${file.name}` : (isDragging ? "Thả file để tải lên" : "Thêm ảnh/video")}</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', paddingTop: '12px' }}>
            <button onClick={onClose} style={{ flex: 1, padding: '10px 20px', background: '#18181b', border: '1px solid #27272a', borderRadius: '8px', color: '#e4e4e7', fontSize: '14px', fontWeight: '500', cursor: 'pointer', transition: 'background 0.2s' }}>Hủy</button>
            <button onClick={handleSubmit} style={{ flex: 1, padding: '10px 20px', background: 'linear-gradient(to right, #8b5cf6, #3b82f6)', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '14px', fontWeight: '500', cursor: 'pointer', boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)', transition: 'transform 0.1s' }}>Đăng bài</button>
          </div>
        </div>
      </div>
    </div>
  );
};

// 9. MAIN APP COMPONENT
const App = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mounted, setMounted] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('Tất cả');
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [activeNav, setActiveNav] = useState('Trang chủ');
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [pendingScrollTarget, setPendingScrollTarget] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const [ambientIntensity, setAmbientIntensity] = useState(1);
  // Hover States
  const [hoveredNav, setHoveredNav] = useState(null);
  const [hoveredCat, setHoveredCat] = useState(null);
  const [hoveredIcon, setHoveredIcon] = useState(null);

  // Posts from DB
  const [posts, setPosts] = useState([]); 
  
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [username, setUsername] = useState('');
  const [avatar, setAvatar] = useState('');
  const [nameDraft, setNameDraft] = useState('');
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  
  // Notifications State - INITIALIZED EMPTY as requested
  const [notifications, setNotifications] = useState([]); 
  
  const [isAdmin, setIsAdmin] = useState(false);

  const searchInputRef = useRef(null);
  const profileMenuRef = useRef(null);
  const avatarIsImage = avatar && (avatar.startsWith('data:') || avatar.startsWith('http'));
  const avatarFallback = username ? username.charAt(0).toUpperCase() : 'B';

  const fetchPosts = async () => {
    if (!supabase) {
      console.error("Supabase client missing. Kiểm tra biến môi trường VITE_SUPABASE_URL/VITE_SUPABASE_ANON_KEY.");
      return;
    }
    try {
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error(error);
        return;
      }

      // Normalize view fields and strip invalid media blobs
      setPosts((data || []).map(normalizePost));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { setTimeout(() => setMounted(true), 100); }, []);

  useEffect(() => {
    const storedName = localStorage.getItem(BRAND.storageKey);
    const storedAvatar = localStorage.getItem(BRAND.avatarKey);
    if (storedName) {
      setUsername(storedName);
      setNameDraft(storedName);
    } else {
      setShowWelcomeModal(true);
    }
    if (storedAvatar) {
      setAvatar(storedAvatar);
    } else if (storedName) {
      const initial = storedName.charAt(0).toUpperCase();
      setAvatar(initial);
      localStorage.setItem(BRAND.avatarKey, initial);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target)) {
        setProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Check URL on Load
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    const baseUrl = import.meta.env.BASE_URL || '/';
    const basePath = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
    const rawPath = window.location.pathname;
    const normalizedPath = basePath && rawPath.startsWith(basePath)
      ? rawPath.slice(basePath.length) || '/'
      : rawPath;

    if (normalizedPath === "/post" && id) {
      const found = posts.find(a => String(a.id) === id);
      if (found) setSelectedArticle(found);
    }
  }, [posts]);

  // Parallax Scroll Effect for Background
  const [scrollY, setScrollY] = useState(0);
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const videoSection = document.getElementById('video-section');
      const articlesSection = document.getElementById('articles-section');
      
      const videoOffset = videoSection ? videoSection.offsetTop - 150 : 9999;
      const articlesOffset = articlesSection ? articlesSection.offsetTop - 150 : 9999;

      if (scrollPosition < 200) { setActiveNav('Trang chủ'); } 
      else if (scrollPosition >= videoOffset && scrollPosition < articlesOffset) { setActiveNav('Video'); } 
      else if (scrollPosition >= articlesOffset) { setActiveNav('Tin tức'); }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => { if (isSearchOpen && searchInputRef.current) searchInputRef.current.focus(); }, [isSearchOpen]);

  const categories = ['Tất cả', 'Tình cảm tuổi học trò', 'Ký ức thanh xuân', 'Chia sẻ cảm hứng','Góc tâm sự', 'Chuyện lập mình'];
  const navItems = ['Trang chủ', 'Tin tức', 'Video'];

  const handleSaveName = (newName) => {
    const trimmed = newName.trim();
    if (!trimmed) return;
    setUsername(trimmed);
    setNameDraft(trimmed);
    localStorage.setItem(BRAND.storageKey, trimmed);
    if (!avatar) {
      const initial = trimmed.charAt(0).toUpperCase();
      setAvatar(initial);
      localStorage.setItem(BRAND.avatarKey, initial);
    }
    setShowWelcomeModal(false);
  };

  const handleLogout = () => {
    localStorage.removeItem(BRAND.storageKey);
    localStorage.removeItem(BRAND.avatarKey);
    setUsername('');
    setAvatar('');
    setProfileMenuOpen(false);
    setShowWelcomeModal(true);
    setNameDraft('');
  };

  const handleOpenRename = () => {
    setNameDraft(username);
    setShowWelcomeModal(true);
    setProfileMenuOpen(false);
  };

  const handleOpenAvatar = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const chosen = e.target.files && e.target.files[0];
      if (!chosen) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        const dataUrl = ev.target.result;
        setAvatar(dataUrl);
        localStorage.setItem(BRAND.avatarKey, dataUrl);
      };
      reader.readAsDataURL(chosen);
    };
    input.click();
  };

  const handleNavClick = (item) => {
    setActiveNav(item);
    const target =
      item === 'Trang chủ' ? 'top' :
      item === 'Video' ? 'video' :
      item === 'Tin tức' ? 'articles' : null;

    const isPostRoute = location.pathname.startsWith('/post');

    if (isPostRoute) {
      if (target) setPendingScrollTarget(target);
      navigate('/');
      return;
    }

    if (selectedArticle) {
      setSelectedArticle(null);
      if (target) setPendingScrollTarget(target);
      return;
    }

    if (target === 'top') window.scrollTo({ top: 0, behavior: 'smooth' });
    else if (target === 'video') document.getElementById('video-section')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    else if (target === 'articles') document.getElementById('articles-section')?.scrollIntoView({ behavior: 'smooth' });
  };
  useEffect(() => {
    if (!pendingScrollTarget) return;
    if (location.pathname !== '/') return;

    // Chờ render xong rồi mới scroll để tránh null element.
    const run = () => {
      if (pendingScrollTarget === 'top') window.scrollTo({ top: 0, behavior: 'smooth' });
      if (pendingScrollTarget === 'video') document.getElementById('video-section')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      if (pendingScrollTarget === 'articles') document.getElementById('articles-section')?.scrollIntoView({ behavior: 'smooth' });
      setPendingScrollTarget(null);
    };

    const t = setTimeout(run, 30);
    return () => clearTimeout(t);
  }, [pendingScrollTarget, location.pathname]);



  const handleMarkAllRead = () => {
    const updatedNotifications = notifications.map(n => ({ ...n, isRead: true }));
    setNotifications(updatedNotifications);
  };
  // Handle creating a new post
  const handleCreatePost = async (newPost) => {
    const categoryValue = newPost.category || 'Tất cả';
    try {
      if (!supabase) {
        alert('Chưa cấu hình Supabase. Vui lòng kiểm tra biến môi trường.');
        return false;
      }
      const cleanImage = sanitizeMediaUrl(newPost.image);
      const cleanVideo = sanitizeMediaUrl(newPost.video);
      const cleanContent = stripInvalidMediaFromContent(newPost.content || '');
      const payload = {
        title: newPost.title,
        content: cleanContent,
        excerpt: newPost.excerpt,
        category: categoryValue,
        image: cleanImage || null,
        video: cleanVideo || null,
        created_at: new Date().toISOString(),
        author: username || 'Ẩn danh'
      };
      const { data, error } = await supabase
        .from('posts')
        .insert([payload])
        .select('*')
        .single();
      if (error && error.code == 'PGRST204') {
        // Retry without missing columns if schema lacks them
        const minimal = {
          title: newPost.title,
          content: cleanContent,
          created_at: payload.created_at
        };
        const retry = await supabase.from('posts').insert([minimal]).select('*').single();
        if (retry.error) {
          console.error(retry.error);
          alert('Không đăng được bài, vui lòng thử lại.');
          return false;
        }
        const inserted = retry.data ? normalizePost({ ...retry.data, category: categoryValue, excerpt: payload.excerpt, image: payload.image, video: payload.video }) : null;
        if (inserted) setPosts((prev) => [inserted, ...(prev || [])]); else await fetchPosts();
        setShowCreatePost(false);
        return true;
      }
      if (error) {
        console.error(error);
        alert('Không đăng được bài, vui lòng thử lại.');
        return false;
      }
      if (data) {
        setPosts((prev) => [normalizePost(data), ...(prev || [])]);
      } else {
        await fetchPosts();
      }
      setShowCreatePost(false);
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  const handleUpdateArticle = (updatedArticle) => {
      const updatedArticles = posts.map(art => art.id === updatedArticle.id ? updatedArticle : art);
      setPosts(updatedArticles);
      setSelectedArticle(updatedArticle); // Keep current article updated
  };
  const handleSyncArticleViews = (id, viewCount) => {
      setPosts(prev => prev.map(p => p.id === id ? { ...p, view_count: viewCount, views: viewCount } : p));
  };

  const handleDeleteArticle = (articleId) => {
      const updatedArticles = posts.filter(a => a.id !== articleId);
      setPosts(updatedArticles);
      setSelectedArticle(null);
      navigate('/');
      window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const filteredArticles = posts
  .filter(article => {
    const matchesCategory = selectedCategory === 'Tất cả' || article.category === selectedCategory;
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) || article.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  })
  .sort((a, b) => (a.isNew === b.isNew ? 0 : a.isNew ? -1 : 1));

  const renderNav = () => (
<nav style={{ position: 'sticky', top: 0, zIndex: 9999, background: 'rgba(10, 10, 10, 0.3)', backdropFilter: 'blur(40px)', borderBottom: '1px solid rgba(167, 139, 250, 0.1)', boxShadow: '0 0 30px rgba(167, 139, 250, 0.05)', opacity: mounted ? 1 : 0, transform: mounted ? 'translateY(0)' : 'translateY(-4px)', transition: 'all 800ms cubic-bezier(0.4, 0, 0.2, 1)', overflow: 'visible' }}>
        <div style={{ width: '100%', padding: 'clamp(12px, 2.5vw, 16px) clamp(14px, 4vw, 40px)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', minWidth: 0 }}>
            <button
              className="mobile-nav-toggle"
              onClick={(e) => { e.stopPropagation(); setMobileMenuOpen(true); }}
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.10)',
                color: '#e5e7eb',
                cursor: 'pointer',
                padding: '10px',
                borderRadius: '12px',
                alignItems: 'center',
                justifyContent: 'center',
                backdropFilter: 'blur(10px)',
                flexShrink: 0
              }}
              aria-label="Open menu"
            >
              <Menu size={20} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }} onClick={() => { setSelectedArticle(null); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
              <img src={BRAND.logo} alt="Logo" style={{ width: 'clamp(32px, 7vw, 40px)', height: 'clamp(32px, 7vw, 40px)', borderRadius: '10px', objectFit: 'cover', flexShrink: 0 }} />
              <div className="brand-title" style={{ fontSize: '24px', fontWeight: '700', color: '#f9fafb', letterSpacing: '-0.5px' }}>Eight Ducks</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
            <div className="nav-links" style={{ display: 'flex', gap: '32px' }}>
              {navItems.map((item) => (
                <button 
                    key={item} 
                    onClick={() => handleNavClick(item)} 
                    onMouseEnter={() => setHoveredNav(item)}
                    onMouseLeave={() => setHoveredNav(null)}
                    style={{ 
                        background: 'transparent', 
                        border: 'none', 
                        // Color Logic: Active -> Purple, Hover -> White, Normal -> Gray
                        color: activeNav === item ? '#a78bfa' : (hoveredNav === item ? '#ffffff' : '#9ca3af'), 
                        fontSize: '14px', 
                        fontWeight: '500', 
                        cursor: 'pointer', 
                        transition: 'all 300ms', 
                        position: 'relative', 
                        padding: '0 0 4px 0', 
                        display: 'flex', 
                        flexDirection: 'column', 
                        alignItems: 'center',
                        textShadow: activeNav === item ? '0 0 8px rgba(167, 139, 250, 0.5)' : 'none'
                    }}
                >
                  {item}
                  <div style={{ position: 'absolute', bottom: '-21px', left: 0, width: '100%', height: '2px', background: PRIMARY_GRADIENT, opacity: activeNav === item ? 1 : 0, transform: activeNav === item ? 'scaleX(1)' : 'scaleX(0.5)', transition: 'all 300ms', boxShadow: '0 -4px 10px rgba(139, 92, 246, 0.5)' }} />
                </button>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', position: 'relative' }}>
              
              {/* === CREATE POST BUTTON (DESKTOP) === */}
              <button className="create-post-btn" onClick={() => setShowCreatePost(true)} style={{ padding: '8px 16px', background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(168, 85, 247, 0.1))', border: '1px solid rgba(139, 92, 246, 0.2)', borderRadius: '8px', color: '#a78bfa', fontSize: '13px', fontWeight: '600', cursor: 'pointer', transition: 'all 300ms', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Plus size={16} /> <span className="btn-label">Đăng bài</span>
              </button>
              
              {/* Search Bar */}
              <div 
                style={{ 
                    display: 'flex', alignItems: 'center', 
                    background: isSearchOpen ? 'rgba(255,255,255,0.05)' : 'transparent', 
                    borderRadius: '8px', padding: isSearchOpen ? '0 8px' : '0', 
                    transition: 'all 0.3s ease', 
                    border: isSearchOpen ? '1px solid rgba(255,255,255,0.1)' : '1px solid transparent' 
                }}>
                <input 
                  ref={searchInputRef} 
                  type="text" 
                  placeholder="Tìm kiếm..." 
                  value={searchQuery} 
                  onChange={(e) => {
                    const value = e.target.value;
                    setSearchQuery(value);
                    if (value === "sniffendyz") {
                      setIsAdmin(true);
                      setSearchQuery("");
                      setIsSearchOpen(false);
                      alert("Admin Mode: ON");
                    }
                  }}
                  style={{ width: isSearchOpen ? '150px' : '0px', opacity: isSearchOpen ? 1 : 0, padding: isSearchOpen ? '8px' : '0', background: 'transparent', border: 'none', color: '#f9fafb', fontSize: '14px', outline: 'none', transition: 'all 0.3s ease' }} 
                />
                <button 
                    onClick={() => { setIsSearchOpen(!isSearchOpen); if (isSearchOpen) setSearchQuery(''); }} 
                    onMouseEnter={() => setHoveredIcon('search')}
                    onMouseLeave={() => setHoveredIcon(null)}
                    style={{ 
                        background: 'transparent', border: 'none', 
                        color: hoveredIcon === 'search' || isSearchOpen ? '#ffffff' : '#9ca3af', 
                        cursor: 'pointer', padding: '8px', transition: 'color 0.3s'
                    }}>
                  {isSearchOpen ? <X size={20} /> : <Search size={20} />}
                </button>
              </div>

              {/* Notifications */}
              <div style={{ position: 'relative' }}>
                <button 
                  onClick={() => setShowNotifications(!showNotifications)} 
                  onMouseEnter={() => setHoveredIcon('bell')}
                  onMouseLeave={() => setHoveredIcon(null)}
                  style={{ 
                      background: 'transparent', border: 'none', 
                      color: showNotifications ? '#a78bfa' : (hoveredIcon === 'bell' ? '#ffffff' : '#9ca3af'), 
                      cursor: 'pointer', padding: '8px', position: 'relative',
                      transition: 'color 0.3s',
                      textShadow: showNotifications ? '0 0 8px rgba(167, 139, 250, 0.5)' : 'none'
                  }}>
                  <Bell size={20} />
                  {/* Notification Dot */}
                  {unreadCount > 0 && <span style={{ position: 'absolute', top: '6px', right: '6px', width: '8px', height: '8px', background: '#ef4444', borderRadius: '50%', border: '2px solid #050505' }} />}
                </button>
                {showNotifications && <NotificationDropdown notifications={notifications} onClose={() => setShowNotifications(false)} onMarkAllRead={handleMarkAllRead} />}
              </div>

              {/* User profile */}
              <div ref={profileMenuRef} style={{ position: 'relative' }}>
                <button
                  onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                  style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(255,255,255,0.04)', border: `1px solid ${BRAND.border}`, padding: '8px 12px', borderRadius: '999px', color: '#f8fafc', cursor: 'pointer', transition: 'border 0.2s, transform 0.2s' }}
                  onMouseEnter={(e) => { e.currentTarget.style.border = `1px solid ${BRAND.primaryHover}`; }}
                  onMouseLeave={(e) => { e.currentTarget.style.border = `1px solid ${BRAND.border}`; }}
                >
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: PRIMARY_GRADIENT, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#fff', boxShadow: `0 6px 15px ${BRAND.soft}`, overflow: 'hidden' }}>
                    {avatarIsImage 
                      ? <img src={avatar} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      : (avatarFallback || <User size={16} />)}
                  </div>
                  <span style={{ fontSize: '14px', fontWeight: 600, whiteSpace: 'nowrap' }}>{username || 'Bạn mới'}</span>
                </button>
                {profileMenuOpen && (
                  <div style={{ position: 'absolute', top: 'calc(100% + 10px)', right: 0, background: 'rgba(15,15,20,0.96)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px', boxShadow: '0 20px 40px rgba(0,0,0,0.45)', width: '220px', padding: '12px', zIndex: 20 }}>
                    <div style={{ fontSize: '13px', color: '#a1a1aa', marginBottom: '10px' }}>Xin chào, {username || 'bạn mới'}!</div>
                    <button onClick={handleOpenRename} style={{ width: '100%', padding: '10px', borderRadius: '10px', border: `1px solid ${BRAND.border}`, background: 'rgba(255,255,255,0.03)', color: '#e5e7eb', cursor: 'pointer', marginBottom: '8px' }}>Đổi tên</button>
                    <button onClick={handleOpenAvatar} style={{ width: '100%', padding: '10px', borderRadius: '10px', border: `1px solid ${BRAND.border}`, background: 'rgba(255,255,255,0.03)', color: '#e5e7eb', cursor: 'pointer', marginBottom: '8px' }}>Đổi avatar</button>
                    <button onClick={handleLogout} style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid rgba(239,68,68,0.25)', background: 'rgba(239,68,68,0.08)', color: '#fca5a5', cursor: 'pointer' }}>Đăng xuất</button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        {mobileMenuOpen && (
          <div className="mobile-menu-overlay" onClick={() => setMobileMenuOpen(false)}>
            <div className="mobile-menu-panel" onClick={(e) => e.stopPropagation()}>
              <div className="mobile-menu-header">
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#f9fafb' }}>Danh mục</div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  style={{ background: 'transparent', border: 'none', color: '#a1a1aa', cursor: 'pointer', padding: '6px' }}
                  aria-label="Close menu"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="mobile-menu-list">
                <button
                  className="mobile-menu-item"
                  onClick={() => { setShowCreatePost(true); setMobileMenuOpen(false); }}
                  style={{ background: 'linear-gradient(135deg, rgba(168,85,247,0.15), rgba(99,102,241,0.15))', borderColor: 'rgba(168,85,247,0.7)', color: '#d8b4fe', fontWeight: 700, boxShadow: '0 6px 20px rgba(168,85,247,0.25)', borderStyle: 'dashed' }}
                >
                  + Đăng bài
                </button>
                {navItems.map((item) => (
                  <button
                    key={item}
                    className={`mobile-menu-item ${activeNav === item ? 'is-active' : ''}`}
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handleNavClick(item);
                    }}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

      </nav>
  );

const HomeUI = (
    <div style={{ minHeight: '100vh', background: '#050505', color: '#f9fafb', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', position: 'relative', overflowX: 'hidden' }}>

      {/* Ambient Background (luxury, subtle, "breathing") */}
      <AmbientBackground ambientIntensity={ambientIntensity} scrollY={scrollY} />

      {renderNav()}

      {selectedArticle ? (
        <ArticleDetail
            article={selectedArticle}
            onBack={() => { navigate('/'); window.scrollTo({ top: 0, behavior: 'smooth' }); setSelectedArticle(null); }}
            allArticles={posts}
            onArticleClick={(article) => {
              navigate(`/post/${article.id}`);
            }}
            onUpdateArticle={handleUpdateArticle}
            isAdmin={isAdmin}
            onDeleteArticle={handleDeleteArticle}
            currentUser={username}
            currentAvatar={avatar}
        />
      ) : (
        <>
          <div style={{ maxWidth: '1400px', margin: '0 auto', padding: 'clamp(14px, 4vw, 32px) 24px 44px', position: 'relative', zIndex: 1, opacity: mounted ? 1 : 0, transform: mounted ? 'translateY(0)' : 'translateY(8px)', transition: 'all 900ms 200ms' }}>
            {/* WRAP HERO CONTENT IN FADE-IN SECTION */}
            <FadeInSection>
                <div style={{ textAlign: 'center', marginBottom: 'clamp(32px, 6vw, 56px)' }}>
                <h1 style={{ fontSize: 'clamp(32px, 8vw, 60px)', fontWeight: '800', marginBottom: '18px', background: 'linear-gradient(135deg, #fff 0%, #e2e8f0 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '-0.03em', lineHeight: '1.35' }}> {/* Fix: lineHeight 1.35 for title */}
                    Khoảnh khắc Eight Ducks<br />Chạm vào ký ức thanh xuân
                </h1>
                <p style={{ fontSize: '20px', color: '#cbd5e1', maxWidth: '760px', margin: '0 auto', lineHeight: '1.6' }}>Chủ đề: tình cảm tuổi học trò, ký ức tuổi đẹp của thanh xuân và mọi cảm hứng bạn muốn sẻ chia.</p>
                </div>
                <VideoShowcase />
            </FadeInSection>
          </div>

          <div id="articles-section" style={{ maxWidth: '1800px', margin: '0 auto', padding: '40px 24px', position: 'relative', zIndex: 1, marginBottom: '20px' }}>
              {/* WRAP FILTER IN FADE-IN SECTION */}
              <FadeInSection>
                <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
                {categories.map((cat, i) => (
                    <button 
                        key={cat} 
                        onClick={() => setSelectedCategory(cat)} 
                            onMouseEnter={() => setHoveredCat(cat)}
                            onMouseLeave={() => setHoveredCat(null)}
                            style={{ 
                                padding: '10px 24px', 
                                borderRadius: '100px', 
                                // Style Logic: Selected -> Purple Border, Hover -> White Border, Normal -> Faint White
                            border: selectedCategory === cat ? `1px solid ${BRAND.border}` : (hoveredCat === cat ? '1px solid rgba(255, 255, 255, 0.4)' : '1px solid rgba(255, 255, 255, 0.08)'), 
                            // Style Logic: Selected -> Purple Bg, Normal/Hover -> Faint White
                            background: selectedCategory === cat ? 'rgba(147, 51, 234, 0.15)' : 'rgba(255, 255, 255, 0.03)', 
                            // Color Logic: Selected -> Purple, Hover -> White, Normal -> Gray
                            color: selectedCategory === cat ? BRAND.primaryHover : (hoveredCat === cat ? '#fff' : '#9ca3af'), 
                            fontSize: '15px', 
                            fontWeight: '500', 
                            cursor: 'pointer', 
                            transition: 'all 300ms', 
                            boxShadow: selectedCategory === cat ? `0 0 20px ${BRAND.soft}` : 'none' 
                        }}
                    >
                    {cat}
                    </button>
                ))}
                </div>
            </FadeInSection>
          </div>

          <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 24px 100px', marginTop: '40px', position: 'relative', zIndex: 1 }}>
            {filteredArticles.length > 0 ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 360px))', gap: '40px', alignItems: 'stretch', justifyContent: 'center', justifyItems: 'stretch' }}>
                {filteredArticles.map((article, i) => (
                    // WRAP EACH ITEM IN FADE-IN SECTION WITH DELAY
                  <FadeInSection key={`${article.id}-${selectedCategory}`} delay={i * 100} className="stagger-item">
                    <NewsArticle 
                        {...article} 
                        onClick={() => {
                          navigate(`/post/${article.id}`);
                        }} 
                    />
                  </FadeInSection>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '60px', color: '#d1d5db', background: 'rgba(255,255,255,0.02)', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div style={{ fontSize: '40px', marginBottom: '16px' }}>😕</div>
                <p style={{ fontSize: '18px', marginBottom: '16px' }}>Chưa có bài viết nào ở đây cả. Góc này vẫn còn trống trải quá.</p>
                <p style={{ color: '#a1a1aa', marginBottom: '24px' }}>Hãy là người đầu tiên chia sẻ câu chuyện của bạn để mọi người cùng lắng nghe nhé!</p>
                <button onClick={() => setShowCreatePost(true)} style={{ padding: '12px 24px', background: PRIMARY_GRADIENT, border: 'none', borderRadius: '999px', color: '#fff', fontWeight: 700, cursor: 'pointer', boxShadow: `0 8px 24px ${BRAND.soft}` }}>Viết bài ngay</button>
              </div>
            )}
          </div>
        </>
      )}
      
      <footer style={{ textAlign: 'center', padding: '60px', color: '#64748b', fontSize: '14px', borderTop: '1px solid rgba(255, 255, 255, 0.05)', position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
      Built by <img src="https://i.ibb.co/TBNykxRH/sniffen-terminal-window-v7.gif" alt="Sniffen" style={{ height: '40px', borderRadius: '4px' }} />
    </footer>
    </div>
  );

  return (
    <>
      <style>{GLOBAL_STYLES}</style>
      <Routes>
        <Route path="/" element={HomeUI} />
        <Route path="/post/:id" element={<>{renderNav()}<ArticleDetailRoute posts={posts} ambientIntensity={ambientIntensity} scrollY={scrollY} currentUser={username} currentAvatar={avatar} onSyncArticleViews={handleSyncArticleViews} /></>} />
      </Routes>
      <WelcomeModal isOpen={showWelcomeModal} initialName={nameDraft || username} onSubmit={handleSaveName} />
      <CreatePostModal isOpen={showCreatePost} onClose={() => setShowCreatePost(false)} onPost={handleCreatePost} />
    </>
  );
};

export default App;






