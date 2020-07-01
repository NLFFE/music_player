import React from 'react';
import {post} from 'axios';
import ReactS3 from 'react-s3';
import config from '../config/s3Config.json';
import { useForm, ErrorMessage } from 'react-hook-form';

// eslint-disable-next-line no-extend-native
Date.prototype.hhmmss = function() {
    let day = this.getDay()+""; 
    let hh = this.getHours()+"";
    let mm = this.getMinutes()+"";
    let ss = this.getSeconds()+"";
    return day + hh + mm + ss;
};
  
const MusicAddTemplate  = (props) => {
    const { register, handleSubmit, errors, watch } = useForm({ mode: 'onBlur',validateCriteriaMode: "all" });

    //유효성검사 
    const MusicFileValidate = value => (value[0] !== undefined ? value[0].type === 'audio/mpeg' : false);
    const ImageFileValidate = value => (value[0] !== undefined ? (value[0].type.split('/')[0] === 'image') : false);
    const namePattern = /^[a-zA-Z가-힣]+/g;


    //음악 추가하기 버튼을 눌렀을때 s3에 음악추가하고 데이터베이스에 음악데이터 추가
     const onSubmit = async(data) =>{

        // 로그인 검사
        if(JSON.parse(localStorage.getItem('userData')) === null){
            alert("로그인후 사용가능합니다.");
            props.history.push('/login');
            return;
        }

        try{
            let musicFile = data.musicFile[0];
            let imageFile = data.imageFile[0];
            let musicName = data.musicName;

            //음악 파일이름을 dayhhmmss-name으로 수정
            Object.defineProperty(musicFile, 'name', {
                writable: true,
                value: (((new Date()).hhmmss())+"-"+musicFile.name).replace(/(\s*)/g,"")
            });

            //이미지 파일이름을 dayhhmmss-name으로 수정
            Object.defineProperty(imageFile, 'name', {
                writable: true,
                value: (((new Date()).hhmmss())+"-"+imageFile.name).replace(/(\s*)/g,"")
            });

            let imageFileS3 = await ReactS3.uploadFile(imageFile, config);
            let musicFileS3 = await ReactS3.uploadFile(musicFile, config);

            const url = '/music/add';
            const formData = new FormData();
            formData.append('userId', JSON.parse(localStorage.getItem('userData')).user_id);
            formData.append('musicName', musicName);
            formData.append('musicUrl', musicFileS3.location);
            formData.append('imageUrl', imageFileS3.location);

            const fileConfig = {
                headers:{
                    'content-type':'multipart/form-data'
                }
            }

            await post(url, formData, fileConfig);
            props.history.push('/');
            alert("정상적으로 업로드됬습니다.");
            
        }catch (e){
            alert("실패");
            console.log(e);
            props.history.push('/music/add');
        }
        
    }

    
    return (
        <div className="contents">
            <div className="title-box">
                <p>음악추가</p>
            </div>
            <div className="info-group"> 
                <form className="filebox" onSubmit={handleSubmit(onSubmit)}>
                    <p>음악 선택</p>
                    <div className="filebox">
                        <label htmlFor="music">음악</label>
                        <span className="input-label">{ watch('musicFile') !== undefined && watch('musicFile')[0] !== undefined ? watch('musicFile')[0].name : ''}</span>
                        <input type="file" id="music" className="upload-hidden" name="musicFile" ref={register({
                            required:'음악을 추가해주세요',
                            validate: value => MusicFileValidate(value) || '음악만 추가할 수 있습니다',
                        })}/>
                    </div>

                    {/* music Errors  */}
                    <ErrorMessage errors={errors} name="musicFile">
                        {({ message }) => <p style={{color:'#ef3b7d'}}>{message}</p>} 
                    </ErrorMessage>

                    <p>이미지 선택</p>
                    <div className="filebox">
                        <label htmlFor="image">사진</label>
                        <span className="input-label">{ watch('imageFile') !== undefined && watch('imageFile')[0] !== undefined ? watch('imageFile')[0].name : ''}</span>
                        <input type="file" id="image" className="upload-hidden" name="imageFile" ref={register({
                            required:'이미지를 추가해주세요',
                            validate: value => ImageFileValidate(value) || '이미지만 추가할 수 있습니다',
                        })}/>
                    </div>

                    {/* music Errors  */}
                    <ErrorMessage errors={errors} name="imageFile">
                        {({ message }) => <p style={{color:'#ef3b7d'}}>{message}</p>} 
                    </ErrorMessage>

                    <p className="file-name">음악 이름</p>
                    <input ref={register({required:'이름을 입력해주세요', pattern:{value:namePattern, message:'한글 또는 영어만 입력할 수 있습니다 ex:(홍길동)'}})} type="text" name="musicName" />

                    {/* email Errors  */}
                    <ErrorMessage errors={errors} name="musicName">
                        {({ message }) => <p style={{color:'#ef3b7d'}}>{message}</p>} 
                    </ErrorMessage>
                    <button>추가하기</button>
                </form>
            </div>
        </div>
    );
}


export default MusicAddTemplate;