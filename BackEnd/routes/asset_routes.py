from flask import Blueprint, request, jsonify
from models.asset_model import Asset
import math

assets_bp = Blueprint('assets', __name__)


def calculate_distance(lat1, lon1, lat2, lon2):
    """Calculate distance between two coordinates using Haversine formula (in km)"""
    R = 6371  # Earth radius in kilometers
    
    lat1_rad = math.radians(lat1)
    lat2_rad = math.radians(lat2)
    delta_lat = math.radians(lat2 - lat1)
    delta_lon = math.radians(lon2 - lon1)
    
    a = math.sin(delta_lat / 2) ** 2 + math.cos(lat1_rad) * math.cos(lat2_rad) * math.sin(delta_lon / 2) ** 2
    c = 2 * math.asin(math.sqrt(a))
    
    return R * c


@assets_bp.route('/nearby', methods=['GET'])
def get_nearby_assets():
    """Get assets near a specific location"""
    try:
        latitude = request.args.get('latitude', type=float)
        longitude = request.args.get('longitude', type=float)
        radius = request.args.get('radius', default=10, type=float)  # in km
        
        if latitude is None or longitude is None:
            return jsonify({'error': 'latitude and longitude required'}), 400
        
        # Get all assets
        all_assets = Asset.objects()
        nearby_assets = []
        
        # Filter by distance
        for asset in all_assets:
            distance = calculate_distance(latitude, longitude, asset.latitude, asset.longitude)
            if distance <= radius:
                asset_dict = asset.to_dict()
                asset_dict['distance'] = round(distance, 2)  # Add distance in km
                nearby_assets.append(asset_dict)
        
        # Sort by distance
        nearby_assets.sort(key=lambda x: x['distance'])
        
        return jsonify({'assets': nearby_assets}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400


@assets_bp.route('/<asset_id>', methods=['GET'])
def get_asset(asset_id):
    """Get a specific asset by ID"""
    try:
        asset = Asset.objects(id=asset_id).first()
        if not asset:
            return jsonify({'error': 'asset not found'}), 404
        
        return jsonify({'asset': asset.to_dict()}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400


@assets_bp.route('', methods=['GET'])
def get_all_assets():
    """Get all assets"""
    try:
        assets = Asset.objects().order_by('-created_at')
        return jsonify({'assets': [a.to_dict() for a in assets]}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400
