"use client";
import Link from "next/link";
//onClick, fetch, useState 를 사용하려면 : 'use client'  명시를 해줘야함

import "./LoginBtn.css";
import { signIn, signOut, useSession } from "next-auth/react";

export default function LoginBtn({ login }) {
  console.log("login : ", login);
  return (
    <>
      {!login ? (
        <button
          className="user-signup"
          onClick={() => {
            signIn();
          }}
        >
          Login
        </button>
      ) : (
        <>
          <button
            className="user-signup"
            onClick={() => {
              signOut();
            }}
          >
            logout
          </button>
        </>
      )}

      {!login ? (
        <Link href={"/register"} className="user-signup">
          회원가입
        </Link>
      ) : (
        <span>{login?.user?.name}</span>
      )}
    </>
  );
}
