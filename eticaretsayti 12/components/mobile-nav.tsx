"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, Home, Heart, ShoppingBag, ShoppingCart } from "lucide-react"

export default function MobileNav() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  const routes = [
    {
      href: "/",
      label: "Ana Səhifə",
      icon: <Home className="h-5 w-5 mr-2" />,
    },
    {
      href: "/favorites",
      label: "Sevimlilər",
      icon: <Heart className="h-5 w-5 mr-2" />,
    },
    {
      href: "/orders",
      label: "Sifarişlərim",
      icon: <ShoppingBag className="h-5 w-5 mr-2" />,
    },
    {
      href: "/cart",
      label: "Səbətim",
      icon: <ShoppingCart className="h-5 w-5 mr-2" />,
    },
  ]

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Menyu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] sm:w-[400px]">
        <nav className="flex flex-col gap-4 mt-8">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              onClick={() => setOpen(false)}
              className={`flex items-center px-2 py-3 text-lg font-medium rounded-md hover:bg-accent ${
                pathname === route.href ? "bg-accent" : ""
              }`}
            >
              {route.icon}
              {route.label}
            </Link>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  )
}
