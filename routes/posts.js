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
router.delete('/posts/:postId', authMiddleware, async (req, res) => {
  try {
    const { postId } = req.params;
    const { userId } = res.locals.user;
    const post = await Posts.findOne({ where: { postId } });

    // 해당 게시글이 존재하지 않을 경우
    if (!post) {
      return res
        .status(404)
        .json({ errorMessage: '해당 게시글이 존재하지 않습니다.' });
    }
    // 본인이 작성한 게시글이 아닐 경우
    if (post.UserId !== userId) {
      return res
        .status(403)
        .json({ errorMessage: '본인이 작성한 게시글만 삭제할 수 있습니다.' });
    }

    // 게시글을 삭제합니다.
    post.destroy({
      where: {
        [Op.and]: [{ postId: post.postId }, { UserId: post.UserId }],
      },
    });
    // 확인 메시지를 응답합니다.
    res.status(200).json({ message: '게시글 삭제에 성공했습니다.' });
  } catch (error) {
    // 에러 메시지를 응답합니다.
    res.status(500).json({ errorMessage: '게시글 삭제에 실패했습니다.' });
  }
});
module.exports = router; // router 모듈을 외부로 내보냅니다.
