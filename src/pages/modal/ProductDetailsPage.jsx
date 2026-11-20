import * as React from "react"
import { Link, useParams } from "react-router"
import NavBar from "../../components/layout/NavBar"
import PageWrapper from "../../components/layout/PageWrapper"
import { Button } from "../../components/ui/button"
import { useCart } from "../../context/CartContext.jsx"
import { products } from "../catalog/catalogData"

export default function ProductDetailsPage() {
  const { slug } = useParams()
  const { addToCart } = useCart()
  const product = products.find((item) => item.slug === slug || item.id === slug)
  const productDetails = product ? [
    ["Category", product.category],
    ["Size", product.size],
    ["Image credit", product.credit],
    ["Added to catalog", product.createdAt ? new Date(product.createdAt).toLocaleDateString() : null],
  ].filter(([, value]) => value != null && value !== "") : []

  return <PageWrapper><NavBar /><main className="mx-auto max-w-5xl px-4 pb-16 pt-24">
    {!product ? <div className="py-16 text-center">Product not found. <Link to="/catalog" className="underline">Back to catalog</Link></div> :
      <div className="grid gap-8 sm:grid-cols-2">
        <ProductGallery images={product.images ?? (product.image ? [product.image] : [])} alt={product.name} />
        <section className="space-y-4">
          <h1 className="text-3xl font-semibold">{product.name}</h1>
          {product.sku && <p className="text-sm text-muted-foreground">SKU: {product.sku}</p>}
          {product.price != null && <p className="text-xl">{product.price}{product.currency ? ` ${product.currency}` : ""}</p>}
          {product.availability && <p>{product.availability.replaceAll("_", " ")}</p>}
          <Button onClick={() => addToCart(product)} disabled={product.availability === "out_of_stock"}>Add to Cart</Button>
          {product.description && <p className="leading-relaxed text-muted-foreground">{product.description}</p>}
          {productDetails.length > 0 && <section><h2 className="mb-3 font-semibold">Product details</h2><dl className="grid grid-cols-2 gap-y-2 text-sm">{productDetails.map(([label, value]) => <div key={label} className="contents"><dt className="text-muted-foreground">{label}</dt><dd>{value}</dd></div>)}</dl></section>}
          {product.specs && Object.keys(product.specs).length > 0 && <section><h2 className="mb-3 font-semibold">Specifications</h2><dl className="grid grid-cols-2 gap-y-2 text-sm">{Object.entries(product.specs).map(([key, value]) => <div key={key} className="contents"><dt className="text-muted-foreground">{key}</dt><dd>{String(value)}</dd></div>)}</dl></section>}
          {/* Product variations can be added when the product model supports them. */}
        </section>
      </div>}
  </main></PageWrapper>
}

function ProductGallery({ images, alt }) {
  const [active, setActive] = React.useState(0)
  const [zoomed, setZoomed] = React.useState(false)
  const startX = React.useRef(null)
  if (!images.length) return <div className="flex aspect-square items-center justify-center rounded bg-muted text-muted-foreground">Image coming soon</div>
  const next = (step) => setActive((current) => (current + step + images.length) % images.length)
  return <div>
    <div className="relative" onTouchStart={(event) => { startX.current = event.touches[0].clientX }} onTouchEnd={(event) => { const dx = event.changedTouches[0].clientX - startX.current; if (Math.abs(dx) > 40) next(dx < 0 ? 1 : -1) }}>
      <button type="button" onClick={() => setZoomed(true)} aria-label={`Zoom ${alt}`} className="w-full cursor-zoom-in"><img src={images[active]} alt={alt} className="aspect-square w-full rounded-lg object-contain" /></button>
      {images.length > 1 && <div className="mt-3 flex gap-2 overflow-x-auto">{images.map((image, index) => <button key={image} type="button" aria-label={`Show image ${index + 1}`} aria-pressed={index === active} onClick={() => setActive(index)} className="size-16 shrink-0 overflow-hidden rounded border"><img src={image} alt="" className="size-full object-cover" /></button>)}</div>}
    </div>
    {zoomed && <div role="dialog" aria-modal="true" aria-label={`${alt} image viewer`} onClick={() => setZoomed(false)} className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4"><button type="button" aria-label="Close image viewer" className="absolute right-5 top-5 text-3xl text-white">×</button><img src={images[active]} alt={alt} className="max-h-full max-w-full object-contain" /></div>}
  </div>
}

