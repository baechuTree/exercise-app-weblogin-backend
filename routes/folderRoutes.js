const express = require("express");
const asyncHandler = require("express-async-handler");
const Folder = require("../models/Folder");
const User = require("../models/User");
const jwt = require("jsonwebtoken"); //JWT
require('dotenv').config();

const router = express.Router();

// 미들웨어: 폴더 리스트 가져오기 전, 요청에 알맞은 JWT 토큰이 들어있는지 검증
const protect = async (req, res) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        try {
            token = req.headers.authorization.split(" ")[1];
            if (!token) {
                //토큰 없음
                return false;
            }

            let decoded;
            try {
                decoded = jwt.verify(token, process.env.JWT_SECRET);
            } catch (error) {
                //토큰 만료
                return false;
            }

            return await User.findById(decoded.id).select("-password");
        } catch (error) {
            //기타 에러
            return false;
        }
    }
};

// GET /api/folders - 폴더 리스트 가져오기
router.get("/",
    asyncHandler(async (req, res) => {
        //protect 실행, 에러 체크
        const result = await protect(req, res);
        if (!result) {
            res.status(401);
            throw new Error("인증 실패: 로그인 토큰이 없거나 만료되었습니다.");
        } else {
            req.user = result;
        }

        //get 실행
        const folders = await Folder.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.status(200).json(folders);
    })
);

// POST /api/folders - 폴더 추가하기
router.post("/",
    asyncHandler(async (req, res) => {
        //protect 실행, 에러 체크
        const result = await protect(req, res);
        if (!result) {
            res.status(401);
            throw new Error("인증 실패: 로그인 토큰이 없거나 만료되었습니다.");
        } else {
            req.user = result;
        }

        //post 실행
        const { name, color } = req.body; // 클라이언트에서 보낸 폴더 이름

        // 폴더 데이터가 비어있으면 에러 반환
        if (!name) {
          res.status(400);
          throw new Error("추가할 폴더 이름이 입력되지 않았습니다.");
        }
    
        // 폴더 생성
        const newFolder = await Folder.create({ name, color, user: req.user._id, });
    
        res.status(201).json({
          message: "폴더가 생성되었습니다.",
          folder: newFolder,
        });    
    })
)

// PUT /api/folders/:id - 폴더 수정
router.put("/:id",
    asyncHandler(async (req, res) => {
        //protect 실행, 에러 체크
        const result = await protect(req, res);
        if (!result) {
            res.status(401);
            throw new Error("인증 실패: 로그인 토큰이 없거나 만료되었습니다.");
        } else {
            req.user = result;
        }

        //put 실행
        const { id } = req.params;
        const { name, color } = req.body;

        const folder = await Folder.findById(id);

        if (!folder) {
            res.status(404);
            throw new Error("폴더를 찾을 수 없습니다.");
        }

        // 요청한 사용자가 폴더 소유자인지 확인
        if (folder.user.toString() !== req.user._id.toString()) {
            res.status(401);
            throw new Error("이 폴더를 수정할 권한이 없습니다.");
        }


        if (!name) {
            res.status(400);
            throw new Error("수정할 폴더 이름이 입력되지 않았습니다.");
        }

        folder.name = name;
        folder.color = color || folder.color;
        const updatedFolder = await folder.save();

        res.status(200).json({
            message: "폴더가 수정되었습니다.",
            folder: updatedFolder,
        });
    })
);

// DELETE /api/folders/:id - 폴더 삭제
router.delete("/:id",
    asyncHandler(async (req, res) => {
        //protect 실행, 에러 체크
        const result = await protect(req, res);
        if (!result) {
            res.status(401);
            throw new Error("인증 실패: 로그인 토큰이 없거나 만료되었습니다.");
        } else {
            req.user = result;
        }

        //delete 실행
        const { id } = req.params;

        const folder = await Folder.findById(id);

        if (!folder) {
            res.status(404);
            throw new Error("폴더를 찾을 수 없습니다.");
        }

        // 요청한 사용자가 폴더 소유자인지 확인
        if (folder.user.toString() !== req.user._id.toString()) {
            res.status(401);
            throw new Error("이 폴더를 삭제할 권한이 없습니다.");
        }

        await folder.deleteOne();

        res.status(200).json({
            message: "폴더가 삭제되었습니다.",
        });
    })
);


module.exports = router;