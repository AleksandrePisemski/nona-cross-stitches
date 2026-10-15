// Keep the product data and filter options together so categories can be extended here.
const categories = [
  { value: "Landscapes", label: "Landscapes" },
  { value: "Flowers", label: "Flowers" },
  { value: "Animals", label: "Animals" },
  { value: "Religious", label: "Religious" },
  { value: "People", label: "People" },
  { value: "Architecture", label: "Architecture" },
  { value: "Children's designs", label: "Children's designs" },
  { value: "Modern designs", label: "Modern designs" },
]

export const products = [
  {
    id: "datka",
    name: "datka",
    description: "Everyday tasks and UI generation.",
    image: "https://images.unsplash.com/photo-1650804068570-7fb2e3dbf888?q=80&w=640&auto=format&fit=crop",
    credit: "Valeria Reverdo on Unsplash",
    price: "$0.99",
    category: categories[5].value,
    size: "small",
    createdAt: "2026-10-12T09:00:00.000Z",
  },
  {
    id: "v0-1-5-lg",
    name: "v0-1.5-lg",
    description: "Advanced thinking or reasoning.",
    image: "https://images.unsplash.com/photo-1610280777472-54133d004c8c?q=80&w=640&auto=format&fit=crop",
    credit: "Michael Oeser on Unsplash",
    price: "$1.99",
    category: categories[0].value,
    size: "medium",
    createdAt: "2026-10-11T09:00:00.000Z",
  },
  ...Array.from({ length: 7 }, (_, index) => ({
    id: `v0-2-0-mini-${index + 1}`,
    name: "v0-2.0-mini",
    description: "Open Source model for everyone.",
    image: "https://images.unsplash.com/photo-1602146057681-08560aee8cde?q=80&w=640&auto=format&fit=crop",
    credit: "Cherry Laithang on Unsplash",
    price: index % 2 === 0 ? "$0.99" : "$1.99",
    category: categories[index + 1].value,
    size: index % 2 === 0 ? "small" : "medium",
    createdAt: `2026-10-${String(10 - index).padStart(2, "0")}T09:00:00.000Z`,
  })),
]

export const filterOptions = {
  category: categories,
  size: [{ value: "small", label: "Small" }],
  price: [{ value: "under-one-dollar", label: "Under $1", min: 0, max: 1 }],
}
