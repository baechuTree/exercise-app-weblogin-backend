const mongoose = require("mongoose");
const bcrypt = require("bcryptjs"); //이게 뭐지

const userSchema = new mongoose.Schema(
    {
        nickname: {
            type: String,
        },
        email: {
            type: String,
        },
        userId: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

// 비밀번호 해싱(해싱: 데이터를 난수로 변경함(익명화))
userSchema.pre("save", async function(next) {
  if (!this.isModified("password")) return next();
  //idModified(애트리뷰트이름)
  //  : 해당 애트리뷰트에 수정이 있으면 true.
  //    새로 튜플을 생성하는 경우는 항상 true.

  //bcrypt로 해싱
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);

  next();
});

module.exports = mongoose.model("User", userSchema);