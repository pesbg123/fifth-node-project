const { Op } = require('sequelize');
const { Posts, Likes, Users } = require('../models');

// LikesRepository 클래스를 생성합니다.
class LikesRepository {
  async getLike(userId, postId) {
    const checkLike = await Likes.findOne({
      where: {
        [Op.and]: [{ UserId: userId }, { PostId: postId }],
      },
    });
    return checkLike;
  }

  //   ----------------------------------------------------------------

  async getLikesPosts(userId, postId) {
    // 로그인한 해당 사용자가 좋아요 관계를 가져옵니다.
    const getLike = await Likes.findAll({
      where: { UserId: userId },
      include: [
        {
          model: Users,
          attributes: ['nickname'],
        },
        {
          model: Posts,
          attributes: ['title', 'content', 'createdAt', 'updatedAt'],
        },
      ],
    });
    return getLike;
  }

  // ----------------------------------------------------------------
  async likePost(userId, postId) {
    await Likes.create({
      UserId: userId,
      PostId: postId,
    });
    return { message: '좋아요를 등록했습니다.' };
  }

  //   ----------------------------------------------------------------

  async unlikePost(userId, postId) {
    await Likes.destroy({
      where: {
        [Op.and]: [{ PostId: postId }, { UserId: userId }],
      },
    });
    return { message: '좋아요를 취소했습니다.' };
  }
}
module.exports = LikesRepository;
