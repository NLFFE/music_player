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



// 모든 음악 가져오기
router.get("/musicList", upload.none(), function(req, res) {
    //음악 + 유저 정보
    let sql = "SELECT m.music_id, m.user_id, m.music_name, m.music_url, DATE_FORMAT(m.today, '%Y-%m-%d') AS today, m.image_url,u.user_email, u.user_name "
              +"FROM music as m join user as u on m.user_id = u.user_id";
    connection.query(sql,(err, rows, fields)=>{
      res.send(rows);
    });
});


// 음악 추가
router.post('/add', upload.none(), (req, res, next) => {
  let sql = 'INSERT INTO music(music_id, user_id, music_name, music_url, image_url, today) VALUES(null, ?, ?, ?, ?, DATE(NOW()))';

  //유저 아이디
  let userId = req.body.userId;

  //음악 이름
  let musicName = req.body.musicName;

  //음악 주소
  let musicUrl = req.body.musicUrl;

  //이미지 주소
  let imageUrl = req.body.imageUrl;

  let parames = [userId, musicName, musicUrl,imageUrl];

  connection.query(sql, parames, (err, rows, fields) => {
    res.send(rows);
  });
});


//음악 수정
router.post('/update', upload.none(), (req, res) => {
  let sql = 'UPDATE music SET music_name = ?';

  //음악이름
  let musicName = req.body.musicName;

  //음악아이디
  let musicId = req.body.musicId;

  // 이미지 주소
  let imageUrl = req.body.imageUrl;

  //음악 주소
  let musicUrl = req.body.musicUrl;

  //음악 또는 이미지가 수정되었을때만 수정
  parames = [musicName,];
  if(imageUrl !== 'undefined'){
    parames.push(imageUrl);
    sql += ', image_url = ?'
  }
  if(musicUrl !== 'undefined'){
    parames.push(musicUrl);
    sql += ', music_url = ?'
  }
  sql += ' where music_id = ?';
  parames.push(musicId);

  connection.query(sql, parames, (err, rows, fields) => {
    res.send(rows);
  });
});


//음악 한개 가져오기
router.post('/getMusic', upload.none(), (req, res) => {
  let sql = 'select * from music where music_id = ?';

  //음악 아이디
  let musicId = req.body.musicId;

  connection.query(sql, musicId, (err, rows, fields) => {
    res.send(rows);
  });
});


//음악 삭제
router.post('/delete', upload.none(), (req, res) => {
  let sql = 'delete from music where music_id = ?';

  //음악 아이디
  let musicId = req.body.musicId;
  
  connection.query(sql, musicId, (err, rows, fields) => {
    res.send(rows);
  });
});



module.exports = router;

