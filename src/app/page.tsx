'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { TaskList } from '@/components/tasks/TaskList';
import { PocketList } from '@/components/pockets/PocketList';
import { usePocketStore } from '@/store/pocketStore';
import { motion } from 'framer-motion';

export default function Home() {
  const router = useRouter();
  const { selectedPocketId, pockets } = usePocketStore();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth/login');
    }
  }, [router]);

  const selectedPocket = pockets.find(p => p._id === selectedPocketId);

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
      opacity: 1
    }
  };

  return (
      <motion.main
          className="min-h-screen w-full bg-gray-50 flex"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
      >
        {/* Sidebar */}
        <motion.aside
            className="w-1/4 bg-white shadow-md p-4"
            variants={itemVariants}
        >
          <PocketList />
        </motion.aside>

        {/* Main Content */}
        <motion.section
            className="flex-1 bg-gray-100 p-6"
            variants={itemVariants}
        >

          {/* Tasks Section */}
          <div className="bg-white shadow-sm rounded-lg p-4">
            {selectedPocketId ? (
                <TaskList
                    pocketId={selectedPocketId}
                    pocketName={selectedPocket?.name}
                    pocketEmoji={selectedPocket?.emoji}
                />
            ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500">Select a pocket to view tasks</p>
                </div>
            )}
          </div>
        </motion.section>
      </motion.main>
  );
}
