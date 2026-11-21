import { useEffect, useMemo, useState } from "react"
import { rankProducts } from "../lib/productSearch"

export function useProductSearch(products, query, delay = 200) {
  const [debouncedQuery, setDebouncedQuery] = useState(query)

  useEffect(() => {
    const timeout = window.setTimeout(() => setDebouncedQuery(query), delay)
    return () => window.clearTimeout(timeout)
  }, [query, delay])

  const results = useMemo(() => rankProducts(products, debouncedQuery), [products, debouncedQuery])
  return { results, isDebouncing: query !== debouncedQuery }
}
