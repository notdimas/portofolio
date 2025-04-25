"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ExternalLink, Github, Code, Terminal, Lock, Globe, Eye } from "lucide-react";
import { cn } from "@/lib/utils";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TextPlugin } from "gsap/TextPlugin";

gsap.registerPlugin(ScrollTrigger, TextPlugin);

interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  technologies: string[];
  status: ("private" | "public" | "live")[];
  type: string;
  link?: string;
  live?: string;
}

const projects: Project[] = [
  {
    id: "project1",
    title: "MiiStore",
    description: "A freelance project developed for a client — MiiStore is a fully automated game top-up website built with Laravel 11, featuring a full admin dashboard, integrated payment gateway, item stock management, and a user-friendly interface to streamline digital product transactions.",
    image: "/images/projects/project3_project.png",
    technologies: ["PHP", "Laravel", "MySQL", "JavaScript", "Payment Gateway"],
    status: ["private", "live"],
    type: "Freelance Project",
    live: "https://miistore.id"
  },  
  {
    id: "project2",
    title: "Personal Portfolio",
    description: "A nice-looking personal portfolio website, built using Next.js and TypeScript for a fast and scalable architecture. It features smooth page transitions and an overall interactive user experience. Designed to reflect both professionalism and aesthetics in one platform.",
    image: "/images/projects/project1_project.png",
    technologies: ["Next.js", "TypeScript", "Tailwind CSS", "Framer Motion", "GSAP"],
    status: ["public"],
    type: "Featured Project",
    link: "https://github.com/notdimas/portofolio",
    live: ""
  },
  {
    id: "project3",
    title: "SimpleNotepad",
    description: "SimpleNotepad is a minimalist reimplementation of the classic Windows Notepad, built entirely in C. It was created as a fun side project to explore low-level GUI programming on Windows. The project uses CMake as its build system.",
    image: "/images/projects/project2_project.png",
    technologies: ["C", "WinAPI", "CMake"],
    status: ["public"],
    type: "Featured Project",
    link: "https://github.com/SFINXVC/SimpleNotepad",
  },
  {
    "id": "project4",
    "title": "FL-RPC",
    "description": "A lightweight Discord Rich Presence integration for FL Studio that displays real-time information about the current project, session duration, and editing status directly on your Discord profile.",
    "image": "",
    "technologies": ["C++", "C", "WinAPI", "CMake"],
    "status": ["public"],
    "type": "Featured Project",
    "link": "https://github.com/SFINXVC/FL-RPC"
  }  
];

