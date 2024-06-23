import Image from "next/image";
import styles from "./page.module.css";
import { connectDB } from "../utils/db";

export default async function Home() {
  const client = await connectDB; // 오래 걸리는 작업은 건너뛰고 다음 코드 실행 (-> await으로 기다리게 변경)
  const db = client.db("mydb"); // 데이터베이스 이름
  let result = await db.collection("post").find().toArray();
  console.log("result : ", result);

  return (
    <div>
      <p>{result[0]?.title}</p>
      <p>{result[0]?.content}</p>
    </div>
  );
}

//layout.js : page.js를 감싸고 있는 main페이지
//app -> page.js : Home페이지
//global.css : layout.js에 연결된 css
//page.moule.css : page.js에 연결된 css

//app 폴더가 'http://localhost:3000/'
//http://localhost:3000/list 경로를 설정하려면 app 폴더에 list폴더를 만들고 page.js 파일을 만들면 자동으로 경로 설정이 된다.

// 배포하려면 npm run build
// build 폴더의 내용을 클라우드(AWS, vercel)에 업로드 하고 npm run start
