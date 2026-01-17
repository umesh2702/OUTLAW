"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Suspense } from "react"
import AuthLayout from "@/components/auth/auth-layout"
import LoginForm from "@/components/auth/login-form"
import SignupForm from "@/components/auth/signup-form"

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuthLayout>
        <div className="relative overflow-hidden">
          {/* Toggle Buttons */}
          <div className="flex mb-8 bg-black/30 rounded-lg p-1">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-300 ${
                isLogin ? "bg-red-500 text-white shadow-lg" : "text-gray-400 hover:text-white"
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-300 ${
                !isLogin ? "bg-red-500 text-white shadow-lg" : "text-gray-400 hover:text-white"
              }`}
            >
              Join Club
            </button>
          </div>

          {/* Form Container with Sliding Animation */}
          <div className="relative">
            <AnimatePresence mode="wait">
              {isLogin ? (
                <motion.div
                  key="login"
                  initial={{ x: -300, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: 300, opacity: 0 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                >
                  <LoginForm />
                </motion.div>
              ) : (
                <motion.div
                  key="signup"
                  initial={{ x: 300, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -300, opacity: 0 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                >
                  <SignupForm />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </AuthLayout>
    </Suspense>
  )
}
