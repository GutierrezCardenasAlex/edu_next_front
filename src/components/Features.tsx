import React from 'react'
import { CheckCircle, Award, Users, Clock } from 'lucide-react'

const features = [
  {
    icon: <CheckCircle className="w-8 h-8 text-green-600" />,
    title: 'Certificados reconocidos',
    desc: 'Obtén un certificado al finalizar cada curso',
  },
  {
    icon: <Award className="w-8 h-8 text-yellow-600" />,
    title: 'Instructores expertos',
    desc: 'Aprende de profesionales con experiencia real',
  },
  {
    icon: <Users className="w-8 h-8 text-blue-600" />,
    title: 'Comunidad activa',
    desc: 'Conecta con miles de estudiantes como tú',
  },
  {
    icon: <Clock className="w-8 h-8 text-purple-600" />,
    title: 'Aprende a tu ritmo',
    desc: 'Acceso ilimitado de por vida a tus cursos',
  },
]

export default function Features() {
  return (
    <section className="py-16 px-4 md:px-8 lg:px-16 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, i) => (
            <div key={i} className="text-center">
              <div className="flex justify-center mb-4">{feature.icon}</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 text-sm">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}