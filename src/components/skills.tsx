"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TextPlugin } from "gsap/TextPlugin";

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, TextPlugin);

// Tech stack data with descriptions
const techStack = [
  {
    id: "typescript",
    name: "TypeScript",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg",
    color: "#3178C6",
    purpose: "I use TypeScript for type-safe code that scales. It helps me catch errors during development and provides better tooling and documentation."
  },
  {
    id: "javascript",
    name: "JavaScript",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg",
    color: "#F7DF1E",
    purpose: "As the foundation of web development, I use JavaScript for creating interactive elements and handling client-side logic in my applications."
  },
  {
    id: "nextjs",
    name: "Next.js",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg",
    color: "#ffffff",
    purpose: "Next.js is my go-to React framework for building performant websites with server-side rendering, static generation, and API routes."
  },
  {
    id: "php",
    name: "PHP",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg",
    color: "#777BB4",
    purpose: "I use PHP for server-side scripting and developing dynamic web applications with a focus on rapid development and flexibility."
  },
  {
    id: "laravel",
    name: "Laravel",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/laravel/laravel-original.svg",
    color: "#FF2D20",
    purpose: "Laravel is my preferred PHP framework for elegant web applications with expressive syntax, robust features, and a rich ecosystem."
  },
  {
    id: "golang",
    name: "Golang",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/go/go-original.svg",
    color: "#00ADD8",
    purpose: "I leverage Golang for building efficient, concurrent applications and microservices with its simplicity and performance benefits."
  },
  {
    id: "rust",
    name: "Rust",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/rust/rust-original.svg",
    color: "#DEA584",
    purpose: "I use Rust for performance-critical components and systems programming, leveraging its memory safety without garbage collection."
  },
  {
    id: "postgresql",
    name: "PostgreSQL",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg",
    color: "#336791",
    purpose: "PostgreSQL is my preferred relational database for complex applications requiring advanced data integrity and SQL features."
  },
  {
    id: "mysql",
    name: "MySQL",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg",
    color: "#4479A1",
    purpose: "I use MySQL for relational database needs in applications where a proven, widely-supported database system is required."
  },
  {
    id: "mongodb",
    name: "MongoDB",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg",
    color: "#47A248",
    purpose: "For flexible schema design and document-oriented storage, I rely on MongoDB especially for applications with rapidly evolving data structures."
  },
  {
    id: "cmake",
    name: "CMake",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cmake/cmake-original.svg",
    color: "#064F8C",
    purpose: "I use CMake as a cross-platform build system generator to configure, build, and test C/C++ projects with a single set of build scripts."
  },
  {
    id: "c",
    name: "C",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/c/c-original.svg",
    color: "#A8B9CC",
    purpose: "I work with C for low-level programming, embedded systems, and applications where maximum control over hardware is necessary."
  },
  {
    id: "cplusplus",
    name: "C++",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg",
    color: "#00599C",
    purpose: "C++ enables me to build high-performance applications and games while utilizing object-oriented programming principles."
  }
];

// Terminal command snippets for each tech - ensuring they start with a safe character
const terminalCommands = {
  typescript: `$ tsc --init
> Created tsconfig.json

$ npm start
> TypeScript compiler v4.9.5
> Server running at http://localhost:3000`,

  javascript: `$ node -v
> v18.16.0

$ npm run build
> webpack 5.83.1
> Build completed in 2.4s`,

  nextjs: `$ npx create-next-app@latest
> Success! Created project

$ next dev
> ready - started server on 0.0.0.0:3000
> app-dir enabled`,

  php: `$ php -v
> PHP 8.2.7 (cli)

$ composer create-project
> Installing dependencies
> Application ready!`,

  laravel: `$ composer create-project laravel/laravel example-app
> Application ready!

$ php artisan serve
> Starting Laravel development server: http://127.0.0.1:8000`,

  golang: `$ go version
> go version go1.20.4 linux/amd64

$ go run main.go
> Starting server at :8080
> Connected to database`,

  rust: `$ cargo new rust_project
> Created binary package

$ cargo run
> Compiling rust_project v0.1.0
> Finished in 0.82s`,

  postgresql: `$ psql -U postgres
> psql (15.3)

postgres=# SELECT version();
> PostgreSQL 15.3 on x86_64-pc-linux-gnu`,

  mysql: `$ mysql -u root -p
> mysql Ver 8.0.33

mysql> SHOW DATABASES;
> 4 rows in set (0.00 sec)`,

  mongodb: `$ mongosh
> Current Mongosh: v1.10.1
> Connecting to: mongodb://127.0.0.1:27017

Atlas atlas-a1b2c3-shard-0 [primary]> db.version()
> 6.0.6`,

  cmake: `$ cmake --version
> cmake version 3.26.4

$ cmake -B build -S .
> -- The C compiler identification is GNU 13.1.0
> -- Configuring done
> -- Generating done`,

  c: `$ gcc -Wall main.c -o program
> Compilation successful

$ ./program
> Hello, World!
> Process exited with code 0`,

  cplusplus: `$ g++ -std=c++20 main.cpp -o program
> Linking complete

$ ./program
> Memory usage: 14.2 MB
> Execution time: 0.003s`
};

