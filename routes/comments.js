const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth-middleware.js');
const CommentsController = require('../controllers/comments-controller.js');
const commentsController = new CommentsController();
// 댓글 목록 조회 API
router.get(
  '/posts/:postId/comments',
  commentsController.getAllComments.bind(commentsController)
);

// 댓글 생성 API
router.post(
  '/posts/:postId/comments',
  authMiddleware,
  commentsController.createComment.bind(commentsController)
);

// // 댓글 수정 API (로그인 한 사용자가 본인이 작성한 댓글만 수정할 수 있게 authMiddleware사용)
router.put(
  '/posts/:postId/comments/:commentId',
  authMiddleware,
  commentsController.eidtComment.bind(commentsController)
);

// 댓글 삭제 API (로그인 한 사용자가 본인이 작성한 댓글만 삭제할 수 있게 authMiddleware사용)
router.delete(
  '/posts/:postId/comments/:commentId',
  authMiddleware,
  commentsController.delComment.bind(commentsController)
);

module.exports = router; // router 모듈을 외부로 내보냅니다.
