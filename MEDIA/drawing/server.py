from flask import Flask, request, jsonify
from flask_cors import CORS  # Import CORS

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})  # Allow all origins

@app.route('/generate_gif', methods=['POST'])
def generate_gif():
    data = request.json
    if not data or 'images' not in data:
        return jsonify({'error': 'No image data received'}), 400
    # Your GIF saving logic here
    return jsonify({'message': 'GIF saved successfully'})

if __name__ == '__main__':
    app.run(port=5001, debug=True)  # Ensure it's running on port 5001
