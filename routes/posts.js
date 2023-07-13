const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth-middleware.js');
const PostsController = require('../controllers/posts-controller.js');
const postsController = new PostsController();

const { Posts } = require('../models');

// 전체 게시글 조회 API
router.get('/posts', postsController.getPosts.bind(postsController));

// 게시글 상세 조회 API
router.get('/posts/:postId', postsController.getOnePost.bind(postsController));

// 게시글 작성 API - 로그인 한 사용자만 작성할 수 있게 authMiddleware사용
router.post(
  '/posts',
  authMiddleware,
  postsController.createPost.bind(postsController)
);

// 게시글 수정 API - 로그인 한 사용자가 본인 게시글만 수정할 수 있게 구현했습니다.
router.patch(
  '/posts/:postId',
  authMiddleware,
  postsController.editPost.bind(postsController)
);

// 게시글 삭제 API - 로그인한 사용자가 본인 게시글만 삭제 할 수 있게 구현했습니다.
router.delete(
  '/posts/:postId',
  authMiddleware,
  postsController.delPost.bind(postsController)
);

module.exports = router; // router 모듈을 외부로 내보냅니다.
