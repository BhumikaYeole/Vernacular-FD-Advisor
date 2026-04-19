from flask import Flask
from flask_cors import CORS
from routes.chat import chat_bp
from routes.fd import fd_bp

app = Flask(__name__)

# Proper CORS config
CORS(app, resources={r"/*": {"origins": "*"}})

app.register_blueprint(chat_bp)
app.register_blueprint(fd_bp)

if __name__ == "__main__":
    app.run(debug=True)