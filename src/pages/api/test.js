//localhost:3000/api/test 서버
export default function handler(req, res) {
  if (req.method === "POST") {
    return res.status(200).json("post 완료");
  } else if (req.method === "GET") {
    let dateTime = new Date();
    return res.status(200).json(dateTime + "get 완료");
  }
}

//200 : 성공
//500 : 서버기능 에러
//404 : 페이지 없음
//400 : 요청 실수(잘못보냄)
