import type { RouteObject } from 'react-router-dom';
import { lazy } from 'react';

const Home = lazy(() => import('../pages/home/page'));
const Artists = lazy(() => import('../pages/artists/page'));
const ArtistDetail = lazy(() => import('../pages/artist-detail/page'));
const Releases = lazy(() => import('../pages/releases/page'));
const News = lazy(() => import('../pages/news/page'));
const About = lazy(() => import('../pages/about/page'));
const Contact = lazy(() => import('../pages/contact/page'));
const PrivacyPage = lazy(() => import('../pages/legal/PrivacyPage'));
const TermsPage = lazy(() => import('../pages/legal/TermsPage'));
const CookiesPage = lazy(() => import('../pages/legal/CookiesPage'));
const Invite = lazy(() => import('../pages/invite/page'));
const NotFound = lazy(() => import('../pages/NotFound'));

// Admin Pages
const AdminLayout = lazy(() => import('../layouts/AdminLayout'));
const AdminLogin = lazy(() => import('../pages/admin/Login'));
const AdminForgotPassword = lazy(() => import('../pages/admin/ForgotPassword'));
const AdminDashboard = lazy(() => import('../pages/admin/Dashboard'));
const HeroEditor = lazy(() => import('../pages/admin/sections/HeroEditor'));
const AboutEditor = lazy(() => import('../pages/admin/sections/AboutEditor'));
const ArtistsEditor = lazy(() => import('../pages/admin/sections/ArtistsEditor'));
const ReleasesEditor = lazy(() => import('../pages/admin/sections/ReleasesEditor'));
const VideosEditor = lazy(() => import('../pages/admin/sections/VideosEditor'));
const NewsEditor = lazy(() => import('../pages/admin/sections/NewsEditor'));
const ContactEditor = lazy(() => import('../pages/admin/sections/ContactEditor'));
const SettingsEditor = lazy(() => import('../pages/admin/sections/SettingsEditor'));
const AdminUsers = lazy(() => import('../pages/admin/Users'));
const AdminProfile = lazy(() => import('../pages/admin/Profile'));

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
  {
    path: '/privacidade',
    element: <PrivacyPage />,
  },
  {
    path: '/termos',
    element: <TermsPage />,
  },
  {
    path: '/cookies',
    element: <CookiesPage />,
  },
  {
    path: '/convite/:token',
    element: <Invite />,
  },
  // Admin Routes
  {
    path: '/admin/login',
    element: <AdminLogin />,
  },
  {
    path: '/admin/esqueci-senha',
    element: <AdminForgotPassword />,
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
        path: 'sections/settings',
        element: <SettingsEditor />,
      },
      {
        path: 'users',
        element: <AdminUsers />,
      },
      {
        path: 'profile',
        element: <AdminProfile />,
      },
    ],
  },
  {
    path: '*',
    element: <NotFound />,
  },
];

export default routes;