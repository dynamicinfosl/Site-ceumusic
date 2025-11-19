import type { RouteObject } from 'react-router-dom';
import { lazy } from 'react';

const Home = lazy(() => import('../pages/home/page'));
const Artists = lazy(() => import('../pages/artists/page'));
const ArtistDetail = lazy(() => import('../pages/artist-detail/page'));
const Releases = lazy(() => import('../pages/releases/page'));
const News = lazy(() => import('../pages/news/page'));
const Contact = lazy(() => import('../pages/contact/page'));
const NotFound = lazy(() => import('../pages/NotFound'));

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
    path: '/contato',
    element: <Contact />,
  },
  {
    path: '*',
    element: <NotFound />,
  },
];

export default routes;