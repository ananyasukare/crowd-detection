import React from 'react';

export const LoadingSpinner = ({ size = 'md', text = 'Loading...' }) => {
  const sizeMap = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
  };

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div className={`${sizeMap[size]} border-4 border-[#F0F0F0] border-t-[#1B4965] rounded-full animate-spin`} />
      {text && <p className="text-[#333333] text-sm">{text}</p>}
    </div>
  );
};

export const Card = ({ children, className = '', onClick, hover = true }) => {
  return (
    <div
      onClick={onClick}
      className={`
        bg-white rounded-lg shadow-md p-6 border border-[#CCCCCC] transition-all duration-300
        ${hover ? 'hover:shadow-xl hover:shadow-[#1B4965]/20 hover:border-[#1B4965] hover:scale-[1.02] cursor-pointer' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  loading = false,
  disabled = false,
  className = '',
  ...props 
}) => {
  const baseClasses = 'font-semibold rounded-lg transition-all duration-300 flex items-center justify-center gap-2 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white';
  
  const variants = {
    primary: 'bg-[#1B4965] text-white hover:bg-[#003366] hover:shadow-lg hover:shadow-[#1B4965]/50 disabled:bg-[#CCCCCC] active:shadow-[#1B4965]/30',
    secondary: 'bg-[#D4AF37] text-[#1B4965] hover:bg-[#F4D03F] hover:shadow-lg hover:shadow-[#D4AF37]/50 disabled:bg-[#CCCCCC] active:shadow-[#D4AF37]/30 font-bold',
    danger: 'bg-[#8B0000] text-white hover:bg-[#600000] hover:shadow-lg hover:shadow-[#8B0000]/50 disabled:bg-[#CCCCCC] active:shadow-[#8B0000]/30',
    success: 'bg-[#2D5016] text-white hover:bg-[#1F3610] hover:shadow-lg hover:shadow-[#2D5016]/50 disabled:bg-[#CCCCCC] active:shadow-[#2D5016]/30',
    outline: 'border-2 border-[#1B4965] text-[#1B4965] hover:bg-[#1B4965] hover:bg-opacity-10 hover:shadow-lg hover:shadow-[#1B4965]/30 disabled:opacity-50 active:shadow-[#1B4965]/20',
  };

  const sizes = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2.5',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <button
      disabled={disabled || loading}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {loading ? <LoadingSpinner size="sm" text="" /> : children}
    </button>
  );
};

export const Badge = ({ children, variant = 'primary', className = '' }) => {
  const variants = {
    primary: 'bg-[#1B4965] text-white hover:bg-[#003366] hover:shadow-lg hover:shadow-[#1B4965]/30 transition-all duration-300 cursor-default',
    success: 'bg-[#2D5016] text-white hover:bg-[#1F3610] hover:shadow-lg hover:shadow-[#2D5016]/30 transition-all duration-300 cursor-default',
    warning: 'bg-[#B8860B] text-white hover:bg-[#8B6508] hover:shadow-lg hover:shadow-[#B8860B]/30 transition-all duration-300 cursor-default',
    danger: 'bg-[#8B0000] text-white hover:bg-[#600000] hover:shadow-lg hover:shadow-[#8B0000]/30 transition-all duration-300 cursor-default',
    gray: 'bg-[#F0F0F0] text-[#333333] hover:bg-[#E0E0E0] hover:shadow-lg hover:shadow-[#333333]/20 transition-all duration-300 cursor-default',
  };

  return (
    <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

export const Input = ({ 
  label, 
  error, 
  className = '', 
  containerClassName = '',
  ...props 
}) => {
  return (
    <div className={`flex flex-col gap-2 ${containerClassName}`}>
      {label && <label className="text-sm font-semibold text-[#1B4965] transition-colors duration-200">{label}</label>}
      <input
        className={`
          px-4 py-2.5 bg-white border border-[#CCCCCC] rounded-lg text-[#333333] placeholder-[#999999]
          focus:outline-none focus:border-[#1B4965] focus:ring-2 focus:ring-[#1B4965]/20 focus:shadow-lg focus:shadow-[#1B4965]/10
          transition-all duration-300 hover:bg-[#FAFAFA] hover:border-[#1B4965]
          ${error ? 'border-[#8B0000] focus:border-[#8B0000] focus:ring-[#8B0000]/20 focus:shadow-[#8B0000]/10' : ''}
          ${className}
        `}
        {...props}
      />
      {error && <span className="text-xs text-[#8B0000] animate-slideDown">{error}</span>}
    </div>
  );
};

export const Select = ({ 
  label, 
  options = [], 
  error, 
  className = '', 
  containerClassName = '',
  ...props 
}) => {
  return (
    <div className={`flex flex-col gap-2 ${containerClassName}`}>
      {label && <label className="text-sm font-semibold text-[#1B4965] transition-colors duration-200">{label}</label>}
      <select
        className={`
          px-4 py-2.5 bg-white border border-[#CCCCCC] rounded-lg text-[#333333] cursor-pointer
          focus:outline-none focus:border-[#1B4965] focus:ring-2 focus:ring-[#1B4965]/20 focus:shadow-lg focus:shadow-[#1B4965]/10
          transition-all duration-300 hover:bg-[#FAFAFA] hover:border-[#1B4965]
          ${error ? 'border-[#8B0000] focus:border-[#8B0000] focus:ring-[#8B0000]/20' : ''}
          ${className}
        `}
        {...props}
      >
        <option value="" className="bg-white text-[#333333]">Select an option</option>
        {options.map((option) => (
          <option key={option.value} value={option.value} className="bg-white text-[#333333]">
            {option.label}
          </option>
        ))}
      </select>
      {error && <span className="text-xs text-[#8B0000] animate-slideDown">{error}</span>}
    </div>
  );
};

export const Modal = ({ isOpen, onClose, title, children, size = 'md' }) => {
  if (!isOpen) return null;

  const sizeMap = {
    sm: 'w-96',
    md: 'w-96 sm:w-[500px]',
    lg: 'w-96 sm:w-[700px]',
    xl: 'w-screen sm:w-[900px]',
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm animate-fadeInScale">
      <div className={`bg-white rounded-lg shadow-2xl shadow-[#1B4965]/30 max-w-full border border-[#CCCCCC] transition-all duration-300 animate-fadeInScale ${sizeMap[size]}`}>
        <div className="flex items-center justify-between p-6 border-b border-[#D4AF37] bg-gradient-to-r from-[#1B4965] to-[#003366] hover:bg-opacity-80 transition-colors duration-200">
          <h2 className="text-xl font-bold text-white">{title}</h2>
          <button
            onClick={onClose}
            className="text-white hover:text-[#D4AF37] text-2xl transition-all duration-200 hover:scale-110 active:scale-95"
          >
            ×
          </button>
        </div>
        <div className="p-6 max-h-[80vh] overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

export const Alert = ({ type = 'info', message, onClose, className = '' }) => {
  const typeMap = {
    info: 'bg-[#4A90E2] bg-opacity-20 text-[#003366] border-l-4 border-[#4A90E2] hover:bg-opacity-30 hover:shadow-lg hover:shadow-[#4A90E2]/20',
    success: 'bg-[#2D5016] bg-opacity-20 text-[#1F3610] border-l-4 border-[#2D5016] hover:bg-opacity-30 hover:shadow-lg hover:shadow-[#2D5016]/20',
    warning: 'bg-[#B8860B] bg-opacity-20 text-[#8B6508] border-l-4 border-[#B8860B] hover:bg-opacity-30 hover:shadow-lg hover:shadow-[#B8860B]/20',
    error: 'bg-[#8B0000] bg-opacity-20 text-[#600000] border-l-4 border-[#8B0000] hover:bg-opacity-30 hover:shadow-lg hover:shadow-[#8B0000]/20',
  };

  const iconMap = {
    info: 'ℹ️',
    success: '✓',
    warning: '⚠️',
    error: '✕',
  };

  return (
    <div className={`border-l-4 p-4 rounded transition-all duration-300 animate-slideLeft ${typeMap[type]} ${className}`}>
      <div className="flex items-start gap-3">
        <span className="text-lg animate-bounce">{iconMap[type]}</span>
        <div className="flex-1">
          <p className="text-sm">{message}</p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-[#333333] hover:text-[#1B4965] ml-2 transition-all duration-200 hover:scale-110 active:scale-95"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
};

export const EmptyState = ({ icon = '📭', title, description, action }) => {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-12 px-4">
      <span className="text-6xl">{icon}</span>
      <h3 className="text-xl font-semibold text-white">{title}</h3>
      <p className="text-gray-400 text-center max-w-sm">{description}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
};

export const Stat = ({ label, value, icon, change, color = 'violet' }) => {
  const colorClasses = {
    violet: 'bg-violet-900 bg-opacity-40 text-violet-400 hover:bg-opacity-60 hover:shadow-lg hover:shadow-violet-600/30',
    green: 'bg-green-900 bg-opacity-40 text-green-400 hover:bg-opacity-60 hover:shadow-lg hover:shadow-green-600/30',
    red: 'bg-red-900 bg-opacity-40 text-red-400 hover:bg-opacity-60 hover:shadow-lg hover:shadow-red-600/30',
    yellow: 'bg-yellow-900 bg-opacity-40 text-yellow-400 hover:bg-opacity-60 hover:shadow-lg hover:shadow-yellow-600/30',
  };

  return (
    <Card className="hover:scale-105 group">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-gray-400 text-sm group-hover:text-gray-300 transition-colors duration-300">{label}</p>
          <p className="text-3xl font-bold text-white mt-1 group-hover:text-violet-300 transition-colors duration-300">{value}</p>
          {change && (
            <p className={`text-sm mt-2 transition-all duration-300 ${change.positive ? 'text-green-400' : 'text-red-400'}`}>
              {change.positive ? '↑' : '↓'} {change.value} from last period
            </p>
          )}
        </div>
        {icon && <div className={`text-2xl ${colorClasses[color]} p-3 rounded-lg transition-all duration-300 group-hover:scale-110`}>{icon}</div>}
      </div>
    </Card>
  );
};
