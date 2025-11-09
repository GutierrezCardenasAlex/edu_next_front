// app/cart/page.tsx
"use client";

import { useSession } from "next-auth/react";
import { useCart } from "@/context/CartContext";
import Link from "next/link";
import Image from "next/image";
import { Trash2, CreditCard, LogIn } from "lucide-react";

export default function CartPage() {
  const { data: session } = useSession();
  const { cart, removeFromCart, clearCart, total, cartCount } = useCart();

  const handleCheckout = () => {
    if (!session) {
      alert("Inicia sesión para pagar");
      return;
    }
    alert(`Pago simulado: $${total.toFixed(2)}`);
    clearCart();
  };

  if (cartCount === 0) {
    return (
      <div className="max-w-4xl mx-auto py-16 text-center">
        <h1 className="text-3xl font-bold mb-4">Tu carrito está vacío</h1>
        <Link href="/" className="text-purple-600 hover:underline">
          Explorar cursos
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8">Carrito ({cartCount})</h1>

      {!session && (
        <div className="bg-purple-50 border border-purple-200 p-4 rounded-lg mb-6 flex items-center justify-between">
          <p className="text-sm">Inicia sesión para completar tu compra</p>
          <Link
            href="/auth/login"
            className="bg-purple-600 text-white px-4 py-2 rounded text-sm flex items-center gap-2"
          >
            <LogIn size={16} />
            Iniciar sesión
          </Link>
        </div>
      )}

      <div className="space-y-4">
        {cart.map((item) => (
          <div key={item.id} className="flex gap-4 bg-white p-4 rounded-lg shadow">
            <Image
              src={item.image}
              alt={item.title}
              width={80}
              height={80}
              className="rounded object-cover"
            />
            <div className="flex-1">
              <h3 className="font-semibold">{item.title}</h3>
              <p className="text-sm text-gray-500">Por {item.instructor}</p>
            </div>
            <p className="font-bold text-purple-600">${item.price.toFixed(2)}</p>
            <button
              onClick={() => removeFromCart(item.id)}
              className="text-red-500 hover:text-red-700"
            >
              <Trash2 size={20} />
            </button>
          </div>
        ))}
      </div>

      <div className="mt-8 bg-gray-50 p-6 rounded-lg">
        <div className="flex justify-between text-xl font-bold mb-4">
          <span>Total:</span>
          <span className="text-purple-600">${total.toFixed(2)}</span>
        </div>

        <button
          onClick={handleCheckout}
          disabled={!session}
          className={`w-full py-3 rounded-lg flex items-center justify-center gap-2 font-medium transition ${
            session
              ? "bg-purple-600 hover:bg-purple-700 text-white"
              : "bg-gray-400 text-gray-200 cursor-not-allowed"
          }`}
        >
          <CreditCard size={20} />
          {session ? "Pagar ahora" : "Inicia sesión para pagar"}
        </button>
      </div>
    </div>
  );
}