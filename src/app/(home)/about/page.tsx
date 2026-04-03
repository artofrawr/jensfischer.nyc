export default function About() {
  return (
    <main className="max-w-screen-lg mx-auto px-8 pt-8">
      <div className="text-4xl py-20 leading-relaxed max-w-screen-lg mx-auto">
        <p className="font-normal">
          Jens Fischer - Full Stack Engineer based out of NYC. Over two decades
          of experience crafting interactive experiences and digital products.
        </p>
      </div>

      <div className="py-12 max-w-screen-lg mx-auto">
        <h2 className="text-2xl font-medium pb-2">Clients</h2>
        <p className="text-xl font-regular pb-10 text-muted-foreground max-w-prose">
          I have been lucky to work with - and learn from - many great people and
          companies across diverse industries.
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
      </div>

      <div className="py-28 max-w-screen-lg mx-auto">
        <h2 className="text-2xl font-medium pb-2">Contact</h2>
        <p className="text-xl font-regular pb-10 text-muted-foreground max-w-prose">
          You can find me on{" "}
          <a
            href="https://www.linkedin.com/in/jensfischer-nyc/"
            target="_blank"
            className="underline text-foreground"
          >
            LinkedIn
          </a>{" "}
          and{" "}
          <a
            href="https://github.com/artofrawr"
            target="_blank"
            className="underline text-foreground"
          >
            Github
          </a>
          . For work inquiries, please reach out via{" "}
          <a
            href="mailto:jens@weareprofound.com"
            className="underline text-foreground"
          >
            jens@weareprofound.com
          </a>
          .
        </p>
      </div>
    </main>
  )
}
