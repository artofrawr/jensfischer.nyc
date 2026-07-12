import { ShowcaseItem, ShowCaseThumb } from "./showcase-thumb"

export function ShowcaseGrid({ items }: { items: ShowcaseItem[] }) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {items.map((item) => (
        <ShowCaseThumb key={item.url} {...item} />
      ))}
    </div>
  )
}
