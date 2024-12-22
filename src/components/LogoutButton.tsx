'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';

interface LogoutButtonProps {
    className?: string;
}

export function LogoutButton({ className }: LogoutButtonProps) {
    const router = useRouter();

    const handleLogout = () => {
        localStorage.removeItem('token');
        document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
        router.push('/auth/login');
        router.refresh();
    };

    return (
        <Button
            onClick={handleLogout}
            variant="secondary"
            className={className}
        >
            Logout
        </Button>
    );
}