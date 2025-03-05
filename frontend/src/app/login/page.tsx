"use client";

import React from "react";
import dynamic from "next/dynamic";

const LoginForm = dynamic(() => import("../../pages/LoginForm"), {
    ssr: false,
});

const Page = () => {
    return (
        <div>
            <LoginForm />
        </div>
    );
};

export default Page;
