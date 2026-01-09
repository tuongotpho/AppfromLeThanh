
import React, { useState, useEffect } from 'react';
import ProjectCard from './components/ProjectCard';
import CVSection from './components/CVSection';
import ProjectModal from './components/ProjectModal';
import { CV_DATA } from './constants';
import { Project } from './types';
import { auth, db } from './firebaseConfig';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { collection, getDocs } from 'firebase/firestore';

enum NavTab {
  PROJECTS = 'projects',
  ABOUT = 'about'
}

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<NavTab>(NavTab.PROJECTS);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoginVisible, setIsLoginVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [loading, setLoading] = useState(true);

  // Check Auth State
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAdmin(!!user);
      if (user) setIsLoginVisible(false);
    });
    return () => unsubscribe();
  }, []);

  // Fetch Projects from Firestore
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "showcase"));
        const fetchedProjects: Project[] = [];
        querySnapshot.forEach((doc) => {
          fetchedProjects.push(doc.data() as Project);
        });
        
        // Sort by date (newest first) if possible, or just use natural order
        fetchedProjects.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        
        setProjects(fetchedProjects);
      } catch (error) {
        console.error("Error fetching projects: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [selectedProject]); // Refetch when a project changes (saved)

  // Hidden login toggle: Double click the footer copyright
  const toggleLogin = () => setIsLoginVisible(!isLoginVisible);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, pass);
      setEmail("");
      setPass("");
    } catch (error) {
      alert("Đăng nhập thất bại: " + (error as Error).message);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

  const handleSaveProject = (updated: Project) => {
    // Optimistic update
    setProjects(prev => {
        const index = prev.findIndex(p => p.id === updated.id);
        if (index !== -1) {
            const newArr = [...prev];
            newArr[index] = updated;
            return newArr;
        }
        return [updated, ...prev];
    });
    setSelectedProject(updated);
  };

  const handleAddProject = () => {
    const newProj: Project = {
      id: Date.now().toString(),
      name: "Dự án mới",
      description: "Mô tả ngắn về dự án",
      url: "#",
      tags: ["New"],
      images: ["https://picsum.photos/800/600"],
      date: new Date().toISOString().split('T')[0]
    };
    // We set it as selected immediately to open the modal for editing
    setSelectedProject(newProj);
  };

  return (
    <div className="min-h-screen pb-20 selection:bg-indigo-100">
      <header className="relative pt-24 pb-16 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-indigo-100/30 blur-[120px] rounded-full -z-10" />
        <div className="container mx-auto px-6 text-center space-y-6">
          
          <div className="flex justify-center animate-in fade-in zoom-in duration-700">
             <div className="relative w-28 h-28 rounded-full overflow-hidden border-4 border-white shadow-2xl ring-4 ring-indigo-50">
                <img 
                  src="https://github.com/thanhlv87/pic/blob/main/programmer.png?raw=true" 
                  alt="Vibe Coder" 
                  className="w-full h-full object-cover"
                />
             </div>
          </div>

          <div className="flex justify-center items-center gap-2 mb-4">
            <div className="inline-block px-4 py-1.5 bg-indigo-50 text-indigo-700 rounded-full text-sm font-bold">
               {isAdmin ? '🛡️ Admin Mode' : 'Vibe Coding Portfolio'}
            </div>
            {isAdmin && (
                <button onClick={handleLogout} className="text-xs text-red-500 hover:underline font-semibold">
                    (Đăng xuất)
                </button>
            )}
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tight">
            {activeTab === NavTab.PROJECTS ? 'Dự án Sáng tạo' : CV_DATA.fullName}
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            {activeTab === NavTab.PROJECTS 
              ? 'Nơi trưng bày những sản phẩm được hoàn thiện bằng phương pháp Vibe Coding - sự kết hợp giữa tư duy sáng tạo và sức mạnh AI.'
              : CV_DATA.title}
          </p>
        </div>
      </header>

      <div className="sticky top-6 z-50 flex justify-center mb-12">
        <nav className="p-1.5 bg-white/70 backdrop-blur-md border border-slate-200 rounded-2xl shadow-lg flex gap-1">
          <button
            onClick={() => setActiveTab(NavTab.PROJECTS)}
            className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${
              activeTab === NavTab.PROJECTS ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            Dự án
          </button>
          <button
            onClick={() => setActiveTab(NavTab.ABOUT)}
            className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${
              activeTab === NavTab.ABOUT ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            Cá nhân
          </button>
        </nav>
      </div>

      <main className="container mx-auto px-6">
        {activeTab === NavTab.PROJECTS ? (
          <div className="min-h-[400px]">
            {loading ? (
                 <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                 </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {isAdmin && (
                    <button 
                        onClick={handleAddProject}
                        className="flex flex-col items-center justify-center p-8 rounded-2xl border-2 border-dashed border-indigo-300 bg-indigo-50/50 text-center space-y-4 min-h-[400px] hover:bg-indigo-50 transition-colors group"
                    >
                        <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                        <svg className="w-8 h-8 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        </div>
                        <div>
                        <h4 className="font-bold text-indigo-900">Thêm dự án mới</h4>
                        <p className="text-sm text-indigo-500">Bắt đầu một "vibe" mới...</p>
                        </div>
                    </button>
                    )}

                    {projects.map(project => (
                    <div key={project.id} onClick={() => setSelectedProject(project)} className="cursor-pointer">
                        <ProjectCard project={project} />
                    </div>
                    ))}
                    
                    {!loading && projects.length === 0 && !isAdmin && (
                         <div className="col-span-full text-center text-slate-400 py-12">
                             Chưa có dự án nào được đăng tải.
                         </div>
                    )}
                </div>
            )}
          </div>
        ) : (
          <CVSection isAdmin={isAdmin} />
        )}
      </main>

      <footer className="mt-24 py-12 border-t border-slate-100 text-center">
        <p className="text-slate-400 text-sm cursor-help select-none" onDoubleClick={toggleLogin}>
          © {new Date().getFullYear()} • App from Gemini&Thanhlv87
        </p>
        {isLoginVisible && !isAdmin && (
          <form onSubmit={handleLogin} className="mt-4 flex flex-col gap-2 justify-center max-w-xs mx-auto p-4 bg-white rounded-xl shadow-lg border border-slate-100">
             <h3 className="text-sm font-bold text-slate-800 mb-2">Đăng nhập Admin</h3>
            <input 
              type="email" 
              placeholder="Email" 
              autoFocus
              className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
             <input 
              type="password" 
              placeholder="Password" 
              className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={pass}
              onChange={e => setPass(e.target.value)}
            />
            <button type="submit" className="w-full py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold hover:bg-indigo-700">
                Đăng nhập
            </button>
          </form>
        )}
      </footer>

      {selectedProject && (
        <ProjectModal 
          project={selectedProject}
          isOpen={!!selectedProject}
          onClose={() => setSelectedProject(null)}
          isAdmin={isAdmin}
          onSave={handleSaveProject}
        />
      )}
    </div>
  );
};

export default App;
