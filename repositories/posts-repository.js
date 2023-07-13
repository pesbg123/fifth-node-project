const { Posts, Users } = require('../models');

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
}

module.exports = PostsRepository;
