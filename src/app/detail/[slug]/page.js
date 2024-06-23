import { connectDB } from "@/utils/db";
import { ObjectId } from "mongodb";

// localhos : t, params:3000/detail/1  경로
// localhost:3000/detail/2  경로
// localhost:3000/detail/3  경로
// slug : 내가 이동한 url의 값
//[폴더] : 동적 route(URL) 자동 생성
//어떤 항목에 대해 열린 페이지인지 알아야 상세내용을 보여줌

//URL마다 다른 내용이 보여야 하기 때문에 {parmas}로 매개변수를 받는다
export default async function Detail({ params }) {
  const client = await connectDB; // 오래 걸리는 작업은 건너뛰고 다음 코드 실행 (-> await으로 기다리게 변경)
  const db = client.db("mydb"); // 데이터베이스 이름
  let result = await db.collection("post").findOne({ _id: ObjectId.createFromHexString(params.slug) }); //findOne : 하나만 가져옴
  console.log("result : ", result);
  console.log("params : ", params);

  return (
    <div>
      <h4>디테일 페이지 입니다.</h4>
      <h4>{result.title}</h4>
      <p>{result.content}</p>
    </div>
  );
}
