"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Mail, Github, Linkedin, Twitter } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const Contact: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);
  const linesRef = useRef<HTMLDivElement>(null);
  const circuitRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [prevMobile, setPrevMobile] = useState<boolean | null>(null);
  const [contentVisible, setContentVisible] = useState(false);
  const [layoutChanged, setLayoutChanged] = useState(false);
  
  // Check for mobile device
  useEffect(() => {
    const checkMobile = () => {
      const wasMobile = isMobile;
      const mobile = window.innerWidth < 768;
      
      // Detect layout changes
      if (wasMobile !== mobile && prevMobile !== null) {
        setLayoutChanged(true);
      }
      
      setPrevMobile(mobile);
      setIsMobile(mobile);
    };
    
    checkMobile();
    window.addEventListener("resize", checkMobile, { passive: true });
    
    return () => window.removeEventListener("resize", checkMobile);
  }, [isMobile, prevMobile]);
  
  // Handle layout changes
  useEffect(() => {
    if (layoutChanged && contentVisible) {
      // Ensure terminal is visible after layout change
      if (terminalRef.current) {
        gsap.set(terminalRef.current, { opacity: 1, y: 0 });
        
        // Also ensure terminal lines are visible
        if (linesRef.current) {
          const lines = linesRef.current.querySelectorAll(".terminal-line");
          gsap.set(lines, { width: "100%", opacity: 1 });
        }
      }
      
      // Ensure circuit board elements remain visible
      if (circuitRef.current) {
        const circuitLines = circuitRef.current.querySelectorAll(".circuit-line");
        const dots = circuitRef.current.querySelectorAll(".connection-dot");
        
        gsap.set(circuitLines, { 
          opacity: (index) => index % 2 === 0 ? 0.5 : 0.4,
          strokeDashoffset: 0 
        });
        
        gsap.set(dots, { 
          opacity: 0.4,
          scale: 1
        });
      }
      
      setLayoutChanged(false);
    }
  }, [layoutChanged, contentVisible]);
  
  useEffect(() => {
    // Wait for a short timeout to ensure DOM is fully rendered
    const timer = setTimeout(() => {
      if (sectionRef.current && terminalRef.current && linesRef.current && circuitRef.current) {
        const ctx = gsap.context(() => {
          // Animate the circuit board elements first
          // Circuit board fade in
          gsap.fromTo(
            ".circuit-line, .connection-dot",
            { opacity: 0 },
            { 
              opacity: (index) => index % 2 === 0 ? 0.5 : 0.4, 
              duration: 1.5,
              stagger: 0.05,
              scrollTrigger: {
                trigger: sectionRef.current,
                start: "top bottom",
                end: "top center",
                scrub: 0.5,
                once: false
              }
            }
          );
          
          // Create circuit board line animations
          const circuitLines = document.querySelectorAll(".circuit-line");
          circuitLines.forEach((line, index) => {
            gsap.fromTo(
              line,
              { 
                strokeDashoffset: 1000, 
                opacity: 0.2
              },
              { 
                strokeDashoffset: 0,
                opacity: 0.5,
                duration: 2,
                delay: index * 0.2,
                ease: "power2.out",
                scrollTrigger: {
                  trigger: sectionRef.current,
                  start: "top 70%",
                  once: true
                }
              }
            );
          });
          
          // Pulse effect for the connection dots with varying intensities
          const dots = document.querySelectorAll(".connection-dot");
          dots.forEach((dot, index) => {
            const randomDuration = 0.8 + Math.random() * 1.2; // Random duration between 0.8 and 2
            gsap.fromTo(
              dot,
              { scale: 0.8, opacity: 0.3 },
              { 
                scale: 1.3, 
                opacity: 0.7,
                duration: randomDuration,
                repeat: -1,
                yoyo: true,
                delay: index * 0.1,
                ease: "sine.inOut"
              }
            );
          });
          
          // Animate the terminal window
          gsap.fromTo(
            terminalRef.current,
            { y: 50, opacity: 0 },
            { 
              y: 0, 
              opacity: 1, 
              duration: 0.8, 
              scrollTrigger: {
                trigger: sectionRef.current,
                start: "top 70%",
                once: true
              },
              onComplete: () => {
                setContentVisible(true); // Mark content as visible after animation
              }
            }
          );
          
          // Animate the terminal text lines sequentially - fix TypeScript null check
          if (linesRef.current) {
            const lines = linesRef.current.querySelectorAll(".terminal-line");
            lines.forEach((line, index) => {
              gsap.fromTo(
                line,
                { width: 0, opacity: 0 },
                { 
                  width: "100%", 
                  opacity: 1, 
                  duration: 0.5,
                  delay: 1 + (index * 0.3),
                  ease: "steps(30)",
                  scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 70%",
                    once: true
                  }
                }
              );
            });
          }
        });
        
        return () => ctx.revert();
      }
    }, 100); // Short delay to ensure DOM is ready
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      id="contact"
      ref={sectionRef}
      className="h-screen flex flex-col relative px-6 py-24 overflow-hidden"
    >
      {/* Ensure terminal and circuit board stay visible on viewport changes */}
      <style jsx global>{`
        @media (min-width: 100px) {
          .contact-terminal {
            opacity: 1 !important;
            transform: translateY(0) !important;
            transition: box-shadow 0.3s ease !important;
          }
          
          .terminal-line {
            width: 100% !important;
            opacity: 1 !important;
          }
          
          .circuit-line {
            opacity: 0.5 !important;
            stroke-dashoffset: 0 !important;
          }
          
          .connection-dot {
            opacity: 0.4 !important;
          }
        }
      `}</style>
      
      {/* Circuit board background */}
      <div ref={circuitRef} className="absolute inset-0 z-0 pointer-events-none circuit-board">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <g stroke="currentColor" strokeWidth="0.8" strokeOpacity="0.3">
            {/* Horizontal lines */}
            <line x1="0" y1="20%" x2="100%" y2="20%" className="circuit-line" strokeDasharray="5,10" />
            <line x1="0" y1="40%" x2="100%" y2="40%" className="circuit-line" strokeDasharray="5,15" />
            <line x1="0" y1="60%" x2="100%" y2="60%" className="circuit-line" strokeDasharray="5,5" />
            <line x1="0" y1="80%" x2="100%" y2="80%" className="circuit-line" strokeDasharray="10,10" />
            
            {/* Vertical lines */}
            <line x1="25%" y1="0" x2="25%" y2="100%" className="circuit-line" strokeDasharray="8,12" />
            <line x1="50%" y1="0" x2="50%" y2="100%" className="circuit-line" strokeDasharray="12,8" />
            <line x1="75%" y1="0" x2="75%" y2="100%" className="circuit-line" strokeDasharray="6,6" />
            
            {/* Additional diagonal lines for more visual interest */}
            <line x1="0" y1="0" x2="30%" y2="30%" className="circuit-line" strokeDasharray="3,15" />
            <line x1="70%" y1="70%" x2="100%" y2="100%" className="circuit-line" strokeDasharray="4,10" />
            <line x1="100%" y1="0" x2="70%" y2="30%" className="circuit-line" strokeDasharray="5,8" />
            <line x1="30%" y1="70%" x2="0" y2="100%" className="circuit-line" strokeDasharray="6,6" />
            
            {/* Connection dots */}
            <circle cx="25%" cy="20%" r="4" fill="currentColor" className="connection-dot" fillOpacity="0.4" />
            <circle cx="50%" cy="40%" r="4" fill="currentColor" className="connection-dot" fillOpacity="0.4" />
            <circle cx="75%" cy="60%" r="4" fill="currentColor" className="connection-dot" fillOpacity="0.4" />
            <circle cx="50%" cy="80%" r="4" fill="currentColor" className="connection-dot" fillOpacity="0.4" />
            <circle cx="30%" cy="30%" r="3" fill="currentColor" className="connection-dot" fillOpacity="0.4" />
            <circle cx="70%" cy="70%" r="3" fill="currentColor" className="connection-dot" fillOpacity="0.4" />
            <circle cx="70%" cy="30%" r="3" fill="currentColor" className="connection-dot" fillOpacity="0.4" />
            <circle cx="30%" cy="70%" r="3" fill="currentColor" className="connection-dot" fillOpacity="0.4" />
          </g>
        </svg>
      </div>
      
      <div className="container mx-auto flex flex-col items-center justify-center h-full z-10">
        <motion.h2 
          className="mb-8 text-center font-mono text-3xl font-bold uppercase tracking-widest text-primary md:mb-10"
          initial={{ y: -20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          // Contact_
        </motion.h2>
        
        {/* Terminal window - initially hidden but ensured visible on viewport changes */}
        <div 
          ref={terminalRef}
          className="contact-terminal w-full max-w-xl bg-secondary/30 backdrop-blur-sm rounded-lg border border-border overflow-hidden mb-12 opacity-0"
        >
          <div className="h-8 bg-secondary/50 border-b border-border flex items-center px-4">
            <div className="w-3 h-3 rounded-full bg-destructive/60 mr-2"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500/60 mr-2"></div>
            <div className="w-3 h-3 rounded-full bg-green-500/60 mr-auto"></div>
            <div className="text-xs font-mono text-muted-foreground">contact.sh</div>
          </div>
          
          <div ref={linesRef} className="p-4 md:p-5 font-mono text-xs sm:text-sm">
            <div className="terminal-line text-primary whitespace-normal sm:whitespace-nowrap overflow-hidden w-0">
              $ echo "Looking to collaborate or have questions?"
            </div>
            <div className="terminal-line text-muted-foreground whitespace-normal sm:whitespace-nowrap overflow-hidden mt-1 w-0">
              Looking to collaborate or have questions?
            </div>
            <div className="terminal-line text-primary whitespace-normal sm:whitespace-nowrap overflow-hidden mt-2 sm:mt-3 w-0">
              $ echo "My inbox is always open. Feel free to reach out!"
            </div>
            <div className="terminal-line text-muted-foreground whitespace-normal sm:whitespace-nowrap overflow-hidden mt-1 w-0">
              My inbox is always open. Feel free to reach out!
            </div>
            <div className="terminal-line text-primary whitespace-normal sm:whitespace-nowrap overflow-hidden mt-2 sm:mt-3 w-0">
              $ ./connect --with dprayogo
            </div>
            <div className="terminal-line text-green-400 whitespace-normal sm:whitespace-nowrap overflow-hidden mt-1 w-0">
              Connection initialized... Ready to connect!
            </div>
          </div>
        </div>
        
        <motion.div 
          className="flex flex-col sm:flex-row flex-wrap justify-center items-center gap-3 sm:gap-4 w-full"
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <Button asChild size="lg" className="w-full sm:w-auto sm:min-w-44">
            <a href="mailto:dimasbagusprayogo17@gmail.com">
              <Mail className="mr-2 h-4 sm:h-5 w-4 sm:w-5" />
              Send Email
            </a>
          </Button>
          
          <Button asChild size="lg" variant="outline" className="w-full sm:w-auto sm:min-w-44">
            <a href="https://github.com/SFINXVC" target="_blank" rel="noopener noreferrer">
              <Github className="mr-2 h-4 sm:h-5 w-4 sm:w-5" />
              GitHub
            </a>
          </Button>
          
          <Button asChild size="lg" variant="outline" className="w-full sm:w-auto sm:min-w-44">
            <a href="#" target="_blank" rel="noopener noreferrer">
              <Linkedin className="mr-2 h-4 sm:h-5 w-4 sm:w-5" />
              LinkedIn
            </a>
          </Button>
          
          <Button asChild size="lg" variant="outline" className="w-full sm:w-auto sm:min-w-44">
            <a href="#" target="_blank" rel="noopener noreferrer">
              <Twitter className="mr-2 h-4 sm:h-5 w-4 sm:w-5" />
              Twitter
            </a>
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default Contact; 