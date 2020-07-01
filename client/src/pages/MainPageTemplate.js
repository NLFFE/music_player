/* eslint-disable react/no-direct-mutation-state */
import React, { Component, Fragment } from 'react';
import MusicItem from '../components/MusicItem';
import Hangul from 'hangul-disassemble';
import Footer from '../components/footer';
import { get } from 'axios';

class MainPageTemplate extends Component {

    state = {
        musics: '', // 모든 음악
        filterMusics: '', // 초성검색된 음악들
        serch: '', //검색   
        selectMusic: '',//선택한 음악
    }

    componentDidMount() {
        this.musicInfo();
    }

    //모든 음악 가져오기 
    musicInfo = async() =>{
        let getMusics = await get('/music/musicList');
        this.setState({
            musics: getMusics.data,
            filterMusics: getMusics.data
        });
        this.serchFilter();
    }
    
    // 초성검색 musics에 {ch:ㄱㄴㄷ, image_url:..} 초성 ch를 추가
    serchFilter = () =>{
        if(this.state.musics){
            this.state.musics.forEach(function (music) {
                //초성
                let dis = Hangul.disassemble(music.music_name, true); 

                let cho = "";
                for (let i = 0, l = dis.length; i < l; i++) {
                    if(dis[i].first === undefined){
                        cho += dis[i];
                    }else{
                        cho += dis[i].first
                    }
                }
                music.ch = cho;
            });
        }
    }


    onChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    }


    //음악 검색을 했을때 
    onChagneSerch = (e) => {
        if (e.key === "Enter") {
            if(this.state.serch === ""){
                this.setState({
                    filterMusics:this.state.musics
                });
            }else{
                let arr = [];
                this.state.musics.forEach(x=>{
                    if(x.music_name.indexOf(this.state.serch) !== -1 || x.ch.indexOf(this.state.serch) !== -1){
                        arr.push(x);
                    }
                });

                this.setState({
                    filterMusics: arr
                });
            }
            
        }
    }

    //음악을 클릭했을때 음악 실행
    musicDoubleClick = (selectMusic) => {
        this.setState({
            selectMusic: selectMusic
        }, ()=>{
            this.state.music.musicPlay();
        });
    }

    render() {
        return (
            <Fragment>
                <div className="contents">
                    <div className="title-box">
                        <p>모든음악</p>
                    </div>
                    <input type="text" name="serch" value={this.state.serch} className="music-serch" placeholder="음악검색" onChange={this.onChange} onKeyPress={this.onChagneSerch} />
                    <div className="music-list">
                        {this.state.filterMusics.length > 0 ? this.state.filterMusics.map(music => { return (<MusicItem onDoubleClick={this.musicDoubleClick}  key={music.music_id} msuic={music} />) }) : <h1>음악이 없습니다.</h1>}

                    </div>
                </div>
                <Footer ref={(data)=> this.state.music = data} selectMusic ={this.state.selectMusic}></Footer>
            </Fragment>
            
        );
    }
}


export default MainPageTemplate;