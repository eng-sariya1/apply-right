import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Search, Shield, ShieldOff } from 'lucide-react';
import { collection, getDocs, doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../AuthContext';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Tag } from 'primereact/tag';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';

interface UserData {
    uid: string;
    email: string;
    displayName: string | null;
    role: 'user' | 'admin';
    status: 'active' | 'blocked';
    cvCount: number;
    createdAt: string;
}

const roleOptions = [
    { label: 'All Roles', value: '' },
    { label: 'Admin', value: 'admin' },
    { label: 'User', value: 'user' },
];

export default function UsersManagement() {
    const { currentUser } = useAuth();
    const [users, setUsers] = useState<UserData[]>([]);
    const [loading, setLoading] = useState(true);
    const [globalFilter, setGlobalFilter] = useState('');
    const [roleFilter, setRoleFilter] = useState('');
    const [togglingUid, setTogglingUid] = useState<string | null>(null);

    useEffect(() => {
        async function fetchUsers() {
            try {
                const usersSnapshot = await getDocs(collection(db, 'users'));
                const usersData: UserData[] = await Promise.all(
                    usersSnapshot.docs.map(async (userDoc) => {
                        const data = userDoc.data();
                        let cvCount = 0;
                        try {
                            const cvDoc = await getDoc(doc(db, 'cvs', userDoc.id));
                            if (cvDoc.exists()) {
                                cvCount = (cvDoc.data().cvList || []).length;
                            }
                        } catch {
                            // User has no CVs doc
                        }
                        return {
                            uid: userDoc.id,
                            email: data.email || '',
                            displayName: data.displayName || null,
                            role: data.role || 'user',
                            status: data.status || 'active',
                            cvCount,
                            createdAt: data.createdAt || '',
                        };
                    })
                );
                setUsers(usersData);
            } catch (err) {
                console.error('Failed to fetch users:', err);
            } finally {
                setLoading(false);
            }
        }
        fetchUsers();
    }, []);

    async function toggleStatus(uid: string, currentStatus: 'active' | 'blocked') {
        const newStatus = currentStatus === 'active' ? 'blocked' : 'active';
        setTogglingUid(uid);
        try {
            await updateDoc(doc(db, 'users', uid), { status: newStatus });
            setUsers((prev) =>
                prev.map((u) => (u.uid === uid ? { ...u, status: newStatus } : u))
            );
        } catch (err) {
            console.error('Failed to update user status:', err);
        } finally {
            setTogglingUid(null);
        }
    }

    const filteredUsers = roleFilter
        ? users.filter((u) => u.role === roleFilter)
        : users;

    const nameBodyTemplate = (rowData: UserData) => (
        <span className="font-medium text-[var(--color-text-dark)]">
            {rowData.displayName || 'No Name'}
        </span>
    );

    const emailBodyTemplate = (rowData: UserData) => (
        <span className="text-[#4A6B75]">{rowData.email}</span>
    );

    const roleBodyTemplate = (rowData: UserData) => (
        <Tag
            value={rowData.role}
            severity={rowData.role === 'admin' ? 'warning' : 'info'}
            className="text-xs font-semibold"
        />
    );

    const statusBodyTemplate = (rowData: UserData) => (
        <Tag
            value={rowData.status}
            severity={rowData.status === 'active' ? 'success' : 'danger'}
            className="text-xs font-semibold"
        />
    );

    const cvCountBodyTemplate = (rowData: UserData) => (
        <span className="font-medium text-[var(--color-text-dark)]">{rowData.cvCount}</span>
    );

    const actionsBodyTemplate = (rowData: UserData) => {
        const isSelf = rowData.uid === currentUser?.uid;
        const isToggling = togglingUid === rowData.uid;
        const isBlocked = rowData.status === 'blocked';

        return (
            <button
                onClick={() => toggleStatus(rowData.uid, rowData.status)}
                disabled={isSelf || isToggling}
                title={isSelf ? 'Cannot change your own status' : isBlocked ? 'Unblock user' : 'Block user'}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                    isSelf
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : isBlocked
                            ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                            : 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-200'
                }`}
            >
                {isBlocked ? (
                    <>
                        <Shield className="w-3.5 h-3.5" />
                        {isToggling ? 'Unblocking...' : 'Unblock'}
                    </>
                ) : (
                    <>
                        <ShieldOff className="w-3.5 h-3.5" />
                        {isToggling ? 'Blocking...' : 'Block'}
                    </>
                )}
            </button>
        );
    };

    const header = (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-light)]" />
                <InputText
                    value={globalFilter}
                    onChange={(e) => setGlobalFilter(e.target.value)}
                    placeholder="Search users..."
                    className="pl-9 pr-4 py-2 border border-[var(--color-border)]/50 rounded-xl bg-[var(--color-surface-80)] text-sm focus:outline-none focus:ring-2 focus:ring-[#017A8C]/30 focus:border-[#017A8C] transition-all"
                />
            </div>
            <Dropdown
                value={roleFilter}
                options={roleOptions}
                onChange={(e) => setRoleFilter(e.value)}
                placeholder="Filter by role"
                className="border border-[var(--color-border)]/50 rounded-xl text-sm"
            />
        </div>
    );

    return (
        <div className="min-h-screen bg-[var(--color-bg)] relative overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-[#017A8C]/10 via-transparent to-transparent blur-3xl rounded-full" />
                <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-gradient-to-l from-[#017A8C]/10 via-transparent to-transparent blur-3xl rounded-full" />
            </div>

            {/* Sticky Header */}
            <motion.header
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="sticky top-0 z-50 backdrop-blur-lg bg-[var(--color-bg)]/90 border-b border-[#017A8C]/20 shadow-sm"
            >
                <nav className="container mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Link
                                to="/dashboard"
                                className="flex items-center gap-2 text-[#017A8C] hover:text-[#015C6A] font-medium transition-colors"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Back to Dashboard
                            </Link>
                        </div>
                        <Link to="/">
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                transition={{ duration: 0.2 }}
                                className="text-2xl font-bold text-[#017A8C] tracking-tight"
                            >
                                Nuivo
                            </motion.div>
                        </Link>
                    </div>
                </nav>
            </motion.header>

            {/* Main Content */}
            <main className="container mx-auto px-6 py-12 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="mb-8"
                >
                    <h1 className="text-3xl md:text-4xl font-bold text-[var(--color-text-dark)] mb-2">
                        User Management
                    </h1>
                    <p className="text-[var(--color-text-light)]">
                        Manage user accounts and permissions
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="bg-[var(--color-surface-80)] backdrop-blur-sm rounded-2xl border border-[var(--color-border)]/30 shadow-lg p-6 overflow-hidden"
                >
                    <DataTable
                        value={filteredUsers}
                        loading={loading}
                        dataKey="uid"
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25]}
                        globalFilter={globalFilter}
                        header={header}
                        emptyMessage="No users found."
                        sortMode="single"
                        removableSort
                        className="users-datatable"
                        tableStyle={{ minWidth: '50rem' }}
                    >
                        <Column field="displayName" header="Name" body={nameBodyTemplate} sortable />
                        <Column field="email" header="Email" body={emailBodyTemplate} sortable />
                        <Column field="role" header="Role" body={roleBodyTemplate} sortable style={{ width: '8rem' }} />
                        <Column field="cvCount" header="CVs Created" body={cvCountBodyTemplate} sortable style={{ width: '9rem' }} />
                        <Column field="status" header="Status" body={statusBodyTemplate} sortable style={{ width: '8rem' }} />
                        <Column header="Actions" body={actionsBodyTemplate} style={{ width: '10rem' }} />
                    </DataTable>
                </motion.div>
            </main>
        </div>
    );
}
