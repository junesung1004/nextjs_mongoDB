"use client";
import { useEffect, useState } from "react";
//리액트 방식으로 새로고침 없이 state와 ajax 요청(fetch)
import "./comment.css";

export default function Comment({ boardId }) {
  const [comment, setComment] = useState(""); // input창에 입력한 내용
  const [commentList, setCommentList] = useState([]); //데이터 베이스에 저장된 댓글들의 리스트를 보여줄 댓글들

  //페이지가 로딩될때 commentList의 내용을 요청한다
  //useEffect : 로딩될때, 언로딩될때, 갱신될때
  useEffect(() => {
    //서버에 댓글리스트를 요청해서 받아온다
    //받아온 응답을 setCommentList에 담는다
    fetch("/api/comment/list?id=" + boardId)
      .then((res) => res.json())
      .then((result) => {
        setCommentList(result);
      });
  }, []);

  return (
    <div className="comment-container">
      <hr />

      {commentList.length > 0
        ? commentList.map((el, idx) => {
            return <p key={idx}>{el?.content}</p>;
          })
        : null}

      {/* onChange : 무언가가 입력될때마다 발동되는 함수 */}
      <input
        onChange={(e) => {
          setComment(e.target.value);
        }}
        id="comment-input"
      />
      {/* 버튼이 클릭되면 /api/comment/new 에 저장해달라고 요청을 보내자 */}
      <button
        onClick={() => {
          document.getElementById("comment-input").value = "";
          //서버에서 body에 메시지를 보낼 땐 JSON문자열로 보내기
          //보낼 내용 body에 댓글내용(comment) + 게시글id
          fetch("/api/comment/new", { method: "POST", body: JSON.stringify({ comment: comment, boardId: boardId }) })
            .then((res) => {
              if (res.status === 200) {
                return res.json();
              } else {
                return null;
              }
            })
            .then((result) => {
              console.log(result);
              //여기에서 state를 업데이트해서 화면에 반영
              setComment("");
              setCommentList((prev) => [...prev, result]);
            });
        }}
      >
        댓글 입력
      </button>
    </div>
  );
}

//pages/api/comment 폴더 만들고 new.js파일 생성
