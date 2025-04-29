from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import pyfile_web_scraping
from llm_analysis import analyze_comments

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

@app.route('/scrap', methods=['POST'])
def scrap_comments():
    url = request.json.get('youtube_url')
    if not url:
        return jsonify({"error": "No YouTube URL provided"}), 400
    try:
        file_and_detail = pyfile_web_scraping.scrapfyt(url)
        video_title, video_owner, video_comment_with_replies, video_comment_without_replies = file_and_detail[1:]
        return jsonify({
            "message": "Scraping completed successfully!",
            "video_title": video_title,
            "video_owner": video_owner,
            "comments_with_replies": video_comment_with_replies,
            "comments_without_replies": video_comment_without_replies,
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/chat', methods=['POST'])
def chat():
    
    if not request.is_json:
        return jsonify({"error": "Content-Type must be application/json"}), 415

    data = request.get_json()

    # Ensure 'messages' exists and is a list
    messages = data.get('messages')
    if not isinstance(messages, list):
        return jsonify({"error": "'messages' must be a list"}), 400

    # Find the last user message
    last_user_message = next(
        (msg['content'] for msg in reversed(messages) if msg.get('role') == 'user'),
        None
    )

    if not last_user_message:
        return jsonify({"error": "No user message found"}), 400

    # Path to the CSV file
    full_comments_path = os.path.join(BASE_DIR, "scraped_data", "Full Comments.csv")

    # Generate a summary
    summary = analyze_comments(full_comments_path, last_user_message)
    # Remove newline characters
    summary_clean = summary.replace("\n", " ")
    
    return jsonify(summary_clean)

if __name__ == "__main__":
    app.run(debug=True)
