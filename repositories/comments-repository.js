const { Posts, Comments, Users } = require('../models');
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

  async createCommnet(postId, content, userId) {
    await Comments.create({
      UserId: userId,
      PostId: postId,
      content,
    });
    return { message: '댓글을 생성했습니다.' };
  }
}
module.exports = CommentsRepository;
