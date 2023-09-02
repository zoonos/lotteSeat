'use client'

import style from './modal.module.css';
import { useRecoilState } from "recoil";
import { statisName, statisNum, statisSeat, modalState, statisType } from "@/store/atoms";
export default function StatisModal(props){

    const [name, setName] = useRecoilState(statisName);
    const [num, setNum] = useRecoilState(statisNum);
    const [seat, setSeat] = useRecoilState(statisSeat);
    const [type, setType] = useRecoilState(statisType);
    const [state, setModalState] = useRecoilState(modalState);

    return(
        <div className={style.modalWrap} style={state ? {display:'flex'} : {display:'none'}}>
            <div className={style.modalCont}>
                <div className={style.close} onClick={() => {setModalState(false)}}></div>
                <div className={style.contWrap}>
                    <div className={style.title}>예약 확인</div>
                    <div className={style.section}>
                        예약자 이름
                    </div>
                    <div style={{marginBottom: 20}}>
                        {name}
                    </div>
                    <div className={style.section}>
                        예약자 번호
                    </div>
                    <div style={{marginBottom: 20}}>
                        {num}
                    </div>
                    <div>
                        <div className={style.section}>예약 좌석 ( 총 {seat.length}장 )</div>
                        {seat.map((item, idx)=>{
                            return(
                                <div key={idx} style={{textTransform:'uppercase'}}>
                                    {item.split('-')[0]}층 {item.split('-')[1]}구역 {item.split('-')[2]}열 {item.split('-')[3]} - ( {type[idx]}석 )
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </div>
    )
}