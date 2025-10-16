import ButtonAuth from '@/components/ButtonAuth'
import CoursesList from '@/components/CoursesList'
import React from 'react'

const page = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Cursos destacados</h1>
      </header>
      <CoursesList />
    </div>
  )
}

export default page
