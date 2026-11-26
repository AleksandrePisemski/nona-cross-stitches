import { createContext, useContext, useMemo, useState } from "react"
import { customerAccountStore } from "../lib/customerAccountStore.js"

const AccountContext = createContext(null)

function makeId() {
  return globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`
}

function normalizeEmail(email) {
  return String(email ?? "").trim().toLowerCase()
}

export function CustomerAccountProvider({ children }) {
  const [state, setState] = useState(customerAccountStore.load)
  const storedUser = state.users.find((user) => user.id === state.currentUserId) ?? null
  const currentUser = storedUser ? {
    id: storedUser.id,
    profile: storedUser.profile,
    addresses: storedUser.addresses,
    orders: storedUser.orders,
    createdAt: storedUser.createdAt,
  } : null

  function commit(nextState) {
    setState(nextState)
    customerAccountStore.save(nextState)
  }

  function register({ firstName, lastName, email, phone, password }) {
    const normalizedEmail = normalizeEmail(email)
    if (state.users.some((user) => normalizeEmail(user.email) === normalizedEmail)) {
      return { ok: false, message: "An account with this email already exists. Sign in instead." }
    }
    const user = {
      id: makeId(),
      profile: { firstName: firstName.trim(), lastName: lastName.trim(), email: normalizedEmail, phone: phone.trim() },
      email: normalizedEmail,
      password,
      addresses: [],
      orders: [],
      createdAt: new Date().toISOString(),
    }
    commit({ users: [...state.users, user], currentUserId: user.id })
    return { ok: true }
  }

  function login(email, password) {
    const user = state.users.find((entry) => normalizeEmail(entry.email) === normalizeEmail(email) && entry.password === password)
    if (!user) return { ok: false, message: "Email or password is incorrect." }
    commit({ ...state, currentUserId: user.id })
    return { ok: true }
  }

  function logout() {
    commit({ ...state, currentUserId: null })
  }

  function resetPassword(email, password) {
    const normalizedEmail = normalizeEmail(email)
    const user = state.users.find((entry) => normalizeEmail(entry.email) === normalizedEmail)
    if (!user) return { ok: false, message: "No local account was found for that email." }
    commit({
      ...state,
      currentUserId: user.id,
      users: state.users.map((entry) => entry.id === user.id ? { ...entry, password } : entry),
    })
    return { ok: true }
  }

  function updateProfile(profile) {
    if (!currentUser) return
    const email = normalizeEmail(profile.email)
    const emailInUse = state.users.some((user) => user.id !== currentUser.id && normalizeEmail(user.email) === email)
    if (emailInUse) return { ok: false, message: "That email is already used by another local account." }
    commit({
      ...state,
      users: state.users.map((user) => user.id === currentUser.id
        ? { ...user, email, profile: { ...user.profile, ...profile, email } }
        : user),
    })
    return { ok: true }
  }

  function addAddress(address) {
    if (!currentUser) return
    const isDefault = Boolean(address.isDefault) || currentUser.addresses.length === 0
    const nextAddress = { ...address, id: makeId(), isDefault }
    commit({
      ...state,
      users: state.users.map((user) => user.id === currentUser.id
        ? { ...user, addresses: [...user.addresses.map((item) => ({ ...item, isDefault: isDefault ? false : item.isDefault })), nextAddress] }
        : user),
    })
  }

  function updateAddress(addressId, updates) {
    if (!currentUser) return
    commit({
      ...state,
      users: state.users.map((user) => {
        if (user.id !== currentUser.id) return user
        const addresses = user.addresses.map((address) => {
          const updated = address.id === addressId ? { ...address, ...updates } : address
          return { ...updated, isDefault: updates.isDefault ? address.id === addressId : updated.isDefault }
        })
        if (!addresses.some((address) => address.isDefault) && addresses[0]) addresses[0] = { ...addresses[0], isDefault: true }
        return { ...user, addresses }
      }),
    })
  }

  function removeAddress(addressId) {
    if (!currentUser) return
    commit({
      ...state,
      users: state.users.map((user) => {
        if (user.id !== currentUser.id) return user
        const addresses = user.addresses.filter((address) => address.id !== addressId)
        if (!addresses.some((address) => address.isDefault) && addresses[0]) addresses[0] = { ...addresses[0], isDefault: true }
        return { ...user, addresses }
      }),
    })
  }

  function saveOrder(order) {
    if (!currentUser || !order?.orderRef) return
    commit({
      ...state,
      users: state.users.map((user) => user.id !== currentUser.id ? user : {
        ...user,
        orders: [order, ...user.orders.filter((saved) => saved.orderRef !== order.orderRef)],
      }),
    })
  }

  const value = useMemo(() => ({
    currentUser,
    register,
    login,
    logout,
    resetPassword,
    updateProfile,
    addAddress,
    updateAddress,
    removeAddress,
    saveOrder,
  }), [state, currentUser])

  return <AccountContext.Provider value={value}>{children}</AccountContext.Provider>
}

export function useCustomerAccount() {
  const context = useContext(AccountContext)
  if (!context) throw new Error("useCustomerAccount must be used within CustomerAccountProvider")
  return context
}
