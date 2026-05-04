from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.token_model import Token
from models.settings_model import Setting
from models.asset_model import Asset
from models.user_model import User
from datetime import datetime, timedelta

admin_bp = Blueprint('admin', __name__)


def admin_only():
    identity = get_jwt_identity()
    if not identity or not identity.get('is_admin'):
        return False
    return True




# Statistics Endpoints
@admin_bp.route('/stats', methods=['GET'])
@jwt_required()
def get_stats():
    if not admin_only():
        return jsonify({'error': 'admin required'}), 403
    try:
        total_queues = Token.objects().count()
        active_users = User.objects().count()
        
        # Calculate average wait time
        today_tokens = Token.objects(created_at__gte=datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0))
        avg_wait = 0
        if today_tokens.count() > 0:
            total_wait = sum([t.estimated_wait or 0 for t in today_tokens])
            avg_wait = total_wait // today_tokens.count()
        
        completed_today = Token.objects(status='served', created_at__gte=datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)).count()
        
        return jsonify({
            'stats': {
                'totalQueues': total_queues,
                'activeUsers': active_users,
                'avgWaitTime': avg_wait,
                'completedToday': completed_today
            }
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400


# Asset Management Endpoints
@admin_bp.route('/assets', methods=['GET'])
@jwt_required()
def get_assets():
    if not admin_only():
        return jsonify({'error': 'admin required'}), 403
    try:
        assets = Asset.objects().order_by('-created_at')
        return jsonify({'assets': [a.to_dict() for a in assets]}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400


@admin_bp.route('/asset', methods=['POST'])
@jwt_required()
def create_asset():
    if not admin_only():
        return jsonify({'error': 'admin required'}), 403
    
    data = request.get_json() or {}
    name = data.get('name')
    branch = data.get('branch')
    location = data.get('location')
    service_type = data.get('service_type')
    max_capacity = data.get('max_capacity', 50)
    status = data.get('status', 'open')
    
    if not name or not branch:
        return jsonify({'error': 'name and branch required'}), 400
    
    try:
        asset = Asset(
            name=name,
            branch=branch,
            location=location,
            service_type=service_type,
            max_capacity=max_capacity,
            status=status
        )
        asset.save()
        return jsonify({'asset': asset.to_dict()}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 400


@admin_bp.route('/asset/<asset_id>', methods=['PUT'])
@jwt_required()
def update_asset(asset_id):
    if not admin_only():
        return jsonify({'error': 'admin required'}), 403
    
    try:
        asset = Asset.objects(id=asset_id).first()
        if not asset:
            return jsonify({'error': 'asset not found'}), 404
        
        data = request.get_json() or {}
        
        if 'name' in data:
            asset.name = data['name']
        if 'branch' in data:
            asset.branch = data['branch']
        if 'location' in data:
            asset.location = data['location']
        if 'service_type' in data:
            asset.service_type = data['service_type']
        if 'max_capacity' in data:
            asset.max_capacity = data['max_capacity']
        if 'status' in data:
            asset.status = data['status']
        
        asset.updated_at = datetime.utcnow()
        asset.save()
        
        return jsonify({'asset': asset.to_dict()}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400


@admin_bp.route('/asset/<asset_id>', methods=['DELETE'])
@jwt_required()
def delete_asset(asset_id):
    if not admin_only():
        return jsonify({'error': 'admin required'}), 403
    
    try:
        asset = Asset.objects(id=asset_id).first()
        if not asset:
            return jsonify({'error': 'asset not found'}), 404
        
        asset.delete()
        return jsonify({'message': 'asset deleted successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400
@jwt_required()
def get_queue(branch, service_type):
    if not admin_only():
        return jsonify({'error': 'admin required'}), 403
    try:
        tokens = Token.objects(branch=branch, service_type=service_type).order_by('created_at')
        return jsonify({'queue': [t.to_dict() for t in tokens]}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400


@admin_bp.route('/counter/toggle', methods=['POST'])
@jwt_required()
def toggle_counter():
    if not admin_only():
        return jsonify({'error': 'admin required'}), 403
    data = request.get_json() or {}
    # Placeholder: counters would be managed by another model or service.
    # For now we just accept the action and return success.
    return jsonify({'status': 'ok', 'detail': 'counter toggle accepted (not persisted)'}), 200


@admin_bp.route('/settings/avg_time', methods=['POST'])
@jwt_required()
def update_avg_time():
    if not admin_only():
        return jsonify({'error': 'admin required'}), 403
    data = request.get_json() or {}
    branch = data.get('branch')
    service_type = data.get('service_type')
    avg_time = data.get('avg_service_time')

    if not branch or not service_type or avg_time is None:
        return jsonify({'error': 'branch, service_type and avg_service_time required'}), 400

    try:
        setting = Setting.objects(branch=branch, service_type=service_type).first()
        if not setting:
            setting = Setting(branch=branch, service_type=service_type, avg_service_time=avg_time)
        else:
            setting.avg_service_time = avg_time
        setting.save()
        return jsonify({'setting': setting.to_dict()}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400


@admin_bp.route('/alerts', methods=['GET'])
@jwt_required()
def view_alerts():
    if not admin_only():
        return jsonify({'error': 'admin required'}), 403
    try:
        alerts = Token.objects(alert_sent=True).order_by('-created_at').limit(100)
        return jsonify({'alerts': [t.to_dict() for t in alerts]}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400
