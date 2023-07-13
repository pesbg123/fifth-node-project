// likes-service를 가져옵니다.
const LikesService = require('../services/likes-service');
// CommentsController 클래스를 생성합니다.
class LikesController {
  // 클래스가 인스턴스화 될때 초깃값을 설정합니다.
  constructor() {
    this.likesService = new LikesService();
  }

  async likePost(req, res, next) {
    try {
      const { postId } = req.params;
      const { userId } = res.locals.user;
      const likePost = await this.likesService.likePost(userId, postId);
      res.status(200).json({ message: likePost.message });
    } catch (error) {
      // 에러 메세지 객체
      const errorResponse = {
        errorMessage: error.message,
        errorCode: 500,
      };
      next(errorResponse);
    }
  }

  //   ----------------------------------------------------------------

  async getLikesPosts(req, res, next) {
    try {
      const { userId } = res.locals.user;
      const LikePost = await this.likesService.getLikesPosts(userId);
      res.status(200).json({ message: LikePost });
    } catch (error) {
      console.log(error);

      let statusCode;
      // 에러코드 핸들링
      // 아래 에러들이 아닐시 statusCode는 500으로 적용
      if (error.message === '좋아요를 등록한 게시글이 존재하지 않습니다.') {
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
module.exports = LikesController;
