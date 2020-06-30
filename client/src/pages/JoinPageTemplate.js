import React from 'react';
import { post } from 'axios';
import { useForm, ErrorMessage } from 'react-hook-form';

const JoinPageTemplate = (props) => {


    const { register, handleSubmit, errors, watch } = useForm({ mode: 'onBlur',validateCriteriaMode: "all" });
    const EmailPattern = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;
    const namePattern =  /^[a-zA-Z가-힣]+$/i;
    const passwordPattern = '/^[a-zA-Z0-9]+$/i';


    // 회원가입 버튼 눌렀을때 데이터베이스에 유저 정보 저장
    const onSubmit  = async(data) =>{

        try{            
            const url = '/user/join';
            const formData = new FormData();
            formData.append('userEmail', data.userEmail);
            formData.append('userName', data.userName);
            formData.append('userPassword', data.userPassword);

            await post(url, formData);
            alert("회원가입되었습니다.");
            props.history.push('/');   

        }catch(e){ 
            alert("실패");
            console.log(e);
            props.history.push('/user/join');
        }
    }

    return (
        <div className="contents">
            <div className="title-box">
                <p>회원가입</p>
            </div>
            <div className="info-group">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <p>이메일</p>
                    <input ref={register({ 
                        required: '이메일을 입력해주세요.',
                        validate: async value => (await (post('/user/getUser', {'userEmail':value}))).data[0] && '이미사용중인 이메일 입니다',
                        pattern: {value: EmailPattern, message:'이메일 형식이 아닙니다 ex:(asd@asd.asd)'}
                    })} type="text" name="userEmail" />

                    {/* userEmail Errors  */}
                    <ErrorMessage errors={errors} name="userEmail">
                        {({ message }) => <p style={{color:'#ef3b7d'}}>{message}</p>} 
                    </ErrorMessage>

                    <p>이름</p>
                    <input ref={register({ required: '이름을 입력해주세요', pattern: {value:namePattern, message:'한글 또는 영어만 입력할 수 있습니다 ex:(홍길동)'} })} type="text" name="userName" />

                    {/* userName Errors  */}
                    <ErrorMessage errors={errors} name="userName">
                        {({ message }) => <p style={{color:'#ef3b7d'}}>{message}</p>} 
                    </ErrorMessage>


                    <p>패스워드</p>
                    <input ref={register({ required: '패스워드를 입력해주세요', pattern:{value:passwordPattern, message:'영어 또는 숫자만 입력할 수 있습니다'} })} type="password" name="userPassword" />

                    {/* userPassword Errors  */}
                    <ErrorMessage errors={errors} name="userPassword">
                        {({ message }) => <p style={{color:'#ef3b7d'}}>{message}</p>} 
                    </ErrorMessage>

                    <p>패스워드 확인</p>
                    <input ref={register({ required: '패스워드를 입력해주세요', validate: value => value === watch("userPassword") || '패스워드가 다릅니다' })} type="password" name="passwordCfm" />

                    {/* passwordCfm Errors  */}
                    <ErrorMessage errors={errors} name="passwordCfm">
                        {({ message }) => <p style={{color:'#ef3b7d'}}>{message}</p>} 
                    </ErrorMessage>

                    <button>회원가입</button>
                </form>
            </div>
        </div>
    );
}




export default JoinPageTemplate;