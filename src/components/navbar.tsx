"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/projects", label: "Projects" },
  { href: "/contact", label: "Contact" },
];

const Navbar: React.FC = () => {
  const pathname = usePathname();
  const [time, setTime] = useState<string>("");
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Handle scroll events
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Set navbar visible if scrolling up and hidden if scrolling down
      // Also keep it visible at the top of the page
      if (currentScrollY <= 10) {
        setIsVisible(true);
      } else if (currentScrollY < lastScrollY) {
        setIsVisible(true); // Scrolling up
      } else {
        setIsVisible(false); // Scrolling down
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      // Set timezone to WIB (Asia/Jakarta)
      const options: Intl.DateTimeFormatOptions = {
        timeZone: "Asia/Jakarta",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false, // Use 24-hour format
      };
      const formatter = new Intl.DateTimeFormat("en-US", options);
      const formattedTime = formatter.format(now);
      setTime(formattedTime);
    };

    updateClock(); // Initial call
    const intervalId = setInterval(updateClock, 1000); // Update every second

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.nav
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-6 sm:px-10 md:px-16 py-4 bg-background/30 backdrop-blur-md"
        >
          <div className="text-2xl font-bold">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-500 to-primary bg-[length:200%_auto] animate-gradient">
              D'Prayogo
            </span>
          </div>
          <div className="text-sm text-muted-foreground font-mono">
            LOCAL TIME | {time} WIB
          </div>
        </motion.nav>
      )}
    </AnimatePresence>
  );
};

export default Navbar;
