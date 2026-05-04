import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  CircularProgress,
  Chip,
} from '@mui/material';
import { tokenAPI } from '../services/api';

export default function CrowdStatus({ branch, serviceType }) {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [crowdLevel, setCrowdLevel] = useState('low');

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 10000); // refresh every 10s
    return () => clearInterval(interval);
  }, [branch, serviceType]);

  const fetchStatus = async () => {
    try {
      const res = await tokenAPI.getQueueStatus(branch, serviceType);
      setStatus(res.data);
      const total = res.data.waiting + res.data.serving;
      if (total <= 5) setCrowdLevel('low');
      else if (total <= 15) setCrowdLevel('medium');
      else setCrowdLevel('high');
      setLoading(false);
    } catch (error) {
      console.error('Error fetching queue status:', error);
      setLoading(false);
    }
  };

  const getCrowdColor = () => {
    if (crowdLevel === 'low') return '#60a5fa'; // Light blue
    if (crowdLevel === 'medium') return '#3b82f6'; // Medium blue (primary)
    return '#1e40af'; // Dark blue
  };

  const getCrowdEmoji = () => {
    if (crowdLevel === 'low') return '🟦';
    if (crowdLevel === 'medium') return '🟦';
    return '🟦';
  };

  if (loading)
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <CircularProgress sx={{ color: '#3b82f6' }} />
      </Box>
    );

  return (
    <Card sx={{ mb: 2, boxShadow: '0 8px 16px rgba(59, 130, 246, 0.15)', background: '#1a1a2e', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: 'white' }}>
          Live Crowd Status
        </Typography>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Box>
            <Typography variant="h3" sx={{ color: getCrowdColor() }}>
              {getCrowdEmoji()}
            </Typography>
            <Typography variant="body1" sx={{ mt: 1, color: getCrowdColor() }}>
              {crowdLevel.toUpperCase()}
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'right' }}>
            <Chip
              label={`Waiting: ${status?.waiting || 0}`}
              sx={{ mr: 1, background: 'rgba(245, 158, 11, 0.2)', color: '#fcd34d' }}
            />
            <Chip
              label={`Serving: ${status?.serving || 0}`}
              sx={{ background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)', color: 'white' }}
            />
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
