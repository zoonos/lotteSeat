import { connectDB } from "@/util/db";

export default async function handler(req, res){
    let db = (await connectDB).db('lotte');

    if(req.method === 'GET'){
        // 좌석 조회
        try{
            let result = await db.collection('seat').
            find(
                {'data':{$elemMatch : {'ym':req.query.ym}}}
            ).toArray();

            function filterArr(el){
                if(el.ym === req.query.ym)  {
                    return true;
                }
            }

            result.map((item) => {
                item.data = item.data.filter(filterArr);
                return item;
            })

            // console.log(result[0])

            return res.status(200).json(result);
        }
        catch(err){

        }
    }
    if(req.method === 'POST'){
        // 좌석 등록
        try{
            let parseData = JSON.parse(req.body);
            let setData = {
                'name':parseData.name, 
                'number': parseData.number
            }

            console.log(setData);

            for(let i=0; i<parseData.id.length; i++){
                let result = await db.collection('seat').updateOne(
                    {
                        'id':parseData.id[i],
                        'data':{$elemMatch : {'ym' : parseData.ym}}
                    },
                    {$set:{'data.$.info':setData}}  
                );
    
                console.log(result)
            }


            res.status(200).json(result)
        } catch (err){
            console.log(err)
        }
    }
    if(req.method === 'DELETE'){
        // 좌석 예약정보 삭제
        try{
            let parseData = JSON.parse(req.body);
            console.log(req.body)
            console.log(parseData.id)
            console.log(parseData.ym)
            for(let i=0; i<parseData.id.length; i++){
                let result = await db.collection('seat').updateOne(
                    {
                        'id':parseData.id[i],
                        'data':{$elemMatch : {'ym' : parseData.ym}}
                    },
                    {$set:{'data.$.info':null}}
                )
                console.log(result)
            }

            return res.status(200).json(result);
        } catch (err){
            
        }
    }
    if(req.method === 'PUT'){
        // 좌석 설정 변경
        try{
            let parseData = JSON.parse(req.body);
            console.log(req.body)
            console.log(parseData)

            for(let i=0; i<parseData.id.length; i++){
                let result = await db.collection('seat').updateOne(
                    {
                        'id':parseData.id[i],
                        'data':{$elemMatch : {'ym' : parseData.ym}}
                    },
                    {$set:{'data.$.type':parseData.type, 'data.$.isLotte': Boolean(Number(parseData.isLotte)), 'data.$.isObstruct':Boolean(Number(parseData.isObs))}}
                )
                console.log(result)
            }

            // return res.status(200).json(result);
        } catch (err){
            
        }
    }

}