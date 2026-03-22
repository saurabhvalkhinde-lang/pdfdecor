import { createBrowserRouter } from 'react-router';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Invoice } from './pages/Invoice';
import { Certificate } from './pages/Certificate';
import { Quotation } from './pages/Quotation';
import { Bill } from './pages/Bill';
import { Receipt } from './pages/Receipt';
import { Estimate } from './pages/Estimate';
import { OfferLetter } from './pages/OfferLetter';
import { AppointmentLetter } from './pages/AppointmentLetter';
import { IDCard } from './pages/IDCard';
import { EventPass } from './pages/EventPass';
import { BulkCertificate } from './pages/BulkCertificate';
import { BulkEventPass } from './pages/BulkEventPass';
import { Login } from './pages/Login';
import { Pricing } from './pages/Pricing';
import { Profile } from './pages/Profile';
import { History } from './pages/History';
import { Analytics } from './pages/Analytics';
import { HelpCenter } from './pages/HelpCenter';
import { Privacy } from './pages/Privacy';
import { Terms } from './pages/Terms';
import { About } from './pages/About';

// Admin
import { AdminShell } from '../admin/components/AdminShell';
import { AdminLayout } from '../admin/components/AdminLayout';
import { AdminRouteGuard } from '../admin/pages/AdminRouteGuard';
import { AdminIndexRedirect } from '../admin/pages/AdminIndexRedirect';
import { AdminLogin } from '../admin/pages/AdminLogin';
import { AdminDashboard } from '../admin/pages/AdminDashboard';
import { AdminUsers } from '../admin/pages/AdminUsers';
import { AdminUserDetail } from '../admin/pages/AdminUserDetail';
import { AdminDocuments } from '../admin/pages/AdminDocuments';
import { AdminTemplates } from '../admin/pages/AdminTemplates';
import { AdminSubscriptions } from '../admin/pages/AdminSubscriptions';
import { AdminBulkJobs } from '../admin/pages/AdminBulkJobs';
import { AdminAnalytics } from '../admin/pages/AdminAnalytics';
import { AdminActivity } from '../admin/pages/AdminActivity';
import { AdminAds } from '../admin/pages/AdminAds';
import { AdminSettings } from '../admin/pages/AdminSettings';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Layout,
    children: [
      { index: true, Component: Home },
      { path: 'invoice', Component: Invoice },
      { path: 'certificate', Component: Certificate },
      { path: 'quotation', Component: Quotation },
      { path: 'bill', Component: Bill },
      { path: 'receipt', Component: Receipt },
      { path: 'estimate', Component: Estimate },
      { path: 'offer-letter', Component: OfferLetter },
      { path: 'appointment-letter', Component: AppointmentLetter },
      { path: 'id-card', Component: IDCard },
      { path: 'event-pass', Component: EventPass },
      { path: 'bulk-certificate', Component: BulkCertificate },
      { path: 'bulk-event-pass', Component: BulkEventPass },
      { path: 'login', Component: Login },
      { path: 'pricing', Component: Pricing },
      { path: 'profile', Component: Profile },
      { path: 'history', Component: History },
      { path: 'analytics', Component: Analytics },
      { path: 'help', Component: HelpCenter },
      { path: 'privacy', Component: Privacy },
      { path: 'terms', Component: Terms },
      { path: 'about', Component: About },
    ],
  },

  // Admin (separate shell + auth context)
  {
    path: '/admin',
    Component: AdminShell,
    children: [
      { path: 'login', Component: AdminLogin },
      {
        Component: AdminRouteGuard,
        children: [
          {
            Component: AdminLayout,
            children: [
              { index: true, Component: AdminIndexRedirect },
              { path: 'dashboard',         Component: AdminDashboard },
              { path: 'users',             Component: AdminUsers },
              { path: 'users/:userId',     Component: AdminUserDetail },
              { path: 'documents',         Component: AdminDocuments },
              { path: 'templates',         Component: AdminTemplates },
              { path: 'subscriptions',     Component: AdminSubscriptions },
              { path: 'bulk-jobs',         Component: AdminBulkJobs },
              { path: 'analytics',         Component: AdminAnalytics },
              { path: 'activity',          Component: AdminActivity },
              { path: 'ads',               Component: AdminAds },
              { path: 'settings',          Component: AdminSettings },
            ],
          },
        ],
      },
    ],
  },
]);
