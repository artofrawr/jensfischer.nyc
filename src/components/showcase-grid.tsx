import { ShowCaseCover, type ShowcaseItem } from "@/components/showcase-cover"

export function ShowcaseGrid({ items }: { items: ShowcaseItem[] }) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
      {items.map((item) => (
        <ShowCaseCover key={item.url} {...item} />
      ))}
    </div>
  )
}
