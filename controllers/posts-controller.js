// posts-service를 가져옵니다.
const PostsService = require('../services/posts-service');
// PostsController 클래스를 생성합니다.
class PostsController {
  // 클래스가 인스턴스화 될때 초깃값을 설정합니다.
  constructor() {
    this.postsService = new PostsService();
  }

  async getPosts(req, res, next) {
    try {
      const getAllPosts = await this.postsService.getPosts();
      res.status(200).json({ data: getAllPosts });
    } catch (error) {
      let statusCode;
      // 에러코드 핸들링
      // 아래 에러들이 아닐시 statusCode는 500으로 적용
      if (error.message === '존재하는 게시글이 없습니다.') {
        statusCode = 404;
      } else {
        statusCode = 500;
      }
      // 에러 메세지 객체
      const errorResponse = {
        errorMessage: error.message,
        errorCode: statusCode,
      };
      next(errorResponse); // 에러 객체를 다음 미들웨어로 전달합니다.
    }
  }

  //   ----------------------------------------------------------------

  async createPost(req, res, next) {
    try {
      const { title, content } = req.body;
      const post = await this.postsService.createPost(title, content);
      res.status(200).json({ message: post });
    } catch (error) {
      let statusCode;
      // 에러코드 핸들링
      // 아래 에러들이 아닐시 statusCode는 500으로 적용
      if (error.message === '존재하는 게시글이 없습니다.') {
        statusCode = 404;
      } else {
        statusCode = 500;
      }
      // 에러 메세지 객체
      const errorResponse = {
        errorMessage: error.message,
        errorCode: statusCode,
      };
      next(errorResponse); // 에러 객체를 다음 미들웨어로 전달합니다.
    }
  }
}

module.exports = PostsController;
