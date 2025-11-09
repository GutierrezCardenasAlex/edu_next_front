import React from 'react'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-8">
          <div>
            <h3 className="font-bold text-white mb-4">LearnHub</h3>
            <p className="text-sm">Tu plataforma de aprendizaje online líder.</p>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-3">Cursos</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white">Todos los cursos</a></li>
              <li><a href="#" className="hover:text-white">Novedades</a></li>
              <li><a href="#" className="hover:text-white">Más vendidos</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-3">Compañía</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white">Sobre nosotros</a></li>
              <li><a href="#" className="hover:text-white">Carreras</a></li>
              <li><a href="#" className="hover:text-white">Prensa</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-3">Soporte</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white">Ayuda</a></li>
              <li><a href="#" className="hover:text-white">Contacto</a></li>
              <li><a href="#" className="hover:text-white">Privacidad</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-3">Síguenos</h4>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-white">Twitter</a>
              <a href="#" className="hover:text-white">LinkedIn</a>
              <a href="#" className="hover:text-white">YouTube</a>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-8 text-center text-sm">
          <p>&copy; 2025 LearnHub. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  )
}