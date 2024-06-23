import { connectDB } from "@/utils/db";
import bcrypt from "bcrypt";

//회원가입 요청을 처리할 서버파일
export default async function handler(req, res) {
  // req.body에 받은거를 db에 저장
  try {
    if (req.method === "POST") {
      //비밀번호 암호화(입력한 그대로 db에 저장하지 않고 일정한 규칙으로 변경해서 넣기)
      //npm i bcrypt
      let hash = await bcrypt.hash(req.body.password, 10); //암호화를 한다
      req.body.password = hash;

      let db = (await connectDB).db("mydb");
      await db.collection("user").insertOne(req.body);

      return res.redirect(302, "/api/auth/signin");
    } else {
      res.status(400).json({ error: "method only POST" });
    }
  } catch (error) {
    console.error("회원가입 에러 : ", error);
    res.status(500).json({ err: "signup failed: " + error });
  }
}
