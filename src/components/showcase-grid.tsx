import { SimpleGrid } from "@chakra-ui/react"

import { ShowcaseItem, ShowCaseThumb } from "./showcase-thumb"

export function ShowcaseGrid({ items }: { items: ShowcaseItem[] }) {
  return (
    <SimpleGrid columns={{ base: 1, sm: 2, lg: 3, xl: 4 }} gap={5}>
      {items.map((item) => (
        <ShowCaseThumb key={item.url} {...item} />
      ))}
    </SimpleGrid>
  )
}
