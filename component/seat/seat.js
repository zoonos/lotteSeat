'use client'

import { useRecoilState } from 'recoil';
import styles from './seat.module.css';
import { useEffect, useState } from 'react';
import { nowYm, selectItem, nowSeatList } from '@/store/atoms';

// let seatList;

function setSeat(item, type){
    let chk = document.getElementById(item.id); // 체크박스
    let label = chk.nextSibling; // 라벨
    let data = item.data[0]; // 넘겨받은 데이터
    // 등급에 따른 색상 구분
    let bg;
    switch (data.type){
        case 'R' : // R석
            data.isLotte ? bg = 'rgb(220,50,34)' : bg = 'rgb(210,133,130)';
            break;
        case 'S' : // S석
            data.isLotte ? bg = 'rgb(45,105,177)' : bg = 'rgb(140,161,192)';
            break;
        case 'A' : // A석
            data.isLotte ? bg = 'rgb(255,255,84)' : bg = 'rgb(246,215,184)';
            break;
        case 'B' : // B석
            data.isLotte ? bg = 'rgb(79,173,91)' : bg = 'rgb(159,206,99)';
            break;
        case 'C' : // C석
            data.isLotte ? bg = 'rgb(79,173,234)' : bg = 'rgb(191,191,191)';
            break;
        case 'HOLD' : // 유보석
            bg = 'rgb(104,52,154)';
            break;
        case 'WHEEL' : // 휠체어석
            bg = 'rgb(166,166,166)';
            break;
        case 'DEAD' : // 사석
            bg = 'rgb(8,31,92)';
            break;
        case 'CAMERA' : // 카메라석
            bg = 'rgb(234,51,247)';
            break;
        default : // 미지정
            bg = 'rgb(255,255,255)';
            break;
    }
    label.style.backgroundColor = bg;

    // 좌석 내부 표기
    let innerInfo;
    if(data.info){
        // 내부 내용이 있다면
        // 예약자의 정보를 표기
        let lastNum = data.info.number.split('-')[2]; // 번호 끝자리
        innerInfo = `<div>
                        <div style="margin-bottom: 3px">${data.info.name}</div>
                        <div>(${lastNum})</div>
                    </div>`
    } else {
        // 내부 내용이 없다면
        // 좌석의 번호를 표기
        let seatNum = item.id.split('-')[3]; // 좌석번호
        innerInfo = `<div>
                        <div style="font-size: 18px">${seatNum}</div>
                    </div>`
    }
    label.innerHTML = innerInfo;

    // 세팅화면이 아닐때만 클릭방지 효과 적용
    if(type !== 'set'){
        // 롯데 좌석 여부에 따른 클릭 방지
        (data.isLotte) && (label.style.pointerEvents = 'none');
        // 유보석과 사석도 클릭 방지 추가
        ((data.type === 'HODL') || (data.type === 'DEAD')) && (label.style.pointerEvents = 'none');
    }

    // 시야 방해석일때 표시
    if(data.isObstruct){
        label.style.backgroundImage = 'url(../x.png)';
        label.style.color = 'rgb(255,255,255)';
    } else {
        label.style.backgroundImage = 'none';
        label.style.color = 'rgb(0,0,0)';
    }
    
}

function Seat(props){

    const [item, setItem] = useRecoilState(selectItem);

    const checkHandler = ({ target }) => {
        if(target.checked){
            // 체크 되었을 때
            let tempArr = [...item];
            tempArr.push(target.id);
            setItem(tempArr);
        } else {
            // 체크 해제 되었을 때
            let tempArr = [...item];
            let filtered = tempArr.filter((el) => el !== target.id);
            setItem(filtered)
        }
    };

    return(
        <div className={styles.seat}>
            <input type="checkbox" id={props.id} onChange={(e) => checkHandler(e)}/>
            <label htmlFor={props.id}></label>
        </div>
    )
}

