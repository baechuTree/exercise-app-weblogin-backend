const express = require("express");
const connectDB = require("./config/db");
const folderRoutes = require("./routes/folderRoutes");
const recordRoutes = require("./routes/recordRoutes");
const userRoutes = require("./routes/userRoutes");
const cors = require('cors');
require("dotenv").config();

// 애플리케이션 초기화
const app = express();

// MongoDB 연결
connectDB();

// JSON 파싱 미들웨어
app.use(express.json());

// **CORS 설정 추가: 특정 주소(=출처)에서 오는 요청을 받아들이게 함
//   지금은 프론트엔드 서버에서 오는 요청을 받아들이기 위해 사용
app.use(cors({
  origin: [ process.env.FRONTEND_URL ], // 허용할 출처. 프론트엔드 도메인을 넣어주자
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // 허용할 HTTP 메서드
  credentials: true, // 쿠키 등을 포함한 요청 허용
}));

// 기본 라우트 연결
app.use("/api/folders", folderRoutes);
app.use("/api/records", recordRoutes);
app.use("/api/users", userRoutes);

// 기본 라우트 설정
app.get("/", (req, res) => {
  res.send("서버가 정상적으로 실행 중입니다!");
});

// 서버 실행
app.listen(process.env.PORT, () => {
  console.log(`서버 실행 중...`);
});