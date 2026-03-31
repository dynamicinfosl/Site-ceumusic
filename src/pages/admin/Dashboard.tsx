import { useState, useEffect } from 'react';
import { 
  Users, 
  Music, 
  Video, 
  Newspaper, 
  TrendingUp,
  ArrowUpRight,
  Settings
} from 'lucide-react';
import { supabase } from '../../utils/supabase';

export default function Dashboard() {
  const [stats, setStats] = useState([
    { label: 'Artistas', value: '0', icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10', table: 'artists' },
    { label: 'Lançamentos', value: '0', icon: Music, color: 'text-purple-500', bg: 'bg-purple-500/10', table: 'releases' },
    { label: 'Vídeos', value: '0', icon: Video, color: 'text-[#0EA8A0]', bg: 'bg-[#0EA8A0]/10', table: 'videos_gallery' },
    { label: 'Notícias', value: '0', icon: Newspaper, color: 'text-[#C45C2F]', bg: 'bg-[#C45C2F]/10', table: 'news' },
  ]);

  useEffect(() => {
    async function fetchStats() {
      if (!supabase) return;

      const newStats = await Promise.all(stats.map(async (s) => {
        try {
          const { count, error } = await supabase
            .from(s.table)
            .select('*', { count: 'exact', head: true });
          
          if (error) throw error;
          return { ...s, value: (count || 0).toString() };
        } catch (err) {
          console.error(`Erro ao buscar stats de ${s.table}:`, err);
          return s;
        }
      }));

      setStats(newStats);
    }
    fetchStats();
  }, []);

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold font-montserrat">Bem-vindo, Administrador</h1>
        <p className="text-white/40 mt-1">Aqui está o que está acontecendo na Céu Music hoje.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-[#0A0A0A] border border-white/10 p-6 rounded-2xl hover:border-[#0EA8A0]/30 transition-all group">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <TrendingUp className="w-4 h-4 text-green-500 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div>
              <p className="text-white/40 text-sm font-medium">{stat.label}</p>
              <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-[#0A0A0A] border border-white/10 rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-white/5 flex items-center justify-between">
            <h2 className="font-bold flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-[#0EA8A0]" />
              Atividade Recente
            </h2>
            <button className="text-xs text-[#0EA8A0] hover:underline">Ver tudo</button>
          </div>
          <div className="p-6 space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-4 text-sm group cursor-pointer">
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/40 group-hover:bg-[#0EA8A0]/10 group-hover:text-[#0EA8A0] transition-all">
                  <Music className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">Novo lançamento: "Fogo Santo" - Alex Lucio</p>
                  <p className="text-white/40 text-xs">Adicionado há 2 horas por você</p>
                </div>
                <ArrowUpRight className="w-4 h-4 text-white/20 group-hover:text-white transition-all" />
              </div>
            ))}
          </div>
        </div>

        {/* Quick Tips */}
        <div className="bg-gradient-to-br from-[#0EA8A0]/20 to-[#C45C2F]/10 border border-white/10 rounded-2xl p-8 flex flex-col justify-center relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Settings className="w-32 h-32" />
          </div>
          <h2 className="text-xl font-bold mb-4 relative z-10">Dica do Dia</h2>
          <p className="text-white/70 text-sm leading-relaxed mb-6 relative z-10">
            Mantenha as fotos dos seus artistas sempre atualizadas para garantir a melhor experiência visual no site. Imagens em alta resolução (R2) carregam instantaneamente!
          </p>
          <button className="bg-white text-black font-bold py-2 px-6 rounded-xl self-start text-sm hover:bg-white/90 transition-all relative z-10">
            Explorar R2 Storage
          </button>
        </div>
      </div>
    </div>
  );
}
