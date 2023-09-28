import React, { useState } from "react";
import './OverlayForm.css'

const OverlayForm = ({setOverlayList, setEdit}) => {
    const [addOverlay, setAddOverlay] = useState(false)
    const [formData, setFormData] = useState({"name":"My Overlay 1", "type":"text","x":0,'y':0,'h': "100px", 'w': "150px","content": ""})
    const onAddOverlay = () => {
        setAddOverlay(true)
        setEdit(true)
    }
    const handleInputChange = (e) => {
        if(e.target.type === "file"){
            console.log(e.target)
            setFormData(currentData => ({...currentData, [e.target.name] : e.target.files[0]}))
        }else{

            setFormData(currentData => ({...currentData, [e.target.name] : e.target.value}))
        }
    }
    const createOverlay =  () => {
        console.log("Creating overlay: ", formData)
        const data = new FormData()
        data.append("user_email","nishantjain2503@gmail.com")
        data.append('name', formData.name)
        data.append('type', formData.type)
        data.append('x', formData.x)
        data.append('y', formData.y)
        data.append('w', formData.w)
        data.append('h', formData.h)
        data.append('content', formData.content)
        
        fetch('http://localhost:5000/create',
      {
        method: 'POST',
        body: data,
        //headers: {"Content-Type": "multipart/form-data"}
      }
    ).then(res => {console.log(res) 
        return res.json()}).then(data => {

        var json_data = JSON.parse(data)
    
        if(json_data.type === "image"){
            let src = URL.createObjectURL(formData.content)
            URL.revokeObjectURL(formData.content)
            json_data.content = src
        }
        
        setOverlayList((currentList => [...currentList, json_data]))
        handleCancel()})
    }

    const handleCancel = () => {
         setAddOverlay(false)
         setEdit(false)
    }
    
    return <div>
       <button onClick={onAddOverlay}>+ Add New Overlay</button>
       {addOverlay && (<div className="overlay-form">
        <div className="form-item">
        <label for="name">Name </label>
        <input name="name" value={formData.name} onChange={handleInputChange}/>
        </div>
        <div className="form-item">
        <label for="name">type </label>
        <select name="type" onChange={handleInputChange} value={formData.type}>
            <option value="text">Text</option>
            <option value="image">Image</option>
        </select>
        </div>
        {formData.type === "text" ? <div className="form-item"><label for="content">Text</label><input name="content" placeholder="Enter Text" value={formData.content} onChange={handleInputChange}/></div> : <div className="form-item"><label for="content">Image</label><input name="content" type="file" value={formData.content?.filename} onChange={handleInputChange} accept=".jpg,.png"/></div>}
        <div className="buttons">
        <button onClick={createOverlay}>Create</button>
        <button onClick={handleCancel}>Cancel</button>
        </div>
        </div>)}
    </div>
}

export default OverlayForm