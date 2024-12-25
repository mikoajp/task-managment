'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { TaskList } from '@/components/tasks/TaskList';
import { PocketList } from '@/components/pockets/PocketList';
import { usePocketStore } from '@/store/pocketStore';
import { motion, AnimatePresence } from 'framer-motion';
import { CompleteProfileModal } from '@/components/modals/CompleteProfileModal';

export default function Home() {
  const router = useRouter();
  const { selectedPocketId, pockets } = usePocketStore();
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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

  return (
      <>
        {showProfileModal && (
            <CompleteProfileModal onClose={() => setShowProfileModal(false)} />
        )}

        <main className="min-h-screen w-full bg-gray-50 flex flex-col lg:flex-row">
          {/* Mobile Header */}
          <header className="lg:hidden bg-white p-4 flex items-center justify-between shadow-md sticky top-0 z-40">
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
            <div className="w-6" />
          </header>

          {/* Sidebar */}
          <div
              className={`
            fixed inset-y-0 left-0 z-30 w-[80vw] mt-4 sm:w-72 lg:relative lg:w-1/4 bg-white shadow-lg lg:shadow-none 
            transform transition-transform duration-300 
            ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}
          >
            <PocketList onPocketSelect={() => setIsSidebarOpen(false)} />
          </div>

          {/* Overlay for Mobile Sidebar */}
          {isSidebarOpen && (
              <div
                  className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
                  onClick={() => setIsSidebarOpen(false)}
              />
          )}

          {/* Main Content */}
          <section className="flex-1 bg-gray-100 p-4 lg:p-6">
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
          </section>
        </main>
      </>
  );
}
