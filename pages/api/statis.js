import { connectDB } from "@/util/db";

export default async function handler(req, res){
    let db = (await connectDB).db('lotte');

    if(req.method === 'GET'){
        // 통계 조회
        try{
            let result = await db.collection('seat').
            find({'data':{$elemMatch : {'ym':req.query.ym}}}).toArray();

            function filterArr(el){
                if(el.ym === req.query.ym)  {
                    return true;
                }
            }

            result.map((item) => {
                item.data = item.data.filter(filterArr);
                return item;
            })

            let r = {
                seat: result.filter((item) => (item.data[0].type === 'R') && (item.data[0].isLotte === false)).length,
                info: result.filter((item) => (item.data[0].type === 'R') && (item.data[0].isLotte === false) && (item.data[0].info !== null)).length
            }
            let rl = {
                seat: result.filter((item) => (item.data[0].type === 'R') && (item.data[0].isLotte === true)).length,
                info: result.filter((item) => (item.data[0].type === 'R') && (item.data[0].isLotte === true) && (item.data[0].info !== null)).length
            }
            let s = {
                seat: result.filter((item) => (item.data[0].type === 'S') && (item.data[0].isLotte === false)).length,
                info: result.filter((item) => (item.data[0].type === 'S') && (item.data[0].isLotte === false) && (item.data[0].info !== null)).length
            }
            let sl = {
                seat: result.filter((item) => (item.data[0].type === 'S') && (item.data[0].isLotte === true)).length,
                info: result.filter((item) => (item.data[0].type === 'S') && (item.data[0].isLotte === true) && (item.data[0].info !== null)).length
            }
            let a = {
                seat: result.filter((item) => (item.data[0].type === 'A') && (item.data[0].isLotte === false)).length,
                info: result.filter((item) => (item.data[0].type === 'A') && (item.data[0].isLotte === false) && (item.data[0].info !== null)).length
            }
            let al = {
                seat: result.filter((item) => (item.data[0].type === 'A') && (item.data[0].isLotte === true)).length,
                info: result.filter((item) => (item.data[0].type === 'A') && (item.data[0].isLotte === true) && (item.data[0].info !== null)).length
            }
            let b = {
                seat: result.filter((item) => (item.data[0].type === 'B') && (item.data[0].isLotte === false)).length,
                info: result.filter((item) => (item.data[0].type === 'B') && (item.data[0].isLotte === false) && (item.data[0].info !== null)).length
            }
            let bl = {
                seat: result.filter((item) => (item.data[0].type === 'B') && (item.data[0].isLotte === true)).length,
                info: result.filter((item) => (item.data[0].type === 'B') && (item.data[0].isLotte === true) && (item.data[0].info !== null)).length
            }
            let c = {
                seat: result.filter((item) => (item.data[0].type === 'C') && (item.data[0].isLotte === false)).length,
                info: result.filter((item) => (item.data[0].type === 'C') && (item.data[0].isLotte === false) && (item.data[0].info !== null)).length
            }
            let cl = {
                seat: result.filter((item) => (item.data[0].type === 'C') && (item.data[0].isLotte === true)).length,
                info: result.filter((item) => (item.data[0].type === 'C') && (item.data[0].isLotte === true) && (item.data[0].info !== null)).length
            }
            let hold = {
                seat: result.filter((item) => (item.data[0].type === 'HOLD')).length,
                info: result.filter((item) => (item.data[0].type === 'HOLD') && (item.data[0].info !== null)).length
            }
            let wheel = {
                seat: result.filter((item) => (item.data[0].type === 'WHEEL')).length,
                info: result.filter((item) => (item.data[0].type === 'WHEEL') && (item.data[0].info !== null)).length
            }
            let dead = {
                seat: result.filter((item) => (item.data[0].type === 'DEAD')).length,
                info: result.filter((item) => (item.data[0].type === 'DEAD') && (item.data[0].info !== null)).length
            }
            let camera = {
                seat: result.filter((item) => (item.data[0].type === 'CAMERA')).length,
                info: result.filter((item) => (item.data[0].type === 'CAMERA') && (item.data[0].info !== null)).length
            }
            let nothing = {
                seat: result.filter((item) => (item.data[0].type === '')).length,
                info: result.filter((item) => (item.data[0].type === '') && (item.data[0].info !== null)).length
            }

            let total = {
                seat: result.length, 
                info: result.filter((item) => item.data[0].info !== null).length
            };

            let StatisResult = {
                'r': r,
                'rl':rl,
                's':s,
                'sl':sl,
                'a':a,
                'al':al,
                'b':b,
                'bl':bl,
                'c':c,
                'cl':cl,
                'hold':hold,
                'wheel':wheel,
                'dead':dead,
                'camera':camera,
                'nothing':nothing,
                'total':total
            }

            return res.status(200).json(StatisResult);
        }
        catch(err){

        }
    }
    if(req.method === 'POST'){
        // 예약자 조회
        try{
            let result = await db.collection('seat').
            find({'data':{$elemMatch : {'ym':req.body}}}).toArray();

            function filterArr(el){
                if(el.ym === req.body)  {
                    return true;
                }
            }

            result.map((item) => {
                item.data = item.data.filter(filterArr);
                return item;
            })

            console.log(result)

            // 필터링
            result = result.filter((item) => item.data[0].info !== null);

            let list=[];

            result.map((item) => {
                let obj = {
                    name: item.data[0].info.name,
                    number: item.data[0].info.number,
                    seat: [item.id],
                    type: [item.data[0].type]
                }
                let match = list.find((e) => (e.name === obj.name) && (e.number === obj.number));
                if(match){
                    match.seat.push(item.id);
                    match.type.push(item.data[0].type);
                } else {
                    list.push(obj);
                }
            })

            return res.status(200).json(list);
        } 
        catch(err){

        }
    }

}