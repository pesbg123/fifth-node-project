const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth-middleware.js');
const LikesController = require('../controllers/likes-controller.js');
const lieksController = new LikesController();

// 좋아요 등록한 게시물들 조회 API
// 경로 /pots/like로 할시에 알 수 없는 에러가 계속떠서, 해결 못 했습니다...
router.get(
  '/likes',
  authMiddleware,
  lieksController.getLikesPosts.bind(lieksController)
);

// 좋아요 등록, 취소 API
router.put(
  '/posts/:postId/like',
  authMiddleware,
  lieksController.likePost.bind(lieksController)
);

module.exports = router; // router 모듈을 외부로 내보냅니다.
