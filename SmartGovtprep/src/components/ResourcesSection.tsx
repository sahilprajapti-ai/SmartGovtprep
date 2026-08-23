import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  ExternalLink, 
  Bookmark, 
  Search, 
  Building2, 
  FolderArchive,
  BookOpen,
  Sparkles
} from 'lucide-react';
import { IMPORTANT_RESOURCES_DATA } from '../data/mockData';

export const ResourcesSection: React.FC = () => {
  const [filterType, setFilterType] = useState<string>('ALL');
  const [searchWord, setSearchWord] = useState('');

  const officialPortals = [
    { name: 'UPSC Portal', url: 'https://upsc.gov.in', domain: 'upsc.gov.in', desc: 'Civil Services, NDA, CDS' },
    { name: 'GPSC Gujarat', url: 'https://gpsc.gujarat.gov.in', domain: 'gpsc.gujarat.gov.in', desc: 'Class 1 & 2, DySO, Nayab Mamlatdar' },
    { name: 'OJAS Gujarat', url: 'https://ojas.gujarat.gov.in', domain: 'ojas.gujarat.gov.in', desc: 'Gujarat Police, Talati, Clerk' },
    { name: 'SSC Official', url: 'https://ssc.gov.in', domain: 'ssc.gov.in', desc: 'CGL, CHSL, MTS, GD, CPO' },
    { name: 'IBPS Banking', url: 'https://ibps.in', domain: 'ibps.in', desc: 'PO, Clerk, Specialist Officer' },
    { name: 'Railway RRB', url: 'https://rrbcdg.gov.in', domain: 'rrbcdg.gov.in', desc: 'NTPC, Group D, ALP' },
    { name: 'SEB Gujarat', url: 'https://sebexam.org', domain: 'sebexam.org', desc: 'TET-1/2, TAT-1/2, CTET' },
  ];

  const filteredResources = IMPORTANT_RESOURCES_DATA.filter((item) => {
    const typeMatch = filterType === 'ALL' || item.type === filterType;
    const query = searchWord.toLowerCase().trim();
    const searchMatch = !query || 
      item.title.toLowerCase().includes(query) ||
      item.exam.toLowerCase().includes(query) ||
      item.description.toLowerCase().includes(query);
    return typeMatch && searchMatch;
  });

  return (
    <section id="resources" className="py-14 text-slate-100 border-b border-white/10 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1">
              <FolderArchive className="w-4 h-4" />
              <span>Free Downloadable Vault</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Important Study Resources & PYQs
            </h2>
            <p className="text-slate-300 text-sm mt-1 max-w-2xl font-normal">
              Authentic Previous Year Question Papers (with official answer keys), updated syllabus PDFs, normalization guidelines, and direct official government exam portal links.
            </p>
          </div>

          {/* Quick Filter Search */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
            <input
              type="text"
              placeholder="Search PYQ paper, notes..."
              value={searchWord}
              onChange={(e) => setSearchWord(e.target.value)}
              className="w-full bg-white/[0.04] border border-white/10 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-400 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-emerald-400/50 focus:border-emerald-400/80 transition"
            />
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2.5 overflow-x-auto pb-4 mb-6 scrollbar-thin">
          {['ALL', 'PYQ Paper', 'Syllabus PDF', 'Exam Pattern', 'Study Notes'].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition border backdrop-blur-md ${
                filterType === type
                  ? 'bg-emerald-600/90 border-white/30 text-white shadow-md'
                  : 'bg-white/[0.04] border-white/10 text-slate-300 hover:border-white/20 hover:bg-white/[0.08]'
              }`}
            >
              {type === 'ALL' ? '📂 All Resources' : type}
            </button>
          ))}
        </div>

        {/* Resources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {filteredResources.map((res) => (
            <div
              key={res.id}
              className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-[0_8px_32px_rgba(0,0,0,0.37)] hover:border-white/20 hover:bg-white/[0.06] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border backdrop-blur-md ${
                    res.type === 'PYQ Paper'
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                      : res.type === 'Syllabus PDF'
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                      : 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
                  }`}>
                    {res.type}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">{res.year || '2025-26'}</span>
                </div>

                <div className="mt-4">
                  <h3 className="text-base font-bold text-white leading-snug">
                    {res.title}
                  </h3>
                  <p className="text-xs text-emerald-400 font-semibold mt-1">Exam: {res.exam}</p>
                  <p className="text-xs text-slate-300 mt-2 line-clamp-2 leading-relaxed">{res.description}</p>
                </div>
              </div>

              <div className="mt-5 pt-3.5 border-t border-white/10 flex items-center justify-between">
                <span className="text-[11px] text-slate-400 font-mono">{res.fileSize || 'PDF Document'}</span>
                <a
                  href={res.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white/[0.06] hover:bg-white/[0.12] text-slate-200 text-xs font-semibold px-3.5 py-2 rounded-xl border border-white/15 flex items-center gap-1.5 backdrop-blur-md transition shadow-sm"
                >
                  <Download className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Download PDF</span>
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Official Portals Directory */}
        <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-7 shadow-[0_8px_32px_rgba(0,0,0,0.37)]">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-white/10">
            <Building2 className="w-5 h-5 text-indigo-400" />
            <h3 className="text-base font-bold text-white">Direct Official Government Portals</h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5">
            {officialPortals.map((portal) => (
              <a
                key={portal.name}
                href={portal.url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 hover:border-white/20 p-4 rounded-2xl backdrop-blur-md transition flex flex-col justify-between group"
              >
                <div>
                  <div className="text-xs font-bold text-white flex items-center justify-between">
                    <span>{portal.name}</span>
                    <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-emerald-400 transition" />
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1 truncate">{portal.desc}</div>
                </div>
                <div className="text-[10px] text-emerald-400 font-mono mt-2.5">{portal.domain}</div>
              </a>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
