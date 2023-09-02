import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth";

import StatisL from "@/component/statis/StatisL";
import StatisR from "@/component/statis/StatisR";
import Login from "@/component/login/Login";

import StatisModal from "@/component/modal/statisModal";

export default async function StatisPage() {

    let session = await getServerSession(authOptions);

    return (
        session ? 
        // 세션이 있음 => 통계 페이지
        <>
            <div className="wrap">
                <div className="divide l">
                    <StatisL/>
                </div>
                <div className="divide r">
                    <StatisR/>
                </div>
            </div>
            <StatisModal/>
        </>
        : 
        // 세션이 없음 => 로그인 페이지
        <Login/>
    )
}