from flask import Flask, request, jsonify
from flask_cors import CORS
import jwt
import logging
from logging.handlers import RotatingFileHandler
import os

app = Flask(__name__)
CORS(
    app,
    origins="http://localhost:3000",
    supports_credentials=True,
    allow_headers=["Content-Type", "Authorization"],
    methods=["GET", "POST", "OPTIONS"],
)

app.config["SECRET_KEY"] = "muzukurusecretkey"


LOG_FILE = os.path.join(os.path.dirname(__file__), "app.log")
handler = RotatingFileHandler(LOG_FILE, maxBytes=1_000_000, backupCount=3)
formatter = logging.Formatter("%(asctime)s - %(levelname)s - %(message)s")
handler.setFormatter(formatter)

logger = logging.getLogger("muzukuru_backend")
logger.setLevel(logging.INFO)
logger.addHandler(handler)

users = {}


@app.before_request
def log_request_info():
    logger.info(f"Incoming request: {request.method} {request.path}")


@app.after_request
def log_response_info(response):
    logger.info(f"Response {response.status} for {request.method} {request.path}")
    return response


@app.route("/")
def index():
    return "Muzukuru Backend is running!"


@app.route("/register", methods=["POST"])
def register():
    data = request.json
    username = data.get("username")
    password = data.get("password")

    if username in users:
        logger.warning(f"Registration failed: {username} already exists")
        return jsonify({"message": "User already exists"}), 400

    users[username] = password
    logger.info(f"User registered: {username}")
    return jsonify({"message": "User created successfully"}), 201


@app.route("/login", methods=["POST"])
def login():
    data = request.json
    username = data.get("username")
    password = data.get("password")

    logger.info(f"Login attempt for: {username}")
    if username in users and users[username] == password:
        token = jwt.encode(
            {"username": username}, app.config["SECRET_KEY"], algorithm="HS256"
        )
        logger.info(f"Login successful for: {username}")
        return jsonify({"access_token": token})

    logger.warning(f"Login failed for: {username}")
    return jsonify({"message": "Invalid credentials"}), 401


@app.route("/protected", methods=["GET"])
def protected():
    token = request.headers.get("Authorization")
    if token:
        try:
            data = jwt.decode(
                token.split()[1], app.config["SECRET_KEY"], algorithms=["HS256"]
            )
            logger.info(f"Protected access granted for {data['username']}")
            return jsonify({"message": f"Hello, {data['username']}!"})
        except jwt.ExpiredSignatureError:
            logger.error("Token expired")
            return jsonify({"message": "Token has expired"}), 401
        except jwt.InvalidTokenError:
            logger.error("Invalid token")
            return jsonify({"message": "Invalid token"}), 401

    logger.warning("Missing token in request")
    return jsonify({"message": "Token is missing"}), 401


if __name__ == "__main__":
    app.run(debug=True)
