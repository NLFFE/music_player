import React from 'react';
import { Link } from 'react-router-dom';



const MusicItem = (props) =>{
        const { msuic } = props;
        const musicDoubleClick = e => {
            let selectMusic = { music_url: msuic.music_url, music_name: msuic.music_name, image_url: msuic.image_url };
            props.onDoubleClick(selectMusic);
        }
        const backgorundUrl = {
            backgroundImage: `url(${msuic.image_url})`
        }
        return (
            <div className="item">
                <div href="#" className="card">
                    <div className="music-image" style={backgorundUrl} onDoubleClick={musicDoubleClick}></div>
                    <div className="gradient">
                        <p className="music-title">{msuic.music_name}</p>
                        <p className="music-artist">{`${msuic.user_email} | ${msuic.user_name}`}</p>
                        {
                            JSON.parse(localStorage.getItem('userData')) && (msuic.user_id === JSON.parse(localStorage.getItem('userData')).user_id) ?
                            <Link to={`/music/update/${msuic.music_id}`} className="music-update"><span>수정</span></Link> : ''
                        }
                        <p className="music-date">{msuic.today}</p>
                    </div>
                </div>
            </div>
        );
}







export default MusicItem;