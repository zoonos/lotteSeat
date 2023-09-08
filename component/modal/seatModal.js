'use client'

import style from './modal.module.css';
import { useRecoilState } from "recoil";
import { modalState, nowYm, selectItem, nowSeatList } from "@/store/atoms";
import { Input } from '../input/input';
import { Button } from '../button/button';
import { useEffect, useState } from 'react';
import { oninputPhone } from '@/util/input';

export default function SeatModal(){

    const [state, setModalState] = useRecoilState(modalState);
    const [item, setItem] = useRecoilState(selectItem);
    const [ym, setYm] = useRecoilState(nowYm);
    const [seatList, setSeatList] = useRecoilState(nowSeatList);

    //객체를 업데이트하기위해 useState안에 객체를 사용
    const [inputs, setInputs] = useState({  
        name: '',
        number: '',
    })

    //값을 가져오기 위해 inputs에 name으로 가져왔다
    const { name, number } = inputs  

    const onChange = (e) => {
        //input에 name을 가진 요소의 value에 이벤트를 걸었다
        const { name, value } = e.target   
 
        // 변수를 만들어 이벤트가 발생했을때의 value를 넣어줬다
        const nextInputs = {            
        //스프레드 문법으로 기존의 객체를 복사한다.
            ...inputs,  
            [name]: value,
         }

        if(e.target.name === 'number'){
            const regex = /^[0-9\b -]{0,13}$/;
            if (regex.test(e.target.value)) {
                setInputs(nextInputs);
            }
        } else {
            //만든 변수를 seInput으로 변경해준다.
            setInputs(nextInputs)       
        }
    }

    useEffect(()=>{
        if (number.length === 11) {
            setInputs({
                name : name,
                number: number.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3'),
            });
          } else if (number.length === 13) {
            setInputs({
                name: name,
                number: number
              //하이픈이 입력되면 공백으로 변경되고 하이픈이 다시 생성됨
                .replace(/-/g, '')
                .replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3'),
            });
          }
    },[number])

    return(
        <div className={style.modalWrap} style={state ? {display:'flex'} : {display:'none'}}>
            <div className={style.modalCont}>
                <div className={style.close} onClick={() => {
                    setModalState(false);
                    setInputs({name:'', number:''});
                }}></div>
                <div className={style.contWrap}>
                    <div className={style.title}>예약 하기</div>
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
                        예약자 이름
                    </div>
                    <div style={{marginBottom: 20}}>
                        <Input 
                            name='name' placeholder='예약자 이름을 입력하세요.'
                            value={name}
                            onChange={onChange}
                        />
                    </div>
                    <div className={style.section}>
                        예약자 번호
                    </div>
                    <div style={{marginBottom: 20}}>
                        <Input 
                            name='number' placeholder='예약자 번호를 입력하세요.'
                            value={number}
                            onChange={onChange}
                            maxLength={13}
                        />
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
                            style={{marginRight:20, backgroundColor:'#F15F5F'}}
                            onClick={()=>{
                                fetch('/api/seat', {method:'DELETE', body: JSON.stringify({id:item, ym:ym})})
                                .then(setModalState(false))
                                .then(alert('예약 내용이 삭제되었습니다.'))
                                .then(
                                    fetch('/api/seat?ym=' + ym).then(r=>r.json())
                                    .then((result) => {
                                        result = result.map((a)=>{
                                            a._id = a._id.toString();
                                            return a
                                        })
                                        setSeatList(result);
                                        setItem([]);
                                        setInputs({name:'', number:''});
                                    })
                                )
                            }}
                        >삭제하기</Button>
                        <Button
                            onClick={()=>{
                                fetch('/api/seat', {method: 'POST', body: JSON.stringify({id:item, ym:ym, name: name, number: number })})
                                .then(setModalState(false))
                                .then(alert('예약 내용이 저장되었습니다.'))
                                .then(
                                    fetch('/api/seat?ym=' + ym).then(r=>r.json())
                                    .then((result) => {
                                        result = result.map((a)=>{
                                            a._id = a._id.toString();
                                            return a
                                        })
                                        setSeatList(result);
                                        setItem([]);
                                        setInputs({name:'', number:''});
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