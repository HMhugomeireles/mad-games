import type { ReactNode } from "react";
import AdminMenu from "@/components/admin-menu";
import { Toaster } from "@/components/ui/sonner";


export const metadata = {
    title: "Admin",
};


export default function AdminLayout({ children }: { children: ReactNode }) {
    // Nota: não usamos container aqui para evitar "double padding".
    // As páginas /admin/* que já têm container continuam válidas.
    return (
        <section>
            <AdminMenu />
            <Toaster richColors position="top-center" closeButton />
            {children}
        </section>
    );
}