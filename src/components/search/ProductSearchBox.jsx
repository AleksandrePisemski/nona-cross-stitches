import { useEffect, useRef, useState } from "react"
import { Link, useNavigate } from "react-router"
import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/outline"
import { products } from "../../pages/catalog/catalogData"
import { useProductSearch } from "../../hooks/useProductSearch"

function formatPrice(value, currency = "GEL") {
  const amount = Number(String(value ?? "").replace(/[^\d.-]/g, "")) || 0
  return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(amount)
}

export default function ProductSearchBox({ mobile = false, isOpen = true, onClose }) {
  const [query, setQuery] = useState("")
  const [isFocused, setIsFocused] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const rootRef = useRef(null)
  const inputRef = useRef(null)
  const navigate = useNavigate()
  const { results } = useProductSearch(products, query)
  const showSuggestions = isOpen && isFocused && query.trim().length > 0
  const visibleResults = results.slice(0, 5)
  const listId = mobile ? "mobile-product-search-results" : "desktop-product-search-results"

  useEffect(() => {
    if (!isOpen) return
    inputRef.current?.focus()
  }, [isOpen])

  useEffect(() => {
    const handlePointerDown = (event) => {
      if (!rootRef.current?.contains(event.target)) setIsFocused(false)
    }
    document.addEventListener("pointerdown", handlePointerDown)
    return () => document.removeEventListener("pointerdown", handlePointerDown)
  }, [])

  const submitSearch = () => {
    const value = query.trim()
    if (!value) return
    setIsFocused(false)
    onClose?.()
    navigate(`/search?q=${encodeURIComponent(value)}`)
  }

  const handleKeyDown = (event) => {
    if (event.key === "Escape") {
      setIsFocused(false)
      inputRef.current?.blur()
      onClose?.()
    } else if (event.key === "ArrowDown" && showSuggestions) {
      event.preventDefault()
      setActiveIndex((index) => Math.min(index + 1, visibleResults.length))
    } else if (event.key === "ArrowUp" && showSuggestions) {
      event.preventDefault()
      setActiveIndex((index) => Math.max(index - 1, -1))
    } else if (event.key === "Enter" && showSuggestions && activeIndex >= 0 && activeIndex < visibleResults.length) {
      event.preventDefault()
      navigate(`/products/${visibleResults[activeIndex].slug ?? visibleResults[activeIndex].id}`)
      setIsFocused(false)
      onClose?.()
    } else if (event.key === "Enter" && activeIndex === visibleResults.length && visibleResults.length > 0) {
      event.preventDefault()
      submitSearch()
    }
  }

  return <div ref={rootRef} className={`relative ${mobile ? "w-full" : "w-full"}`}>
    <form onSubmit={(event) => { event.preventDefault(); submitSearch() }} role="search">
      <label className="sr-only" htmlFor={`${listId}-input`}>Search products</label>
      <div className="relative">
        <MagnifyingGlassIcon aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 size-5 -translate-y-1/2 text-white/80" />
        <input
          id={`${listId}-input`}
          ref={inputRef}
          type="text"
          value={query}
          onChange={(event) => { setQuery(event.target.value); setActiveIndex(-1) }}
          onFocus={() => setIsFocused(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search..."
          autoComplete="off"
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={showSuggestions}
          aria-controls={listId}
          aria-activedescendant={activeIndex >= 0 && activeIndex < visibleResults.length ? `${listId}-option-${activeIndex}` : undefined}
          className={`w-full rounded-md border px-4 py-2 pl-10 pr-10 text-sm outline-none focus-visible:ring-2 ${mobile ? "border-white bg-transparent text-white placeholder:text-white/70 focus-visible:ring-white" : "border-white bg-white/10 text-white placeholder:text-white/70 focus-visible:ring-white"}`}
        />
        {query && <button type="button" aria-label="Clear search" onClick={() => { setQuery(""); setActiveIndex(-1); inputRef.current?.focus() }} className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-current hover:bg-black/10 focus-visible:outline-2 focus-visible:outline-offset-2">
          <XMarkIcon className="size-5" aria-hidden="true" />
        </button>}
      </div>
    </form>
    {showSuggestions && <div className={`absolute left-0 right-0 top-full z-[70] mt-2 overflow-hidden border border-stone-200 bg-white text-stone-800 shadow-xl ${mobile ? "rounded-b-xl" : "rounded-lg"}`}>
      <ul id={listId} role="listbox" aria-label="Product suggestions" className="max-h-[min(55dvh,24rem)] overflow-y-auto overscroll-contain p-1">
        {visibleResults.map((product, index) => <li key={product.id} id={`${listId}-option-${index}`} role="option" aria-selected={activeIndex === index}>
          <Link to={`/products/${product.slug ?? product.id}`} onClick={() => { setIsFocused(false); onClose?.() }} className={`flex items-center gap-3 rounded-md p-2 hover:bg-stone-100 focus:bg-stone-100 ${activeIndex === index ? "bg-stone-100" : ""}`}>
            <img src={product.images?.[0] ?? product.image} alt="" className="size-12 shrink-0 rounded object-cover" />
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-semibold">{product.name}</span>
              <span className="block truncate text-xs text-stone-500">SKU: {product.sku ?? product.articleNumber ?? product.id}</span>
            </span>
            <span className="shrink-0 text-sm font-medium">{formatPrice(product.price, product.currency)}</span>
          </Link>
        </li>)}
        {visibleResults.length === 0 && <li role="status" className="px-3 py-4 text-sm text-stone-500">No matching products found.</li>}
      </ul>
      {results.length > 0 && <button type="button" onClick={submitSearch} className="w-full border-t border-stone-200 px-4 py-3 text-left text-sm font-semibold text-stitching-wood hover:bg-stone-50">
        View all {results.length} {results.length === 1 ? "result" : "results"} for &quot;{query.trim()}&quot;
      </button>}
    </div>}
  </div>
}
