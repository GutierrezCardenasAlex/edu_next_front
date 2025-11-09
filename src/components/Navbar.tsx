'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Search, ShoppingCart, Menu, X, Globe, ChevronDown, ChevronRight, User, LogOut, Settings } from 'lucide-react'
import { useSession, signOut } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
// Solo esta línea cambia en tu Navbar:
import { useCart } from "@/context/CartContext";

export default function Navbar() {
  const { data: session } = useSession()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false)
  const [isLangOpen, setIsLangOpen] = useState(false)
  const [isUserOpen, setIsUserOpen] = useState(false)
  // Dentro del componente:
  const { cartCount } = useCart();

  const categoriesRef = useRef<HTMLDivElement>(null)
  const langRef = useRef<HTMLDivElement>(null)
  const userRef = useRef<HTMLDivElement>(null)

  // Cerrar dropdowns al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (categoriesRef.current && !categoriesRef.current.contains(e.target as Node)) setIsCategoriesOpen(false)
      if (langRef.current && !langRef.current.contains(e.target as Node)) setIsLangOpen(false)
      if (userRef.current && !userRef.current.contains(e.target as Node)) setIsUserOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const categories = [
    { name: 'Desarrollo', icon: 'code', href: '/category/development' },
    { name: 'Negocios', icon: 'briefcase', href: '/category/business' },
    { name: 'Diseño', icon: 'palette', href: '/category/design' },
    { name: 'Marketing', icon: 'megaphone', href: '/category/marketing' },
    { name: 'IT & Software', icon: 'server', href: '/category/it' },
    { name: 'Desarrollo Personal', icon: 'user-check', href: '/category/personal' },
  ]

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center group-hover:bg-purple-700 transition-colors">
                <span className="text-white font-bold text-xl">L</span>
              </div>
              <span className="text-xl font-bold text-gray-900 hidden sm:block">
                LearnHub
              </span>
            </Link>
          </div>

          {/* Categorías (Desktop) */}
          <div className="hidden lg:flex items-center ml-8 relative" ref={categoriesRef}>
            <button
              onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-purple-600 hover:bg-purple-50 rounded-md flex items-center gap-1 transition-colors"
            >
              Categorías <ChevronDown className={`w-4 h-4 transition-transform ${isCategoriesOpen ? 'rotate-180' : ''}`} />
            </button>

            {isCategoriesOpen && (
              <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden">
                {categories.map((cat) => (
                  <Link
                    key={cat.name}
                    href={cat.href}
                    className="flex items-center justify-between px-4 py-3 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors"
                    onClick={() => setIsCategoriesOpen(false)}
                  >
                    <span className="flex items-center gap-3">
                      <span className="text-lg">{cat.icon}</span>
                      {cat.name}
                    </span>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Búsqueda */}
          <div className="flex-1 max-w-lg mx-8 hidden md:block">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="¿Qué quieres aprender?"
                className="w-full px-4 py-2 pl-10 pr-4 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              />
              <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600">
                  ×
                </button>
              )}
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center space-x-3">

            {/* Carrito */}
            {/* Carrito */}
            <Link href="/cart" className="relative p-2 text-gray-700 hover:text-purple-600 transition-colors">
              <ShoppingCart className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-purple-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Usuario logueado → Ventana emergente */}
            {session ? (
              <div className="hidden md:block relative" ref={userRef}>
                <button
                  onClick={() => setIsUserOpen(!isUserOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-full hover:bg-gray-100 transition-all"
                >
                  {session.user?.image ? (
                    <Image
                      src={session.user.image}
                      alt={session.user.name || 'User'}
                      width={36}
                      height={36}
                      className="rounded-full border-2 border-purple-200"
                    />
                  ) : (
                    <div className="w-9 h-9 bg-purple-600 rounded-full flex items-center justify-center text-white font-medium">
                      {session.user?.name?.[0] || 'U'}
                    </div>
                  )}
                  <ChevronDown className={`w-4 h-4 text-gray-600 transition-transform ${isUserOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Ventana emergente */}
                {isUserOpen && (
                  <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden">
                    {/* Header */}
                    <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 border-b">
                      <div className="flex items-center gap-3">
                        {session.user?.image ? (
                          <Image src={session.user.image} alt="User" width={48} height={48} className="rounded-full" />
                        ) : (
                          <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                            {session.user?.name?.[0] || 'U'}
                          </div>
                        )}
                        <div>
                          <p className="font-semibold text-gray-900">{session.user?.name}</p>
                          <p className="text-sm text-gray-600">{session.user?.email}</p>
                        </div>
                      </div>
                    </div>

                    {/* Opciones */}
                    <div className="py-2">
                      <Link
                        href="/dashboard"
                        className="flex items-center gap-3 px-4 py-3 hover:bg-purple-50 text-gray-700 transition-colors"
                        onClick={() => setIsUserOpen(false)}
                      >
                        <User className="w-5 h-5" />
                        Mis cursos
                      </Link>
                      <Link
                        href="/profile"
                        className="flex items-center gap-3 px-4 py-3 hover:bg-purple-50 text-gray-700 transition-colors"
                        onClick={() => setIsUserOpen(false)}
                      >
                        <Settings className="w-5 h-5" />
                        Configuración
                      </Link>
                    </div>

                    {/* Cerrar sesión */}
                    <div className="border-t pt-2">
                      <button
                        onClick={() => signOut({ callbackUrl: '/' })}
                        className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut className="w-5 h-5" />
                        Cerrar sesión
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Botones de login/registro si NO está logueado */
              <div className="hidden md:flex items-center space-x-2">
                <Link href="/auth/login" className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-purple-600">
                  Iniciar sesión
                </Link>
                <Link href="/auth/register" className="px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-md hover:bg-purple-700">
                  Registrarse
                </Link>
              </div>
            )}

            {/* Idioma */}
            <div className="hidden md:block relative" ref={langRef}>
              <button
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="p-2 text-gray-700 hover:text-purple-600 rounded-lg transition-colors"
              >
                <Globe className="w-5 h-5" />
              </button>
              {isLangOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border border-gray-200">
                  <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-purple-50">Español</button>
                  <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-purple-50">English</button>
                </div>
              )}
            </div>

            {/* Mobile menu */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-700"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t bg-white">
          <div className="px-4 pt-4 pb-3 space-y-4">
            {/* Búsqueda móvil */}
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar cursos..."
                className="w-full px-4 py-2 pl-10 pr-10 border border-gray-300 rounded-full text-sm"
              />
              <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
            </div>

            {/* Usuario en móvil */}
            {session && (
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                {session.user?.image ? (
                  <Image src={session.user.image} alt="User" width={40} height={40} className="rounded-full" />
                ) : (
                  <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white font-medium">
                    {session.user?.name?.[0]}
                  </div>
                )}
                <div>
                  <p className="font-medium text-sm">{session.user?.name}</p>
                  <p className="text-xs text-gray-500">{session.user?.email}</p>
                </div>
              </div>
            )}

            <div className="space-y-1">
              <p className="text-xs font-semibold text-gray-500 uppercase">Categorías</p>
              {categories.slice(0, 5).map((cat) => (
                <Link
                  key={cat.name}
                  href={cat.href}
                  className="flex items-center gap-2 py-2 text-sm text-gray-700 hover:text-purple-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span>{cat.icon}</span> {cat.name}
                </Link>
              ))}
            </div>

            <div className="space-y-2 pt-2 border-t">
              {session ? (
                <>
                  <Link href="/dashboard" className="block py-2 text-sm">Mis cursos</Link>
                  <button onClick={() => signOut()} className="w-full text-left py-2 text-sm text-red-600">
                    Cerrar sesión
                  </button>
                </>
              ) : (
                <>
                  <Link href="/auth/login" className="block py-2 text-sm">Iniciar sesión</Link>
                  <Link href="/auth/register" className="block py-2 text-sm font-medium text-purple-600">
                    Registrarse
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}