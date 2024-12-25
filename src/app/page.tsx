'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { TaskList } from '@/components/tasks/TaskList';
import { PocketList } from '@/components/pockets/PocketList';
import { usePocketStore } from '@/store/pocketStore';

export default function Home() {
  const router = useRouter();
  const { selectedPocketId, pockets } = usePocketStore();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth/login');
    }
  }, [router]);

  const selectedPocket = pockets.find(p => p._id === selectedPocketId);

  return (
      <div className="min-h-screen bg-gray-50">
        {/* Mobile Header */}
        <div className="lg:hidden bg-white p-4 flex items-center justify-between shadow-sm">
          <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-lg hover:bg-gray-100"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
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
        </div>

        <div className="flex h-[calc(100vh-64px)] lg:h-screen">
          {/* Sidebar */}
          <aside
              className={`
           fixed lg:relative inset-y-0 left-0 z-30
           w-[80vw] sm:w-[300px] lg:w-[300px] xl:w-[350px]
           bg-white shadow-lg lg:shadow-none
           transform transition-transform duration-300 ease-in-out
           ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
           lg:translate-x-0
         `}
          >
            <PocketList onPocketSelect={() => setIsSidebarOpen(false)} />
          </aside>

          {/* Overlay for mobile */}
          {isSidebarOpen && (
              <div
                  className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
                  onClick={() => setIsSidebarOpen(false)}
              />
          )}

          {/* Main Content */}
          <main className="flex-1 overflow-y-auto p-4 lg:p-6 w-full">
            <div className="h-full bg-white rounded-lg shadow p-4 lg:p-6">
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
          </main>
        </div>
      </div>
  );
}