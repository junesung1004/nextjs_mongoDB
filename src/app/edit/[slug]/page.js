//id를 받아와서 그 아아디로 db에서 검색해서 보여줌
//기존의 내용을 먼저 보여줌
//수정하기 버튼을 누르면 수정하는 페이지로 post요청

import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { connectDB } from "@/utils/db";
import { ObjectId } from "mongodb";
import { getServerSession } from "next-auth";

export default async function EditPage({ params }) {
  //{params} : 동적url의 값을 받아오기 위해
  //params.slug : edit/ 뒤에 입력한 url
  console.log(params.slug);
  //params.slug를 사용해서 db에서 검색을 하고
  //input의 기본값에 세팅한다

  let session = await getServerSession(authOptions); // 현재 로그인 정보를 가져온다
  if (session) {
    const client = await connectDB; // 오래 걸리는 작업은 건너뛰고 다음 코드 실행 (-> await으로 기다리게 변경)
    const db = client.db("mydb"); // 데이터베이스 이름
    let result = await db.collection("post").findOne({ _id: ObjectId.createFromHexString(params.slug) });
    //find().toArray() : 전체 다 가져오기
    //findOne() : 하나만 가져오기

    //로그인한 이메일이 글의 이메일과 동일한지 체크
    if (session.user?.email === result.email || session.user?.email === "admin123@admin.com") {
      const resultIdString = result._id.toString();
      return (
        <div className="write-container">
          <h4>수정페이지</h4>
          <form action="/api/post/edit" method="POST">
            <input type="hidden" name={"id"} defaultValue={resultIdString} />
            <input name="title" placeholder="글제목" defaultValue={result.title} />
            <input name="content" placeholder="글내용" defaultValue={result.content} />
            <button type="submit">수정하기</button>
          </form>
        </div>
      );
    } else {
      return <div>글 수정은 작성자만 가능해요</div>;
    }
  } else {
    return <div>글 수정은 작성자만 가능해요</div>;
  }
}

// GET : 받아올때
// POST : 입력할때 (또는 너무 길게 받아올때)
// input 태그의 name이 key값이 됨 (서버에서 받는 키값)
// {id: '입력값0', title : '입력값1', content: '입력값2'}
