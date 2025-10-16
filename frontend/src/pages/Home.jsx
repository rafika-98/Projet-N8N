import { Link } from 'react-router-dom'

const heroImage =
  'https://images.unsplash.com/photo-1546069901-eacef0df6022?auto=format&fit=crop&w=1200&q=80'

function Home() {
  return (
    <section className="bg-gradient-to-br from-desert-light via-white to-desert-light">
      <div className="container mx-auto px-4 py-16 grid gap-10 lg:grid-cols-2 items-center">
        <div className="space-y-6">
          <p className="uppercase text-sm tracking-[0.3em] text-gold">Cuisine nigérienne authentique</p>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-forest leading-tight">
            Bienvenue au Gourmet du Sahel, la table incontournable de Niamey
          </h1>
          <p className="text-lg text-forest/80">
            Découvrez une sélection raffinée de plats ouest-africains, préparés avec passion et ingrédients locaux.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              to="/menu"
              className="rounded bg-forest px-6 py-3 text-white font-semibold shadow hover:bg-forest/90 transition"
            >
              Voir le menu
            </Link>
            <Link
              to="/reservation"
              className="rounded border-2 border-forest px-6 py-3 text-forest font-semibold hover:bg-forest hover:text-white transition"
            >
              Réserver une table
            </Link>
          </div>
        </div>
        <div className="relative">
          <div className="absolute -inset-4 bg-gold/20 rounded-full blur-3xl" aria-hidden></div>
          <img src={heroImage} alt="Table nigérienne" className="relative z-10 rounded-3xl shadow-xl" />
        </div>
      </div>
    </section>
  )
}

export default Home
