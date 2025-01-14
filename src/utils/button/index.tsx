import clsx from 'clsx';
import { forwardRef, ButtonHTMLAttributes } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'icon';

interface IButton extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  icon?: React.ReactNode;
  className?: string;
}

const Button = forwardRef<HTMLButtonElement, IButton>(
  (
    { type = 'button', variant = 'primary', children, onClick, icon, ...props },
    ref
  ) => {
    const styles = {
      primary:
        'bg-blue-500 hover:bg-blue-400 active:bg-blue-300  text-white rounded-xl p-2 font-semibold',
      secondary: 'bg-transparent text-black p-2',
      icon: 'h-10 w-10 bg-green-500',
    };

    const buttonClass = clsx(styles[variant], '');

    return (
      <button
        ref={ref}
        type={type}
        className={buttonClass}
        onClick={onClick}
        {...props}
      >
        {icon ? <span>{icon}</span> : children}
      </button>
    );
  }
);

Button.displayName = 'Button';
export default Button;
