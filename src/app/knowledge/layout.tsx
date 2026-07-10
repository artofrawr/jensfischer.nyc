export default function KnowledgeLayout({
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
        {children}
      </div>
    </div>
  )
}
