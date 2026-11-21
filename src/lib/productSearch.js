const normalizeText = (value = "") => String(value)
  .normalize("NFD")
  .replace(/[\u0300-\u036f]/g, "")
  .toLocaleLowerCase()
  .trim()
  .replace(/\s+/g, " ")

const normalizeSku = (value = "") => normalizeText(value).replace(/[\s-_.#/\\]+/g, "")

function getKeywords(product) {
  const values = [product.keywords, product.tags].flatMap((entry) => {
    if (Array.isArray(entry)) return entry
    if (typeof entry === "string") return entry.split(/[,;|]/)
    return []
  })
  return values.map(normalizeText).filter(Boolean)
}

export function rankProducts(products, query) {
  const normalizedQuery = normalizeText(query)
  if (!normalizedQuery) return []
  const tokens = normalizedQuery.split(" ").filter(Boolean)
  const compactQuery = normalizeSku(query)

  return products.map((product) => {
    const name = normalizeText(product.name)
    const sku = normalizeSku(product.sku ?? product.articleNumber ?? product.id)
    const description = normalizeText(product.description)
    const keywords = getKeywords(product)
    let score = 0

    if (name === normalizedQuery) score += 1200
    else if (name.startsWith(normalizedQuery)) score += 950
    else if (name.includes(normalizedQuery)) score += 800
    if (sku === compactQuery) score += 1100
    else if (compactQuery && sku.startsWith(compactQuery)) score += 900
    else if (compactQuery && sku.includes(compactQuery)) score += 750

    for (const token of tokens) {
      if (name.split(" ").some((word) => word.startsWith(token))) score += 140
      else if (name.includes(token)) score += 90
      if (sku.includes(normalizeSku(token))) score += 120
      if (description.includes(token)) score += 25
      if (keywords.some((keyword) => keyword === token)) score += 45
      else if (keywords.some((keyword) => keyword.includes(token))) score += 35
    }

    const allTokensMatch = tokens.every((token) =>
      name.includes(token) || sku.includes(normalizeSku(token)) || description.includes(token) || keywords.some((keyword) => keyword.includes(token)),
    )
    return { product, score: allTokensMatch ? score : 0 }
  }).filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score || a.product.name.localeCompare(b.product.name))
    .map(({ product }) => product)
}
