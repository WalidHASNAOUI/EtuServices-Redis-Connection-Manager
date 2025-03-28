from flask import Flask, request, jsonify
import redis
import time

app = Flask(__name__)

r = redis.Redis(host='127.0.0.1', port=6379, db=0)

MAX_CONNECTIONS = 10
WINDOW_SECONDS = 600  # 10 minutes

@app.route('/can_user_connect', methods=['POST'])
def can_user_connect():
    data = request.get_json()
    user_id = data.get("user_id")

    now = int(time.time())
    window_start = now - WINDOW_SECONDS
    key = f"user:{user_id}:timestamps"

    # Clean old timestamps by trimming the list to only valid timestamps (within the window)
    timestamps = r.lrange(key, 0, -1)
    valid_timestamps = []
    for t in timestamps:
        t_int = int(t)
        if t_int > window_start:
            valid_timestamps.append(t_int)

    # Check if the user can connect
    if len(valid_timestamps) < MAX_CONNECTIONS:
        # User can connect, add the new timestamp
        valid_timestamps.append(now)
        
        # Store the updated list back in Redis (trim and then push)
        r.delete(key)  # Optional, can be skipped if you want to trim
        for t in valid_timestamps:
            r.rpush(key, t)

        # Trim the list to only keep the MAX_CONNECTIONS number of timestamps
        r.ltrim(key, 0, MAX_CONNECTIONS - 1)

        return jsonify({"allowed": True})
    else:
        return jsonify({"allowed": False})

if __name__ == '__main__':
    app.run(port=5001, debug=True)
