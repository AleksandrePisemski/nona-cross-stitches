const STORAGE_KEY = "nona-cross-stitches-customer-accounts-v1"

// Replace this adapter with API calls when a customer service is available.
export const customerAccountStore = {
  load() {
    try {
      const value = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null")
      return value && Array.isArray(value.users) ? value : { users: [], currentUserId: null }
    } catch {
      return { users: [], currentUserId: null }
    }
  },
  save(state) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {
      // Keep the current session usable if browser storage is unavailable.
    }
  },
}
