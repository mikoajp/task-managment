// src/app/page.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { TaskList } from '@/components/tasks/TaskList';
import { PocketList } from '@/components/pockets/PocketList';
import { usePocketStore } from '@/store/pocketStore';
import { motion } from 'framer-motion';

export default function Home() {
  const router = useRouter();
  const { selectedPocketId } = usePocketStore();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth/login');
    }
  }, [router]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    }
  };

  return (
      <motion.main
          className="min-h-screen bg-gray-50 py-8"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header  */}
          <motion.div
              className="mb-8 flex justify-between items-center"
              variants={itemVariants}
          >
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Task Management
              </h1>
              <p className="mt-2 text-sm text-gray-600">
                Organize your tasks efficiently with pockets
              </p>
            </div>
          </motion.div>

          {/* Main Content */}
          <div className="flex flex-col md:flex-row gap-6">
            {/* Sidebar - Pockets */}
            <motion.div
                className="w-full md:w-64 flex-shrink-0"
                variants={itemVariants}
            >
              <div className="bg-white shadow-sm rounded-lg p-4">
                <PocketList />
              </div>
            </motion.div>

            {/* Main Content - Tasks */}
            <motion.div
                className="flex-1"
                variants={itemVariants}
            >
              <div className="bg-white shadow-sm rounded-lg p-4">
                {selectedPocketId ? (
                    <TaskList pocketId={selectedPocketId} />
                ) : (
                    <div className="text-center py-12">
                      <p className="text-gray-500">
                        Select a pocket to view tasks
                      </p>
                    </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </motion.main>
  );
}