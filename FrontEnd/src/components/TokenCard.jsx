import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  LinearProgress,
  Chip,
  Alert,
} from '@mui/material';
import AssignmentIcon from '@mui/icons-material/Assignment';

export default function TokenCard({ token }) {
  if (!token) {
    return (
      <Alert severity="info" sx={{ background: 'rgba(59, 130, 246, 0.1)', color: '#93c5fd', border: '1px solid rgba(59, 130, 246, 0.3)' }}>No active token. Book one to get started!</Alert>
    );
  }

  const isAlertTime = token.estimated_wait <= 15 && token.estimated_wait > 0;
  const progressValue =
    Math.max(0, Math.min(100, (100 * (60 - token.estimated_wait)) / 60));

  return (
    <Card sx={{ mb: 2, boxShadow: '0 8px 16px rgba(59, 130, 246, 0.15)', background: '#1a1a2e', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
      {isAlertTime && (
        <Alert severity="success" sx={{ mb: 2, background: 'rgba(16, 185, 129, 0.1)', color: '#86efac', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
          ✅ Your turn is coming soon! Estimated wait: {token.estimated_wait} minutes
        </Alert>
      )}
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <AssignmentIcon sx={{ fontSize: 40, color: '#3b82f6', mr: 2 }} />
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#3b82f6' }}>
              Token #{token.token_number}
            </Typography>
            <Typography variant="body2" sx={{ color: '#9ca3af' }}>
              {token.branch} - {token.service_type}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" sx={{ color: '#9ca3af' }}>Queue Progress</Typography>
            <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#3b82f6' }}>
              {token.estimated_wait} min
            </Typography>
          </Box>
          <LinearProgress variant="determinate" value={progressValue} sx={{ background: 'rgba(59, 130, 246, 0.2)', '& .MuiLinearProgress-bar': { background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)' } }} />
        </Box>

        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
          <Chip
            label={`Status: ${token.status.toUpperCase()}`}
            sx={{
              background: token.status === 'serving' ? 'rgba(16, 185, 129, 0.2)' : token.status === 'served' ? 'rgba(59, 130, 246, 0.2)' : 'rgba(245, 158, 11, 0.2)',
              color: token.status === 'serving' ? '#86efac' : token.status === 'served' ? '#93c5fd' : '#fcd34d'
            }}
          />
          {token.alert_sent && (
            <Chip label="🔔 Alert Sent" sx={{ background: 'rgba(139, 92, 246, 0.2)', color: '#c4b5fd' }} />
          )}
        </Box>

        <Typography variant="caption" sx={{ color: '#6b7280' }}>
          Booked at: {new Date(token.created_at).toLocaleString()}
        </Typography>
      </CardContent>
    </Card>
  );
}
