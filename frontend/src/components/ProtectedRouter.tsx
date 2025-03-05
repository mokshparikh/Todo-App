"use client";

import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";

interface ProtectedRouterProps {
    children: ReactNode;
}

const ProtectedRouter: React.FC<ProtectedRouterProps> = ({ children }) => {
    const auth: string | undefined = Cookies.get("token");

    const router = useRouter();

    useEffect(() => {
        if (!auth) {
             router.push("/login");
         }
     }, [auth, router]);
     

    return <>{children}</>;
};

export default ProtectedRouter;
