import { useState } from "react"
import { SlidersHorizontal } from "lucide-react"
import { Button } from "../../components/ui/button"
import { Checkbox } from "../../components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog"
import { RadioGroup, RadioGroupItem } from "../../components/ui/radio-group"
import { filterOptions } from "./catalogData"

const defaultState = {
  sortBy: "newest",
  categories: [],
  sizes: [],
  prices: [],
}

const sortOptions = [
  { value: "newest", label: "Newest" },
  { value: "name-ascending", label: "A�Z" },
  { value: "price-ascending", label: "Price: low to high" },
  { value: "price-descending", label: "Price: high to low" },
]

function countSelectedFilters(state) {
  return state.categories.length + state.sizes.length + state.prices.length
}

export default function CatalogSettings({ applied, onApply, onReset, resultCount }) {
  const [isOpen, setIsOpen] = useState(false)
  const [pending, setPending] = useState(applied)

  // Reopening starts from applied choices; closing without Apply discards edits.
  function handleOpenChange(open) {
    setPending(applied)
    setIsOpen(open)
  }

  function toggleOption(group, value, checked) {
    setPending((current) => ({
      ...current,
      [group]: checked
        ? [...current[group], value]
        : current[group].filter((selected) => selected !== value),
    }))
  }

  function applyPending() {
    onApply(pending)
  }

  function resetFilters() {
    setPending(defaultState)
    onReset()
  }

  const activeFilterCount = countSelectedFilters(applied)

  return (
    <div className=" z-40 mx-auto w-full max-w-7xl border-b border-stitching-wood/40 bg-page/95 px-4 py-4 backdrop-blur sm:px-8">
      <div className="flex justify-end">
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
          <DialogTrigger render={<Button type="button" variant="outline" size="lg" className="text-base" />}>
            <SlidersHorizontal aria-hidden="true" />
            Sort &amp; Filter
            {activeFilterCount > 0 && (
              <span className="ml-1 inline-flex size-6 items-center justify-center rounded-full bg-primary text-sm text-primary-foreground">
                {activeFilterCount}
              </span>
            )}
          </DialogTrigger>
          <DialogContent
            showCloseButton
            className="top-0 left-1/2 max-h-[min(90dvh,48rem)] w-full max-w-none -translate-x-1/2 translate-y-0 flex flex-col gap-0 overflow-hidden rounded-t-none rounded-b-2xl p-0 text-base data-open:animate-in data-open:slide-in-from-top-4 data-closed:animate-out data-closed:slide-out-to-top-4 sm:max-w-2xl"
          >
            <DialogHeader className="border-b px-6 py-5 pr-14">
              <DialogTitle className="text-xl">Sort &amp; Filter</DialogTitle>
            </DialogHeader>

            <div className="max-h-[calc(min(90dvh,48rem)-8.5rem)] space-y-7 overflow-y-auto px-6 py-6">
              <fieldset className="space-y-3">
                <legend className="text-lg font-semibold">Sort</legend>
                <RadioGroup
                  value={pending.sortBy}
                  onValueChange={(sortBy) => setPending((current) => ({ ...current, sortBy }))}
                  aria-label="Sort products"
                  className="grid gap-3 sm:grid-cols-2"
                >
                  {sortOptions.map((option) => (
                    <label key={option.value} className="flex cursor-pointer items-center gap-3 text-base">
                      <RadioGroupItem value={option.value} aria-label={option.label} className="size-5" />
                      {option.label}
                    </label>
                  ))}
                </RadioGroup>
              </fieldset>

              <fieldset className="space-y-3">
                <legend className="text-lg font-semibold">Category</legend>
                {filterOptions.category.map((option) => (
                  <label key={option.value} className="flex cursor-pointer items-center gap-3 text-base">
                    <Checkbox
                      aria-label={option.label}
                      className="size-5"
                      checked={pending.categories.includes(option.value)}
                      onCheckedChange={(checked) => toggleOption("categories", option.value, checked)}
                    />
                    {option.label}
                  </label>
                ))}
              </fieldset>

              <fieldset className="space-y-3">
                <legend className="text-lg font-semibold">Size</legend>
                {filterOptions.size.map((option) => (
                  <label key={option.value} className="flex cursor-pointer items-center gap-3 text-base">
                    <Checkbox
                      aria-label={option.label}
                      className="size-5"
                      checked={pending.sizes.includes(option.value)}
                      onCheckedChange={(checked) => toggleOption("sizes", option.value, checked)}
                    />
                    {option.label}
                  </label>
                ))}
              </fieldset>

              <fieldset className="space-y-3">
                <legend className="text-lg font-semibold">Price range</legend>
                {filterOptions.price.map((option) => (
                  <label key={option.value} className="flex cursor-pointer items-center gap-3 text-base">
                    <Checkbox
                      aria-label={option.label}
                      className="size-5"
                      checked={pending.prices.some((range) => range.value === option.value)}
                      onCheckedChange={(checked) =>
                        toggleOption(
                          "prices",
                          { value: option.value, min: option.min, max: option.max },
                          checked,
                        )
                      }
                    />
                    {option.label}
                  </label>
                ))}
              </fieldset>
            </div>

            <div className="flex flex-col-reverse gap-3 border-t bg-background px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-base text-muted-foreground" aria-live="polite">
                Show {resultCount} {resultCount === 1 ? "result" : "results"}
              </p>
              <div className="flex gap-2 sm:justify-end">
                <Button type="button" variant="outline" size="lg" className="text-base" onClick={resetFilters}>
                  Reset
                </Button>
                <Button type="button" size="lg" className="text-base" onClick={applyPending}>
                  Apply
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}






