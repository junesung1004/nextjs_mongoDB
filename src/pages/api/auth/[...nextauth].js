import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google"; // 구글 소셜 로그인
import GithubProvider from "next-auth/providers/github"; // 깃허브 소셜 로그인
import CredentialsProvier from "next-auth/providers/credentials"; // 내 db로그인
import { connectDB } from "@/utils/db";
import bcrypt from "bcrypt"; // npm i bcrypt (비밀번호 암복호화 라이브러리)

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: "", //구글 클라이언트 id...
      clientSecret: "", //구글 클라이언트 보안 비밀번호
    }),
    GithubProvider({
      clientId: "", //깃허브 클라이언트 id
      clientSecret: "", //깃허브 클라이언트 보안 비밀번호
    }),
    CredentialsProvier({
      //회원가입한 아이디로 로그인
      name: "credentials",
      credentials: {
        //ui만들기
        email: { label: "email", type: "text" },
        password: { label: "password", type: "password" },
      },
      //로그인 시도 시 동작할 함수
      async authorize(credentials) {
        // mongoDB에 접속해서 해당 이메일과 비밀번호가 있는지 찾고
        // 만약에 찾았으면 그 유저정보를 return
        const client = await connectDB; // 오래 걸리는 작업은 건너뛰고 다음 코드 실행 (-> await으로 기다리게 변경)
        const db = client.db("mydb"); // 데이터베이스 이름
        let user = await db.collection("user").findOne({ email: credentials.email }); //이메일이 있는지 확인
        //findOne() : 조건에 맞는 것을 찾아서 object형식으로 반환 / 못찾으면 null
        if (!user) {
          console.log("일치하는 이메일이 없습니다.");
          return null; // 못찾았거나 유저정보 안줌
        }

        // 비밀번호를 bcrypt로 암호화 했기 때문에 복호화해서 비교 = compare로 비교한다.
        const checkPassword = await bcrypt.compare(credentials.password, user.password);
        if (!checkPassword) {
          console.log("비밀번호가 일치하지 않습니다..");
          return null; //비밀번호 틀렸으니 유저정보 인증
        }

        // 이메일도 찾았고 비밀번호도 맞으니깐 유저정보 줌
        return user;
      },
    }),
  ],
  callbacks: {
    //로그인 방식에 따라서 다르게 처리 (웹 보안 로그인 방식 2가지)
    jwt: async ({ token, user }) => {
      // 토큰방식 로그인(Json Web Token 압축정보)
      if (user) {
        token.user = {};
        token.user.name = user.name;
        token.user.email = user.email;
      }
      return token; // name과 email을 반환
    },
    session: async ({ session, token }) => {
      // 세션방식 로그인(서버에서 보관하는 사용자정보 이용)
      session.user = token.user;
      return session;
    },
  },

  //로그인 유지 기간
  session: {
    strategy: "jwt",
    maxAge: 1 * 24 * 60 * 60, // 1일
  },

  secret: "anything",
};

export default NextAuth(authOptions);

//소셜로그인 설정
//npm install next-auth

/*
  구글로그인 (2024.06 기준)

  https://console.cloud.google.com/ -> API 및 서비스 -> OAuth 동의 화면 (External 버튼 클릭)
  
  사용자 인증 정보 -> OAuth 2.0 클라이언트 생성 -> 웹 애플리케이션 선택 -> 이름 입력 -> 승인된 리디렉션 URL 추가
  http://localhost:3000/api/auth/callback/google --> 입력 후 만들기

  클라이언트ID와 클라이언트 보안 비밀번호 메모해놓기


*/

//-----------------------

/*
  깃허브 로그인 (2024.06 기준)

  github 로그인 -> 우측 프로필 아이콘 클릭 ->
  Settings -> Developer settings -> OAuth Apps -> 
  Register a new application 혹은 new oauth app -> application name 입력 ->
  https://localhost:3000/ 입력 (실제 사이트도 있으면 실제 사이트 URL로 추가하기)
  -> Generate a new client secret 버튼 클릭
  클라이언트 ID와 클라이언트 비밀번호 메모해놓기
  
  
  */
