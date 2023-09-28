import React, { forwardRef, useState, useEffect, useRef } from "react";
import './Overlay.css'
import { BsTrash } from "react-icons/bs";

const Overlay = ({overlay, edit, setOverlayList}) => {
    const [isHovering, setIsHovering] = useState(false)

    const boxRef = useRef(null)
    const isClicked = useRef(false)
    const isResizing = useRef(false)
    const coords = useRef({startX:0, startY:0, lastX:parseInt(overlay.x,10), lastY:parseInt(overlay.y,10)})
    const refT = useRef(null)
    const refR = useRef(null)
    const refB = useRef(null)
    const refL = useRef(null)

    const handleDelete = () => {
        fetch(`http://localhost:5000/delete/${overlay["_id"].$oid}/nishantjain2503@gmail.com`).then(res => console.log(res.json()))
        setOverlayList((overlayList) => overlayList.filter((overlayItem) => overlayItem["_id"] !== overlay["_id"]))
    }
    useEffect(()=>{
        console.log(overlay)
        if(!edit){
            return
        }
        if(!boxRef.current){
          return
        }
        const box = boxRef.current
        console.log(overlay)
        const styles = window.getComputedStyle(box)
        let width = parseInt(styles.width, 10) 
        let height = parseInt(styles.height,10) 
        let x = 0 
        let y = 0
        console.log(y)
        
  
        //update position and size
        const updatePositionAndSize = () => {
            const lastStyle = window.getComputedStyle(box)
            const data = new FormData()
            data.append('id', overlay["_id"].$oid)
            data.append('x', coords.current.lastX)
            data.append('y',coords.current.lastY)
            data.append('h',lastStyle.height)
            data.append('w',lastStyle.width)
            
            fetch('http://localhost:5000/update',{
                method:"POST",
                body:data
              }).then(res => res.json())
        }
        //Right Resize
        const onMouseDownRightResize = (e) => {
            console.log(styles.left)
          x = e.clientX //getting current position
          box.style.left = styles.left
          box.style.right = null
          document.addEventListener("mousemove",onMouseMoveRightResize)
          document.addEventListener("mouseup",onMouseUpRightResize)
        }
        const onMouseMoveRightResize = (e) => {
          isResizing.current = true
          let dx = e.clientX - x //getting change in position
          x = e.clientX //setting the new position
          width = width + dx //getting new width
          box.style.width = `${width}px`
        }
        const onMouseUpRightResize = () => {
          document.removeEventListener("mousemove",onMouseMoveRightResize)
          isResizing.current = false
          updatePositionAndSize()
        }
        //Left Resize
        const onMouseDownLeftResize = (e) => {
          x = e.clientX //getting current position
          box.style.right = styles.right
          document.addEventListener("mousemove",onMouseMoveLeftResize)
          document.addEventListener("mouseup",onMouseUpLeftResize)
        }
        const onMouseMoveLeftResize = (e) => {
          isResizing.current = true
          isClicked.current = false
          let dx = e.clientX - x //getting change in position
          x = e.clientX //setting the new position
          width = width - dx //getting new width
          box.style.width = `${width}px`
          box.style.left = `${box.offsetLeft + dx}px`
        }
        const onMouseUpLeftResize = () => {
          document.removeEventListener("mousemove",onMouseMoveLeftResize)
          isResizing.current = false
          updatePositionAndSize()
        }
  
        //Top Resize
        const onMouseDownTopResize = (e) => {
          y = e.clientY
          const styles = window.getComputedStyle(box)
          box.style.bottom = styles.bottom
          
          document.addEventListener('mousemove',onMouseMoveTopResize)
          document.addEventListener('mouseup', onMouseUpTopResize)
        }
  
        const onMouseMoveTopResize = (e) => {
          isResizing.current = true
          let dy = e.clientY - y
          y = e.clientY
          height = height - dy
          box.style.height = `${height}px`
          box.style.top = `${box.offsetTop + dy}px`
        }
        
        const onMouseUpTopResize = () => {
          document.removeEventListener('mousemove',onMouseMoveTopResize)
          isResizing.current = false
          updatePositionAndSize()
        }
  
        //Bottom Resize
        const onMouseDownBottomResize = (e) => {
          y = e.clientY
          box.style.top = styles.top
          box.style.bottom = null
          document.addEventListener("mousemove", onMouseMoveBottomResize)
          document.addEventListener("mouseup", onMouseUpBottomResize)
        }
  
        const onMouseMoveBottomResize = (e) => {
          isResizing.current = true
          let dy = e.clientY - y
          y = e.clientY
          height = height + dy
          box.style.height = `${height}px`
        }
  
        const onMouseUpBottomResize = () => {
          document.removeEventListener('mousemove', onMouseMoveBottomResize)
          isResizing.current = false
          updatePositionAndSize()
        }
  
        // Add mouse down event listener for resize
        const resizerR = refR.current
        const resizerL = refL.current
        const resizerT = refT.current
        const resizerB = refB.current
        resizerR.addEventListener('mousedown', onMouseDownRightResize)
        resizerL.addEventListener('mousedown', onMouseDownLeftResize)
        resizerT.addEventListener('mousedown', onMouseDownTopResize)
        resizerB.addEventListener('mousedown', onMouseDownBottomResize)
  
        const onMouseDown = (e) => {
          
          if(isResizing.current){return}
  
              isClicked.current = true
              coords.current.startX = e.clientX
              coords.current.startY = e.clientY
          
        }
        const onMouseUp = () => {
          isClicked.current = false
          coords.current.lastX = box.offsetLeft
          coords.current.lastY = box.offsetTop
          updatePositionAndSize()
        }
        const onMouseMove = (e) => {
          if(!isClicked.current || isResizing.current){ return}
          console.log(coords.current.lastX)
          const nextX = e.clientX - coords.current.startX + coords.current.lastX
          const nextY = e.clientY - coords.current.startY + coords.current.lastY
          if(nextX > -10 && nextY > -10){
              box.style.top = `${nextY}px`
              box.style.left = `${nextX}px`
          }
      
        }
        box.addEventListener('mousedown',onMouseDown)
        box.addEventListener('mouseup',onMouseUp)
        document.addEventListener('mousemove',onMouseMove)
        document.addEventListener('mouseup',onMouseUp)
        const cleanup = () => {
          box.removeEventListener('mousedown', onMouseDown)
          box.removeEventListener('mouseup',onMouseUp)
          document.removeEventListener('mousemove',onMouseMove)
          document.removeEventListener('mousemup',onMouseUp)
          resizerR.removeEventListener('mousedown', onMouseDownRightResize)
          resizerT.removeEventListener('mousedown', onMouseDownLeftResize)
          resizerT.removeEventListener('mousedown', onMouseDownTopResize)
          resizerB.removeEventListener('mousedown', onMouseDownBottomResize)
  
        }
        return cleanup
      },[edit])


    return <div className='box' ref={boxRef} style={{cursor: `${edit ? "move" : "auto"}` , left: `${overlay.x}px`, top: overlay.y + "px", width: overlay.w, height: overlay.h}} onMouseEnter={() => setIsHovering(true)} onMouseLeave={() => setIsHovering(false)}>
    
    <div className="content">
        {overlay.type === "image" ? <img src={overlay.content} /> : <p id="overlay-text">{overlay.content}</p>}
    </div>
    <div className="resizer rt" ref={refT} style={{borderTop: `${edit ? " 2px dashed black" : "transparent"}`,cursor: `${edit ? "row-resize" : "auto"}` }}></div>
    <div className="resizer rr" ref={refR} style={{borderRight: `${edit ? " 2px dashed black" : "transparent"}`,cursor: `${edit ? "col-resize" : "auto"}` }}></div>
    <div className="resizer rb" ref={refB} style={{borderBottom: `${edit ? " 2px dashed black" : "transparent"}`,cursor: `${edit ? "row-resize" : "auto"}` }}></div>
    <div className="resizer rl" ref={refL} style={{borderLeft: `${edit ? " 2px dashed black" : "transparent"}`,cursor: `${edit ? "col-resize" : "auto"}` }}></div>
    {isHovering && <button id="delete" onClick={handleDelete}><BsTrash/></button>}
</div>
}

export default Overlay