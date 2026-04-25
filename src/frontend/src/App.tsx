import { AdminLoginModal } from "@/components/AdminLoginModal";
import { AdminProvider } from "@/components/AdminProvider";
import { Layout } from "@/components/Layout";
import { Toaster } from "@/components/ui/sonner";
import AboutPage from "@/pages/AboutPage";
import ArticleDetailPage from "@/pages/ArticleDetailPage";
import ArticlesPage from "@/pages/ArticlesPage";
import ContactPage from "@/pages/ContactPage";
import HomePage from "@/pages/HomePage";
import NoteDetailPage from "@/pages/NoteDetailPage";
import NotesPage from "@/pages/NotesPage";
import PublicationsPage from "@/pages/PublicationsPage";
import ResearchDetailPage from "@/pages/ResearchDetailPage";
import ResearchPage from "@/pages/ResearchPage";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
  redirect,
  useRouterState,
} from "@tanstack/react-router";
import { Lock } from "lucide-react";
import { Suspense, lazy, useState } from "react";

// ─── Admin page (lazy — hidden from nav) ─────────────────────────────────────
const AdminPage = lazy(() => import("@/pages/AdminPage"));

// ─── Root shell — renders Layout for public pages, bare Outlet for /admin ─────
function RootShell() {
  const { location } = useRouterState();
  const isAdmin = location.pathname.startsWith("/admin");
  if (isAdmin) return <Outlet />;
  return <Layout />;
}

// ─── Root ─────────────────────────────────────────────────────────────────────
const rootRoute = createRootRoute({ component: RootShell });

// ─── Public Routes ────────────────────────────────────────────────────────────
const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage,
});

const researchRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/research",
  component: ResearchPage,
});
const researchDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/research/$id",
  component: ResearchDetailPage,
});

const articlesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/articles",
  component: ArticlesPage,
});
const articleDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/articles/$id",
  component: ArticleDetailPage,
});

const publicationsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/publications",
  component: PublicationsPage,
});

const notesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/notes",
  component: NotesPage,
});
const noteDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/notes/$id",
  component: NoteDetailPage,
});

const aboutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/about",
  component: AboutPage,
});
const contactRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/contact",
  component: ContactPage,
});

// ─── Admin Route ──────────────────────────────────────────────────────────────
const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin",
  component: () => (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center text-muted-foreground">
          Loading…
        </div>
      }
    >
      <AdminPage />
    </Suspense>
  ),
});

// Catch-all redirect to home
const catchAllRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/*",
  beforeLoad: () => {
    throw redirect({ to: "/" });
  },
  component: () => null,
});

// ─── Router ───────────────────────────────────────────────────────────────────
const routeTree = rootRoute.addChildren([
  homeRoute,
  researchRoute,
  researchDetailRoute,
  articlesRoute,
  articleDetailRoute,
  publicationsRoute,
  notesRoute,
  noteDetailRoute,
  aboutRoute,
  contactRoute,
  adminRoute,
  catchAllRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

// ─── Admin lock button (fixed, discreet) ─────────────────────────────────────
function AdminLockButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        data-ocid="admin_login.open_modal_button"
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Admin login"
        className="fixed bottom-5 right-5 z-50 flex h-9 w-9 items-center justify-center rounded-full opacity-30 hover:opacity-80 transition-opacity duration-300 focus-visible:outline-none focus-visible:ring-2"
        style={{
          background: "rgba(212,175,55,0.15)",
          border: "1px solid rgba(212,175,55,0.35)",
          color: "#d4af37",
        }}
      >
        <Lock size={14} />
      </button>
      <AdminLoginModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <AdminProvider>
      <RouterProvider router={router} />
      <Toaster />
      <AdminLockButton />
    </AdminProvider>
  );
}
