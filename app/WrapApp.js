'use client'

import LoadModal from "@/component/modal/loadModal";
import { SessionProvider } from "next-auth/react";
import { RecoilRoot } from "recoil";

export default function WrapApp({ children }) {
  return (
    <RecoilRoot>
      <SessionProvider>{children}</SessionProvider>
      <LoadModal/>
    </RecoilRoot>
    )
}