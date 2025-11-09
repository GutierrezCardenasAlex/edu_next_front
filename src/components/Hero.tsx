import React from 'react'
import ButtonAuth from './ButtonAuth'


export default function Hero() {
  return (
    <section className="bg-gradient-to-r from-purple-600 to-indigo-700 text-white py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Aprende sin límites
            </h1>
            <p className="text-lg md:text-xl mb-8 text-purple-100">
              Miles de cursos impartidos por expertos de la industria. 
              Desarrolla nuevas habilidades, avanza en tu carrera y descubre tu potencial.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <ButtonAuth variant="secondary" size="lg" className="bg-white text-purple-700 hover:bg-gray-100">
                Explorar cursos
              </ButtonAuth>
              <ButtonAuth variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-purple-700">
                ¿Eres instructor?
              </ButtonAuth>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <div className="space-y-4">
                <div className="bg-white/20 h-4 rounded w-3/4"></div>
                <div className="bg-white/20 h-4 rounded w-full"></div>
                <div className="bg-white/20 h-4 rounded w-5/6"></div>
              </div>
              <div className="mt-6 grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold">50K+</div>
                  <div className="text-sm text-purple-200">Cursos</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">2M+</div>
                  <div className="text-sm text-purple-200">Estudiantes</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">100+</div>
                  <div className="text-sm text-purple-200">Países</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}