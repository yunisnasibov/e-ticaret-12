"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"

export interface User {
  id: string
  name: string
  email: string
  avatar?: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<boolean>
  register: (name: string, email: string, password: string) => Promise<boolean>
  logout: () => void
  updateUser: (userData: Partial<User>) => void
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  login: async () => false,
  register: async () => false,
  logout: () => {},
  updateUser: () => {},
})

export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // LocalStorage'dan kullanıcı bilgilerini yükle
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user")
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser))
        } catch (error) {
          console.error("Kullanıcı bilgileri yüklenirken hata oluştu:", error)
        }
      }
      setIsLoading(false)
    }
  }, [])

  // Kullanıcı bilgileri güncellendiğinde LocalStorage'a kaydet
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (user) {
        localStorage.setItem("user", JSON.stringify(user))
      } else {
        localStorage.removeItem("user")
      }
    }
  }, [user])

  const login = async (email: string, password: string): Promise<boolean> => {
    // Gerçek bir API'ye bağlanacak olsaydık burada fetch işlemi yapardık
    // Şimdilik basit bir simülasyon yapıyoruz

    // LocalStorage'dan kullanıcıları al
    const storedUsers = localStorage.getItem("users")
    const users = storedUsers ? JSON.parse(storedUsers) : []

    // Kullanıcıyı bul
    const foundUser = users.find((u: any) => u.email === email)

    if (foundUser && foundUser.password === password) {
      // Şifreyi kullanıcı nesnesinden çıkar
      const { password: _, ...userWithoutPassword } = foundUser
      setUser(userWithoutPassword)
      return true
    }

    return false
  }

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    // LocalStorage'dan kullanıcıları al
    const storedUsers = localStorage.getItem("users")
    const users = storedUsers ? JSON.parse(storedUsers) : []

    // E-posta adresi zaten kullanılıyor mu kontrol et
    if (users.some((u: any) => u.email === email)) {
      return false
    }

    // Yeni kullanıcı oluştur
    const newUser = {
      id: `user-${Date.now()}`,
      name,
      email,
      password,
    }

    // Kullanıcıyı kaydet
    localStorage.setItem("users", JSON.stringify([...users, newUser]))

    // Şifreyi kullanıcı nesnesinden çıkar
    const { password: _, ...userWithoutPassword } = newUser
    setUser(userWithoutPassword)

    return true
  }

  const logout = () => {
    setUser(null)
  }

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData }
      setUser(updatedUser)

      // LocalStorage'daki kullanıcılar listesini de güncelle
      if (typeof window !== "undefined") {
        const storedUsers = localStorage.getItem("users")
        if (storedUsers) {
          const users = JSON.parse(storedUsers)
          const updatedUsers = users.map((u: any) => {
            if (u.id === user.id) {
              return { ...u, ...userData }
            }
            return u
          })
          localStorage.setItem("users", JSON.stringify(updatedUsers))
        }
      }
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
