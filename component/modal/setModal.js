'use client'

import style from './modal.module.css';
import { useRecoilState } from "recoil";
import { modalState, nowYm, selectItem, nowSeatList } from "@/store/atoms";
import { Input } from '../input/input';
import { Button } from '../button/button';
import { useState } from 'react';
import { Radio, RadioGroup } from '../radio/Radio';

export default function SetModal(){

    const [state, setModalState] = useRecoilState(modalState);
    const [item, setItem] = useRecoilState(selectItem);
    const [ym, setYm] = useRecoilState(nowYm);
    const [seatList, setSeatList] = useRecoilState(nowSeatList);
    const [type, setType] = useState('R');
    const [isLotte, setIsLotte] = useState('0');
    const [isObs, setIsObs] = useState('0');

    const typeChange = (e) => {
        console.log(e.target.value)
        setType(e.target.value)
    };
    const isLotteChange = (e) => {
        console.log(e.target.value)
        setIsLotte(e.target.value)
    };
    const isObsChange = (e) => {
        console.log(e.target.value)
        setIsObs(e.target.value)
    };

    return(
        <div className={style.modalWrap} style={state ? {display:'flex'} : {display:'none'}}>
            <div className={style.modalCont}>
                <div className={style.close} onClick={() => {
                    setModalState(false);
                    setType('R');
                    setIsLotte('0');
                    setIsObs('0');    
                }}></div>
                <div className={style.contWrap}>
                    <div className={style.title}>좌석 설정하기</div>
                    <div className={style.section}>
                        선택된 좌석
                    </div>
                    <div style={{marginBottom: 20}}>
                        {
                            item.length > 0 ? 
                            item.map((item, idx) => {
                                return(
                                    <div key={idx} style={{textTransform:'uppercase'}}>
                                        {item}
                                    </div>
                                )
                            })
                            : 
                            <div>선택된 좌석이 없습니다.</div>
                        }
                    </div>
                    <div className={style.section}>
                        좌석타입
                    </div>
                    <div style={{marginBottom: 20}}>
                    <RadioGroup>
                        <Radio name="type" value="R" onChange={typeChange} checked={type === 'R'}>R석</Radio>
                        <Radio name="type" value="S" onChange={typeChange} checked={type === 'S'}>S석</Radio>
                        <Radio name="type" value="A" onChange={typeChange} checked={type === 'A'}>A석</Radio>
                        <Radio name="type" value="B" onChange={typeChange} checked={type === 'B'}>B석</Radio>
                        <Radio name="type" value="C" onChange={typeChange} checked={type === 'C'}>C석</Radio>
                        <Radio name="type" value="HOLD" onChange={typeChange} checked={type === 'HOLD'}>유보석</Radio>
                        <Radio name="type" value="DEAD" onChange={typeChange} checked={type === 'DEAD'}>사석</Radio>
                        <Radio name="type" value="CAMERA" onChange={typeChange} checked={type === 'CAMERA'}>카메라석</Radio>
                        <Radio name="type" value="" onChange={typeChange} checked={type === ''}>미지정석</Radio>
                    </RadioGroup>
                    </div>
                    <div className={style.section}>
                        롯데좌석여부
                    </div>
                    <div style={{marginBottom: 20}}>
                        <RadioGroup>
                            <Radio name="isLotte" onChange={isLotteChange} value="0" checked={isLotte === '0'}>FALSE</Radio>
                            <Radio name="isLotte" onChange={isLotteChange} value="1" checked={isLotte === '1'}>TRUE</Radio>
                        </RadioGroup>
                    </div>
                    <div className={style.section}>
                        시야방해여부
                    </div>
                    <div style={{marginBottom: 20}}>
                        <RadioGroup>
                            <Radio name="isObs" value="0" onChange={isObsChange} checked={isObs === '0'}>FALSE</Radio>
                            <Radio name="isObs" value="1" onChange={isObsChange} checked={isObs === '1'}>TRUE</Radio>
                        </RadioGroup>
                    </div>
                    <div
                        style={{
                            display:'flex',
                            position:'absolute',
                            bottom: 20,
                            width:'calc(100% - 40px)'
                        }}
                    >
                        <Button
                            onClick={()=>{
                                fetch('/api/seat', {method: 'PUT', body: JSON.stringify({id:item, ym:ym, type: type, isLotte: isLotte, isObs: isObs })})
                                .then(setModalState(false))
                                .then(alert('좌석설정이 변경되었습니다.'))
                                .then(
                                    fetch('/api/seat?ym=' + ym).then(r=>r.json())
                                    .then((result) => {
                                        result = result.map((a)=>{
                                            a._id = a._id.toString();
                                            return a
                                        })
                                        setSeatList(result);
                                        setItem([]);
                                        setType('R');
                                        setIsLotte('0');
                                        setIsObs('0');
                                    })
                                )
                            }}
                        >저장하기</Button>
                    </div>
                </div>
            </div>
        </div>
    )
}