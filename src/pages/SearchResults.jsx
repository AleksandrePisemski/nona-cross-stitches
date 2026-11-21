import { useMemo } from "react"
import { useSearchParams } from "react-router"
import NavBar from "../components/layout/NavBar"
import PageWrapper from "../components/layout/PageWrapper"
import ItemUI from "../components/layout/ItemUI"
import { products } from "./catalog/catalogData"
import { rankProducts } from "../lib/productSearch"

export default function SearchResults() {
  const [searchParams] = useSearchParams()
  const query = searchParams.get("q") ?? ""
  const matches = useMemo(() => rankProducts(products, query), [query])

  return <PageWrapper>
    <NavBar />
    <main className="min-h-screen bg-page pb-16 pt-24">
      <header className="mx-auto max-w-7xl px-4 py-6 sm:px-8">
        <p className="text-sm uppercase tracking-wide text-stitching-wood/70">Product search</p>
        <h1 className="mt-2 text-3xl font-semibold text-stitching-wood">Results for &quot;{query}&quot;</h1>
        <p className="mt-2 text-sm text-stone-600">{matches.length} {matches.length === 1 ? "product" : "products"} found</p>
      </header>
      <ItemUI products={matches} />
    </main>
  </PageWrapper>
}
