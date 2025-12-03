import { CartItem } from "../../../types";
import { ShoppingCartIcon } from "../icon/ShoppingCartIcon";

interface HeaderActionsProps {
  isAdmin: boolean;
  setIsAdmin: React.Dispatch<React.SetStateAction<boolean>>;
  cart: CartItem[];
  totalItemCount: number;
}

export const HeaderActions = ({
  isAdmin,
  setIsAdmin,
  cart,
  totalItemCount,
}: HeaderActionsProps) => {
  return (
    <>
      <button
        onClick={() => setIsAdmin(!isAdmin)}
        className={`px-3 py-1.5 text-sm rounded transition-colors ${
          isAdmin
            ? "bg-gray-800 text-white"
            : "text-gray-600 hover:text-gray-900"
        }`}>
        {isAdmin ? "쇼핑몰로 돌아가기" : "관리자 페이지로"}
      </button>
      {!isAdmin && (
        <div className="relative">
          <ShoppingCartIcon />
          {cart.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {totalItemCount}
            </span>
          )}
        </div>
      )}
    </>
  );
};
