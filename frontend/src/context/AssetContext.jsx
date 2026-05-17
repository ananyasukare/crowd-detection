import React, { createContext, useState, useCallback } from 'react';
import axios from 'axios';

export const AssetContext = createContext();

export const AssetProvider = ({ children }) => {
  const [assets, setAssets] = useState([]);
  const [nearbyAssets, setNearbyAssets] = useState([]);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAssets = useCallback(async (filters = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('/api/assets', { params: filters });
      setAssets(response.data.assets || []);
      return { success: true };
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to fetch assets';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchNearbyAssets = useCallback(async (latitude, longitude, radius = 5) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('/api/assets/nearby', {
        params: { latitude, longitude, radius },
      });
      setNearbyAssets(response.data.assets || []);
      return { success: true, assets: response.data.assets || [] };
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to fetch nearby assets';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAssetDetails = useCallback(async (assetId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`/api/assets/${assetId}`);
      setSelectedAsset(response.data.asset);
      return { success: true, asset: response.data.asset };
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to fetch asset details';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  }, []);

  const createAsset = useCallback(async (assetData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post('/api/assets', assetData);
      setAssets([...assets, response.data.asset]);
      return { success: true, asset: response.data.asset };
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to create asset';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  }, [assets]);

  const updateAsset = useCallback(async (assetId, assetData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.put(`/api/assets/${assetId}`, assetData);
      const updatedAssets = assets.map(a => a.id === assetId ? response.data.asset : a);
      setAssets(updatedAssets);
      if (selectedAsset?.id === assetId) {
        setSelectedAsset(response.data.asset);
      }
      return { success: true, asset: response.data.asset };
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to update asset';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  }, [assets, selectedAsset]);

  const deleteAsset = useCallback(async (assetId) => {
    setLoading(true);
    setError(null);
    try {
      await axios.delete(`/api/assets/${assetId}`);
      setAssets(assets.filter(a => a.id !== assetId));
      if (selectedAsset?.id === assetId) {
        setSelectedAsset(null);
      }
      return { success: true };
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to delete asset';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  }, [assets, selectedAsset]);

  const value = {
    assets,
    nearbyAssets,
    selectedAsset,
    loading,
    error,
    fetchAssets,
    fetchNearbyAssets,
    fetchAssetDetails,
    createAsset,
    updateAsset,
    deleteAsset,
    setSelectedAsset,
  };

  return <AssetContext.Provider value={value}>{children}</AssetContext.Provider>;
};
