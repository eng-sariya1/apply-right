import { Navigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { Loader2 } from 'lucide-react';
import type { ReactNode } from 'react';

export default function AdminRoute({ children }: { children: ReactNode }) {
    const { currentUser, userRole, userStatus, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#FAF7F0]">
                <Loader2 className="w-8 h-8 animate-spin text-[#017A8C]" />
            </div>
        );
    }

    if (!currentUser || userRole !== 'admin') {
        return <Navigate to="/" replace />;
    }

    if (userStatus === 'blocked') {
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
}
