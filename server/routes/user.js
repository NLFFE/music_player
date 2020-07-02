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


// 비밀번호 암호화 
const bcrypt = require('bcrypt');


//유저 로그인 
router.post("/login", upload.none(),async function(req, res){
    let sql = 'select * from user where user_email = ?';

    // 유저 이메일
    let userEmail = req.body.userEmail;

    // 유저 패스워드
    let userPassword = req.body.userPassword;

    parames = [userEmail];
    await connection.query(sql, parames, (err, rows, fields) => {

      // 유저 이메일이 있을떄
      if(rows.length > 0){
        //패스워드 검사
        let hashPassword = bcrypt.hashSync(userPassword, rows[0].user_salt);
        if(hashPassword === rows[0].user_password){
          res.send(rows)
        }
      }
      res.end();
    });
});



//유저 로그아웃
router.get("/logout", upload.none(), function(req, res){
    // 일단 패스
});




//유저 회원가입
router.post('/join', upload.none(),async(req, res) => {


    let sql = 'INSERT INTO user(user_id, user_email, user_name, user_password, user_salt) VALUES(null, ?, ?, ?, ?)';

    //유저 이메일
    let userEmail = req.body.userEmail;
    //유저 이름
    let userName = req.body.userName;
    // 유저 패스워드
    let userPassword = req.body.userPassword;

    // 단반향 암호화 password
    let userSalt = bcrypt.genSaltSync(10);
    let hashPassword = bcrypt.hashSync(userPassword, userSalt);
    
    parames = [userEmail, userName, hashPassword, userSalt];
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