/*
  localhost:3000/api/post/new 로 요청하면 이 서버 파일이 실행된다.
*/

import { connectDB } from "@/utils/db";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";

export default async function writeHandler(req, res) {
  //POST 요청에는 body라는 곳에 데이터를 담아보냄 (req.body에 input에 입력한 것들이 있음)
  // console.log(req.body);
  let session = await getServerSession(req, res, authOptions); // 로그인 정보
  console.log(session);

  if (req.method === "POST") {
    //body에 담긴 값들을 꺼내고 비어있지 않으면 mongoDB에 insertOne 입력
    //리스트 페이지로 돌려보내기(302, 'url')
    let { title, content } = req.body;

    if (session) {
      req.body.email = session.user?.email; // user? : session안에 user가 없을수도 있으니깐
    }

    if (title && content && req.body.email) {
      try {
        //이 코드로 실행
        const email = req.body.email;
        const client = await connectDB; // 오래 걸리는 작업은 건너뛰고 다음 코드 실행 (-> await으로 기다리게 변경)
        const db = client.db("mydb"); // 데이터베이스 이름
        let result = await db.collection("post").insertOne({ title, content, email });
        return res.redirect(302, "/list"); //끝나면 /list 페이지로 이동시키기
      } catch (err) {
        //try코드 실행하다 에러나면 이쪽으로 즉시 이동
        console.error("POST요청 에러 : ", err);
        return res.status(500).json({ err: "서버기능 오류" });
      }
    } else {
      //빈칸으로 입력해서 요청했을때 (사용자 실수)
      return res.status(400).json({ err: "빈칸은 허용되지 않습니다." });
    }
  } else {
    return res.status(405).json({ error: "Method Not Allowed" }); // post요청 외에는 에러처리
  }
}
