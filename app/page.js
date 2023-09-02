import { authOptions } from "@/pages/api/auth/[...nextauth]"
import { getServerSession } from "next-auth"

import {ReserveModalBtn} from "@/component/button/button";

import AllSeat from "@/component/seat/seat";

import SelectZone from "@/component/selectZone/SelectZone";
import Login from "@/component/login/Login";
import SeatModal from "@/component/modal/seatModal";

export default async function Home() {

  let session = await getServerSession(authOptions);

  return (
      session ? 
      // 세션이 있음 => 좌석 예약 페이지
      <>
        <div className="wrap">
            <div className="seatL">
                <AllSeat type='reserve'/>
            </div>
            <div className="seatR">
                <SelectZone/>
                <ReserveModalBtn/>
            </div>
        </div>
        <SeatModal/>
      </>
      : 
      // 세션이 없음 => 로그인 페이지
      <Login/>
  )
}