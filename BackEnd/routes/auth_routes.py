from flask import Blueprint, request, jsonify
from models.user_model import User
from flask_jwt_extended import create_access_token

auth_bp = Blueprint('auth', __name__)


@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json() or {}
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')
    phone = data.get('phone')

    if not name or not email or not password:
        return jsonify({'error': 'Missing fields'}), 400

    try:
        if User.objects(email=email).first():
            return jsonify({'error': 'Email already registered'}), 400

        user = User(name=name, email=email, phone=phone)
        user.set_password(password)
        user.save()

        access_token = create_access_token(identity={'id': str(user.id), 'is_admin': user.is_admin})
        return jsonify({'user': user.to_dict(), 'access_token': access_token}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 400


@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json() or {}
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({'error': 'Missing credentials'}), 400

    try:
        user = User.objects(email=email).first()
        if not user or not user.check_password(password):
            return jsonify({'error': 'Invalid credentials'}), 401

        access_token = create_access_token(identity={'id': str(user.id), 'is_admin': user.is_admin})
        return jsonify({'user': user.to_dict(), 'access_token': access_token}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400
