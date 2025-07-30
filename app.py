import requests
from flask import Flask, request, jsonify

app = Flask(__name__)

NEWS_API_KEY = '5fd477b06b4f44c09ea92e0c41a6bb6f'  # replace this soon

@app.route('/')
def home():
    return "🗞️ Welcome to PulsePoint News Finder!"

@app.route('/news')
def get_news():
    topic = request.args.get('topic', default='technology')
    url = f'https://newsapi.org/v2/everything?q={topic}&apiKey={NEWS_API_KEY}'

    response = requests.get(url)
    data = response.json()

    # Just get first 5 headlines
    articles = data.get('articles', [])[:5]
    headlines = [article['title'] for article in articles]

    return jsonify({
        'topic': topic,
        'headlines': headlines
    })

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 8080))
    app.run(host='0.0.0.0', port=port)

