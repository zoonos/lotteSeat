'use client'

import style from './modal.module.css';
import { useRecoilState } from "recoil";
import { loadState } from "@/store/atoms";
import { useEffect, useState } from 'react';
export default function LoadModal(){

    const [state, setModalState] = useRecoilState(loadState);

    return(
        <div className={style.modalWrap} style={state ? {display:'flex'} : {display:'none'}}>
            <div className={style.loader}></div>
        </div>
    )
}