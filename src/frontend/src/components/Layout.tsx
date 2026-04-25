import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Outlet } from "@tanstack/react-router";
import { useRouterState } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";

export function Layout() {
  const { location } = useRouterState();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <AnimatePresence mode="wait">
        <motion.main
          key={location.pathname}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
          className="flex-1 flex flex-col"
        >
          <Outlet />
        </motion.main>
      </AnimatePresence>
      <Footer />
    </div>
  );
}
