"use client"

import type React from "react"

interface AuthLayoutProps {
  children: React.ReactNode
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-black flex">
      {/* Left Side - Tagline & Background */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden animate-in slide-in-from-left duration-800">
        {/* Moody gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-red-900/20 via-black to-red-800/10" />

        {/* Abstract pattern overlay */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-red-500 rounded-full blur-3xl" />
          <div className="absolute bottom-1/3 right-1/4 w-48 h-48 bg-red-600 rounded-full blur-2xl" />
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center items-start p-16 text-white">
          <div className="animate-in slide-in-from-bottom duration-600 delay-300">
            <h1 className="text-6xl font-bold mb-6 leading-tight">
              Enter the
              <br />
              <span className="text-red-300">Outlaw Club</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-md">
              Where rebellion meets style. Join the underground fashion movement.
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 animate-in slide-in-from-right duration-800">
        <div className="w-full max-w-md">
          {/* Frosted glass card */}
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 shadow-2xl animate-in zoom-in duration-500 delay-400">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