export default function AllSeat(props){

    const [ym, setYm] = useRecoilState(nowYm);
    const [seatList, setSeatList] = useRecoilState(nowSeatList);
    
    useEffect(()=>{
        console.log(ym)
        fetch('/api/seat?ym=' + ym).then(r=>r.json())
        .then((result) => {
            console.log(result)
            result = result.map((a)=>{
                a._id = a._id.toString();
                return a
            })
            setSeatList(result);
        })
    },[ym])

    useEffect(()=>{
        if(seatList.length > 0){
            for(let i=0; i<seatList.length; i++){
                setSeat(seatList[i], props.type)
            }
        }
    },[seatList])

    return(
        <div className={styles.seatWrap}>
            <table className={styles.allSeat}>
                <tbody>
                    {/* 89 */}
                    <tr>
                        <td colSpan={89} className={`${styles.wall} ${styles.top} ${styles.left} ${styles.right}`}></td>
                    </tr>
                    <tr>
                        <td colSpan={4} className={`${styles.wall} ${styles.left}`}></td>
                        <td className={`${styles.wall} ${styles.top} ${styles.left} ${styles.right}`} colSpan={81}></td>
                        <td colSpan={4} className={`${styles.wall} ${styles.right}`}></td>
                    </tr>
                    <tr>
                        <td colSpan={4} className={`${styles.wall} ${styles.left}`}></td>
                        <td colSpan={6} className={`${styles.wall} ${styles.left}`}></td>
                        <td className={styles.num}>9</td>
                        <td className={styles.num}>8</td>
                        <td className={styles.num}>7</td>
                        <td className={styles.num}>6</td>
                        <td className={styles.num}>5</td>
                        <td className={styles.num}>4</td>
                        <td className={styles.num}>3</td>
                        <td className={styles.num}>2</td>
                        <td className={styles.num}>1</td>
                        <td colSpan={8}></td>
                        <td className={`${styles.wall} ${styles.left}`}></td>
                        <td className={styles.num}>6</td>
                        <td className={`${styles.wall} ${styles.left}`}></td>
                        <td></td>
                        <td><Seat id='1-p-6-27'/></td>
                        <td><Seat id='1-p-6-26'/></td>
                        <td><Seat id='1-p-6-25'/></td>
                        <td><Seat id='1-p-6-24'/></td>
                        <td><Seat id='1-p-6-23'/></td>
                        <td><Seat id='1-p-6-22'/></td>
                        <td><Seat id='1-p-6-21'/></td>
                        <td><Seat id='1-p-6-20'/></td>
                        <td><Seat id='1-p-6-19'/></td>
                        <td><Seat id='1-p-6-18'/></td>
                        <td><Seat id='1-p-6-17'/></td>
                        <td><Seat id='1-p-6-16'/></td>
                        <td><Seat id='1-p-6-15'/></td>
                        <td><Seat id='1-p-6-14'/></td>
                        <td><Seat id='1-p-6-13'/></td>
                        <td><Seat id='1-p-6-12'/></td>
                        <td><Seat id='1-p-6-11'/></td>
                        <td><Seat id='1-p-6-10'/></td>
                        <td><Seat id='1-p-6-9'/></td>
                        <td><Seat id='1-p-6-8'/></td>
                        <td><Seat id='1-p-6-7'/></td>
                        <td><Seat id='1-p-6-6'/></td>
                        <td><Seat id='1-p-6-5'/></td>
                        <td><Seat id='1-p-6-4'/></td>
                        <td><Seat id='1-p-6-3'/></td>
                        <td><Seat id='1-p-6-2'/></td>
                        <td><Seat id='1-p-6-1'/></td>
                        <td></td>
                        <td className={`${styles.wall} ${styles.right}`}></td>
                        <td className={styles.num}>6</td>
                        <td className={`${styles.wall} ${styles.right}`}></td>
                        <td colSpan={8}></td>
                        <td className={styles.num}>1</td>
                        <td className={styles.num}>2</td>
                        <td className={styles.num}>3</td>
                        <td className={styles.num}>4</td>
                        <td className={styles.num}>5</td>
                        <td className={styles.num}>6</td>
                        <td className={styles.num}>7</td>
                        <td className={styles.num}>8</td>
                        <td className={styles.num}>9</td>
                        <td colSpan={6} className={`${styles.wall} ${styles.right}`}></td>
                        <td colSpan={4} className={`${styles.wall} ${styles.right}`}></td>
                    </tr>
                    <tr>
                        <td colSpan={4} className={`${styles.wall} ${styles.left}`}></td>
                        <td colSpan={6} className={`${styles.wall} ${styles.left}`}></td>
                        <td colSpan={9}></td>
                        <td colSpan={8}></td>
                        <td className={`${styles.wall} ${styles.left}`}></td>
                        <td className={styles.num}>5</td>
                        <td className={`${styles.wall} ${styles.left}`}></td>
                        <td></td>
                        <td></td>
                        <td><Seat id='1-p-5-26'/></td>
                        <td><Seat id='1-p-5-25'/></td>
                        <td><Seat id='1-p-5-24'/></td>
                        <td><Seat id='1-p-5-23'/></td>
                        <td><Seat id='1-p-5-22'/></td>
                        <td><Seat id='1-p-5-21'/></td>
                        <td><Seat id='1-p-5-20'/></td>
                        <td><Seat id='1-p-5-19'/></td>
                        <td><Seat id='1-p-5-18'/></td>
                        <td><Seat id='1-p-5-17'/></td>
                        <td><Seat id='1-p-5-16'/></td>
                        <td><Seat id='1-p-5-15'/></td>
                        <td><Seat id='1-p-5-14'/></td>
                        <td><Seat id='1-p-5-13'/></td>
                        <td><Seat id='1-p-5-12'/></td>
                        <td><Seat id='1-p-5-11'/></td>
                        <td><Seat id='1-p-5-10'/></td>
                        <td><Seat id='1-p-5-9'/></td>
                        <td><Seat id='1-p-5-8'/></td>
                        <td><Seat id='1-p-5-7'/></td>
                        <td><Seat id='1-p-5-6'/></td>
                        <td><Seat id='1-p-5-5'/></td>
                        <td><Seat id='1-p-5-4'/></td>
                        <td><Seat id='1-p-5-3'/></td>
                        <td><Seat id='1-p-5-2'/></td>
                        <td><Seat id='1-p-5-1'/></td>
                        <td></td>
                        <td className={`${styles.wall} ${styles.right}`}></td>
                        <td className={styles.num}>5</td>
                        <td className={`${styles.wall} ${styles.right}`}></td>
                        <td colSpan={8}></td>
                        <td colSpan={9}></td>
                        <td colSpan={6} className={`${styles.wall} ${styles.right}`}></td>
                        <td colSpan={4} className={`${styles.wall} ${styles.right}`}></td>
                    </tr>
                    <tr>
                        <td colSpan={4} className={`${styles.wall} ${styles.left}`}></td>
                        <td colSpan={6} className={`${styles.wall} ${styles.left}`}></td>
                        <td></td>
                        <td></td>
                        <td><Seat id='1-lp-7-2'/></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td rowSpan="33" className={styles.section}>LP</td>
                        <td colSpan={7} className={styles.floor}>1층</td>
                        <td className={`${styles.wall} ${styles.left}`}></td>
                        <td className={styles.num}>4</td>
                        <td className={`${styles.wall} ${styles.left} ${styles.bottom}`}></td>
                        <td className={`${styles.wall} ${styles.bottom}`}></td>
                        <td className={`${styles.wall} ${styles.bottom}`}></td>
                        <td className={`${styles.wall} ${styles.bottom}`}></td>
                        <td className={`${styles.wall} ${styles.bottom}`}><Seat id='1-p-4-25'/></td>
                        <td className={`${styles.wall} ${styles.bottom}`}><Seat id='1-p-4-24'/></td>
                        <td className={`${styles.wall} ${styles.bottom}`}><Seat id='1-p-4-23'/></td>
                        <td className={`${styles.wall} ${styles.bottom}`}><Seat id='1-p-4-22'/></td>
                        <td className={`${styles.wall} ${styles.bottom}`}><Seat id='1-p-4-21'/></td>
                        <td className={`${styles.wall} ${styles.bottom}`}><Seat id='1-p-4-20'/></td>
                        <td className={`${styles.wall} ${styles.bottom}`}><Seat id='1-p-4-19'/></td>
                        <td className={`${styles.wall} ${styles.bottom}`}><Seat id='1-p-4-18'/></td>
                        <td className={`${styles.wall} ${styles.bottom}`}><Seat id='1-p-4-17'/></td>
                        <td className={`${styles.wall} ${styles.bottom}`}><Seat id='1-p-4-16'/></td>
                        <td className={`${styles.wall} ${styles.bottom}`}><Seat id='1-p-4-15'/></td>
                        <td className={`${styles.wall} ${styles.bottom}`}><Seat id='1-p-4-14'/></td>
                        <td className={`${styles.wall} ${styles.bottom}`}><Seat id='1-p-4-13'/></td>
                        <td className={`${styles.wall} ${styles.bottom}`}><Seat id='1-p-4-12'/></td>
                        <td className={`${styles.wall} ${styles.bottom}`}><Seat id='1-p-4-11'/></td>
                        <td className={`${styles.wall} ${styles.bottom}`}><Seat id='1-p-4-10'/></td>
                        <td className={`${styles.wall} ${styles.bottom}`}><Seat id='1-p-4-9'/></td>
                        <td className={`${styles.wall} ${styles.bottom}`}><Seat id='1-p-4-8'/></td>
                        <td className={`${styles.wall} ${styles.bottom}`}><Seat id='1-p-4-7'/></td>
                        <td className={`${styles.wall} ${styles.bottom}`}><Seat id='1-p-4-6'/></td>
                        <td className={`${styles.wall} ${styles.bottom}`}><Seat id='1-p-4-5'/></td>
                        <td className={`${styles.wall} ${styles.bottom}`}><Seat id='1-p-4-4'/></td>
                        <td className={`${styles.wall} ${styles.bottom}`}><Seat id='1-p-4-3'/></td>
                        <td className={`${styles.wall} ${styles.bottom}`}><Seat id='1-p-4-2'/></td>
                        <td className={`${styles.wall} ${styles.bottom}`}><Seat id='1-p-4-1'/></td>
                        <td className={`${styles.wall} ${styles.bottom}`}></td>
                        <td className={`${styles.wall} ${styles.right} ${styles.bottom}`}></td>
                        <td className={styles.num}>4</td>
                        <td className={`${styles.wall} ${styles.right}`}></td>
                        <td colSpan={7} className={styles.floor}>1층</td>
                        <td rowSpan="33" className={styles.section}>RP</td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td><Seat id='1-rp-7-33'/></td>
                        <td></td>
                        <td></td>
                        <td colSpan={6} className={`${styles.wall} ${styles.right}`}></td>
                        <td colSpan={4} className={`${styles.wall} ${styles.right}`}></td>
                    </tr>
                    <tr>
                        <td colSpan={4} className={`${styles.wall} ${styles.left} ${styles.top}`}></td>
                        <td colSpan={6} className={`${styles.wall} ${styles.left}`}></td>
                        <td><Seat id='1-lp-9-1'/></td>
                        <td><Seat id='1-lp-8-3'/></td>
                        <td><Seat id='1-lp-7-3'/></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        {/* <td rowSpan="33" className={styles.section}>LP</td> */}
                        <td colSpan={7}></td>
                        <td className={`${styles.wall} ${styles.left}`}></td>
                        <td className={styles.num}>3</td>
                        <td><Seat id='1-p-3-30'/></td>
                        <td><Seat id='1-p-3-29'/></td>
                        <td><Seat id='1-p-3-28'/></td>
                        <td><Seat id='1-p-3-27'/></td>
                        <td><Seat id='1-p-3-26'/></td>
                        <td><Seat id='1-p-3-25'/></td>
                        <td><Seat id='1-p-3-24'/></td>
                        <td><Seat id='1-p-3-23'/></td>
                        <td><Seat id='1-p-3-22'/></td>
                        <td><Seat id='1-p-3-21'/></td>
                        <td><Seat id='1-p-3-20'/></td>
                        <td><Seat id='1-p-3-19'/></td>
                        <td><Seat id='1-p-3-18'/></td>
                        <td><Seat id='1-p-3-17'/></td>
                        <td><Seat id='1-p-3-16'/></td>
                        <td><Seat id='1-p-3-15'/></td>
                        <td><Seat id='1-p-3-14'/></td>
                        <td><Seat id='1-p-3-13'/></td>
                        <td><Seat id='1-p-3-12'/></td>
                        <td><Seat id='1-p-3-11'/></td>
                        <td><Seat id='1-p-3-10'/></td>
                        <td><Seat id='1-p-3-9'/></td>
                        <td><Seat id='1-p-3-8'/></td>
                        <td><Seat id='1-p-3-7'/></td>
                        <td><Seat id='1-p-3-6'/></td>
                        <td><Seat id='1-p-3-5'/></td>
                        <td><Seat id='1-p-3-4'/></td>
                        <td><Seat id='1-p-3-3'/></td>
                        <td><Seat id='1-p-3-2'/></td>
                        <td><Seat id='1-p-3-1'/></td>
                        <td></td>
                        <td className={styles.num}>3</td>
                        <td className={`${styles.wall} ${styles.right}`}></td>
                        <td colSpan={7}></td>
                        {/* <td rowSpan="33" className={styles.section}>RP</td> */}
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td><Seat id='1-rp-7-32'/></td>
                        <td><Seat id='1-rp-8-32'/></td>
                        <td><Seat id='1-rp-9-33'/></td>
                        <td colSpan={6} className={`${styles.wall} ${styles.right}`}></td>
                        <td colSpan={4} className={`${styles.wall} ${styles.right} ${styles.top}`}></td>
                    </tr>
                    <tr>
                        <td colSpan={4} className={`${styles.wall} ${styles.left}`}></td>
                        <td colSpan={6} className={`${styles.wall} ${styles.left}`}></td>
                        <td><Seat id='1-lp-9-2'/></td>
                        <td><Seat id='1-lp-8-4'/></td>
                        <td><Seat id='1-lp-7-4'/></td>
                        <td><Seat id='1-lp-6-4'/></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        {/* <td rowSpan="33" className={styles.section}>LP</td> */}
                        <td colSpan={7}></td>
                        <td className={`${styles.wall} ${styles.left}`}></td>
                        <td className={styles.num}>2</td>
                        <td><Seat id='1-p-2-30'/></td>
                        <td><Seat id='1-p-2-29'/></td>
                        <td><Seat id='1-p-2-28'/></td>
                        <td><Seat id='1-p-2-27'/></td>
                        <td><Seat id='1-p-2-26'/></td>
                        <td><Seat id='1-p-2-25'/></td>
                        <td><Seat id='1-p-2-24'/></td>
                        <td><Seat id='1-p-2-23'/></td>
                        <td><Seat id='1-p-2-22'/></td>
                        <td><Seat id='1-p-2-21'/></td>
                        <td><Seat id='1-p-2-20'/></td>
                        <td><Seat id='1-p-2-19'/></td>
                        <td><Seat id='1-p-2-18'/></td>
                        <td><Seat id='1-p-2-17'/></td>
                        <td><Seat id='1-p-2-16'/></td>
                        <td><Seat id='1-p-2-15'/></td>
                        <td><Seat id='1-p-2-14'/></td>
                        <td><Seat id='1-p-2-13'/></td>
                        <td><Seat id='1-p-2-12'/></td>
                        <td><Seat id='1-p-2-11'/></td>
                        <td><Seat id='1-p-2-10'/></td>
                        <td><Seat id='1-p-2-9'/></td>
                        <td><Seat id='1-p-2-8'/></td>
                        <td><Seat id='1-p-2-7'/></td>
                        <td><Seat id='1-p-2-6'/></td>
                        <td><Seat id='1-p-2-5'/></td>
                        <td><Seat id='1-p-2-4'/></td>
                        <td><Seat id='1-p-2-3'/></td>
                        <td><Seat id='1-p-2-2'/></td>
                        <td><Seat id='1-p-2-1'/></td>
                        <td></td>
                        <td className={styles.num}>2</td>
                        <td className={`${styles.wall} ${styles.right}`}></td>
                        <td colSpan={7}></td>
                        {/* <td rowSpan="33" className={styles.section}>RP</td> */}
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td><Seat id='1-rp-6-31'/></td>
                        <td><Seat id='1-rp-7-31'/></td>
                        <td><Seat id='1-rp-8-31'/></td>
                        <td><Seat id='1-rp-9-32'/></td>
                        <td colSpan={6} className={`${styles.wall} ${styles.right}`}></td>
                        <td colSpan={4} className={`${styles.wall} ${styles.right}`}></td>
                    </tr>
                    <tr>
                        <td colSpan={4} className={`${styles.wall} ${styles.left}`}></td>
                        <td colSpan={6} className={`${styles.wall} ${styles.left}`}></td>
                        <td><Seat id='1-lp-9-3'/></td>
                        <td><Seat id='1-lp-8-5'/></td>
                        <td><Seat id='1-lp-7-5'/></td>
                        <td><Seat id='1-lp-6-5'/></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        {/* <td rowSpan="33" className={styles.section}>LP</td> */}
                        <td colSpan={7}></td>
                        <td className={`${styles.wall} ${styles.left} ${styles.bottom}`}></td>
                        <td className={`${styles.num} ${styles.wall} ${styles.bottom}`}>1</td>
                        <td className={`${styles.wall} ${styles.bottom}`}></td>
                        <td className={`${styles.wall} ${styles.bottom}`}><Seat id='1-p-1-29'/></td>
                        <td className={`${styles.wall} ${styles.bottom}`}><Seat id='1-p-1-28'/></td>
                        <td className={`${styles.wall} ${styles.bottom}`}><Seat id='1-p-1-27'/></td>
                        <td className={`${styles.wall} ${styles.bottom}`}><Seat id='1-p-1-26'/></td>
                        <td className={`${styles.wall} ${styles.bottom}`}><Seat id='1-p-1-25'/></td>
                        <td className={`${styles.wall} ${styles.bottom}`}><Seat id='1-p-1-24'/></td>
                        <td className={`${styles.wall} ${styles.bottom}`}><Seat id='1-p-1-23'/></td>
                        <td className={`${styles.wall} ${styles.bottom}`}><Seat id='1-p-1-22'/></td>
                        <td className={`${styles.wall} ${styles.bottom}`}><Seat id='1-p-1-21'/></td>
                        <td className={`${styles.wall} ${styles.bottom}`}><Seat id='1-p-1-20'/></td>
                        <td className={`${styles.wall} ${styles.bottom}`}><Seat id='1-p-1-19'/></td>
                        <td className={`${styles.wall} ${styles.bottom}`}><Seat id='1-p-1-18'/></td>
                        <td className={`${styles.wall} ${styles.bottom}`}><Seat id='1-p-1-17'/></td>
                        <td className={`${styles.wall} ${styles.bottom}`}><Seat id='1-p-1-16'/></td>
                        <td className={`${styles.wall} ${styles.bottom}`}><Seat id='1-p-1-15'/></td>
                        <td className={`${styles.wall} ${styles.bottom}`}><Seat id='1-p-1-14'/></td>
                        <td className={`${styles.wall} ${styles.bottom}`}><Seat id='1-p-1-13'/></td>
                        <td className={`${styles.wall} ${styles.bottom}`}><Seat id='1-p-1-12'/></td>
                        <td className={`${styles.wall} ${styles.bottom}`}><Seat id='1-p-1-11'/></td>
                        <td className={`${styles.wall} ${styles.bottom}`}><Seat id='1-p-1-10'/></td>
                        <td className={`${styles.wall} ${styles.bottom}`}><Seat id='1-p-1-9'/></td>
                        <td className={`${styles.wall} ${styles.bottom}`}><Seat id='1-p-1-8'/></td>
                        <td className={`${styles.wall} ${styles.bottom}`}><Seat id='1-p-1-7'/></td>
                        <td className={`${styles.wall} ${styles.bottom}`}><Seat id='1-p-1-6'/></td>
                        <td className={`${styles.wall} ${styles.bottom}`}><Seat id='1-p-1-5'/></td>
                        <td className={`${styles.wall} ${styles.bottom}`}><Seat id='1-p-1-4'/></td>
                        <td className={`${styles.wall} ${styles.bottom}`}><Seat id='1-p-1-3'/></td>
                        <td className={`${styles.wall} ${styles.bottom}`}><Seat id='1-p-1-2'/></td>
                        <td className={`${styles.wall} ${styles.bottom}`}><Seat id='1-p-1-1'/></td>
                        <td className={`${styles.wall} ${styles.bottom}`}></td>
                        <td className={`${styles.num} ${styles.wall} ${styles.bottom}`}>1</td>
                        <td className={`${styles.wall} ${styles.right} ${styles.bottom}`}></td>
                        <td colSpan={7}></td>
                        {/* <td rowSpan="33" className={styles.section}>RP</td> */}
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td><Seat id='1-rp-6-30'/></td>
                        <td><Seat id='1-rp-7-30'/></td>
                        <td><Seat id='1-rp-8-30'/></td>
                        <td><Seat id='1-rp-9-31'/></td>
                        <td colSpan={6} className={`${styles.wall} ${styles.right}`}></td>
                        <td colSpan={4} className={`${styles.wall} ${styles.right}`}></td>
                    </tr>
                    <tr>
                        <td colSpan={4} className={`${styles.wall} ${styles.left}`}></td>
                        <td colSpan={6} className={`${styles.wall} ${styles.left}`}></td>
                        <td><Seat id='1-lp-9-4'/></td>
                        <td><Seat id='1-lp-8-6'/></td>
                        <td><Seat id='1-lp-7-6'/></td>
                        <td><Seat id='1-lp-6-6'/></td>
                        <td><Seat id='1-lp-5-6'/></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        {/* <td rowSpan="33" className={styles.section}>LP</td> */}
                        <td colSpan={7}></td>
                        <td className={styles.section} colSpan={35}>p</td>
                        <td colSpan={7}></td>
                        {/* <td rowSpan="33" className={styles.section}>RP</td> */}
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td><Seat id='1-rp-5-29'/></td>
                        <td><Seat id='1-rp-6-29'/></td>
                        <td><Seat id='1-rp-7-29'/></td>
                        <td><Seat id='1-rp-8-29'/></td>
                        <td><Seat id='1-rp-9-30'/></td>
                        <td colSpan={6} className={`${styles.wall} ${styles.right}`}></td>
                        <td colSpan={4} className={`${styles.wall} ${styles.right}`}></td>
                    </tr>
                    <tr>
                        <td colSpan={4} className={`${styles.wall} ${styles.left}`}></td>
                        <td colSpan={6} className={`${styles.wall} ${styles.left}`}></td>
                        <td><Seat id='1-lp-9-5'/></td>
                        <td><Seat id='1-lp-8-7'/></td>
                        <td><Seat id='1-lp-7-7'/></td>
                        <td><Seat id='1-lp-6-7'/></td>
                        <td><Seat id='1-lp-5-7'/></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        {/* <td rowSpan="33" className={styles.section}>LP</td> */}
                        <td colSpan="49" rowSpan="35" className={`${styles.wall} ${styles.all}`}>STAGE</td>
                        {/* <td rowSpan="33" className={styles.section}>RP</td> */}
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td><Seat id='1-rp-5-28'/></td>
                        <td><Seat id='1-rp-6-28'/></td>
                        <td><Seat id='1-rp-7-28'/></td>
                        <td><Seat id='1-rp-8-28'/></td>
                        <td><Seat id='1-rp-9-29'/></td>
                        <td colSpan={6} className={`${styles.wall} ${styles.right}`}></td>
                        <td colSpan={4} className={`${styles.wall} ${styles.right}`}></td>
                    </tr>
                    <tr>
                        <td colSpan={4} className={`${styles.wall} ${styles.left} ${styles.floor}`}>2층</td>
                        <td colSpan={6} className={`${styles.wall} ${styles.left}`}></td>
                        <td><Seat id='1-lp-9-6'/></td>
                        <td><Seat id='1-lp-8-8'/></td>
                        <td><Seat id='1-lp-7-8'/></td>
                        <td><Seat id='1-lp-6-8'/></td>
                        <td><Seat id='1-lp-5-8'/></td>
                        <td><Seat id='1-lp-4-8'/></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        {/* <td rowSpan="33" className={styles.section}>LP</td> */}
                        {/* <td colSpan="49" rowSpan="35" className={`${styles.wall} ${styles.all}`}>STAGE</td> */}
                        {/* <td rowSpan="33" className={styles.section}>RP</td> */}
                        <td></td>
                        <td></td>
                        <td></td>
                        <td><Seat id='1-rp-4-27'/></td>
                        <td><Seat id='1-rp-5-27'/></td>
                        <td><Seat id='1-rp-6-27'/></td>
                        <td><Seat id='1-rp-7-27'/></td>
                        <td><Seat id='1-rp-8-27'/></td>
                        <td><Seat id='1-rp-9-28'/></td>
                        <td colSpan={6} className={`${styles.wall} ${styles.right}`}></td>
                        <td colSpan={4} className={`${styles.wall} ${styles.right} ${styles.floor}`}>2층</td>
                    </tr>
                    <tr>
                        <td colSpan={4} className={`${styles.wall} ${styles.left} ${styles.floor}`}></td>
                        <td colSpan={6} className={`${styles.wall} ${styles.left}`}></td>
                        <td></td>
                        <td><Seat id='1-lp-8-9'/></td>
                        <td><Seat id='1-lp-7-9'/></td>
                        <td><Seat id='1-lp-6-9'/></td>
                        <td><Seat id='1-lp-5-9'/></td>
                        <td><Seat id='1-lp-4-9'/></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        {/* <td rowSpan="33" className={styles.section}>LP</td> */}
                        {/* <td colSpan="49" rowSpan="35" className={`${styles.wall} ${styles.all}`}>STAGE</td> */}
                        {/* <td rowSpan="33" className={styles.section}>RP</td> */}
                        <td></td>
                        <td></td>
                        <td></td>
                        <td><Seat id='1-rp-4-26'/></td>
                        <td><Seat id='1-rp-5-26'/></td>
                        <td><Seat id='1-rp-6-26'/></td>
                        <td><Seat id='1-rp-7-26'/></td>
                        <td><Seat id='1-rp-8-26'/></td>
                        <td></td>
                        <td colSpan={6} className={`${styles.wall} ${styles.right}`}></td>
                        <td colSpan={4} className={`${styles.wall} ${styles.right} ${styles.floor}`}></td>
                    </tr>
                    <tr>
                        <td className={`${styles.wall} ${styles.left}`}></td>
                        <td className={styles.num}>2</td>
                        <td className={styles.num}>1</td>
                        <td></td>
                        <td className={`${styles.wall} ${styles.left}`}></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td><Seat id='1-lp-8-10'/></td>
                        <td><Seat id='1-lp-7-10'/></td>
                        <td><Seat id='1-lp-6-10'/></td>
                        <td><Seat id='1-lp-5-10'/></td>
                        <td><Seat id='1-lp-4-10'/></td>
                        <td><Seat id='1-lp-3-10'/></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td><Seat id='1-rp-3-25'/></td>
                        <td><Seat id='1-rp-4-25'/></td>
                        <td><Seat id='1-rp-5-25'/></td>
                        <td><Seat id='1-rp-6-25'/></td>
                        <td><Seat id='1-rp-7-25'/></td>
                        <td><Seat id='1-rp-8-25'/></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td className={`${styles.wall} ${styles.right}`}></td>
                        <td></td>
                        <td className={styles.num}>1</td>
                        <td className={styles.num}>2</td>
                        <td className={`${styles.wall} ${styles.right}`}></td>
                    </tr>
                    <tr>
                        <td className={`${styles.wall} ${styles.left}`}></td>
                        <td></td>
                        <td><Seat id='2-l-1-1'/></td>
                        <td rowSpan="37" className={`${styles.section}`}>L</td>
                        <td className={`${styles.wall} ${styles.left}`}></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td><Seat id='1-lp-8-11'/></td>
                        <td><Seat id='1-lp-7-11'/></td>
                        <td><Seat id='1-lp-6-11'/></td>
                        <td><Seat id='1-lp-5-11'/></td>
                        <td><Seat id='1-lp-4-11'/></td>
                        <td><Seat id='1-lp-3-11'/></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td><Seat id='1-rp-3-24'/></td>
                        <td><Seat id='1-rp-4-24'/></td>
                        <td><Seat id='1-rp-5-24'/></td>
                        <td><Seat id='1-rp-6-24'/></td>
                        <td><Seat id='1-rp-7-24'/></td>
                        <td><Seat id='1-rp-8-24'/></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td className={`${styles.wall} ${styles.right}`}></td>
                        <td rowSpan="37" className={styles.section}>R</td>
                        <td><Seat id='2-r-1-34'/></td>
                        <td></td>
                        <td className={`${styles.wall} ${styles.right}`}></td>
                    </tr>
                    <tr>
                        <td className={`${styles.wall} ${styles.left}`}></td>
                        <td></td>
                        <td><Seat id='2-l-1-2'/></td>
                        {/* <td rowSpan="37" className={styles.section}>L</td> */}
                        <td className={`${styles.wall} ${styles.left}`}></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td><Seat id='1-lp-8-12'/></td>
                        <td><Seat id='1-lp-7-12'/></td>
                        <td><Seat id='1-lp-6-12'/></td>
                        <td><Seat id='1-lp-5-12'/></td>
                        <td><Seat id='1-lp-4-12'/></td>
                        <td><Seat id='1-lp-3-12'/></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td><Seat id='1-rp-3-23'/></td>
                        <td><Seat id='1-rp-4-23'/></td>
                        <td><Seat id='1-rp-5-23'/></td>
                        <td><Seat id='1-rp-6-23'/></td>
                        <td><Seat id='1-rp-7-23'/></td>
                        <td><Seat id='1-rp-8-23'/></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td className={`${styles.wall} ${styles.right}`}></td>
                        {/* <td rowSpan="37" className={styles.section}>R</td> */}
                        <td><Seat id='2-r-1-33'/></td>
                        <td></td>
                        <td className={`${styles.wall} ${styles.right}`}></td>
                    </tr>
                    <tr>
                        <td className={`${styles.wall} ${styles.left}`}></td>
                        <td></td>
                        <td><Seat id='2-l-1-3'/></td>
                        {/* <td rowSpan="37" className={styles.section}>L</td> */}
                        <td className={`${styles.wall} ${styles.left}`}></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td><Seat id='1-lp-8-13'/></td>
                        <td><Seat id='1-lp-7-13'/></td>
                        <td><Seat id='1-lp-6-13'/></td>
                        <td><Seat id='1-lp-5-13'/></td>
                        <td><Seat id='1-lp-4-13'/></td>
                        <td><Seat id='1-lp-3-13'/></td>
                        <td><Seat id='1-lp-2-13'/></td>
                        <td></td>
                        <td></td>
                        <td><Seat id='1-rp-2-22'/></td>
                        <td><Seat id='1-rp-3-22'/></td>
                        <td><Seat id='1-rp-4-22'/></td>
                        <td><Seat id='1-rp-5-22'/></td>
                        <td><Seat id='1-rp-6-22'/></td>
                        <td><Seat id='1-rp-7-22'/></td>
                        <td><Seat id='1-rp-8-22'/></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td className={`${styles.wall} ${styles.right}`}></td>
                        {/* <td rowSpan="37" className={styles.section}>R</td> */}
                        <td><Seat id='2-r-1-32'/></td>
                        <td></td>
                        <td className={`${styles.wall} ${styles.right}`}></td>
                    </tr>
                    <tr>
                        <td className={`${styles.wall} ${styles.left}`}></td>
                        <td></td>
                        <td><Seat id='2-l-1-4'/></td>
                        {/* <td rowSpan="37" className={styles.section}>L</td> */}
                        <td className={`${styles.wall} ${styles.left}`}></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td><Seat id='1-lp-8-14'/></td>
                        <td><Seat id='1-lp-7-14'/></td>
                        <td><Seat id='1-lp-6-14'/></td>
                        <td><Seat id='1-lp-5-14'/></td>
                        <td><Seat id='1-lp-4-14'/></td>
                        <td><Seat id='1-lp-3-14'/></td>
                        <td><Seat id='1-lp-2-14'/></td>
                        <td></td>
                        <td></td>
                        <td><Seat id='1-rp-2-21'/></td>
                        <td><Seat id='1-rp-3-21'/></td>
                        <td><Seat id='1-rp-4-21'/></td>
                        <td><Seat id='1-rp-5-21'/></td>
                        <td><Seat id='1-rp-6-21'/></td>
                        <td><Seat id='1-rp-7-21'/></td>
                        <td><Seat id='1-rp-8-21'/></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td className={`${styles.wall} ${styles.right}`}></td>
                        {/* <td rowSpan="37" className={styles.section}>R</td> */}
                        <td><Seat id='2-r-1-31'/></td>
                        <td></td>
                        <td className={`${styles.wall} ${styles.right}`}></td>
                    </tr>
                    <tr>
                        <td className={`${styles.wall} ${styles.left}`}></td>
                        <td></td>
                        <td><Seat id='2-l-1-5'/></td>
                        {/* <td rowSpan="37" className={styles.section}>L</td> */}
                        <td className={`${styles.wall} ${styles.left}`}></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td><Seat id='1-lp-8-15'/></td>
                        <td><Seat id='1-lp-7-15'/></td>
                        <td><Seat id='1-lp-6-15'/></td>
                        <td><Seat id='1-lp-5-15'/></td>
                        <td><Seat id='1-lp-4-15'/></td>
                        <td><Seat id='1-lp-3-15'/></td>
                        <td><Seat id='1-lp-2-15'/></td>
                        <td></td>
                        <td></td>
                        <td><Seat id='1-rp-2-20'/></td>
                        <td><Seat id='1-rp-3-20'/></td>
                        <td><Seat id='1-rp-4-20'/></td>
                        <td><Seat id='1-rp-5-20'/></td>
                        <td><Seat id='1-rp-6-20'/></td>
                        <td><Seat id='1-rp-7-20'/></td>
                        <td><Seat id='1-rp-8-20'/></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td className={`${styles.wall} ${styles.right}`}></td>
                        {/* <td rowSpan="37" className={styles.section}>R</td> */}
                        <td><Seat id='2-r-1-30'/></td>
                        <td></td>
                        <td className={`${styles.wall} ${styles.right}`}></td>
                    </tr>
                    <tr>
                        <td className={`${styles.wall} ${styles.left}`}></td>
                        <td><Seat id='2-l-2-6'/></td>
                        <td><Seat id='2-l-1-6'/></td>
                        {/* <td rowSpan="37" className={styles.section}>L</td> */}
                        <td className={`${styles.wall} ${styles.left}`}></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td><Seat id='1-lp-8-16'/></td>
                        <td><Seat id='1-lp-7-16'/></td>
                        <td><Seat id='1-lp-6-16'/></td>
                        <td><Seat id='1-lp-5-16'/></td>
                        <td><Seat id='1-lp-4-16'/></td>
                        <td><Seat id='1-lp-3-16'/></td>
                        <td><Seat id='1-lp-2-16'/></td>
                        <td><Seat id='1-lp-1-16'/></td>
                        <td><Seat id='1-rp-1-19'/></td>
                        <td><Seat id='1-rp-2-19'/></td>
                        <td><Seat id='1-rp-3-19'/></td>
                        <td><Seat id='1-rp-4-19'/></td>
                        <td><Seat id='1-rp-5-19'/></td>
                        <td><Seat id='1-rp-6-19'/></td>
                        <td><Seat id='1-rp-7-19'/></td>
                        <td><Seat id='1-rp-8-19'/></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td className={`${styles.wall} ${styles.right}`}></td>
                        {/* <td rowSpan="37" className={styles.section}>R</td> */}
                        <td><Seat id='2-r-1-29'/></td>
                        <td><Seat id='2-r-2-29'/></td>
                        <td className={`${styles.wall} ${styles.right}`}></td>
                    </tr>
                    <tr>
                        <td className={`${styles.wall} ${styles.left}`}></td>
                        <td><Seat id='2-l-2-7'/></td>
                        <td><Seat id='2-l-1-7'/></td>
                        {/* <td rowSpan="37" className={styles.section}>L</td> */}
                        <td className={`${styles.wall} ${styles.left}`}></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td><Seat id='1-lp-8-17'/></td>
                        <td><Seat id='1-lp-7-17'/></td>
                        <td><Seat id='1-lp-6-17'/></td>
                        <td><Seat id='1-lp-5-17'/></td>
                        <td><Seat id='1-lp-4-17'/></td>
                        <td><Seat id='1-lp-3-17'/></td>
                        <td><Seat id='1-lp-2-17'/></td>
                        <td><Seat id='1-lp-1-17'/></td>
                        <td><Seat id='1-rp-1-18'/></td>
                        <td><Seat id='1-rp-2-18'/></td>
                        <td><Seat id='1-rp-3-18'/></td>
                        <td><Seat id='1-rp-4-18'/></td>
                        <td><Seat id='1-rp-5-18'/></td>
                        <td><Seat id='1-rp-6-18'/></td>
                        <td><Seat id='1-rp-7-18'/></td>
                        <td><Seat id='1-rp-8-18'/></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td className={`${styles.wall} ${styles.right}`}></td>
                        {/* <td rowSpan="37" className={styles.section}>R</td> */}
                        <td><Seat id='2-r-1-28'/></td>
                        <td><Seat id='2-r-2-28'/></td>
                        <td className={`${styles.wall} ${styles.right}`}></td>
                    </tr>
                    <tr>
                        <td className={`${styles.wall} ${styles.left}`}></td>
                        <td><Seat id='2-l-2-8'/></td>
                        <td><Seat id='2-l-1-8'/></td>
                        {/* <td rowSpan="37" className={styles.section}>L</td> */}
                        <td className={`${styles.wall} ${styles.left}`}></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td className={styles.num}>9</td>
                        <td className={styles.num}>8</td>
                        <td className={styles.num}>7</td>
                        <td className={styles.num}>6</td>
                        <td className={styles.num}>5</td>
                        <td className={styles.num}>4</td>
                        <td className={styles.num}>3</td>
                        <td className={styles.num}>2</td>
                        <td className={styles.num}>1</td>
                        <td className={styles.num}>1</td>
                        <td className={styles.num}>2</td>
                        <td className={styles.num}>3</td>
                        <td className={styles.num}>4</td>
                        <td className={styles.num}>5</td>
                        <td className={styles.num}>6</td>
                        <td className={styles.num}>7</td>
                        <td className={styles.num}>8</td>
                        <td className={styles.num}>9</td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td className={`${styles.wall} ${styles.right}`}></td>
                        {/* <td rowSpan="37" className={styles.section}>R</td> */}
                        <td><Seat id='2-r-1-27'/></td>
                        <td><Seat id='2-r-2-27'/></td>
                        <td className={`${styles.wall} ${styles.right}`}></td>
                    </tr>
                    <tr>
                        <td className={`${styles.wall} ${styles.left}`}></td>
                        <td><Seat id='2-l-2-9'/></td>
                        <td><Seat id='2-l-1-9'/></td>
                        {/* <td rowSpan="37" className={styles.section}>L</td> */}
                        <td className={`${styles.wall} ${styles.left}`}></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td><Seat id='1-lp-7-18'/></td>
                        <td><Seat id='1-lp-6-18'/></td>
                        <td><Seat id='1-lp-5-18'/></td>
                        <td><Seat id='1-lp-4-18'/></td>
                        <td><Seat id='1-lp-3-18'/></td>
                        <td><Seat id='1-lp-2-18'/></td>
                        <td><Seat id='1-lp-1-18'/></td>
                        <td><Seat id='1-rp-1-17'/></td>
                        <td><Seat id='1-rp-2-17'/></td>
                        <td><Seat id='1-rp-3-17'/></td>
                        <td><Seat id='1-rp-4-17'/></td>
                        <td><Seat id='1-rp-5-17'/></td>
                        <td><Seat id='1-rp-6-17'/></td>
                        <td><Seat id='1-rp-7-17'/></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td className={`${styles.wall} ${styles.right}`}></td>
                        {/* <td rowSpan="37" className={styles.section}>R</td> */}
                        <td><Seat id='2-r-1-26'/></td>
                        <td><Seat id='2-r-2-26'/></td>
                        <td className={`${styles.wall} ${styles.right}`}></td>
                    </tr>
                    <tr>
                        <td className={`${styles.wall} ${styles.left}`}></td>
                        <td className={styles.num}>2</td>
                        <td className={styles.num}>1</td>
                        {/* <td rowSpan="37" className={styles.section}>L</td> */}
                        <td className={`${styles.wall} ${styles.left}`}></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td><Seat id='1-lp-7-19'/></td>
                        <td><Seat id='1-lp-6-19'/></td>
                        <td><Seat id='1-lp-5-19'/></td>
                        <td><Seat id='1-lp-4-19'/></td>
                        <td><Seat id='1-lp-3-19'/></td>
                        <td><Seat id='1-lp-2-19'/></td>
                        <td><Seat id='1-lp-1-19'/></td>
                        <td><Seat id='1-rp-1-16'/></td>
                        <td><Seat id='1-rp-2-16'/></td>
                        <td><Seat id='1-rp-3-16'/></td>
                        <td><Seat id='1-rp-4-16'/></td>
                        <td><Seat id='1-rp-5-16'/></td>
                        <td><Seat id='1-rp-6-16'/></td>
                        <td><Seat id='1-rp-7-16'/></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td className={`${styles.wall} ${styles.right}`}></td>
                        {/* <td rowSpan="37" className={styles.section}>R</td> */}
                        <td className={styles.num}>1</td>
                        <td className={styles.num}>2</td>
                        <td className={`${styles.wall} ${styles.right}`}></td>
                    </tr>
                    <tr>
                        <td className={`${styles.wall} ${styles.left}`}></td>
                        <td><Seat id='2-l-2-10'/></td>
                        <td><Seat id='2-l-1-10'/></td>
                        {/* <td rowSpan="37" className={styles.section}>L</td> */}
                        <td className={`${styles.wall} ${styles.left}`}></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td><Seat id='1-lp-7-20'/></td>
                        <td><Seat id='1-lp-6-20'/></td>
                        <td><Seat id='1-lp-5-20'/></td>
                        <td><Seat id='1-lp-4-20'/></td>
                        <td><Seat id='1-lp-3-20'/></td>
                        <td><Seat id='1-lp-2-20'/></td>
                        <td><Seat id='1-lp-1-20'/></td>
                        <td><Seat id='1-rp-1-15'/></td>
                        <td><Seat id='1-rp-2-15'/></td>
                        <td><Seat id='1-rp-3-15'/></td>
                        <td><Seat id='1-rp-4-15'/></td>
                        <td><Seat id='1-rp-5-15'/></td>
                        <td><Seat id='1-rp-6-15'/></td>
                        <td><Seat id='1-rp-7-15'/></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td className={`${styles.wall} ${styles.right}`}></td>
                        {/* <td rowSpan="37" className={styles.section}>R</td> */}
                        <td><Seat id='2-r-1-25'/></td>
                        <td><Seat id='2-r-2-25'/></td>
                        <td className={`${styles.wall} ${styles.right}`}></td>
                    </tr>
                    <tr>
                        <td className={`${styles.wall} ${styles.left}`}></td>
                        <td><Seat id='2-l-2-11'/></td>
                        <td><Seat id='2-l-1-11'/></td>
                        {/* <td rowSpan="37" className={styles.section}>L</td> */}
                        <td className={`${styles.wall} ${styles.left}`}></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td><Seat id='1-lp-7-21'/></td>
                        <td><Seat id='1-lp-6-21'/></td>
                        <td><Seat id='1-lp-5-21'/></td>
                        <td><Seat id='1-lp-4-21'/></td>
                        <td><Seat id='1-lp-3-21'/></td>
                        <td><Seat id='1-lp-2-21'/></td>
                        <td><Seat id='1-lp-1-21'/></td>
                        <td><Seat id='1-rp-1-14'/></td>
                        <td><Seat id='1-rp-2-14'/></td>
                        <td><Seat id='1-rp-3-14'/></td>
                        <td><Seat id='1-rp-4-14'/></td>
                        <td><Seat id='1-rp-5-14'/></td>
                        <td><Seat id='1-rp-6-14'/></td>
                        <td><Seat id='1-rp-7-14'/></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td className={`${styles.wall} ${styles.right}`}></td>
                        {/* <td rowSpan="37" className={styles.section}>R</td> */}
                        <td><Seat id='2-r-1-24'/></td>
                        <td><Seat id='2-r-2-24'/></td>
                        <td className={`${styles.wall} ${styles.right}`}></td>
                    </tr>
                    <tr>
                        <td className={`${styles.wall} ${styles.left}`}></td>
                        <td><Seat id='2-l-2-12'/></td>
                        <td><Seat id='2-l-1-12'/></td>
                        {/* <td rowSpan="37" className={styles.section}>L</td> */}
                        <td className={`${styles.wall} ${styles.left}`}></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td><Seat id='1-lp-6-22'/></td>
                        <td><Seat id='1-lp-5-22'/></td>
                        <td><Seat id='1-lp-4-22'/></td>
                        <td><Seat id='1-lp-3-22'/></td>
                        <td><Seat id='1-lp-2-22'/></td>
                        <td><Seat id='1-lp-1-22'/></td>
                        <td><Seat id='1-rp-1-13'/></td>
                        <td><Seat id='1-rp-2-13'/></td>
                        <td><Seat id='1-rp-3-13'/></td>
                        <td><Seat id='1-rp-4-13'/></td>
                        <td><Seat id='1-rp-5-13'/></td>
                        <td><Seat id='1-rp-6-13'/></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td className={`${styles.wall} ${styles.right}`}></td>
                        {/* <td rowSpan="37" className={styles.section}>R</td> */}
                        <td><Seat id='2-r-1-23'/></td>
                        <td><Seat id='2-r-2-23'/></td>
                        <td className={`${styles.wall} ${styles.right}`}></td>
                    </tr>
                    <tr>
                        <td className={`${styles.wall} ${styles.left}`}></td>
                        <td><Seat id='2-l-2-13'/></td>
                        <td><Seat id='2-l-1-13'/></td>
                        {/* <td rowSpan="37" className={styles.section}>L</td> */}
                        <td className={`${styles.wall} ${styles.left}`}></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td><Seat id='1-lp-6-23'/></td>
                        <td><Seat id='1-lp-5-23'/></td>
                        <td><Seat id='1-lp-4-23'/></td>
                        <td><Seat id='1-lp-3-23'/></td>
                        <td><Seat id='1-lp-2-23'/></td>
                        <td><Seat id='1-lp-1-23'/></td>
                        <td><Seat id='1-rp-1-12'/></td>
                        <td><Seat id='1-rp-2-12'/></td>
                        <td><Seat id='1-rp-3-12'/></td>
                        <td><Seat id='1-rp-4-12'/></td>
                        <td><Seat id='1-rp-5-12'/></td>
                        <td><Seat id='1-rp-6-12'/></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td className={`${styles.wall} ${styles.right}`}></td>
                        {/* <td rowSpan="37" className={styles.section}>R</td> */}
                        <td><Seat id='2-r-1-22'/></td>
                        <td><Seat id='2-r-2-22'/></td>
                        <td className={`${styles.wall} ${styles.right}`}></td>
                    </tr>
                    <tr>
                        <td className={`${styles.wall} ${styles.left}`}></td>
                        <td><Seat id='2-l-2-14'/></td>
                        <td><Seat id='2-l-1-14'/></td>
                        {/* <td rowSpan="37" className={styles.section}>L</td> */}
                        <td className={`${styles.wall} ${styles.left}`}></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td><Seat id='1-lp-5-24'/></td>
                        <td><Seat id='1-lp-4-24'/></td>
                        <td><Seat id='1-lp-3-24'/></td>
                        <td><Seat id='1-lp-2-24'/></td>
                        <td><Seat id='1-lp-1-24'/></td>
                        <td><Seat id='1-rp-1-11'/></td>
                        <td><Seat id='1-rp-2-11'/></td>
                        <td><Seat id='1-rp-3-11'/></td>
                        <td><Seat id='1-rp-4-11'/></td>
                        <td><Seat id='1-rp-5-11'/></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td className={`${styles.wall} ${styles.right}`}></td>
                        {/* <td rowSpan="37" className={styles.section}>R</td> */}
                        <td><Seat id='2-r-1-21'/></td>
                        <td><Seat id='2-r-2-21'/></td>
                        <td className={`${styles.wall} ${styles.right}`}></td>
                    </tr>
                    <tr>
                        <td className={`${styles.wall} ${styles.left}`}></td>
                        <td></td>
                        <td><Seat id='2-l-1-15'/></td>
                        {/* <td rowSpan="37" className={styles.section}>L</td> */}
                        <td className={`${styles.wall} ${styles.left}`}></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td><Seat id='1-lp-4-25'/></td>
                        <td><Seat id='1-lp-3-25'/></td>
                        <td><Seat id='1-lp-2-25'/></td>
                        <td><Seat id='1-lp-1-25'/></td>
                        <td><Seat id='1-rp-1-10'/></td>
                        <td><Seat id='1-rp-2-10'/></td>
                        <td><Seat id='1-rp-3-10'/></td>
                        <td><Seat id='1-rp-4-10'/></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td className={`${styles.wall} ${styles.right}`}></td>
                        {/* <td rowSpan="37" className={styles.section}>R</td> */}
                        <td><Seat id='2-r-1-20'/></td>
                        <td></td>
                        <td className={`${styles.wall} ${styles.right}`}></td>
                    </tr>
                    <tr>
                        <td className={`${styles.wall} ${styles.left}`}></td>
                        <td><Seat id='2-l-2-16'/></td>
                        <td><Seat id='2-l-1-16'/></td>
                        {/* <td rowSpan="37" className={styles.section}>L</td> */}
                        <td className={`${styles.wall} ${styles.left}`}></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td><div className={`${styles.backslash}`}><div></div></div></td>
                        <td></td>
                        <td></td>
                        <td><Seat id='1-lp-4-26'/></td>
                        <td><Seat id='1-lp-3-26'/></td>
                        <td><Seat id='1-lp-2-26'/></td>
                        <td></td>
                        <td></td>
                        <td><Seat id='1-rp-2-9'/></td>
                        <td><Seat id='1-rp-3-9'/></td>
                        <td><Seat id='1-rp-4-9'/></td>
                        <td></td>
                        <td></td>
                        <td><div className={`${styles.slash}`}><div></div></div></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td className={`${styles.wall} ${styles.right}`}></td>
                        {/* <td rowSpan="37" className={styles.section}>R</td> */}
                        <td><Seat id='2-r-1-19'/></td>
                        <td><Seat id='2-r-2-19'/></td>
                        <td className={`${styles.wall} ${styles.right}`}></td>
                    </tr>
                    <tr>
                        <td className={`${styles.wall} ${styles.left}`}></td>
                        <td><Seat id='2-l-2-17'/></td>
                        <td><Seat id='2-l-1-17'/></td>
                        {/* <td rowSpan="37" className={styles.section}>L</td> */}
                        <td className={`${styles.wall} ${styles.left}`}></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td><div className={`${styles.backslash}`}><div></div></div></td>
                        <td></td>
                        <td><Seat id='1-lp-4-27'/></td>
                        <td><Seat id='1-lp-3-27'/></td>
                        <td><Seat id='1-lp-2-27'/></td>
                        <td></td>
                        <td></td>
                        <td><Seat id='1-rp-2-8'/></td>
                        <td><Seat id='1-rp-3-8'/></td>
                        <td><Seat id='1-rp-4-8'/></td>
                        <td></td>
                        <td><div className={`${styles.slash}`}><div></div></div></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td className={`${styles.wall} ${styles.right}`}></td>
                        {/* <td rowSpan="37" className={styles.section}>R</td> */}
                        <td><Seat id='2-r-1-18'/></td>
                        <td><Seat id='2-r-2-18'/></td>
                        <td className={`${styles.wall} ${styles.right}`}></td>
                    </tr>
                    <tr>
                        <td className={`${styles.wall} ${styles.left}`}></td>
                        <td><Seat id='2-l-2-18'/></td>
                        <td><Seat id='2-l-1-18'/></td>
                        {/* <td rowSpan="37" className={styles.section}>L</td> */}
                        <td className={`${styles.wall} ${styles.left}`}></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td><div className={`${styles.backslash}`}><div></div></div></td>
                        <td></td>
                        <td><Seat id='1-lp-3-28'/></td>
                        <td><Seat id='1-lp-2-28'/></td>
                        <td></td>
                        <td></td>
                        <td><Seat id='1-rp-2-7'/></td>
                        <td><Seat id='1-rp-3-7'/></td>
                        <td></td>
                        <td><div className={`${styles.slash}`}><div></div></div></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td className={`${styles.wall} ${styles.right}`}></td>
                        {/* <td rowSpan="37" className={styles.section}>R</td> */}
                        <td><Seat id='2-r-1-17'/></td>
                        <td><Seat id='2-r-2-17'/></td>
                        <td className={`${styles.wall} ${styles.right}`}></td>
                    </tr>
                    <tr>
                        <td className={`${styles.wall} ${styles.left}`}></td>
                        <td><Seat id='2-l-2-19'/></td>
                        <td><Seat id='2-l-1-19'/></td>
                        {/* <td rowSpan="37" className={styles.section}>L</td> */}
                        <td className={`${styles.wall} ${styles.left}`}></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td className={styles.floor}>1층</td>
                        <td></td>
                        <td></td>
                        <td><Seat id='1-l-4-2'/></td>
                        <td></td>
                        <td></td>
                        <td><div className={`${styles.backslash}`}><div></div></div></td>
                        <td><Seat id='1-lp-3-29'/></td>
                        <td><Seat id='1-lp-2-29'/></td>
                        <td></td>
                        <td></td>
                        <td><Seat id='1-rp-2-6'/></td>
                        <td><Seat id='1-rp-3-6'/></td>
                        <td><div className={`${styles.slash}`}><div></div></div></td>
                        <td></td>
                        <td></td>
                        <td><Seat id='1-r-4-23'/></td>
                        <td></td>
                        <td></td>
                        <td className={styles.floor}>1층</td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td className={`${styles.wall} ${styles.right}`}></td>
                        {/* <td rowSpan="37" className={styles.section}>R</td> */}
                        <td><Seat id='2-r-1-16'/></td>
                        <td><Seat id='2-r-2-16'/></td>
                        <td className={`${styles.wall} ${styles.right}`}></td>
                    </tr>
                    <tr>
                        <td className={`${styles.wall} ${styles.left}`}></td>
                        <td><Seat id='2-l-2-20'/></td>
                        <td><Seat id='2-l-1-20'/></td>
                        {/* <td rowSpan="37" className={styles.section}>L</td> */}
                        <td className={`${styles.wall} ${styles.left}`}></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td><Seat id='1-l-4-3'/></td>
                        <td></td>
                        <td><Seat id='1-l-2-3'/></td>
                        <td></td>
                        <td className={`${styles.wall} ${styles.left}`}><Seat id='1-lp-3-30'/></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td className={`${styles.wall} ${styles.right}`}><Seat id='1-rp-3-5'/></td>
                        <td></td>
                        <td><Seat id='1-r-2-22'/></td>
                        <td></td>
                        <td><Seat id='1-r-4-22'/></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td className={`${styles.wall} ${styles.right}`}></td>
                        {/* <td rowSpan="37" className={styles.section}>R</td> */}
                        <td><Seat id='2-r-1-15'/></td>
                        <td><Seat id='2-r-2-15'/></td>
                        <td className={`${styles.wall} ${styles.right}`}></td>
                    </tr>
                    <tr>
                        <td className={`${styles.wall} ${styles.left}`}></td>
                        <td><Seat id='2-l-2-21'/></td>
                        <td><Seat id='2-l-1-21'/></td>
                        {/* <td rowSpan="37" className={styles.section}>L</td> */}
                        <td className={`${styles.wall} ${styles.left}`}></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td><Seat id='1-l-4-4'/></td>
                        <td></td>
                        <td><Seat id='1-l-2-4'/></td>
                        <td></td>
                        <td className={`${styles.wall} ${styles.left}`}><Seat id='1-lp-3-31'/></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td className={`${styles.wall} ${styles.right}`}><Seat id='1-rp-3-4'/></td>
                        <td></td>
                        <td><Seat id='1-r-2-21'/></td>
                        <td></td>
                        <td><Seat id='1-r-4-21'/></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td className={`${styles.wall} ${styles.right}`}></td>
                        {/* <td rowSpan="37" className={styles.section}>R</td> */}
                        <td><Seat id='2-r-1-14'/></td>
                        <td><Seat id='2-r-2-14'/></td>
                        <td className={`${styles.wall} ${styles.right}`}></td>
                    </tr>
                    <tr>
                        <td className={`${styles.wall} ${styles.left}`}></td>
                        <td className={styles.num}>1</td>
                        <td className={styles.num}>2</td>
                        {/* <td rowSpan="37" className={styles.section}>L</td> */}
                        <td className={`${styles.wall} ${styles.left}`}></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td><Seat id='1-l-4-5'/></td>
                        <td><Seat id='1-l-3-5'/></td>
                        <td><Seat id='1-l-2-5'/></td>
                        <td></td>
                        <td className={`${styles.wall} ${styles.left}`}><Seat id='1-lp-3-32'/></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td className={`${styles.wall} ${styles.right}`}><Seat id='1-rp-3-3'/></td>
                        <td></td>
                        <td><Seat id='1-r-2-20'/></td>
                        <td><Seat id='1-r-3-20'/></td>
                        <td><Seat id='1-r-4-20'/></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td className={`${styles.wall} ${styles.right}`}></td>
                        {/* <td rowSpan="37" className={styles.section}>R</td> */}
                        <td className={styles.num}>1</td>
                        <td className={styles.num}>2</td>
                        <td className={`${styles.wall} ${styles.right}`}></td>
                    </tr>
                    <tr>
                        <td className={`${styles.wall} ${styles.left}`}></td>
                        <td><Seat id='2-l-2-22'/></td>
                        <td><Seat id='2-l-1-22'/></td>
                        {/* <td rowSpan="37" className={styles.section}>L</td> */}
                        <td className={`${styles.wall} ${styles.left}`}></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td><Seat id='1-l-4-6'/></td>
                        <td><Seat id='1-l-3-6'/></td>
                        <td><Seat id='1-l-2-6'/></td>
                        <td></td>
                        <td className={`${styles.wall} ${styles.left}`}><Seat id='1-lp-3-33'/></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td className={`${styles.wall} ${styles.right}`}><Seat id='1-rp-3-2'/></td>
                        <td></td>
                        <td><Seat id='1-r-2-19'/></td>
                        <td><Seat id='1-r-3-19'/></td>
                        <td><Seat id='1-r-4-19'/></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td className={`${styles.wall} ${styles.right}`}></td>
                        {/* <td rowSpan="37" className={styles.section}>R</td> */}
                        <td><Seat id='2-r-1-13'/></td>
                        <td><Seat id='2-r-2-13'/></td>
                        <td className={`${styles.wall} ${styles.right}`}></td>
                    </tr>
                    <tr>
                        <td className={`${styles.wall} ${styles.left}`}></td>
                        <td><Seat id='2-l-2-23'/></td>
                        <td><Seat id='2-l-1-23'/></td>
                        <td className={`${styles.wall} ${styles.left}`}></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td><Seat id='1-l-5-7'/></td>
                        <td><Seat id='1-l-4-7'/></td>
                        <td><Seat id='1-l-3-7'/></td>
                        <td><Seat id='1-l-2-7'/></td>
                        <td></td>
                        <td className={`${styles.wall} ${styles.left}`}></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td className={`${styles.wall} ${styles.right}`}></td>
                        <td></td>
                        <td><Seat id='1-r-2-18'/></td>
                        <td><Seat id='1-r-3-18'/></td>
                        <td><Seat id='1-r-4-18'/></td>
                        <td><Seat id='1-r-5-18'/></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td className={`${styles.wall} ${styles.right}`}></td>
                        <td><Seat id='2-r-1-12'/></td>
                        <td><Seat id='2-r-2-12'/></td>
                        <td className={`${styles.wall} ${styles.right}`}></td>
                    </tr>
                    <tr>
                        <td className={`${styles.wall} ${styles.left}`}></td>
                        <td><Seat id='2-l-2-24'/></td>
                        <td><Seat id='2-l-1-24'/></td>
                        <td className={`${styles.wall} ${styles.left}`}></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td className={styles.num}>7</td>
                        <td className={styles.num}>6</td>
                        <td className={styles.num}>5</td>
                        <td className={styles.num}>4</td>
                        <td className={styles.num}>3</td>
                        <td className={styles.num}>2</td>
                        <td className={styles.num}>1</td>
                        <td className={`${styles.wall} ${styles.top}`}></td>
                        <td rowSpan="10" className={`${styles.section} ${styles.wall} ${styles.left}`}>L</td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td rowSpan="10" className={`${styles.section} ${styles.wall} ${styles.right}`}>R</td>
                        <td className={`${styles.wall} ${styles.top}`}></td>
                        <td className={styles.num}>1</td>
                        <td className={styles.num}>2</td>
                        <td className={styles.num}>3</td>
                        <td className={styles.num}>4</td>
                        <td className={styles.num}>5</td>
                        <td className={styles.num}>6</td>
                        <td className={styles.num}>7</td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td className={`${styles.wall} ${styles.right}`}></td>
                        <td><Seat id='2-r-1-11'/></td>
                        <td><Seat id='2-r-2-11'/></td>
                        <td className={`${styles.wall} ${styles.right}`}></td>

                    </tr>
                    <tr>
                        <td className={`${styles.wall} ${styles.left}`}></td>
                        <td><Seat id='2-l-2-25'/></td>
                        <td><Seat id='2-l-1-25'/></td>
                        <td className={`${styles.wall} ${styles.left}`}></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td><Seat id='1-l-7-8'/></td>
                        <td><Seat id='1-l-6-8'/></td>
                        <td><Seat id='1-l-5-8'/></td>
                        <td><Seat id='1-l-4-8'/></td>
                        <td><Seat id='1-l-3-8'/></td>
                        <td><Seat id='1-l-2-8'/></td>
                        <td><Seat id='1-l-1-8'/></td>
                        <td></td>
                        {/* <td rowSpan="10" className={styles.section}>L</td> */}
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        {/* <td rowSpan="10" className={styles.section}>R</td> */}
                        <td></td>
                        <td><Seat id='1-r-1-17'/></td>
                        <td><Seat id='1-r-2-17'/></td>
                        <td><Seat id='1-r-3-17'/></td>
                        <td><Seat id='1-r-4-17'/></td>
                        <td><Seat id='1-r-5-17'/></td>
                        <td><Seat id='1-r-6-17'/></td>
                        <td><Seat id='1-r-7-17'/></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td className={`${styles.wall} ${styles.right}`}></td>
                        <td><Seat id='2-r-1-10'/></td>
                        <td><Seat id='2-r-2-10'/></td>
                        <td className={`${styles.wall} ${styles.right}`}></td>

                    </tr>
                    <tr>
                        <td className={`${styles.wall} ${styles.left}`}></td>
                        <td></td>
                        <td><Seat id='2-l-1-26'/></td>
                        <td className={`${styles.wall} ${styles.left}`}></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td><Seat id='1-l-7-9'/></td>
                        <td><Seat id='1-l-6-9'/></td>
                        <td><Seat id='1-l-5-9'/></td>
                        <td><Seat id='1-l-4-9'/></td>
                        <td><Seat id='1-l-3-9'/></td>
                        <td><Seat id='1-l-2-9'/></td>
                        <td><Seat id='1-l-1-9'/></td>
                        <td></td>
                        {/* <td rowSpan="10" className={styles.section}>L</td> */}
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        {/* <td rowSpan="10" className={styles.section}>R</td> */}
                        <td></td>
                        <td><Seat id='1-r-1-16'/></td>
                        <td><Seat id='1-r-2-16'/></td>
                        <td><Seat id='1-r-3-16'/></td>
                        <td><Seat id='1-r-4-16'/></td>
                        <td><Seat id='1-r-5-16'/></td>
                        <td><Seat id='1-r-6-16'/></td>
                        <td><Seat id='1-r-7-16'/></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td className={`${styles.wall} ${styles.right}`}></td>
                        <td><Seat id='2-r-1-9'/></td>
                        <td></td>
                        <td className={`${styles.wall} ${styles.right}`}></td>

                    </tr>
                    <tr>
                        <td className={`${styles.wall} ${styles.left}`}></td>
                        <td><Seat id='2-l-2-27'/></td>
                        <td><Seat id='2-l-1-27'/></td>
                        <td className={`${styles.wall} ${styles.left}`}></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td><Seat id='1-l-7-10'/></td>
                        <td><Seat id='1-l-6-10'/></td>
                        <td><Seat id='1-l-5-10'/></td>
                        <td><Seat id='1-l-4-10'/></td>
                        <td><Seat id='1-l-3-10'/></td>
                        <td><Seat id='1-l-2-10'/></td>
                        <td><Seat id='1-l-1-10'/></td>
                        <td></td>
                        {/* <td rowSpan="10" className={styles.section}>L</td> */}
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        {/* <td rowSpan="10" className={styles.section}>R</td> */}
                        <td></td>
                        <td><Seat id='1-r-1-15'/></td>
                        <td><Seat id='1-r-2-15'/></td>
                        <td><Seat id='1-r-3-15'/></td>
                        <td><Seat id='1-r-4-15'/></td>
                        <td><Seat id='1-r-5-15'/></td>
                        <td><Seat id='1-r-6-15'/></td>
                        <td><Seat id='1-r-7-15'/></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td className={`${styles.wall} ${styles.right}`}></td>
                        <td><Seat id='2-r-1-8'/></td>
                        <td><Seat id='2-r-2-8'/></td>
                        <td className={`${styles.wall} ${styles.right}`}></td>

                    </tr>
                    <tr>
                        <td className={`${styles.wall} ${styles.left}`}></td>
                        <td><Seat id='2-l-2-28'/></td>
                        <td><Seat id='2-l-1-28'/></td>
                        <td className={`${styles.wall} ${styles.left}`}></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td><Seat id='1-l-7-11'/></td>
                        <td><Seat id='1-l-6-11'/></td>
                        <td><Seat id='1-l-5-11'/></td>
                        <td><Seat id='1-l-4-11'/></td>
                        <td><Seat id='1-l-3-11'/></td>
                        <td><Seat id='1-l-2-11'/></td>
                        <td><Seat id='1-l-1-11'/></td>
                        <td></td>
                        {/* <td rowSpan="10" className={styles.section}>L</td> */}
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        {/* <td rowSpan="10" className={styles.section}>R</td> */}
                        <td></td>
                        <td><Seat id='1-r-1-14'/></td>
                        <td><Seat id='1-r-2-14'/></td>
                        <td><Seat id='1-r-3-14'/></td>
                        <td><Seat id='1-r-4-14'/></td>
                        <td><Seat id='1-r-5-14'/></td>
                        <td><Seat id='1-r-6-14'/></td>
                        <td><Seat id='1-r-7-14'/></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td className={`${styles.wall} ${styles.right}`}></td>
                        <td><Seat id='2-r-1-7'/></td>
                        <td><Seat id='2-r-2-7'/></td>
                        <td className={`${styles.wall} ${styles.right}`}></td>

                    </tr>
                    <tr>
                        <td className={`${styles.wall} ${styles.left}`}></td>
                        <td><Seat id='2-l-2-29'/></td>
                        <td><Seat id='2-l-1-29'/></td>
                        <td className={`${styles.wall} ${styles.left}`}></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td><Seat id='1-l-7-12'/></td>
                        <td><Seat id='1-l-6-12'/></td>
                        <td><Seat id='1-l-5-12'/></td>
                        <td><Seat id='1-l-4-12'/></td>
                        <td><Seat id='1-l-3-12'/></td>
                        <td><Seat id='1-l-2-12'/></td>
                        <td><Seat id='1-l-1-12'/></td>
                        <td></td>
                        {/* <td rowSpan="10" className={styles.section}>L</td> */}
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        {/* <td rowSpan="10" className={styles.section}>R</td> */}
                        <td></td>
                        <td><Seat id='1-r-1-13'/></td>
                        <td><Seat id='1-r-2-13'/></td>
                        <td><Seat id='1-r-3-13'/></td>
                        <td><Seat id='1-r-4-13'/></td>
                        <td><Seat id='1-r-5-13'/></td>
                        <td><Seat id='1-r-6-13'/></td>
                        <td><Seat id='1-r-7-13'/></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td className={`${styles.wall} ${styles.right}`}></td>
                        <td><Seat id='2-r-1-6'/></td>
                        <td><Seat id='2-r-2-6'/></td>
                        <td className={`${styles.wall} ${styles.right}`}></td>

                    </tr>
                    <tr>
                        <td className={`${styles.wall} ${styles.left}`}></td>
                        <td><Seat id='2-l-2-30'/></td>
                        <td><Seat id='2-l-1-30'/></td>
                        <td className={`${styles.wall} ${styles.left}`}></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td><Seat id='1-l-7-13'/></td>
                        <td><Seat id='1-l-6-13'/></td>
                        <td><Seat id='1-l-5-13'/></td>
                        <td><Seat id='1-l-4-13'/></td>
                        <td><Seat id='1-l-3-13'/></td>
                        <td><Seat id='1-l-2-13'/></td>
                        <td><Seat id='1-l-1-13'/></td>
                        <td></td>
                        {/* <td rowSpan="10" className={styles.section}>L</td> */}
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        {/* <td rowSpan="10" className={styles.section}>R</td> */}
                        <td></td>
                        <td><Seat id='1-r-1-12'/></td>
                        <td><Seat id='1-r-2-12'/></td>
                        <td><Seat id='1-r-3-12'/></td>
                        <td><Seat id='1-r-4-12'/></td>
                        <td><Seat id='1-r-5-12'/></td>
                        <td><Seat id='1-r-6-12'/></td>
                        <td><Seat id='1-r-7-12'/></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td className={`${styles.wall} ${styles.right}`}></td>
                        <td><Seat id='2-r-1-5'/></td>
                        <td><Seat id='2-r-2-5'/></td>
                        <td className={`${styles.wall} ${styles.right}`}></td>
                    </tr>
                    <tr>
                        <td className={`${styles.wall} ${styles.left}`}></td>
                        <td className={styles.num}>2</td>
                        <td className={styles.num}>1</td>
                        <td className={`${styles.wall} ${styles.left}`}></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td><Seat id='1-l-7-14'/></td>
                        <td><Seat id='1-l-6-14'/></td>
                        <td><Seat id='1-l-5-14'/></td>
                        <td><Seat id='1-l-4-14'/></td>
                        <td><Seat id='1-l-3-14'/></td>
                        <td><Seat id='1-l-2-14'/></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td colSpan="8" className={styles.section}>B</td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td colSpan="16" className={styles.section}>C</td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td colSpan="8" className={styles.section}>D</td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td><Seat id='1-r-2-11'/></td>
                        <td><Seat id='1-r-3-11'/></td>
                        <td><Seat id='1-r-4-11'/></td>
                        <td><Seat id='1-r-5-11'/></td>
                        <td><Seat id='1-r-6-11'/></td>
                        <td><Seat id='1-r-7-11'/></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td className={`${styles.wall} ${styles.right}`}></td>
                        <td className={styles.num}>1</td>
                        <td className={styles.num}>2</td>
                        <td className={`${styles.wall} ${styles.right}`}></td>
                    </tr>
                    <tr>
                        <td className={`${styles.wall} ${styles.left}`}></td>
                        <td><Seat id='2-l-2-31'/></td>
                        <td><Seat id='2-l-1-31'/></td>
                        <td className={`${styles.wall} ${styles.left}`}></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td><Seat id='1-l-7-15'/></td>
                        <td><Seat id='1-l-6-15'/></td>
                        <td><Seat id='1-l-5-15'/></td>
                        <td><Seat id='1-l-4-15'/></td>
                        <td><Seat id='1-l-3-15'/></td>
                        <td><Seat id='1-l-2-15'/></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td><Seat id='1-r-2-10'/></td>
                        <td><Seat id='1-r-3-10'/></td>
                        <td><Seat id='1-r-4-10'/></td>
                        <td><Seat id='1-r-5-10'/></td>
                        <td><Seat id='1-r-6-10'/></td>
                        <td><Seat id='1-r-7-10'/></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td className={`${styles.wall} ${styles.right}`}></td>
                        <td><Seat id='2-r-1-4'/></td>
                        <td><Seat id='2-r-2-4'/></td>
                        <td className={`${styles.wall} ${styles.right}`}></td>
                    </tr>
                    <tr>
                        <td className={`${styles.wall} ${styles.left}`}></td>
                        <td><Seat id='2-l-2-32'/></td>
                        <td><Seat id='2-l-1-32'/></td>
                        <td className={`${styles.wall} ${styles.left}`}></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td><Seat id='1-l-7-16'/></td>
                        <td><Seat id='1-l-6-16'/></td>
                        <td><Seat id='1-l-5-16'/></td>
                        <td><Seat id='1-l-4-16'/></td>
                        <td><Seat id='1-l-3-16'/></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td><Seat id='1-b-1-1'/></td>
                        <td><Seat id='1-b-1-2'/></td>
                        <td><Seat id='1-b-1-4'/></td>
                        <td><Seat id='1-b-1-5'/></td>
                        <td><Seat id='1-b-1-6'/></td>
                        <td><Seat id='1-b-1-7'/></td>
                        <td><Seat id='1-b-1-8'/></td>
                        <td className={styles.num}>1</td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td><Seat id='1-c-1-1'/></td>
                        <td><Seat id='1-c-1-2'/></td>
                        <td><Seat id='1-c-1-3'/></td>
                        <td><Seat id='1-c-1-4'/></td>
                        <td><Seat id='1-c-1-5'/></td>
                        <td><Seat id='1-c-1-6'/></td>
                        <td><Seat id='1-c-1-7'/></td>
                        <td><Seat id='1-c-1-8'/></td>
                        <td><Seat id='1-c-1-9'/></td>
                        <td><Seat id='1-c-1-10'/></td>
                        <td><Seat id='1-c-1-11'/></td>
                        <td><Seat id='1-c-1-12'/></td>
                        <td><Seat id='1-c-1-13'/></td>
                        <td><Seat id='1-c-1-14'/></td>
                        <td><Seat id='1-c-1-15'/></td>
                        <td><Seat id='1-c-1-16'/></td>
                        <td></td>
                        <td></td>
                        <td className={styles.num}>1</td>
                        <td><Seat id='1-d-1-1'/></td>
                        <td><Seat id='1-d-1-2'/></td>
                        <td><Seat id='1-d-1-3'/></td>
                        <td><Seat id='1-d-1-4'/></td>
                        <td><Seat id='1-d-1-5'/></td>
                        <td><Seat id='1-d-1-7'/></td>
                        <td><Seat id='1-d-1-8'/></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td><Seat id='1-r-3-9'/></td>
                        <td><Seat id='1-r-4-9'/></td>
                        <td><Seat id='1-r-5-9'/></td>
                        <td><Seat id='1-r-6-9'/></td>
                        <td><Seat id='1-r-7-9'/></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td className={`${styles.wall} ${styles.right}`}></td>
                        <td><Seat id='2-r-1-3'/></td>
                        <td><Seat id='2-r-2-3'/></td>
                        <td className={`${styles.wall} ${styles.right}`}></td>
                    </tr>
                    <tr>
                        <td className={`${styles.wall} ${styles.left}`}></td>
                        <td><Seat id='2-l-2-33'/></td>
                        <td><Seat id='2-l-1-33'/></td>
                        <td className={`${styles.wall} ${styles.left}`}></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td><Seat id='1-l-7-17'/></td>
                        <td><Seat id='1-l-6-17'/></td>
                        <td><Seat id='1-l-5-17'/></td>
                        <td><Seat id='1-l-4-17'/></td>
                        <td><Seat id='1-l-3-17'/></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td><Seat id='1-b-2-1'/></td>
                        <td><Seat id='1-b-2-2'/></td>
                        <td><Seat id='1-b-2-3'/></td>
                        <td><Seat id='1-b-2-4'/></td>
                        <td><Seat id='1-b-2-5'/></td>
                        <td><Seat id='1-b-2-6'/></td>
                        <td><Seat id='1-b-2-7'/></td>
                        <td><Seat id='1-b-2-8'/></td>
                        <td className={styles.num}>2</td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td><Seat id='1-c-2-1'/></td>
                        <td><Seat id='1-c-2-2'/></td>
                        <td><Seat id='1-c-2-3'/></td>
                        <td><Seat id='1-c-2-4'/></td>
                        <td><Seat id='1-c-2-5'/></td>
                        <td><Seat id='1-c-2-6'/></td>
                        <td><Seat id='1-c-2-7'/></td>
                        <td><Seat id='1-c-2-8'/></td>
                        <td><Seat id='1-c-2-9'/></td>
                        <td><Seat id='1-c-2-10'/></td>
                        <td><Seat id='1-c-2-11'/></td>
                        <td><Seat id='1-c-2-12'/></td>
                        <td><Seat id='1-c-2-13'/></td>
                        <td><Seat id='1-c-2-14'/></td>
                        <td><Seat id='1-c-2-15'/></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td className={styles.num}>2</td>
                        <td><Seat id='1-d-2-1'/></td>
                        <td><Seat id='1-d-2-2'/></td>
                        <td><Seat id='1-d-2-3'/></td>
                        <td><Seat id='1-d-2-4'/></td>
                        <td><Seat id='1-d-2-5'/></td>
                        <td><Seat id='1-d-2-6'/></td>
                        <td><Seat id='1-d-2-7'/></td>
                        <td><Seat id='1-d-2-8'/></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td><Seat id='1-r-3-8'/></td>
                        <td><Seat id='1-r-4-8'/></td>
                        <td><Seat id='1-r-5-8'/></td>
                        <td><Seat id='1-r-6-8'/></td>
                        <td><Seat id='1-r-7-8'/></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td className={`${styles.wall} ${styles.right}`}></td>
                        <td><Seat id='2-r-1-2'/></td>
                        <td><Seat id='2-r-2-2'/></td>
                        <td className={`${styles.wall} ${styles.right}`}></td>
                    </tr>
                    <tr>
                        <td className={`${styles.wall} ${styles.left}`}></td>
                        <td><Seat id='2-l-2-34'/></td>
                        <td><Seat id='2-l-1-34'/></td>
                        <td className={`${styles.wall} ${styles.left}`}></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td><Seat id='1-l-7-18'/></td>
                        <td><Seat id='1-l-6-18'/></td>
                        <td><Seat id='1-l-5-18'/></td>
                        <td><Seat id='1-l-4-18'/></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td colSpan={4} className={styles.section}>A</td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td><Seat id='1-b-3-1'/></td>
                        <td><Seat id='1-b-3-2'/></td>
                        <td><Seat id='1-b-3-3'/></td>
                        <td><Seat id='1-b-3-4'/></td>
                        <td><Seat id='1-b-3-5'/></td>
                        <td><Seat id='1-b-3-6'/></td>
                        <td><Seat id='1-b-3-7'/></td>
                        <td><Seat id='1-b-3-8'/></td>
                        <td className={styles.num}>3</td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td><Seat id='1-c-3-1'/></td>
                        <td><Seat id='1-c-3-2'/></td>
                        <td><Seat id='1-c-3-3'/></td>
                        <td><Seat id='1-c-3-4'/></td>
                        <td><Seat id='1-c-3-5'/></td>
                        <td><Seat id='1-c-3-6'/></td>
                        <td><Seat id='1-c-3-7'/></td>
                        <td><Seat id='1-c-3-8'/></td>
                        <td><Seat id='1-c-3-9'/></td>
                        <td><Seat id='1-c-3-10'/></td>
                        <td><Seat id='1-c-3-11'/></td>
                        <td><Seat id='1-c-3-12'/></td>
                        <td><Seat id='1-c-3-13'/></td>
                        <td><Seat id='1-c-3-14'/></td>
                        <td><Seat id='1-c-3-15'/></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td className={styles.num}>3</td>
                        <td><Seat id='1-d-3-1'/></td>
                        <td><Seat id='1-d-3-2'/></td>
                        <td><Seat id='1-d-3-3'/></td>
                        <td><Seat id='1-d-3-4'/></td>
                        <td><Seat id='1-d-3-5'/></td>
                        <td><Seat id='1-d-3-6'/></td>
                        <td><Seat id='1-d-3-7'/></td>
                        <td><Seat id='1-d-3-8'/></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td colSpan={4} className={styles.section}>E</td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td><Seat id='1-r-4-7'/></td>
                        <td><Seat id='1-r-5-7'/></td>
                        <td><Seat id='1-r-6-7'/></td>
                        <td><Seat id='1-r-7-7'/></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td className={`${styles.wall} ${styles.right}`}></td>
                        <td><Seat id='2-r-1-1'/></td>
                        <td><Seat id='2-r-2-1'/></td>
                        <td className={`${styles.wall} ${styles.right}`}></td>
                    </tr>
                    <tr>
                        <td className={`${styles.wall} ${styles.left}`}></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td className={`${styles.wall} ${styles.left}`}></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td><Seat id='1-l-7-19'/></td>
                        <td><Seat id='1-l-6-19'/></td>
                        <td><Seat id='1-l-5-19'/></td>
                        <td><Seat id='1-l-4-19'/></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td><div className={`${styles.slash}`}><div></div></div></td>
                        <td className={`${styles.wall} ${styles.top}`}></td>
                        <td className={`${styles.wall} ${styles.top}`}></td>
                        <td className={`${styles.wall} ${styles.top}`}></td>
                        <td className={`${styles.wall} ${styles.top} ${styles.right}`}><Seat id='1-a-1-1'/></td>
                        <td className={styles.num}>1</td>
                        <td></td>
                        <td></td>
                        <td><Seat id='1-b-4-1'/></td>
                        <td><Seat id='1-b-4-2'/></td>
                        <td><Seat id='1-b-4-3'/></td>
                        <td><Seat id='1-b-4-4'/></td>
                        <td><Seat id='1-b-4-5'/></td>
                        <td><Seat id='1-b-4-6'/></td>
                        <td><Seat id='1-b-4-7'/></td>
                        <td><Seat id='1-b-4-8'/></td>
                        <td className={styles.num}>4</td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td><Seat id='1-c-4-1'/></td>
                        <td><Seat id='1-c-4-2'/></td>
                        <td><Seat id='1-c-4-3'/></td>
                        <td><Seat id='1-c-4-4'/></td>
                        <td><Seat id='1-c-4-5'/></td>
                        <td><Seat id='1-c-4-6'/></td>
                        <td><Seat id='1-c-4-7'/></td>
                        <td><Seat id='1-c-4-8'/></td>
                        <td><Seat id='1-c-4-9'/></td>
                        <td><Seat id='1-c-4-10'/></td>
                        <td><Seat id='1-c-4-11'/></td>
                        <td><Seat id='1-c-4-12'/></td>
                        <td><Seat id='1-c-4-13'/></td>
                        <td><Seat id='1-c-4-14'/></td>
                        <td><Seat id='1-c-4-15'/></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td className={styles.num}>4</td>
                        <td><Seat id='1-d-4-1'/></td>
                        <td><Seat id='1-d-4-2'/></td>
                        <td><Seat id='1-d-4-3'/></td>
                        <td><Seat id='1-d-4-4'/></td>
                        <td><Seat id='1-d-4-5'/></td>
                        <td><Seat id='1-d-4-6'/></td>
                        <td><Seat id='1-d-4-7'/></td>
                        <td><Seat id='1-d-4-8'/></td>
                        <td></td>
                        <td></td>
                        <td className={styles.num}>1</td>
                        <td className={`${styles.wall} ${styles.top} ${styles.left}`}><Seat id='1-e-1-1'/></td>
                        <td className={`${styles.wall} ${styles.top}`}></td>
                        <td className={`${styles.wall} ${styles.top}`}></td>
                        <td className={`${styles.wall} ${styles.top}`}></td>
                        <td><div className={`${styles.backslash}`}><div></div></div></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td><Seat id='1-r-4-6'/></td>
                        <td><Seat id='1-r-5-6'/></td>
                        <td><Seat id='1-r-6-6'/></td>
                        <td><Seat id='1-r-7-6'/></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td className={`${styles.wall} ${styles.right}`}></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td className={`${styles.wall} ${styles.right}`}></td>
                    </tr>
                    <tr>
                        <td colSpan={4} className={`${styles.wall} ${styles.left} ${styles.floor}`}>2층</td>
                        <td className={`${styles.wall} ${styles.left}`}></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td><Seat id='1-l-7-20'/></td>
                        <td><Seat id='1-l-6-20'/></td>
                        <td><Seat id='1-l-5-20'/></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td><div className={`${styles.slash}`}><div></div></div></td>
                        <td></td>
                        <td></td>
                        <td><Seat id='1-a-2-1'/></td>
                        <td><Seat id='1-a-2-2'/></td>
                        <td className={`${styles.wall} ${styles.right}`}><Seat id='1-a-2-3'/></td>
                        <td className={styles.num}>2</td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td><Seat id='1-b-5-1'/></td>
                        <td><Seat id='1-b-5-2'/></td>
                        <td><Seat id='1-b-5-3'/></td>
                        <td><Seat id='1-b-5-4'/></td>
                        <td><Seat id='1-b-5-5'/></td>
                        <td><Seat id='1-b-5-6'/></td>
                        <td><Seat id='1-b-5-7'/></td>
                        <td className={styles.num}>5</td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td><Seat id='1-c-5-1'/></td>
                        <td><Seat id='1-c-5-2'/></td>
                        <td><Seat id='1-c-5-3'/></td>
                        <td><Seat id='1-c-5-4'/></td>
                        <td><Seat id='1-c-5-5'/></td>
                        <td><Seat id='1-c-5-6'/></td>
                        <td><Seat id='1-c-5-7'/></td>
                        <td><Seat id='1-c-5-8'/></td>
                        <td><Seat id='1-c-5-9'/></td>
                        <td><Seat id='1-c-5-10'/></td>
                        <td><Seat id='1-c-5-11'/></td>
                        <td><Seat id='1-c-5-12'/></td>
                        <td><Seat id='1-c-5-13'/></td>
                        <td><Seat id='1-c-5-14'/></td>
                        <td><Seat id='1-c-5-15'/></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td className={styles.num}>5</td>
                        <td><Seat id='1-d-5-1'/></td>
                        <td><Seat id='1-d-5-2'/></td>
                        <td><Seat id='1-d-5-3'/></td>
                        <td><Seat id='1-d-5-4'/></td>
                        <td><Seat id='1-d-5-5'/></td>
                        <td><Seat id='1-d-5-6'/></td>
                        <td><Seat id='1-d-5-7'/></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td className={styles.num}>2</td>
                        <td className={`${styles.wall} ${styles.left}`}><Seat id='1-e-2-1'/></td>
                        <td><Seat id='1-e-2-2'/></td>
                        <td><Seat id='1-e-2-3'/></td>
                        <td></td>
                        <td></td>
                        <td><div className={`${styles.backslash}`}><div></div></div></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td><Seat id='1-r-5-5'/></td>
                        <td><Seat id='1-r-6-5'/></td>
                        <td><Seat id='1-r-7-5'/></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td className={`${styles.wall} ${styles.right}`}></td>
                        <td colSpan={4} className={`${styles.wall} ${styles.right} ${styles.floor}`}>2층</td>
                    </tr>
                    <tr>
                        <td className={`${styles.wall} ${styles.left}`}></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td className={`${styles.wall} ${styles.left}`}></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td><div className={`${styles.slash}`}><div></div></div></td>
                        <td></td>
                        <td></td>
                        <td><Seat id='1-a-3-1'/></td>
                        <td><Seat id='1-a-3-2'/></td>
                        <td><Seat id='1-a-3-3'/></td>
                        <td className={`${styles.wall} ${styles.right}`}><Seat id='1-a-3-4'/></td>
                        <td className={styles.num}>3</td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td><Seat id='1-b-6-1'/></td>
                        <td><Seat id='1-b-6-2'/></td>
                        <td><Seat id='1-b-6-3'/></td>
                        <td><Seat id='1-b-6-4'/></td>
                        <td><Seat id='1-b-6-5'/></td>
                        <td><Seat id='1-b-6-6'/></td>
                        <td><Seat id='1-b-6-7'/></td>
                        <td className={styles.num}>6</td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td><Seat id='1-c-6-1'/></td>
                        <td><Seat id='1-c-6-2'/></td>
                        <td><Seat id='1-c-6-3'/></td>
                        <td><Seat id='1-c-6-4'/></td>
                        <td><Seat id='1-c-6-5'/></td>
                        <td><Seat id='1-c-6-6'/></td>
                        <td><Seat id='1-c-6-7'/></td>
                        <td><Seat id='1-c-6-8'/></td>
                        <td><Seat id='1-c-6-9'/></td>
                        <td><Seat id='1-c-6-10'/></td>
                        <td><Seat id='1-c-6-11'/></td>
                        <td><Seat id='1-c-6-12'/></td>
                        <td><Seat id='1-c-6-13'/></td>
                        <td><Seat id='1-c-6-14'/></td>
                        <td><Seat id='1-c-6-15'/></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td className={styles.num}>6</td>
                        <td><Seat id='1-d-6-1'/></td>
                        <td><Seat id='1-d-6-2'/></td>
                        <td><Seat id='1-d-6-3'/></td>
                        <td><Seat id='1-d-6-4'/></td>
                        <td><Seat id='1-d-6-5'/></td>
                        <td><Seat id='1-d-6-6'/></td>
                        <td><Seat id='1-d-6-7'/></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td className={styles.num}>3</td>
                        <td className={`${styles.wall} ${styles.left}`}><Seat id='1-e-3-1'/></td>
                        <td><Seat id='1-e-3-2'/></td>
                        <td><Seat id='1-e-3-3'/></td>
                        <td><Seat id='1-e-3-4'/></td>
                        <td></td>
                        <td></td>
                        <td><div className={`${styles.backslash}`}><div></div></div></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td className={`${styles.wall} ${styles.right}`}></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td className={`${styles.wall} ${styles.right}`}></td>
                    </tr>
                    <tr>
                        <td className={`${styles.wall} ${styles.left}`}></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td className={`${styles.wall} ${styles.left}`}></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td><Seat id='1-a-4-1'/></td>
                        <td><Seat id='1-a-4-2'/></td>
                        <td><Seat id='1-a-4-3'/></td>
                        <td><Seat id='1-a-4-4'/></td>
                        <td><Seat id='1-a-4-5'/></td>
                        <td className={`${styles.wall} ${styles.right}`}><Seat id='1-a-4-6'/></td>
                        <td className={styles.num}>4</td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td><Seat id='1-b-7-1'/></td>
                        <td><Seat id='1-b-7-2'/></td>
                        <td><Seat id='1-b-7-3'/></td>
                        <td><Seat id='1-b-7-4'/></td>
                        <td><Seat id='1-b-7-5'/></td>
                        <td><Seat id='1-b-7-6'/></td>
                        <td><Seat id='1-b-7-7'/></td>
                        <td className={styles.num}>7</td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td><Seat id='1-c-7-1'/></td>
                        <td><Seat id='1-c-7-2'/></td>
                        <td><Seat id='1-c-7-3'/></td>
                        <td><Seat id='1-c-7-4'/></td>
                        <td><Seat id='1-c-7-5'/></td>
                        <td><Seat id='1-c-7-6'/></td>
                        <td><Seat id='1-c-7-7'/></td>
                        <td><Seat id='1-c-7-8'/></td>
                        <td><Seat id='1-c-7-9'/></td>
                        <td><Seat id='1-c-7-10'/></td>
                        <td><Seat id='1-c-7-11'/></td>
                        <td><Seat id='1-c-7-12'/></td>
                        <td><Seat id='1-c-7-13'/></td>
                        <td><Seat id='1-c-7-14'/></td>
                        <td><Seat id='1-c-7-15'/></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td className={styles.num}>7</td>
                        <td><Seat id='1-d-7-1'/></td>
                        <td><Seat id='1-d-7-2'/></td>
                        <td><Seat id='1-d-7-3'/></td>
                        <td><Seat id='1-d-7-4'/></td>
                        <td><Seat id='1-d-7-5'/></td>
                        <td><Seat id='1-d-7-6'/></td>
                        <td><Seat id='1-d-7-7'/></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td className={styles.num}>4</td>
                        <td className={`${styles.wall} ${styles.left}`}><Seat id='1-e-4-1'/></td>
                        <td><Seat id='1-e-4-2'/></td>
                        <td><Seat id='1-e-4-3'/></td>
                        <td><Seat id='1-e-4-4'/></td>
                        <td><Seat id='1-e-4-5'/></td>
                        <td><Seat id='1-e-4-6'/></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td className={`${styles.wall} ${styles.right}`}></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td className={`${styles.wall} ${styles.right}`}></td>
                    </tr>
                    <tr>
                        <td className={`${styles.wall} ${styles.left}`}></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td className={`${styles.wall} ${styles.left}`}></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td><Seat id='1-a-5-1'/></td>
                        <td><Seat id='1-a-5-2'/></td>
                        <td><Seat id='1-a-5-3'/></td>
                        <td><Seat id='1-a-5-4'/></td>
                        <td><Seat id='1-a-5-5'/></td>
                        <td><Seat id='1-a-5-6'/></td>
                        <td><Seat id='1-a-5-7'/></td>
                        <td><Seat id='1-a-5-8'/></td>
                        <td className={`${styles.wall} ${styles.right}`}><Seat id='1-a-5-9'/></td>
                        <td className={styles.num}>5</td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td className={styles.num}>8</td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td><Seat id='1-c-8-1'/></td>
                        <td><Seat id='1-c-8-2'/></td>
                        <td><Seat id='1-c-8-3'/></td>
                        <td><Seat id='1-c-8-4'/></td>
                        <td><Seat id='1-c-8-5'/></td>
                        <td><Seat id='1-c-8-6'/></td>
                        <td><Seat id='1-c-8-7'/></td>
                        <td><Seat id='1-c-8-8'/></td>
                        <td><Seat id='1-c-8-9'/></td>
                        <td><Seat id='1-c-8-10'/></td>
                        <td><Seat id='1-c-8-11'/></td>
                        <td><Seat id='1-c-8-12'/></td>
                        <td><Seat id='1-c-8-13'/></td>
                        <td><Seat id='1-c-8-14'/></td>
                        <td><Seat id='1-c-8-15'/></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td className={styles.num}>8</td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td className={styles.num}>5</td>
                        <td className={`${styles.wall} ${styles.left}`}><Seat id='1-e-5-1'/></td>
                        <td><Seat id='1-e-5-2'/></td>
                        <td><Seat id='1-e-5-3'/></td>
                        <td><Seat id='1-e-5-4'/></td>
                        <td><Seat id='1-e-5-5'/></td>
                        <td><Seat id='1-e-5-6'/></td>
                        <td><Seat id='1-e-5-7'/></td>
                        <td><Seat id='1-e-5-8'/></td>
                        <td><Seat id='1-e-5-9'/></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td className={`${styles.wall} ${styles.right}`}></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td className={`${styles.wall} ${styles.right}`}></td>
                    </tr>
                    <tr>
                        <td className={`${styles.wall} ${styles.left}`}></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td className={`${styles.wall} ${styles.left}`}></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td><Seat id='1-a-6-1'/></td>
                        <td><Seat id='1-a-6-2'/></td>
                        <td><Seat id='1-a-6-3'/></td>
                        <td><Seat id='1-a-6-4'/></td>
                        <td><Seat id='1-a-6-5'/></td>
                        <td><Seat id='1-a-6-6'/></td>
                        <td><Seat id='1-a-6-7'/></td>
                        <td><Seat id='1-a-6-8'/></td>
                        <td><Seat id='1-a-6-9'/></td>
                        <td className={`${styles.wall} ${styles.right}`}><Seat id='1-a-6-10'/></td>
                        <td className={styles.num}>6</td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td colSpan={35} style={{backgroundColor:'#000'}} className={`${styles.wall} ${styles.left} ${styles.right}`}></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td className={styles.num}>6</td>
                        <td className={`${styles.wall} ${styles.left}`}><Seat id='1-e-6-1'/></td>
                        <td><Seat id='1-e-6-2'/></td>
                        <td><Seat id='1-e-6-3'/></td>
                        <td><Seat id='1-e-6-4'/></td>
                        <td><Seat id='1-e-6-5'/></td>
                        <td><Seat id='1-e-6-6'/></td>
                        <td><Seat id='1-e-6-7'/></td>
                        <td><Seat id='1-e-6-8'/></td>
                        <td><Seat id='1-e-6-9'/></td>
                        <td><Seat id='1-e-6-10'/></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td className={`${styles.wall} ${styles.right}`}></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td className={`${styles.wall} ${styles.right}`}></td>
                    </tr>
                    <tr>
                        <td className={`${styles.wall} ${styles.left}`}></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td className={`${styles.wall} ${styles.left}`}></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td><Seat id='1-a-7-1'/></td>
                        <td><Seat id='1-a-7-2'/></td>
                        <td><Seat id='1-a-7-3'/></td>
                        <td><Seat id='1-a-7-4'/></td>
                        <td><Seat id='1-a-7-5'/></td>
                        <td><Seat id='1-a-7-6'/></td>
                        <td><Seat id='1-a-7-7'/></td>
                        <td><Seat id='1-a-7-8'/></td>
                        <td><Seat id='1-a-7-9'/></td>
                        <td><Seat id='1-a-7-10'/></td>
                        <td className={`${styles.wall} ${styles.right}`}><Seat id='1-a-7-11'/></td>
                        <td className={styles.num}>7</td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td className={styles.num}>9</td>
                        <td className={`${styles.wall} ${styles.left}`}><Seat id='1-b-9-1'/></td>
                        <td><Seat id='1-b-9-2'/></td>
                        <td><Seat id='1-b-9-3'/></td>
                        <td><Seat id='1-b-9-4'/></td>
                        <td><Seat id='1-b-9-5'/></td>
                        <td><Seat id='1-b-9-6'/></td>
                        <td className={styles.num}>9</td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td><Seat id='1-c-9-1'/></td>
                        <td><Seat id='1-c-9-2'/></td>
                        <td><Seat id='1-c-9-3'/></td>
                        <td><Seat id='1-c-9-4'/></td>
                        <td><Seat id='1-c-9-5'/></td>
                        <td><Seat id='1-c-9-6'/></td>
                        <td><Seat id='1-c-9-7'/></td>
                        <td><Seat id='1-c-9-8'/></td>
                        <td><Seat id='1-c-9-9'/></td>
                        <td><Seat id='1-c-9-10'/></td>
                        <td><Seat id='1-c-9-11'/></td>
                        <td><Seat id='1-c-9-12'/></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td className={styles.num}>9</td>
                        <td><Seat id='1-d-9-1'/></td>
                        <td><Seat id='1-d-9-2'/></td>
                        <td><Seat id='1-d-9-3'/></td>
                        <td><Seat id='1-d-9-4'/></td>
                        <td><Seat id='1-d-9-5'/></td>
                        <td className={`${styles.wall} ${styles.right}`}><Seat id='1-d-9-6'/></td>
                        <td className={styles.num}>9</td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td className={styles.num}>7</td>
                        <td className={`${styles.wall} ${styles.left}`}><Seat id='1-e-7-1'/></td>
                        <td><Seat id='1-e-7-2'/></td>
                        <td><Seat id='1-e-7-3'/></td>
                        <td><Seat id='1-e-7-4'/></td>
                        <td><Seat id='1-e-7-5'/></td>
                        <td><Seat id='1-e-7-6'/></td>
                        <td><Seat id='1-e-7-7'/></td>
                        <td><Seat id='1-e-7-8'/></td>
                        <td><Seat id='1-e-7-9'/></td>
                        <td><Seat id='1-e-7-10'/></td>
                        <td><Seat id='1-e-7-11'/></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td className={`${styles.wall} ${styles.right}`}></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td className={`${styles.wall} ${styles.right}`}></td>

                    </tr>
                    <tr>
                        <td className={`${styles.wall} ${styles.left}`}></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td className={`${styles.wall} ${styles.left}`}></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td><Seat id='1-a-8-1'/></td>
                        <td><Seat id='1-a-8-2'/></td>
                        <td><Seat id='1-a-8-3'/></td>
                        <td><Seat id='1-a-8-4'/></td>
                        <td><Seat id='1-a-8-5'/></td>
                        <td><Seat id='1-a-8-6'/></td>
                        <td><Seat id='1-a-8-7'/></td>
                        <td><Seat id='1-a-8-8'/></td>
                        <td><Seat id='1-a-8-9'/></td>
                        <td><Seat id='1-a-8-10'/></td>
                        <td><Seat id='1-a-8-11'/></td>
                        <td className={`${styles.wall} ${styles.right}`}><Seat id='1-a-8-12'/></td>
                        <td className={styles.num}>8</td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td className={styles.num}>10</td>
                        <td className={`${styles.wall} ${styles.left}`}><Seat id='1-b-10-1'/></td>
                        <td><Seat id='1-b-10-2'/></td>
                        <td><Seat id='1-b-10-3'/></td>
                        <td><Seat id='1-b-10-4'/></td>
                        <td><Seat id='1-b-10-5'/></td>
                        <td></td>
                        <td className={styles.num}>10</td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td><Seat id='1-c-10-1'/></td>
                        <td><Seat id='1-c-10-2'/></td>
                        <td><Seat id='1-c-10-3'/></td>
                        <td><Seat id='1-c-10-4'/></td>
                        <td><Seat id='1-c-10-5'/></td>
                        <td><Seat id='1-c-10-6'/></td>
                        <td><Seat id='1-c-10-7'/></td>
                        <td><Seat id='1-c-10-8'/></td>
                        <td><Seat id='1-c-10-9'/></td>
                        <td><Seat id='1-c-10-10'/></td>
                        <td><Seat id='1-c-10-11'/></td>
                        <td><Seat id='1-c-10-12'/></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td className={styles.num}>10</td>
                        <td></td>
                        <td><Seat id='1-d-10-1'/></td>
                        <td><Seat id='1-d-10-2'/></td>
                        <td><Seat id='1-d-10-3'/></td>
                        <td><Seat id='1-d-10-4'/></td>
                        <td className={`${styles.wall} ${styles.right}`}><Seat id='1-d-10-5'/></td>
                        <td className={styles.num}>10</td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td className={styles.num}>8</td>
                        <td className={`${styles.wall} ${styles.left}`}><Seat id='1-e-8-1'/></td>
                        <td><Seat id='1-e-8-2'/></td>
                        <td><Seat id='1-e-8-3'/></td>
                        <td><Seat id='1-e-8-4'/></td>
                        <td><Seat id='1-e-8-5'/></td>
                        <td><Seat id='1-e-8-6'/></td>
                        <td><Seat id='1-e-8-7'/></td>
                        <td><Seat id='1-e-8-8'/></td>
                        <td><Seat id='1-e-8-9'/></td>
                        <td><Seat id='1-e-8-10'/></td>
                        <td><Seat id='1-e-8-11'/></td>
                        <td><Seat id='1-e-8-12'/></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td className={`${styles.wall} ${styles.right}`}></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td className={`${styles.wall} ${styles.right}`}></td>
                    </tr>
                    <tr>
                        <td className={`${styles.wall} ${styles.left}`}></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td className={`${styles.wall} ${styles.left}`}></td>
                        <td></td>
                        <td></td>
                        <td className={`${styles.wall} ${styles.left} ${styles.top}`}><Seat id='1-a-9-1'/></td>
                        <td className={`${styles.wall} ${styles.top}`}><Seat id='1-a-9-2'/></td>
                        <td className={`${styles.wall} ${styles.top}`}><Seat id='1-a-9-3'/></td>
                        <td className={`${styles.wall} ${styles.top}`}><Seat id='1-a-9-4'/></td>
                        <td className={`${styles.wall} ${styles.top}`}><Seat id='1-a-9-5'/></td>
                        <td className={`${styles.wall} ${styles.top}`}><Seat id='1-a-9-6'/></td>
                        <td className={`${styles.wall} ${styles.top}`}><Seat id='1-a-9-7'/></td>
                        <td className={`${styles.num} ${styles.wall} ${styles.top}`}>9</td>
                        <td className={`${styles.wall} ${styles.top}`}><Seat id='1-a-9-8'/></td>
                        <td className={`${styles.wall} ${styles.top}`}><Seat id='1-a-9-9'/></td>
                        <td className={`${styles.wall} ${styles.top}`}><Seat id='1-a-9-10'/></td>
                        <td className={`${styles.wall} ${styles.top}`}></td>
                        <td className={`${styles.wall} ${styles.top}`}></td>
                        <td className={`${styles.wall} ${styles.top}`}></td>
                        <td className={`${styles.wall} ${styles.right} ${styles.top}`}></td>
                        <td className={styles.num}>9</td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td className={styles.num}>11</td>
                        <td className={`${styles.wall} ${styles.left}`}><Seat id='1-b-11-1'/></td>
                        <td><Seat id='1-b-11-2'/></td>
                        <td><Seat id='1-b-11-3'/></td>
                        <td><Seat id='1-b-11-4'/></td>
                        <td><Seat id='1-b-11-5'/></td>
                        <td></td>
                        <td className={styles.num}>11</td>
                        <td></td>
                        <td></td>
                        <td><Seat id='1-c-11-1'/></td>
                        <td><Seat id='1-c-11-2'/></td>
                        <td><Seat id='1-c-11-3'/></td>
                        <td><Seat id='1-c-11-4'/></td>
                        <td><Seat id='1-c-11-5'/></td>
                        <td><Seat id='1-c-11-6'/></td>
                        <td><Seat id='1-c-11-7'/></td>
                        <td><Seat id='1-c-11-8'/></td>
                        <td><Seat id='1-c-11-9'/></td>
                        <td><Seat id='1-c-11-10'/></td>
                        <td><Seat id='1-c-11-11'/></td>
                        <td><Seat id='1-c-11-12'/></td>
                        <td><Seat id='1-c-11-13'/></td>
                        <td><Seat id='1-c-11-14'/></td>
                        <td><Seat id='1-c-11-15'/></td>
                        <td><Seat id='1-c-11-16'/></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td className={styles.num}>11</td>
                        <td></td>
                        <td><Seat id='1-d-11-1'/></td>
                        <td><Seat id='1-d-11-2'/></td>
                        <td><Seat id='1-d-11-3'/></td>
                        <td><Seat id='1-d-11-4'/></td>
                        <td className={`${styles.wall} ${styles.right}`}><Seat id='1-d-11-5'/></td>
                        <td className={styles.num}>11</td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td className={styles.num}>9</td>
                        <td className={`${styles.wall} ${styles.left} ${styles.top}`}></td>
                        <td className={`${styles.wall} ${styles.top}`}></td>
                        <td className={`${styles.wall} ${styles.top}`}></td>
                        <td className={`${styles.wall} ${styles.top}`}></td>
                        <td className={`${styles.wall} ${styles.top}`}><Seat id='1-e-9-5'/></td>
                        <td className={`${styles.wall} ${styles.top}`}><Seat id='1-e-9-6'/></td>
                        <td className={`${styles.wall} ${styles.top}`}><Seat id='1-e-9-7'/></td>
                        <td className={`${styles.num} ${styles.wall} ${styles.top}`}>9</td>
                        <td className={`${styles.wall} ${styles.top}`}><Seat id='1-e-9-8'/></td>
                        <td className={`${styles.wall} ${styles.top}`}><Seat id='1-e-9-9'/></td>
                        <td className={`${styles.wall} ${styles.top}`}><Seat id='1-e-9-10'/></td>
                        <td className={`${styles.wall} ${styles.top}`}><Seat id='1-e-9-11'/></td>
                        <td className={`${styles.wall} ${styles.top}`}><Seat id='1-e-9-12'/></td>
                        <td className={`${styles.wall} ${styles.top}`}><Seat id='1-e-9-13'/></td>
                        <td className={`${styles.wall} ${styles.top} ${styles.right}`}><Seat id='1-e-9-14'/></td>
                        <td></td>
                        <td></td>
                        <td className={`${styles.wall} ${styles.right}`}></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td className={`${styles.wall} ${styles.right}`}></td>
                    </tr>
                    <tr>
                        <td className={`${styles.wall} ${styles.left}`}></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td className={`${styles.wall} ${styles.left}`}></td>
                        <td></td>
                        <td></td>
                        <td className={`${styles.wall} ${styles.left}`}><Seat id='1-a-10-1'/></td>
                        <td><Seat id='1-a-10-2'/></td>
                        <td><Seat id='1-a-10-3'/></td>
                        <td><Seat id='1-a-10-4'/></td>
                        <td><Seat id='1-a-10-5'/></td>
                        <td><Seat id='1-a-10-6'/></td>
                        <td><Seat id='1-a-10-7'/></td>
                        <td className={`${styles.num}`}>10</td>
                        <td><Seat id='1-a-10-8'/></td>
                        <td><Seat id='1-a-10-9'/></td>
                        <td><Seat id='1-a-10-10'/></td>
                        <td><Seat id='1-a-10-11'/></td>
                        <td></td>
                        <td></td>
                        <td className={`${styles.wall} ${styles.right}`}></td>
                        <td className={styles.num}>10</td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td className={styles.num}>12</td>
                        <td className={`${styles.wall} ${styles.left}`}><Seat id='1-b-12-1'/></td>
                        <td><Seat id='1-b-12-2'/></td>
                        <td><Seat id='1-b-12-3'/></td>
                        <td><Seat id='1-b-12-4'/></td>
                        <td><Seat id='1-b-12-5'/></td>
                        <td></td>
                        <td className={styles.num}>12</td>
                        <td></td>
                        <td></td>
                        <td><Seat id='1-c-12-1'/></td>
                        <td><Seat id='1-c-12-2'/></td>
                        <td><Seat id='1-c-12-3'/></td>
                        <td><Seat id='1-c-12-4'/></td>
                        <td><Seat id='1-c-12-5'/></td>
                        <td><Seat id='1-c-12-6'/></td>
                        <td><Seat id='1-c-12-7'/></td>
                        <td><Seat id='1-c-12-8'/></td>
                        <td><Seat id='1-c-12-9'/></td>
                        <td><Seat id='1-c-12-10'/></td>
                        <td><Seat id='1-c-12-11'/></td>
                        <td><Seat id='1-c-12-12'/></td>
                        <td><Seat id='1-c-12-13'/></td>
                        <td><Seat id='1-c-12-14'/></td>
                        <td><Seat id='1-c-12-15'/></td>
                        <td><Seat id='1-c-12-16'/></td>
                        <td><Seat id='1-c-12-17'/></td>
                        <td></td>
                        <td></td>
                        <td className={styles.num}>12</td>
                        <td></td>
                        <td><Seat id='1-d-12-1'/></td>
                        <td><Seat id='1-d-12-2'/></td>
                        <td><Seat id='1-d-12-3'/></td>
                        <td><Seat id='1-d-12-4'/></td>
                        <td className={`${styles.wall} ${styles.right}`}><Seat id='1-d-12-5'/></td>
                        <td className={styles.num}>12</td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td className={styles.num}>10</td>
                        <td className={`${styles.wall} ${styles.left}`}></td>
                        <td></td>
                        <td></td>
                        <td><Seat id='1-e-10-4'/></td>
                        <td><Seat id='1-e-10-5'/></td>
                        <td><Seat id='1-e-10-6'/></td>
                        <td><Seat id='1-e-10-7'/></td>
                        <td className={`${styles.num}`}>10</td>
                        <td><Seat id='1-e-10-8'/></td>
                        <td><Seat id='1-e-10-9'/></td>
                        <td><Seat id='1-e-10-10'/></td>
                        <td><Seat id='1-e-10-11'/></td>
                        <td><Seat id='1-e-10-12'/></td>
                        <td><Seat id='1-e-10-13'/></td>
                        <td className={`${styles.wall} ${styles.right}`}><Seat id='1-e-10-14'/></td>
                        <td></td>
                        <td></td>
                        <td className={`${styles.wall} ${styles.right}`}></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td className={`${styles.wall} ${styles.right}`}></td>
                    </tr>
                    <tr>
                        <td className={`${styles.wall} ${styles.left}`}></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td className={`${styles.wall} ${styles.left}`}></td>
                        <td></td>
                        <td></td>
                        <td><Seat id='1-a-11-1'/></td>
                        <td><Seat id='1-a-11-2'/></td>
                        <td><Seat id='1-a-11-3'/></td>
                        <td><Seat id='1-a-11-4'/></td>
                        <td><Seat id='1-a-11-5'/></td>
                        <td><Seat id='1-a-11-6'/></td>
                        <td><Seat id='1-a-11-7'/></td>
                        <td className={`${styles.num}`}>11</td>
                        <td><Seat id='1-a-11-8'/></td>
                        <td><Seat id='1-a-11-9'/></td>
                        <td><Seat id='1-a-11-10'/></td>
                        <td><Seat id='1-a-11-11'/></td>
                        <td><Seat id='1-a-11-12'/></td>
                        <td></td>
                        <td className={`${styles.wall} ${styles.right}`}></td>
                        <td className={styles.num}>11</td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td className={styles.num}>13</td>
                        <td><Seat id='1-b-13-1'/></td>
                        <td><Seat id='1-b-13-2'/></td>
                        <td><Seat id='1-b-13-3'/></td>
                        <td><Seat id='1-b-13-4'/></td>
                        <td><Seat id='1-b-13-5'/></td>
                        <td></td>
                        <td className={styles.num}>13</td>
                        <td></td>
                        <td><Seat id='1-c-13-1'/></td>
                        <td><Seat id='1-c-13-2'/></td>
                        <td><Seat id='1-c-13-3'/></td>
                        <td><Seat id='1-c-13-4'/></td>
                        <td><Seat id='1-c-13-5'/></td>
                        <td><Seat id='1-c-13-6'/></td>
                        <td><Seat id='1-c-13-7'/></td>
                        <td><Seat id='1-c-13-8'/></td>
                        <td><Seat id='1-c-13-9'/></td>
                        <td><Seat id='1-c-13-10'/></td>
                        <td><Seat id='1-c-13-11'/></td>
                        <td><Seat id='1-c-13-12'/></td>
                        <td><Seat id='1-c-13-13'/></td>
                        <td><Seat id='1-c-13-14'/></td>
                        <td><Seat id='1-c-13-15'/></td>
                        <td><Seat id='1-c-13-16'/></td>
                        <td><Seat id='1-c-13-17'/></td>
                        <td><Seat id='1-c-13-18'/></td>
                        <td></td>
                        <td></td>
                        <td className={styles.num}>13</td>
                        <td></td>
                        <td><Seat id='1-d-13-1'/></td>
                        <td><Seat id='1-d-13-2'/></td>
                        <td><Seat id='1-d-13-3'/></td>
                        <td><Seat id='1-d-13-4'/></td>
                        <td><Seat id='1-d-13-5'/></td>
                        <td className={styles.num}>13</td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td className={styles.num}>11</td>
                        <td className={`${styles.wall} ${styles.left}`}></td>
                        <td></td>
                        <td><Seat id='1-e-11-3'/></td>
                        <td><Seat id='1-e-11-4'/></td>
                        <td><Seat id='1-e-11-5'/></td>
                        <td><Seat id='1-e-11-6'/></td>
                        <td><Seat id='1-e-11-7'/></td>
                        <td className={`${styles.num}`}>11</td>
                        <td><Seat id='1-e-11-8'/></td>
                        <td><Seat id='1-e-11-9'/></td>
                        <td><Seat id='1-e-11-10'/></td>
                        <td><Seat id='1-e-11-11'/></td>
                        <td><Seat id='1-e-11-12'/></td>
                        <td><Seat id='1-e-11-13'/></td>
                        <td><Seat id='1-e-11-14'/></td>
                        <td></td>
                        <td></td>
                        <td className={`${styles.wall} ${styles.right}`}></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td className={`${styles.wall} ${styles.right}`}></td>
                    </tr>
                    <tr>
                        <td className={`${styles.wall} ${styles.left}`}></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td className={`${styles.wall} ${styles.left}`}></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td><Seat id='1-a-12-2'/></td>
                        <td><Seat id='1-a-12-3'/></td>
                        <td><Seat id='1-a-12-4'/></td>
                        <td><Seat id='1-a-12-5'/></td>
                        <td><Seat id='1-a-12-6'/></td>
                        <td><Seat id='1-a-12-7'/></td>
                        <td className={`${styles.num}`}>12</td>
                        <td><Seat id='1-a-12-8'/></td>
                        <td><Seat id='1-a-12-9'/></td>
                        <td><Seat id='1-a-12-10'/></td>
                        <td><Seat id='1-a-12-11'/></td>
                        <td><Seat id='1-a-12-12'/></td>
                        <td></td>
                        <td className={`${styles.wall} ${styles.right}`}></td>
                        <td className={styles.num}>12</td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td className={styles.num}>14</td>
                        <td><Seat id='1-b-14-1'/></td>
                        <td><Seat id='1-b-14-2'/></td>
                        <td><Seat id='1-b-14-3'/></td>
                        <td><Seat id='1-b-14-4'/></td>
                        <td></td>
                        <td></td>
                        <td className={styles.num}>14</td>
                        <td></td>
                        <td><Seat id='1-c-14-1'/></td>
                        <td><Seat id='1-c-14-2'/></td>
                        <td><Seat id='1-c-14-3'/></td>
                        <td><Seat id='1-c-14-4'/></td>
                        <td><Seat id='1-c-14-5'/></td>
                        <td><Seat id='1-c-14-6'/></td>
                        <td><Seat id='1-c-14-7'/></td>
                        <td><Seat id='1-c-14-8'/></td>
                        <td><Seat id='1-c-14-9'/></td>
                        <td><Seat id='1-c-14-10'/></td>
                        <td><Seat id='1-c-14-11'/></td>
                        <td><Seat id='1-c-14-12'/></td>
                        <td><Seat id='1-c-14-13'/></td>
                        <td><Seat id='1-c-14-14'/></td>
                        <td><Seat id='1-c-14-15'/></td>
                        <td><Seat id='1-c-14-16'/></td>
                        <td><Seat id='1-c-14-17'/></td>
                        <td><Seat id='1-c-14-18'/></td>
                        <td><Seat id='1-c-14-19'/></td>
                        <td></td>
                        <td className={styles.num}>14</td>
                        <td></td>
                        <td></td>
                        <td><Seat id='1-d-14-1'/></td>
                        <td><Seat id='1-d-14-2'/></td>
                        <td><Seat id='1-d-14-3'/></td>
                        <td><Seat id='1-d-14-4'/></td>
                        <td className={styles.num}>14</td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td className={styles.num}>12</td>
                        <td className={`${styles.wall} ${styles.left}`}></td>
                        <td></td>
                        <td><Seat id='1-e-12-3'/></td>
                        <td><Seat id='1-e-12-4'/></td>
                        <td><Seat id='1-e-12-5'/></td>
                        <td><Seat id='1-e-12-6'/></td>
                        <td><Seat id='1-e-12-7'/></td>
                        <td className={`${styles.num}`}>12</td>
                        <td><Seat id='1-e-12-8'/></td>
                        <td><Seat id='1-e-12-9'/></td>
                        <td><Seat id='1-e-12-10'/></td>
                        <td><Seat id='1-e-12-11'/></td>
                        <td><Seat id='1-e-12-12'/></td>
                        <td><Seat id='1-e-12-13'/></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td className={`${styles.wall} ${styles.right}`}></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td className={`${styles.wall} ${styles.right}`}></td>
                    </tr>
                    <tr>
                        <td className={`${styles.wall} ${styles.left}`}></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td className={`${styles.wall} ${styles.left}`}></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td><Seat id='1-a-13-3'/></td>
                        <td><Seat id='1-a-13-4'/></td>
                        <td><Seat id='1-a-13-5'/></td>
                        <td><Seat id='1-a-13-6'/></td>
                        <td><Seat id='1-a-13-7'/></td>
                        <td className={`${styles.num}`}>13</td>
                        <td><Seat id='1-a-13-8'/></td>
                        <td><Seat id='1-a-13-9'/></td>
                        <td><Seat id='1-a-13-10'/></td>
                        <td><Seat id='1-a-13-11'/></td>
                        <td><Seat id='1-a-13-12'/></td>
                        <td><Seat id='1-a-13-13'/></td>
                        <td className={`${styles.wall} ${styles.right}`}></td>
                        <td className={styles.num}>13</td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td className={styles.num}>15</td>
                        <td><Seat id='1-b-15-1'/></td>
                        <td><Seat id='1-b-15-2'/></td>
                        <td><Seat id='1-b-15-3'/></td>
                        <td><Seat id='1-b-15-4'/></td>
                        <td></td>
                        <td></td>
                        <td className={styles.num}>15</td>
                        <td><Seat id='1-c-15-1'/></td>
                        <td><Seat id='1-c-15-2'/></td>
                        <td><Seat id='1-c-15-3'/></td>
                        <td><Seat id='1-c-15-4'/></td>
                        <td><Seat id='1-c-15-5'/></td>
                        <td><Seat id='1-c-15-6'/></td>
                        <td><Seat id='1-c-15-7'/></td>
                        <td><Seat id='1-c-15-8'/></td>
                        <td><Seat id='1-c-15-9'/></td>
                        <td><Seat id='1-c-15-10'/></td>
                        <td><Seat id='1-c-15-11'/></td>
                        <td><Seat id='1-c-15-12'/></td>
                        <td><Seat id='1-c-15-13'/></td>
                        <td><Seat id='1-c-15-14'/></td>
                        <td><Seat id='1-c-15-15'/></td>
                        <td><Seat id='1-c-15-16'/></td>
                        <td><Seat id='1-c-15-17'/></td>
                        <td><Seat id='1-c-15-18'/></td>
                        <td><Seat id='1-c-15-19'/></td>
                        <td><Seat id='1-c-15-20'/></td>
                        <td></td>
                        <td className={styles.num}>15</td>
                        <td></td>
                        <td></td>
                        <td><Seat id='1-d-15-1'/></td>
                        <td><Seat id='1-d-15-2'/></td>
                        <td><Seat id='1-d-15-3'/></td>
                        <td><Seat id='1-d-15-4'/></td>
                        <td className={styles.num}>15</td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td className={styles.num}>13</td>
                        <td className={`${styles.wall} ${styles.left}`}></td>
                        <td><Seat id='1-e-13-2'/></td>
                        <td><Seat id='1-e-13-3'/></td>
                        <td><Seat id='1-e-13-4'/></td>
                        <td><Seat id='1-e-13-5'/></td>
                        <td><Seat id='1-e-13-6'/></td>
                        <td><Seat id='1-e-13-7'/></td>
                        <td className={`${styles.num}`}>13</td>
                        <td><Seat id='1-e-13-8'/></td>
                        <td><Seat id='1-e-13-9'/></td>
                        <td><Seat id='1-e-13-10'/></td>
                        <td><Seat id='1-e-13-11'/></td>
                        <td><Seat id='1-e-13-12'/></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td className={`${styles.wall} ${styles.right}`}></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td className={`${styles.wall} ${styles.right}`}></td>
                    </tr>
                    <tr>
                        <td className={`${styles.wall} ${styles.left}`}></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td className={`${styles.wall} ${styles.left}`}></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td><Seat id='1-a-14-4'/></td>
                        <td><Seat id='1-a-14-5'/></td>
                        <td><Seat id='1-a-14-6'/></td>
                        <td><Seat id='1-a-14-7'/></td>
                        <td className={`${styles.num}`}>14</td>
                        <td><Seat id='1-a-14-8'/></td>
                        <td><Seat id='1-a-14-9'/></td>
                        <td><Seat id='1-a-14-10'/></td>
                        <td><Seat id='1-a-14-11'/></td>
                        <td><Seat id='1-a-14-12'/></td>
                        <td><Seat id='1-a-14-13'/></td>
                        <td className={`${styles.wall} ${styles.right}`}></td>
                        <td className={styles.num}>14</td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td className={styles.num}>16</td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td className={styles.num}>16</td>
                        <td><Seat id='1-c-16-1'/></td>
                        <td><Seat id='1-c-16-2'/></td>
                        <td><Seat id='1-c-16-3'/></td>
                        <td><Seat id='1-c-16-4'/></td>
                        <td><Seat id='1-c-16-5'/></td>
                        <td><Seat id='1-c-16-6'/></td>
                        <td><Seat id='1-c-16-7'/></td>
                        <td><Seat id='1-c-16-8'/></td>
                        <td><Seat id='1-c-16-9'/></td>
                        <td><Seat id='1-c-16-10'/></td>
                        <td><Seat id='1-c-16-11'/></td>
                        <td><Seat id='1-c-16-12'/></td>
                        <td><Seat id='1-c-16-13'/></td>
                        <td><Seat id='1-c-16-14'/></td>
                        <td><Seat id='1-c-16-15'/></td>
                        <td><Seat id='1-c-16-16'/></td>
                        <td><Seat id='1-c-16-17'/></td>
                        <td><Seat id='1-c-16-18'/></td>
                        <td><Seat id='1-c-16-19'/></td>
                        <td><Seat id='1-c-16-20'/></td>
                        <td><Seat id='1-c-16-21'/></td>
                        <td className={styles.num}>16</td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td className={styles.num}>16</td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td className={styles.num}>14</td>
                        <td className={`${styles.wall} ${styles.left}`}></td>
                        <td><Seat id='1-e-14-2'/></td>
                        <td><Seat id='1-e-14-3'/></td>
                        <td><Seat id='1-e-14-4'/></td>
                        <td><Seat id='1-e-14-5'/></td>
                        <td><Seat id='1-e-14-6'/></td>
                        <td><Seat id='1-e-14-7'/></td>
                        <td className={`${styles.num}`}>14</td>
                        <td><Seat id='1-e-14-8'/></td>
                        <td><Seat id='1-e-14-9'/></td>
                        <td><Seat id='1-e-14-10'/></td>
                        <td><Seat id='1-e-14-11'/></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td className={`${styles.wall} ${styles.right}`}></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td className={`${styles.wall} ${styles.right}`}></td>
                    </tr>
                    <tr>
                        <td className={`${styles.wall} ${styles.left}`}></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td className={`${styles.wall} ${styles.left}`}></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td><Seat id='1-a-15-6'/></td>
                        <td><Seat id='1-a-15-7'/></td>
                        <td className={`${styles.num}`}>15</td>
                        <td><Seat id='1-a-15-8'/></td>
                        <td><Seat id='1-a-15-9'/></td>
                        <td><Seat id='1-a-15-10'/></td>
                        <td><Seat id='1-a-15-11'/></td>
                        <td><Seat id='1-a-15-12'/></td>
                        <td><Seat id='1-a-15-13'/></td>
                        <td className={`${styles.wall} ${styles.right}`}><Seat id='1-a-15-14'/></td>
                        <td className={styles.num}>15</td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td colSpan={31} style={{backgroundColor:'#000'}} className={`${styles.wall} ${styles.bottom} ${styles.left} ${styles.right}`}></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td className={styles.num}>15</td>
                        <td className={`${styles.wall} ${styles.left}`}><Seat id='1-e-15-1'/></td>
                        <td><Seat id='1-e-15-2'/></td>
                        <td><Seat id='1-e-15-3'/></td>
                        <td><Seat id='1-e-15-4'/></td>
                        <td><Seat id='1-e-15-5'/></td>
                        <td><Seat id='1-e-15-6'/></td>
                        <td><Seat id='1-e-15-7'/></td>
                        <td className={`${styles.num}`}>15</td>
                        <td><Seat id='1-e-15-8'/></td>
                        <td><Seat id='1-e-15-9'/></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td className={`${styles.wall} ${styles.right}`}></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td className={`${styles.wall} ${styles.right}`}></td>
                    </tr>
                    <tr>
                        <td className={`${styles.wall} ${styles.left}`}></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td className={`${styles.wall} ${styles.left}`}></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td className={`${styles.num}`}>16</td>
                        <td><Seat id='1-a-16-8'/></td>
                        <td><Seat id='1-a-16-9'/></td>
                        <td><Seat id='1-a-16-10'/></td>
                        <td><Seat id='1-a-16-11'/></td>
                        <td><Seat id='1-a-16-12'/></td>
                        <td><Seat id='1-a-16-13'/></td>
                        <td className={`${styles.wall} ${styles.right}`}><Seat id='1-a-16-14'/></td>
                        <td className={styles.num}>16</td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td colSpan={24}></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td className={styles.num}>16</td>
                        <td className={`${styles.wall} ${styles.left}`}><Seat id='1-e-16-1'/></td>
                        <td><Seat id='1-e-16-2'/></td>
                        <td><Seat id='1-e-16-3'/></td>
                        <td><Seat id='1-e-16-4'/></td>
                        <td><Seat id='1-e-16-5'/></td>
                        <td><Seat id='1-e-16-6'/></td>
                        <td><Seat id='1-e-16-7'/></td>
                        <td className={`${styles.num}`}>16</td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td className={`${styles.wall} ${styles.right}`}></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td className={`${styles.wall} ${styles.right}`}></td>
                    </tr>
                    <tr>
                        <td className={`${styles.wall} ${styles.left}`}></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td className={`${styles.wall} ${styles.left}`}></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td className={`${styles.wall} ${styles.right}`}></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td className={styles.num}>17</td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td><Seat id='1-c-17-1'/></td>
                        <td><Seat id='1-c-17-2'/></td>
                        <td><Seat id='1-c-17-3'/></td>
                        <td><Seat id='1-c-17-4'/></td>
                        <td><Seat id='1-c-17-5'/></td>
                        <td><Seat id='1-c-17-6'/></td>
                        <td><Seat id='1-c-17-7'/></td>
                        <td><Seat id='1-c-17-8'/></td>
                        <td><Seat id='1-c-17-9'/></td>
                        <td><Seat id='1-c-17-10'/></td>
                        <td><Seat id='1-c-17-11'/></td>
                        <td><Seat id='1-c-17-12'/></td>
                        <td><Seat id='1-c-17-13'/></td>
                        <td><Seat id='1-c-17-14'/></td>
                        <td><Seat id='1-c-17-15'/></td>
                        <td><Seat id='1-c-17-16'/></td>
                        <td></td>
                        <td></td>
                        <td className={styles.num}>17</td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td className={`${styles.wall} ${styles.left}`}></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td className={`${styles.wall} ${styles.right}`}></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td className={`${styles.wall} ${styles.right}`}></td>
                    </tr>
                    <tr>
                        <td className={`${styles.wall} ${styles.left}`}></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td className={`${styles.wall} ${styles.left}`}></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td className={`${styles.wall} ${styles.right}`}></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td className={`${styles.wall} ${styles.top} ${styles.left}`}></td>
                        <td className={`${styles.wall} ${styles.top}`}></td>
                        <td className={`${styles.wall} ${styles.top}`}></td>
                        <td className={`${styles.wall} ${styles.top}`}></td>
                        <td className={`${styles.wall} ${styles.top}`}></td>
                        <td className={styles.num}>18</td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td><Seat id='1-c-18-1'/></td>
                        <td><Seat id='1-c-18-2'/></td>
                        <td><Seat id='1-c-18-3'/></td>
                        <td><Seat id='1-c-18-4'/></td>
                        <td><Seat id='1-c-18-5'/></td>
                        <td><Seat id='1-c-18-6'/></td>
                        <td><Seat id='1-c-18-7'/></td>
                        <td><Seat id='1-c-18-8'/></td>
                        <td><Seat id='1-c-18-9'/></td>
                        <td><Seat id='1-c-18-10'/></td>
                        <td><Seat id='1-c-18-11'/></td>
                        <td><Seat id='1-c-18-12'/></td>
                        <td><Seat id='1-c-18-13'/></td>
                        <td><Seat id='1-c-18-14'/></td>
                        <td><Seat id='1-c-18-15'/></td>
                        <td><Seat id='1-c-18-16'/></td>
                        <td></td>
                        <td></td>
                        <td className={styles.num}>18</td>
                        <td className={`${styles.wall} ${styles.top}`}></td>
                        <td className={`${styles.wall} ${styles.top}`}></td>
                        <td className={`${styles.wall} ${styles.top}`}></td>
                        <td className={`${styles.wall} ${styles.top}`}></td>
                        <td className={`${styles.wall} ${styles.top} ${styles.right}`}></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td className={`${styles.wall} ${styles.left}`}></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td className={`${styles.wall} ${styles.right}`}></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td className={`${styles.wall} ${styles.right}`}></td>
                    </tr>
                    <tr>
                        <td className={`${styles.wall} ${styles.left}`}></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td className={`${styles.wall} ${styles.left}`}></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td className={`${styles.wall} ${styles.right}`}></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td className={`${styles.wall} ${styles.left}`}></td>
                        <td><Seat id='1-b-19-1'/></td>
                        <td><Seat id='1-b-19-2'/></td>
                        <td><Seat id='1-b-19-3'/></td>
                        <td><Seat id='1-b-19-4'/></td>
                        <td className={styles.num}>19</td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td><Seat id='1-c-19-1'/></td>
                        <td><Seat id='1-c-19-2'/></td>
                        <td><Seat id='1-c-19-3'/></td>
                        <td><Seat id='1-c-19-4'/></td>
                        <td><Seat id='1-c-19-5'/></td>
                        <td><Seat id='1-c-19-6'/></td>
                        <td><Seat id='1-c-19-7'/></td>
                        <td><Seat id='1-c-19-8'/></td>
                        <td><Seat id='1-c-19-9'/></td>
                        <td><Seat id='1-c-19-10'/></td>
                        <td><Seat id='1-c-19-11'/></td>
                        <td><Seat id='1-c-19-12'/></td>
                        <td><Seat id='1-c-19-13'/></td>
                        <td><Seat id='1-c-19-14'/></td>
                        <td><Seat id='1-c-19-15'/></td>
                        <td><Seat id='1-c-19-16'/></td>
                        <td></td>
                        <td></td>
                        <td className={styles.num}>19</td>
                        <td><Seat id='1-d-19-1'/></td>
                        <td><Seat id='1-d-19-2'/></td>
                        <td><Seat id='1-d-19-3'/></td>
                        <td><Seat id='1-d-19-4'/></td>
                        <td className={`${styles.wall} ${styles.right}`}></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td className={`${styles.wall} ${styles.left}`}></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td className={`${styles.wall} ${styles.right}`}></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td className={`${styles.wall} ${styles.right}`}></td>
                    </tr>
                    <tr>
                        <td className={`${styles.wall} ${styles.left}`}></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td className={`${styles.wall} ${styles.left}`}></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td className={`${styles.wall} ${styles.right}`}></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td className={`${styles.wall} ${styles.left}`}><Seat id='1-b-20-1'/></td>
                        <td><Seat id='1-b-20-2'/></td>
                        <td><Seat id='1-b-20-3'/></td>
                        <td><Seat id='1-b-20-4'/></td>
                        <td><Seat id='1-b-20-5'/></td>
                        <td className={styles.num}>20</td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td><Seat id='1-c-20-1'/></td>
                        <td><Seat id='1-c-20-2'/></td>
                        <td><Seat id='1-c-20-3'/></td>
                        <td><Seat id='1-c-20-4'/></td>
                        <td><Seat id='1-c-20-5'/></td>
                        <td><Seat id='1-c-20-6'/></td>
                        <td><Seat id='1-c-20-7'/></td>
                        <td><Seat id='1-c-20-8'/></td>
                        <td><Seat id='1-c-20-9'/></td>
                        <td><Seat id='1-c-20-10'/></td>
                        <td><Seat id='1-c-20-11'/></td>
                        <td><Seat id='1-c-20-12'/></td>
                        <td><Seat id='1-c-20-13'/></td>
                        <td><Seat id='1-c-20-14'/></td>
                        <td><Seat id='1-c-20-15'/></td>
                        <td><Seat id='1-c-20-16'/></td>
                        <td></td>
                        <td></td>
                        <td className={styles.num}>20</td>
                        <td><Seat id='1-d-20-1'/></td>
                        <td><Seat id='1-d-20-2'/></td>
                        <td><Seat id='1-d-20-3'/></td>
                        <td><Seat id='1-d-20-4'/></td>
                        <td className={`${styles.wall} ${styles.right}`}><Seat id='1-d-20-5'/></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td className={`${styles.wall} ${styles.left}`}></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td className={`${styles.wall} ${styles.right}`}></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td className={`${styles.wall} ${styles.right}`}></td>
                    </tr>
                    <tr>
                        <td className={`${styles.wall} ${styles.left}`}></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td className={`${styles.wall} ${styles.left}`}></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td className={`${styles.wall} ${styles.right}`}></td>
                        <td className={`${styles.wall} ${styles.top}`}></td>
                        <td className={`${styles.wall} ${styles.top}`}><Seat id='1-b-21-1'/></td>
                        <td className={`${styles.wall} ${styles.top}`}><Seat id='1-b-21-2'/></td>
                        <td className={`${styles.wall} ${styles.top}`}><Seat id='1-b-21-3'/></td>
                        <td className={`${styles.wall} ${styles.top}`}><Seat id='1-b-21-4'/></td>
                        <td className={`${styles.wall} ${styles.top}`}><Seat id='1-b-21-5'/></td>
                        <td><Seat id='1-b-21-6'/></td>
                        <td><Seat id='1-b-21-7'/></td>
                        <td><Seat id='1-b-21-8'/></td>
                        <td><Seat id='1-b-21-9'/></td>
                        <td><Seat id='1-b-21-10'/></td>
                        <td className={styles.num}>21</td>
                        <td></td>
                        <td></td>
                        <td><Seat id='1-c-21-1'/></td>
                        <td><Seat id='1-c-21-2'/></td>
                        <td><Seat id='1-c-21-3'/></td>
                        <td><Seat id='1-c-21-4'/></td>
                        <td><Seat id='1-c-21-5'/></td>
                        <td><Seat id='1-c-21-6'/></td>
                        <td><Seat id='1-c-21-7'/></td>
                        <td><Seat id='1-c-21-8'/></td>
                        <td><Seat id='1-c-21-9'/></td>
                        <td><Seat id='1-c-21-10'/></td>
                        <td><Seat id='1-c-21-11'/></td>
                        <td><Seat id='1-c-21-12'/></td>
                        <td><Seat id='1-c-21-13'/></td>
                        <td><Seat id='1-c-21-14'/></td>
                        <td><Seat id='1-c-21-15'/></td>
                        <td><Seat id='1-c-21-16'/></td>
                        <td><Seat id='1-c-21-17'/></td>
                        <td></td>
                        <td></td>
                        <td className={styles.num}>21</td>
                        <td><Seat id='1-d-21-1'/></td>
                        <td><Seat id='1-d-21-2'/></td>
                        <td><Seat id='1-d-21-3'/></td>
                        <td><Seat id='1-d-21-4'/></td>
                        <td><Seat id='1-d-21-5'/></td>
                        <td className={`${styles.wall} ${styles.top}`}><Seat id='1-d-21-6'/></td>
                        <td className={`${styles.wall} ${styles.top}`}><Seat id='1-d-21-7'/></td>
                        <td className={`${styles.wall} ${styles.top}`}><Seat id='1-d-21-8'/></td>
                        <td className={`${styles.wall} ${styles.top}`}><Seat id='1-d-21-9'/></td>
                        <td className={`${styles.wall} ${styles.top}`}><Seat id='1-d-21-10'/></td>
                        <td className={`${styles.wall} ${styles.top}`}></td>
                        <td className={`${styles.wall} ${styles.left}`}></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td className={`${styles.wall} ${styles.right}`}></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td className={`${styles.wall} ${styles.right}`}></td>
                    </tr>
                    <tr>
                        <td className={`${styles.wall} ${styles.left}`}></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td className={`${styles.wall} ${styles.left}`}></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td className={`${styles.wall} ${styles.right}`}></td>
                        <td><Seat id='1-b-22-1'/></td>
                        <td><Seat id='1-b-22-2'/></td>
                        <td><Seat id='1-b-22-3'/></td>
                        <td><Seat id='1-b-22-4'/></td>
                        <td><Seat id='1-b-22-5'/></td>
                        <td><Seat id='1-b-22-6'/></td>
                        <td><Seat id='1-b-22-7'/></td>
                        <td><Seat id='1-b-22-8'/></td>
                        <td><Seat id='1-b-22-9'/></td>
                        <td><Seat id='1-b-22-10'/></td>
                        <td><Seat id='1-b-22-11'/></td>
                        <td className={styles.num}>22</td>
                        <td></td>
                        <td></td>
                        <td><Seat id='1-c-22-1'/></td>
                        <td><Seat id='1-c-22-2'/></td>
                        <td><Seat id='1-c-22-3'/></td>
                        <td><Seat id='1-c-22-4'/></td>
                        <td><Seat id='1-c-22-5'/></td>
                        <td><Seat id='1-c-22-6'/></td>
                        <td><Seat id='1-c-22-7'/></td>
                        <td><Seat id='1-c-22-8'/></td>
                        <td><Seat id='1-c-22-9'/></td>
                        <td><Seat id='1-c-22-10'/></td>
                        <td><Seat id='1-c-22-11'/></td>
                        <td><Seat id='1-c-22-12'/></td>
                        <td><Seat id='1-c-22-13'/></td>
                        <td><Seat id='1-c-22-14'/></td>
                        <td><Seat id='1-c-22-15'/></td>
                        <td><Seat id='1-c-22-16'/></td>
                        <td><Seat id='1-c-22-17'/></td>
                        <td></td>
                        <td></td>
                        <td className={styles.num}>22</td>
                        <td><Seat id='1-d-22-1'/></td>
                        <td><Seat id='1-d-22-2'/></td>
                        <td><Seat id='1-d-22-3'/></td>
                        <td><Seat id='1-d-22-4'/></td>
                        <td><Seat id='1-d-22-5'/></td>
                        <td><Seat id='1-d-22-6'/></td>
                        <td><Seat id='1-d-22-7'/></td>
                        <td><Seat id='1-d-22-8'/></td>
                        <td><Seat id='1-d-22-9'/></td>
                        <td><Seat id='1-d-22-10'/></td>
                        <td><Seat id='1-d-22-11'/></td>
                        <td className={`${styles.wall} ${styles.left}`}></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td className={`${styles.wall} ${styles.right}`}></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td className={`${styles.wall} ${styles.right}`}></td>
                    </tr>
                    <tr>
                        <td className={`${styles.wall} ${styles.left}`}></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td className={`${styles.wall} ${styles.left}`}></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td className={`${styles.wall} ${styles.right}`}></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td><Seat id='1-b-23-1'/></td>
                        <td><Seat id='1-b-23-2'/></td>
                        <td><Seat id='1-b-23-3'/></td>
                        <td><Seat id='1-b-23-4'/></td>
                        <td><Seat id='1-b-23-5'/></td>
                        <td><Seat id='1-b-23-6'/></td>
                        <td className={styles.num}>23</td>
                        <td></td>
                        <td></td>
                        <td><Seat id='1-c-23-1'/></td>
                        <td><Seat id='1-c-23-2'/></td>
                        <td><Seat id='1-c-23-3'/></td>
                        <td><Seat id='1-c-23-4'/></td>
                        <td><Seat id='1-c-23-5'/></td>
                        <td><Seat id='1-c-23-6'/></td>
                        <td><Seat id='1-c-23-7'/></td>
                        <td><Seat id='1-c-23-8'/></td>
                        <td><Seat id='1-c-23-9'/></td>
                        <td><Seat id='1-c-23-10'/></td>
                        <td><Seat id='1-c-23-11'/></td>
                        <td><Seat id='1-c-23-12'/></td>
                        <td><Seat id='1-c-23-13'/></td>
                        <td><Seat id='1-c-23-14'/></td>
                        <td><Seat id='1-c-23-15'/></td>
                        <td><Seat id='1-c-23-16'/></td>
                        <td><Seat id='1-c-23-17'/></td>
                        <td></td>
                        <td></td>
                        <td className={styles.num}>23</td>
                        <td><Seat id='1-d-23-1'/></td>
                        <td><Seat id='1-d-23-2'/></td>
                        <td><Seat id='1-d-23-3'/></td>
                        <td><Seat id='1-d-23-4'/></td>
                        <td><Seat id='1-d-23-5'/></td>
                        <td><Seat id='1-d-23-6'/></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td className={`${styles.wall} ${styles.left}`}></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td className={`${styles.wall} ${styles.right}`}></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td className={`${styles.wall} ${styles.right}`}></td>
                    </tr>
                    <tr>
                        <td className={`${styles.wall} ${styles.left}`}></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td className={`${styles.wall} ${styles.left}`}></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td className={`${styles.wall} ${styles.right}`}></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td className={`${styles.wall} ${styles.right}`}></td>
                    </tr>
                    <tr>
                        <td className={`${styles.wall} ${styles.left}`}></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td className={`${styles.wall} ${styles.left}`}></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td colSpan={45} className={styles.floor}>1층</td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td className={`${styles.wall} ${styles.right}`}></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td className={`${styles.wall} ${styles.right}`}></td>
                    </tr>
                    <tr>
                        <td className={`${styles.wall} ${styles.left}`}></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td className={`${styles.wall} ${styles.left}`}></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td className={`${styles.wall} ${styles.right}`}></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td className={`${styles.wall} ${styles.right}`}></td>
                    </tr>
                    <tr>
                        <td className={`${styles.wall} ${styles.left}`}></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td className={`${styles.wall} ${styles.left} ${styles.top}`}></td>
                        <td className={`${styles.wall} ${styles.top}`}></td>
                        <td className={`${styles.wall} ${styles.top}`}></td>
                        <td className={`${styles.wall} ${styles.top}`}></td>
                        <td className={`${styles.wall} ${styles.top}`}></td>
                        <td className={`${styles.wall} ${styles.top}`}></td>
                        <td className={`${styles.wall} ${styles.top}`}></td>
                        <td colSpan="11" className={`${styles.wall} ${styles.top} ${styles.right} ${styles.section}`}>A</td>
                        <td className={`${styles.wall} ${styles.top}`}></td>
                        <td colSpan="10" className={`${styles.wall} ${styles.top} ${styles.section}`}>B</td>
                        <td className={`${styles.wall} ${styles.top}`}></td>
                        <td className={`${styles.wall} ${styles.top}`}></td>
                        <td colSpan="20" className={`${styles.wall} ${styles.top} ${styles.section}`}>C</td>
                        <td className={`${styles.wall} ${styles.top}`}></td>
                        <td className={`${styles.wall} ${styles.top}`}></td>
                        <td colSpan="10" className={`${styles.wall} ${styles.top} ${styles.section}`}>D</td>
                        <td className={`${styles.wall} ${styles.top}`}></td>
                        <td colSpan="11" className={`${styles.section} ${styles.wall} ${styles.top} ${styles.left}`}>E</td>
                        <td className={`${styles.wall} ${styles.top}`}></td>
                        <td className={`${styles.wall} ${styles.top}`}></td>
                        <td className={`${styles.wall} ${styles.top}`}></td>
                        <td className={`${styles.wall} ${styles.top}`}></td>
                        <td className={`${styles.wall} ${styles.top}`}></td>
                        <td className={`${styles.wall} ${styles.right} ${styles.top}`}></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td className={`${styles.wall} ${styles.right}`}></td>
                    </tr>
                    <tr>
                        <td className={`${styles.wall} ${styles.left} ${styles.bottom}`}></td>
                        <td className={`${styles.wall} ${styles.bottom}`}></td>
                        <td className={`${styles.wall} ${styles.bottom}`}></td>
                        <td className={`${styles.wall} ${styles.bottom}`}></td>
                        <td className={`${styles.wall} ${styles.left}`}></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td colSpan="11" className={`${styles.wall} ${styles.right}`}></td>
                        <td></td>
                        <td colSpan="10"></td>
                        <td></td>
                        <td></td>
                        <td colSpan="20"></td>
                        <td></td>
                        <td></td>
                        <td colSpan="10"></td>
                        <td></td>
                        <td colSpan="11" className={`${styles.wall} ${styles.left}`}></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td className={`${styles.wall} ${styles.right}`}></td>
                        <td className={`${styles.wall} ${styles.bottom}`}></td>
                        <td className={`${styles.wall} ${styles.bottom}`}></td>
                        <td className={`${styles.wall} ${styles.bottom}`}></td>
                        <td className={`${styles.wall} ${styles.right} ${styles.bottom}`}></td>
                    </tr>
                    <tr>
                        <td className={`${styles.wall} ${styles.left}`}></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td className={styles.num}>1</td>
                        <td><Seat id='2-a-1-1'/></td>
                        <td><Seat id='2-a-1-2'/></td>
                        <td><Seat id='2-a-1-3'/></td>
                        <td><Seat id='2-a-1-4'/></td>
                        <td><Seat id='2-a-1-5'/></td>
                        <td><Seat id='2-a-1-6'/></td>
                        <td><Seat id='2-a-1-7'/></td>
                        <td><Seat id='2-a-1-8'/></td>
                        <td><Seat id='2-a-1-9'/></td>
                        <td><Seat id='2-a-1-10'/></td>
                        <td className={`${styles.wall} ${styles.right}`}><Seat id='2-a-1-11'/></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td><Seat id='2-b-1-1'/></td>
                        <td><Seat id='2-b-1-2'/></td>
                        <td><Seat id='2-b-1-3'/></td>
                        <td><Seat id='2-b-1-4'/></td>
                        <td className={styles.num}>1</td>
                        <td></td>
                        <td><Seat id='2-c-1-1'/></td>
                        <td><Seat id='2-c-1-2'/></td>
                        <td><Seat id='2-c-1-3'/></td>
                        <td><Seat id='2-c-1-4'/></td>
                        <td><Seat id='2-c-1-5'/></td>
                        <td><Seat id='2-c-1-6'/></td>
                        <td><Seat id='2-c-1-7'/></td>
                        <td><Seat id='2-c-1-8'/></td>
                        <td><Seat id='2-c-1-9'/></td>
                        <td><Seat id='2-c-1-10'/></td>
                        <td><Seat id='2-c-1-11'/></td>
                        <td><Seat id='2-c-1-12'/></td>
                        <td><Seat id='2-c-1-13'/></td>
                        <td><Seat id='2-c-1-14'/></td>
                        <td><Seat id='2-c-1-15'/></td>
                        <td><Seat id='2-c-1-16'/></td>
                        <td><Seat id='2-c-1-17'/></td>
                        <td><Seat id='2-c-1-18'/></td>
                        <td><Seat id='2-c-1-19'/></td>
                        <td><Seat id='2-c-1-20'/></td>
                        <td></td>
                        <td className={styles.num}>1</td>
                        <td><Seat id='2-d-1-1'/></td>
                        <td><Seat id='2-d-1-2'/></td>
                        <td><Seat id='2-d-1-3'/></td>
                        <td><Seat id='2-d-1-4'/></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td className={`${styles.wall} ${styles.left}`}><Seat id='2-e-1-1'/></td>
                        <td><Seat id='2-e-1-2'/></td>
                        <td><Seat id='2-e-1-3'/></td>
                        <td><Seat id='2-e-1-4'/></td>
                        <td><Seat id='2-e-1-5'/></td>
                        <td><Seat id='2-e-1-6'/></td>
                        <td><Seat id='2-e-1-7'/></td>
                        <td><Seat id='2-e-1-8'/></td>
                        <td><Seat id='2-e-1-9'/></td>
                        <td><Seat id='2-e-1-10'/></td>
                        <td><Seat id='2-e-1-11'/></td>
                        <td className={styles.num}>1</td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td className={`${styles.wall} ${styles.right}`}></td>
                    </tr>
                    <tr>
                        <td className={`${styles.wall} ${styles.left}`}></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td className={styles.num}>2</td>
                        <td><Seat id='2-a-2-1'/></td>
                        <td><Seat id='2-a-2-2'/></td>
                        <td><Seat id='2-a-2-3'/></td>
                        <td><Seat id='2-a-2-4'/></td>
                        <td><Seat id='2-a-2-5'/></td>
                        <td><Seat id='2-a-2-6'/></td>
                        <td><Seat id='2-a-2-7'/></td>
                        <td><Seat id='2-a-2-8'/></td>
                        <td><Seat id='2-a-2-9'/></td>
                        <td><Seat id='2-a-2-10'/></td>
                        <td className={`${styles.wall} ${styles.right}`}><Seat id='2-a-2-11'/></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td><Seat id='2-b-2-1'/></td>
                        <td><Seat id='2-b-2-2'/></td>
                        <td><Seat id='2-b-2-3'/></td>
                        <td><Seat id='2-b-2-4'/></td>
                        <td><Seat id='2-b-2-5'/></td>
                        <td><Seat id='2-b-2-6'/></td>
                        <td><Seat id='2-b-2-7'/></td>
                        <td className={styles.num}>2</td>
                        <td></td>
                        <td><Seat id='2-c-2-1'/></td>
                        <td><Seat id='2-c-2-2'/></td>
                        <td><Seat id='2-c-2-3'/></td>
                        <td><Seat id='2-c-2-4'/></td>
                        <td><Seat id='2-c-2-5'/></td>
                        <td><Seat id='2-c-2-6'/></td>
                        <td><Seat id='2-c-2-7'/></td>
                        <td><Seat id='2-c-2-8'/></td>
                        <td><Seat id='2-c-2-9'/></td>
                        <td><Seat id='2-c-2-10'/></td>
                        <td><Seat id='2-c-2-11'/></td>
                        <td><Seat id='2-c-2-12'/></td>
                        <td><Seat id='2-c-2-13'/></td>
                        <td><Seat id='2-c-2-14'/></td>
                        <td><Seat id='2-c-2-15'/></td>
                        <td><Seat id='2-c-2-16'/></td>
                        <td><Seat id='2-c-2-17'/></td>
                        <td><Seat id='2-c-2-18'/></td>
                        <td><Seat id='2-c-2-19'/></td>
                        <td></td>
                        <td></td>
                        <td className={styles.num}>2</td>
                        <td><Seat id='2-d-2-1'/></td>
                        <td><Seat id='2-d-2-2'/></td>
                        <td><Seat id='2-d-2-3'/></td>
                        <td><Seat id='2-d-2-4'/></td>
                        <td><Seat id='2-d-2-5'/></td>
                        <td><Seat id='2-d-2-6'/></td>
                        <td><Seat id='2-d-2-7'/></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td className={`${styles.wall} ${styles.left}`}><Seat id='2-e-2-1'/></td>
                        <td><Seat id='2-e-2-2'/></td>
                        <td><Seat id='2-e-2-3'/></td>
                        <td><Seat id='2-e-2-4'/></td>
                        <td><Seat id='2-e-2-5'/></td>
                        <td><Seat id='2-e-2-6'/></td>
                        <td><Seat id='2-e-2-7'/></td>
                        <td><Seat id='2-e-2-8'/></td>
                        <td><Seat id='2-e-2-9'/></td>
                        <td><Seat id='2-e-2-10'/></td>
                        <td><Seat id='2-e-2-11'/></td>
                        <td className={styles.num}>2</td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td className={`${styles.wall} ${styles.right}`}></td>
                    </tr>
                    <tr>
                        <td className={`${styles.wall} ${styles.left}`}></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td className={styles.num}>3</td>
                        <td></td>
                        <td></td>
                        <td><Seat id='2-a-3-1'/></td>
                        <td><Seat id='2-a-3-2'/></td>
                        <td><Seat id='2-a-3-3'/></td>
                        <td><Seat id='2-a-3-4'/></td>
                        <td><Seat id='2-a-3-5'/></td>
                        <td><Seat id='2-a-3-6'/></td>
                        <td><Seat id='2-a-3-7'/></td>
                        <td><Seat id='2-a-3-8'/></td>
                        <td className={`${styles.wall} ${styles.right}`}><Seat id='2-a-3-9'/></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td><Seat id='2-b-3-1'/></td>
                        <td><Seat id='2-b-3-2'/></td>
                        <td><Seat id='2-b-3-3'/></td>
                        <td><Seat id='2-b-3-4'/></td>
                        <td><Seat id='2-b-3-5'/></td>
                        <td><Seat id='2-b-3-6'/></td>
                        <td><Seat id='2-b-3-7'/></td>
                        <td className={styles.num}>3</td>
                        <td></td>
                        <td><Seat id='2-c-3-1'/></td>
                        <td><Seat id='2-c-3-2'/></td>
                        <td><Seat id='2-c-3-3'/></td>
                        <td><Seat id='2-c-3-4'/></td>
                        <td><Seat id='2-c-3-5'/></td>
                        <td><Seat id='2-c-3-6'/></td>
                        <td><Seat id='2-c-3-7'/></td>
                        <td><Seat id='2-c-3-8'/></td>
                        <td><Seat id='2-c-3-9'/></td>
                        <td><Seat id='2-c-3-10'/></td>
                        <td><Seat id='2-c-3-11'/></td>
                        <td><Seat id='2-c-3-12'/></td>
                        <td><Seat id='2-c-3-13'/></td>
                        <td><Seat id='2-c-3-14'/></td>
                        <td><Seat id='2-c-3-15'/></td>
                        <td><Seat id='2-c-3-16'/></td>
                        <td><Seat id='2-c-3-17'/></td>
                        <td><Seat id='2-c-3-18'/></td>
                        <td><Seat id='2-c-3-19'/></td>
                        <td><Seat id='2-c-3-20'/></td>
                        <td></td>
                        <td className={styles.num}>3</td>
                        <td><Seat id='2-d-3-1'/></td>
                        <td><Seat id='2-d-3-2'/></td>
                        <td><Seat id='2-d-3-3'/></td>
                        <td><Seat id='2-d-3-4'/></td>
                        <td><Seat id='2-d-3-5'/></td>
                        <td><Seat id='2-d-3-6'/></td>
                        <td><Seat id='2-d-3-7'/></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td className={`${styles.wall} ${styles.left}`}><Seat id='2-e-3-1'/></td>
                        <td><Seat id='2-e-3-2'/></td>
                        <td><Seat id='2-e-3-3'/></td>
                        <td><Seat id='2-e-3-4'/></td>
                        <td><Seat id='2-e-3-5'/></td>
                        <td><Seat id='2-e-3-6'/></td>
                        <td><Seat id='2-e-3-7'/></td>
                        <td><Seat id='2-e-3-8'/></td>
                        <td><Seat id='2-e-3-9'/></td>
                        <td></td>
                        <td></td>
                        <td className={styles.num}>3</td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td className={`${styles.wall} ${styles.right}`}></td>
                    </tr>
                    <tr>
                        <td className={`${styles.wall} ${styles.left}`}></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td className={styles.num}>4</td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td><Seat id='2-a-4-1'/></td>
                        <td><Seat id='2-a-4-2'/></td>
                        <td><Seat id='2-a-4-3'/></td>
                        <td><Seat id='2-a-4-4'/></td>
                        <td><Seat id='2-a-4-5'/></td>
                        <td><Seat id='2-a-4-6'/></td>
                        <td className={`${styles.wall} ${styles.right}`}><Seat id='2-a-4-7'/></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td><Seat id='2-b-4-1'/></td>
                        <td><Seat id='2-b-4-2'/></td>
                        <td><Seat id='2-b-4-3'/></td>
                        <td><Seat id='2-b-4-4'/></td>
                        <td><Seat id='2-b-4-5'/></td>
                        <td><Seat id='2-b-4-6'/></td>
                        <td><Seat id='2-b-4-7'/></td>
                        <td><Seat id='2-b-4-8'/></td>
                        <td className={styles.num}>4</td>
                        <td></td>
                        <td><Seat id='2-c-4-1'/></td>
                        <td><Seat id='2-c-4-2'/></td>
                        <td><Seat id='2-c-4-3'/></td>
                        <td><Seat id='2-c-4-4'/></td>
                        <td><Seat id='2-c-4-5'/></td>
                        <td><Seat id='2-c-4-6'/></td>
                        <td><Seat id='2-c-4-7'/></td>
                        <td><Seat id='2-c-4-8'/></td>
                        <td><Seat id='2-c-4-9'/></td>
                        <td><Seat id='2-c-4-10'/></td>
                        <td><Seat id='2-c-4-11'/></td>
                        <td><Seat id='2-c-4-12'/></td>
                        <td><Seat id='2-c-4-13'/></td>
                        <td><Seat id='2-c-4-14'/></td>
                        <td><Seat id='2-c-4-15'/></td>
                        <td><Seat id='2-c-4-16'/></td>
                        <td><Seat id='2-c-4-17'/></td>
                        <td><Seat id='2-c-4-18'/></td>
                        <td><Seat id='2-c-4-19'/></td>
                        <td><Seat id='2-c-4-20'/></td>
                        <td><Seat id='2-c-4-21'/></td>
                        <td className={styles.num}>4</td>
                        <td><Seat id='2-d-4-1'/></td>
                        <td><Seat id='2-d-4-2'/></td>
                        <td><Seat id='2-d-4-3'/></td>
                        <td><Seat id='2-d-4-4'/></td>
                        <td><Seat id='2-d-4-5'/></td>
                        <td><Seat id='2-d-4-6'/></td>
                        <td><Seat id='2-d-4-7'/></td>
                        <td><Seat id='2-d-4-8'/></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td className={`${styles.wall} ${styles.left}`}><Seat id='2-e-4-1'/></td>
                        <td><Seat id='2-e-4-2'/></td>
                        <td><Seat id='2-e-4-3'/></td>
                        <td><Seat id='2-e-4-4'/></td>
                        <td><Seat id='2-e-4-5'/></td>
                        <td><Seat id='2-e-4-6'/></td>
                        <td><Seat id='2-e-4-7'/></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td className={styles.num}>4</td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td className={`${styles.wall} ${styles.right}`}></td>
                    </tr>
                    <tr>
                        <td className={`${styles.wall} ${styles.left}`}></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td className={styles.num}>5</td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td><Seat id='2-a-5-1'/></td>
                        <td><Seat id='2-a-5-2'/></td>
                        <td><Seat id='2-a-5-3'/></td>
                        <td><Seat id='2-a-5-4'/></td>
                        <td><Seat id='2-a-5-5'/></td>
                        <td className={`${styles.wall} ${styles.right}`}><Seat id='2-a-5-6'/></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td><Seat id='2-b-5-1'/></td>
                        <td><Seat id='2-b-5-2'/></td>
                        <td><Seat id='2-b-5-3'/></td>
                        <td><Seat id='2-b-5-4'/></td>
                        <td><Seat id='2-b-5-5'/></td>
                        <td><Seat id='2-b-5-6'/></td>
                        <td><Seat id='2-b-5-7'/></td>
                        <td><Seat id='2-b-5-8'/></td>
                        <td className={styles.num}>5</td>
                        <td></td>
                        <td><Seat id='2-c-5-1'/></td>
                        <td><Seat id='2-c-5-2'/></td>
                        <td><Seat id='2-c-5-3'/></td>
                        <td><Seat id='2-c-5-4'/></td>
                        <td><Seat id='2-c-5-5'/></td>
                        <td><Seat id='2-c-5-6'/></td>
                        <td><Seat id='2-c-5-7'/></td>
                        <td><Seat id='2-c-5-8'/></td>
                        <td><Seat id='2-c-5-9'/></td>
                        <td><Seat id='2-c-5-10'/></td>
                        <td><Seat id='2-c-5-11'/></td>
                        <td><Seat id='2-c-5-12'/></td>
                        <td><Seat id='2-c-5-13'/></td>
                        <td><Seat id='2-c-5-14'/></td>
                        <td><Seat id='2-c-5-15'/></td>
                        <td><Seat id='2-c-5-16'/></td>
                        <td><Seat id='2-c-5-17'/></td>
                        <td><Seat id='2-c-5-18'/></td>
                        <td><Seat id='2-c-5-19'/></td>
                        <td><Seat id='2-c-5-20'/></td>
                        <td></td>
                        <td className={styles.num}>5</td>
                        <td><Seat id='2-d-5-1'/></td>
                        <td><Seat id='2-d-5-2'/></td>
                        <td><Seat id='2-d-5-3'/></td>
                        <td><Seat id='2-d-5-4'/></td>
                        <td><Seat id='2-d-5-5'/></td>
                        <td><Seat id='2-d-5-6'/></td>
                        <td><Seat id='2-d-5-7'/></td>
                        <td><Seat id='2-d-5-8'/></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td className={`${styles.wall} ${styles.left}`}><Seat id='2-e-5-1'/></td>
                        <td><Seat id='2-e-5-2'/></td>
                        <td><Seat id='2-e-5-3'/></td>
                        <td><Seat id='2-e-5-4'/></td>
                        <td><Seat id='2-e-5-5'/></td>
                        <td><Seat id='2-e-5-6'/></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td className={styles.num}>5</td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td className={`${styles.wall} ${styles.right}`}></td>
                    </tr>
                    <tr>
                        <td className={`${styles.wall} ${styles.left}`}></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td className={styles.num}>6</td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td><Seat id='2-a-6-1'/></td>
                        <td><Seat id='2-a-6-2'/></td>
                        <td className={`${styles.wall} ${styles.right}`}><Seat id='2-a-6-3'/></td>
                        <td></td>
                        <td></td>
                        <td><Seat id='2-b-6-1'/></td>
                        <td><Seat id='2-b-6-2'/></td>
                        <td><Seat id='2-b-6-3'/></td>
                        <td><Seat id='2-b-6-4'/></td>
                        <td><Seat id='2-b-6-5'/></td>
                        <td><Seat id='2-b-6-6'/></td>
                        <td><Seat id='2-b-6-7'/></td>
                        <td><Seat id='2-b-6-8'/></td>
                        <td><Seat id='2-b-6-9'/></td>
                        <td className={styles.num}>6</td>
                        <td></td>
                        <td><Seat id='2-c-6-1'/></td>
                        <td><Seat id='2-c-6-2'/></td>
                        <td><Seat id='2-c-6-3'/></td>
                        <td><Seat id='2-c-6-4'/></td>
                        <td><Seat id='2-c-6-5'/></td>
                        <td><Seat id='2-c-6-6'/></td>
                        <td><Seat id='2-c-6-7'/></td>
                        <td><Seat id='2-c-6-8'/></td>
                        <td><Seat id='2-c-6-9'/></td>
                        <td><Seat id='2-c-6-10'/></td>
                        <td><Seat id='2-c-6-11'/></td>
                        <td><Seat id='2-c-6-12'/></td>
                        <td><Seat id='2-c-6-13'/></td>
                        <td><Seat id='2-c-6-14'/></td>
                        <td><Seat id='2-c-6-15'/></td>
                        <td><Seat id='2-c-6-16'/></td>
                        <td><Seat id='2-c-6-17'/></td>
                        <td><Seat id='2-c-6-18'/></td>
                        <td><Seat id='2-c-6-19'/></td>
                        <td><Seat id='2-c-6-20'/></td>
                        <td><Seat id='2-c-6-21'/></td>
                        <td className={styles.num}>6</td>
                        <td><Seat id='2-d-6-1'/></td>
                        <td><Seat id='2-d-6-2'/></td>
                        <td><Seat id='2-d-6-3'/></td>
                        <td><Seat id='2-d-6-4'/></td>
                        <td><Seat id='2-d-6-5'/></td>
                        <td><Seat id='2-d-6-6'/></td>
                        <td><Seat id='2-d-6-7'/></td>
                        <td><Seat id='2-d-6-8'/></td>
                        <td><Seat id='2-d-6-9'/></td>
                        <td></td>
                        <td></td>
                        <td className={`${styles.wall} ${styles.left}`}><Seat id='2-e-6-1'/></td>
                        <td><Seat id='2-e-6-2'/></td>
                        <td><Seat id='2-e-6-3'/></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td className={styles.num}>6</td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td className={`${styles.wall} ${styles.right}`}></td>
                    </tr>
                    <tr>
                        <td className={`${styles.wall} ${styles.left}`}></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td className={`${styles.wall} ${styles.right}`}></td>
                        <td></td>
                        <td><Seat id='2-b-7-1'/></td>
                        <td><Seat id='2-b-7-2'/></td>
                        <td><Seat id='2-b-7-3'/></td>
                        <td><Seat id='2-b-7-4'/></td>
                        <td><Seat id='2-b-7-5'/></td>
                        <td><Seat id='2-b-7-6'/></td>
                        <td><Seat id='2-b-7-7'/></td>
                        <td><Seat id='2-b-7-8'/></td>
                        <td><Seat id='2-b-7-9'/></td>
                        <td><Seat id='2-b-7-10'/></td>
                        <td className={styles.num}>7</td>
                        <td></td>
                        <td><Seat id='2-c-7-1'/></td>
                        <td><Seat id='2-c-7-2'/></td>
                        <td><Seat id='2-c-7-3'/></td>
                        <td><Seat id='2-c-7-4'/></td>
                        <td><Seat id='2-c-7-5'/></td>
                        <td><Seat id='2-c-7-6'/></td>
                        <td><Seat id='2-c-7-7'/></td>
                        <td><Seat id='2-c-7-8'/></td>
                        <td><Seat id='2-c-7-9'/></td>
                        <td><Seat id='2-c-7-10'/></td>
                        <td><Seat id='2-c-7-11'/></td>
                        <td><Seat id='2-c-7-12'/></td>
                        <td><Seat id='2-c-7-13'/></td>
                        <td><Seat id='2-c-7-14'/></td>
                        <td><Seat id='2-c-7-15'/></td>
                        <td><Seat id='2-c-7-16'/></td>
                        <td><Seat id='2-c-7-17'/></td>
                        <td><Seat id='2-c-7-18'/></td>
                        <td><Seat id='2-c-7-19'/></td>
                        <td><Seat id='2-c-7-20'/></td>
                        <td></td>
                        <td className={styles.num}>7</td>
                        <td><Seat id='2-d-7-1'/></td>
                        <td><Seat id='2-d-7-2'/></td>
                        <td><Seat id='2-d-7-3'/></td>
                        <td><Seat id='2-d-7-4'/></td>
                        <td><Seat id='2-d-7-5'/></td>
                        <td><Seat id='2-d-7-6'/></td>
                        <td><Seat id='2-d-7-7'/></td>
                        <td><Seat id='2-d-7-8'/></td>
                        <td><Seat id='2-d-7-9'/></td>
                        <td><Seat id='2-d-7-10'/></td>
                        <td></td>
                        <td className={`${styles.wall} ${styles.left}`}></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td className={`${styles.wall} ${styles.right}`}></td>
                    </tr>
                    <tr>
                        <td className={`${styles.wall} ${styles.left}`}></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td className={`${styles.wall} ${styles.right}`}></td>
                        <td></td>
                        <td><Seat id='2-b-8-1'/></td>
                        <td><Seat id='2-b-8-2'/></td>
                        <td><Seat id='2-b-8-3'/></td>
                        <td><Seat id='2-b-8-4'/></td>
                        <td><Seat id='2-b-8-5'/></td>
                        <td><Seat id='2-b-8-6'/></td>
                        <td><Seat id='2-b-8-7'/></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td className={styles.num}>8</td>
                        <td></td>
                        <td><Seat id='2-c-8-1'/></td>
                        <td><Seat id='2-c-8-2'/></td>
                        <td><Seat id='2-c-8-3'/></td>
                        <td><Seat id='2-c-8-4'/></td>
                        <td><Seat id='2-c-8-5'/></td>
                        <td><Seat id='2-c-8-6'/></td>
                        <td><Seat id='2-c-8-7'/></td>
                        <td><Seat id='2-c-8-8'/></td>
                        <td><Seat id='2-c-8-9'/></td>
                        <td><Seat id='2-c-8-10'/></td>
                        <td><Seat id='2-c-8-11'/></td>
                        <td><Seat id='2-c-8-12'/></td>
                        <td><Seat id='2-c-8-13'/></td>
                        <td><Seat id='2-c-8-14'/></td>
                        <td><Seat id='2-c-8-15'/></td>
                        <td><Seat id='2-c-8-16'/></td>
                        <td><Seat id='2-c-8-17'/></td>
                        <td><Seat id='2-c-8-18'/></td>
                        <td><Seat id='2-c-8-19'/></td>
                        <td><Seat id='2-c-8-20'/></td>
                        <td><Seat id='2-c-8-21'/></td>
                        <td className={styles.num}>8</td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td><Seat id='2-d-8-4'/></td>
                        <td><Seat id='2-d-8-5'/></td>
                        <td><Seat id='2-d-8-6'/></td>
                        <td><Seat id='2-d-8-7'/></td>
                        <td><Seat id='2-d-8-8'/></td>
                        <td><Seat id='2-d-8-9'/></td>
                        <td><Seat id='2-d-8-10'/></td>
                        <td></td>
                        <td className={`${styles.wall} ${styles.left}`}></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td className={`${styles.wall} ${styles.right}`}></td>
                    </tr>
                    <tr>
                        <td colSpan={89} className={`${styles.floor} ${styles.wall} ${styles.left} ${styles.right}`}>2층</td>
                    </tr>
                    <tr>
                        <td colSpan={89} className={`${styles.wall} ${styles.bottom} ${styles.left} ${styles.right}`}></td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}