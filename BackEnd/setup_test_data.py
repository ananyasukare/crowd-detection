#!/usr/bin/env python
"""
Setup script to create test users and assets for the Smart Queue Management System
Run this from the BackEnd directory: python setup_test_data.py
"""

import os
import sys
from pathlib import Path

# Add parent directory to path to import models
sys.path.insert(0, str(Path(__file__).parent))

# Set up Flask app context
os.environ['FLASK_ENV'] = 'development'

from models.user_model import User
from models.asset_model import Asset
import mongoengine as me
from config import Config

# Connect to MongoDB
me.connect(db='queue_db', host=Config.MONGODB_URI)

def create_users():
    """Create test users"""
    print("🔐 Creating test users...")
    
    # Delete existing test users
    User.objects(email__in=['admin@bank.com', 'user@bank.com']).delete()
    
    # Create admin user
    admin = User(
        name='Admin User',
        email='admin@bank.com',
        phone='+1234567890',
        is_admin=True
    )
    admin.set_password('admin123')
    admin.save()
    print(f"✅ Admin user created: admin@bank.com (password: admin123)")
    
    # Create regular user
    user = User(
        name='John Doe',
        email='user@bank.com',
        phone='+0987654321',
        is_admin=False
    )
    user.set_password('user123')
    user.save()
    print(f"✅ Regular user created: user@bank.com (password: user123)")


def create_assets():
    """Create test assets"""
    print("\n🏢 Creating test assets...")
    
    # Delete existing test assets
    Asset.objects().delete()
    
    assets_data = [
        {
            'name': 'Main Counter - Deposits',
            'branch': 'Main Branch',
            'location': 'Ground Floor, Counter 1',
            'service_type': 'Deposits',
            'max_capacity': 50,
            'status': 'open',
            'latitude': 28.6139,
            'longitude': 77.2090
        },
        {
            'name': 'Main Counter - Withdrawals',
            'branch': 'Main Branch',
            'location': 'Ground Floor, Counter 2',
            'service_type': 'Withdrawals',
            'max_capacity': 50,
            'status': 'open',
            'latitude': 28.6145,
            'longitude': 77.2095
        },
        {
            'name': 'Loan Counter',
            'branch': 'Main Branch',
            'location': 'First Floor',
            'service_type': 'Loans',
            'max_capacity': 30,
            'status': 'open',
            'latitude': 28.6150,
            'longitude': 77.2100
        },
        {
            'name': 'Savings Counter',
            'branch': 'East Branch',
            'location': 'Ground Floor',
            'service_type': 'Savings',
            'max_capacity': 40,
            'status': 'open',
            'latitude': 28.5921,
            'longitude': 77.2499
        },
        {
            'name': 'Checkbook Counter',
            'branch': 'West Branch',
            'location': 'Ground Floor',
            'service_type': 'Checkbooks',
            'max_capacity': 25,
            'status': 'closed',
            'latitude': 28.6459,
            'longitude': 77.1703
        },
    ]
    
    for asset_data in assets_data:
        asset = Asset(**asset_data)
        asset.save()
        print(f"✅ Asset created: {asset_data['name']} at {asset_data['branch']}")


def main():
    try:
        print("\n" + "="*60)
        print("🏦 Smart Queue Management System - Setup Test Data")
        print("="*60 + "\n")
        
        create_users()
        create_assets()
        
        print("\n" + "="*60)
        print("✨ Setup completed successfully!")
        print("="*60)
        print("\n📝 Test Credentials:")
        print("   Admin    : admin@bank.com / admin123")
        print("   User     : user@bank.com / user123")
        print("\n🌐 Access the system:")
        print("   Frontend : http://localhost:3000")
        print("   Backend  : http://localhost:5000")
        
    except Exception as e:
        print(f"\n❌ Error during setup: {str(e)}")
        import traceback
        traceback.print_exc()


if __name__ == '__main__':
    main()
