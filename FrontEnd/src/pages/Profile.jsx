import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useContexts';
import { useToast } from '../hooks/useToast';
import { Button, Card, Input, Alert } from '../components/UI';
import { validatePhoneNumber, validatePassword } from '../utils/helpers';

export default function Profile() {
  const navigate = useNavigate();
  const { user, logout, updateProfile, loading } = useAuth();
  const { success, error: showError } = useToast();
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });
  const [changePassword, setChangePassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    current: '',
    new: '',
    confirm: '',
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSaveProfile = async () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name cannot be empty';
    if (formData.phone && !validatePhoneNumber(formData.phone)) newErrors.phone = 'Invalid phone number';
    
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      const result = await updateProfile(formData);
      if (result.success) {
        success('Profile updated successfully!');
        setEditMode(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
          <Button onClick={() => navigate('/dashboard')}>Back</Button>
        </div>

        {/* Profile Header Card */}
        <Card className="mb-6">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-gradient-to-r from-violet-600 to-violet-900 rounded-full flex items-center justify-center border-2 border-violet-500">
              <span className="text-white text-3xl font-bold">{user?.name?.[0]?.toUpperCase()}</span>
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900">{user?.name}</h2>
              <p className="text-gray-600">{user?.email}</p>
              <div className="flex gap-2 mt-2">
                {user?.is_admin && (
                  <span className="inline-block px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-semibold">Admin</span>
                )}
                <span className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">Active</span>
              </div>
            </div>
            {!editMode && (
              <Button 
                onClick={() => setEditMode(true)}
                variant="secondary"
              >
                Edit Profile
              </Button>
            )}
          </div>
        </Card>

        {/* Profile Information */}
        <Card className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">📋 Personal Information</h2>
          
          {editMode ? (
            <div className="space-y-4 mb-6">
              <Input
                label="Full Name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                error={errors.name}
                containerClassName="w-full"
              />
              <Input
                label="Email Address"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled
                containerClassName="w-full"
              />
              <Input
                label="Phone Number"
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                error={errors.phone}
                containerClassName="w-full"
              />
              <div className="flex gap-2">
                <Button 
                  onClick={handleSaveProfile}
                  loading={loading}
                  className="flex-1"
                >
                  Save Changes
                </Button>
                <Button 
                  onClick={() => {
                    setEditMode(false);
                    setFormData({
                      name: user?.name,
                      email: user?.email,
                      phone: user?.phone,
                    });
                  }}
                  variant="secondary"
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <p className="text-gray-600 text-sm">Full Name</p>
                <p className="font-semibold text-gray-900 mt-1">{user?.name}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Email Address</p>
                <p className="font-semibold text-gray-900 mt-1">{user?.email}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Phone Number</p>
                <p className="font-semibold text-gray-900 mt-1">{user?.phone}</p>
              </div>
            </div>
          )}
        </Card>

        {/* Account Settings */}
        <Card className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">⚙️ Account Settings</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h3 className="font-semibold text-gray-900">Change Password</h3>
                <p className="text-sm text-gray-600">Update your password regularly for account security</p>
              </div>
              <Button 
                onClick={() => setChangePassword(!changePassword)}
                variant="secondary"
                size="sm"
              >
                {changePassword ? 'Cancel' : 'Change'}
              </Button>
            </div>

            {changePassword && (
              <div className="p-4 bg-gray-50 rounded-lg border space-y-3">
                <Input
                  label="Current Password"
                  type="password"
                  value={passwordData.current}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, current: e.target.value }))}
                  containerClassName="w-full"
                />
                <Input
                  label="New Password"
                  type="password"
                  value={passwordData.new}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, new: e.target.value }))}
                  containerClassName="w-full"
                />
                <Input
                  label="Confirm Password"
                  type="password"
                  value={passwordData.confirm}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, confirm: e.target.value }))}
                  containerClassName="w-full"
                />
              </div>
            )}
          </div>
        </Card>

        {/* Danger Zone */}
        <Card className="border-red-200">
          <h2 className="text-xl font-bold text-red-600 mb-6">⚠️ Danger Zone</h2>
          <div className="space-y-3">
            <Button 
              onClick={() => {
                logout();
                success('Logged out successfully');
                navigate('/');
              }}
              variant="danger"
              className="w-full"
            >
              Sign Out
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
