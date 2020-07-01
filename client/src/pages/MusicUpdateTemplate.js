import React, { Component } from 'react';
import { post } from 'axios';
import ReactS3 from 'react-s3';
import config from '../config/s3Config.json';
import { useForm, ErrorMessage } from 'react-hook-form';

class MusicUpdateTemplate extends Component {

    state = {
        musicData: '' // 음악데이터
    }


    // 수정할 음악 데이터 가져오기
    componentDidMount() {
        let musicId = this.props.match.params.id;
        this.getMusic(musicId);
    }

    // 음악데이터 가져오기
    getMusic = async (musicId) => {
        const url = '/music/getMusic';
        const formData = new FormData();
        formData.append('musicId', musicId);

        let res = await post(url, formData);

        //수정할 음악 데이터
        let musicData = res.data[0];

        if (JSON.parse(localStorage.getItem('userData')) == null) {
            alert("로그인후 사용가능합니다.");
            this.props.history.push('/login');
            return;
        }
        
        if (musicData.user_id !== (JSON.parse(localStorage.getItem('userData'))).user_id) {
            alert("권한이없습니다.");
            this.props.history.push('/');
            return;
        }

        // 파일 업로드 할때 음악 파일이름을 dayhhmmss-name으로 수정하여 올려서 음악파일 이름을 짤라서 가져옴
        musicData = {
            'musicFileName': musicData.music_url,
            'musicName': musicData.music_name,
            'imageName': musicData.image_url,
            'musicId': musicId,

        }

        this.setState({
            musicData: musicData
        });

    }
    render() {
        return (
            <MusicUpdateForm musicData={this.state.musicData} props ={this.props} />
        );
    }
}



const MusicUpdateForm = ({ musicData,props }) => {
    const { register, handleSubmit, errors, watch } = useForm({ mode: 'onBlur', validateCriteriaMode: "all" });

    //유효성검사
    const MusicFileValidate = value => value.length > 0 ? (value[0] && value[0].type === 'audio/mpeg') : true;
    const ImageFileValidate = value => value.length > 0 ? (value[0] && (value[0].type.split('/')[0] === 'image')) : true;
    const namePattern = /^[a-zA-Z가-힣]+/g;


    // 음악 파일이름을 dayhhmmss-name으로 수정하고 s3에 업로드
    const group = async (item) => {
        if (item) {
            Object.defineProperty(item, 'name', {
                writable: true,
                value: (((new Date()).hhmmss()) + "-" + item.name).replace(/(\s*)/g, "")
            });
            return await ReactS3.uploadFile(item, config);
        }
    }


    //음악 수정하기 버튼을 눌렀을때 s3에 음악추가하고 데이터베이스에 음악데이터를 수정
    const onSubmit = async (data) => {
        try {

            let imageUrlS3 = await group(data.imageFile[0]);
            let musicUrlS3 = await group(data.musicFile[0]);
            let musicUrl = musicUrlS3 && musicUrlS3.location;
            let imageUrl = imageUrlS3 && imageUrlS3.location;
            const url = '/music/update';
            const formData = new FormData();
            formData.append('musicId', musicData.musicId);
            formData.append('musicName', data.musicName);
            formData.append('musicUrl', musicUrl);
            formData.append('imageUrl', imageUrl);
            post(url, formData).then((data) => {
                props.history.push('/');
                alert("정상적으로 수정됬습니다.")
            });    
        } catch (err) {
            
        }
        
    }

    //음악 삭제 
    const deleteMusic = () => {
        const url = '/music/delete';
        const formData = new FormData();
        formData.append('musicId', musicData.musicId);
        post(url, formData).then((data) => {
            props.history.push('/');
            alert("정상적으로 삭제되었습니다.")
        });

    }

    return (
        <div className="contents">
            <div className="title-box">
                <p>음악수정</p>
            </div>
            <div className="info-group">

                <form className="filebox" onSubmit={handleSubmit(onSubmit)}>
                    <p>음악 선택</p>
                    <div className="filebox">
                        <label htmlFor="music">음악</label>
                        <span className="input-label">{watch('musicFile') !== undefined && watch('musicFile')[0] !== undefined ? watch('musicFile')[0].name : `${musicData && musicData.musicFileName.split("-")[1]}`}</span>
                        <input type="file" id="music" className="upload-hidden" name="musicFile" ref={register({
                            validate: value => MusicFileValidate(value) || '음악만 추가할 수 있습니다'
                        })} />
                    </div>

                    {/* music Errors  */}
                    <ErrorMessage errors={errors} name="musicFile">
                        {({ message }) => <p style={{ color: '#ef3b7d' }}>{message}</p>}
                    </ErrorMessage>

                    <p>이미지 선택</p>
                    <div className="filebox">
                        <label htmlFor="image">사진</label>
                        <span className="input-label" >{watch('imageFile') !== undefined && watch('imageFile')[0] !== undefined ? watch('imageFile')[0].name : `${musicData && musicData.imageName.split("-")[1]}`}</span>
                        <input type="file" id="image" className="upload-hidden" name="imageFile" ref={register({
                            validate: value => ImageFileValidate(value) || '이미지만 추가할 수 있습니다'
                        })} />
                    </div>

                    {/* music Errors  */}
                    <ErrorMessage errors={errors} name="imageFile">
                        {({ message }) => <p style={{ color: '#ef3b7d' }}>{message}</p>}
                    </ErrorMessage>

                    <p className="file-name">음악 이름</p>
                    <input defaultValue={musicData && musicData.musicName} ref={register({ required: '이름을 입력해주세요', pattern: namePattern, message: '한글 또는 영어만 입력할 수 있습니다 ex:(홍길동)' })} type="text" name="musicName" />

                    {/* email Errors  */}
                    <ErrorMessage errors={errors} name="musicName">
                        {({ message }) => <p style={{ color: '#ef3b7d' }}>{message}</p>}
                    </ErrorMessage>
                    <button>수정하기</button>
                </form>
                <button className="delete" onClick={deleteMusic}>삭제</button>
            </div>
        </div>
    );
}


export default MusicUpdateTemplate;