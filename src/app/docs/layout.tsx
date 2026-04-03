import { source } from "@/lib/source"
import { DocsSidebar } from "@/components/docs-sidebar"

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div
      className="border-b border-dashed"
      style={
        {
          "--sidebar-width": "272px",
          "--toc-width": "272px",
        } as React.CSSProperties
      }
    >
      <div className="container mx-auto border-x border-dashed bg-background flex w-full flex-1">
        <DocsSidebar tree={source.pageTree} />
        {children}
      </div>
    </div>
  )
}
