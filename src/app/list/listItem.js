"use client";

import Link from "next/link";
import { useState } from "react";

//'use client'가 적혀있어야
//onClick, useState 등 사용 가능

//클라이언트 컴포넌트 분리
//db에서 받아온 result값을 useState로 관리
export default function ListItem({ result }) {
  //받아온 데이터를 state로 변경 (화면 갱신을 위해서)
  const [listData, setListData] = useState(result);

  return (
    <>
      {listData && listData.length > 0
        ? listData.map((el, idx) => (
            <div key={idx} className="list-item">
              <Link href={"detail/" + el._id}>
                <h4>{el.title}</h4>
                <p>{el.content}</p>
              </Link>
              <Link href={"/edit/" + el._id}>✏️수정</Link>
              <span
                onClick={() => {
                  fetch("/api/delete/list_item", {
                    method: "DELETE",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ id: el._id, email: el.email }),
                  })
                    .then((res) => {
                      //fetch가 완료되면 실행할 코드 -> res에는 서버 응답이 담겨있음
                      // 'use client' 에서 console.log()를 하면 웹페이지 F12에서 확인 가능
                      console.log(res);
                      if (res.status === 200) {
                        //200 성공일 때
                        //기존의 listData에서 item+.id와 일치하는 id를 찾아서 filter
                        //filter() : 입력한 값을 배열에서 찾아 걸러줌
                        setListData((prev) => prev.filter((i) => i._id !== el._id));
                        return res.json(); //then에서 rturn을 하면 다음 then의 매개변수로 옮겨감
                      } else if (res.status === 400) {
                        alert("글 작성자만 삭제할 수 있습니다.");
                        return res.json();
                      } else {
                        // !200 == 즉 성공이 아닐 때
                        //200이 아닐때는 state를 변경하지 않는다.
                        return res.json();
                      }
                    })
                    .then((resJson) => {
                      console.log(resJson);
                    })
                    .catch((error) => {
                      console.error(error); // fetch나 .then을 하다가 예외상황이 발생하면 .catch 실행
                    });
                }}
              >
                🗑️삭제
              </span>
            </div>
          ))
        : null}
    </>
  );
}
