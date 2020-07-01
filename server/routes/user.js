// express router 설정
let express = require('express');
let router = express.Router();

// bodyParser 설정
const bodyParser = require('body-parser');
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));


// file upload
const multer = require('multer');
const upload = multer();

// db 설정 파일 가져오기 
const fs = require('fs');
const data = fs.readFileSync('./config/db.json');
const conf = JSON.parse(data);

// mysql 연결
const mysql = require('mysql');
const connection = mysql.createConnection({
  host: conf.host,
  user: conf.user,
  password: conf.password,
  port: conf.port,
  database: conf.database
});
connection.connect();




//유저 로그인 
router.post("/login", upload.none(), function(req, res){
    let sql = 'select * from user where user_email = ? and user_password = ?';

    // 유저 이메일
    let userEmail = req.body.userEmail;

    // 유저 패스워드
    let userPassword = req.body.userPassword;

    parames = [userEmail, userPassword];
    connection.query(sql, parames, (err, rows, fields) => {
        res.send(rows);
    });
});



//유저 로그아웃
router.get("/logout", upload.none(), function(req, res){
    // 일단 패스
});



//유저 회원가입
router.post('/join', upload.none(), (req, res) => {
    let sql = 'INSERT INTO user(user_id, user_email, user_name, user_password) VALUES(null, ?, ?, ?)';

    //유저 이메일
    let userEmail = req.body.userEmail;
    //유저 이름
    let userName = req.body.userName;
    // 유저 패스워드
    let userPassword = req.body.userPassword;

    let parames = [userEmail, userName, userPassword];
    connection.query(sql, parames, (err, rows, fields) => {
      res.send(rows);
    });
});


// 유저 이메일 중복 확인 
router.post('/getUser', upload.none(), (req, res) => {
  let sql = 'select 1 from user where user_email = ?';

  //유저 이메일
  let userEmail = req.body.userEmail;
  connection.query(sql, userEmail, (err, rows, fields) => {
    res.send(rows);
  });
});


module.exports = router;