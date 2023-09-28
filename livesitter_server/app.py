import os
from flask import Flask, Response, render_template, request, jsonify, send_from_directory
from flask_cors import CORS
import cv2
import pyaudio
import numpy as np
from flask_pymongo import PyMongo
from bson import json_util, ObjectId
import json



UPLOAD_FOLDER = os.curdir + '/images'
ALLOWED_EXTENSIONS =    set(['jpg','png'])
app = Flask(__name__)
app.config['MONGO_URI'] = "mongodb://localhost:27017/livesitter"
mongo = PyMongo(app)



app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

rtspurl = "rtsp://zephyr.rtsp.stream/movie?streamKey=7c0c682d2912be8ba00f26888798865b"
CORS(app)

@app.route('/')
def index():
    print("request")
    return render_template('index.html')


def gen_frames():
    camera = cv2.VideoCapture(rtspurl) #triggers the live feed from RTSP link and reads the first frame of the video
    
    
    while True:
        #success - bool type, returns true if Python is able to read the VideoCapture object.
        #frame - numpy array, represents the first image that video captures
        success, frame = camera.read()
        if not success:
            print("not success")
            continue
        else:
            
            

            ret, buffer = cv2.imencode('.jpg', frame) #encode the image format into streaming data. Mainly used to compress image data
            frame = buffer.tobytes()

            print(frame)
            
            yield (b'--frame\r\n'b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n') #yield keyword lets the execution to continue and keeps generating frames till alive.

@app.route('/video')
def video():
    print("Sending video")
    return Response(gen_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')



@app.route('/create', methods= ['POST'])
def create_overlay():
    print("creating overlay")
    if request.method == "POST":
        print(request.files)
        user_email = request.form.get('user_email')
        name = request.form.get('name')
        type = request.form.get('type')
        x = request.form.get('x')
        y = request.form.get('y')
        h = request.form.get('h')
        w = request.form.get('w')
        
        size = request.form.get('size')
        
        if type == 'text':
            content = request.form.get('content')
            result = mongo.db.overlays.insert_one({'name':name, 'type': type, 'x':x,'y':y,'h':h,'w':w, 'content':content})
            mongo.db.users.update_one({"email": user_email},{"$push": {"overlays": result.inserted_id}})
            return jsonify(json_util.dumps({"_id": result.inserted_id, 'name':name, 'type': type, 'x':x,'y':y,'h':h,'w':w, 'content':content}))
        
        elif type == 'image':
            new_folder = "/".join([UPLOAD_FOLDER, user_email])
            if not os.path.isdir(UPLOAD_FOLDER):
                os.mkdir(UPLOAD_FOLDER)
                os.mkdir(new_folder)
            file = request.files['content']
            filename = file.filename
            file.save(os.path.join(new_folder, filename))
            result = mongo.db.overlays.insert_one({'name':name, 'type': type, 'x':x,'y':y,'h':h,'w':w, 'content':filename})
            mongo.db.users.update_one({"email": user_email},{"$push": {"overlays": result.inserted_id}})
            return jsonify(json_util.dumps({"_id": result.inserted_id, 'name':name, 'type': type, 'x':x,'y':y,'h':h,'w':w, 'content':filename}))
        
        #user = mongo.db.users.insert({'username': username, 'overlays':[]})
            
@app.route('/get/<user_email>')
def get_overlays(user_email):
    user_overlays = mongo.db.users.find_one({"email": user_email},{"overlays":1})
    
    overlay_list = []
    for i in user_overlays['overlays']:
        overlay_list.append(mongo.db.overlays.find_one({"_id": i}))
    
    return json.loads(json_util.dumps(overlay_list))

@app.route('/get/images/<overlay_id>/<user_email>')
def get_image(overlay_id, user_email):
    overlay = mongo.db.overlays.find_one({"_id":ObjectId(overlay_id)},{"content":1})
    print(user_email)
    #file = mongo.db.fs.files.find( { "filename":overlay['content'] } ).sort( { "uploadDate": 1 } )
    path = "/".join([UPLOAD_FOLDER, user_email])
    print(path)
    return send_from_directory(path, overlay['content'], as_attachment=True)

@app.route('/update', methods=['POST'])
def update_overlay():
    id = request.form.get('id')
    print(id)
    id_object = ObjectId(id)
    x = request.form.get('x')
    y = request.form.get('y')
    w = request.form.get('w')
    h = request.form.get('h')
    mongo.db.overlays.update_one({"_id":id_object},{"$set": {'x':x,'y':y,'h':h,'w':w}})
    return {"message":"Updated"}

@app.route("/delete/<overlay_id>/<user_email>")
def delete_overlay(overlay_id, user_email):
    print(overlay_id)
    mongo.db.users.update_one({"email":user_email},{"$pull": {"overlays" :  ObjectId(overlay_id)}})
    mongo.db.overlays.delete_one({"_id": ObjectId(overlay_id)})
    return {"message": "overlay deleted"}

if __name__ == "__main__":
    app.run(debug=True)