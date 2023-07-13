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
      throw new Error('게시글을 찾을 수 없습니다.');
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

  //   ----------------------------------------------------------------

  async createComment(postId, content, userId) {
    const targetPost = await this.postsRepository.getOnePost(postId);
    // body에서 받은 댓글 데이터가 비어있는 경우
    if (!content) {
      throw new Error('댓글을 입력해주세요.');
    }
    // 해당 게시글이 존재하지 않을 경우
    if (!targetPost) {
      throw new Error('게시글을 찾을 수 없습니다.');
    }
    const createComment = await this.commentsRepository.createCommnet(
      postId,
      content,
      userId
    );
    return createComment;
  }

  //   ----------------------------------------------------------------

  async editComment(userId, postId, content, commentId) {
    // 게시글의 존재 여부를 확인합니다.
    const targetPost = await this.postsRepository.getOnePost(postId);
    if (!targetPost) {
      throw new Error('게시글을 찾을 수 없습니다.');
    }
    // 코멘트의 존재 여부를 확인합니다.
    const targetComment = await this.commentsRepository.getOneComment(
      commentId
    );
    if (!targetComment) {
      throw new Error('댓글을 찾을 수 없습니다.');
    }
    // 사용자 본인이 작성한 코멘트인지 검사합니다.
    if (userId !== targetComment.dataValues.UserId) {
      throw new Error('본인이 작성한 댓글만 수정할 수 있습니다.');
    }
    // 입력된 코멘트 값의 유효성을 검사합니다.
    if (!content) {
      throw new Error('댓글을 입력해주세요.');
    }
    const editComment = await this.commentsRepository.editComment(
      commentId,
      content
    );
    return editComment;
  }

  async delComment(userId, postId, commentId) {
    // 게시글의 존재 여부를 확인합니다.
    const targetPost = await this.postsRepository.getOnePost(postId);
    if (!targetPost) {
      throw new Error('게시글을 찾을 수 없습니다.');
    }
    // 코멘트의 존재 여부를 확인합니다.
    const targetComment = await this.commentsRepository.getOneComment(
      commentId
    );
    if (!targetComment) {
      throw new Error('댓글을 찾을 수 없습니다.');
    }
    // 사용자 본인이 작성한 코멘트인지 검사합니다.
    if (userId !== targetComment.dataValues.UserId) {
      throw new Error('본인이 작성한 댓글만 삭제할 수 있습니다.');
    }
    const delCommnet = this.commentsRepository.delComment(commentId, userId);
    return delCommnet;
  }
}
module.exports = CommentsService;
