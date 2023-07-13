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

  // ----------------------------------------------------------------

  async getOnePost(req, res, next) {
    try {
      const { postId } = req.params;
      const getOnePost = await this.postsService.getOnePost(postId);
      res.status(200).json({ data: getOnePost });
    } catch (error) {
      let statusCode;
      // 에러코드 핸들링
      // 아래 에러들이 아닐시 statusCode는 500으로 적용
      if (error.message === '해당 게시글이 존재하지 않습니다.') {
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
      const { userId } = res.locals.user;
      const post = await this.postsService.createPost(title, content, userId);
      res.status(200).json({ message: post.message });
    } catch (error) {
      let statusCode;
      // 에러코드 핸들링
      // 아래 에러들이 아닐시 statusCode는 500으로 적용
      if (error.message === '제목이나 본문을 입력해주세요.') {
        statusCode = 400;
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

  async editPost(req, res, next) {
    try {
      const { title, content } = req.body;
      const { postId } = req.params;
      const { userId } = res.locals.user;
      const post = await this.postsService.editPost(
        title,
        content,
        userId,
        postId
      );

      // 확인 메시지를 응답합니다.
      return res.status(202).json({ message: post.message });
    } catch (error) {
      let statusCode;
      // 에러코드 핸들링
      // 아래 에러들이 아닐시 statusCode는 500으로 적용
      if (error.message === '해당 게시글이 존재하지 않습니다.') {
        statusCode = 404;
      } else if (
        error.message === '본인이 작성한 게시글만 수정할 수 있습니다.'
      ) {
        statusCode = 403;
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

  // ----------------------------------------------------------------

  async delPost(req, res, next) {
    try {
      const { postId } = req.params;
      const { userId } = res.locals.user;

      const targetPost = await this.postsService.delPost(postId, userId);

      // 확인 메시지를 응답합니다.
      return res.status(202).json({ message: targetPost.message });
    } catch (error) {
      let statusCode;
      // 에러코드 핸들링
      // 아래 에러들이 아닐시 statusCode는 500으로 적용
      if (error.message === '해당 게시글이 존재하지 않습니다.') {
        statusCode = 404;
      } else if (
        error.message === '본인이 작성한 게시글만 삭제할 수 있습니다.'
      ) {
        statusCode = 403;
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
