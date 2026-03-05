from services.github_scanner import get_github_client
g = get_github_client()
user = g.get_user('octocat')
repo = list(user.get_repos())[0]
print(type(repo.updated_at))
print(repo.updated_at)
