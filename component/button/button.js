'use client'

import {signOut} from 'next-auth/react'
import { useRouter } from "next/navigation";
import styles from './button.module.css';
import { nowYm, nowYmList, selectItem } from '@/store/atoms';
import { useRecoilState } from 'recoil';
import { getLastYm, getNextYm, getPrevYm} from '@/util/ym';
import { modalState } from "@/store/atoms";
import { useEffect, useState } from 'react';

function Button(props){
    return(
        <button
            className={`${styles.btn} ${props.className}`}
            style={props.style}
            onClick={props.onClick}
        >{props.children}</button>
    )
}

function SnsBtn(props){
    return(
        <div className={`${styles.btn} ${styles.sns}`} type={props.snsType}>
            <img src={`/${props.snsType}.png`} style={{width: 50, height: 50}}/>
        </div>
    )
}

function LoginBtn(props){
    const router = useRouter();
    return(
        <Button
            // onClick={()=>{
            //     router.push('/')
            //     signIn();
            // }}
            onClick={props.onClick}
            style={{marginTop:40}}
        >로그인</Button>
    )
}

function LogoutBtn(){
    const router = useRouter();
    return(
        <Button
        onClick={()=>{
            signOut();
        }}
    >로그아웃</Button>
    )
}

function PrevBtn(){
    const [ym, setYm] = useRecoilState(nowYm);
    const [ymList, setYmList] = useRecoilState(nowYmList);

    const [prevYm, setPrevYm] = useState('');

    useEffect(()=>{
        // 현재 표시되어 있는 연도 월 바뀔때 이전과 다음 연월 세팅
        // 이전 달 값 세팅
        setPrevYm(getPrevYm(ym));
    },[ym])

    return(
        <Button
            className={ymList.includes(prevYm) ? '' : 'disabled'}
            style={{width: 30, height: 30, padding: 0}}
            onClick={()=>{
                setYm(getPrevYm(ym));
            }}
        >◀</Button>
    )
}

function NextBtn(){
    const [ym, setYm] = useRecoilState(nowYm);
    const [ymList, setYmList] = useRecoilState(nowYmList);

    const [nextYm, setNextYm] = useState('');

    useEffect(()=>{
        // 현재 표시되어 있는 연도 월 바뀔때 이전과 다음 연월 세팅
        // 다음 달 값 세팅
        setNextYm(getNextYm(ym));
    },[ym])

    return(
        <Button
            className={ymList.includes(nextYm) ? '' : 'disabled'}
            style={{width: 30, height: 30, padding: 0}}
            onClick={()=>{
                setYm(getNextYm(ym));
            }}
        >▶</Button>
    )
}

function MonthAddBtn(){
    const [ym, setYm] = useRecoilState(nowYm);
    const [ymList, setYmList] = useRecoilState(nowYmList);

    return(
        <Button
            style={{ marginBottom: 10, width: 'calc(100% - 20px)' }}
            onClick={()=>{
                    let lastYm = ymList[(ymList.length-1)];
                    let nextYm = getNextYm(lastYm);

                    let confirmMsg = `
                        다음 달을 추가하시겠습니까?
                        현재 설정 된 마지막 달은 ${lastYm.split('-')[0]}년 ${lastYm.split('-')[1]}월 이고
                        추가되는 달은 ${nextYm.split('-')[0]}년 ${nextYm.split('-')[1]}월 입니다.
                        * 새롭게 추가되는 달은 이전 달의 설정을 그대로 가져옵니다.
                        * 업데이트가 완료되었다는 알림을 반드시 기다려주세요.
                    `
                    if(confirm(confirmMsg)){
                        fetch('/api/ymList', {method:'POST'})
                        .then(r=>r.json())
                        .then(() => {
                            alert('업데이트가 완료되었습니다.')
                            let tempArr = [...ymList];
                            tempArr.push(nextYm);
                            setYmList(tempArr);
                            setYm(nextYm);
                        })
                    }

            }}
        >다음 달 추가하기</Button>
    )
}

function ReserveModalBtn(){
    const [state, setModalState] = useRecoilState(modalState);
    const [item, setItem] = useRecoilState(selectItem);

    return(
        <Button
            style={{width: 'calc(100% - 20px)'}}
            className={(item.length > 0) ? '' : 'disabled'}
            onClick={()=>{
                setModalState(true)
            }}
        >에약하기</Button>
    )
}

function SetModalBtn(){
    const [state, setModalState] = useRecoilState(modalState);
    const [item, setItem] = useRecoilState(selectItem);
    return(
        <Button
            style={{width: 'calc(100% - 20px)'}}
            className={(item.length > 0) ? '' : 'disabled'}
            onClick={()=>{
                setModalState(true)
            }}
        >선택된 좌석 설정하기</Button>
    )
}

export {Button, SnsBtn, LoginBtn, LogoutBtn, PrevBtn, NextBtn, MonthAddBtn, ReserveModalBtn, SetModalBtn}