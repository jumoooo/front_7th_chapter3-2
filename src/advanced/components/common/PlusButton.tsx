interface PlusButtonProps {
  className?: string;
  onClick?: () => void;
}

export const PlusButton = ({ className, onClick }: PlusButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={`w-6 h-6 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-100 ${className}`}>
      <span className="text-xs">+</span>
    </button>
  );
};
