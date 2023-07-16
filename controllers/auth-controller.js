// auth-service를 가져옵니다.
const AuthService = require('../services/auth-service');
// AuthController 클래스를 생성합니다.
class AuthController {
  // 클래스가 인스턴스화 될때 초깃값을 설정합니다.
  constructor() {
    this.authService = new AuthService();
  }

  async signup(req, res, next) {
    try {
      const { nickname, password, confirmPassword } = req.body;
      const newUser = await this.authService.signup(
        nickname,
        password,
        confirmPassword
      );
      res.status(202).json({
        userId: newUser.userId,
        message: newUser.message,
      });
    } catch (error) {
      let statusCode;
      // 에러코드 핸들링
      // 아래 에러들이 아닐시 statusCode는 500으로 적용
      if (error.message === '닉네임 또는 패스워드를 입력해주세요.') {
        statusCode = 400;
      }
      if (error.message === '닉네임이 이미 사용중입니다.') {
        statusCode = 409;
      } else if (
        error.message === '닉네임은 영어나 숫자로만 이루어지게 작성해 주세요.'
      ) {
        statusCode = 400;
      } else if (error.message === '닉네임이 패스워드에 포함될 수 없습니다.') {
        statusCode = 400;
      } else if (
        error.message === '패스워드와 패스워드 확인이 일치하지 않습니다.'
      ) {
        statusCode = 400;
      } else if (error.message === '이미 로그인 상태입니다.') {
        statusCode = 400;
      } else {
        statusCode = 500;
      }
      // 에러 메세지 객체
      const errorResponse = {
        errorMessage: error.message,
        errorCode: statusCode,
      };
      next(errorResponse); // 에러 객체를 다음 미들웨어로 전달합니다.
    }
  }

  // ----------------------------------------------------------------

  async login(req, res, next) {
    try {
      const { nickname, password } = req.body;
      const { refreshToken, accessToken } = req.cookies;

      const thisUser = await this.authService.login(
        nickname,
        password,
        refreshToken,
        accessToken,
        res
      );
      res.status(200).json(thisUser);
    } catch (error) {
      let statusCode;
      // 에러코드 핸들링
      // 아래 에러들이 아닐시 statusCode는 500으로 적용
      if (error.message === '해당 사용자가 존재하지 않습니다.') {
        statusCode = 404;
      } else if (error.message === '닉네임이나 비밀번호가 일치하지 않습니다.') {
        statusCode = 400;
      } else if (error.message === '이미 로그인 상태입니다.') {
        statusCode = 400;
      } else {
        statusCode = 500;
      }
      // 에러 메세지 객체
      const errorResponse = {
        errorMessage: error.message,
        errorCode: statusCode,
      };
      next(errorResponse); // 에러 객체를 다음 미들웨어로 전달합니다.
    }
  }

  // ----------------------------------------------------------------

  async logout(req, res, next) {
    try {
      await this.authService.logout(res);
      res.status(200).json({ message: '로그아웃 되었습니다.' });
    } catch (error) {
      next(error);
    }
  }
}
module.exports = AuthController; // AuthController 모듈을 외부로 내보냅니다.
