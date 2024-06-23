//"use client" : 클라이언트 컴포넌트
//"use server" : 서버 컴포넌트(기본값)

// 서버 컴포넌트에선 form 태그로 데이터를 전송 (새로고침)
// 클라이언트 컴포넌트에선 fetch 함수로 데이터를 전송 (즉각반영)

export default function Register() {
  return (
    <>
      <form method="POST" action="/api/auth/signup">
        <label htmlFor="name">이름</label>
        <input id="name" name="name" type="text" placeholder="이름을 입력하세요" />

        <label htmlFor="email">이메일</label>
        <input id="email" name="email" type="text" placeholder="이메일을 입력하세요" />

        <label htmlFor="password">비밀번호</label>
        <input id="password" name="password" type="password" placeholder="비밀번호를 입력하세요" />

        <button type="submit">회원가입</button>
      </form>
    </>
  );
}

//input 태그의 name속성으로 키값이 생성됨
//input 태그의 입력값을 통해 키의 value값이 생성됨
