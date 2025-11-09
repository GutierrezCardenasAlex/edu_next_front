import React from 'react'

const categories = [
  { name: 'Desarrollo Web', icon: '💻', color: 'bg-blue-100 text-blue-700' },
  { name: 'Diseño UX/UI', icon: '🎨', color: 'bg-pink-100 text-pink-700' },
  { name: 'Marketing Digital', icon: '📈', color: 'bg-green-100 text-green-700' },
  { name: 'Data Science', icon: '📊', color: 'bg-purple-100 text-purple-700' },
  { name: 'Negocios', icon: '💼', color: 'bg-yellow-100 text-yellow-700' },
  { name: 'Idiomas', icon: '🌍', color: 'bg-indigo-100 text-indigo-700' },
]

export default function Categories() {
  return (
    <section className="py-12 px-4 md:px-8 lg:px-16">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">
          Categorías populares
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat) => (
            <a
              key={cat.name}
              href="#"
              className="group p-6 bg-white border border-gray-200 rounded-xl hover:border-purple-500 hover:shadow-lg transition-all text-center"
            >
              <div className={`w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center text-2xl ${cat.color}`}>
                {cat.icon}
              </div>
              <p className="text-sm font-medium text-gray-700 group-hover:text-purple-600">
                {cat.name}
              </p>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}