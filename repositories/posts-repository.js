const { Posts, Users, Likes } = require('../models');
const { Op } = require('sequelize');

class PostsRepository {
  //
  async getPosts() {
    // 모든 게시물을 가져옵니다.
    const getAllPosts = await Posts.findAll({
      include: [{ model: Users, attributes: ['nickname'] }],
      attributes: ['title', 'createdAt', 'postId', 'updatedAt'],
      order: [['createdAt', 'desc']], // 작성날짜 기준으로 내림차순 정렬
    });
    return getAllPosts;
  }

  // --------------------------------------------------------

  async likesCount(postId) {
    const likes = await Likes.count({ where: { PostId: postId } });
    return likes;
  }

  // --------------------------------------------------------

  async getOnePost(postId) {
    // include를 사용해서 Users모델에 있는 nickname을 같이 가져옵니다.
    const getTargetPost = await Posts.findOne({
      where: { postId },
      attributes: ['title', 'createdAt', 'updatedAt', 'postId', 'UserId'],
      include: [
        {
          model: Users,
          attributes: ['nickname'],
        },
      ],
    });
    return getTargetPost;
  }
  // --------------------------------------------------------

  async createPost(title, content, userId) {
    await Posts.create({
      UserId: userId,
      title,
      content,
    });
    return { message: '게시물 등록에 성공했습니다.' };
  }

  // --------------------------------------------------------------------------------

  async editPost(title, content, postId) {
    // 수정사항을 업데이트 합니다.
    if (title) Posts.update({ title }, { where: { postId } });
    if (content) Posts.update({ content }, { where: { postId } });
    return { message: '게시글 수정에 성공했습니다.' };
  }

  async delPost(postId, userId) {
    await Posts.destroy({
      where: {
        [Op.and]: [{ postId }, { UserId: userId }],
      },
    });
    return { message: '게시물 삭제에 성공했습니다.' };
  }
}

module.exports = PostsRepository;
