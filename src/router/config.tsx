import type { RouteObject } from 'react-router-dom';
import { lazy } from 'react';

const Home = lazy(() => import('../pages/home/page'));
const Artists = lazy(() => import('../pages/artists/page'));
const ArtistDetail = lazy(() => import('../pages/artist-detail/page'));
const Releases = lazy(() => import('../pages/releases/page'));
const News = lazy(() => import('../pages/news/page'));
const About = lazy(() => import('../pages/about/page'));
const Contact = lazy(() => import('../pages/contact/page'));
const NotFound = lazy(() => import('../pages/NotFound'));

// Admin Pages
const AdminLayout = lazy(() => import('../layouts/AdminLayout'));
const AdminLogin = lazy(() => import('../pages/admin/Login'));
const AdminDashboard = lazy(() => import('../pages/admin/Dashboard'));
const HeroEditor = lazy(() => import('../pages/admin/sections/HeroEditor'));
const AboutEditor = lazy(() => import('../pages/admin/sections/AboutEditor'));
const ArtistsEditor = lazy(() => import('../pages/admin/sections/ArtistsEditor'));
const ReleasesEditor = lazy(() => import('../pages/admin/sections/ReleasesEditor'));
const VideosEditor = lazy(() => import('../pages/admin/sections/VideosEditor'));
const NewsEditor = lazy(() => import('../pages/admin/sections/NewsEditor'));
const ContactEditor = lazy(() => import('../pages/admin/sections/ContactEditor'));

const routes: RouteObject[] = [
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/artistas',
    element: <Artists />,
  },
  {
    path: '/artista/:id',
    element: <ArtistDetail />,
  },
  {
    path: '/lancamentos',
    element: <Releases />,
  },
  {
    path: '/noticias',
    element: <News />,
  },
  {
    path: '/sobre',
    element: <About />,
  },
  {
    path: '/contato',
    element: <Contact />,
  },
  // Admin Routes
  {
    path: '/admin/login',
    element: <AdminLogin />,
  },
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      {
        path: 'dashboard',
        element: <AdminDashboard />,
      },
      {
        path: 'sections/hero',
        element: <HeroEditor />,
      },
      {
        path: 'sections/about',
        element: <AboutEditor />,
      },
      {
        path: 'sections/artists',
        element: <ArtistsEditor />,
      },
      {
        path: 'sections/releases',
        element: <ReleasesEditor />,
      },
      {
        path: 'sections/videos',
        element: <VideosEditor />,
      },
      {
        path: 'sections/news',
        element: <NewsEditor />,
      },
      {
        path: 'sections/contact',
        element: <ContactEditor />,
      },
      {
        path: 'sections/:section',
        element: <div className="p-8">Seção em breve: <span className="text-[#0EA8A0] font-bold">Gerenciador de Conteúdo</span></div>,
      },
    ],
  },
  {
    path: '*',
    element: <NotFound />,
  },
];

export default routes;