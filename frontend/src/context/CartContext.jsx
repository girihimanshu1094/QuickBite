import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem('quickbite_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [canteen, setCanteen] = useState(() => {
    const saved = localStorage.getItem('quickbite_cart_canteen');
    return saved ? JSON.parse(saved) : null;
  });

  const [pickupSlot, setPickupSlot] = useState(() => {
    return localStorage.getItem('quickbite_pickup_slot') || '';
  });

  const [canteenConflict, setCanteenConflict] = useState(null);

  useEffect(() => {
    localStorage.setItem('quickbite_cart', JSON.stringify(cartItems));
    if (cartItems.length === 0) {
      localStorage.removeItem('quickbite_cart_canteen');
      setCanteen(null);
    } else if (canteen) {
      localStorage.setItem('quickbite_cart_canteen', JSON.stringify(canteen));
    }
  }, [cartItems, canteen]);

  useEffect(() => {
    if (pickupSlot) {
      localStorage.setItem('quickbite_pickup_slot', pickupSlot);
    } else {
      localStorage.removeItem('quickbite_pickup_slot');
    }
  }, [pickupSlot]);

  // Add Item to Cart
  const addToCart = (item, canteenInfo) => {
    // Check single-canteen rule
    if (cartItems.length > 0 && canteen && canteen._id !== canteenInfo._id) {
      setCanteenConflict({
        currentCanteen: canteen.name,
        newCanteen: canteenInfo.name,
        newItem: item,
        newCanteenInfo: canteenInfo,
      });
      return {
        conflict: true,
        message:
          'You can only order from one canteen at a time. Please clear your cart before ordering from another canteen.',
      };
    }

    // If first item in cart, establish current canteen
    if (cartItems.length === 0) {
      setCanteen(canteenInfo);
    }

    setCartItems((prevItems) => {
      const existing = prevItems.find((i) => i._id === item._id);
      if (existing) {
        return prevItems.map((i) =>
          i._id === item._id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prevItems, { ...item, quantity: 1 }];
    });

    return { success: true };
  };

  // Increase Item Quantity
  const increaseQuantity = (itemId) => {
    setCartItems((prev) =>
      prev.map((i) => (i._id === itemId ? { ...i, quantity: i.quantity + 1 } : i))
    );
  };

  // Decrease Item Quantity
  const decreaseQuantity = (itemId) => {
    setCartItems((prev) =>
      prev
        .map((i) => (i._id === itemId ? { ...i, quantity: i.quantity - 1 } : i))
        .filter((i) => i.quantity > 0)
    );
  };

  // Remove Item
  const removeFromCart = (itemId) => {
    setCartItems((prev) => prev.filter((i) => i._id !== itemId));
  };

  // Clear Cart
  const clearCart = () => {
    setCartItems([]);
    setCanteen(null);
    setPickupSlot('');
    setCanteenConflict(null);
    localStorage.removeItem('quickbite_cart');
    localStorage.removeItem('quickbite_cart_canteen');
    localStorage.removeItem('quickbite_pickup_slot');
  };

  // Switch Canteen & replace cart
  const resolveConflictAndAdd = () => {
    if (canteenConflict) {
      setCartItems([{ ...canteenConflict.newItem, quantity: 1 }]);
      setCanteen(canteenConflict.newCanteenInfo);
      setCanteenConflict(null);
    }
  };

  const closeConflictModal = () => {
    setCanteenConflict(null);
  };

  // Computed Values
  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        canteen,
        pickupSlot,
        setPickupSlot,
        addToCart,
        increaseQuantity,
        decreaseQuantity,
        removeFromCart,
        clearCart,
        totalAmount,
        totalItems,
        canteenConflict,
        resolveConflictAndAdd,
        closeConflictModal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
