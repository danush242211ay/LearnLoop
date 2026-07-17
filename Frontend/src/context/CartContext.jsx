import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { cartApi } from '../lib/api'
import { useAuth } from './AuthContext'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const { isAuthenticated } = useAuth()
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(false)

  const refresh = useCallback(async () => {
    if (!isAuthenticated) {
      setCourses([])
      return
    }
    setLoading(true)
    try {
      const { data } = await cartApi.get()
      setCourses(data.cart?.courses || [])
    } catch {
      setCourses([])
    } finally {
      setLoading(false)
    }
  }, [isAuthenticated])

  useEffect(() => {
    refresh()
  }, [refresh])

  async function addToCart(courseId) {
    await cartApi.add(courseId)
    await refresh()
  }

  async function removeFromCart(courseId) {
    await cartApi.remove(courseId)
    await refresh()
  }

  async function clearCart() {
    await cartApi.clear()
    await refresh()
  }

  const total = courses.reduce((sum, c) => sum + (c?.price || 0), 0)

  const value = {
    courses,
    count: courses.length,
    total,
    loading,
    addToCart,
    removeFromCart,
    clearCart,
    refresh,
    isInCart: (courseId) => courses.some((c) => c._id === courseId),
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used inside <CartProvider>')
  return ctx
}
