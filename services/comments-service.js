// comments-repository를 가져옵니다.
const CommentsRepository = require('../repositories/comments-repository');
// posts-repository 가져옵니다.
const PostsRepository = require('../repositories/posts-repository');
// CommentsService 클래스를 생성합니다.
class CommentsService {
  // 클래스가 인스턴스화 될때 초깃값을 설정합니다.
  constructor() {
    this.commentsRepository = new CommentsRepository();
    this.postsRepository = new PostsRepository();
  }

  async getAllComments(postId) {
    const targetPost = await this.postsRepository.getOnePost(postId);
    const getComments = await this.commentsRepository.getAllComments(postId);

    // 게시글의 존재 여부를 확인합니다.
    if (!targetPost) {
      throw new Error('게시글이 존재하지 않습니다.');
    }
    // 댓글의 존재 여부를 확인합니다.
    if (!getComments.length) {
      throw new Error('댓글이 존재하지 않습니다.');
    }
    // 데이터 형식 변경
    const modifiedComments = getComments.map((comment) => ({
      commentId: comment.commentId,
      nickname: comment.User.nickname,
      content: comment.content,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
    }));
    return modifiedComments;
  }
}
module.exports = CommentsService;
