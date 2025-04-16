"use client";

import React, { useEffect, useState, useRef } from "react";
import { Progress } from "@/components/ui/progress";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";

const Loader: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const loaderRef = useRef<HTMLDivElement>(null);
  const hasLoadedRef = useRef(false);
  
  // Check if should skip loader from sessionStorage
  useEffect(() => {
    if (typeof window !== 'undefined' && window.sessionStorage?.getItem('app-loaded')) {
      setLoading(false);
    }
  }, []);
  
  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Run on mount
    checkMobile();
    window.addEventListener("resize", checkMobile, { passive: true });
    return () => window.removeEventListener("resize", checkMobile);
  }, []);
  
  // Loading animation
  useEffect(() => {
    // If already loaded from session storage, skip animation completely
    if (!loading) return;

    // If already shown once during development double-render, skip
    if (hasLoadedRef.current) {
      setLoading(false);
      return;
    }
    
    // Mark as loaded for any future re-renders
    hasLoadedRef.current = true;
    
    const updateProgress = () => {
      setProgress(prev => {
        if (prev >= 100) {
          setTimeout(() => {
            // Create exit animation
            if (loaderRef.current) {
              gsap.to(loaderRef.current, {
                opacity: 0,
                y: -20,
                duration: 0.5,
                onComplete: () => {
                  setLoading(false);
                  // Set flag in session storage when loader completes
                  if (typeof window !== 'undefined') {
                    window.sessionStorage?.setItem('app-loaded', 'true');
                  }
                }
              });
            } else {
              setLoading(false);
              // Set flag in session storage when loader completes
              if (typeof window !== 'undefined') {
                window.sessionStorage?.setItem('app-loaded', 'true');
              }
            }
          }, 500);
          return 100;
        }
        
        // Progressive loading speed - faster in middle, slower at ends
        const increment = prev < 30 ? 1 : prev > 80 ? 1 : 3;
        return Math.min(100, prev + increment);
      });
    };
    
    // Animate the loader entrance
    if (loaderRef.current) {
      gsap.fromTo(loaderRef.current, 
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5 }
      );
    }
    
    // Start progress updates
    const interval = setInterval(updateProgress, 50);
    
    return () => clearInterval(interval);
  }, [loading]);

  return (
    <>
      <AnimatePresence mode="wait">
        {loading ? (
          <div
            ref={loaderRef}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background min-h-screen"
          >
            <div className="flex flex-col items-center justify-center space-y-8 py-8 max-w-[90%] w-full">
              {/* Logo */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-2 text-4xl md:text-6xl font-bold"
              >
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-500 to-primary bg-[length:200%_auto] animate-gradient">
                  D'Prayogo
                </span>
              </motion.div>
              
              {/* Status text */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mt-2 mb-2 text-sm text-muted-foreground font-mono"
              >
                {progress === 100 ? "Ready!" : "Loading..."}
              </motion.div>
              
              {/* Progress bar */}
              <motion.div
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="w-full max-w-[20rem]"
              >
                <Progress 
                  value={progress} 
                  className="h-2"
                  style={{
                    boxShadow: progress > 95 ? "0 0 10px rgba(77, 156, 234, 0.3)" : "none",
                    transition: "box-shadow 0.3s ease"
                  }}
                />
                
                {/* Percentage */}
                <div className="text-xs text-muted-foreground font-mono text-right mt-1">
                  {progress.toFixed(0)}%
                </div>
              </motion.div>
            </div>
            
            {/* Simple decorative elements - visible on all devices */}
            <div className="absolute bottom-10 left-10 w-16 h-16 border border-primary/20 rounded-md rotate-45 opacity-30 z-0"></div>
            <div className="absolute top-20 right-[10%] w-12 h-12 border border-primary/20 rounded-full -rotate-12 opacity-20 z-0"></div>
          </div>
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Loader;