const Projects = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [hasEntered, setHasEntered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isHighPerformanceDevice, setIsHighPerformanceDevice] = useState(true);
  const animationsInitialized = useRef(false);
  
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      
      if (mobile) {
        const isLowPerformance = 
          /Android/.test(navigator.userAgent) && 
          (/Chrome\/[0-9]/.test(navigator.userAgent) || 
          /Version\/[0-9]/.test(navigator.userAgent));
          
        setIsHighPerformanceDevice(!isLowPerformance);
      } else {
        setIsHighPerformanceDevice(true);
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    const grid = gridRef.current;
    const bg = bgRef.current;
    
    if (!section || !grid || !bg) return;

    const cards = grid.querySelectorAll<HTMLElement>(".project-card");
    gsap.set(cards, { 
      opacity: 0, 
      y: 50,
      scale: 0.95,
      filter: isMobile ? "none" : "blur(5px)"
    });

    const particleCount = isMobile ? (isHighPerformanceDevice ? 5 : 0) : 40;
    const gridLines = bg.querySelectorAll(".grid-line");
    const dataStreams = bg.querySelectorAll(".data-stream");
    const particles = Array.from(bg.querySelectorAll(".bg-particle")).slice(0, particleCount);
    
    gsap.set(gridLines, { opacity: 0 });
    
    const mainTl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top 85%",
        end: "bottom bottom",
        toggleActions: "play none none reverse",
        onEnter: () => setHasEntered(true),
        onLeaveBack: () => setHasEntered(false),
      }
    });

    const performanceMode = isMobile || !isHighPerformanceDevice;
    
    if (performanceMode) {
      if (isMobile && !isHighPerformanceDevice) {
        mainTl.to(cards, {
          opacity: 1,
          y: 0,
          scale: 1,
          stagger: 0.1,
          duration: 0.5,
          ease: "power1.out",
        });
      } else {
        mainTl
          .to(Array.from(gridLines).filter((_, i) => i % 5 === 0), {
            opacity: 0.15,
            duration: 0.5,
            stagger: 0.05,
            ease: "power1.inOut"
          }, 0)
          .to(particles, {
            opacity: 0.3,
            scale: 1,
            duration: 0.5,
            stagger: 0.01,
            ease: "power1.out"
          }, 0.2);
      }
      
      if (!animationsInitialized.current && particles.length > 0) {
        particles.forEach((particle, i) => {
          if (i % 3 === 0) {
            const speed = 10 + Math.random() * 5;
            const dist = 10;
            const direction = Math.random() > 0.5 ? 1 : -1;
            
            gsap.to(particle, {
              y: `+=${dist * direction}`,
              duration: speed,
              ease: "sine.inOut",
              repeat: -1,
              yoyo: true,
              delay: i * 0.1
            });
          }
        });
        
        animationsInitialized.current = true;
      }
    } else {
      mainTl
        .to(gridLines, {
          opacity: 0.3,
          duration: 1.5,
          stagger: 0.03,
          ease: "power2.inOut"
        }, 0)
        .to(dataStreams, {
          opacity: 0.4,
          y: 0,
          duration: 1.8,
          stagger: 0.1,
          ease: "power2.out"
        }, 0.3)
        .to(particles, {
          opacity: 0.7,
          scale: 1,
          duration: 1.2,
          stagger: 0.05,
          ease: "back.out(1.7)"
        }, 0.5);

      if (!animationsInitialized.current) {
        particles.forEach((particle, i) => {
          const speed = 5 + (i % 15);
          const xDist = 30 + (i % 7) * 10;
          const yDist = 30 + (i % 5) * 15;
          const xDirection = i % 2 === 0 ? 1 : -1;
          const yDirection = i % 3 === 0 ? 1 : -1;
          
          gsap.to(particle, {
            x: `+=${xDist * xDirection}`,
            y: `+=${yDist * yDirection}`,
            rotation: (i % 360),
            duration: speed,
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true,
            delay: i * 0.1
          });
        });
        
        dataStreams.forEach((stream, i) => {
          gsap.to(stream, {
            y: "100vh", 
            duration: 15 + (i % 10),
            ease: "none",
            repeat: -1,
            delay: i * 1.5
          });
        });
        
        animationsInitialized.current = true;
      }
    }

    cards.forEach((card, i) => {
      if (performanceMode) {
        gsap.to(card, {
          scrollTrigger: {
            trigger: card,
            start: "top 90%",
            once: true,
          },
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.4,
          delay: i * 0.1,
          ease: "power1.out"
        });
      } else {
        gsap.timeline({
          scrollTrigger: {
            trigger: card,
            start: "top 85%",
            end: "top 40%",
            scrub: 0.5,
            toggleActions: "play none none reverse",
          }
        })
        .to(card, {
          opacity: 1,
          y: 0,
          scale: 1,
          filter: "blur(0px)",
          duration: 0.6,
          ease: "power2.out"
        });
      }
    });

    if (!performanceMode) {
      gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 50%",
          end: "center center",
          scrub: true,
        }
      })
      .fromTo(section, 
        { 
          borderRadius: "20px",
          margin: "40px",
          scale: 0.97
        },
        {
          borderRadius: "0px",
          margin: "0px",
          scale: 1,
          duration: 1,
          ease: "power1.inOut"
        }
      );
    }

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      gsap.globalTimeline.getChildren().forEach(tween => tween.kill());
      animationsInitialized.current = false;
    };
  }, [isMobile, isHighPerformanceDevice]);

  const glitchText = (isActive: boolean, text: string) => {
    if (!isActive) return text;
    
    if (Math.random() > 0.7) {
      const chars = "!@#$%^&*()_+-=[]{}|;:,.<>?/\\";
      const rand = Math.floor(Math.random() * text.length);
      const randChar = chars[Math.floor(Math.random() * chars.length)];
      
      return text.substring(0, rand) + randChar + text.substring(rand + 1);
    }
    
    return text;
  };

  const renderStatusIcon = (status: "private" | "public" | "live") => {
    switch (status) {
      case "private":
        return <Lock size={14} className="mr-1.5" />;
      case "public":
        return <Globe size={14} className="mr-1.5" />;
      case "live":
        return <Eye size={14} className="mr-1.5" />;
      default:
        return null;
    }
  };

  const getStatusLabel = (status: "private" | "public" | "live") => {
    switch (status) {
      case "private":
        return "Private Project";
      case "public":
        return "Public Repo";
      case "live":
        return "Live";
      default:
        return "Project";
    }
  };

  const getStatusColor = (status: "private" | "public" | "live") => {
    switch (status) {
      case "private":
        return "text-amber-400 border-amber-400/50 bg-gray-900/80 backdrop-blur-sm shadow-sm";
      case "public":
        return "text-green-400 border-green-400/50 bg-gray-900/80 backdrop-blur-sm shadow-sm";
      case "live":
        return "text-blue-400 border-blue-400/50 bg-gray-900/80 backdrop-blur-sm shadow-sm";
      default:
        return "text-primary border-primary/50 bg-gray-900/80 backdrop-blur-sm shadow-sm";
    }
  };

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background py-20 md:py-28 transition-all duration-1000 rounded-none md:rounded-none"
    >
      <div ref={bgRef} className="absolute inset-0 z-0 overflow-hidden will-change-transform pointer-events-none">
        <div className="absolute inset-0 bg-grid-pattern opacity-0"></div>
        
        {Array.from({ length: isMobile ? 5 : 15 }).map((_, i) => (
          <div 
            key={`h-grid-${i}`}
            className={`grid-line absolute left-0 right-0 h-px bg-primary/20 ${isMobile && i % 2 !== 0 ? 'hidden' : ''}`}
            style={{ top: `${(i + 1) * 100 / (isMobile ? 6 : 16)}%` }}
          ></div>
        ))}
        {Array.from({ length: isMobile ? 4 : 15 }).map((_, i) => (
          <div 
            key={`v-grid-${i}`}
            className={`grid-line absolute top-0 bottom-0 w-px bg-primary/20 ${isMobile && i % 2 !== 0 ? 'hidden' : ''}`}
            style={{ left: `${(i + 1) * 100 / (isMobile ? 5 : 16)}%` }}
          ></div>
        ))}

        {!isMobile && Array.from({ length: 8 }).map((_, i) => (
          <div
            key={`data-${i}`}
            className="data-stream absolute font-mono text-xs text-primary/40 whitespace-pre leading-tight"
            style={{ 
              left: `${10 + (i * 10)}%`,
              width: '40px',
              textAlign: 'center',
              opacity: 0
            }}
          >
            {Array.from({ length: 20 }).map((_, j) =>
              ((i + j) % 2 === 0) ? '1 ' : '0 '
            ).join('')}
          </div>
        ))}

        {Array.from({ length: isMobile ? (isHighPerformanceDevice ? 10 : 5) : 40 }).map((_, i) => {
          const top = `${(i * 2.5) % 100}%`;
          const left = `${(i * 3.25) % 100}%`;
          const hue = 200 + ((i * 7) % 60);
          
          return (
            <div
              key={`particle-${i}`}
              className="bg-particle absolute rounded-full"
              style={{
                width: `${1 + (i % 3)}px`,
                height: `${1 + (i % 3)}px`,
                background: `hsl(${hue}, 100%, 70%)`,
                boxShadow: isMobile ? 'none' : `0 0 ${3 + (i % 5)}px hsl(${hue}, 100%, 70%)`,
                top: top,
                left: left,
                opacity: 0
              }}
            ></div>
          );
        })}

        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/30 to-background/90"></div>
        
        {isHighPerformanceDevice && !isMobile && (
          <div className="absolute inset-0 scan-line-container overflow-hidden pointer-events-none">
            <div className="scan-line w-full h-[2px] bg-primary/10 absolute opacity-30 animate-scan-line"></div>
          </div>
        )}
      </div>

      <div className="container relative z-10 mx-auto px-4 sm:px-6">
        <div className="relative mb-10 md:mb-16">
          <motion.div
            className="w-full max-w-[600px] mx-auto text-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: hasEntered ? 1 : 0, y: hasEntered ? 0 : -20 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="mb-5 text-center font-mono text-3xl font-bold uppercase tracking-widest text-primary md:mb-12">
              // Projects_<span className="animate-blink ml-1 inline-block w-[6px] h-5 bg-primary align-middle"></span>
            </h2>
            
            <div className="mt-3 max-w-lg mx-auto">
              <p className="text-gray-400 text-sm md:text-base">
                <span className="text-primary font-mono">&lt;</span> 
                A selection of my recent work in web development and software engineering 
                <span className="text-primary font-mono">/&gt;</span>
              </p>
              
              <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent mx-auto mt-4"></div>
            </div>
          </motion.div>
        </div>

        <div 
          ref={gridRef} 
          className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:gap-12"
        >
          {projects.map((project, index) => (
            <div
              key={project.id}
              className="project-card group relative"
              onMouseEnter={() => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(null)}
            >
              <div className="card-content relative flex flex-col h-full overflow-hidden rounded-lg border border-primary/20 bg-black/30 backdrop-blur-lg transition-all duration-300 hover:border-primary/50 hover:shadow-[0_0_15px_rgba(0,200,255,0.3)]">
                <div className="relative h-48 w-full overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
                    <Code size={60} className="text-primary/20" />
                  </div>
                  
                  <div className="relative h-full w-full">
                    <div className="absolute inset-0 z-10 bg-gradient-to-t from-black via-black/80 to-transparent opacity-70 pointer-events-none"></div>
                    <div className="absolute inset-0 z-10 bg-gradient-to-br from-primary/20 to-transparent opacity-30 group-hover:opacity-50 transition-opacity duration-500 pointer-events-none"></div>
                    
                    <div 
                      className="absolute inset-0 bg-cover bg-center transform scale-105 group-hover:scale-110 transition-transform duration-700 ease-out"
                      style={{ backgroundImage: `url(${project.image})` }}
                    />
                  </div>
                  
                  <div className="absolute top-3 right-3 z-20 flex flex-col gap-2 items-end">
                    {project.status.map((badge) => (
                      <div key={badge} className={`px-2 py-1 rounded text-xs font-mono flex items-center border ${getStatusColor(badge)} hover:scale-105 transition-transform`}>
                        {renderStatusIcon(badge)}
                        <span>{getStatusLabel(badge)}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="absolute bottom-[-8px] left-0 right-0 z-20 p-4">
                    <p className="text-xs font-mono text-cyan-400 mb-1 opacity-80">{project.type}</p>
                    <h3 className="text-xl md:text-2xl font-bold font-mono text-white group-hover:text-cyan-300 transition-colors drop-shadow-md">
                      {project.title}
                      {activeIndex === index && (
                        <>
                          <span className="absolute top-0 left-0 w-full h-full -ml-0.5 text-red-500 opacity-50 blur-[0.5px] pointer-events-none z-[-1]">
                            {project.title}
                          </span>
                          <span className="absolute top-0 left-0 w-full h-full ml-0.5 text-blue-500 opacity-50 blur-[0.5px] pointer-events-none z-[-1]">
                            {project.title}
                          </span>
                        </>
                      )}
                    </h3>
                  </div>
                </div>
                
                <div className="flex flex-grow flex-col p-4 md:p-6 bg-black/40">
                  <p className="mb-5 text-sm text-gray-300/90 leading-relaxed">
                    {project.description}
                  </p>

                  <div className="mb-5 flex flex-wrap gap-1.5 md:gap-2">
                    {project.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="cyber-tag rounded-sm px-1.5 py-0.5 md:px-2 md:py-1 font-mono text-[10px] md:text-xs font-medium bg-primary/10 text-primary/90 border border-primary/30 group-hover:border-cyan-500/40 group-hover:bg-cyan-500/10 group-hover:text-cyan-400/90 transition-all duration-300"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className="mt-auto pt-4 border-t border-gray-800/50 flex justify-between items-center">
                    <div className="text-xs font-mono text-gray-500">{project.id}.project</div>
                    
                    <div className="flex items-center space-x-3">
                      {project.link && !project.status.includes("private") && (
                        <a
                          href={project.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`${project.title} GitHub Repository`}
                          className="flex items-center text-gray-400 hover:text-primary transition-colors group-hover:text-primary px-2 py-1 rounded-sm bg-gray-900/40 hover:bg-gray-900/80"
                        >
                          <Github size={16} className="mr-1.5" />
                          <span className="text-xs font-mono">Repo</span>
                        </a>
                      )}
                      
                      {project.live && (
                        <a
                          href={project.live}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`${project.title} Live Demo`}
                          className="flex items-center text-gray-400 hover:text-cyan-400 transition-colors group-hover:text-cyan-400 px-2 py-1 rounded-sm bg-gray-900/40 hover:bg-gray-900/80"
                        >
                          <ExternalLink size={16} className="mr-1.5" />
                          <span className="text-xs font-mono">Live</span>
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                <div className="absolute bottom-0 left-0 w-24 h-3 bg-background pointer-events-none" style={{ clipPath: 'polygon(0 0, 100% 0, 80% 100%, 0% 100%)' }}></div>
                <div className="absolute bottom-0 right-0 w-24 h-3 bg-background pointer-events-none" style={{ clipPath: 'polygon(20% 0, 100% 0, 100% 100%, 0% 100%)' }}></div>
                
                <div className="absolute inset-0 border-2 border-transparent opacity-0 group-hover:opacity-100 transition-all duration-700 rounded-lg pointer-events-none" 
                     style={{ 
                       background: 'linear-gradient(145deg, transparent, transparent, transparent, rgba(0, 153, 255, 0.3))',
                     }}>
                </div>
                
                <div className="absolute h-20 w-[1px] bg-primary/20 top-0 left-[30%] opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none"></div>
                <div className="absolute h-[1px] w-16 bg-primary/20 top-20 left-[30%] opacity-0 group-hover:opacity-100 transition-all duration-500 delay-100 pointer-events-none"></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx global>{`
        @keyframes scan-line {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100vh); }
        }
        
        .animate-scan-line {
          animation: scan-line 8s linear infinite;
        }
        
        .animate-blink {
          animation: blink 1s step-end infinite;
        }
        
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }

        .bg-grid-pattern {
          background-image: 
            linear-gradient(to right, rgba(0, 153, 255, 0.1) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0, 153, 255, 0.1) 1px, transparent 1px);
          background-size: 20px 20px;
        }
        
        @media (max-width: 640px) {
          .bg-grid-pattern {
            background-size: 15px 15px;
          }
        }
      `}</style>
    </section>
  );
};

export default Projects;
