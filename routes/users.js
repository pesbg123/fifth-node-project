const express = require('express');
const router = express.Router();

const AuthController = require('../controllers/auth-controller');
const authController = new AuthController(); // AuthController 인스턴스화

// 회원가입 API
router.post('/signup', authController.signup.bind(authController));

// 로그인 API
router.post('/login', authController.login.bind(authController));

// 로그아웃 API
router.post('/logout', authController.logout.bind(authController));

module.exports = router; // router 모듈을 외부로 내보냅니다.
