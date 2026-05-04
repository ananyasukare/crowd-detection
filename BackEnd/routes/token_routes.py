from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.user_model import User
from models.token_model import Token
from models.settings_model import Setting
from utils.wait_time import estimate_wait_minutes
import datetime

token_bp = Blueprint('token', __name__)


@token_bp.route('/book', methods=['POST'])
@jwt_required()
def book_token():
    identity = get_jwt_identity()
    user_id = identity.get('id')
    data = request.get_json() or {}
    branch = data.get('branch')
    service_type = data.get('service_type')

    if not branch or not service_type:
        return jsonify({'error': 'branch and service_type are required'}), 400

    try:
        # Determine next token number for this branch and service today
        today_start = datetime.datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)
        count = Token.objects(branch=branch, service_type=service_type, created_at__gte=today_start).count()
        token_number = count + 1

        # get avg service time
        setting = Setting.objects(branch=branch, service_type=service_type).first()
        avg_service_time = setting.avg_service_time if setting else 5

        # estimate wait
        pending_count = Token.objects(branch=branch, service_type=service_type, status='waiting').count()
        estimated = estimate_wait_minutes(pending_count, avg_service_time)

        user = User.objects(id=user_id).first()
        token = Token(token_number=token_number, user_id=user, branch=branch, service_type=service_type, estimated_wait=estimated)
        token.save()

        return jsonify({'token': token.to_dict()}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 400


@token_bp.route('/my', methods=['GET'])
@jwt_required()
def my_token():
    identity = get_jwt_identity()
    user_id = identity.get('id')
    try:
        token = Token.objects(user_id=user_id).order_by('-created_at').first()
        if not token:
            return jsonify({'token': None}), 200
        return jsonify({'token': token.to_dict()}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400


@token_bp.route('/branch/<branch>/service/<service_type>', methods=['GET'])
def queue_status(branch, service_type):
    try:
        # public endpoint for crowd status
        waiting = Token.objects(branch=branch, service_type=service_type, status='waiting').count()
        serving = Token.objects(branch=branch, service_type=service_type, status='serving').count()
        return jsonify({'waiting': waiting, 'serving': serving}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400
