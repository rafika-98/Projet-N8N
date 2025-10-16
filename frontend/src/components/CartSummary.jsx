function CartSummary({ cart, onSubmit }) {
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <div className="bg-white rounded-lg shadow p-6 space-y-4">
      <h3 className="text-lg font-semibold text-forest">Commande à emporter</h3>
      {cart.length === 0 ? (
        <p className="text-sm text-forest/70">Votre panier est vide.</p>
      ) : (
        <ul className="space-y-2">
          {cart.map((item) => (
            <li key={item._id} className="flex justify-between text-sm">
              <span>
                {item.name} <span className="text-forest/60">x{item.quantity}</span>
              </span>
              <span className="text-gold font-semibold">{(item.price * item.quantity).toLocaleString()} FCFA</span>
            </li>
          ))}
        </ul>
      )}
      <div className="flex justify-between font-semibold">
        <span>Total</span>
        <span className="text-gold">{total.toLocaleString()} FCFA</span>
      </div>
      <button
        onClick={onSubmit}
        className="w-full rounded bg-gold px-4 py-2 text-forest font-semibold hover:bg-yellow-400 transition disabled:opacity-60"
        disabled={cart.length === 0}
      >
        Valider la commande
      </button>
    </div>
  )
}

export default CartSummary
