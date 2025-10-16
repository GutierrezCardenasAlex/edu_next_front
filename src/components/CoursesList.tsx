"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Star } from "lucide-react";

type Course = {
  id: string;
  title: string;
  description: string;
  image: string;
  instructor: string;
  price: number;
  rating: number;
};

const CoursesList = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const mockCourses: Course[] = [
      {
        id: "1",
        title: "Curso de React desde cero",
        description: "Aprende React paso a paso, desde componentes hasta hooks.",
        image: "https://facialix.com/wp-content/uploads/2023/05/react-blog.jpg",
        instructor: "Juan Pérez",
        price: 29.99,
        rating: 4.5,
      },
      {
        id: "2",
        title: "Node.js y Express Avanzado",
        description: "Construye APIs robustas con Node.js y Express.",
        image: "https://tse4.mm.bing.net/th/id/OIP.fk8n8DJu9-z_0bL8k-3UGQHaFO?cb=12&rs=1&pid=ImgDetMain&o=7&rm=3",
        instructor: "María Gómez",
        price: 34.99,
        rating: 4.7,
      },
      {
        id: "3",
        title: "Introducción a TypeScript",
        description: "Aprende los fundamentos de TypeScript con ejemplos reales.",
        image: "https://tse3.mm.bing.net/th/id/OIP.7g_ro9olLVcRSNT50Meg6gHaEK?cb=12&rs=1&pid=ImgDetMain&o=7&rm=3",
        instructor: "Carlos Díaz",
        price: 19.99,
        rating: 4.3,
      },
    ];

    setTimeout(() => {
      setCourses(mockCourses);
      setLoading(false);
    }, 500); // simula carga
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-10">
        <p className="text-gray-500 text-lg">Cargando cursos...</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {courses.map((course) => (
        <Link
          key={course.id}
          href={`/courses/${course.id}`}
          className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all transform hover:-translate-y-1"
        >
          <img
            src={course.image}
            alt={course.title}
            className="w-full h-44 object-cover rounded-t-xl"
          />
          <div className="p-4">
            <h2 className="text-lg font-semibold text-gray-800">{course.title}</h2>
            <p className="text-gray-600 text-sm mt-1 line-clamp-2">{course.description}</p>
            <div className="flex justify-between items-center mt-3">
              <span className="text-indigo-600 font-bold">${course.price.toFixed(2)}</span>
              <span className="flex items-center gap-1 text-yellow-400">
                <Star size={16} />
                {course.rating.toFixed(1)}
              </span>
            </div>
            <p className="text-gray-500 text-xs mt-1">Instructor: {course.instructor}</p>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default CoursesList;
