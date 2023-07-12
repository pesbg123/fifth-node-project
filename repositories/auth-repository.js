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
    const newUser = await Users.create({
      password: EncryptionPW,
      nickname,
    });
    return newUser;
  }
}

module.exports = AuthRepository; // AuthRepository 모듈을 외부로 내보냅니다.
