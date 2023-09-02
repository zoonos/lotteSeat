'use client'

import { selectItem } from "@/store/atoms"
import { useEffect } from "react";
import { useRecoilState } from "recoil"

export default function SelectZone(){
    const [item, setItem] = useRecoilState(selectItem);

    useEffect(() => {
        setItem([]);
    },[])

    return(
        <div className="selectZone">
            <div className="label">선택된 좌석</div>
            <div className="seatZone">
                {item.map((item, idx) => {
                    return(
                        <div 
                            key={idx}
                            style={{marginBottom:5, textTransform:'uppercase'}}
                        >{item}</div>
                    )
                })}
            </div>
        </div>
    )
}