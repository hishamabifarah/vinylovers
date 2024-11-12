"use client";

import logo from "@/assets/viny.png";
import Image from "next/image";
import { useRouter } from "next/navigation";
import NavbarHome from "@/components/navigation/NavbarHome";

export default function Page() {
  const router = useRouter();

  const handleLoginRedirect = () => {
    router.push("/login");
  };
  const handleSignupRedirect = () => {
    router.push("/signup");
  };
  const handleHomeRedirect = () => {
    router.push("/home");
  };

  return (
    <>
    <NavbarHome/>

    </>
  );
}
