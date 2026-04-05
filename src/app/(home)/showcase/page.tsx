import { ExternalLinkIcon } from "lucide-react"

const projects = [
  {
    title: "Karaoke",
    description:
      "A small demo build for Google, to showcase Chrome's Web Audio API.",
    tags: ["Web Audio API", "Three.js"],
    url: "https://demo-karaoke.artofrawr.com",
  },
  {
    title: "Second Screen",
    description:
      "Proof of concept for a second screen experience, implemented with Next.js and socket.io",
    tags: ["Next.js", "WebSockets"],
    url: "https://demo-secondscreen.artofrawr.com",
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
