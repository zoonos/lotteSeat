function getYmList(ymList){
    let tempArr = [];
    let sorted;
    ymList.map((item) => {
        tempArr.push(item.ym);
        sorted = tempArr.sort();
    })
    return sorted;
}

function getLastYm(ymList){
    let arr = getYmList(ymList);
    return arr[(arr.length - 1)];
}

function getNextYm(ym){
    let year = Number(ym.split('-')[0]);
    let month = Number(ym.split('-')[1]);

    let nextY, nextM;

    nextY = year;
    nextM = month + 1;

    if(nextM === 13){
        nextY = nextY + 1;
        nextM = 1;
    }
    (nextM < 10) && (nextM = '0'+nextM);

    return (nextY+'-'+nextM);
}

function getPrevYm(ym){
    let year = Number(ym.split('-')[0]);
    let month = Number(ym.split('-')[1]);

    let prevY, prevM;

    prevY = year;
    prevM = month - 1;

    if(prevM === 0){
        prevY = prevY - 1;
        prevM = 12;
    }
    (prevM < 10) && (prevM = '0'+prevM);

    return (prevY+'-'+prevM);
}

export {getYmList, getLastYm, getNextYm, getPrevYm}