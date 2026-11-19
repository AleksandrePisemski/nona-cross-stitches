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
    setItems((currentItems) => {
      const existingItem = currentItems.find((item) => item.id === product.id)
      if (existingItem) {
        return currentItems.map((item) =>
          item.id === product.id ? { ...item, quantity: (item.quantity ?? 1) + 1 } : item
        )
      }
      return [...currentItems, { ...product, quantity: 1 }]
    })
  }

  const removeFromCart = (productId) => {
    setItems((currentItems) => currentItems.filter((item) => item.id !== productId))
  }

  const decrementCart = (productId) => {
    setItems((currentItems) => currentItems.flatMap((item) => {
      if (item.id !== productId) return [item]
      const quantity = item.quantity ?? 1
      return quantity > 1 ? [{ ...item, quantity: quantity - 1 }] : []
    }))
  }

  const setItemQuantity = (productId, quantity) => {
    const safeQuantity = Math.floor(Number(quantity))
    setItems((currentItems) => currentItems.flatMap((item) => {
      if (item.id !== productId) return [item]
      return safeQuantity > 0 ? [{ ...item, quantity: safeQuantity }] : []
    }))
  }

  const clearCart = () => setItems([])

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
      removeFromCart,
      decrementCart,
      setItemQuantity,
      clearCart,
      wishlist,
      toggleWishlist,
      removeFromWishlist,
      clearWishlist,
    }),
    [items, wishlist],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) throw new Error("useCart must be used within a CartProvider")
  return context
}
