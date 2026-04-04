import { ExternalLinkIcon } from "lucide-react"

const projects = [
  {
    title: "Weather Dashboard",
    description:
      "Real-time weather app with interactive maps and 7-day forecasts.",
    tags: ["Next.js", "TypeScript", "Mapbox"],
    url: "https://example.com",
  },
  {
    title: "Task Flow",
    description:
      "Kanban-style project management tool with drag-and-drop and real-time collaboration.",
    tags: ["React", "Node.js", "WebSockets"],
    url: "https://example.com",
  },
  {
    title: "Pulse Analytics",
    description:
      "Analytics dashboard for tracking key metrics with customizable widgets.",
    tags: ["Next.js", "D3.js", "PostgreSQL"],
    url: "https://example.com",
  },
  {
    title: "Recipease",
    description:
      "AI-powered recipe finder that suggests meals based on available ingredients.",
    tags: ["React", "OpenAI", "Tailwind"],
    url: "https://example.com",
  },
  {
    title: "Code Sandbox",
    description:
      "Browser-based code editor with live preview and shareable snippets.",
    tags: ["TypeScript", "Monaco", "Docker"],
    url: "https://example.com",
  },
  {
    title: "Fit Tracker",
    description:
      "Fitness tracking app with workout logging, progress charts, and goal setting.",
    tags: ["React Native", "Firebase", "Charts"],
    url: "https://example.com",
  },
]

export default function Showcase() {
  return (
    <main className="max-w-screen-lg mx-auto px-8 pt-8">
      <div className="py-20 max-w-screen-lg mx-auto">
        <h1 className="text-4xl font-normal pb-2">Showcase</h1>
        <p className="text-xl text-muted-foreground max-w-prose pb-12">
          A collection of apps and projects I&apos;ve built.
        </p>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <a
              key={project.title}
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col rounded-lg border border-border p-5 transition-colors hover:border-foreground/25 hover:bg-muted/50"
            >
              <div className="flex items-start justify-between gap-2">
                <h2 className="text-lg font-medium text-foreground">
                  {project.title}
                </h2>
                <ExternalLinkIcon className="size-4 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 mt-1" />
              </div>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                {project.description}
              </p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </a>
          ))}
        </div>
      </div>
    </main>
  )
}
