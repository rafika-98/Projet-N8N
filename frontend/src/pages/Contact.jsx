function Contact() {
  return (
    <section className="container mx-auto px-4 py-12 space-y-10">
      <div className="grid gap-8 lg:grid-cols-2 items-start">
        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-forest">Nous contacter</h1>
          <p className="text-forest/80">
            Le Gourmet du Sahel vous accueille dans une ambiance chaleureuse inspirée des paysages nigériens.
          </p>
          <div className="bg-white rounded-lg shadow p-6 space-y-3 text-sm text-forest/80">
            <p>
              <span className="font-semibold text-forest">Adresse :</span> Boulevard Mali Béro, Quartier Plateau,
              Niamey
            </p>
            <p>
              <span className="font-semibold text-forest">Horaires :</span> Lundi - Dimanche, 12h00-15h00 et 19h00-23h00
            </p>
            <p>
              <span className="font-semibold text-forest">Téléphone :</span>{' '}
              <a href="tel:+22790000000" className="text-forest hover:text-gold">
                +227 90 00 00 00
              </a>
            </p>
            <p>
              <span className="font-semibold text-forest">Email :</span>{' '}
              <a href="mailto:contact@legourmet.com" className="text-forest hover:text-gold">
                contact@legourmet.com
              </a>
            </p>
          </div>
        </div>
        <div className="aspect-video w-full overflow-hidden rounded-lg shadow">
          <iframe
            title="Le Gourmet du Sahel"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d63332.79044211546!2d2.063!3d13.5116!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xe1bcd538999fdfb%3A0x58c5d4bafa4250b9!2sNiamey%2C%20Niger!5e0!3m2!1sfr!2sne!4v1713620000000!5m2!1sfr!2sne"
            className="h-full w-full border-0"
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>
    </section>
  )
}

export default Contact
