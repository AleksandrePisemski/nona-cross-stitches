import { useMemo, useState } from "react"
import NavBar from "../../components/layout/NavBar"
import PageWrapper from "../../components/layout/PageWrapper"
import ItemUI from "../../components/layout/ItemUI.jsx"
import CatalogSettings from "./CatalogSettings"
import { products } from "./catalogData"

const defaultCatalogState = {
  sortBy: "newest",
  categories: [],
  sizes: [],
  prices: [],
}

function getNumericPrice(price) {
  return Number(String(price).replace(/[^\d.-]/g, ""))
}

function Catalog() {
  // Only applied selections affect the visible product list.
  const [applied, setApplied] = useState(defaultCatalogState)

  const visibleProducts = useMemo(() => {
    const filtered = products.filter((product) => {
      const categoryMatches =
        applied.categories.length === 0 || applied.categories.includes(product.category)
      const sizeMatches = applied.sizes.length === 0 || applied.sizes.includes(product.size)
      const price = getNumericPrice(product.price)
      const priceMatches =
        applied.prices.length === 0 ||
        applied.prices.some((range) => price >= range.min && price < range.max)

      return categoryMatches && sizeMatches && priceMatches
    })

    return filtered.sort((first, second) => {
      switch (applied.sortBy) {
        case "featured":
          return (second.featuredRank ?? 0) - (first.featuredRank ?? 0)
        case "newest":
          return new Date(second.createdAt) - new Date(first.createdAt)
        case "price-ascending":
          return getNumericPrice(first.price) - getNumericPrice(second.price)
        case "price-descending":
          return getNumericPrice(second.price) - getNumericPrice(first.price)
        case "popularity":
          return (second.popularity ?? 0) - (first.popularity ?? 0)
        case "discount":
          return (second.discountPercent ?? 0) - (first.discountPercent ?? 0)
        default:
          return first.name.localeCompare(second.name)
      }
    })
  }, [applied])

  return (
    <PageWrapper>
      <NavBar />
      <main className="pt-16">
        

        <section className="min-h-[50vh] bg-page pb-16">
          <CatalogSettings
            applied={applied}
            onApply={setApplied}
            onReset={() => setApplied(defaultCatalogState)}
            resultCount={visibleProducts.length}
            onSortChange={(sortBy) => setApplied((current) => ({ ...current, sortBy }))}
          />
          <ItemUI products={visibleProducts} />
        </section>
      </main>
    </PageWrapper>
  )
}

export default Catalog