const Skills: React.FC = () => {
  const [selectedTech, setSelectedTech] = useState(techStack[0]);
  const [isTyping, setIsTyping] = useState(false);
  const [terminalText, setTerminalText] = useState("");
  const [isInitialized, setIsInitialized] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  
  const sectionRef = useRef<HTMLElement>(null);
  const terminalRef = useRef<HTMLPreElement>(null);
  const hologramRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLSpanElement>(null);
  
  // Check for mobile device and reduced motion preference
  useEffect(() => {
    // Check if device is mobile based on screen width
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setIsReducedMotion(prefersReducedMotion);
    
    checkMobile();
    window.addEventListener("resize", checkMobile);
    
    return () => window.removeEventListener("resize", checkMobile);
  }, []);
  
  // Custom typewriter effect for terminal with improved handling
  const typeTerminalText = (text: string) => {
    // Mobile devices get instant text display with no animation
    if (isMobile || isReducedMotion) {
      setTerminalText(text);
      return;
    }
    
    setIsTyping(true);
    // Initialize with an empty string to avoid losing the first character
    setTerminalText("");
    
    let i = 0;
    const speed = 20; // typing speed in ms
    
    const type = () => {
      if (i < text.length) {
        // Explicitly handle each character including the first one
        const nextChar = text.charAt(i);
        setTerminalText(current => current + nextChar);
        i++;
        setTimeout(type, speed);
      } else {
        setIsTyping(false);
      }
    };
    
    // Use requestAnimationFrame for more reliable animation start
    requestAnimationFrame(() => {
      type();
    });
  };
  
  // Handle tech selection
  const selectTech = (tech: typeof techStack[0]) => {
    if (tech.id === selectedTech.id || isTyping) return;
    
    setSelectedTech(tech);
    
    // Use our custom typewriter effect
    typeTerminalText(terminalCommands[tech.id as keyof typeof terminalCommands]);
  };
  
  // Initial animation and setup
  useEffect(() => {
    if (!sectionRef.current || !hologramRef.current || !gridRef.current) return;
    
    // Add a delay to ensure DOM is fully rendered before animations
    const timer = setTimeout(() => {
      const ctx = gsap.context(() => {
        // Start typing the initial terminal text
        typeTerminalText(terminalCommands[selectedTech.id as keyof typeof terminalCommands]);
        
        // Set static box shadow without animation
        if (hologramRef.current) {
          gsap.set(hologramRef.current, {
            boxShadow: `0 0 15px ${selectedTech.color}60, inset 0 0 10px ${selectedTech.color}20`
          });
        }
        
        // Grid animation - Reduce number of lines on mobile
        if (gridRef.current) {
          const horizontalLines = gridRef.current.querySelectorAll(".grid-line-h");
          const verticalLines = gridRef.current.querySelectorAll(".grid-line-v");
          
          // Only animate a subset of lines on mobile
          const horizontalToAnimate = isMobile ? 
            Array.from(horizontalLines).filter((_, i) => i % 3 === 0) : 
            horizontalLines;
            
          const verticalToAnimate = isMobile ? 
            Array.from(verticalLines).filter((_, i) => i % 3 === 0) : 
            verticalLines;
          
          gsap.fromTo(horizontalToAnimate, 
            { width: 0, opacity: 0 },
            { 
              width: "100%", 
              opacity: 0.3, 
              duration: isMobile ? 0.8 : 1.5, 
              stagger: isMobile ? 0.1 : 0.05,
              ease: "power2.inOut",
              scrollTrigger: {
                trigger: sectionRef.current,
                start: "top 70%",
                once: true
              }
            }
          );
          
          gsap.fromTo(verticalToAnimate, 
            { height: 0, opacity: 0 },
            { 
              height: "100%", 
              opacity: 0.3, 
              duration: isMobile ? 0.8 : 1.5, 
              stagger: isMobile ? 0.1 : 0.05,
              ease: "power2.inOut",
              scrollTrigger: {
                trigger: sectionRef.current,
                start: "top 70%",
                once: true
              }
            }
          );
        }
        
        // Skip or reduce heavy animations on mobile
        if (!isMobile && !isReducedMotion) {
          // Data stream animations - Only on desktop
          const dataStreams = document.querySelectorAll(".data-stream");
          const streamLimit = Math.min(5, dataStreams.length);
          
          for (let i = 0; i < streamLimit; i++) {
            gsap.fromTo(
              dataStreams[i],
              { opacity: 0, y: -100 },
              {
                opacity: 0.3,
                y: "110%",
                duration: 5 + Math.random() * 5,
                repeat: -1,
                delay: i * 0.5,
                ease: "none",
                scrollTrigger: {
                  trigger: sectionRef.current,
                  start: "top bottom",
                  toggleActions: "play pause resume pause"
                }
              }
            );
          }
          
          // Floating particles - Only on desktop or reduced
          const particles = document.querySelectorAll(".particle");
          const particleLimit = Math.min(isMobile ? 8 : 20, particles.length);
          
          for (let i = 0; i < particleLimit; i++) {
            gsap.to(particles[i], {
              y: `${Math.sin(i) * 50}px`,
              x: `${Math.cos(i) * 50}px`,
              rotation: Math.random() * 360,
              duration: 3 + Math.random() * 5,
              repeat: -1,
              yoyo: true,
              ease: "sine.inOut",
              delay: i * 0.2
            });
          }
        }
        
        // Scan line animation - Simplified on mobile
        if (isMobile || isReducedMotion) {
          // Simpler scan line for mobile
          gsap.fromTo(".scan-line", 
            { y: "-100%", opacity: 0.3 },
            { 
              y: "100%", 
              opacity: 0.3,
              duration: 3,
              repeat: -1,
              ease: "none"
            }
          );
        } else {
          // Full animation for desktop
          gsap.fromTo(".scan-line", 
            { y: "-100%", opacity: 0.5 },
            { 
              y: "100%", 
              opacity: 0.5,
              duration: 2,
              repeat: -1,
              ease: "none"
            }
          );
        }
        
        // Set initialized flag after animations are set up 
        setIsInitialized(true);
        
        // Failsafe to ensure visibility regardless of animation status
        setTimeout(() => {
          if (!isInitialized) {
            setIsInitialized(true);
          }
        }, 2000);
      });
      
      return () => ctx.revert();
    }, isMobile ? 100 : 200); // Shorter delay on mobile
    
    // Clean up timeout if component unmounts before initialization
    return () => clearTimeout(timer);
  }, [isMobile, isReducedMotion]);
  
  // Update hologram color when selected tech changes with static shadow
  useEffect(() => {
    if (!hologramRef.current) return;
    
    gsap.to(hologramRef.current, {
      borderColor: `${selectedTech.color}80`,
      boxShadow: `0 0 15px ${selectedTech.color}60, inset 0 0 10px ${selectedTech.color}20`,
      duration: 0.5
    });
  }, [selectedTech]);

  // Format terminal text for display with special handling for dollar sign
  const formattedTerminalText = terminalText.split('\n').map((line, index) => {
    // Special handling of lines with dollar signs
    const processedLine = line.startsWith('$') 
      ? <span><span className="text-blue-400">$</span>{line.substring(1)}</span>
      : line;
      
    return (
      <React.Fragment key={index}>
        {processedLine}
        {index < terminalText.split('\n').length - 1 && <br />}
      </React.Fragment>
    );
  });

  return (
    <motion.section
      id="skills"
      ref={sectionRef}
      className="min-h-screen relative py-24 flex items-center justify-center overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: isInitialized ? 1 : 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Grid background - Reduced density for mobile */}
      <div ref={gridRef} className="absolute inset-0 z-0 pointer-events-none">
        {/* Horizontal grid lines */}
        {Array.from({ length: isMobile ? 8 : 15 }).map((_, i) => (
          <div
            key={`h-line-${i}`}
            className="grid-line-h absolute left-0 right-0 h-px bg-primary/20 opacity-0"
            style={{ top: `${(i + 1) * 100 / (isMobile ? 9 : 16)}%` }}
          />
        ))}
        
        {/* Vertical grid lines */}
        {Array.from({ length: isMobile ? 8 : 15 }).map((_, i) => (
          <div
            key={`v-line-${i}`}
            className="grid-line-v absolute top-0 bottom-0 w-px bg-primary/20 opacity-0"
            style={{ left: `${(i + 1) * 100 / (isMobile ? 9 : 16)}%` }}
          />
        ))}
        
        {/* Data streams - binary code flowing down - Only on desktop */}
        {!isMobile && Array.from({ length: 10 }).map((_, i) => (
          <div
            key={`data-${i}`}
            className="data-stream absolute opacity-0 font-mono text-xs text-primary/50 whitespace-pre leading-tight"
            style={{ 
              left: `${5 + (i * 10)}%`,
              width: '40px',
              textAlign: 'center'
            }}
          >
            {Array.from({ length: 40 }).map(() =>
              Math.random() > 0.5 ? '1 ' : '0 '
            ).join('')}
          </div>
        ))}
        
        {/* Floating particles - Reduced for mobile */}
        {Array.from({ length: isMobile ? 10 : 20 }).map((_, i) => (
          <div
            key={`particle-${i}`}
            className="particle absolute rounded-full"
            style={{
              width: `${2 + Math.random() * 6}px`,
              height: `${2 + Math.random() * 6}px`,
              background: `${techStack[i % techStack.length].color}`,
              opacity: 0.4,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              filter: 'blur(1px)'
            }}
          />
        ))}
      </div>
      
      {/* Main gradient background */}
      <div className="absolute inset-0 bg-gradient-radial from-background via-background to-background/95 z-0"></div>
      
      <div className="container relative z-10 mx-auto px-6">
        <motion.h2 
          className="mb-8 text-center font-mono text-3xl font-bold uppercase tracking-widest text-primary md:mb-10"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: isInitialized ? 1 : 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          // Skills_
        </motion.h2>
        
        <motion.p 
          className="text-muted-foreground text-center max-w-2xl mb-10 mx-auto"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: isInitialized ? 1 : 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Tools and technologies I use to bring ideas to life
        </motion.p>
          
        {/* Holographic display - smaller on desktop */}
        <motion.div
          className="w-full mx-auto md:max-w-3xl lg:max-w-4xl xl:max-w-5xl"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: isInitialized ? 1 : 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {/* Hologram container */}
          <div 
            ref={hologramRef}
            className="hologram-container relative rounded-xl border backdrop-blur-md overflow-hidden"
            style={{
              background: "linear-gradient(135deg, rgba(30,41,59,0.6), rgba(15,23,42,0.8))",
              borderColor: `${selectedTech.color}80`,
              boxShadow: `0 0 20px ${selectedTech.color}40`
            }}
          >
            {/* Header bar */}
            <div className="flex items-center justify-between p-4 border-b border-gray-800">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              
              <div className="px-3 py-1 rounded-md bg-secondary/30 font-mono text-xs">
                skills.tsx
              </div>
            </div>
            
            {/* macOS-style layout with sidebar and content */}
            <div className="flex flex-col md:flex-row">
              {/* Left sidebar for tech selection - similar to macOS Settings */}
              <div className="md:w-56 lg:w-64 border-r border-gray-800">
                <div className="p-2">
                  {techStack.map((tech) => (
                    <button
                      key={tech.id}
                      onClick={() => selectTech(tech)}
                      className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-all duration-300 ${
                        selectedTech.id === tech.id
                          ? "bg-secondary/40 text-foreground"
                          : "text-muted-foreground hover:bg-secondary/20"
                      }`}
                    >
                      <div 
                        className="tech-icon w-6 h-6 relative flex items-center justify-center"
                        style={{
                          filter: selectedTech.id === tech.id ? "drop-shadow(0 0 3px " + tech.color + ")" : "none" 
                        }}
                      >
                        <img 
                          src={tech.icon} 
                          alt={tech.name} 
                          className="w-full h-full object-contain" 
                        />
                      </div>
                      <span className="font-medium">{tech.name}</span>
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Main content area */}
              <div className="flex-1 p-6">
                {/* Tech info display */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
                  {/* Tech logo - takes 1 column */}
                  <div className="flex items-center justify-center">
                    <div 
                      className="w-32 h-32 p-4 rounded-2xl flex items-center justify-center relative overflow-hidden"
                      style={{
                        background: `radial-gradient(circle at center, ${selectedTech.color}20, transparent 80%)`,
                      }}
                    >
                      <img 
                        src={selectedTech.icon} 
                        alt={selectedTech.name} 
                        className="w-20 h-20 object-contain filter drop-shadow-lg relative z-10" 
                      />
                      
                      {/* Glowing effect */}
                      <div 
                        className="absolute inset-0 z-0 opacity-50"
                        style={{
                          background: `radial-gradient(circle at center, ${selectedTech.color}30, transparent 70%)`,
                          filter: `blur(15px)`
                        }}
                      ></div>
                      
                      {/* Rotating rings - Disable on mobile for performance */}
                      {!isMobile && (
                        <>
                          <div 
                            className="absolute w-full h-full rounded-full border-t border-r border-primary/30 animate-spin-slow"
                            style={{ borderColor: `${selectedTech.color}40` }}
                          ></div>
                          <div 
                            className="absolute w-3/4 h-3/4 rounded-full border-b border-l border-primary/20 animate-spin-slow-reverse"
                            style={{ borderColor: `${selectedTech.color}30` }}
                          ></div>
                        </>
                      )}
                    </div>
                  </div>
                  
                  {/* Tech content - takes 2 columns */}
                  <div className="md:col-span-2 space-y-4">
                    <h3 className="text-2xl font-bold tracking-tight" style={{ color: selectedTech.color }}>
                      {selectedTech.name}
                    </h3>
                    
                    <p className="text-muted-foreground leading-relaxed">
                      {selectedTech.purpose}
                    </p>
                    
                    {/* Terminal window */}
                    <div className="mt-4 bg-black/80 rounded-md border border-gray-800 overflow-hidden">
                      <div className="px-4 py-2 bg-gray-900/80 border-b border-gray-800 flex items-center">
                        <div className="h-2 w-2 rounded-full bg-primary/70 mr-1.5"></div>
                        <div className="text-xs font-mono text-muted-foreground">terminal</div>
                      </div>
                      
                      <div className="p-4 font-mono text-xs lg:text-sm relative min-h-[180px]">
                        <pre 
                          className="text-green-500 whitespace-pre-wrap"
                          style={{ lineHeight: 1.5 }}
                        >
                          {formattedTerminalText}
                          {!isMobile && (
                            <span 
                              ref={cursorRef}
                              className={`inline-block w-2 h-4 bg-green-500 ml-1 ${isTyping ? 'opacity-100' : 'animate-pulse'}`}
                            ></span>
                          )}
                        </pre>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Hologram overlay effects */}
            <div className="pointer-events-none absolute inset-0 z-20">
              {/* Scan line */}
              <div className="scan-line absolute left-0 w-full h-[2px] bg-primary/10 opacity-50"></div>
              
              {/* Horizontal lines - Reduced for mobile */}
              {Array.from({ length: isMobile ? 5 : 10 }).map((_, i) => (
                <div
                  key={`holo-line-${i}`}
                  className="absolute left-0 right-0 h-px opacity-10"
                  style={{ 
                    top: `${(i + 1) * 100 / (isMobile ? 6 : 11)}%`,
                    background: `linear-gradient(90deg, transparent 5%, ${selectedTech.color} 50%, transparent 95%)` 
                  }}
                />
              ))}
            </div>
          </div>
        </motion.div>
      </div>
      
      {/* Add custom CSS animations */}
      <style jsx>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes spin-slow-reverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
        
        .animate-spin-slow-reverse {
          animation: spin-slow-reverse 15s linear infinite;
        }
        
        .bg-gradient-radial {
          background: radial-gradient(circle at center, var(--tw-gradient-from) 0%, var(--tw-gradient-via) 50%, var(--tw-gradient-to) 100%);
        }
      `}</style>
    </motion.section>
  );
};

export default Skills; 