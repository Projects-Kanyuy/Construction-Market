import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  icon?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  className = '',
  type = 'button',
  disabled = false,
  icon
}) => {
  const baseStyles = 'font-medium rounded-lg transition-all duration-200 flex items-center justify-center';
  
  const variantStyles = {
    primary: 'bg-[#3B546A] text-white hover:bg-[#2A3E50] active:bg-[#1F2F3D]',
    secondary: 'bg-[#FF9D42] text-white hover:bg-[#F08A2C] active:bg-[#D6791F]',
    outline: 'bg-transparent border border-[#3B546A] text-[#3B546A] hover:bg-[#F5F7FA]'
  };
  
  const sizeStyles = {
    small: 'text-sm py-2 px-3',
    medium: 'text-base py-2.5 px-5',
    large: 'text-lg py-3 px-6'
  };
  
  const widthStyle = fullWidth ? 'w-full' : '';
  const disabledStyle = disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer';
  
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        ${baseStyles}
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${widthStyle}
        ${disabledStyle}
        ${className}
      `}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </button>
  );
};

export default Button;