import React from 'react'
import Navbar from '@/components/Navbar'

import CoursesList from '@/components/CoursesList'


import Features from '@/components/Features'
import Categories from '@/components/Categories'
import Hero from '@/components/Hero'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <Hero />

      {/* Categorías Populares */}
      <Categories />

      {/* Cursos Destacados */}
      <section className="py-16 px-4 md:px-8 lg:px-16 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Cursos destacados
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Aprende las habilidades más demandadas con los mejores instructores
          </p>
          <CoursesList />
        </div>
      </section>

      {/* Características / Beneficios */}
      <Features/>

      {/* Footer */}
      <Footer />
    </div>
  )
}