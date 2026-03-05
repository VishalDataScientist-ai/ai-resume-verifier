import os

class Config:
    import os
    db_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'database.db')
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL', f'sqlite:///{db_path}')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SECRET_KEY = os.getenv('SECRET_KEY', 'dev-secret-key')
    GITHUB_TOKEN = os.getenv('GITHUB_TOKEN', '')
