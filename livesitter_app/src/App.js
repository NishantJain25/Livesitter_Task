import React, {useState,useEffect, useRef} from 'react';
import {BsPause, BsPlay} from 'react-icons/bs'
import VideoContainer from "./components/VideoContainer/VideoContainer"
import './App.css';
import OverlayForm from './components/OverlayForm/OverlayForm';

function App() {
  const videoUrl = "http://localhost:5000/video"
  const [isPlaying, setIsPlaying] = useState(false)
  const [overlayList, setOverlayList] = useState([])
  const [url, setUrl] = useState("")
  const [edit, setEdit] = useState(false)

  useEffect(() => {
    fetch("http://localhost:5000/get/nishantjain2503@gmail.com").then(res => res.json()).then(data => {
      console.log(data[0])
      if(data[0] !== null){
        let array = data.map((overlay) => {
          if(overlay.type === "image"){
            const fetchImage = async() => {
  
                const res = await fetch(`http://localhost:5000/get/images/${overlay['_id'].$oid}/nishantjain2503@gmail.com`)
                
                const imageBlob = await res.blob()
                    
                const imageObjectUrl = URL.createObjectURL(imageBlob)
                overlay.content = imageObjectUrl
                
                URL.revokeObjectURL(imageBlob)
                
                
            }
            fetchImage()
          }
          return overlay
        }
        )
        console.log(array)
        setOverlayList(array)}
      })
  },[])

  const pauseToggle = () => {
    isPlaying ? setUrl("") : setUrl(videoUrl)
    setIsPlaying((currentState) => !currentState)
  }
  return (
    <div className="App">
      
      <div className='container'>
          <h3>Live stream</h3>
          <VideoContainer url={url} overlayList={overlayList} edit={edit} setOverlayList={setOverlayList}/>
        <div className='video-controls'>
          <button id="pauseToggle" onClick={pauseToggle}>{isPlaying ? <BsPause size={50}/> : <BsPlay size={50}/>}</button>
        </div>
        <div className='overlay-controls'>
          <OverlayForm setOverlayList={setOverlayList} setEdit={setEdit}/>
        <button onClick={() => setEdit((currentState => !currentState))}>{edit? "Finish Editing" :"Edit Overlays"}</button>
        </div>
      </div>
    </div>
  );
}

export default App;
