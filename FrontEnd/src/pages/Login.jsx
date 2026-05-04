import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useContexts';
import { useToast } from '../hooks/useToast';
import { validateEmail, validatePassword } from '../utils/helpers';
import { Button, Input, Alert } from '../components/UI';

export default function Login() {
  const navigate = useNavigate();
  const { login, loading } = useAuth();
  const { success, error: showError } = useToast();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState('');

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!validateEmail(formData.email)) newErrors.email = 'Invalid email format';
    
    if (!formData.password) newErrors.password = 'Password is required';
    else if (!validatePassword(formData.password)) newErrors.password = 'Password must be at least 6 characters';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGeneralError('');

    if (!validateForm()) return;

    const result = await login(formData.email, formData.password);
    if (result.success) {
      success('Login successful!');
      navigate('/dashboard');
    } else {
      setGeneralError(result.error);
      showError(result.error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-violet-900 to-black flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span className="text-white text-3xl font-bold">Q</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Smart Queue</h1>
          <p className="text-white mt-2 font-semibold">Sign in to your account</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-lg shadow-xl p-8">
          {generalError && (
            <Alert type="error" message={generalError} onClose={() => setGeneralError('')} className="mb-6" />
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email Address"
              type="email"
              name="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              containerClassName="w-full"
            />

            <Input
              label="Password"
              type="password"
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              containerClassName="w-full"
            />

            <div className="flex justify-between items-center text-sm">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="w-4 h-4 rounded border-gray-300" />
                <span className="text-gray-800">Remember me</span>
              </label>
              <Link to="/register" className="text-blue-600 hover:text-blue-700 font-semibold">
                Create account
              </Link>
            </div>

            <Button
              type="submit"
              loading={loading}
              className="w-full mt-6"
              size="lg"
            >
              Sign In
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-center text-sm text-gray-800">
              Demo credentials: <br />
              <code className="bg-gray-100 px-2 py-1 rounded text-xs text-gray-900">user@example.com / password123</code>
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-gray-800 text-sm mt-6">
          <Link to="/" className="text-blue-600 hover:text-blue-700 font-semibold">Back to Home</Link>
        </p>
      </div>
    </div>
  );
}
