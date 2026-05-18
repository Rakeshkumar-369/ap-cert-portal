import React, { useState } from 'react';
import AdminSidebar from '../components/layout/AdminSidebar';
import Card from '../components/ui/Card';
import {
  Plus,
  Edit2,
  Trash2,
  Eye,
  FileText,
  Image as ImageIcon,
  Save,
  Download,
  ChevronDown,
  FileBarChart
} from 'lucide-react';

const AdminDashboard = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState('home');

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* 1. Sidebar on the LEFT */}
      <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={onLogout} />

      {/* 2. Main Content Area */}
      <div className="flex-1 overflow-y-auto p-10">
      <header className="flex justify-between items-start mb-12">

        <div>
          <h1 className="text-4xl font-black uppercase tracking-tight text-[#003366]">
            {activeTab === 'home' && "Home Page Assets"}
            {activeTab === 'resources' && "Resource Repository"}
            {activeTab === 'incidents' && "Incident Command"}
          </h1>

          <p className="text-slate-500 text-xs font-bold uppercase tracking-[0.3em] mt-2">
            AP-CERT Administrative Control
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />

          <span className="text-[10px] font-bold uppercase text-slate-500">
            Live Secure Session
          </span>
        </div>

      </header>

        {/* Content Views */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {activeTab === 'home' && <HomeManagement />}
          {activeTab === 'resources' && <ResourcesManagement />}
          {activeTab === 'incidents' && <IncidentViewer />}
        </div>
      </div>
    </div>
  );
};

