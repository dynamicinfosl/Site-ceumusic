import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  Clock,
  Info,
  LayoutDashboard,
  Lock,
  LogOut,
  Mail,
  Menu,
  Music,
  Newspaper,
  Settings,
  ShieldCheck,
  UserCircle,
  Users,
  Video,
  X,
  type LucideIcon,
} from 'lucide-react';
import { supabase } from '../utils/supabase';
import { AccessContext, fetchMyAccess, initialsOf, type MyAccess } from '../utils/access';

interface MenuItem {
  icon: LucideIcon;
  label: string;
  path: string;
  // Basta ter uma destas permissões; sem a lista, todo usuário ativo acessa
  anyOf?: string[];
}

const menuItems: MenuItem[] = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard' },
  { icon: Video, label: 'Vídeos do topo', path: '/admin/sections/hero', anyOf: ['hero'] },
  { icon: Info, label: 'Sobre', path: '/admin/sections/about', anyOf: ['about'] },
  { icon: Users, label: 'Artistas', path: '/admin/sections/artists', anyOf: ['artists'] },
  { icon: Music, label: 'Lançamentos', path: '/admin/sections/releases', anyOf: ['releases'] },
  { icon: Video, label: 'Galeria de vídeos', path: '/admin/sections/videos', anyOf: ['videos'] },
  { icon: Newspaper, label: 'Notícias', path: '/admin/sections/news', anyOf: ['news'] },
  { icon: Mail, label: 'Contato e redes', path: '/admin/sections/contact', anyOf: ['contact'] },
  { icon: Settings, label: 'Configurações', path: '/admin/sections/settings', anyOf: ['settings'] },
  { icon: ShieldCheck, label: 'Usuários', path: '/admin/users', anyOf: ['users', 'roles'] },
  { icon: UserCircle, label: 'Meu perfil', path: '/admin/profile' },
];

// Em telas menores o menu cobre o conteúdo, então começa fechado e fecha ao navegar.
const isDesktop = () => window.matchMedia('(min-width: 1024px)').matches;

function StatusScreen({ icon: Icon, title, text, onLogout }: { icon: LucideIcon; title: string; text: string; onLogout: () => void }) {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-[#0A0A0A] border border-white/10 rounded-2xl p-8 text-center">
        <Icon className="w-10 h-10 text-[#0EA8A0] mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-3">{title}</h1>
        <p className="text-white/60 leading-relaxed mb-6">{text}</p>
        <button type="button" onClick={onLogout} className="text-sm text-[#0EA8A0] hover:text-white transition-colors">
          Sair
        </button>
      </div>
    </div>
  );
}

