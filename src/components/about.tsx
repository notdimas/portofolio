"use client";

import React, { useEffect, useRef, useState, forwardRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TextPlugin } from "gsap/TextPlugin";

gsap.registerPlugin(ScrollTrigger, TextPlugin);

// Cursor component - now a circle dot that follows the text
const TypingCursor = () => (
  <span className="inline-block h-2 w-2 bg-primary/90 rounded-full ml-0.5 animate-blink"></span>
);

const About = forwardRef<HTMLElement>((props, ref) => {
  const sectionRef = useRef<HTMLElement>(null);
  const textContainerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);
  const [sectionInView, setSectionInView] = useState(false);
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [previousMobile, setPreviousMobile] = useState<boolean | null>(null);
  const [isLowEndDevice, setIsLowEndDevice] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [currentCursorElement, setCurrentCursorElement] = useState<string | null>(null);
  const [contentRendered, setContentRendered] = useState(false);
  const [layoutChanged, setLayoutChanged] = useState(false);
  
  // Enhanced check for mobile device and performance capabilities
  useEffect(() => {
    // Check if device is mobile based on screen width
    const checkMobile = () => {
      const wasMobile = isMobile;
      const mobile = window.innerWidth < 768;
      
      if (wasMobile !== mobile && previousMobile !== null) {
        setLayoutChanged(true);
      }
      
      setPreviousMobile(mobile);
      setIsMobile(mobile);
      
      // Check for low-end devices on mobile
      if (mobile) {
        // Simple performance detection heuristic for Android devices
        const isLowPerformance = 
          /Android/.test(navigator.userAgent) && 
          (/Chrome\/[0-6]/.test(navigator.userAgent) || 
          /Version\/[0-9]/.test(navigator.userAgent));
          
        setIsLowEndDevice(isLowPerformance);
      }
    };
    
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setIsReducedMotion(prefersReducedMotion);
    
    checkMobile();
    window.addEventListener("resize", checkMobile, { passive: true });
    
    return () => window.removeEventListener("resize", checkMobile);
  }, [isMobile, previousMobile]);
  
  useEffect(() => {
    if (sectionRef.current) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setSectionInView(true);
            observer.disconnect();
          }
        },
        { threshold: 0.1 } // Lower threshold for quicker triggering
      );
      
      observer.observe(sectionRef.current);
      
      return () => observer.disconnect();
    }
  }, []);
  
  // Style for the element containing the cursor
  const cursorContainerStyle = {
    position: 'relative' as const
  };
  
  // Function to show all content immediately without animations
  const showAllContentImmediately = () => {
    if (textContainerRef.current) {
      const contentElements = textContainerRef.current.querySelectorAll("p, pre, #code-container");
      contentElements.forEach(el => {
        gsap.to(el, { opacity: 1, duration: 0.2 });
      });
      setContentRendered(true);
      setIsTyping(false);
      setCurrentCursorElement(null);
    }
  };
  
  // Handle layout changes
  useEffect(() => {
    if (layoutChanged && contentRendered) {
      // When layout changes and content was previously rendered,
      // ensure content remains visible without restarting animations
      showAllContentImmediately();
      setLayoutChanged(false);
    }
  }, [layoutChanged, contentRendered]);
  
  // Optimized text animation effect
  useEffect(() => {
    if (sectionRef.current && textContainerRef.current && sectionInView) {
      // Don't re-animate if content is already rendered during layout changes
      if (contentRendered && !layoutChanged) return;
      
      // All content elements that should be animated
      const contentElements = [
        { id: "gen-p1", el: textContainerRef.current.querySelector("#gen-p1") as HTMLElement, speed: 300, variance: 0.3 },
        { id: "gen-p2", el: textContainerRef.current.querySelector("#gen-p2") as HTMLElement, speed: 350, variance: 0.3 },
        { id: "code-container", el: textContainerRef.current.querySelector("#code-container") as HTMLElement, type: "container" },
        { id: "gen-code", el: textContainerRef.current.querySelector("#gen-code") as HTMLElement, speed: 280, variance: 0.2 },
        { id: "gen-p3", el: textContainerRef.current.querySelector("#gen-p3") as HTMLElement, speed: 320, variance: 0.3 },
        { id: "gen-p4", el: textContainerRef.current.querySelector("#gen-p4") as HTMLElement, speed: 330, variance: 0.3 }
      ].filter(item => item.el !== null);
      
      // Simplified static display for mobile or if layout just changed
      if (isMobile || isReducedMotion || isLowEndDevice || layoutChanged) {
        // For mobile, just fade in the elements without typing effect
        contentElements.forEach((item, index) => {
          if (item.id === "code-container") {
            gsap.to(item.el, {
              opacity: 1,
              duration: 0.2,
              delay: 0.1
            });
          } else {
            gsap.to(item.el, {
              opacity: 1,
              duration: 0.2,
              delay: index * 0.05 + 0.1
            });
          }
        });
        
        setContentRendered(true);
        setIsTyping(false);
        return;
      }
      
      // For desktop with animations - store original content and clear elements
      const originalContents = contentElements.map(item => {
        const content = item.el.innerHTML;
        if (item.type !== "container") {
          item.el.innerHTML = '';
        }
        return { id: item.id, content };
      });
      
      setIsTyping(true);
      
      // Advanced batch typing with HTML preservation and variable speed
      const typeTextWithHTML = (
        element: HTMLElement, 
        html: string, 
        speed: number,
        variance: number = 0.3,
        onComplete: () => void
      ) => {
        // Create a temporary element to parse the HTML
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = html;
        
        // This will hold the current typed text
        let currentHTML = '';
        const plainText = tempDiv.textContent || '';
        let charIndex = 0;
        
        // Make element visible before typing
        gsap.to(element, { opacity: 1, duration: 0.1 });
        
        // Improved position finding for HTML text
        const findCharPosition = (charIndex: number, html: string) => {
          let plainTextIndex = 0;
          let htmlIndex = 0;
          
          while (htmlIndex < html.length && plainTextIndex < charIndex) {
            if (html[htmlIndex] === '<') {
              // Skip over HTML tag
              while (htmlIndex < html.length && html[htmlIndex] !== '>') {
                htmlIndex++;
              }
              htmlIndex++; // Skip over closing '>'
            } else if (html[htmlIndex] === '&') {
              // Skip over HTML entity
              let entityEnd = html.indexOf(';', htmlIndex);
              if (entityEnd !== -1) {
                plainTextIndex++; // Count entity as one character
                htmlIndex = entityEnd + 1;
              } else {
                // If no semicolon found, treat as regular character
                plainTextIndex++;
                htmlIndex++;
              }
            } else {
              plainTextIndex++;
              htmlIndex++;
            }
          }
          
          return htmlIndex;
        };
        
        // Type in batches with variable speed for natural feel
        const typeBatch = () => {
          if (charIndex < plainText.length) {
            // Calculate a batch size that varies based on the content being rendered
            let batchSize = Math.max(1, Math.floor(speed / 100)); // Base batch size on speed
            
            // Add variance so it's not perfectly consistent (feels more natural)
            const varianceFactor = 1 - variance/2 + Math.random() * variance;
            batchSize = Math.floor(batchSize * varianceFactor);
            
            // Ensure batch doesn't go beyond text length
            const nextIndex = Math.min(plainText.length, charIndex + batchSize);
            
            // Find exact HTML position for the nextIndex character
            const htmlIndex = findCharPosition(nextIndex, html);
            currentHTML = html.substring(0, htmlIndex);
            element.innerHTML = currentHTML;
            charIndex = nextIndex;
            
            // Set cursor element
            setCurrentCursorElement(element.id);
            
            // Variable delay for natural feel
            const progressFactor = charIndex / plainText.length;
            const speedFactor = progressFactor < 0.2 ? 
              1.2 - progressFactor : // Slightly slower at start
              (progressFactor > 0.8 ? 
                0.8 + 0.5 * (progressFactor - 0.8) : // Slowing down toward end
                0.8); // Fastest in the middle
            
            const delay = 1000 / (speed * speedFactor);
            
            // Schedule next batch
            setTimeout(typeBatch, delay);
          } else {
            // Done typing
            onComplete();
          }
        };
        
        // Start typing
        typeBatch();
      };
      
      // Function to animate elements in sequence
      const animateElements = async () => {
        for (let i = 0; i < contentElements.length; i++) {
          const item = contentElements[i];
          const contentObj = originalContents.find(c => c.id === item.id);
          
          if (!contentObj) continue;
          
          // Fade in container first
          if (item.id === "code-container") {
            gsap.to(item.el, { opacity: 1, duration: 0.2 });
            // Small delay before typing code content
            await new Promise(resolve => setTimeout(resolve, 100));
            continue;
          }
          
          // Set current element for cursor positioning
          setCurrentCursorElement(item.id);
          
          // Type the content
          await new Promise<void>(resolve => {
            typeTextWithHTML(
              item.el,
              contentObj.content,
              item.speed || 300, // Higher default speed
              item.variance || 0.3,
              resolve
            );
          });
          
          // Slight pause between elements
          await new Promise(resolve => setTimeout(resolve, 80));
        }
        
        // Done typing all elements
        setIsTyping(false);
        setCurrentCursorElement(null);
        setContentRendered(true);
      };
      
      // Start animation
      animateElements();
      
      // Cleanup function
      return () => {
        // If animation is interrupted, ensure content is still visible
        if (isTyping) {
          showAllContentImmediately();
        }
      };
    }
  }, [sectionInView, isMobile, isReducedMotion, isLowEndDevice, layoutChanged, contentRendered]);
  
  // Optimized grid and decorative animations
  useEffect(() => {
    // Animate grid lines and other decorative elements
    if (sectionInView && gridRef.current) {
      const ctx = gsap.context(() => {
        const horizontalLines = document.querySelectorAll(".grid-line-h");
        const verticalLines = document.querySelectorAll(".grid-line-v");
        
        if (isMobile || isLowEndDevice) {
          // For mobile, just set the final state without animations
          gsap.set(horizontalLines, {
            width: "100%",
            opacity: 0.2
          });
          
          gsap.set(verticalLines, {
            height: "100%",
            opacity: 0.2
          });
        } else {
          // Full animation for desktop
          gsap.fromTo(horizontalLines, 
            { width: 0, opacity: 0 },
            { 
              width: "100%", 
              opacity: 0.2, 
              duration: 1.5, 
              stagger: 0.05,
              ease: "power3.inOut",
            }
          );
          
          gsap.fromTo(verticalLines, 
            { height: 0, opacity: 0 },
            { 
              height: "100%", 
              opacity: 0.2, 
              duration: 1.5, 
              stagger: 0.05,
              ease: "power3.inOut",
            }
          );
        }
        
        // Terminal typing effect
        if (terminalRef.current) {
          const terminalLines = terminalRef.current.querySelectorAll(".terminal-line");
          
          if (isMobile || isReducedMotion || isLowEndDevice) {
            // Static reveal for mobile
            gsap.set(terminalLines, { 
              width: "100%", 
              opacity: 1 
            });
          } else {
            // Full typewriter effect for desktop
            terminalLines.forEach((line, index) => {
              gsap.fromTo(
                line,
                { width: 0, opacity: 0 },
                { 
                  width: "100%", 
                  opacity: 1, 
                  duration: 0.8,
                  delay: 0.3 + (index * 0.3),
                  ease: "steps(20)",
                }
              );
            });
          }
          
          // Blinking cursor - keep this as it's not performance-heavy
          const cursor = terminalRef.current.querySelector(".cursor");
          if (cursor) {
            gsap.to(cursor, {
              opacity: 0,
              repeat: -1,
              yoyo: true,
              duration: 0.7,
              ease: "steps(1)"
            });
          }
        }
        
        // Floating elements - static for mobile
        const floatingElements = document.querySelectorAll(".float");
        if (isMobile || isReducedMotion || isLowEndDevice) {
          // Static position for mobile instead of floating animation
          gsap.set(floatingElements, { 
            opacity: 1, 
            scale: 1
          });
        } else {
          // Full floating animation for desktop
          floatingElements.forEach((el, i) => {
            gsap.to(el, {
              y: `${Math.sin(i * 1.5) * (15 + Math.random() * 10)}px`,
              x: `${Math.cos(i * 1.5) * (8 + Math.random() * 8)}px`,
              rotate: (Math.random() - 0.5) * 6,
              duration: 3 + Math.random() * 4,
              repeat: -1,
              yoyo: true,
              ease: "sine.inOut",
              delay: i * 0.3
            });
          }
        )}
      });
      
      return () => ctx.revert();
    }
  }, [sectionInView, isMobile, isReducedMotion, isLowEndDevice]);
  
  // Combine external ref with internal ref
  const setRefs = (el: HTMLElement | null) => {
    // Set internal ref
    if (sectionRef.current !== el) {
      sectionRef.current = el;
    }
    
    // Forward to external ref
    if (typeof ref === 'function') {
      ref(el);
    } else if (ref) {
      ref.current = el;
    }
  };

  return (
    <motion.section
      id="about"
      ref={setRefs}
      className="min-h-screen relative overflow-hidden py-24 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      style={{ 
        contain: isMobile ? 'content' : 'none',
        willChange: isMobile ? 'transform' : 'auto'
      }}
    >
      {/* Add blinking cursor animation */}
      <style jsx global>{`
        @keyframes blink {
          0%, 49% { opacity: 1; }
          50%, 100% { opacity: 0; }
        }
        .animate-blink {
          animation: blink 0.7s infinite;
        }
        
        /* Content visibility protection */
        #gen-p1, #gen-p2, #gen-p3, #gen-p4, #gen-code, #code-container {
          transition: opacity 0.2s ease;
          min-height: 1.5em;
        }
        
        /* Ensure content remains visible when screen size changes */
        @media (max-width: 767px) {
          .section-text-content p,
          .section-text-content pre,
          .section-text-content #code-container {
            opacity: 1 !important;
            visibility: visible !important;
          }
        }
      `}</style>
      
      {/* Grid background - Keep grid but optimize rendering */}
      <div 
        ref={gridRef} 
        className="absolute inset-0 z-0 pointer-events-none overflow-hidden" 
        style={{ contain: 'paint' }}
      >
        {/* Horizontal grid lines */}
        {Array.from({ length: 12 }).map((_, index) => (
          <div 
            key={`h-line-${index}`} 
            className="grid-line-h absolute left-0 right-0 h-px bg-primary/20 opacity-0"
            style={{ 
              top: `${(index + 1) * 100 / 13}%`,
              willChange: isMobile ? 'opacity' : 'width, opacity'
            }}
          />
        ))}
        
        {/* Vertical grid lines */}
        {Array.from({ length: 12 }).map((_, index) => (
          <div 
            key={`v-line-${index}`} 
            className="grid-line-v absolute top-0 bottom-0 w-px bg-primary/20 opacity-0"
            style={{ 
              left: `${(index + 1) * 100 / 13}%`,
              willChange: isMobile ? 'opacity' : 'height, opacity'
            }}
          />
        ))}
        
        {/* Data streams - render for desktop, simplified for mobile */}
        {Array.from({ length: 8 }).map((_, index) => (
          <div 
            key={`data-${index}`} 
            className={`data-stream absolute ${isMobile ? 'opacity-[0.15]' : 'opacity-0'} font-mono text-[8px] sm:text-[10px] text-primary/30 whitespace-pre leading-tight`}
            style={{ 
              left: `${10 + (index * 10)}%`,
              width: 'clamp(40px, 4vw, 60px)',
              textAlign: 'center',
              display: isMobile && isLowEndDevice ? 'none' : 'block'
            }}
          >
            {Array.from({ length: 30 }).map(() => 
              Math.random() > 0.5 ? '1 ' : '0 '
            ).join('')}
          </div>
        ))}
      </div>
      
      {/* Content container */}
      <div className="container relative z-10 mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-center">
          {/* Left column with heading and graphics */}
          <div className="lg:col-span-2 space-y-8">
            <motion.div
              className="relative"
              initial={{ opacity: 0, y: isMobile ? 20 : 50 }}
              animate={sectionInView ? { opacity: 1, y: 0 } : { opacity: 0, y: isMobile ? 20 : 50 }}
              transition={{ duration: isMobile ? 0.4 : 0.7 }}
            >
              <h2 className="mb-5 text-center font-mono text-3xl font-bold uppercase tracking-widest text-primary md:mb-12">
                // About_
              </h2>
              
              {/* Tech background decorative element - static for mobile */}
              <div className={`absolute -top-3 -left-3 w-20 h-20 border border-primary/30 rounded-md ${isMobile ? '' : 'rotate-12'} float`} />
              <div className={`absolute top-2 -right-6 w-12 h-12 border border-blue-500/30 rounded-full ${isMobile ? '' : '-rotate-6'} float`} />
            </motion.div>
            
            {/* Terminal window */}
            <motion.div 
              ref={terminalRef}
              className="relative p-1 bg-secondary/20 backdrop-blur-lg rounded-lg border border-border overflow-hidden mt-8 float"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={sectionInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
              transition={{ duration: isMobile ? 0.4 : 0.7, delay: isMobile ? 0.1 : 0.2 }}
              style={{ willChange: 'transform, opacity' }}
            >
              {/* Terminal header */}
              <div className="h-7 bg-secondary/30 rounded-t-sm border-b border-border flex items-center px-3">
                <div className="w-2.5 h-2.5 rounded-full bg-destructive/70 mr-1.5"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/70 mr-1.5"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-green-500/70 mr-auto"></div>
                <div className="text-xs font-mono text-muted-foreground tracking-wide">about.terminal</div>
              </div>
              
              {/* Terminal content - adapt for mobile */}
              {sectionInView && (
                <div className="p-3 pt-4 font-mono text-xs space-y-1.5">
                  <div className={`terminal-line whitespace-nowrap overflow-hidden text-primary ${isMobile ? 'w-full' : ''}`}>
                    $ whoami
                  </div>
                  <div className={`terminal-line whitespace-nowrap overflow-hidden text-muted-foreground ml-1 ${isMobile ? 'w-full' : ''}`}>
                    dprayogo
                  </div>
                  <div className={`terminal-line whitespace-nowrap overflow-hidden text-primary mt-2 ${isMobile ? 'w-full' : ''}`}>
                    $ cat skills.json
                  </div>
                  <div className={`terminal-line whitespace-nowrap overflow-hidden text-green-400/80 ml-1 ${isMobile ? 'w-full' : ''}`}>
                    &#123; "frontend": ["React", "TypeScript", "NextJS"], 
                  </div>
                  <div className={`terminal-line whitespace-nowrap overflow-hidden text-green-400/80 ml-3 ${isMobile ? 'w-full' : ''}`}>
                    "backend": ["Node.js", "Python", "APIs"] &#125;
                  </div>
                  <div className={`terminal-line whitespace-nowrap overflow-hidden text-primary mt-2 ${isMobile ? 'w-full' : ''}`}>
                    $ ./show-experience.sh
                  </div>
                  <div className={`terminal-line whitespace-nowrap overflow-hidden text-blue-400/80 ml-1 ${isMobile ? 'w-full' : ''}`}>
                    &gt; Fullstack Developer with 5+ years experience
                  </div>
                  <div className="terminal-line flex text-primary mt-2">
                    $ <span className="cursor ml-1.5 inline-block w-2 h-4 bg-primary animate-pulse"></span>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
          
          {/* Right column with text content */}
          <div 
            ref={textContainerRef}
            className="lg:col-span-3 relative section-text-content"
          >
            {/* Decorative element - simplified blur on mobile */}
            <div className={`absolute -top-10 -right-10 w-[150px] h-[150px] ${isMobile ? 'blur-[40px]' : 'blur-[80px]'} rounded-full bg-primary/20 pointer-events-none`}></div>
            
            {/* Tech circuit line */}
            <div className="absolute left-0 top-0 h-full w-px bg-gradient-to-b from-transparent via-primary/30 to-transparent hidden lg:block"></div>
            
            {/* Text content container - optimize for initial rendering */} 
            <div className="lg:pl-8 space-y-6 min-h-[400px]">
              <div style={cursorContainerStyle}>
                <p id="gen-p1" className="text-lg sm:text-xl leading-relaxed text-muted-foreground overflow-hidden opacity-0">
                Hello! I'm <span className="text-primary font-medium">Dimas Bagus Prayogo</span>, a passionate Fullstack Developer with a love for crafting elegant and efficient solutions for the web.
              </p>
                {currentCursorElement === "gen-p1" && isTyping && <TypingCursor />}
              </div>
              
              <div style={cursorContainerStyle}>
                <p id="gen-p2" className="leading-relaxed text-muted-foreground overflow-hidden opacity-0">
                My journey into programming started with curiosity about how websites worked. What began as simple HTML and CSS experiments quickly evolved into a deep passion for creating interactive digital experiences. I've since developed expertise in both frontend and backend technologies.
              </p>
                {currentCursorElement === "gen-p2" && isTyping && <TypingCursor />}
              </div>
              
              {/* Code block - Add an id to the container */}
              <div id="code-container" className="bg-secondary/30 backdrop-blur-sm rounded-lg border border-border p-4 font-mono text-sm opacity-0">
                <div style={cursorContainerStyle}>
                  <pre id="gen-code" className="whitespace-pre-wrap break-words opacity-0">
                  <span className="text-blue-400">use</span> <span className="text-green-400">serde_json::json;</span><br />
                  <span className="text-blue-400">fn</span> <span className="text-green-400">get_about_me_json</span>() <span className="text-blue-400">-&gt;</span> <span className="text-blue-400">serde_json::Value</span> <span className="text-blue-400">&#123;</span><br />
                  &nbsp;&nbsp;<span className="text-muted-foreground">json!</span>(&#123;<br />
                    &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-blue-400">name</span>: <span className="text-green-400">"Dimas Bagus Prayogo"</span><span className="text-yellow-400">.to_string</span><span className="text-blue-400">()</span>,<br />
                    &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-blue-400">role</span>: <span className="text-green-400">"Fullstack Developer"</span><span className="text-yellow-400">.to_string</span><span className="text-blue-400">()</span>,<br />
                    &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-blue-400">focus</span>: <span className="text-green-400">"Creating exceptional user experiences"</span><span className="text-yellow-400">.to_string</span><span className="text-blue-400">()</span><br />
                  &nbsp;&nbsp;&#125;)<br />
                  &#125;
                </pre>
                  {currentCursorElement === "gen-code" && isTyping && <TypingCursor />}
                </div>
              </div>
              
              <div style={cursorContainerStyle}>
                <p id="gen-p3" className="leading-relaxed text-muted-foreground overflow-hidden opacity-0">
                I enjoy solving complex problems through code and believe in writing clean, maintainable software that stands the test of time. My focus is on creating technology that not only works well but also provides an exceptional user experience.
              </p>
                {currentCursorElement === "gen-p3" && isTyping && <TypingCursor />}
              </div>
              
              <div style={cursorContainerStyle}>
                <p id="gen-p4" className="leading-relaxed text-muted-foreground overflow-hidden opacity-0">
                When I'm not coding, you can find me exploring new technologies, contributing to open-source projects, or sharing knowledge with the developer community.
              </p>
                {currentCursorElement === "gen-p4" && isTyping && <TypingCursor />}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Decorative elements - static for mobile */}
      <div className={`absolute bottom-10 left-10 w-24 h-24 border border-primary/30 rounded-md ${isMobile ? '' : 'rotate-45'} opacity-40 z-0 float pointer-events-none`}></div>
      <div className={`absolute top-20 right-[10%] w-16 h-16 border border-primary/30 rounded-full ${isMobile ? '' : '-rotate-12'} opacity-30 z-0 float pointer-events-none`}></div>
    </motion.section>
  );
});

About.displayName = "About";

export default About; 