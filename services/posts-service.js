const { Op } = require('sequelize');
const { Posts, Users, Likes } = require('../models');

const PostsRepository = require('../repositories/posts-repository');
// PostsService 클래스를 생성합니다.
class PostsService {
  // 클래스가 인스턴스화 될때 초깃값을 설정합니다.
  constructor() {
    this.postsRepository = new PostsRepository();
  }

  async getPosts(req, res) {
    // include를 사용해서 Users모델에 있는 nickname을 같이 가져옵니다.
    const getAllPosts = await this.postsRepository.getPosts();

    // 게시글의 존재 여부를 확인합니다.
    if (!getAllPosts.length) {
      throw new Error('존재하는 게시글이 없습니다.');
    }
    // 데이터 형식을 변경합니다.
    const modifiedPosts = await Promise.all(
      // 모든 게시글에 대한 좋아요 수를 한 번에 얻기위해
      // Promise.all()을 사용해서 like.map()에서 반환된 모든 프로미스가
      // 완료될 때까지 기다리고 그 반환값을 반환합니다.
      getAllPosts.map(async (post) => {
        const postId = post.postId;
        const postLikes = await Likes.count({ where: { PostId: postId } });
        // modifiedLikes 변수로 반환됩니다.
        return {
          postId: post.postId,
          nickname: post.User.nickname,
          title: post.title,
          createdAt: post.createdAt,
          updatedAt: post.updatedAt,
          postLikes: postLikes,
        };
      })
    );
    return modifiedPosts;
  }
}

module.exports = PostsService;
