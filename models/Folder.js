const mongoose = require("mongoose");

// Folder 모델 스키마 정의
const folderSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true, // 필수 값
      trim: true, // 양쪽 공백 제거
    },
    color: {
      type: String,
      required: true,
      default: "#f5f5f5", // 기본 색상
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User", // User 릴레이션을 참조
    },
  },
  {
    timestamps: true, // createdAt, updatedAt 자동 생성
  }
);

const Folder = mongoose.model("Folder", folderSchema);

module.exports = Folder;