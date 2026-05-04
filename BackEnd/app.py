from flask import Flask
from flask_jwt_extended import JWTManager
import mongoengine as me
from config import Config

jwt = JWTManager()


def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    # Connect to MongoDB
    me.connect(db='queue_db', host=app.config.get('MONGODB_URI', 'mongodb://localhost:27017/queue_db'))
    
    jwt.init_app(app)

    # Register blueprints
    from routes.auth_routes import auth_bp
    from routes.token_routes import token_bp
    from routes.admin_routes import admin_bp
    from routes.asset_routes import assets_bp

    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(token_bp, url_prefix='/api/token')
    app.register_blueprint(admin_bp, url_prefix='/api/admin')
    app.register_blueprint(assets_bp, url_prefix='/api/assets')

    @app.route('/health')
    def health():
        return {'status': 'ok', 'database': 'MongoDB'}

    return app


if __name__ == '__main__':
    app = create_app()
    app.run(host='0.0.0.0', port=5000, debug=True)
