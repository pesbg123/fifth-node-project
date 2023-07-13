const { Comments, Users } = require('../models');
const { Op } = require('sequelize');

class CommentsRepository {
  async getAllComments(postId) {
    const getAllComments = await Comments.findAll({
      where: { postId },
      include: { model: Users, attributes: ['nickname'] },
      attributes: ['commentId', 'content', 'createdAt', 'updatedAt'],
      order: [['createdAt', 'desc']], // 작성날짜 기준으로 내림차순 정렬
    });
    return getAllComments;
  }

  //   ----------------------------------------------------------------

  async getOneComment(commentId) {
    const getOneComments = await Comments.findOne({
      where: { commentId },
      include: { model: Users, attributes: ['nickname'] },
      attributes: ['commentId', 'UserId', 'content', 'createdAt', 'updatedAt'],
    });
    return getOneComments;
  }

  // ----------------------------------------------------------------

  async createCommnet(postId, content, userId) {
    await Comments.create({
      UserId: userId,
      PostId: postId,
      content,
    });
    return { message: '댓글을 생성했습니다.' };
  }

  //   ----------------------------------------------------------------

  async editComment(commentId, content) {
    await Comments.update({ content }, { where: { commentId } });
    return { message: '댓글을 수정했습니다.' };
  }
}
module.exports = CommentsRepository;
