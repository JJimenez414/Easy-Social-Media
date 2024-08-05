from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import math

from functions import *


app = Flask(__name__)
cors = CORS(app, origins="*")

UPLOAD_FOLDER = 'uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Ensure the upload folder exists
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)



@app.route('/')

# This will get video from frontend and do analyses on it
@app.route('/postVideo', methods=['POST'])
def postVideo():
    global mean, dips, peaks, percentage, audio_percentage, l_seconds, length_percentage, l_boolean, height, width, resolution_percentage, aspectR, aspect_percentage
    # Check if the POST request has the file part
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400

    vFile = request.files['file']

    # If user does not select a file, the browser may also submit an empty part without a filename
    if vFile.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    # Use secure_filename to ensure the filename is safe
    filename = secure_filename(vFile.filename)
    
    # Save the file to the specified directory

    vFile.save(os.path.join(app.config['UPLOAD_FOLDER'], filename)) # video.mp4

    l_seconds, l_boolean = video_length(f"./uploads/{filename}")

    if l_boolean == 1:
        length_percentage = 25
    else:
        length_percentage = 0
    
    height, width, r_boolean = video_resolution(f"./uploads/{filename}")
    if r_boolean == 1:
        resolution_percentage = 25
    else:
        resolution_percentage = 0

    aspectR = aspect_ratio(f"./uploads/{filename}")

    if aspectR:
        aspect_percentage = 0
    else:
        aspect_percentage = 25

    convert_mp4_to_mp3(f'./uploads/{filename}', './downloads/audio.mp3')
    mean, dips, peaks, percentage = detect_long_dips_peaks('./downloads/audio.mp3')

    # if mean is nan due to librosa, make sure it changes to an int
    if math.isnan(mean):
        mean = 0
    
    # if mean is 0, then that means there's no audio, and audio_percentage needs to be score 0
    if mean == 0:
        audio_percentage = 0
    else:
        # clear cut indication that user needs to adjust their audio
        if dips or peaks:
            audio_percentage = 0
        else:
            audio_percentage = 25



        # if it's not 0, then adjust percentage marks accordinally
        # audio_percentage = percentage * (25/100) # takes dips and peaks percentages from video, and puts it in a 25% scale
        # print(audio_percentage)
        # if audio_percentage > 2: # if audio percentage is significant, then subtract it from 25
        #     audio_percentage = 25 - int(audio_percentage)
        # else:
        #     audio_percentage = 25 # if it's not that big, then just equal it to 25
    
    return jsonify({'nameRequest': "postVideo", 'filename': filename}) # Verify if this is correct



# This will send data back to frontend
@app.route('/sendData', methods=['GET'])
def sendData():
    response = {'mean': int(mean), 
                'dips': dips,
                'peaks': peaks,
                'audio_percentage': audio_percentage,
                'l_seconds': int(l_seconds),
                'length_percentage': length_percentage,
                'l_boolean': l_boolean,
                'height': height,
                'width': width,
                'resolution_percentage': resolution_percentage,
                'aspect_ratio': aspectR,
                'aspect_percentage': aspect_percentage
                }
    
    return jsonify(response)



# def index():
#     return video_resolution()




if __name__ == '__main__':
    app.run(debug=True, port="8080")