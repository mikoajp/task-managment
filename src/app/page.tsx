'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { TaskList } from '@/components/tasks/TaskList';
import { PocketList } from '@/components/pockets/PocketList';
import { usePocketStore } from '@/store/pocketStore';
import { motion } from 'framer-motion';
import { CompleteProfileModal } from '@/components/modals/CompleteProfileModal';

export default function Home() {
  const router = useRouter();
  const { selectedPocketId, pockets } = usePocketStore();
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // For toggling the sidebar

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth/login');
      return;
    }

    const hasCompletedProfile = localStorage.getItem('hasCompletedProfile');
    if (!hasCompletedProfile) {
      setShowProfileModal(true);
    }
  }, [router]);

  const selectedPocket = pockets.find((p) => p._id === selectedPocketId);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0, opacity: 1,
    },
  };

  return (
      <>
        {showProfileModal && (
            <CompleteProfileModal onClose={() => setShowProfileModal(false)} />
        )}

        <motion.main
            className="min-h-screen w-full bg-gray-50 flex flex-col lg:flex-row"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
        >
          {/* Mobile Header */}
          <header className="lg:hidden bg-white p-4 flex items-center justify-between shadow-sm sticky top-0 z-40">
            <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="p-2 rounded-lg hover:bg-gray-100"
            >
              {/* Hamburger Icon */}
              <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
              >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16m-7 6h7"
                />
              </svg>
            </button>
            <h1 className="text-lg font-semibold">
              {selectedPocket ? (
                  <>
                    <span className="mr-2">{selectedPocket.emoji}</span>
                    {selectedPocket.name}
                  </>
              ) : (
                  'Task Management'
              )}
            </h1>
            <div className="w-6" />
          </header>

          {/* Sidebar */}
          <motion.aside
              className={`
                    fixed inset-y-0 left-0 z-30 w-[80vw] sm:w-72 lg:relative lg:w-1/4 
                    bg-white shadow-lg transform transition-transform duration-300
                    ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}
              variants={itemVariants}
          >
            <PocketList onPocketSelect={() => setIsSidebarOpen(false)} />
          </motion.aside>

          {/* Overlay for Mobile Sidebar */}
          {isSidebarOpen && (
              <div
                  className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
                  onClick={() => setIsSidebarOpen(false)}
              />
          )}

          {/* Main Content */}
          <motion.section
              className="flex-1 bg-gray-100 p-4 lg:p-6"
              variants={itemVariants}
          >
            <div className="bg-white shadow-sm rounded-lg p-4 lg:p-6 h-full">
              {selectedPocketId ? (
                  <TaskList
                      pocketId={selectedPocketId}
                      pocketName={selectedPocket?.name}
                      pocketEmoji={selectedPocket?.emoji}
                  />
              ) : (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-gray-500 text-center">
                      Select a pocket to view tasks
                    </p>
                  </div>
              )}
            </div>
          </motion.section>
        </motion.main>
      </>
  );
}
