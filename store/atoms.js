import { atom } from "recoil";

//atom({key:, default:})로 새로운 아톰을 만들 수 있다.
// 이때 key는 각 아톰을 구별하는 고유한 식별자이다.
// default는 initial state를 의미한다.
export const nowPageState = atom({
  key: "nowPageState",
  default: 'seat',
});

export const selectItem = atom({
    key: 'selectItem',
    default: []
})

export const nowYm = atom({
    key:'nowYm',
    default:''
})

export const nowYmList = atom({
    key:'nowYmList',
    default: []
})

export const nowSeatList = atom({
    key:'nowSeatList',
    default:[]
})

// 팝업 상태값
export const modalState = atom({
    key:'modalState',
    default:false
})

// 통계 팝업에서 사용될 변수
export const statisName = atom({
    key:'statisName',
    default:''
})

export const statisNum = atom({
    key:'statisNum',
    default:''
})

export const statisSeat = atom({
    key:'statisSeat',
    default:[]
})

export const statisType = atom({
    key:'statisType',
    default:[]
})