const express = require("express");
const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken"); //JWT

const router = express.Router();

// JWT 생성 함수
const generateToken = (id) => {
    //** expiresIn 지금 30일임
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

// api/users/register - 회원가입
router.post("/register",
    asyncHandler(async (req, res) => {
        const { nickname, email, userId, password } = req.body;
    
        if (!userId || !password) {
            return res.status(400).json({ message: "모든 필드를 입력해주세요" });
        }
    
        const userExists = await User.findOne({ userId });
        if (userExists) {
            return res.status(400).json({ message: "이미 사용 중인 이메일입니다" });
        }
    
        const user = await User.create({ nickname, email, userId, password });
    
        if (user) {
            res.status(201).json({
                token: generateToken(user._id),
            });
        } else {
            res.status(400).json({ message: "회원가입 실패" });
        }
    })
);

// api/users/login - 로그인
router.post("/login",
    asyncHandler(async (req, res) => {
        const { userId, password } = req.body;
    
        const user = await User.findOne({ userId });
    
        if (user && (await bcrypt.compare(password, user.password))) {
            res.json({
                _id: user._id,
                nickname: user.nickname,
                email: user.email,
                userId: user.userId,
                token: generateToken(user._id),
            });
        } else {
            res.status(401).json({ message: "아이디 또는 비밀번호가 잘못되었습니다" });
        }
    })
);

module.exports = router;