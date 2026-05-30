import React, { useState, useMemo } from 'react';
import logo from '../assets/images/logo.png';
import { useNavigate } from 'react-router-dom';
import {
  TrophyIcon,
  DownloadIcon,
  ArrowRightIcon,
  SearchIcon,
  ChevronDownIcon,
  EyeIcon,
  BookmarkIcon,
  MoreVerticalIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  FilterIcon,
  RotateCcwIcon,
  Menu,
} from 'lucide-react';

/* ─── Medal Badge Component ─────────────────────────────────────── */
const MedalBadge = ({ rank, size = 'sm' }) => {
  const cfg = {
    1: { ring: '#F59E0B', bg: 'linear-gradient(145deg,#fde68a,#d97706)', ribbon: '#92400e' },
    2: { ring: '#94A3B8', bg: 'linear-gradient(145deg,#e2e8f0,#94a3b8)', ribbon: '#475569' },
    3: { ring: '#C2694F', bg: 'linear-gradient(145deg,#fca47a,#c2694f)', ribbon: '#7c2d12' },
  }[rank] || {};

  const dim = size === 'lg' ? { outer: 40, font: 15 } : { outer: 32, font: 12 };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: dim.outer }}>
      <div style={{
        width: dim.outer, height: dim.outer, borderRadius: '50%',
        background: cfg.bg, border: `2px solid ${cfg.ring}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontWeight: 700, fontSize: dim.font, color: '#fff',
        boxShadow: `0 0 10px ${cfg.ring}55`,
        flexShrink: 0,
      }}>{rank}</div>
      <div style={{
        width: 6, height: 8, background: cfg.ribbon,
        clipPath: 'polygon(0 0, 100% 0, 80% 100%, 20% 100%)',
        marginTop: 1,
      }} />
    </div>
  );
};

/* ─── Score Cell ─────────────────────────────────────────────────── */
const ScoreCell = ({ value, color, barColor }) => (
  <div>
    <span style={{ fontSize: 13, fontWeight: 600, color }}>{value}%</span>
    <div style={{ width: 72, height: 3, background: '#1e2d45', borderRadius: 99, marginTop: 4 }}>
      <div style={{ width: `${value}%`, height: '100%', borderRadius: 99, background: barColor }} />
    </div>
  </div>
);

/* ─── Avatar ─────────────────────────────────────────────────────── */
const AVATAR_GRADIENTS = [
  'linear-gradient(135deg,#3b82f6,#7c3aed)',
  'linear-gradient(135deg,#8b5cf6,#ec4899)',
  'linear-gradient(135deg,#f97316,#eab308)',
  'linear-gradient(135deg,#14b8a6,#06b6d4)',
  'linear-gradient(135deg,#ef4444,#f97316)',
  'linear-gradient(135deg,#10b981,#06b6d4)',
  'linear-gradient(135deg,#6366f1,#8b5cf6)',
];

const Avatar = ({ name, idx, size = 36 }) => {
  const initials = name.split(' ').map(n => n[0]).join('').toUpperCase();
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: AVATAR_GRADIENTS[idx % AVATAR_GRADIENTS.length],
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontWeight: 700, color: '#fff', fontSize: size * 0.35,
      flexShrink: 0,
    }}>{initials}</div>
  );
};

/* ─── Main Component ─────────────────────────────────────────────── */
const Ranking = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('All Roles');
  const [selectedExperience, setSelectedExperience] = useState('All Experience');
  const [selectedMatch, setSelectedMatch] = useState('All Match Level');
  const [selectedScore, setSelectedScore] = useState('Min ATS Score');

  /* ── Data ── */
  const candidatesData = [
    { id:1, name:'John Doe',       email:'john.doe@email.com',    role:'AI Engineer',       experience:3.2, atsScore:96, semanticScore:94, hybridScore:95, matchLevel:'Strong Match', status:'Shortlisted',    badge:'1st' },
    { id:2, name:'Sarah Johnson',  email:'sarah.j@email.com',     role:'AI Engineer',       experience:2.8, atsScore:92, semanticScore:91, hybridScore:91, matchLevel:'Strong Match', status:'Shortlisted',    badge:'2nd' },
    { id:3, name:'Michael Brown',  email:'michael.b@email.com',   role:'ML Engineer',       experience:4.1, atsScore:90, semanticScore:89, hybridScore:89, matchLevel:'Strong Match', status:'Shortlisted',    badge:'3rd' },
    { id:4, name:'Emily Davis',    email:'emily.d@email.com',     role:'Data Scientist',    experience:3.5, atsScore:87, semanticScore:86, hybridScore:86, matchLevel:'Good Match',   status:'Pending Review' },
    { id:5, name:'David Wilson',   email:'david.w@email.com',     role:'Backend Engineer',  experience:2.3, atsScore:85, semanticScore:84, hybridScore:84, matchLevel:'Good Match',   status:'Pending Review' },
    { id:6, name:'Jessica Lee',    email:'jessica.l@email.com',   role:'AI Engineer',       experience:3.9, atsScore:88, semanticScore:87, hybridScore:87, matchLevel:'Strong Match', status:'Shortlisted'    },
    { id:7, name:'Alex Kumar',     email:'alex.k@email.com',      role:'ML Engineer',       experience:2.1, atsScore:83, semanticScore:82, hybridScore:82, matchLevel:'Good Match',   status:'Pending Review' },
    { id:8, name:'Sophie Martin',  email:'sophie.m@email.com',    role:'Data Scientist',    experience:3.7, atsScore:89, semanticScore:88, hybridScore:88, matchLevel:'Strong Match', status:'Shortlisted'    },
    { id:9, name:'Ryan Chen',      email:'ryan.c@email.com',      role:'Backend Engineer',  experience:4.2, atsScore:86, semanticScore:85, hybridScore:85, matchLevel:'Good Match',   status:'Pending Review' },
    { id:10,name:'Priya Sharma',   email:'priya.s@email.com',     role:'AI Engineer',       experience:3.3, atsScore:84, semanticScore:83, hybridScore:83, matchLevel:'Good Match',   status:'Pending Review' },
  ];

  const filteredCandidates = useMemo(() => {
    return candidatesData.filter(c => {
      const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            c.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = selectedRole === 'All Roles' || c.role === selectedRole;
      const matchesExp = selectedExperience === 'All Experience' ||
        (selectedExperience === '<2 Years'  && c.experience < 2) ||
        (selectedExperience === '2-3 Years' && c.experience >= 2 && c.experience < 3) ||
        (selectedExperience === '3+ Years'  && c.experience >= 3);
      const matchesMatch = selectedMatch === 'All Match Level' || c.matchLevel === selectedMatch;
      const matchesScore = selectedScore === 'Min ATS Score' || c.atsScore >= parseInt(selectedScore);
      return matchesSearch && matchesRole && matchesExp && matchesMatch && matchesScore;
    });
  }, [searchTerm, selectedRole, selectedExperience, selectedMatch, selectedScore]);

  const itemsPerPage = 5;
  const totalPages = Math.ceil(filteredCandidates.length / itemsPerPage);
  const startIdx  = (currentPage - 1) * itemsPerPage;
  const displayed = filteredCandidates.slice(startIdx, startIdx + itemsPerPage);

  /* Podium order: 2nd | 1st | 3rd */
  const podium = [candidatesData[1], candidatesData[0], candidatesData[2]];
  const podiumRanks = [2, 1, 3];

  const kpiCards = [
    { title:'Total Candidates',  value:'24', percentage:'100%',    change:'All Candidates', icon:'👥', color:'#22d3ee', glow:'#22d3ee' },
    { title:'Shortlisted',       value:'8',  percentage:'33.33%',  change:'Shortlisted',    icon:'✓',  color:'#10b981', glow:'#10b981' },
    { title:'Rejected',          value:'6',  percentage:'25.00%',  change:'Rejected',       icon:'✕',  color:'#ef4444', glow:'#ef4444' },
    { title:'Pending Review',    value:'10', percentage:'41.67%',  change:'Pending',        icon:'⏱', color:'#a855f7', glow:'#a855f7' },
    { title:'Average ATS Score', value:'84%',percentage:'+6.5%',   change:'vs Last Week',   icon:'📈', color:'#f97316', glow:'#f97316' },
  ];

  const sidebarItems = [
    { icon:'📊', label:'Dashboard',         path:'/dashboard' },
    { icon:'📤', label:'Upload Resumes',    path:'/upload' },
    { icon:'📋', label:'Screening Results', path:'/results' },
    { icon:'⚡', label:'ATS Results',       path:'/ats-results' },
    { icon:'🏆', label:'Rankings',          path:'/ranking', active:true },
    { icon:'👥', label:'Applicants',        path:'/dashboard' },
    { icon:'📊', label:'Reports',           path:'/dashboard' },
    { icon:'⚙️', label:'Settings',         path:'/dashboard' },
  ];

  const filters = [
    { options:['All Roles','AI Engineer','ML Engineer','Data Scientist','Backend Engineer'], state:selectedRole,       setState:setSelectedRole       },
    { options:['All Experience','<2 Years','2-3 Years','3+ Years'],                         state:selectedExperience, setState:setSelectedExperience },
    { options:['All Match Level','Strong Match','Good Match'],                              state:selectedMatch,      setState:setSelectedMatch      },
    { options:['Min ATS Score','80','85','90','95'],                                        state:selectedScore,      setState:setSelectedScore      },
  ];

  /* ── Styles ── */
  const s = {
    root: {
      display:'flex', height:'100vh', overflow:'hidden',
      background:'linear-gradient(135deg,#020c1b 0%,#040f1e 60%,#020a16 100%)',
      fontFamily:'"Inter","Segoe UI",system-ui,sans-serif',
      position:'relative',
    },
    /* Background blobs */
    blob1: {
      position:'fixed', top:'-80px', right:'10%', width:500, height:400,
      background:'radial-gradient(circle,rgba(59,130,246,0.12) 0%,transparent 70%)',
      borderRadius:'50%', filter:'blur(60px)', pointerEvents:'none',
    },
    blob2: {
      position:'fixed', bottom:'-80px', left:'5%', width:450, height:350,
      background:'radial-gradient(circle,rgba(6,182,212,0.08) 0%,transparent 70%)',
      borderRadius:'50%', filter:'blur(60px)', pointerEvents:'none',
    },
    blob3: {
      position:'fixed', top:'40%', right:'30%', width:300, height:300,
      background:'radial-gradient(circle,rgba(139,92,246,0.06) 0%,transparent 70%)',
      borderRadius:'50%', filter:'blur(80px)', pointerEvents:'none',
    },
    /* Sidebar */
    sidebar: {
      position:'fixed', left:0, top:0, height:'100vh', zIndex:40,
      width: sidebarOpen ? 208 : 0,
      overflow:'hidden',
      background:'linear-gradient(180deg,#060f22 0%,#040a18 100%)',
      borderRight:'1px solid rgba(99,179,237,0.1)',
      transition:'width 0.28s ease',
      display:'flex', flexDirection:'column',
    },
    sidebarInner: { padding:'20px 16px', display:'flex', flexDirection:'column', height:'100%', minWidth:208 },
    logo: { display:'flex', alignItems:'center', gap:10, marginBottom:28 },
    logoIcon: {
      width:44, height:44, borderRadius:10, flexShrink:0,
      objectFit:'cover',
      boxShadow:'0 0 12px rgba(34,211,238,0.3), 0 0 24px rgba(34,211,238,0.1)',
      border:'1px solid rgba(34,211,238,0.2)',
    },
    logoText: { lineHeight:1.2 },
    logoTitle: { color:'#f1f5f9', fontWeight:700, fontSize:13 },
    logoSub:   { color:'rgba(34,211,238,0.5)', fontSize:9, letterSpacing:'0.12em', fontWeight:600 },
    navItem: (active) => ({
      display:'flex', alignItems:'center', gap:10, padding:'9px 12px',
      borderRadius:8, width:'100%', border:'none', cursor:'pointer',
      background: active ? 'rgba(34,211,238,0.1)' : 'transparent',
      border: active ? '1px solid rgba(34,211,238,0.2)' : '1px solid transparent',
      color: active ? '#67e8f9' : '#94a3b8',
      fontSize:13, fontWeight: active ? 600 : 400,
      marginBottom:2, transition:'all 0.15s',
      textAlign:'left',
    }),
    /* Navbar */
    navbar: {
      height:56, display:'flex', alignItems:'center', gap:12, padding:'0 20px',
      background:'rgba(4,10,24,0.85)', backdropFilter:'blur(14px)',
      borderBottom:'1px solid rgba(99,179,237,0.1)',
      position:'sticky', top:0, zIndex:30, flexShrink:0,
    },
    searchWrap: {
      flex:1, display:'flex', justifyContent:'center',
    },
    searchInner: {
      position:'relative', width:400,
    },
    searchInput: {
      width:'100%', height:36,
      background:'rgba(15,23,42,0.7)', border:'1px solid rgba(99,179,237,0.15)',
      borderRadius:8, paddingLeft:34, paddingRight:52, paddingTop:0, paddingBottom:0,
      color:'#cbd5e1', fontSize:13, outline:'none',
      fontFamily:'inherit',
    },
    /* Scrollable content */
    content: {
      flex:1, display:'flex', flexDirection:'column',
      marginLeft: sidebarOpen ? 208 : 0,
      transition:'margin-left 0.28s ease',
      minWidth:0,
    },
    scrollArea: { flex:1, overflowY:'auto', overflowX:'hidden' },
    inner: { padding:'20px 24px', maxWidth:1440, margin:'0 auto' },
    /* Section gaps */
    sectionGap: { marginBottom:16 },
    /* KPI card */
    kpiCard: (color) => ({
      borderRadius:12, padding:'16px 18px',
      background:'linear-gradient(135deg,#0c1525 0%,#080e1c 100%)',
      border:'1px solid rgba(99,179,237,0.12)',
      cursor:'default',
      transition:'border-color 0.2s',
    }),
    kpiIconWrap: (color) => ({
      width:42, height:42, borderRadius:10, flexShrink:0,
      display:'flex', alignItems:'center', justifyContent:'center',
      fontSize:18,
      background:`linear-gradient(135deg,${color}33,${color}55)`,
      border:`1px solid ${color}44`,
      boxShadow:`0 0 16px ${color}22`,
    }),
    /* Top 3 card */
    podiumCard: (rank) => ({
      borderRadius:12, padding:'16px',
      background: rank === 1
        ? 'linear-gradient(135deg,#1a1200 0%,#0c0e00 100%)'
        : 'linear-gradient(135deg,#0c1525 0%,#080e1c 100%)',
      border: rank === 1
        ? '1.5px solid rgba(245,158,11,0.45)'
        : rank === 2
        ? '1px solid rgba(148,163,184,0.25)'
        : '1px solid rgba(194,105,79,0.3)',
      boxShadow: rank === 1 ? '0 0 24px rgba(245,158,11,0.12)' : 'none',
    }),
    /* Filter bar */
    filterBar: {
      borderRadius:12, padding:'12px 16px',
      background:'linear-gradient(135deg,#0c1525 0%,#080e1c 100%)',
      border:'1px solid rgba(99,179,237,0.12)',
      display:'flex', alignItems:'center', gap:8, flexWrap:'wrap',
    },
    filterInput: {
      flex:1, minWidth:180, height:34,
      background:'rgba(15,23,42,0.7)', border:'1px solid rgba(99,179,237,0.15)',
      borderRadius:7, paddingLeft:30, paddingRight:10,
      color:'#cbd5e1', fontSize:12, outline:'none', fontFamily:'inherit',
    },
    dropBtn: {
      display:'flex', alignItems:'center', gap:6, height:34, padding:'0 10px',
      background:'rgba(15,23,42,0.7)', border:'1px solid rgba(99,179,237,0.15)',
      borderRadius:7, color:'#cbd5e1', fontSize:12, cursor:'pointer',
      whiteSpace:'nowrap', fontFamily:'inherit',
    },
    dropMenu: {
      position:'absolute', top:'calc(100% + 4px)', left:0, minWidth:160,
      background:'#0d1730', border:'1px solid rgba(99,179,237,0.2)',
      borderRadius:8, boxShadow:'0 12px 40px rgba(0,0,0,0.6)',
      zIndex:50, overflow:'hidden',
    },
    dropItem: (active) => ({
      display:'block', width:'100%', textAlign:'left',
      padding:'8px 12px', fontSize:12, border:'none', cursor:'pointer',
      background: active ? 'rgba(34,211,238,0.15)' : 'transparent',
      color: active ? '#67e8f9' : '#94a3b8',
      fontFamily:'inherit',
      borderLeft: active ? '2px solid #22d3ee' : '2px solid transparent',
    }),
    /* Table */
    tableWrap: {
      borderRadius:12, overflow:'hidden',
      border:'1px solid rgba(99,179,237,0.12)',
      background:'linear-gradient(135deg,#0c1525 0%,#080e1c 100%)',
    },
    th: {
      padding:'10px 14px', textAlign:'left',
      fontSize:10, fontWeight:700, color:'#64748b',
      letterSpacing:'0.08em', textTransform:'uppercase',
      whiteSpace:'nowrap', background:'rgba(8,14,28,0.9)',
      borderBottom:'1px solid rgba(99,179,237,0.1)',
    },
    td: {
      padding:'10px 14px', borderBottom:'1px solid rgba(30,45,70,0.5)',
      verticalAlign:'middle',
    },
    statusBadge: (status) => {
      const m = {
        'Shortlisted':    { bg:'rgba(16,185,129,0.15)', color:'#6ee7b7', border:'rgba(16,185,129,0.3)'  },
        'Pending Review': { bg:'rgba(168,85,247,0.15)', color:'#d8b4fe', border:'rgba(168,85,247,0.3)'  },
        'Rejected':       { bg:'rgba(239,68,68,0.15)',  color:'#fca5a5', border:'rgba(239,68,68,0.3)'   },
      }[status] || {};
      return {
        display:'inline-block', padding:'3px 9px', borderRadius:5,
        fontSize:11, fontWeight:600,
        background:m.bg, color:m.color, border:`1px solid ${m.border}`,
      };
    },
    matchBadge: (level) => {
      const isStrong = level === 'Strong Match';
      return {
        display:'inline-flex', alignItems:'center', gap:4,
        padding:'3px 9px', borderRadius:5, fontSize:11, fontWeight:600,
        background: isStrong ? 'rgba(16,185,129,0.15)' : 'rgba(59,130,246,0.15)',
        color:      isStrong ? '#6ee7b7'               : '#93c5fd',
        border:     isStrong ? '1px solid rgba(16,185,129,0.3)' : '1px solid rgba(59,130,246,0.3)',
      };
    },
    actionBtn: {
      width:28, height:28, borderRadius:6, border:'none', cursor:'pointer',
      display:'flex', alignItems:'center', justifyContent:'center',
      background:'transparent', color:'#64748b',
      transition:'all 0.15s',
    },
    /* Pagination */
    paginationWrap: {
      display:'flex', alignItems:'center', justifyContent:'space-between',
      padding:'10px 16px', borderTop:'1px solid rgba(30,45,70,0.5)',
      background:'rgba(8,14,28,0.5)',
    },
    pageBtn: (active) => ({
      width:28, height:28, borderRadius:6, border:'none', cursor:'pointer',
      display:'flex', alignItems:'center', justifyContent:'center',
      fontSize:12, fontWeight:600, fontFamily:'inherit',
      background: active ? '#22d3ee'               : 'rgba(15,23,42,0.8)',
      color:      active ? '#020c1b'               : '#64748b',
      boxShadow:  active ? '0 0 12px rgba(34,211,238,0.4)' : 'none',
      transition:'all 0.15s',
    }),
  };

  return (
    <div style={s.root}>
      {/* Background blobs */}
      <div style={s.blob1} /><div style={s.blob2} /><div style={s.blob3} />

      {/* ── Sidebar ─────────────────────────────────────────── */}
      <div style={s.sidebar}>
        <div style={s.sidebarInner}>
          <div style={s.logo}>
            <img src={logo} alt="NextHire AI" style={s.logoIcon} />
            <div style={s.logoText}>
              <div style={s.logoTitle}>
                NextHire <span style={{ color:'#22d3ee' }}>AI</span>
              </div>
              <div style={s.logoSub}>INTELLIGENT HIRING</div>
            </div>
          </div>
          <nav style={{ flex:1 }}>
            {sidebarItems.map(item => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                style={s.navItem(item.active)}
                onMouseEnter={e => { if (!item.active) { e.currentTarget.style.color='#cbd5e1'; e.currentTarget.style.background='rgba(255,255,255,0.04)'; } }}
                onMouseLeave={e => { if (!item.active) { e.currentTarget.style.color='#94a3b8'; e.currentTarget.style.background='transparent'; } }}
              >
                <span style={{ fontSize:15 }}>{item.icon}</span>
                <span style={{ whiteSpace:'nowrap' }}>{item.label}</span>
                {item.active && <div style={{ marginLeft:'auto', width:6, height:6, borderRadius:'50%', background:'#22d3ee', boxShadow:'0 0 6px #22d3ee' }} />}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* ── Main Content ─────────────────────────────────────── */}
      <div style={s.content}>

        {/* Navbar */}
        <div style={s.navbar}>
          <button
            onClick={() => setSidebarOpen(o => !o)}
            style={{ background:'transparent', border:'none', cursor:'pointer', padding:6, borderRadius:6, color:'#94a3b8', display:'flex' }}
          >
            <Menu size={18} />
          </button>

          <div style={s.searchWrap}>
            <div style={s.searchInner}>
              <SearchIcon size={14} style={{ position:'absolute', left:10, top:'50%', transform:'translateY(-50%)', color:'#475569' }} />
              <input
                type="text"
                placeholder="Search candidates, skills, roles..."
                style={s.searchInput}
              />
              <span style={{
                position:'absolute', right:10, top:'50%', transform:'translateY(-50%)',
                fontSize:10, color:'#475569', background:'rgba(30,41,59,0.8)',
                padding:'2px 6px', borderRadius:4,
              }}>Ctrl+K</span>
            </div>
          </div>

          <div style={{ display:'flex', alignItems:'center', gap:6 }}>
            {/* Bell */}
            <button style={{ position:'relative', width:34, height:34, borderRadius:7, background:'transparent', border:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:'#64748b' }}>
              <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span style={{ position:'absolute', top:6, right:6, width:7, height:7, background:'#22d3ee', borderRadius:'50%', border:'2px solid #020c1b' }} />
            </button>
            {/* Moon */}
            <button style={{ width:34, height:34, borderRadius:7, background:'transparent', border:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:'#64748b' }}>
              <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 015.646 5.646 9.003 9.003 0 0015.354 15.354z" />
              </svg>
            </button>
            {/* Avatar */}
            <div style={{ width:34, height:34, borderRadius:'50%', background:'linear-gradient(135deg,#22d3ee,#3b82f6)', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700, color:'#020c1b', fontSize:14, cursor:'pointer' }}>A</div>
          </div>
        </div>

        {/* Scrollable page */}
        <div style={s.scrollArea}>
          <div style={s.inner}>

            {/* ── Page Header ── */}
            <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:18 }}>
              <div style={{ display:'flex', alignItems:'flex-start', gap:12 }}>
                <div style={{
                  width:40, height:40, borderRadius:9,
                  background:'linear-gradient(135deg,#f59e0b,#ea580c)',
                  display:'flex', alignItems:'center', justifyContent:'center',
                  boxShadow:'0 4px 16px rgba(245,158,11,0.35)', flexShrink:0, marginTop:2,
                }}>
                  <TrophyIcon size={19} color="#fff" />
                </div>
                <div>
                  <h1 style={{ margin:0, fontSize:22, fontWeight:700, color:'#f1f5f9', lineHeight:1.2 }}>Candidate Rankings</h1>
                  <p style={{ margin:'4px 0 0', fontSize:12, color:'#64748b' }}>AI-powered ranking of candidates based on ATS score, semantic match and overall performance.</p>
                </div>
              </div>
              <div style={{ display:'flex', gap:10, alignItems:'center', flexShrink:0, marginLeft:16 }}>
                <button style={{
                  display:'flex', alignItems:'center', gap:7, padding:'8px 14px',
                  background:'rgba(15,23,42,0.8)', border:'1px solid rgba(99,179,237,0.2)',
                  borderRadius:8, color:'#94a3b8', fontSize:12, cursor:'pointer', fontFamily:'inherit',
                }}>
                  <DownloadIcon size={14} />Download Ranking Report
                </button>
                <button
                  onClick={() => navigate('/dashboard')}
                  style={{
                    display:'flex', alignItems:'center', gap:7, padding:'8px 16px',
                    background:'linear-gradient(135deg,#22d3ee,#3b82f6)',
                    border:'none', borderRadius:8, color:'#fff', fontSize:12, fontWeight:600,
                    cursor:'pointer', fontFamily:'inherit', boxShadow:'0 4px 14px rgba(34,211,238,0.25)',
                  }}
                >
                  Go to Dashboard <ArrowRightIcon size={13} />
                </button>
              </div>
            </div>

            {/* ── KPI Cards ── */}
            <div style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:12, marginBottom:16 }}>
              {kpiCards.map((card, i) => (
                <div key={i} style={s.kpiCard(card.color)}>
                  <div style={{ display:'flex', alignItems:'flex-start', gap:12, marginBottom:10 }}>
                    <div style={s.kpiIconWrap(card.color)}>{card.icon}</div>
                    <div>
                      <div style={{ fontSize:11, color:'#64748b', fontWeight:500, marginBottom:2 }}>{card.title}</div>
                      <div style={{ fontSize:22, fontWeight:700, color:'#f1f5f9', lineHeight:1 }}>{card.value}</div>
                    </div>
                  </div>
                  <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                    <span style={{ fontSize:12, fontWeight:700, color:card.color }}>{card.percentage}</span>
                    <span style={{ fontSize:11, color:'#475569' }}>{card.change}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* ── Top 3 – Podium (2nd | 1st | 3rd) ── */}
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12, marginBottom:16 }}>
              {podium.map((candidate, i) => {
                const rank = podiumRanks[i];
                const scoreColor = rank === 1 ? '#f59e0b' : '#22d3ee';
                const badgeStyle = rank === 1
                  ? { bg:'rgba(245,158,11,0.12)', color:'#fbbf24', border:'rgba(245,158,11,0.25)', dot:'#f59e0b', label:'Best Overall Match' }
                  : rank === 2
                  ? { bg:'rgba(34,211,238,0.1)',  color:'#67e8f9', border:'rgba(34,211,238,0.2)',  dot:'#22d3ee', label:'High Semantic Match' }
                  : { bg:'rgba(239,68,68,0.1)',   color:'#fca5a5', border:'rgba(239,68,68,0.2)',   dot:'#ef4444', label:'Strong Backend Match' };

                return (
                  <div key={candidate.id} style={s.podiumCard(rank)}>
                    <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                      <MedalBadge rank={rank} size="lg" />
                      <Avatar name={candidate.name} idx={i} size={46} />
                      <div style={{ flex:1, minWidth:0 }}>
                        <div style={{ fontSize:14, fontWeight:700, color:'#f1f5f9', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{candidate.name}</div>
                        <div style={{ fontSize:11, color:'#64748b' }}>{candidate.role}</div>
                      </div>
                      <div style={{ textAlign:'right', flexShrink:0 }}>
                        <div style={{ fontSize:10, color:'#64748b', marginBottom:2 }}>ATS Score</div>
                        <div style={{ fontSize:24, fontWeight:800, color:scoreColor, lineHeight:1 }}>{candidate.atsScore}%</div>
                      </div>
                    </div>
                    <div style={{ marginTop:10, paddingLeft:46 }}>
                      <span style={{
                        display:'inline-flex', alignItems:'center', gap:5,
                        padding:'3px 10px', borderRadius:5, fontSize:11, fontWeight:600,
                        background:badgeStyle.bg, color:badgeStyle.color,
                        border:`1px solid ${badgeStyle.border}`,
                      }}>
                        <span style={{ width:6, height:6, borderRadius:'50%', background:badgeStyle.dot, display:'inline-block' }} />
                        {badgeStyle.label}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* ── Filter Bar ── */}
            <div style={{ ...s.filterBar, marginBottom:14 }}>
              <div style={{ position:'relative', flex:1, minWidth:180 }}>
                <SearchIcon size={13} style={{ position:'absolute', left:9, top:'50%', transform:'translateY(-50%)', color:'#475569' }} />
                <input
                  type="text"
                  placeholder="Search candidates..."
                  value={searchTerm}
                  onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                  style={s.filterInput}
                />
              </div>

              {filters.map((f, i) => (
                <div key={i} style={{ position:'relative' }} className="filter-group">
                  <button style={s.dropBtn} className="filter-btn">
                    <span>{f.state}</span>
                    <ChevronDownIcon size={12} color="#64748b" />
                  </button>
                  <div style={{ ...s.dropMenu, display:'none' }} className="filter-menu">
                    {f.options.map(opt => (
                      <button
                        key={opt}
                        onClick={() => { f.setState(opt); setCurrentPage(1); }}
                        style={s.dropItem(f.state === opt)}
                      >{opt}</button>
                    ))}
                  </div>
                </div>
              ))}

              <button style={s.dropBtn}>
                <FilterIcon size={12} /><span>More Filters</span>
              </button>
              <button
                onClick={() => { setSearchTerm(''); setSelectedRole('All Roles'); setSelectedExperience('All Experience'); setSelectedMatch('All Match Level'); setSelectedScore('Min ATS Score'); setCurrentPage(1); }}
                style={s.dropBtn}
              >
                <RotateCcwIcon size={12} /><span>Reset</span>
              </button>
            </div>

            {/* ── Table ── */}
            <div style={s.tableWrap}>
              <div style={{ overflowX:'auto' }}>
                <table style={{ width:'100%', borderCollapse:'collapse' }}>
                  <thead>
                    <tr>
                      {['Rank','Candidate','Role','Experience','ATS Score','Semantic Score','Hybrid Score','Match Level','Status','Action'].map(h => (
                        <th key={h} style={s.th}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {displayed.map((c, idx) => {
                      const rank = startIdx + idx + 1;
                      const isMedal = rank <= 3;
                      return (
                        <tr
                          key={c.id}
                          style={{ transition:'background 0.15s' }}
                          onMouseEnter={e => e.currentTarget.style.background='rgba(34,211,238,0.03)'}
                          onMouseLeave={e => e.currentTarget.style.background='transparent'}
                        >
                          {/* Rank */}
                          <td style={s.td}>
                            {isMedal
                              ? <MedalBadge rank={rank} />
                              : <div style={{ width:28, height:28, borderRadius:'50%', background:'rgba(30,41,59,0.8)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, fontWeight:600, color:'#64748b' }}>{rank}</div>
                            }
                          </td>

                          {/* Candidate */}
                          <td style={s.td}>
                            <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                              <Avatar name={c.name} idx={idx} size={34} />
                              <div>
                                <div style={{ fontSize:13, fontWeight:600, color:'#f1f5f9', lineHeight:1.3 }}>{c.name}</div>
                                <div style={{ fontSize:11, color:'#475569', lineHeight:1.3 }}>{c.email}</div>
                              </div>
                            </div>
                          </td>

                          {/* Role */}
                          <td style={{ ...s.td, fontSize:13, color:'#94a3b8' }}>{c.role}</td>

                          {/* Experience */}
                          <td style={{ ...s.td, fontSize:13, color:'#94a3b8' }}>{c.experience.toFixed(1)} Years</td>

                          {/* ATS */}
                          <td style={s.td}>
                            <ScoreCell value={c.atsScore} color="#22d3ee" barColor="linear-gradient(90deg,#22d3ee,#3b82f6)" />
                          </td>

                          {/* Semantic */}
                          <td style={s.td}>
                            <ScoreCell value={c.semanticScore} color="#10b981" barColor="linear-gradient(90deg,#10b981,#34d399)" />
                          </td>

                          {/* Hybrid */}
                          <td style={s.td}>
                            <ScoreCell value={c.hybridScore} color="#f59e0b" barColor="linear-gradient(90deg,#f59e0b,#fde68a)" />
                          </td>

                          {/* Match Level */}
                          <td style={s.td}>
                            <span style={s.matchBadge(c.matchLevel)}>
                              {c.matchLevel === 'Strong Match' ? '⭐' : '🔵'} {c.matchLevel}
                            </span>
                          </td>

                          {/* Status */}
                          <td style={s.td}>
                            <span style={s.statusBadge(c.status)}>{c.status}</span>
                          </td>

                          {/* Action */}
                          <td style={s.td}>
                            <div style={{ display:'flex', gap:2 }}>
                              {[<EyeIcon size={13}/>, <BookmarkIcon size={13}/>, <MoreVerticalIcon size={13}/>].map((Icon, k) => (
                                <button key={k} style={s.actionBtn}
                                  onMouseEnter={e => { e.currentTarget.style.color='#22d3ee'; e.currentTarget.style.background='rgba(34,211,238,0.1)'; }}
                                  onMouseLeave={e => { e.currentTarget.style.color='#64748b'; e.currentTarget.style.background='transparent'; }}
                                >{Icon}</button>
                              ))}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div style={s.paginationWrap}>
                <span style={{ fontSize:12, color:'#475569' }}>
                  Showing {startIdx + 1} to {Math.min(startIdx + itemsPerPage, filteredCandidates.length)} of {filteredCandidates.length} candidates
                </span>
                <div style={{ display:'flex', alignItems:'center', gap:5 }}>
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    style={{ ...s.actionBtn, opacity: currentPage === 1 ? 0.3 : 1 }}
                  ><ChevronLeftIcon size={13} /></button>

                  {Array.from({ length: Math.min(3, totalPages) }).map((_, i) => (
                    <button key={i+1} onClick={() => setCurrentPage(i+1)} style={s.pageBtn(currentPage === i+1)}>{i+1}</button>
                  ))}

                  {totalPages > 3 && <span style={{ color:'#475569', fontSize:12, padding:'0 2px' }}>...</span>}

                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    style={{ ...s.actionBtn, opacity: currentPage === totalPages ? 0.3 : 1 }}
                  ><ChevronRightIcon size={13} /></button>

                  <select style={{
                    height:28, background:'rgba(15,23,42,0.8)', border:'1px solid rgba(99,179,237,0.15)',
                    borderRadius:6, padding:'0 8px', fontSize:11, color:'#64748b',
                    outline:'none', cursor:'pointer', fontFamily:'inherit', marginLeft:4,
                  }}>
                    <option>5 / page</option>
                    <option>10 / page</option>
                    <option>20 / page</option>
                  </select>
                </div>
              </div>
            </div>

          </div>{/* /inner */}
        </div>{/* /scrollArea */}
      </div>{/* /content */}

      {/* CSS for hover-driven dropdown */}
      <style>{`
        .filter-group:hover .filter-menu { display: block !important; }
        .filter-group:hover .filter-btn  { border-color: rgba(99,179,237,0.35) !important; }
        ::-webkit-scrollbar { width: 5px; height: 5px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(99,179,237,0.2); border-radius: 99px; }
        ::-webkit-scrollbar-thumb:hover { background: rgba(99,179,237,0.35); }
      `}</style>

    </div>
  );
};

export default Ranking;