import { connectDB } from "@/util/db";
import { getNextYm } from "@/util/ym";

export default async function handler(req, res){
    let db = (await connectDB).db('lotte');

    if(req.method === 'GET'){
        // 연월 조회
        try{
            let result = await db.collection('ymList').find().toArray();
            return res.status(200).json(result);
        }
        catch(err){

        }
    }
    if(req.method === 'POST'){
        // 연월 추가
        try{
            // ymList을 조회해서 가장 큰 달의 한달 +를 추가
            let result = await db.collection('ymList').find().toArray();
            console.log(result)
            let ymList = [];
            let sorted;
            result.map((item) => {
                ymList.push(item.ym)
                sorted = ymList.sort();  
            })
            
            let lastYm = sorted[(sorted.length -1)];

            // 연월 리스트 추가
            await db.collection('ymList').insertOne({
                ym:getNextYm(lastYm)
            });

            let seatList = await db.collection('seat').
            find({'data':{$elemMatch : {'ym':lastYm}}}).toArray();

            // 좌석 다음달 추가
            for(let i=0; i<seatList.length; i++){
                let makeData = {
                    ym: getNextYm(lastYm),
                    type: seatList[i].data[0].type,
                    isLotte: seatList[i].data[0].isLotte,
                    isObstruct: seatList[i].data[0].isObstruct,
                    info: null
                }
                console.log(makeData)
                await db.collection('seat').updateOne(
                    {'id':seatList[i].id},
                    {$push:{'data':makeData}}
                )
            }

            res.status(200).json(result)
        }
        catch(err){

        }
    }
}