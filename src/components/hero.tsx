"use client";

import React, { useEffect, useRef, useState, forwardRef } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { GithubIcon, ExternalLink, Terminal } from "lucide-react";
import gsap from "gsap";
import { TextPlugin } from "gsap/TextPlugin";

gsap.registerPlugin(TextPlugin);

const Hero = forwardRef<HTMLElement>((props, ref) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const auroraRef = useRef<HTMLDivElement>(null);
  const codeBlockRef = useRef<HTMLDivElement>(null);
  const techCardsRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isLowEndDevice, setIsLowEndDevice] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [layoutChanged, setLayoutChanged] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => {
      const wasMobile = isMobile;
      const mobile = window.innerWidth < 768;
      
      setIsMobile(mobile);
      
      if (wasMobile !== mobile) {
        setLayoutChanged(true);
      }
      
      if (mobile) {
        const isLowPerformance = 
          /Android/.test(navigator.userAgent) && 
          (/Chrome\/[0-6]/.test(navigator.userAgent) || 
          /Version\/[0-9]/.test(navigator.userAgent));
          
        setIsLowEndDevice(isLowPerformance);
      }
    };
    
    checkMobile();
    window.addEventListener("resize", checkMobile, { passive: true });
    
    return () => window.removeEventListener("resize", checkMobile);
  }, [isMobile]);
  
  useEffect(() => {
    if (isLoaded && canvasRef.current && !isMobile) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      const resizeCanvas = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      };
      
      resizeCanvas();
      window.addEventListener('resize', resizeCanvas);
      
      const particleCount = 50;
      const connectionDistance = 100;
      const particles: {x: number; y: number; vx: number; vy: number; size: number}[] = [];
      
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          size: Math.random() * 2 + 1
        });
      }
      
      const animate = () => {
        if (!ctx) return;
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];
          
          p.x += p.vx;
          p.y += p.vy;
          
          if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
          if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
          
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(77, 156, 234, 0.3)';
          ctx.fill();
          
          for (let j = i + 1; j < particles.length; j++) {
            const p2 = particles[j];
            const dx = p.x - p2.x;
            const dy = p.y - p2.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < connectionDistance) {
              ctx.beginPath();
              ctx.moveTo(p.x, p.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.strokeStyle = `rgba(77, 156, 234, ${0.2 * (1 - distance / connectionDistance)})`;
              ctx.lineWidth = 0.5;
              ctx.stroke();
            }
          }
        }
        
        animationId = requestAnimationFrame(animate);
      };
      
      let animationId = requestAnimationFrame(animate);
      
      return () => {
        window.removeEventListener('resize', resizeCanvas);
        cancelAnimationFrame(animationId);
      };
    }
  }, [isLoaded, isMobile]);
  
  useEffect(() => {
    if (auroraRef.current) {
      const aurora = auroraRef.current;
      
      if (isMobile && isLowEndDevice) {
        gsap.set(aurora, {
          backgroundPosition: '50% 50%',
          opacity: 0.5
        });
        return;
      }
      
      const animateAurora = () => {
        const duration = isMobile ? 30 : 15;
        
        gsap.fromTo(
          aurora,
          {
            backgroundPosition: '0% 0%',
          },
          {
            backgroundPosition: '100% 100%',
            duration: duration,
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true,
          }
        );
      };
      
      animateAurora();
    }
  }, [isLoaded, isMobile, isLowEndDevice]);
  
  useEffect(() => {
    if (containerRef.current && textRef.current && gridRef.current) {
      setIsLoaded(true);
      
      const ctx = gsap.context(() => {
        const gridLines = document.querySelectorAll(".grid-line");
        
        if (isMobile && isLowEndDevice) {
          gsap.set(gridLines, { opacity: 0.1 });
        } else {
          gsap.fromTo(
            ".grid-line", 
            { opacity: 0, y: isMobile ? 0 : 20 },
            { 
              opacity: isMobile ? 0.1 : 0.3, 
              y: 0, 
              duration: isMobile ? 0.5 : 1.5, 
              stagger: isMobile ? 0.05 : 0.05,
              ease: "power3.out"
            }
          );
        }
        
        if (!isMobile) {
          gsap.fromTo(
            textRef.current,
            { textShadow: "0 0 0 rgba(255, 255, 255, 0)" },
            { 
              textShadow: "0 0 10px rgba(77, 156, 234, 0.3)", 
              duration: 2,
              repeat: -1,
              yoyo: true,
              ease: "sine.inOut"
            }
          );
        }
        
        if (!isMobile) {
          const typewriter = document.querySelector(".typewriter");
          if (typewriter) {
            const text = "Hello World, I am";
            gsap.to(typewriter, {
              duration: 2,
              text: {
                value: text,
                delimiter: "",
              },
              ease: "none",
              delay: 0.5
            });
          }
        }
        
        const codeBlocks = document.querySelectorAll(".code-block");
        if (codeBlocks.length > 0) {
          if (isMobile) {
            gsap.set(codeBlocks, { display: "none" });
          } else {
            gsap.set(codeBlocks, { display: "block" });
            codeBlocks.forEach((block, i) => {
              gsap.fromTo(
                block,
                { y: 20, opacity: 0 },
                {
                  y: 0,
                  opacity: 0.7,
                  duration: 0.8,
                  delay: 0.5 + (i * 0.2),
                  ease: "power2.out"
                }
              );
            });
          }
        }
      });
      
      if (layoutChanged) {
        setLayoutChanged(false);
        
        if (!isMobile && codeBlockRef.current) {
          gsap.set(codeBlockRef.current, { display: "block", opacity: 0 });
          gsap.to(codeBlockRef.current, { opacity: 1, duration: 0.5 });
          
          const codeBlocks = document.querySelectorAll(".code-block");
          codeBlocks.forEach((block) => {
            gsap.fromTo(
              block,
              { y: 20, opacity: 0 },
              { y: 0, opacity: 0.7, duration: 0.8, ease: "power2.out" }
            );
          });
        }
      }
      
      return () => ctx.revert();
    }
  }, [isMobile, isLowEndDevice, layoutChanged]);

  useEffect(() => {
    if (techCardsRef.current) {
      const techIcons = techCardsRef.current.querySelectorAll(".tech-icon");
      
      gsap.set(techIcons, { clearProps: "all" });
      
      if (isMobile && isLowEndDevice) {
        gsap.to(techIcons, {
          opacity: 1,
          scale: 1,
          duration: 0.5,
          stagger: 0.05,
          ease: "power1.out"
        });
      } else {
        techIcons.forEach((icon, i) => {
          gsap.fromTo(
            icon,
            { 
              scale: isMobile ? 0.9 : 0.8, 
              opacity: 0.5 
            },
            {
              scale: 1,
              opacity: 1,
              duration: isMobile ? 0.3 : 0.5,
              delay: isMobile ? 0.1 + (i * 0.05) : 0.2 + (i * 0.1),
              ease: isMobile ? "power1.out" : "back.out(1.7)"
            }
          );
          
          if (!isMobile) {
            gsap.to(icon, {
              y: `${(Math.random() - 0.5) * 8}px`,
              x: `${(Math.random() - 0.5) * 8}px`,
              rotation: `${(Math.random() - 0.5) * 6}deg`,
              duration: 2 + Math.random() * 2,
              repeat: -1,
              yoyo: true,
              ease: "sine.inOut",
              delay: Math.random()
            });
          }
        });
      }
    }
  }, [isMobile, isLowEndDevice, layoutChanged, isLoaded]);

  return (
    <motion.section
      id="hero"
      ref={ref}
      className="min-h-screen h-screen flex items-center justify-center relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: isMobile ? 0.4 : 0.8 }}
      style={{ 
        contain: isMobile ? 'content' : 'none',
        willChange: 'transform'
      }}
    >
      <div 
        ref={auroraRef}
        className="absolute inset-0 z-0 pointer-events-none overflow-hidden" 
        style={{ 
          willChange: 'background-position',
          contain: 'paint'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/15 via-transparent to-purple-500/15 opacity-40"></div>
        
        {isMobile && isLowEndDevice ? (
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-indigo-500/10 opacity-40"></div>
        ) : (
          <>
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/15 via-transparent to-indigo-500/15 opacity-60 blur-3xl"></div>
            <div className="absolute -inset-[50%] bg-[conic-gradient(from_180deg_at_50%_70%,_var(--tw-gradient-stops))] from-blue-500/20 via-primary/15 to-purple-500/20 opacity-40 blur-3xl animate-aurora"></div>
          </>
        )}
        
        {isMobile ? (
          isLowEndDevice ? null : (
            <div className="absolute top-1/4 left-1/4 w-32 h-32 rounded-full bg-blue-500/10 blur-3xl animate-float-slow"></div>
          )
        ) : (
          <>
            <div className="absolute top-1/4 left-1/4 w-32 h-32 rounded-full bg-blue-500/10 blur-3xl animate-float-slow"></div>
            <div className="absolute bottom-1/3 right-1/4 w-40 h-40 rounded-full bg-indigo-500/10 blur-3xl animate-float-medium"></div>
            <div className="absolute top-1/2 right-1/3 w-28 h-28 rounded-full bg-primary/10 blur-3xl animate-float-fast"></div>
          </>
        )}
        
        {!isLowEndDevice && (
          <div className={`absolute inset-0 bg-[linear-gradient(to_right,transparent,rgba(77,156,234,${isMobile ? '0.02' : '0.05'}),transparent)] animate-shimmer`}></div>
        )}
      </div>

      {!isMobile && (
        <canvas 
          ref={canvasRef} 
          className="absolute inset-0 w-full h-full z-0"
        />
      )}
      
      <div 
        ref={gridRef}
        className="absolute inset-0 grid grid-cols-6 md:grid-cols-12 grid-rows-6 md:grid-rows-12 opacity-10 pointer-events-none z-0"
        style={{ contain: 'paint' }}
      >
        {Array.from({ length: isMobile ? (isLowEndDevice ? 3 : 6) : 12 }).map((_, colIndex) => (
          <div key={`col-${colIndex}`} className="grid-line col-span-1 border-r border-primary/20 h-full"></div>
        ))}
        {Array.from({ length: isMobile ? (isLowEndDevice ? 3 : 6) : 12 }).map((_, rowIndex) => (
          <div key={`row-${rowIndex}`} className="grid-line row-span-1 border-b border-primary/20 w-full"></div>
        ))}
      </div>
      
      <div className="container mx-auto px-5 sm:px-8 md:px-10 lg:px-12 z-10 flex flex-col md:flex-row items-center justify-between">
        <div ref={containerRef} className="w-full md:w-3/5 text-center md:text-left mb-12 md:mb-0 mt-16 md:mt-0 py-4">
          <motion.p
            initial={{ y: isMobile ? 10 : 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: isMobile ? 0.3 : 0.5 }}
            className={`text-lg text-muted-foreground mb-3 font-mono ${!isMobile ? 'typewriter' : ''}`}
          >
            {isMobile ? "Hello World, I am" : ""}
          </motion.p>
        
          <motion.h1
            ref={textRef}
            initial={{ y: isMobile ? 10 : 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: isMobile ? 0.3 : 0.5, delay: isMobile ? 0.1 : 0.2 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4"
            style={{ willChange: 'transform, opacity' }}
          >
            <span className={`text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-500 to-primary bg-[length:200%_auto] animate-gradient`}>
              Dimas Bagus Prayogo
            </span>
          </motion.h1>
        
          <motion.h2
            initial={{ y: isMobile ? 10 : 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: isMobile ? 0.3 : 0.5, delay: isMobile ? 0.2 : 0.4 }}
            className="text-xl sm:text-2xl md:text-3xl text-foreground mb-5 md:mb-6"
            style={{ willChange: 'transform, opacity' }}
          >
            Fullstack Developer
          </motion.h2>
        
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: isMobile ? 0 : 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="text-muted-foreground max-w-lg mb-8 text-base leading-relaxed hidden md:block"
          >
            Crafting responsive, user-friendly web applications using modern technologies.
            Passionate about clean code and innovative solutions.
          </motion.p>
          
          <motion.div 
            ref={techCardsRef}
            className="flex flex-wrap gap-2.5 md:gap-3.5 mb-8 md:mb-10 justify-center md:justify-start"
          >
            {["TypeScript", "React", "Next.js", "Node.js", "Tailwind"].map((tech, i) => (
              <div 
                key={tech} 
                className="tech-icon p-2 md:p-2.5 bg-secondary/30 backdrop-blur-sm rounded-lg border border-border/30"
                style={{ 
                  opacity: 1,
                  visibility: "visible" 
                }}
              >
                <span className="text-xs md:text-sm font-medium">{tech}</span>
              </div>
            ))}
          </motion.div>
          
          <motion.div 
            initial={{ y: isMobile ? 10 : 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: isMobile ? 0.3 : 0.5, delay: isMobile ? 0.4 : 0.7 }}
            className="flex gap-3.5 md:gap-5 flex-wrap justify-center md:justify-start"
            style={{ willChange: 'transform, opacity' }}
          >
            <Button asChild size={isMobile ? "default" : "lg"} className="px-5 py-2.5">
              <Link
                href="https://github.com/SFINXVC"
                target="_blank"
                rel="noopener noreferrer"
              >
                <GithubIcon className="mr-2.5 h-4 w-4 md:h-5 md:w-5" />
                GitHub
              </Link>
            </Button>
            
            <Button variant="outline" size={isMobile ? "default" : "lg"} asChild className="px-5 py-2.5">
              <Link href="#contact">
                <ExternalLink className="mr-2.5 h-4 w-4 md:h-5 md:w-5" />
                Contact Me
              </Link>
            </Button>
          </motion.div>
        </div>
        
        <div 
          ref={codeBlockRef}
          className={`w-full md:w-2/5 relative md:flex items-center justify-end pl-0 md:pl-4 lg:pl-6 ${isMobile ? 'hidden' : 'block'}`}
        >
          <div className="absolute top-0 left-0 w-full h-full z-0">
            <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-10 h-10 rounded-full bg-primary/10 blur-xl"></div>
            <div className="absolute right-10 top-10 w-20 h-20 rounded-full bg-blue-500/10 blur-xl"></div>
          </div>
          
          <div className="space-y-5 w-full backdrop-blur-sm relative z-10 p-2">
            <div className="code-block bg-secondary/20 border border-border rounded-md p-5 text-sm font-mono relative">
              <div className="flex items-center gap-2.5 text-muted-foreground">
                <Terminal className="h-4 w-4 text-primary" />
                <span className="text-xs">dprayogo.dev</span>
              </div>
              <div className="mt-4 text-muted-foreground">
                <div><span className="text-blue-400">#include</span> <span className="text-yellow-300">&lt;windows.h&gt;</span></div>
                <div><span className="text-blue-400">#include</span> <span className="text-yellow-300">&lt;developer.h&gt;</span></div>
                <div className="mt-1.5"><span className="text-green-400">HANDLE</span> <span className="text-purple-400">InitDeveloper</span>(<span className="text-green-400">LPCTSTR</span> name) &#123;</div>
                <div>&nbsp;&nbsp;<span className="text-blue-400">SECURITY_ATTRIBUTES</span> sa;</div>
                <div>&nbsp;&nbsp;sa.<span className="text-green-400">bInheritHandle</span> = <span className="text-yellow-300">TRUE</span>;</div>
                <div>&nbsp;&nbsp;sa.<span className="text-green-400">lpSecurityDescriptor</span> = <span className="text-yellow-300">NULL</span>;</div>
                <div className="mt-1.5">&nbsp;&nbsp;<span className="text-green-400">return</span> <span className="text-purple-400">CreateDeveloper</span>(</div>
                <div>&nbsp;&nbsp;&nbsp;&nbsp;name,</div>
                <div>&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-purple-400">SKILLS_FULLSTACK</span> | <span className="text-purple-400">SKILLS_FRONTEND</span> | <span className="text-purple-400">SKILLS_BACKEND</span>,</div>
                <div>&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-purple-400">0xDEADBEEF</span>, <span className="text-yellow-300">&amp;sa</span></div>
                <div>&nbsp;&nbsp;);</div>
                <div>&#125;</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute bottom-6 md:bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce z-20">
        <div className="flex flex-col items-center">
          <div className="text-muted-foreground text-xs md:text-sm font-mono mb-2">Scroll Down</div>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="md:w-6 md:h-6">
            <path d="M12 4V20M12 20L6 14M12 20L18 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-b from-transparent to-background z-10 pointer-events-none"></div>
      
      <style jsx global>{`
        @keyframes aurora {
          0% { transform: rotate(0deg) scale(1.2); }
          33% { transform: rotate(120deg) scale(1.4); }
          66% { transform: rotate(240deg) scale(1.6); }
          100% { transform: rotate(360deg) scale(1.2); }
        }
        
        @keyframes float-slow {
          0% { transform: translate(0, 0); }
          50% { transform: translate(-20px, 20px); }
          100% { transform: translate(0, 0); }
        }
        
        @keyframes float-medium {
          0% { transform: translate(0, 0); }
          50% { transform: translate(25px, -15px); }
          100% { transform: translate(0, 0); }
        }
        
        @keyframes float-fast {
          0% { transform: translate(0, 0); }
          50% { transform: translate(-15px, -25px); }
          100% { transform: translate(0, 0); }
        }
        
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        .animate-aurora {
          animation: aurora ${isMobile ? '40s' : '25s'} linear infinite;
        }
        
        .animate-float-slow {
          animation: float-slow ${isMobile ? '35s' : '20s'} ease-in-out infinite;
        }
        
        .animate-float-medium {
          animation: float-medium ${isMobile ? '30s' : '15s'} ease-in-out infinite;
        }
        
        .animate-float-fast {
          animation: float-fast ${isMobile ? '25s' : '12s'} ease-in-out infinite;
        }
        
        .animate-shimmer {
          animation: shimmer ${isMobile ? '15s' : '8s'} linear infinite;
        }
        
        .animate-gradient {
          ${isMobile ? `
          background-size: 200% auto;
          animation: gradient 8s linear infinite;
          ` : `
          background-size: 200% auto;
          animation: gradient 4s linear infinite;
          `}
        }
        
        @keyframes gradient {
          0% { background-position: 0% center; }
          100% { background-position: 200% center; }
        }
        
        @media (max-width: 767px) {
          .animate-bounce {
            animation-duration: 2s;
          }
          
          .animate-pulse {
            animation-duration: 2s;
          }
        }
        
        @media (min-width: 768px) {
          .code-block {
            transition: opacity 0.3s ease;
          }
          
          .tech-icon {
            transition: opacity 0.3s ease, transform 0.3s ease, visibility 0s;
            opacity: 1 !important;
            visibility: visible !important;
          }
        }
        
        @media (max-width: 767px) {
          .tech-icon {
            transition: opacity 0.3s ease, transform 0.3s ease, visibility 0s;
            opacity: 1 !important;
            visibility: visible !important;
          }
          
          .animate-bounce {
            animation-duration: 2s;
          }
          
          .animate-pulse {
            animation-duration: 2s;
          }
        }
      `}</style>
    </motion.section>
  );
});

Hero.displayName = "Hero";

export default Hero; 