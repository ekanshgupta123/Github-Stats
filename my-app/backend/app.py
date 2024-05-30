from flask import Flask, request, jsonify
import requests
from flask_cors import CORS
from dotenv import load_dotenv
import os
from collections import Counter

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

GITHUB_TOKEN = os.getenv('GITHUB_TOKEN')

def get_all_repos(username):
    repos = []
    page = 1
    while True:
        user_url = f'https://api.github.com/users/{username}/repos'
        headers = {'Authorization': f'token {GITHUB_TOKEN}'}
        params = {'per_page': 100, 'page': page}
        response = requests.get(user_url, headers=headers, params=params)
        
        if response.status_code != 200:
            break

        page_repos = response.json()
        if not page_repos:
            break

        repos.extend(page_repos)
        page += 1

    return repos

def get_repo_languages(repos):
    languages = Counter()
    headers = {'Authorization': f'token {GITHUB_TOKEN}'}
    
    for repo in repos:
        languages_url = repo['languages_url']
        response = requests.get(languages_url, headers=headers)
        if response.status_code == 200:
            repo_languages = response.json()
            languages.update(repo_languages)

    return dict(languages)

@app.route('/github-stats/<username>', methods=['GET'])
def get_github_stats(username):
    repos = get_all_repos(username)

    total_size = sum(repo['size'] for repo in repos)
    average_size = total_size / len(repos) if repos else 0


    if not repos:
        return jsonify({'error': 'User not found or API limit exceeded'}), 404

    aggregated_stats = {
        'total_repos': len(repos),
        'total_stars': sum(repo['stargazers_count'] for repo in repos),
        'total_forks': sum(repo['forks_count'] for repo in repos),
        'total_issues': sum(repo['open_issues_count'] for repo in repos),
        'total_stargazers': sum(repo['stargazers_count'] for repo in repos),
        'average_size': average_size,
        'languages': get_repo_languages(repos)
    }

    return jsonify(aggregated_stats)

@app.route('/github-repositories/<username>', methods=['GET'])
def get_github_repositories(username):
    repos = get_all_repos(username)

    if not repos:
        return jsonify({'error': 'User not found or API limit exceeded'}), 404

    repo_list = [
        {
            'id': repo['id'],
            'name': repo['name'],
            'html_url': repo['html_url'],
            'description': repo['description'],
            'stargazers_count': repo['stargazers_count'],
            'forks_count': repo['forks_count'],
            'open_issues_count': repo['open_issues_count'],
            'language': repo['language'],
            'created_at': repo['created_at']
        }
        for repo in repos
    ]

    return jsonify(repo_list)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
