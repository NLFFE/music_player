import React from 'react';
import { Link } from 'react-router-dom';



const MusicItem = (props) =>{
        const { music } = props;
        const musicDoubleClick = e => {
            let selectMusic = { music_url: music.music_url, music_name: music.music_name, image_url: music.image_url };
            props.onDoubleClick(selectMusic);
        }
        const backgorundUrl = {
            backgroundImage: `url(${music.image_url})`
        }
        return (
            <div className="item">
                <div href="#" className="card">
                    <div className="music-image" style={backgorundUrl} onDoubleClick={musicDoubleClick}></div>
                    <div className="gradient">
                        <p className="music-title">{music.music_name}</p>
                        <p className="music-artist">{`${music.user_email} | ${music.user_name}`}</p>
                        {
                            JSON.parse(localStorage.getItem('userData')) && (music.user_id === JSON.parse(localStorage.getItem('userData')).user_id) ?
                            <Link to={`/music/update/${music.music_id}`} className="music-update"><span>수정</span></Link> : ''
                        }
                        <p className="music-date">{music.today}</p>
                    </div>
                </div>
            </div>
        );
}







export default MusicItem;