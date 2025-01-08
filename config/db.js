const mongoose = require("mongoose");
require('dotenv').config();

// MongoDB 연결 함수
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_URI); //참고: 이 부분 옵션을 뺐음. mongoose에서 더 이상 지원 X
    console.log("MongoDB 연결 성공!");
  } catch (err) {
    console.error("MongoDB 연결 실패:", err.message);
    process.exit(1); // 실패 시 서버 종료
  }
};

module.exports = connectDB;