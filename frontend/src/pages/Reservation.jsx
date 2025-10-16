import ReservationForm from '../components/ReservationForm'

function Reservation() {
  return (
    <section className="container mx-auto px-4 py-12 grid gap-10 lg:grid-cols-2 items-start">
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-forest">Réserver une table</h1>
        <p className="text-forest/80">
          Planifiez votre prochain repas dans notre salle conviviale au cœur de Niamey. Complétez le formulaire et
          notre équipe vous confirmera la disponibilité dans les plus brefs délais.
        </p>
        <ul className="space-y-3 text-forest/80">
          <li>• Service midi : 12h00 - 15h00</li>
          <li>• Service soir : 19h00 - 23h00</li>
          <li>• Groupes jusqu’à 20 personnes</li>
        </ul>
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-forest">Adresse</h2>
          <p className="text-sm text-forest/70 mt-2">
            Boulevard Mali Béro, Quartier Plateau, Niamey (Niger)
            <br />
            Tél : +227 90 00 00 00
          </p>
        </div>
      </div>
      <ReservationForm />
    </section>
  )
}

export default Reservation
