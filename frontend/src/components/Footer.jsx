function Footer() {
  return (
    <footer className="bg-forest text-white py-6 mt-8">
      <div className="container mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-4">
        <p>&copy; {new Date().getFullYear()} Le Gourmet du Sahel. Tous droits réservés.</p>
        <div className="flex gap-4 text-sm">
          <a href="tel:+22790000000" className="hover:text-gold">
            +227 90 00 00 00
          </a>
          <a href="mailto:contact@legourmet.com" className="hover:text-gold">
            contact@legourmet.com
          </a>
        </div>
      </div>
    </footer>
  )
}

export default Footer
