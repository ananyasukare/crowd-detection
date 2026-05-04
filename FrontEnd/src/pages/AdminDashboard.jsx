import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAssets } from '../hooks/useContexts';
import { useToast } from '../hooks/useToast';
import { Button, Card, Input, Modal, LoadingSpinner, Stat, Badge } from '../components/UI';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { assets, fetchAssets, createAsset, updateAsset, deleteAsset, loading } = useAssets();
  const { success, error: showError } = useToast();
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    type: '',
    queue_length: 0,
    estimated_wait: 0,
  });

  useEffect(() => {
    fetchAssets();
  }, []);

  const handleOpenModal = (asset = null) => {
    if (asset) {
      setEditingId(asset.id);
      setFormData(asset);
    } else {
      setEditingId(null);
      setFormData({
        name: '',
        location: '',
        type: '',
        queue_length: 0,
        estimated_wait: 0,
      });
    }
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!formData.name || !formData.location) {
      showError('Please fill all required fields');
      return;
    }

    if (editingId) {
      const result = await updateAsset(editingId, formData);
      if (result.success) {
        success('Asset updated successfully!');
        setShowModal(false);
      }
    } else {
      const result = await createAsset(formData);
      if (result.success) {
        success('Asset created successfully!');
        setShowModal(false);
      }
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this asset?')) {
      const result = await deleteAsset(id);
      if (result.success) {
        success('Asset deleted successfully!');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600 mt-2">Manage government assets and queue operations</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => navigate('/dashboard')}>Back to User</Button>
            <Button onClick={() => handleOpenModal()}>➕ Add Asset</Button>
          </div>
        </div>

        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Stat 
            label="Total Assets" 
            value={assets.length} 
            icon="🏢"
            color="blue"
          />
          <Stat 
            label="Active Queues" 
            value={assets.filter(a => a.queue_length > 0).length} 
            icon="📊"
            color="green"
          />
          <Stat 
            label="Total in Queues" 
            value={assets.reduce((sum, a) => sum + a.queue_length, 0)} 
            icon="👥"
            color="yellow"
          />
          <Stat 
            label="Avg Wait Time" 
            value={`${Math.round(assets.reduce((sum, a) => sum + a.estimated_wait, 0) / Math.max(assets.length, 1))} min`} 
            icon="⏱️"
            color="red"
          />
        </div>

        <Card>
          <h2 className="text-xl font-bold text-gray-900 mb-6">Assets Management</h2>
          
          {loading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner text="Loading assets..." />
            </div>
          ) : assets.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 mb-4">No assets found</p>
              <Button onClick={() => handleOpenModal()}>Create First Asset</Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Asset Name</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Location</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Type</th>
                    <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900">Queue Length</th>
                    <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900">Est. Wait</th>
                    <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {assets.map((asset) => (
                    <tr key={asset.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <p className="font-semibold text-gray-900">{asset.name}</p>
                      </td>
                      <td className="px-6 py-4 text-gray-600">{asset.location}</td>
                      <td className="px-6 py-4">
                        <Badge variant="gray">{asset.type}</Badge>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <Badge variant={asset.queue_length > 30 ? 'danger' : asset.queue_length > 15 ? 'warning' : 'success'}>
                          {asset.queue_length}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-center text-gray-900">{asset.estimated_wait} min</td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <Button 
                          onClick={() => handleOpenModal(asset)}
                          variant="secondary"
                          size="sm"
                        >
                          Edit
                        </Button>
                        <Button 
                          onClick={() => handleDelete(asset.id)}
                          variant="danger"
                          size="sm"
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>

      <Modal 
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingId ? 'Edit Asset' : 'Add New Asset'}
      >
        <div className="space-y-4">
          <Input
            label="Asset Name"
            placeholder="e.g., RTO Office"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            containerClassName="w-full"
          />
          <Input
            label="Location"
            placeholder="e.g., Main Street, Downtown"
            value={formData.location}
            onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
            containerClassName="w-full"
          />
          <Input
            label="Asset Type"
            placeholder="e.g., Government Office"
            value={formData.type}
            onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
            containerClassName="w-full"
          />
          <Input
            label="Current Queue Length"
            type="number"
            value={formData.queue_length}
            onChange={(e) => setFormData(prev => ({ ...prev, queue_length: parseInt(e.target.value) }))}
            containerClassName="w-full"
          />
          <Input
            label="Estimated Wait Time (minutes)"
            type="number"
            value={formData.estimated_wait}
            onChange={(e) => setFormData(prev => ({ ...prev, estimated_wait: parseInt(e.target.value) }))}
            containerClassName="w-full"
          />
          <div className="flex gap-2 pt-4">
            <Button 
              onClick={handleSave}
              className="flex-1"
            >
              {editingId ? 'Update Asset' : 'Create Asset'}
            </Button>
            <Button 
              onClick={() => setShowModal(false)}
              variant="secondary"
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}