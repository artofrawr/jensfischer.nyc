"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog"
import { Command } from "cmdk"
import { FileTextIcon, SearchIcon } from "lucide-react"

import { cn } from "@/lib/utils"

export interface SearchableItem {
  title: string
  url: string
  description?: string
  group: string
}

interface CommandMenuProps {
  items: SearchableItem[]
}

export function CommandMenu({ items }: CommandMenuProps) {
  const [open, setOpen] = React.useState(false)
  const router = useRouter()

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((prev) => !prev)
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  const runCommand = React.useCallback((command: () => void) => {
    setOpen(false)
    command()
  }, [])

  const groups = React.useMemo(() => {
    const map = new Map<string, SearchableItem[]>()
    for (const item of items) {
      const existing = map.get(item.group)
      if (existing) {
        existing.push(item)
      } else {
        map.set(item.group, [item])
      }
    }
    return map
  }, [items])

  return (
    <DialogPrimitive.Root open={open} onOpenChange={setOpen}>
      <DialogPrimitive.Trigger
        className={cn(
          "relative inline-flex h-8 w-full items-center justify-start gap-2 rounded-md border border-input bg-muted/50 px-3 text-sm text-muted-foreground shadow-xs transition-colors hover:bg-accent hover:text-accent-foreground sm:w-56 lg:w-64",
        )}
      >
        <SearchIcon className="size-3.5 shrink-0" />
        <span className="hidden lg:inline-flex">Search docs...</span>
        <span className="inline-flex lg:hidden">Search...</span>
        <kbd className="pointer-events-none ml-auto hidden h-5 select-none items-center gap-0.5 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
          <span className="text-xs">&#8984;</span>K
        </kbd>
      </DialogPrimitive.Trigger>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Backdrop className="fixed inset-0 z-50 bg-black/10 duration-100 supports-backdrop-filter:backdrop-blur-xs data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0" />
        <DialogPrimitive.Popup className="fixed top-[20%] left-1/2 z-50 w-full max-w-lg -translate-x-1/2 rounded-xl bg-popover text-popover-foreground shadow-lg ring-1 ring-foreground/10 outline-none duration-100 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95">
          <DialogPrimitive.Title className="sr-only">
            Search docs
          </DialogPrimitive.Title>
          <Command className="flex h-full w-full flex-col overflow-hidden">
            <div className="flex items-center border-b px-3">
              <SearchIcon className="mr-2 size-4 shrink-0 opacity-50" />
              <Command.Input
                placeholder="Type a command or search..."
                className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
            <Command.List className="max-h-[300px] overflow-y-auto overflow-x-hidden p-1">
              <Command.Empty className="py-6 text-center text-sm text-muted-foreground">
                No results found.
              </Command.Empty>
              {Array.from(groups).map(([group, groupItems]) => (
                <Command.Group
                  key={group}
                  heading={group}
                  className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground"
                >
                  {groupItems.map((item) => (
                    <Command.Item
                      key={item.url}
                      value={`${item.title} ${item.description ?? ""}`}
                      onSelect={() =>
                        runCommand(() => router.push(item.url))
                      }
                      className="relative flex cursor-default items-center gap-2 rounded-md px-2 py-2.5 text-sm outline-none select-none data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground"
                    >
                      <FileTextIcon className="size-4 shrink-0 opacity-60" />
                      <div className="flex flex-col">
                        <span>{item.title}</span>
                        {item.description && (
                          <span className="text-xs text-muted-foreground line-clamp-1">
                            {item.description}
                          </span>
                        )}
                      </div>
                    </Command.Item>
                  ))}
                </Command.Group>
              ))}
            </Command.List>
          </Command>
        </DialogPrimitive.Popup>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}
