const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
require('dotenv').config();
const PORT = process.env.PORT;

const usersRouter = require('./routes/users.js');
const postRouter = require('./routes/posts.js');
const commentRouter = require('./routes/comments.js');
const likeRouter = require('./routes/likes.js');

app.use(express.json()); // json 파싱
app.use(cookieParser()); // 쿠키 파싱

// 라우터들을 가져옵니다.
app.use('/api', [usersRouter, postRouter, commentRouter, likeRouter]);

// 전역 에러 캐치 미들웨어
app.use((error, req, res, next) => {
  // status 코드와 에러 메세지를 포함하여 응답합니다.
  const statusCode = error.errorCode;
  res.status(statusCode).json({ errorMessage: error.errorMessage });
});

app.listen(PORT, () => {
  console.log(`${PORT}번 포트로 서버가 열렸습니다.`);
});
