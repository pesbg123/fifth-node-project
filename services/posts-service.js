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
        const postLikes = await this.postsRepository.likesCount(postId);
        // modifiedLikes 변수로 반환됩니다.
        return {
          postId: post.postId,
          nickname: post.User.nickname,
          title: post.title,
          createdAt: post.createdAt,
          updatedAt: post.updatedAt,
          postLikes,
        };
      })
    );
    return modifiedPosts;
  }

  // ----------------------------------------------------------------

  async getOnePost(postId) {
    const post = await this.postsRepository.getOnePost(postId);
    if (!post) {
      // 게시글이 존재하지 않을 경우
      throw new Error('해당 게시글이 존재하지 않습니다.');
    }
    // 게시글이 존재한다면 응답 데이터 형식 변경
    const postLikes = await this.postsRepository.likesCount(postId);
    const modifiedPost = {
      postId: post.postId,
      nickname: post.User.nickname,
      title: post.title,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      postLikes,
    };

    return modifiedPost;
  }

  //   ----------------------------------------------------------------

  async createPost(title, content, userId) {
    // body에서 받아온 데이터가 존재하지 않을 경우
    if (!title || !content) {
      throw new Error('제목이나 본문을 입력해주세요.');
    }
    const post = await this.postsRepository.createPost(title, content, userId);
    return post;
  }

  // ----------------------------------------------------------------

  async editPost(title, content, userId, postId) {
    const targetPost = await this.postsRepository.getOnePost(postId);
    // 해당 게시글이 존재하지 않을 경우
    if (!targetPost) {
      throw new Error('해당 게시글이 존재하지 않습니다.');
    }
    // 본인이 작성한 게시글인지 확인합니다.
    if (targetPost.dataValues.UserId !== userId) {
      throw new Error('본인이 작성한 게시글만 수정할 수 있습니다.');
    }
    const editPost = await this.postsRepository.editPost(
      title,
      content,
      postId
    );
    return editPost;
  }

  // ----------------------------------------------------------------

  async delPost(postId, userId) {
    const targetPost = await this.postsRepository.getOnePost(postId);
    // 해당 게시글이 존재하지 않을 경우
    if (!targetPost) {
      throw new Error('해당 게시글이 존재하지 않습니다.');
    }
    // 본인이 작성한 게시글이 아닐 경우
    if (targetPost.UserId !== userId) {
      throw new Error('본인이 작성한 게시글만 삭제할 수 있습니다.');
    }
    const delpost = await this.postsRepository.delPost(postId, userId);
    return delpost;
  }
}

module.exports = PostsService;
