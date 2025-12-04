import { CloseIcon } from "../icon/CloseIcon";

export const CloseButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <button onClick={onClick} className="text-gray-400 hover:text-red-500 ml-2">
      <CloseIcon />
    </button>
  );
};
