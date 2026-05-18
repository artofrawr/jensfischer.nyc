import Link from "next/link"

const timeline = [
  {
    period: "2009 – Present",
    role: "Founder",
    org: "Profound",
    summary:
      "Profound is a web design & development studio based in New York City, with a focus on innovative user experiences for a modern web.",
  },
  {
    period: "2021 – 2026",
    role: "Technical Director",
    org: "Heat Waves",
    summary: "",
  },
  {
    period: "2020 – 2021",
    role: "Co-Founder & CTO",
    org: "HelloHerd",
    summary:
      "Herd is a market network for support groups, that makes it easy for therapists to create and run group sessions and for others to find and book them online.",
  },
  {
    period: "2016 – 2019",
    role: "Technical Director",
    org: "Something New",
    summary:
      "Responsible for shaping the technical strategy and vision for the company, supporting business development and overseeing successful engagement delivery. Hands-on tasks included prototyping, architectural and sprint planning, code contribution and review, documentation, and developing systems and tooling for improved workflows towards best practices.",
  },
  {
    period: "2011 – 2015",
    role: "Tech Lead",
    org: "B-Reel",
    summary:
      "Contractor on a tech lead level. Directly involved with pitches, client meetings, prototyping and full-stack development of campaigns, applications, microsites, and games for international brands.",
  },
  {
    period: "2009 – 2010",
    role: "Senior Interactive Developer",
    org: "Fantasy Interactive",
    summary: "TBD",
  },
  {
    period: "2006 – 2008",
    role: "Developer",
    org: "Firstborn",
    summary: "TBD",
  },
]

const principles = [
  {
    title: "Ship to learn",
    body: "Real users beat speculation. An MVP in production teaches more in a week than a polished platform in staging teaches in a quarter.",
  },
  {
    title: "Design is the moat",
    body: "Model access is commoditizing. The differentiator is judgment about what to build, what to cut and what good feels like.",
  },
  {
    title: "Generalists win in the AI era",
    body: "Tools have collapsed specialty boundaries. The most valuable engineer is one who can move from schema to API to UI to eval without changing seats.",
  },
  {
    title: "Lead by writing it down",
    body: "If a decision isn't written, it didn't happen. Documentation scales; meetings don't.",
  },
]

export default function About() {
  return (
    <main className="max-w-screen-lg mx-auto px-8 pt-8">
      <div className="py-20 max-w-screen-lg mx-auto">
        <p className="text-4xl font-normal leading-relaxed">
          I&apos;ve spent over two decades building digital experiences and
          products at the intersection of design, engineering and - most
          recently - AI. I&apos;ve led teams, shipped to millions of users, and
          now spend most of my time building AI-native products.
        </p>
      </div>

      <section className="py-12 max-w-screen-lg mx-auto">
        <h2 className="text-2xl font-medium pb-2">How I work</h2>
        <p className="text-xl text-muted-foreground max-w-prose pb-10">
          Some guiding principles.
        </p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {principles.map((p) => (
            <div key={p.title} className="rounded-lg border border-border p-5">
              <h3 className="text-lg font-medium text-foreground pb-2">
                {p.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {p.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-12 max-w-screen-lg mx-auto">
        <h2 className="text-2xl font-medium pb-2">Timeline</h2>
        <p className="text-xl text-muted-foreground max-w-prose pb-10">
          The shape of my career so far.
        </p>
        <div className="space-y-6">
          {timeline.map((entry) => (
            <div
              key={`${entry.period}-${entry.org}`}
              className="grid grid-cols-1 gap-2 sm:grid-cols-[200px_1fr] sm:gap-8 border-b border-border pb-6 last:border-b-0"
            >
              <div className="text-sm font-mono text-muted-foreground pt-1">
                {entry.period}
              </div>
              <div>
                <div className="text-lg font-medium text-foreground">
                  {entry.role}
                </div>
                <div className="text-sm text-muted-foreground pb-2">
                  {entry.org}
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed max-w-prose">
                  {entry.summary}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-12 max-w-screen-lg mx-auto">
        <h2 className="text-2xl font-medium pb-2">Clients</h2>
        <p className="text-xl font-regular pb-10 text-muted-foreground max-w-prose">
          I have been lucky to work with - and learn from - many great people
          and companies across diverse industries. Check out the{" "}
          <Link
            href="/showcase"
            className="underline underline-offset-4 hover:text-foreground"
          >
            Showcase
          </Link>{" "}
          page for a selection of case studies.
        </p>
        <div className="grid grid-flow-row-dense grid-cols-2 lg:grid-cols-4 client-logos">
          <div>
            <img className="w-1/3" src="/about/apple.svg" />
          </div>
          <div>
            <img className="w-1/2" src="/about/google.svg" />
          </div>
          <div>
            <img className="w-4/6" src="/about/microsoft.svg" />
          </div>
          <div>
            <img className="w-1/2" src="/about/spotify.svg" />
          </div>
          <div>
            <img className="w-2/5" src="/about/oscar.svg" />
          </div>
          <div>
            <img className="w-1/2" src="/about/shopify.svg" />
          </div>
          <div>
            <img className="w-1/3" src="/about/easports.svg" />
          </div>
          <div>
            <img className="w-1/2" src="/about/cocacola.svg" />
          </div>
          <div>
            <img className="w-2/5" src="/about/puma.svg" />
          </div>
          <div>
            <img className="w-1/2" src="/about/nationwide.svg" />
          </div>
          <div>
            <img className="w-3/5" src="/about/hotels.svg" />
          </div>
          <div>
            <img className="w-1/3" src="/about/fox.svg" />
          </div>
          <div>
            <img className="w-1/3" src="/about/htc.svg" />
          </div>
          <div>
            <img className="w-1/3" src="/about/ibm.svg" />
          </div>
          <div>
            <img className="w-2/3" src="/about/nationalgrid.svg" />
          </div>
          <div>
            <img className="w-1/2" src="/about/hp.svg" />
          </div>
        </div>
      </section>

      <section className="py-12 max-w-screen-lg mx-auto">
        <h2 className="text-2xl font-medium pb-2">Contact</h2>
        <p className="text-xl text-muted-foreground max-w-prose pb-6 leading-relaxed">
          Reach out to connect or collaborate. You can reach me via
          <Link
            href="https://www.linkedin.com/in/jensfischer-nyc/"
            className="underline underline-offset-4 hover:text-foreground"
          >
            LinkedIn
          </Link>
          or Email.
        </p>
      </section>
    </main>
  )
}
