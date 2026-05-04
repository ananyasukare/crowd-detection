import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useContexts';
import { useToast } from '../hooks/useToast';
import { validateEmail, validatePassword, validatePhoneNumber } from '../utils/helpers';
import { Button, Input, Alert } from '../components/UI';

export default function Register() {
  const navigate = useNavigate();
  const { register, loading } = useAuth();
  const { success, error: showError } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
  });
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState('');

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!validateEmail(formData.email)) newErrors.email = 'Invalid email format';
    
    if (!formData.password) newErrors.password = 'Password is required';
    else if (!validatePassword(formData.password)) newErrors.password = 'Password must be at least 6 characters';
    
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    
    if (!formData.phone) newErrors.phone = 'Phone number is required';
    else if (!validatePhoneNumber(formData.phone)) newErrors.phone = 'Invalid phone number';
    
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

    const result = await register(
      formData.name,
      formData.email,
      formData.password,
      formData.phone
    );
    
    if (result.success) {
      success('Account created successfully!');
      navigate('/dashboard');
    } else {
      setGeneralError(result.error);
      showError(result.error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-violet-900 to-black flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-violet-600 to-violet-900 rounded-lg flex items-center justify-center mx-auto mb-4 shadow-lg border border-violet-500">
            <span className="text-white text-3xl font-bold">Q</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Create Account</h1>
          <p className="text-white mt-2 font-semibold">Join Smart Queue today</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-lg shadow-xl p-8">
          {generalError && (
            <Alert type="error" message={generalError} onClose={() => setGeneralError('')} className="mb-6" />
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Full Name"
              type="text"
              name="name"
              placeholder="John Doe"
              value={formData.name}
              onChange={handleChange}
              error={errors.name}
              containerClassName="w-full"
            />

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
              label="Phone Number"
              type="tel"
              name="phone"
              placeholder="+91 XXXXX XXXXX"
              value={formData.phone}
              onChange={handleChange}
              error={errors.phone}
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

            <Input
              label="Confirm Password"
              type="password"
              name="confirmPassword"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={handleChange}
              error={errors.confirmPassword}
              containerClassName="w-full"
            />

            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" className="w-4 h-4 rounded border-gray-300" required />
              <span className="text-gray-800">I agree to the Terms and Conditions</span>
            </label>

            <Button
              type="submit"
              loading={loading}
              className="w-full mt-6"
              size="lg"
            >
              Create Account
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-200 text-center">
            <p className="text-gray-800 text-sm">
              Already have an account?{' '}
              <Link to="/login" className="text-violet-400 hover:text-violet-300 font-semibold">
                Sign In
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-gray-800 text-sm mt-6">
          <Link to="/" className="text-violet-400 hover:text-violet-300 font-semibold">Back to Home</Link>
        </p>
      </div>
    </div>
  );
}
