import Login from "@/components/pages/LoginPage";
import { auth } from "@/lib/auth/config";
import { headers } from "next/headers";
import { redirect } from "next/navigation";


export default async function PageLogin() {
    const session = await auth.api.getSession({
        headers: await headers()
    })

    if (session?.user) {
        redirect("/");
    }

    return (
        <Login />
    );
}