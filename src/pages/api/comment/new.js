import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import { ObjectId } from "mongodb";
import { connectDB } from "@/utils/db";

//  api/comment/new 로 요청하면 받을 api서버(node.js기반)
export default async function handler(req, res) {
  //POST 방식으로 요청이 들어오면
  if (req.method === "POST") {
    console.log(req.body); // 프론트에서 어떤 메시지를 보내왔는지?
    //res.status(200).json({ msg: "받았음" });

    //댓글을 db에 저장
    /*
    1. 댓글내용 
    2. 게시글id 
    3. 사용자의 이메일
    4. mydb 데이터베이스 안에 comment 컬렉션(폴더)로 저장
    */

    //json문자열을 해체해서 사용한다 (자바스크립트는 object 형태로 해체가 됨)
    let reqObject = JSON.parse(req.body); //JSON규칙의 문자열 -> object 자료형
    console.log(reqObject);

    //현재 로그인한 정보(로그인 안되어있으면 session이 null)  -> 사용자 이메일
    let session = await getServerSession(req, res, authOptions);
    console.log(session);

    if (session !== null) {
      let insertItem = {
        content: reqObject.comment,
        parent: ObjectId.createFromHexString(reqObject.boardId),
        email: session.user?.email,
      };

      //insertOne
      try {
        const db = (await connectDB).db("mydb");
        let result = await db.collection("comment").insertOne(insertItem);
        console.log("댓글 입력 성공");
        res.status(200).json(insertItem);
      } catch (err) {
        console.error("댓글 입력 실패 :", err);
        res.status(500).json({ err: err });
      }
    } else {
      res.status(400).json({ err: "로그인이 안되어있습니다." });
    }
  }
}
