import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react"

const CartContext = createContext(null)
const CART_STORAGE_KEY = "nona-cross-stitches-cart"
const WISHLIST_STORAGE_KEY = "nona-cross-stitches-wishlist"

function readSavedList(key) {
  try {
    const saved = localStorage.getItem(key)
    if (!saved) return []

    const parsed = JSON.parse(saved)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    // Storage may be unavailable or contain invalid JSON.
    return []
  }
}

function saveList(key, items) {
  try {
    localStorage.setItem(key, JSON.stringify(items))
  } catch {
    // Keep the in-memory app usable if storage is disabled or full.
  }
}

export function CartProvider({ children }) {
  // Lazy initialization loads both lists before the first render.
  const [items, setItems] = useState(() => readSavedList(CART_STORAGE_KEY))
  const [wishlist, setWishlist] = useState(() => readSavedList(WISHLIST_STORAGE_KEY))
  const [promoCode, setPromoCode] = useState(null)

  useEffect(() => {
    saveList(CART_STORAGE_KEY, items)
  }, [items])

  useEffect(() => {
    saveList(WISHLIST_STORAGE_KEY, wishlist)
  }, [wishlist])

  useEffect(() => {
    function handleStorage(event) {
      if (event.key !== CART_STORAGE_KEY && event.key !== WISHLIST_STORAGE_KEY) return

      const update = event.key === CART_STORAGE_KEY ? setItems : setWishlist
      if (event.newValue === null) {
        update([])
        return
      }

      try {
        const parsed = JSON.parse(event.newValue)
        if (Array.isArray(parsed)) update(parsed)
      } catch {
        // Ignore malformed updates from another tab.
      }
    }

    window.addEventListener("storage", handleStorage)
    return () => window.removeEventListener("storage", handleStorage)
  }, [])

  const addToCart = (product) => {
    const productId = product.productId ?? product.id
    if (productId == null) return
    setItems((currentItems) => {
      const existingItem = currentItems.find((item) => (item.productId ?? item.id) === productId)
      if (existingItem) {
        return currentItems.map((item) =>
          (item.productId ?? item.id) === productId ? { ...item, quantity: (item.quantity ?? 1) + 1 } : item
        )
      }
      return [...currentItems, { productId, name: product.name, price: Number(String(product.price ?? "").replace(/[^\d.-]/g, "")) || 0, currency: "GEL", image: product.image ?? product.images?.[0], quantity: 1 }]
    })
  }

  const removeFromCart = (productId) => {
    setItems((currentItems) => currentItems.filter((item) => (item.productId ?? item.id) !== productId))
  }

  const decrementCart = (productId) => {
    setItems((currentItems) => currentItems.flatMap((item) => {
      if ((item.productId ?? item.id) !== productId) return [item]
      const quantity = item.quantity ?? 1
      return quantity > 1 ? [{ ...item, quantity: quantity - 1 }] : []
    }))
  }

  const setItemQuantity = (productId, quantity) => {
    const safeQuantity = Math.floor(Number(quantity))
    setItems((currentItems) => currentItems.flatMap((item) => {
      if ((item.productId ?? item.id) !== productId) return [item]
      return safeQuantity > 0 ? [{ ...item, quantity: safeQuantity }] : []
    }))
  }

  const clearCart = () => setItems([])

  // Frontend placeholder only. Validate promo codes on the server once an API exists.
  const applyPromoCode = (code) => {
    const normalized = code.trim().toUpperCase()
    if (normalized !== "STITCH10") return { ok: false, message: "Invalid promo code." }
    setPromoCode(normalized)
    return { ok: true }
  }
  const subtotal = items.reduce((sum, item) => {
    const price = Number(String(item.price ?? "").replace(/[^\d.-]/g, "")) || 0
    return sum + price * (item.quantity ?? 1)
  }, 0)
  const discount = promoCode === "STITCH10" ? subtotal * 0.1 : 0
  // The delivery fee depends on the destination, which is collected at checkout.
  const deliveryCost = 0
  const total = Math.max(0, subtotal - discount) + deliveryCost

  const toggleWishlist = (product) => {
    setWishlist((current) =>
      current.some((item) => item.id === product.id)
        ? current.filter((item) => item.id !== product.id)
        : [...current, product]
    )
  }

  const removeFromWishlist = (productId) => {
    setWishlist((current) => current.filter((item) => item.id !== productId))
  }

  const clearWishlist = () => setWishlist([])

  const value = useMemo(
    () => ({
      items,
      addToCart,
      addItem: addToCart,
      removeFromCart,
      removeItem: removeFromCart,
      decrementCart,
      setItemQuantity,
      setQuantity: setItemQuantity,
      clearCart,
      promoCode,
      applyPromoCode,
      subtotal,
      discount,
      deliveryCost,
      total,
      wishlist,
      toggleWishlist,
      removeFromWishlist,
      clearWishlist,
    }),
    [items, wishlist, promoCode, subtotal, discount, deliveryCost, total],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) throw new Error("useCart must be used within a CartProvider")
  return context
}
