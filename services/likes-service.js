// posts-service를 가져옵니다.
const PostsRepository = require('../repositories/posts-repository');
// likes-repository를 가져옵니다.
const LikesRepository = require('../repositories/likes-repository');
// LikesService 클래스를 생성합니다.
class LikesService {
  // 클래스가 인스턴스화 될때 초깃값을 설정합니다.
  constructor() {
    this.likesrepository = new LikesRepository();
    this.PostsRepository = new PostsRepository();
  }

  async likePost(userId, postId) {
    const checkLike = await this.likesrepository.getLike(userId, postId);
    // 좋아요를 누른적이 없는 경우 좋아요를 등록합니다.
    if (!checkLike) {
      const likePost = await this.likesrepository.likePost(userId, postId);
      return likePost;
    } else {
      const unlikePost = await this.likesrepository.unlikePost(userId, postId);
      return unlikePost;
    }
  }

  //   ----------------------------------------------------------------

  async getLikesPosts(userId) {
    const getLike = await this.likesrepository.getLikesPosts(userId);
    // 좋아요를 등록한 게시글이 존재하지 않을 경우
    if (!getLike.length) {
      throw new Error('좋아요를 등록한 게시글이 존재하지 않습니다.');
    }
    // 데이터 형식을 변경합니다.
    const modifiedLikes = await Promise.all(
      // 모든 게시글에 대한 좋아요 수를 한 번에 얻기위해
      // Promise.all()을 사용해서 like.map()에서 반환된 모든 프로미스가
      // 완료될 때까지 기다리고 그 반환값을 반환합니다.
      getLike.map(async (like) => {
        const postId = like.PostId;

        const postLikes = await this.PostsRepository.likesCount(postId);
        // modifiedLikes 변수로 반환됩니다.
        return {
          postId,
          likerUserId: like.UserId,
          likersNickname: like.User.nickname,
          postTitle: like.Post.title,
          postCreatedAt: like.Post.createdAt,
          postUpdatedAt: like.Post.updatedAt,
          postLikes,
        };
      })
    );
    // 좋아요 갯수별로 내림차순 정렬을위해 sort()메서드 사용
    const sortedLikes = modifiedLikes.sort((a, b) => b.postLikes - a.postLikes);
    return { data: sortedLikes };
  }
}
module.exports = LikesService;
