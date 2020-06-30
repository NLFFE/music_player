const express = require('express');
const app = express();

//서버 포트 설정
const PORT = process.env.PORT || 3001;

// 라우터
let userRouter = require('./routes/user.js');
let musicRouter = require('./routes/music.js');


//라우터 사용
app.use('/user', userRouter);
app.use('/music', musicRouter);

//서버 실행
app.listen(PORT, () => {
  console.log(`Server On : http://localhost:${PORT}/`);
})