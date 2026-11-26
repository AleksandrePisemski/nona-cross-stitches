import { products as catalogProducts, filterOptions } from "../pages/catalog/catalogData.js"

const KEY = "nona-admin-workspace-v1"
const today = new Date().toISOString().slice(0, 10)
const image = (id) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=480&q=80`
const seed = {
  products: catalogProducts.map((p, i) => ({ ...p, images: [p.image], categories: [p.category], stock: [4, 12, 2, 0, 18, 7, 3, 22, 9][i] ?? 6, status: "Active", featured: i < 2, isNew: i === 0, bestSeller: i === 1, discountType: "none", discountValue: "", variants: [], specs: [{ key: "Format", value: "Digital pattern" }, { key: "Difficulty", value: "Intermediate" }] })),
  categories: filterOptions.category.map((c, i) => ({ id: `cat-${i}`, name: c.label, image: image(["photo-1470252649378-9c29740c9fa8", "photo-1490750967868-88aa4486c946", "photo-1474511320723-9a56873867b5", "photo-1500530855697-b586d89ba3ee"][i % 4]), active: true, order: i })),
  orders: [
    { id: "NCS-2048", customer: "Mariam Kapanadze", email: "mariam@example.com", date: today, products: [{ name: "Mountain Lake at First Light", qty: 2, price: 1.99 }, { name: "Old Town in Bloom", qty: 1, price: .99 }], total: 4.97, payment: "Paid", status: "Processing", delivery: "Tbilisi · Courier", provider: "Card", notes: [] },
    { id: "NCS-2047", customer: "Ana Beridze", email: "ana@example.com", date: today, products: [{ name: "Garden of Wild Roses", qty: 1, price: .99 }], total: .99, payment: "Paid", status: "Shipped", delivery: "Batumi · Postal", provider: "Card", tracking: "GE729104", notes: ["Packed with care"] },
    { id: "NCS-2046", customer: "Nino Gelashvili", email: "nino@example.com", date: today, products: [{ name: "Riverbend in Blue", qty: 1, price: .99 }], total: .99, payment: "Pending", status: "Pending", delivery: "Kutaisi · Courier", provider: "Cash on delivery", notes: [] },
    { id: "NCS-2045", customer: "Tamar Japaridze", email: "tamar@example.com", date: today, products: [{ name: "Quiet Chapel Hill", qty: 3, price: 1.99 }], total: 5.97, payment: "Refunded", status: "Cancelled", delivery: "Tbilisi · Pickup", provider: "Card", notes: [] },
  ],
  discounts: [{ id: "d1", name: "Autumn stitch-along", type: "Percentage", value: 15, starts: today, ends: "2026-12-31", active: true }],
  codes: [{ id: "c1", code: "STITCH10", type: "Percentage", value: 10, limit: 100, used: 24, expires: "2026-12-31", active: true }],
  promos: [{ id: "p1", title: "A little color for every season", text: "Find your next quiet moment.", image: image("photo-1470252649378-9c29740c9fa8"), link: "/catalog", active: true, starts: today, ends: "2026-12-31" }],
  content: { banners: [{ id: "b1", title: "Stitch a little wonder", text: "Thoughtful patterns for slower days.", cta: "Explore the collection", link: "/catalog", image: image("photo-1470252649378-9c29740c9fa8"), active: true, order: 1 }], about: "Nona Cross-Stitches celebrates the joy of making something beautiful, one stitch at a time.", delivery: "Digital patterns are delivered to your email as soon as your order is confirmed. Physical orders ship across Georgia in 2–5 business days.", contact: { address: "Tbilisi, Georgia", email: "hello@nonastitch.ge", phone: "+995 555 000 000", hours: "Mon–Fri, 10:00–18:00", instagram: "@nonastitch" }, faq: [{ id: "f1", question: "How will I receive my pattern?", answer: "Your digital pattern arrives by email after checkout.", order: 1 }, { id: "f2", question: "Can I get help with a pattern?", answer: "Write to hello@nonastitch.ge and we’ll be glad to help.", order: 2 }] },
}
const cloneSeed = () => typeof structuredClone === "function"
  ? structuredClone(seed)
  : JSON.parse(JSON.stringify(seed))

// Replace this local adapter with API requests when the backend is available.
export const adminService = {
  load() {
    try {
      const saved = JSON.parse(localStorage.getItem(KEY) || "null")
      return saved && typeof saved === "object" && !Array.isArray(saved)
        ? { ...cloneSeed(), ...saved }
        : cloneSeed()
    } catch {
      return cloneSeed()
    }
  },
  save(data) {
    try {
      localStorage.setItem(KEY, JSON.stringify(data))
      return true
    } catch {
      return false
    }
  },
  hasSession() {
    try { return localStorage.getItem(ADMIN_SESSION_KEY) === "admin" } catch { return false }
  },
  signIn(email, password) {
    if (String(email).trim().toLowerCase() !== "admin@nonastitch.ge" || password !== "stitch-admin") {
      return { ok: false, message: "Email or password is incorrect." }
    }
    try {
      localStorage.setItem(ADMIN_SESSION_KEY, "admin")
      return { ok: true, persistent: true }
    } catch {
      return { ok: true, persistent: false }
    }
  },
  signOut() {
    try { localStorage.removeItem(ADMIN_SESSION_KEY) } catch { /* Session state still clears in React. */ }
  },
}
export const ADMIN_SESSION_KEY = "nona-admin-session-v1"
