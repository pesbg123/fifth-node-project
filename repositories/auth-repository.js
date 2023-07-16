const { Users } = require('../models');

class AuthRepository {
  //
  async findByNickname(nickname) {
    // nickname 기준으로 DB에 검색합니다.
    const DuplicateNickname = await Users.findOne({
      where: {
        nickname,
      },
    });
    return DuplicateNickname;
  }

  // ----------------------------------------------------------------

  async createUser(nickname, EncryptionPW) {
    // DB에 유저를 저장합니다.
    await Users.create({
      password: EncryptionPW,
      nickname,
    });
    return { message: '회원가입에 성공했습니다.' };
  }
}

module.exports = AuthRepository; // AuthRepository 모듈을 외부로 내보냅니다.
