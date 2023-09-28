import React, {useEffect, useRef} from "react";
import './VideoContainer.css'
import Overlay from "../Overlay/Overlay";

const VideoContainer = ({ url, overlayList,edit, setOverlayList }) => {
    
    return <div className='video-container'>
        <img id="video" src={url} width="100%" height="100%" />
        {overlayList.map((overlay, index) => <Overlay key={index} overlay={overlay} edit={edit} setOverlayList={setOverlayList}/>)}
        
    </div>
}

export default VideoContainer