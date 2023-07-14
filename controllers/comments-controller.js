// comments-service를 가져옵니다.
const CommentsService = require('../services/comments-service');
// CommentsController 클래스를 생성합니다.
class CommentsController {
  // 클래스가 인스턴스화 될때 초깃값을 설정합니다.
  constructor() {
    this.commentsService = new CommentsService();
  }

  async getAllComments(req, res, next) {
    try {
      const { postId } = req.params;

      const getAllComments = await this.commentsService.getAllComments(postId);
      res.status(200).json({ data: getAllComments });
    } catch (error) {
      let statusCode;
      // 에러코드 핸들링
      // 아래 에러들이 아닐시 statusCode는 500으로 적용
      if (error.message === '게시글을 찾을 수 없습니다.') {
        statusCode = 404;
      } else if (error.message === '댓글이 존재하지 않습니다.') {
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

  async createComment(req, res, next) {
    try {
      const { postId } = req.params;
      const { content } = req.body;
      const { userId } = res.locals.user;

      const createComment = await this.commentsService.createComment(
        postId,
        content,
        userId
      );
      res.status(200).json({ data: createComment.message });
    } catch (error) {
      let statusCode;
      // 에러코드 핸들링
      // 아래 에러들이 아닐시 statusCode는 500으로 적용
      if (error.message === '게시글을 찾을 수 없습니다.') {
        statusCode = 404;
      } else if (error.message === '댓글을 입력해주세요.') {
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

  //   ----------------------------------------------------------------

  async eidtComment(req, res, next) {
    try {
      const { content } = req.body;
      const { postId, commentId } = req.params;
      const { userId } = res.locals.user;
      const targetComment = await this.commentsService.editComment(
        userId,
        postId,
        content,
        commentId
      );
      res.status(200).json({ message: targetComment.message });
    } catch (error) {
      let statusCode;
      // 에러코드 핸들링
      // 아래 에러들이 아닐시 statusCode는 500으로 적용
      if (error.message === '게시글을 찾을 수 없습니다.') {
        statusCode = 404;
      } else if (error.message === '댓글을 입력해주세요.') {
        statusCode = 400;
      } else if (error.message === '댓글을 찾을 수 없습니다.') {
        statusCode = 404;
      } else if (error.message === '본인이 작성한 댓글만 수정할 수 있습니다.') {
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

  //   ----------------------------------------------------------------

  async delComment(req, res, next) {
    try {
      const { postId, commentId } = req.params;
      const { userId } = res.locals.user;
      const targetComment = await this.commentsService.delComment(
        userId,
        postId,
        commentId
      );
      res.status(200).json({ message: targetComment.message });
    } catch (error) {
      let statusCode;
      // 에러코드 핸들링
      // 아래 에러들이 아닐시 statusCode는 500으로 적용
      if (error.message === '게시글을 찾을 수 없습니다.') {
        statusCode = 404;
      } else if (error.message === '댓글을 찾을 수 없습니다.') {
        statusCode = 404;
      } else if (error.message === '본인이 작성한 댓글만 삭제할 수 있습니다.') {
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
module.exports = CommentsController;
