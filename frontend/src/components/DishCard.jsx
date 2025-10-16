function DishCard({ dish, onAdd }) {
  return (
    <div className="rounded-lg overflow-hidden bg-white shadow hover:shadow-lg transition">
      <img src={dish.image_url} alt={dish.name} className="h-48 w-full object-cover" />
      <div className="p-4 space-y-2">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-forest">{dish.name}</h3>
          <span className="text-gold font-bold">{dish.price.toLocaleString()} FCFA</span>
        </div>
        <p className="text-sm text-forest/80">{dish.description}</p>
        {onAdd && (
          <button
            onClick={() => onAdd(dish)}
            className="mt-3 w-full rounded bg-forest px-4 py-2 text-white font-semibold hover:bg-forest/90 transition"
          >
            Ajouter au panier
          </button>
        )}
      </div>
    </div>
  )
}

export default DishCard
