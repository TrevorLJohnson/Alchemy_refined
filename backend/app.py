# backend/app.py

from flask       import Flask, request, jsonify
from flask_cors  import CORS
from datetime    import datetime
import logging

from mcp         import mcp

app = Flask(__name__)
# Allow your React frontend to call this API
CORS(app, resources={r"/api/*": {"origins": "*"}})

logging.basicConfig(level=logging.INFO)

@app.route('/api/chat', methods=['POST'])
def chat():
    data      = request.get_json(force=True)
    user_text = data.get('text', '')

    try:
        # Process the message
        result     = mcp.process(user_text)
        reply      = result["reply"]
        categories = result["categories"]["current"]
        insight    = result["insight"]

        # Portable timestamp: use %I for hour (01–12), then strip leading zero
        ts = datetime.now().strftime("%I:%M %p").lstrip("0")

        return jsonify({
            "reply":      reply,
            "timestamp":  ts,
            "categories": categories,
            "insight":    insight
        })

    except Exception as e:
        app.logger.exception("Error in /api/chat")
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)
