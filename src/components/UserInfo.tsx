import { useEffect } from 'react';
import { useUserStore } from '@/store/userStore';
import { LogoutButton } from './LogoutButton';

export function UserInfo() {
    const { user, fetchUser } = useUserStore();

    useEffect(() => {
        fetchUser();
    }, [fetchUser]);

    return (
        <div className="flex items-center justify-between p-4 mt-4 bg-gray-50 border-t border-gray-200 rounded-lg shadow-sm">
            <div className="flex items-center gap-4">
                <img
                    src={user?.avatarUrl || "https://via.placeholder.com/40"}
                    alt="User profile"
                    className="w-12 h-12 rounded-full object-cover border border-gray-300 shadow"
                />
                <div>
                    <p className="font-semibold text-gray-900">
                        {user?.firstName} {user?.lastName}
                    </p>
                    <p className="text-sm text-gray-500">User Profile</p>
                </div>
            </div>
            <LogoutButton />
        </div>
    );
}