'use client'

import React, { useRef } from 'react'
import {LoginInput} from "@/component/input/input";
import {LoginBtn, SnsBtn} from "@/component/button/button";
import styles from './Login.module.css';
import { signIn } from 'next-auth/react'

export default function Login(){

    const emailRef = useRef(null)
    const passwordRef = useRef(null)

    const handleSubmit = async () => {
        // console.log(emailRef.current)
        // console.log(passwordRef.current)
    
        const result = await signIn("credentials", {
            id: emailRef.current,
            password: passwordRef.current,
            redirect: true,
            callbackUrl: "/",
        });
    }
    return(
        <div className={styles.wrap}>
            <div className={styles.loginWrap}>
                <img className={styles.logo} src='/logo.png' style={{marginBottom: 30}}/>
                <LoginInput label='아이디' type="text" reff={emailRef} id='id' onChange={(e) => {
                    emailRef.current = e.target.value
                }}/>
                <LoginInput label='비밀번호' type="password" reff={passwordRef} id='password' onChange={(e) => {
                    passwordRef.current = e.target.value
                }}/>
                <LoginBtn onClick={handleSubmit}/>
                {/* <hr/>
                <div className={styles.snsWrap}>
                    <SnsBtn snsType='naver'/>
                    <SnsBtn snsType='kakao'/>
                </div> */}
            </div>
        </div>
    )
}