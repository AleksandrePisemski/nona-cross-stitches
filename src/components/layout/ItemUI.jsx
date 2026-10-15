import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemHeader,
  ItemTitle,
} from "../ui/item"
import { ShoppingBagIcon } from "@heroicons/react/24/outline"
import { useCart } from "../../context/CartContext.jsx"

// Keep the existing product cards while allowing the catalog page to control the list.
export default function ItemUI({ products }) {
  const { addToCart } = useCart()
  return (
    <div className="mx-auto w-full max-w-7xl px-4 sm:px-8">
      {products.length === 0 ? (
        <p className="py-16 text-center text-lg text-muted-foreground">No products match</p>
      ) : (
        <ItemGroup className="grid grid-cols-2 gap-4 pt-0 sm:grid-cols-3 sm:gap-5">
          {products.map((product) => (
            <Item key={product.id} variant="outline" className="relative bg-white/80 pb-14 shadow-sm">
              <ItemHeader>
                <img
                  src={product.image}
                  alt={product.name}
                  width={128}
                  height={128}
                  loading="lazy"
                  className="aspect-square w-full rounded-sm object-cover"
                />
              </ItemHeader>
              <ItemContent>
                <ItemTitle>{product.name}</ItemTitle>
                <ItemDescription>{product.description}</ItemDescription>
              </ItemContent>
              <button
                type="button"
                aria-label={`Add ${product.name} to bag`}
                title="Add to bag"
                onClick={() => addToCart(product)}
                className="absolute bottom-3 right-3 rounded-full bg-stitching-wood p-2 text-white transition-colors hover:bg-stitching-rose focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stitching-wood"
              >
                <ShoppingBagIcon className="size-5" aria-hidden="true" />
              </button>
            </Item>
          ))}
        </ItemGroup>
      )}
    </div>
  )
}
