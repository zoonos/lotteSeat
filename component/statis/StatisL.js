'use client'

import { nowYm } from "@/store/atoms";
import { useEffect,useState } from "react";
import { useRecoilState } from "recoil";

function SeatStatis(props){
    return(
        <div style={{display:'flex', alignItems:'center', marginBottom: 10}}>
            <div style={{display:'flex', alignItems:'center', marginRight: 10, width: 300}}>
                <div style={
                    props.bg ? 
                    {backgroundColor:props.bg, width: 20, height: 20, marginRight: 10} : 
                    {borderWidth: 1, borderColor:'#000', borderStyle:'solid', width: 18, height: 18, marginRight: 10}
                }></div>
                <div>{props.seatName}</div>
            </div>
            <div style={{display:'flex', alignItems:'center'}}>
                <div>{props.data.info}석</div> /
                <div>{props.data.seat}석</div>
            </div>
        </div>
    )
}

export default function StatisL(){
    const [data, setData] = useState();
    const [ym, setYm] = useRecoilState(nowYm);

    useEffect(()=>{
        fetch('/api/statis?ym=' + ym).then(r=>r.json())
        .then((result) => {
            setData(result);
        })
    },[ym])

    return(
        <div>
            {
                data ? 
                <div>
                    <SeatStatis bg='rgb(210,133,130)' seatName='R석' data={data.r}/>
                    <SeatStatis bg='rgb(140,161,192)' seatName='S석' data={data.s}/>
                    <SeatStatis bg='rgb(246,215,184)' seatName='A석' data={data.a}/>
                    <SeatStatis bg='rgb(159,206,99)' seatName='B석' data={data.b}/>
                    <SeatStatis bg='rgb(191,191,191)' seatName='C석' data={data.c}/>
                    <hr/>
                    <SeatStatis bg='rgb(104,52,154)' seatName='유보석' data={data.hold}/>
                    <SeatStatis bg='rgb(166,166,166)' seatName='휠체어석' data={data.wheel}/>
                    <SeatStatis bg='rgb(8,31,92)' seatName='사석' data={data.dead}/>
                    <SeatStatis bg='rgb(234,51,247)' seatName='카메라석' data={data.camera}/>
                    <SeatStatis seatName='미지정석' data={data.nothing}/>
                    <hr/>
                    <SeatStatis bg='rgb(220,50,34)' seatName='R석(롯데)' data={data.rl}/>
                    <SeatStatis bg='rgb(45,105,177)' seatName='S석(롯데)' data={data.sl}/>
                    <SeatStatis bg='rgb(255,255,84)' seatName='A석(롯데)' data={data.al}/>
                    <SeatStatis bg='rgb(79,173,91)' seatName='B석(롯데)' data={data.bl}/>
                    <SeatStatis bg='rgb(79,173,234)' seatName='C석(롯데)' data={data.cl}/>
                    <hr/>
                    <SeatStatis bg='none' seatName='합계' data={data.total}/>
                </div>
            : 
                <div></div>
            }
        </div>
    )
}