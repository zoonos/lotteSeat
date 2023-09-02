import { authOptions } from "@/pages/api/auth/[...nextauth]"
import { getServerSession } from "next-auth"

import {SetModalBtn, MonthAddBtn} from "@/component/button/button";
import AllSeat from "@/component/seat/seat";

import SelectZone from "@/component/selectZone/SelectZone";
import Login from "@/component/login/Login";
import SetModal from "@/component/modal/setModal";

export default async function SetPage() {

    let session = await getServerSession(authOptions);

    return (
        session ? 
        // 세션이 있음 => 설정 페이지
        <>
            <div className="wrap">
                <div className="seatL">
                    <AllSeat type='set'/>
                </div>
                <div className="seatR">
                    <MonthAddBtn/>
                    <SelectZone/>
                    <SetModalBtn/>
                </div>
            </div>
            <SetModal/>
        </>
        : 
        // 세션이 없음 => 로그인 페이지
        <Login/>
    )
}