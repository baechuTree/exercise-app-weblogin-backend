const express = require("express");
const asyncHandler = require("express-async-handler");
const Record = require("../models/Record");

const router = express.Router();

// GET /api/records/:folderId - 특정 폴더의 기록 가져오기
router.get("/:folderId",
  asyncHandler(async (req, res) => {
    const { folderId } = req.params;

    const records = await Record.find({ folderId }).sort({ date: -1 });

    res.status(200).json(records);
  })
);

// POST /api/records - 기록 추가
router.post("/:folderId",
  asyncHandler(async (req, res) => {
    const { folderId, text, date } = req.body;

    const newRecord = await Record.create({ folderId, text, date });

    res.status(201).json({
      message: "기록이 성공적으로 추가되었습니다.",
      record: newRecord,
    });
  })
);

// PUT /api/records/:id - 기록 수정
router.put("/:id",
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { text, date } = req.body;

    const record = await Record.findById(id);

    if (!record) {
      res.status(404);
      throw new Error("기록을 찾을 수 없습니다.");
    }

    if (text) record.text = text;
    if (date) record.date = date;

    const updatedRecord = await record.save();

    res.status(200).json({
      message: "기록이 수정되었습니다.",
      record: updatedRecord,
    });
  })
);

// DELETE /api/records/:id - 기록 삭제
router.delete("/:id",
  asyncHandler(async (req, res) => {
    const { id } = req.params;

    const record = await Record.findById(id);

    if (!record) {
      res.status(404);
      throw new Error("기록을 찾을 수 없습니다.");
    }

    await record.deleteOne();

    res.status(200).json({
      message: "기록이 삭제되었습니다.",
    });
  })
);

module.exports = router;