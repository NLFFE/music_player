import React from 'react';
import { post } from 'axios';
import { useForm, ErrorMessage } from 'react-hook-form';

const LoginPageTemplate = (props) => {
    const { register, handleSubmit, errors  } = useForm({mode: 'onBlur',validateCriteriaMode: 'all'});

    // 로그인 버튼 눌렀을때 로컬스토리지에 유저 정보 저장
    const onSubmit = async(data) => {
        try{
            // 서버 url
            const url = '/user/login';
            const formData = new FormData();
            formData.append('userEmail', data.userEmail);
            formData.append('userPassword', data.userPassword);
            let res = await post(url, formData);

            if(res.data[0] === undefined){ // 비밀번호 틀렸을때
                alert('아이디 또는 비밀번호가 다릅니다.')
                props.history.push('/user/login');
                return;
            }

            window.localStorage.setItem('userData', JSON.stringify(res.data[0]));
            alert('로그인 되었습니다.')
            props.history.push('/');
        }catch(e){
            alert("실패");
            console.log(e);
            props.history.push('/user/login');
        }   
    }

    return (
        <div className='contents'>
            <div className='title-box'>
                <p>로그인</p>
            </div>
            <div className='info-group'>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <p>이메일</p>
                    <input ref={register({ required: '이메일를 입력해주세요'})}  name='userEmail' />
                
                    {/* userEmail error */}
                    <ErrorMessage errors={errors} name='userEmail'>
                        {({ message }) => <p style={{color:'#ef3b7d'}}>{message}</p>} 
                    </ErrorMessage>

                    <p>패스워드</p>
                    <input ref={register({ required: '패스워드를 입력해주세요' })} type='password' name='userPassword' />

                    {/* userPassword error */}
                    <ErrorMessage errors={errors} name='userPassword'>
                        {({ message }) => <p style={{color:'#ef3b7d'}}>{message}</p>} 
                    </ErrorMessage>

                    <button>로그인</button>
                </form>
            </div>
        </div>
    );
}



export default LoginPageTemplate;