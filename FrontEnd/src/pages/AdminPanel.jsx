import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAssets } from '../hooks/useContexts';
import { useToast } from '../hooks/useToast';
import { Button, Card, Input, Modal, LoadingSpinner, Stat, Badge } from '../components/UI';
import axios from 'axios';

export default function AdminPanel() {
  const navigate = useNavigate();
  const { success, error: showError } = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [stats, setStats] = useState({
    totalQueues: 0,
    activeUsers: 0,
    avgWaitTime: 0,
    completedToday: 0
  });
  
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    service_type: '',
    branch: '',
    max_capacity: 50,
    status: 'open'
  });

  useEffect(() => {
    fetchAssets();
    fetchStats();
  }, []);

  const fetchAssets = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/admin/assets', {
        headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
      });
      setAssets(response.data.assets || []);
    } catch (err) {
      showError('Failed to load assets');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await axios.get('/api/admin/stats', {
        headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
      });
      setStats(response.data.stats || stats);
    } catch (err) {
      console.log('Stats endpoint not yet available');
    }
  };

  const handleOpenModal = (asset = null) => {
    if (asset) {
      setEditingId(asset.id);
      setFormData(asset);
    } else {
      setEditingId(null);
      setFormData({
        name: '',
        location: '',
        service_type: '',
        branch: '',
        max_capacity: 50,
        status: 'open'
      });
    }
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!formData.name || !formData.branch) {
      showError('Please fill all required fields');
      return;
    }

    try {
      if (editingId) {
        await axios.put(`/api/admin/asset/${editingId}`, formData, {
          headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
        });
        success('Asset updated successfully!');
      } else {
        await axios.post('/api/admin/asset', formData, {
          headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
        });
        success('Asset created successfully!');
      }
      setShowModal(false);
      fetchAssets();
    } catch (err) {
      showError(err.response?.data?.error || 'Failed to save asset');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure? This action cannot be undone.')) {
      try {
        await axios.delete(`/api/admin/asset/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
        });
        success('Asset deleted successfully!');
        fetchAssets();
      } catch (err) {
        showError('Failed to delete asset');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">🏦 Bank Admin Panel</h1>
              <p className="text-gray-400">Manage queues, assets, and bank operations</p>
            </div>
            <div className="flex gap-3">
              <Button onClick={() => setActiveTab('overview')} variant={activeTab === 'overview' ? 'primary' : 'outline'}>
                📊 Overview
              </Button>
              <Button onClick={() => setActiveTab('assets')} variant={activeTab === 'assets' ? 'primary' : 'outline'}>
                🏢 Assets
              </Button>
              <Button onClick={() => setActiveTab('analytics')} variant={activeTab === 'analytics' ? 'primary' : 'outline'}>
                📈 Analytics
              </Button>
            </div>
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid md:grid-cols-4 gap-4">
              <Card className="bg-gradient-to-br from-blue-900 to-blue-800 border-blue-700 p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-blue-200 text-sm font-medium">Total Queues</p>
                    <p className="text-3xl font-bold text-white mt-2">{stats.totalQueues}</p>
                  </div>
                  <span className="text-4xl">📋</span>
                </div>
              </Card>
              
              <Card className="bg-gradient-to-br from-green-900 to-green-800 border-green-700 p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-green-200 text-sm font-medium">Active Users</p>
                    <p className="text-3xl font-bold text-white mt-2">{stats.activeUsers}</p>
                  </div>
                  <span className="text-4xl">👥</span>
                </div>
              </Card>
              
              <Card className="bg-gradient-to-br from-orange-900 to-orange-800 border-orange-700 p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-orange-200 text-sm font-medium">Avg Wait Time</p>
                    <p className="text-3xl font-bold text-white mt-2">{stats.avgWaitTime}m</p>
                  </div>
                  <span className="text-4xl">⏱️</span>
                </div>
              </Card>
              
              <Card className="bg-gradient-to-br from-purple-900 to-purple-800 border-purple-700 p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-purple-200 text-sm font-medium">Completed Today</p>
                    <p className="text-3xl font-bold text-white mt-2">{stats.completedToday}</p>
                  </div>
                  <span className="text-4xl">✅</span>
                </div>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card className="bg-slate-800 border-slate-700 p-6">
              <h2 className="text-xl font-bold text-white mb-4">🚀 Quick Actions</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <Button className="w-full" size="lg">📊 View Reports</Button>
                <Button className="w-full" size="lg">⚙️ Settings</Button>
                <Button className="w-full" size="lg">📢 Announcements</Button>
                <Button className="w-full" size="lg">🔔 Notifications</Button>
              </div>
            </Card>

            {/* Recent Activity */}
            <Card className="bg-slate-800 border-slate-700 p-6">
              <h2 className="text-xl font-bold text-white mb-4">📝 Recent Activity</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
                  <div>
                    <p className="text-white font-medium">Queue at Branch A</p>
                    <p className="text-gray-400 text-sm">45 people waiting</p>
                  </div>
                  <Badge color="yellow">Active</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
                  <div>
                    <p className="text-white font-medium">High wait time alert</p>
                    <p className="text-gray-400 text-sm">Branch C exceeds threshold</p>
                  </div>
                  <Badge color="red">Alert</Badge>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Assets Tab */}
        {activeTab === 'assets' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">Manage Bank Assets</h2>
              <Button onClick={() => handleOpenModal()} size="lg">+ Add New Asset</Button>
            </div>

            {loading ? (
              <LoadingSpinner />
            ) : (
              <div className="grid gap-4">
                {assets.length === 0 ? (
                  <Card className="bg-slate-800 border-slate-700 p-8 text-center">
                    <p className="text-gray-400 text-lg">No assets created yet. Create your first asset to get started.</p>
                    <Button onClick={() => handleOpenModal()} className="mt-4">Create Asset</Button>
                  </Card>
                ) : (
                  assets.map(asset => (
                    <Card key={asset.id} className="bg-slate-800 border-slate-700 p-6 hover:border-slate-600 transition">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-white">{asset.name}</h3>
                          <p className="text-gray-400">{asset.location}</p>
                          <div className="mt-3 flex gap-4">
                            <Badge color={asset.status === 'open' ? 'green' : 'red'}>{asset.status}</Badge>
                            <span className="text-gray-500">Branch: {asset.branch}</span>
                            <span className="text-gray-500">Type: {asset.service_type}</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button onClick={() => handleOpenModal(asset)} variant="outline" size="sm">Edit</Button>
                          <Button onClick={() => handleDelete(asset.id)} variant="danger" size="sm">Delete</Button>
                        </div>
                      </div>
                    </Card>
                  ))
                )}
              </div>
            )}
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white">📊 Analytics Dashboard</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-slate-800 border-slate-700 p-6">
                <h3 className="text-lg font-bold text-white mb-4">Queue Performance</h3>
                <div className="h-64 bg-slate-700 rounded-lg flex items-center justify-center">
                  <p className="text-gray-400">Chart Analytics Coming Soon</p>
                </div>
              </Card>

              <Card className="bg-slate-800 border-slate-700 p-6">
                <h3 className="text-lg font-bold text-white mb-4">Wait Time Trends</h3>
                <div className="h-64 bg-slate-700 rounded-lg flex items-center justify-center">
                  <p className="text-gray-400">Chart Analytics Coming Soon</p>
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* Asset Modal */}
        {showModal && (
          <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
            <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
              <h2 className="text-xl font-bold text-white mb-4">
                {editingId ? 'Edit Asset' : 'Create New Asset'}
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Asset Name *</label>
                  <Input
                    type="text"
                    placeholder="e.g., Main Counter"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Branch *</label>
                  <Input
                    type="text"
                    placeholder="e.g., Branch A"
                    value={formData.branch}
                    onChange={(e) => setFormData({...formData, branch: e.target.value})}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Location</label>
                  <Input
                    type="text"
                    placeholder="e.g., Ground Floor"
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Service Type</label>
                  <Input
                    type="text"
                    placeholder="e.g., Deposits"
                    value={formData.service_type}
                    onChange={(e) => setFormData({...formData, service_type: e.target.value})}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Max Capacity</label>
                  <Input
                    type="number"
                    placeholder="50"
                    value={formData.max_capacity}
                    onChange={(e) => setFormData({...formData, max_capacity: parseInt(e.target.value)})}
                    className="w-full"
                  />
                </div>

                <div className="flex gap-3 mt-6">
                  <Button onClick={handleSave} className="flex-1">Save Asset</Button>
                  <Button onClick={() => setShowModal(false)} variant="outline" className="flex-1">Cancel</Button>
                </div>
              </div>
            </div>
          </Modal>
        )}
      </div>
    </div>
  );
}
