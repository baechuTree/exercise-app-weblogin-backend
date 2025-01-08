const mongoose = require("mongoose");

const recordSchema = mongoose.Schema(
  {
    folderId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Folder", // Folder 모델과 관계 설정
    },
    text: {
      type: String,
      required: [true, "내용(글자 또는 시간)을 입력해 주세요."],
    },
    date: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Record", recordSchema);