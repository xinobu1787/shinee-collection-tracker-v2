import ApplicationLogo from '@/Components/Breeze/ApplicationLogo';
import { Link } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    return (
        <div className="flex min-h-screen flex-col items-center bg-[var(--base-color)] pt-6 sm:justify-center sm:pt-0">
            <div>
                <h1 className="text-3xl font-bold text-white">
                    SHINee Collection Tracker
                </h1>
            </div>

            <div className="mt-6 w-full overflow-hidden bg-white px-10 py-8 shadow-[var(--card-shadow)] sm:max-w-md sm:rounded-lg">
                {children}
            </div>
        </div>
    );
}
