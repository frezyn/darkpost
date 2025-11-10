
"use client"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { ShaderRGB } from "@workspace/ui/components/shader-rgb"
import { Mail, CheckCircle, ArrowRight } from 'lucide-react';
import { useEffect, useState } from "react";
export default function() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);


  return (
    <div className="relative flex items-center justify-center min-h-screen w-full bg-black overflow-hidden">

      {/* Blurred background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-80 h-80 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-white/3 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white/2 rounded-full blur-2xl"></div>
      </div>

      <div className={`relative z-10 transition-all duration-700 ease-out ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
        <div className="bg-card/70 backdrop-blur-2xl border border-white/10 rounded-2xl p-10 md:p-12 shadow-2xl max-w-lg mx-4">

          {/* Header */}
          <div className="text-center mb-10">
            <div className="relative inline-block mb-8">
              <div className="relative bg-white rounded-full p-4 shadow-lg">
                <Mail className="w-10 h-10 text-black" />
              </div>
              <div className="absolute -bottom-1 -right-1 bg-black rounded-full p-1">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
            </div>

            <h1 className="text-4xl font-light text-white mb-3 tracking-tight">
              E-mail enviado
            </h1>
            <div className="w-12 h-px bg-white/20 mx-auto"></div>
          </div>

          {/* Content */}
          <div className="text-center mb-10 space-y-4">
            <p className="text-white/90 text-lg font-light leading-relaxed">
              E-mail enviado com sucesso!
            </p>
            <p className="text-white/60 text-base leading-relaxed max-w-sm mx-auto">
              Olá amigo(a)! <br />
              Enviamos um link especial de login no seu e-mail para você acessar a plataforma e realizar suas recargas de forma prática e segura! ;D
            </p>
          </div>

          {/* Simple action */}
          <div className="text-center mb-8">
            <button className="text-white/70 hover:text-white text-sm border-b border-white/20 hover:border-white/40 transition-all duration-200 pb-1">
              Não recebeu o e-mail? Clique aqui.
            </button>
          </div>

          {/* Progress steps - minimal */}
          <div className="flex justify-center items-center gap-6 mb-10">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-white"></div>
              <span className="text-xs text-white/60 uppercase tracking-wide">Enviado</span>
            </div>
            <div className="w-8 h-px bg-white/20"></div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-white/30"></div>
              <span className="text-xs text-white/40 uppercase tracking-wide">Verificar</span>
            </div>
            <div className="w-8 h-px bg-white/20"></div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-white/30"></div>
              <span className="text-xs text-white/40 uppercase tracking-wide">Login</span>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center pt-8 border-t border-white/5">
            <p className="text-xs text-white/30 tracking-wider uppercase">
              2025 | noob.exchange
            </p>
          </div>
        </div>
      </div>

      <ShaderRGB />
    </div>
  )
}
