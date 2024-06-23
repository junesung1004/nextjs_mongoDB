import { connectDB } from "@/utils/db";
import { ObjectId } from "mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";

// /api/delete/list_item 으로 요청이 들어오면 동작할 함수
export default async function handler(req, res) {
  console.log(req.body);
  if (req.method === "DELETE") {
    try {
      let { id, email } = req.body; // 글목록의 정보
      let session = await getServerSession(req, res, authOptions); // 현재 로그인 정보
      if (session?.user?.email === email || session?.user?.email === "admin123@admin.com") {
        const client = await connectDB; // 오래 걸리는 작업은 건너뛰고 다음 코드 실행 (-> await으로 기다리게 변경)
        const db = client.db("mydb"); // 데이터베이스 이름
        let result = await db.collection("post").deleteOne({ _id: ObjectId.createFromHexString(id) });
        res.status(200).json({ msg: "삭제완료" });
      } else {
        //클라이언트 요청 오류 400
        res.status(400).json({ msg: "삭제는 글 작성자만 할 수 있습니다." });
      }
    } catch (err) {
      //서버 기능 오류 500
      res.status(500).json({ msg: "서버기능 오류" + err });
    }
  } else {
    //클라이언트 실수(400~405)
    res.status(405).json({ msg: "DELETE 요청만 처리합니다" });
  }
}

// 몽고DB API함수(제공해주는 함수)
//  find().toArray() : 다 가져와
//  findOne() : 하나만 가져와
//  updateOne() : 하나 수정해
//  deleteOne() : 하나 삭제해
