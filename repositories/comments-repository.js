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
}
module.exports = CommentsRepository;
