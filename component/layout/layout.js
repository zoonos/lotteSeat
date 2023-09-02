'use client'

import styles from './layout.module.css';
import {LogoutBtn, PrevBtn, NextBtn} from '@/component/button/button';
import Link from 'next/link';

import { useRecoilState } from 'recoil';
import { nowPageState, nowYm, nowYmList } from '@/store/atoms';
import { useEffect } from 'react';

import { getYmList, getLastYm } from '@/util/ym';


// import { useRouter } from 'next/router';

function Header(props){
    return(
        <div className={styles.header}>
            <div>
                <img src='/logo.png'/>
            </div>
            <div>
                {/* <img src={props.user?.image} className={styles.profile}/> */}
                <div className={styles.user}>{props.user?.name} 님</div>
                <LogoutBtn/>
            </div>
        </div>
    )
}
  
function Nav(props){
    const [nowPage, setNowPageState] = useRecoilState(nowPageState);

    return(
        <div className={styles.nav}>
            <ul>
                <Link href={`/`}>
                    <li className={(nowPage === 'seat') ? styles.active : ''}
                        onClick={()=>{
                            setNowPageState('seat');
                            // Router.push('/');
                        }}
                    >좌석 배치</li>
                </Link>
                <Link href={`/page/statis`}>
                    <li className={(nowPage === 'statis') ? styles.active : ''}
                        onClick={()=>{
                            setNowPageState('statis');
                            // Router.push('/page/statis');
                        }}
                    >통계</li>
                </Link>
                <Link href={`/page/set`}>
                    <li className={(nowPage === 'set') ? styles.active : ''}
                        onClick={()=>{
                            setNowPageState('set');
                            // Router.push('/page/statis');
                        }}
                    >좌석 설정</li>
                </Link>
            </ul>
        </div>
    )
}
  
function ContTitle(props){
    const [nowPage, setNowPageState] = useRecoilState(nowPageState);
    let title = nowPage

    switch(nowPage){
        case 'seat':
            title = '좌석 배치';
            break;
        case 'statis':
            title = '통계';
            break;
        case 'set':
            title = '좌석 설정';
            break;
    }

    return(
        <div className={styles.title}>{title}</div>
    )
}

function YearMonth(props){
    const [ym, setYm] = useRecoilState(nowYm);
    const [ymList, setYmList] = useRecoilState(nowYmList);

    useEffect(()=>{
        // 처음 로드 시 연도 월 리스트 받아서 마지막 부분 세팅
        fetch('/api/ymList').then(r=>r.json())
        .then((result) => {

            setYmList(getYmList(result));
            setYm(getLastYm(result));
        })
    },[])

    return(
        <div className={styles.yearMonth}>
                <PrevBtn/>
                <div className={styles.now}>{ym.split('-')[0]}년 {ym.split('-')[1]}월</div>
                <NextBtn/>
        </div>
    )
}
  
function Footer(){
    return(
        <div className={styles.footer}>
            dev by zoonos
        </div>
    )
}

export { Header, Nav, ContTitle, YearMonth, Footer }