from flask import Flask, request, jsonify, send_file
from flask_cors import CORS  # Import CORS
import os
from PIL import Image
import base64
import io

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route('/save', methods=['POST'])
def save_animation():
    try:
        data = request.json
        images = data.get('images', [])

        if not images:
            return jsonify({"error": "No images received"}), 400

        frames = []
        for img_data in images:
            img = Image.open(io.BytesIO(base64.b64decode(img_data.split(",")[1])))
            frames.append(img)

        gif_path = "output.gif"
        frames[0].save(gif_path, save_all=True, append_images=frames[1:], duration=100, loop=0)

        return send_file(gif_path, mimetype='image/gif', as_attachment=True, download_name="animation.gif")

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
