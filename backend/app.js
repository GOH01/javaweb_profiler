const express = require('express');
const logger = require('morgan');
const profileRouter = require('./routes/profile'); // 우리가 만들 라우터

const app = express();

app.use(logger('dev'));                  // 요청 로그
app.use(express.json());                // JSON 요청 파싱
app.use(express.urlencoded({ extended: false })); // URL 인코딩된 요청 파싱

app.use('/api/profile', profileRouter); // API 라우터 등록

module.exports = app;
