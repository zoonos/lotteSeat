import { connectDB } from "@/util/db";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import NextAuth from "next-auth";
import KakaoProvider from "next-auth/providers/kakao";
import NaverProvider from "next-auth/providers/naver";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from 'bcrypt';

export const authOptions = {
  providers: [
    // KakaoProvider({
    //   clientId: process.env.KAKAO_CLIENT_ID,
    //   clientSecret: process.env.KAKAO_CLIENT_SECRET
    // }),
    // NaverProvider({
    //   clientId: process.env.NAVER_CLIENT_ID,
    //   clientSecret: process.env.NAVER_CLIENT_SECRET
    // }),
    CredentialsProvider({
      //1. 로그인페이지 폼 자동생성해주는 코드 
      name: "credentials",
        credentials: {
          id: { label: "아이디", type: "text", placeholder: "아이디를 입력해주세요." },
          password: { label: "비밀번호", type: "password", placeholder: "비밀번호를 입력해주세요." },
      },

      //2. 로그인요청시 실행되는코드
      //직접 DB에서 아이디,비번 비교하고 
      //아이디,비번 맞으면 return 결과, 틀리면 return null 해야함
      async authorize(credentials) {
        console.log(credentials)
        let db = (await connectDB).db('lotte');
        let user = await db.collection('user_cred').findOne({id : credentials.id})
        if (!user) {
          console.log('해당 아이디는 없음');
          return null
        }
        const pwcheck = await bcrypt.compare(credentials.password, user.password);
        if (!pwcheck) {
          console.log('비번틀림');
          return null
        }
        return user
      }
    })
  ],

  //3. jwt 써놔야 잘됩니다 + jwt 만료일설정
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60 //30일
  },
  callbacks: {
    //4. jwt 만들 때 실행되는 코드 
    //user변수는 DB의 유저정보담겨있고 token.user에 뭐 저장하면 jwt에 들어갑니다.
    jwt: async ({ token, user }) => {
      if (user) {
        token.user = {};
        token.user.name = user.name
        token.user.image = user.image
      }
      return token;
    },
    //5. 유저 세션이 조회될 때 마다 실행되는 코드
    session: async ({ session, token }) => {
      session.user = token.user;  
      return session;
    },
  },
  pages: {
    signIn: "/",
  },
  secret : process.env.NEXTAUTH_SECRET,
  adapter: MongoDBAdapter(connectDB)
};
export default NextAuth(authOptions); 