// --- Sub-Component: Home Management (Leadership & Carousel) ---
const HomeManagement = () => {
  const [editId, setEditId] = useState(null); // Track which item is being edited
  const [leadership, setLeadership] = useState([
    { id: 1, post: "Hon'ble Chief Minister", name: "Sri Nara Chandrababu Naidu", img: "/images/cm.png" },
    { id: 2, post: "Hon'ble Minister for ITE&C", name: "Sri Nara Lokesh", img: "/images/minister.png" },
    { id: 3, post: "Secretary to Govt, ITE&C", name: "Katamaneni Bhaskar, IAS", img: "/images/secretary.png" },
    { id: 4, post: "Managing Director, APTS", name: "M. Surya Teja, IAS", img: "/images/md.png" }
  ]);

  const handleSave = (id) => {
    // PLACEHOLDER FOR FETCH/SAVE CALL
    console.log(`Saving changes for ID: ${id}`);
    setEditId(null);
  };

  return (
    <div className="space-y-12">
      {/* 1. Leadership Section */}
      <section>
        <h3 className="text-[#003366] font-bold mb-6 uppercase tracking-widest text-sm flex items-center gap-2">
          <ImageIcon size={18} /> Leadership Profiles 
        </h3>
        <div className="grid grid-cols-1 gap-4">
          {leadership.map((member) => (
            <Card key={member.id} className={`transition-all ${editId === member.id ? 'border-ap-gold bg-slate-50' : 'border-slate-200'}`}>
              <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex items-center gap-6 flex-1 w-full">
                  <img src={member.img} alt="" className="w-16 h-16 rounded-full border-2 border-ap-lavender object-cover" />
                  
                  {editId === member.id ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
                      <input type="text" defaultValue={member.name} className="bg-white border border-ap-purple/50 p-2 rounded text-sm text-slate-800" />
                      <input type="text" defaultValue={member.post} className="bg-white border border-ap-purple/50 p-2 rounded text-sm text-slate-800" />
                    </div>
                  ) : (
                    <div className="flex-1">
                      <div className="text-lg font-bold text-slate-800">{member.name}</div>
                      <div className="text-xs text-slate-500 uppercase font-bold tracking-widest">{member.post}</div>
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  {editId === member.id ? (
                    <>
                      <button onClick={() => handleSave(member.id)} className="bg-[#003366] hover:bg-green-500 text-slate-800 px-4 py-2 rounded-lg flex items-center gap-2 text-xs font-bold transition-all">
                        <Save size={16} /> Save
                      </button>
                      <button onClick={() => setEditId(null)} className="bg-gray-700 text-slate-800 px-4 py-2 rounded-lg text-xs font-bold">
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button onClick={() => setEditId(member.id)} className="text-slate-500 hover:text-[#003366] p-2 transition-colors">
                      <Edit2 size={20} />
                    </button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* 2. Carousel Management - 6 Slides */}
      <section>
        <h3 className="text-slate-500 font-bold mb-6 uppercase tracking-widest text-sm">Carousel Assets (6 Slides) [cite: 1]</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="border-slate-200">
               <div className="flex justify-between items-start mb-4">
                  <span className="text-[10px] font-black text-[#003366] uppercase tracking-tighter">Slide #{i}</span>
                  <button className="text-slate-500 hover:text-[#003366]"><Edit2 size={16} /></button>
               </div>
               <div className="h-32 bg-white/50 rounded-lg mb-4 border border-ap-purple/5 border-dashed flex items-center justify-center text-gray-600 text-xs italic">
                  Image Preview / Path
               </div>
               <div className="text-sm font-bold truncate uppercase tracking-tight">APCSOC Operations [cite: 104, 106]</div>
               <div className="text-[10px] text-gray-500 mt-1">24/7 Monitoring of State Infrastructure [cite: 112]</div>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
};

// --- Sub-Component: Resources Management ---
const ResourcesManagement = () => {
  const [openSection,setOpenSection]=useState('downloads');
  const [editingId,setEditingId]=useState(null);

  const [downloads]=useState([
    {id:'d1',name:'Security Monitoring Guidelines',path:'/docs/monitoring.pdf'},
    {id:'d2',name:'Incident Response SOP',path:'/docs/sop_ir.pdf'}
  ]);

  const [publications]=useState([
    {id:'p1',name:'AP-CERT Annual Report 2025',path:'/docs/annual_2025.pdf'},
    {id:'p2',name:'State Threat Landscape Study',path:'/docs/threat_study.pdf'}
  ]);

  const renderFileList=(list,type)=>(
    <div className="space-y-3 mt-4">

      {list.map((item)=>(
        <div
          key={item.id}
          className={`p-4 rounded-xl border transition-all ${
            editingId===item.id
              ? 'border-ap-gold bg-slate-50'
              : 'border-slate-200 bg-slate-50'
          }`}
        >

          <div className="flex justify-between items-center gap-4">

            <div className="flex items-center gap-4 flex-1">

              <FileText className="text-slate-500" size={18}/>

              {editingId===item.id ? (

                <div className="flex flex-col md:flex-row gap-2 flex-1">

                  <input
                    type="text"
                    defaultValue={item.name}
                    className="bg-white border border-ap-purple/50 p-2 rounded text-xstext-slate-800 flex-1"
                  />

                  <input
                    type="text"
                    defaultValue={item.path}
                    className="bg-white border border-ap-purple/50 p-2 rounded text-xs text-slate-800 flex-1"
                  />

                </div>

              ) : (

                <div className="flex-1">

                  <div className="text-sm font-bold text-slate-800">
                    {item.name}
                  </div>

                  <div className="text-[10px] text-gray-500 font-mono italic">
                    {item.path}
                  </div>

                </div>

              )}

            </div>

            <div className="flex gap-3">

              {editingId===item.id ? (

                <button
                  onClick={()=>setEditingId(null)}
                  className="text-green-500 hover:text-slate-800 transition-all text-[10px] font-black uppercase flex items-center gap-1"
                >
                  <Save size={14}/>
                  Save
                </button>

              ) : (

                <>
                  <button
                    onClick={()=>setEditingId(item.id)}
                    className="text-gray-500 hover:text-[#003366] transition-colors"
                  >
                    <Edit2 size={16}/>
                  </button>

                  <button className="text-gray-500 hover:text-red-500 transition-colors">
                    <Trash2 size={16}/>
                  </button>
                </>

              )}

            </div>

          </div>

        </div>
      ))}

      <button className="w-full py-3 border-2 border-dashed border-slate-200 rounded-xl text-gray-500 text-[10px] font-black uppercase tracking-widest hover:border-ap-gold hover:text-[#003366] transition-all mt-4">
        + Add New {type}
      </button>

    </div>
  );

  return (
    <div className="space-y-6">

      {/* Downloads */}

      <div className="border border-slate-200 rounded-2xl overflow-hidden">

        <button
          onClick={()=>setOpenSection(openSection==='downloads'?null:'downloads')}
          className="w-full flex justify-between items-center p-6 bg-white/40 hover:bg-white/60 transition-all"
        >

          <div className="flex items-center gap-4">

            <div className="p-2 bg-ap-gold/10 rounded-lg text-[#003366]">
              <Download size={20}/>
            </div>

            <div className="text-left">

              <h3 className="font-bold text-slate-800 uppercase tracking-widest text-sm">
                Downloads
              </h3>

              <p className="text-[10px] text-gray-500 uppercase">
                SOPs & Guidelines
              </p>

            </div>

          </div>

          <ChevronDown
            className={`transition-transform duration-300 ${
              openSection==='downloads'
                ? 'rotate-180 text-[#003366]'
                : 'text-gray-500'
            }`}
          />

        </button>

        {openSection==='downloads' && (
          <div className="p-6 bg-white/20">
            {renderFileList(downloads,'Download')}
          </div>
        )}

      </div>

      {/* Publications */}

      <div className="border border-slate-200 rounded-2xl overflow-hidden">

        <button
          onClick={()=>setOpenSection(openSection==='publications'?null:'publications')}
          className="w-full flex justify-between items-center p-6 bg-white/40 hover:bg-white/60 transition-all"
        >

          <div className="flex items-center gap-4">

            <div className="p-2 bg-ap-lavender/10 rounded-lg text-slate-500">
              <FileBarChart size={20}/>
            </div>

            <div className="text-left">

              <h3 className="font-bold text-slate-800 uppercase tracking-widest text-sm">
                Publications
              </h3>

              <p className="text-[10px] text-gray-500 uppercase">
                Annual Reports & Studies
              </p>

            </div>

          </div>

          <ChevronDown
            className={`transition-transform duration-300 ${
              openSection==='publications'
                ? 'rotate-180 text-slate-500'
                : 'text-gray-500'
            }`}
          />

        </button>

        {openSection==='publications' && (
          <div className="p-6 bg-white/20">
            {renderFileList(publications,'Publication')}
          </div>
        )}

      </div>

    </div>
  );
};

// --- Sub-Component: Incident Viewer ---
const IncidentViewer = () => (
  <Card className="border-slate-200 p-0 overflow-hidden">
    <table className="w-full text-left">
      <thead className="bg-ap-purple/10">
        <tr>
          <th className="p-4 text-[10px] font-black uppercase text-slate-500">ID & Reporter </th>
          <th className="p-4 text-[10px] font-black uppercase text-slate-500">Category </th>
          <th className="p-4 text-[10px] font-black uppercase text-slate-500">Evidence </th>
          <th className="p-4 text-[10px] font-black uppercase text-slate-500 text-right">View Case</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-ap-purple/10">
        {[1, 2, 3].map((i) => (
          <tr key={i} className="hover:bg-white/5 transition-all">
            <td className="p-4">
              <div className="text-sm font-bold">INC-2026-00{i} </div>
              <div className="text-[10px] text-gray-500">reporter_{i}@ap.gov.in </div>
            </td>
            <td className="p-4 text-xs">Phishing / Scam </td>
            <td className="p-4">
              <div className="flex gap-2">
                 <span className="text-[9px] bg-white border border-ap-purple/30 px-2 py-1 rounded text-gray-400 flex items-center gap-1 cursor-pointer hover:text-[#003366]">
                    <Eye size={10} /> View (2 Files)
                 </span>
              </div>
            </td>
            <td className="p-4 text-right">
              <button className="text-[#003366] hover:scale-110 transition-transform"><FileText size={18} /></button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </Card>
);

export default AdminDashboard;