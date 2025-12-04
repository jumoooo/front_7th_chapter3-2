interface MinusButtonProps {
  className?: string;
  onClick?: () => void;
}

export const MinusButton = ({ className, onClick }: MinusButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={`w-6 h-6 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-100 ${className}`}>
      <span className="text-xs">−</span>
    </button>
  );
};
