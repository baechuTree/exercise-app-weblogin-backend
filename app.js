const express = require("express");
const connectDB = require("./config/db");
const folderRoutes = require("./routes/folderRoutes");
const recordRoutes = require("./routes/recordRoutes");
const userRoutes = require("./routes/userRoutes");
const cors = require('cors');

// 애플리케이션 초기화
const app = express();
const PORT = 5000;

// MongoDB 연결
connectDB();

// JSON 파싱 미들웨어
app.use(express.json());

// **CORS 설정 추가: 특정 주소(=출처)에서 오는 요청을 받아들이게 함
//   지금은 프론트엔드 서버에서 오는 요청을 받아들이기 위해 사용
app.use(cors({
  origin: ['http://localhost:3000', 'http://192.168.35.158:3000'], // 허용할 출처
    //**배포 시 프론트엔드의 도메인 이름이 달라진다면, 그 도메인으로 바꿔줘야 함
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
app.listen(PORT, () => {
  console.log(`http://localhost:${PORT} 에서 서버 실행 중...`);
});