import { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Music, 
  Video, 
  Newspaper, 
  Info, 
  Mail, 
  LogOut, 
  Menu, 
  X
} from 'lucide-react';
import { supabase } from '../utils/supabase';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard' },
  { icon: Music, label: 'Hero / Banners', path: '/admin/sections/hero' },
  { icon: Info, label: 'Sobre Nós', path: '/admin/sections/about' },
  { icon: Users, label: 'Artistas', path: '/admin/sections/artists' },
  { icon: Music, label: 'Lançamentos', path: '/admin/sections/releases' },
  { icon: Video, label: 'Vídeos', path: '/admin/sections/videos' },
  { icon: Newspaper, label: 'Notícias', path: '/admin/sections/news' },
  { icon: Mail, label: 'Contato / Social', path: '/admin/sections/contact' },
];

export default function AdminLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function checkUser() {
      if (!supabase) return;
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/admin/login');
      }
      setLoading(false);
    }
    checkUser();

    if (!supabase) return;
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        navigate('/admin/login');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }
    navigate('/admin/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0EA8A0]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white flex">
      {/* Sidebar */}
      <aside 
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-[#0A0A0A] border-r border-white/10 transition-transform duration-300 transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0 lg:w-20'
        }`}
      >
        <div className="h-full flex flex-col">
          {/* Logo Handle */}
          <div className="p-6 flex items-center justify-between border-b border-white/5">
            <h1 className={`font-bold text-[#0EA8A0] transition-opacity duration-300 ${!isSidebarOpen && 'lg:opacity-0'}`}>
              Céu Music <span className="text-white/40 text-xs font-normal">Admin</span>
            </h1>
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="lg:hidden p-1 hover:bg-white/5 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto overflow-x-hidden pt-6">
            {menuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => `
                  flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative
                  ${isActive 
                    ? 'bg-[#0EA8A0]/10 text-[#0EA8A0] border border-[#0EA8A0]/20' 
                    : 'text-white/60 hover:text-white hover:bg-white/5 border border-transparent'}
                `}
              >
                <item.icon className="w-5 h-5 shrink-0" />
                <span className={`transition-all duration-300 ${!isSidebarOpen && 'lg:opacity-0 lg:absolute'}`}>
                  {item.label}
                </span>
                {!isSidebarOpen && (
                  <div className="absolute left-full ml-4 px-3 py-1 bg-black border border-white/10 rounded-lg text-xs invisible group-hover:visible whitespace-nowrap z-50">
                    {item.label}
                  </div>
                )}
              </NavLink>
            ))}
          </nav>

          {/* User Section */}
          <div className="p-4 border-t border-white/5">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-500/80 hover:text-red-500 hover:bg-red-500/5 transition-all duration-200"
            >
              <LogOut className="w-5 h-5 shrink-0" />
              <span className={`transition-all duration-300 ${!isSidebarOpen && 'lg:opacity-0 lg:absolute'}`}>
                Sair
              </span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-16 border-b border-white/10 bg-[#0A0A0A]/50 backdrop-blur-md sticky top-0 z-40 px-6 flex items-center justify-between">
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 hover:bg-white/5 rounded-lg text-white/60"
          >
            <Menu className="w-6 h-6" />
          </button>
          
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold">Administrador</p>
              <p className="text-xs text-white/40">Céu Music Team</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0EA8A0] to-[#C45C2F] flex items-center justify-center">
              <span className="font-bold">A</span>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="p-4 sm:p-6 lg:p-8 flex-1">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