export default function AdminLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(isDesktop);
  const [loading, setLoading] = useState(true);
  const [access, setAccess] = useState<MyAccess | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isDesktop()) setIsSidebarOpen(false);
  }, [location.pathname]);

  const reload = useCallback(async () => {
    setAccess(await fetchMyAccess());
  }, []);

  useEffect(() => {
    async function checkUser() {
      if (!supabase) return;
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/admin/login');
        return;
      }
      try {
        await reload();
      } catch (error) {
        console.error('Erro ao carregar o acesso:', error);
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
  }, [navigate, reload]);

  const handleLogout = async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }
    navigate('/admin/login');
  };

  const contextValue = useMemo(
    () => (access ? { access, can: (permission: string) => access.permissions.includes(permission), reload } : null),
    [access, reload]
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0EA8A0]"></div>
      </div>
    );
  }

  if (!access || !contextValue) {
    return <StatusScreen icon={Lock} title="Não foi possível abrir o painel" text="Não encontramos o seu acesso. Tente entrar de novo ou fale com um administrador." onLogout={handleLogout} />;
  }
  if (access.status === 'pending') {
    return <StatusScreen icon={Clock} title="Aguardando aprovação" text="Seu cadastro foi recebido. Assim que um administrador aprovar e definir seu nível, o painel fica disponível." onLogout={handleLogout} />;
  }
  if (access.status === 'blocked') {
    return <StatusScreen icon={Lock} title="Acesso bloqueado" text="Seu acesso ao painel está bloqueado. Fale com um administrador da Céu Music." onLogout={handleLogout} />;
  }

  const isAllowed = (item: MenuItem) => !item.anyOf || item.anyOf.some(contextValue.can);
  const visibleItems = menuItems.filter(isAllowed);
  const currentItem = menuItems.find((item) => location.pathname.startsWith(item.path));
  const canOpenPage = !currentItem || isAllowed(currentItem);

  return (
    <AccessContext.Provider value={contextValue}>
      <div className="min-h-screen bg-[#050505] text-white flex">
        {/* Sidebar */}
        <aside
          className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-[#0A0A0A] border-r border-white/10 transition-transform duration-300 transform ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0 lg:w-20'
          }`}
        >
          <div className="h-full flex flex-col">
            <div className="p-6 flex items-center justify-between border-b border-white/5">
              <h1 className={`font-bold text-[#0EA8A0] transition-opacity duration-300 ${!isSidebarOpen && 'lg:opacity-0'}`}>
                Céu Music <span className="text-white/40 text-xs font-normal">Admin</span>
              </h1>
              <button type="button" aria-label="Fechar menu" onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="lg:hidden p-1 hover:bg-white/5 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="flex-1 p-4 space-y-2 overflow-y-auto overflow-x-hidden pt-6">
              {visibleItems.map((item) => (
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
                  <span className={`transition-all duration-300 ${!isSidebarOpen && 'lg:opacity-0 lg:absolute'}`}>{item.label}</span>
                  {!isSidebarOpen && (
                    <div className="absolute left-full ml-4 px-3 py-1 bg-black border border-white/10 rounded-lg text-xs invisible group-hover:visible whitespace-nowrap z-50">
                      {item.label}
                    </div>
                  )}
                </NavLink>
              ))}
            </nav>

            <div className="p-4 border-t border-white/5">
              <button
                type="button"
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-500/80 hover:text-red-500 hover:bg-red-500/5 transition-all duration-200"
              >
                <LogOut className="w-5 h-5 shrink-0" />
                <span className={`transition-all duration-300 ${!isSidebarOpen && 'lg:opacity-0 lg:absolute'}`}>Sair</span>
              </button>
            </div>
          </div>
        </aside>

        <main className="flex-1 flex flex-col min-w-0">
          <header className="h-16 border-b border-white/10 bg-[#0A0A0A]/50 backdrop-blur-md sticky top-0 z-40 px-6 flex items-center justify-between">
            <button type="button" aria-label="Abrir ou fechar menu" onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-white/5 rounded-lg text-white/60">
              <Menu className="w-6 h-6" />
            </button>

            <Link to="/admin/profile" className="flex items-center gap-4 rounded-xl hover:opacity-80 transition-opacity">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold">{access.full_name || access.email}</p>
                <p className="text-xs text-white/50">{access.job_title || access.role_name}</p>
              </div>
              <div className="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-br from-[#0EA8A0] to-[#C45C2F] flex items-center justify-center">
                {access.avatar_url ? (
                  <img src={access.avatar_url} alt="" className="w-full h-full object-cover" />
                ) : (
                  <span className="font-bold text-sm">{initialsOf(access.full_name, access.email)}</span>
                )}
              </div>
            </Link>
          </header>

          <div className="p-4 sm:p-6 lg:p-8 flex-1">
            {canOpenPage ? (
              <Outlet />
            ) : (
              <div className="max-w-md mx-auto text-center py-20">
                <Lock className="w-10 h-10 text-white/30 mx-auto mb-4" />
                <h1 className="text-2xl font-bold mb-2">Sem permissão</h1>
                <p className="text-white/60">Seu nível de acesso não inclui esta página.</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </AccessContext.Provider>
  );
}
