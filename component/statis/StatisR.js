'use client'

import {SearchInput} from "@/component/input/input";
import { loadState, nowYm } from "@/store/atoms";
import { useEffect, useState } from "react"
import { useRecoilState } from "recoil";
import { statisName, statisNum, statisSeat, modalState, statisType } from "@/store/atoms";

export default function StatisL(){
    const [ym, setYm] = useRecoilState(nowYm);
    const [data, setData] = useState([]);
    const [viewData, setViewData] = useState([]);
    const [search, setSearch] = useState('');
    const [laod, setLoad] = useRecoilState(loadState);

    useEffect(() => {
        setLoad(true);
        fetch('/api/statis',{method:'POST', body: ym}).then(r=>r.json())
        .then((result) => {
            setData(result);
            setViewData(result);
            setSearch('');
            setLoad(false);
        })
    },[ym])

    useEffect(() => {
        if(search !== ''){
            setViewData(data.filter(filtered))
        } else {
            setViewData(data);
        }
    },[search])

    function filtered(el){
        if (el.name.includes(search)) {
            return true;
        }
    }

    const [name, setName] = useRecoilState(statisName);
    const [num, setNum] = useRecoilState(statisNum);
    const [seat, setSeat] = useRecoilState(statisSeat);
    const [type, setType] = useRecoilState(statisType);
    const [state, setModalState] = useRecoilState(modalState);

    function clickTr(name,num,seat, type){
        setModalState(true);
        setName(name);
        setNum(num);
        setSeat(seat);
        setType(type)
    }

    const onChange = (e) => {
        setSearch(e.target.value)
    }

    return(
        <>
            <div
                style={{display:'flex', justifyContent:'flex-end', marginBottom: 10}}
            >
                <SearchInput
                    value={search}
                    onChange={onChange}
                />
            </div>
            <div className="searchList">
                <table>
                    <thead>
                        <tr>
                            <th width='33%'>이름</th>
                            <th width='33%'>전화번호</th>
                            <th width='33%'>예약 좌석</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            viewData.length ? 
                            viewData.map((item, idx) => {
                                return(
                                    <tr key={idx} onClick={()=>{clickTr(item.name, item.number, item.seat, item.type)}}>
                                        <td>{item.name}</td>
                                        <td>{item.number}</td>
                                        <td>총 {item.seat.length}장</td>
                                    </tr>
                                )
                            }) : 
                            <tr>
                                <td colSpan={3}>예약자가 없습니다.</td>
                            </tr>
                        }
                    </tbody>
                </table>
            </div>
        </>
    )
}