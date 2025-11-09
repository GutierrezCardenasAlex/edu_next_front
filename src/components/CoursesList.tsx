// components/CoursesList.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Star, ShoppingCart } from "lucide-react";
import { useCart } from "@/context/CartContext";

type Course = {
  id: string;
  title: string;
  description: string;
  image: string;
  instructor: string;
  price: number;
  rating: number;
};

export default function CoursesList() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

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
        image: "https://tse4.mm.bing.net/th/id/OIP.fk8n8DJu9-z_0bL8k-3UGQHaFO",
        instructor: "María Gómez",
        price: 34.99,
        rating: 4.7,
      },
      {
        id: "3",
        title: "Introducción a TypeScript",
        description: "Aprende los fundamentos de TypeScript con ejemplos reales.",
        image: "https://tse3.mm.bing.net/th/id/OIP.7g_ro9olLVcRSNT50Meg6gHaEK",
        instructor: "Carlos Díaz",
        price: 19.99,
        rating: 4.3,
      },
    ];

    setTimeout(() => {
      setCourses(mockCourses);
      setLoading(false);
    }, 500);
  }, []);

  if (loading) {
    return <p className="text-center py-10 text-gray-500">Cargando cursos...</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {courses.map((course) => (
        <div
          key={course.id}
          className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all hover:-translate-y-1 flex flex-col"
        >
          <Link href={`/courses/${course.id}`} className="flex-1">
            <img
              src={course.image}
              alt={course.title}
              className="w-full h-44 object-cover rounded-t-xl"
            />
            <div className="p-4 flex-1">
              <h3 className="font-semibold text-lg text-gray-800">{course.title}</h3>
              <p className="text-sm text-gray-600 mt-1 line-clamp-2">{course.description}</p>
              <div className="flex justify-between items-center mt-3">
                <span className="text-indigo-600 font-bold">${course.price}</span>
                <span className="flex items-center gap-1 text-yellow-500">
                  <Star size={16} />
                  {course.rating}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">Por {course.instructor}</p>
            </div>
          </Link>

          <button
            onClick={() => addToCart(course)}
            className="m-4 mt-0 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 flex items-center justify-center gap-2"
          >
            <ShoppingCart size={18} />
            Añadir al carrito
          </button>
        </div>
      ))}
    </div>
  );
}