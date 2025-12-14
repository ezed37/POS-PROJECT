import { useEffect, useState, useMemo } from "react";

const STORAGE_KEY = "cashierCart";

export default function useCart(initial = []) {
  const [cart, setCart] = useState(initial);
  const [discount, setDiscount] = useState(0);
  const [inputValue, setInputValue] = useState("");

  // Load from localStorage once
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setCart(parsed.cart ?? []);
        setDiscount(parsed.discount ?? 0);
        setInputValue(parsed.inputValue ?? "");
      }
    } catch (e) {
      console.warn("Failed to load cart from localStorage", e);
    }
  }, []);

  // Save whenever cart, discount, or inputValue changes
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ cart, discount, inputValue })
      );
    } catch (e) {
      console.error("Failed to save cart to localStorage", e);
    }
  }, [cart, discount, inputValue]);

  const addItem = (item, qty = 1) => {
    const normalizedItem = {
      ...item,
      _id: item._id,
      selling_price: Number(item.selling_price ?? 0),
    };

    setCart((prev) => {
      const existing = prev.find((c) => c._id === item._id);
      if (existing) {
        return prev.map((c) =>
          c.id === item._id ? { ...c, qty: c.qty + qty } : c
        );
      }
      return [...prev, { ...normalizedItem, qty }];
    });
  };

  const updateQty = (id, qty) => {
    if (qty <= 0) return;
    setCart((prev) => prev.map((c) => (c.id === id ? { ...c, qty } : c)));
  };

  const removeItem = (id) => {
    setCart((prev) => prev.filter((c) => c._id !== id));
  };

  const clearCart = () => {
    setCart([]);
    setDiscount(0);
    setInputValue("");
    localStorage.removeItem(STORAGE_KEY);
  };

  const subtotal = useMemo(
    () => cart.reduce((sum, it) => sum + it.qty * (it.selling_price ?? 0), 0),
    [cart]
  );

  const finalTotal = useMemo(
    () => subtotal - (subtotal * (Number(discount) || 0)) / 100,
    [subtotal, discount]
  );

  const costSubtotal = useMemo(
    () => cart.reduce((sum, it) => sum + it.qty * (it.cost_price ?? 0), 0),
    [cart]
  );

  const actualTotalPrice = useMemo(
    () => cart.reduce((sum, it) => sum + it.qty * (it.actual_price ?? 0), 0),
    [cart]
  );

  const customerTotalProfit = actualTotalPrice - finalTotal;

  return {
    cart,
    discount,
    setDiscount,
    inputValue,
    setInputValue,
    addItem,
    updateQty,
    removeItem,
    clearCart,
    subtotal,
    finalTotal,
    costSubtotal,
    customerTotalProfit,
  };
}
