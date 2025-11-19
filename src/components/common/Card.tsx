interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
}

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export const Button = ({ variant = 'primary', className = '', ...props }: ButtonProps) => {
  const baseStyle = "px-4 py-2 rounded font-medium transition-colors duration-200 disabled:opacity-50";
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300",
    danger: "bg-red-500 text-white hover:bg-red-600"
  };
  
  return (
    <button className={`${baseStyle} ${variants[variant]} ${className}`} {...props} />
  );
};

export const Card = ({ children, className = '', ...props }: CardProps) => (
  <div 
    className={`bg-white shadow rounded-lg p-6 ${className}`} 
    {...props} // Aquí esparcimos las props extra (como style)
  >
    {children}
  </div>
);