import { createContext, useContext, useEffect, useReducer } from "react";

const CartContext = createContext();

const cartReducer = (state, action) => {
  switch (action.type) {
    case "ADD_ITEM": {
      const item = action.payload;
      const existItem = state.find((x) => x._id === item._id);
      if (existItem) {
        return state.map((x) =>
          x._id === existItem._id ? { ...x, qty: x.qty + (item.qty || 1) } : x,
        );
      }
      return [...state, { ...item, qty: item.qty || 1 }];
    }
    case "REMOVE_ITEM":
      return state.filter((x) => x._id !== action.payload);
    case "UPDATE_QTY":
      return state.map((x) =>
        x._id === action.payload.id ? { ...x, qty: action.payload.qty } : x,
      );
    case "CLEAR_CART":
      return [];
    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [cart, dispatch] = useReducer(
    cartReducer,
    JSON.parse(localStorage.getItem("cartItems")) || [],
  );

  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product, qty = 1) =>
    dispatch({ type: "ADD_ITEM", payload: { ...product, qty } });
  const removeFromCart = (id) => dispatch({ type: "REMOVE_ITEM", payload: id });
  const updateQty = (id, qty) =>
    dispatch({ type: "UPDATE_QTY", payload: { id, qty } });
  const clearCart = () => dispatch({ type: "CLEAR_CART" });

  const totalItems = cart.reduce((acc, item) => acc + item.qty, 0);
  const totalPrice = cart.reduce((acc, item) => acc + item.price * item.qty, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQty,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
