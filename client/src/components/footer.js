import React,{Component} from 'react';

class footer extends Component {

    //음악 설정
    componentDidMount(){

        //음악이 끝났을때 loop가 true면 다시 시작
        this.audio.addEventListener('ended', ()=> {
            if(this.state.loop === true){
                this.currentTime = 0;
                this.audio.play();
            }else{
                this.setState({
                    musicPlay:false
                });
            }
        });

        setInterval( () =>{
            // 음악 실행됬을때 
            if(this.state.musicPlay){
                this.musicInfo();
            }
        },100);        
    }

      
    // 음악 bar, 음악시간 설정
    musicInfo = () =>{
        if(this.audio){
            this.setState({
                currentTime: this.audio.currentTime,
                duration:this.audio.duration
            },()=>{
                let barWidth = ((this.progress.offsetWidth / this.state.duration) * this.state.currentTime / this.progress.offsetWidth * 100)+"%";
                this.bar.style.width = barWidth;
            });
        }
        
    }

    //음악 시작
    musicPlay = () =>{
        this.audio.play();
        this.setState({
            musicPlay: true
        });
        
    }

    //음악 중지
    musicStop = () =>{
        this.audio.pause();
        this.setState({
            musicPlay: false,
            loop : false,
        });
    }

    state ={
        musicPlay : false, 
        currentTime: 0,
        duration:0,
        loop: false,
    }


    // 음악 시간 계산
    count = (time) =>{
        let ftime = Math.floor(time);
        let m = 0;
        m = Math.floor(ftime / 60);
        let s = Math.floor(ftime % 60);
        if(m <= 9){
            m = "0"+m
        }
        if(s <= 9){
            s = "0"+s
        }

        return m+":"+s
    }

    //bar 클릭시 음악 시간 설정
    progressClick = (e) =>{
        let point = e.clientX;
        let p_width = point / this.progress.offsetWidth * 100+"%";
        this.audio.currentTime = this.state.duration *  point  / this.progress.offsetWidth;
        this.bar.style.width = p_width;
    }


    render() {
        const {music_url,music_name,image_url} = this.props.selectMusic;
        
        const backgorundUrl = {
            backgroundImage: `url(${image_url})`
        }

        return (
            <footer className={(this.props.selectMusic) !== "" ? 'on' : 'off'} >
                <div className="progress" onClick={this.progressClick} ref ={(data)=> this.progress = data}>
                    <div className="bar" ref ={(data)=> this.bar = data}></div>
                </div>
                <audio preload="metadata" ref={(data)=> {this.audio = data}} type="audio/mpeg" src={music_url}></audio>
                <div className="footer-musicimage" style={backgorundUrl}></div>
                <div className="footer-musicName"><p>{music_name}</p></div>
                
                <div className="control">
                    {
                        this.state.loop ?  <button onClick={()=>this.setState({loop:false})}>반복취소</button> : <button onClick={()=>this.setState({loop:true})}>반복하기</button>
                    }

                    {
                        this.state.musicPlay ?  <button onClick={this.musicStop}>중지</button> : <button onClick={this.musicPlay}>실행</button>
                    }
                </div>
                <div className="footer-time"><p>{this.count(this.state.currentTime)} : {this.count(this.state.duration)}</p></div>
            </footer>
        );
    }
}


export default footer;