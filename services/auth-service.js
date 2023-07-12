const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const env = process.env;
const saltRounds = 10;

const AuthRepository = require('../repositories/auth-repository'); // auth-repository를 가져옵니다.
// AuthService 클래스를 생성합니다.

class AuthService {
  // 클래스가 인스턴스화 될때 초깃값을 설정합니다.
  constructor() {
    this.authRepository = new AuthRepository();
  }

  async signup(nickname, password, confirmPassword) {
    if (!nickname || !password || !confirmPassword) {
      throw new Error('닉네임 또는 패스워드를 입력해주세요');
    }
    // 정규 표현식을 사용해서 닉네임이 영어와 숫자로 이루어 졌는지 검사 합니다.
    if (!nickname.match(/^[a-zA-Z0-9]{3,50}$/)) {
      throw new Error('닉네임은 영어나 숫자로만 이루어지게 작성해 주세요.');
    }
    // 패스워드 유효성 검사
    if (password.length < 4) {
      throw new Error('패스워드를 4글자 이상 작성해 주세요.');
    }
    if (password.includes(nickname) || nickname.includes(password)) {
      throw new Error('닉네임이 패스워드에 포함될 수 없습니다.');
    }
    // password와 confirmPassword가 일치하는지 검사합니다.
    if (password !== confirmPassword) {
      throw new Error('패스워드와 패스워드 확인이 일치하지 않습니다.');
    }
    // 닉네임 중복 검사를 위해 authRepository의 findByNickname메서드를 사용하여 데이터를 받아옵니다.
    const DuplicateNickname = await this.authRepository.findByNickname(
      nickname
    );
    // 닉네임이 유효성 검사
    if (DuplicateNickname) {
      throw new Error('닉네임이 이미 사용중입니다.');
    }
    // bcrypt를 사용해서 비밀번호를 암호화 시킵니다.
    const EncryptionPW = bcrypt.hashSync(password, saltRounds);
    // authRepository의 createUser 메서드를 사용해서 DB에 저장을 수행합니다.
    const newUser = await this.authRepository.createUser(
      nickname,
      EncryptionPW
    );
    return newUser;
  }

  // ----------------------------------------------------------------

  async login(nickname, password, refreshToken, accessToken, res) {
    const thisUser = await this.authRepository.findByNickname(nickname); // 닉네임 기준 사용자 정보 조회

    // 사용자가 존재하지 않을 경우
    if (!thisUser) {
      throw new Error('해당 사용자가 존재하지 않습니다.');
    }

    const userId = thisUser.dataValues.userId;

    const dbPassword = thisUser.dataValues.password; // DB에 암호화된 사용자 패스워드 할당

    const passwordMatch = await bcrypt.compare(password, dbPassword); // 사용자가 입력한 패스워드와 일치하는지 검사

    if (!passwordMatch) {
      throw new Error('닉네임이나 비밀번호가 일치하지 않습니다.');
    }

    // 액세스 토큰 발급
    const generateAccessToken = (userId) => {
      return jwt.sign({ userId: userId }, env.ACCESS_TOKEN_KEY, {
        expiresIn: '1h', // 만료시간 1시간
      });
    };

    // 리프레시 토큰 발급
    const generateRefreshToken = (userId) => {
      return jwt.sign({ userId: userId }, env.REFRESH_TOKEN_KEY, {
        expiresIn: '7d', // 만료시간 7일
      });
    };

    // accessToken과 refreshToken을 변수에 할당하고, 쿠키에 저장합니다.
    const saveAccessTokenCookie = generateAccessToken(userId);
    const saveRefreshTokenCookie = generateRefreshToken(userId);
    res.cookie('accessToken', saveAccessTokenCookie, { httpOnly: true });
    res.cookie('refreshToken', saveRefreshTokenCookie, { httpOnly: true });

    // 로그인 완료 응답
    const loginResponse = {
      userId,
      message: '로그인이 완료되었습니다.',
    };

    // accessToken이 있을 경우 로그인 상태 응답을 반환합니다.
    if (accessToken) {
      throw new Error('이미 로그인 상태입니다.');
    }

    if (!refreshToken) {
      // refreshToken이 없는 경우 로그인 완료 응답을 반환합니다.
      return res.status(200).json(loginResponse);
    }

    let tokenExpiredError = false;

    // refreshToken의 유효성 검사
    try {
      jwt.verify(refreshToken, env.REFRESH_TOKEN_KEY);
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        tokenExpiredError = true;
      } else {
        throw error;
      }
    }

    // accessToken과 refreshToken이 모두 유효한 경우 또는 accessToken만 만료되었을 경우
    if (
      tokenExpiredError ||
      (accessToken && jwt.verify(accessToken, env.ACCESS_TOKEN_KEY))
    ) {
      // 토큰 디코딩하여 userId 추출
      const decodedToken = jwt.decode(
        tokenExpiredError ? accessToken : refreshToken
      );
      const userId = decodedToken.userId;

      // 새로운 accessToken과 refreshToken 발급
      const newSaveAccessTokenCookie = tokenExpiredError
        ? generateAccessToken(userId)
        : undefined;
      const newSaveRefreshTokenCookie = tokenExpiredError
        ? undefined
        : generateRefreshToken(userId);

      // 발급된 토큰을 쿠키에 저장합니다.
      if (newSaveAccessTokenCookie) {
        res.cookie('accessToken', newSaveAccessTokenCookie, { httpOnly: true });
      }

      if (newSaveRefreshTokenCookie) {
        res.cookie('refreshToken', newSaveRefreshTokenCookie, {
          httpOnly: true,
        });
      }
    }
  }

  // ----------------------------------------------------------------

  // 로그아웃
  async logout(res) {
    //  토큰을 제거합니다.
    await res.clearCookie('accessToken');
    await res.clearCookie('refreshToken');
  }
}

module.exports = AuthService; // AuthService 모듈을 외부로 내보냅니다.
