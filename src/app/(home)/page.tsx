export default function Home() {
  return (
    <main className="max-w-screen-lg mx-auto px-8 pt-8">
      <div className="text-4xl py-20 leading-relaxed max-w-screen-lg mx-auto">
        <div className="font-bold">Hey!</div>
        <p className="font-normal">
          I&apos;m Jens Fischer - a Product Engineer based out of NYC. I take
          pride in user experiences that are built with attention to detail.
        </p>
      </div>

      <div className="py-12 max-w-screen-lg mx-auto">
        <h2 className="text-2xl font-medium pb-2">Clients</h2>
        <p className="text-xl font-regular pb-10 text-muted-foreground max-w-prose">
          I have been lucky to work with - and learn from - many great people
          and companies across diverse industries.
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
    </main>
  )
}
