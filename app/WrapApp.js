'use client'

import { SessionProvider } from "next-auth/react";
import { RecoilRoot } from "recoil";

export default function WrapApp({ children }) {
  return (
    <RecoilRoot>
      <SessionProvider>{children}</SessionProvider>
    </RecoilRoot>
    )
}