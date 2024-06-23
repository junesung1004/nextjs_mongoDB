import { connectDB } from "@/utils/db";
import Link from "next/link";
import React from "react";
import ListItem from "./listItem";

export default async function List() {
  const client = await connectDB; // 오래 걸리는 작업은 건너뛰고 다음 코드 실행 (-> await으로 기다리게 변경)
  const db = client.db("mydb"); // 데이터베이스 이름
  let result = await db.collection("post").find().toArray();

  //_id를 문자열로 변환
  result = result.map((item) => ({
    ...item,
    _id: item._id.toString(),
  }));

  return (
    <div className="list-bg">
      <ListItem result={result} />
    </div>
  );
}

//삭제하기 버튼을 누르면 state를 변경해서 화면을 갱신
//page.js의 기본값은 'use server' : 서버 컴포넌트
//onClick, useState, ... : 클라이언트 컴포넌트에서만 가능 'use client'를 파일 맨위에 적용해야한다
//클라이언트 함수가 필요한 부분은 컴포넌트로 분리
