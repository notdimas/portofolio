"use client";

import { useEffect, useRef, useState } from "react";
import Navbar from "@/components/navbar";
import Hero from "@/components/hero";
import About from "@/components/about";
import Skills from "@/components/skills";
import Projects from "@/components/projects";
import Contact from "@/components/contact";
import Loader from "@/components/loader";
import Lenis from "lenis";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

export default function Home() {
  const lenisRef = useRef<Lenis | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [animationsInitialized, setAnimationsInitialized] = useState(false);

  const lenisOptions = {
    duration: 1.5,
    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: "vertical" as const,
    gestureOrientation: "vertical" as const,
    smoothWheel: true,
    wheelMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
    infinite: false,
  };

  useEffect(() => {
    // Initialize Lenis smooth scrolling
    const lenis = new Lenis(lenisOptions);
    lenisRef.current = lenis;

    // Update ScrollTrigger when lenis updates
    lenis.on('scroll', ScrollTrigger.update);

    // Use gsap ticker to call raf
    const rafCallback = (time: number) => {
      lenis.raf(time);
      requestAnimationFrame(rafCallback);
    };
    requestAnimationFrame(rafCallback);

    // Cleanup function to kill all GSAP animations on component unmount
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill(true));
      gsap.globalTimeline.clear();
      if (lenisRef.current) {
        lenisRef.current.destroy();
      }
    };
  }, []);

  useEffect(() => {
    // Prevent animations from being initialized multiple times (React strict mode)
    if (animationsInitialized) return;

    const sections = document.querySelectorAll("section");
    const heroSection = document.getElementById("hero");
    const skillsSection = document.getElementById("skills");
    const projectsSection = document.getElementById("projects");
    const contactSection = document.getElementById("contact");
    const aboutSection = document.getElementById("about");

    // If elements don't exist yet, exit early
    if (!heroSection || !aboutSection || !skillsSection || !projectsSection || !contactSection) {
      return;
    }

    // Mark animations as initialized
    setAnimationsInitialized(true);

    const ctx = gsap.context(() => {
      // Ensure Hero section starts hidden before any animations evaluate
      // (Framer Motion in Hero component will animate it in)
      if (heroSection) {
        gsap.set(heroSection, { opacity: 0 });
      }

      // Hero to About transition
      if (heroSection && aboutSection) {
        // Ensure About section starts hidden before the timeline evaluation
        gsap.set(aboutSection, { opacity: 0, y: 80, scale: 0.95 });

        // Create a smooth transition effect
        const heroAboutTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: aboutSection,
            start: "top bottom", // Start animation when about section enters viewport
            end: "top center", // End animation when about section reaches center
            scrub: 1, // Smooth scrubbing effect
            pin: false, // Don't pin the hero section
            // markers: true, // For debugging
            onEnter: () => {
              // Optional - pause smooth scrolling during transition for precision
              if (lenisRef.current) {
                lenisRef.current.stop();
                setTimeout(() => {
                  if (lenisRef.current) {
                    lenisRef.current.start();
                  }
                }, 100);
              }
            }
          }
        });

        // Hero exit animation (opacity starts from 1 due to Hero component's own animation)
        heroAboutTimeline
          // Hero section fades out and moves up slightly
          .to(heroSection, { 
            opacity: 0, 
            y: -50, 
            scale: 0.95,
            duration: 0.6,
            ease: "power2.inOut" 
          }, 0)
          // Hero background effects fade out
          .to(heroSection.querySelectorAll(".grid-line, .terminal-flicker"), {
            opacity: 0,
            stagger: 0.03,
            duration: 0.3,
            ease: "power1.out"
          }, 0)
          // About section enters with a fade in and slight scale up (now using .to since we used gsap.set)
          .to(aboutSection, 
            { 
              opacity: 1, 
              y: 0, 
              scale: 1, 
              duration: 0.8,
              ease: "power2.out" 
            }, 
            0.2 // Slight delay after hero starts fading out
          )
          // Animate grid lines in about section for visual continuity
          .fromTo(aboutSection.querySelectorAll(".grid-line-h, .grid-line-v"),
            { opacity: 0, width: 0, height: 0 },
            { 
              opacity: 0.2, 
              width: "100%", 
              height: "100%", 
              stagger: 0.02,
              duration: 0.6,
              ease: "power2.inOut"
            },
            0.3 // Animate grid lines slightly after about section starts to appear
          );

        // Create a seamless background element transition using data-ref attributes
        const heroGridRef = heroSection.querySelector('[data-ref="gridRef"]');
        const aboutGridRef = aboutSection.querySelector('[data-ref="gridRef"]');
        
        if (heroGridRef && aboutGridRef) {
          heroAboutTimeline
            .fromTo(heroGridRef, 
              { opacity: 0.3 }, 
              { opacity: 0, duration: 0.4 }, 
              0
            )
            .fromTo(aboutGridRef, 
              { opacity: 0 }, 
              { opacity: 1, duration: 0.4 }, 
              0.2
            );
        }
      }

      // General fade-in for other sections (except hero and about which have custom transition)
      sections.forEach((section) => {
        const sectionId = section.getAttribute('id');
        if (sectionId !== 'hero' && sectionId !== 'about') {
          gsap.fromTo(
            section,
            { opacity: 0, y: 100 },
            {
              opacity: 1,
              y: 0,
              duration: 1,
              ease: "power2.out",
              scrollTrigger: {
                trigger: section,
                start: "top 80%", // Start animation when 80% of the section is visible
                once: true, // Animate only once
              }
            }
          );
        }
      });

      // Pin the skills section
      if (skillsSection) {
        ScrollTrigger.create({
          trigger: skillsSection,
          start: "top top",
          pin: true,
          pinSpacing: false, // Prevents adding extra space
          end: "+=200%", // Pin duration (scroll 2 viewport heights)
          scrub: 1,
          // Optional: Add markers for debugging
          // markers: {startColor: "green", endColor: "red", fontSize: "12px"}
        });
      }

      // Smooth transition between About and Skills
      if (aboutSection && skillsSection) {
        gsap.timeline({
          scrollTrigger: {
            trigger: skillsSection,
            start: "top 80%", // Start transition slightly before Skills section reaches top
            end: "top top", // End transition when Skills section hits top
            scrub: true,
            // markers: {startColor: "orange", endColor: "purple", fontSize: "12px"}
          }
        })
        .to(aboutSection, { opacity: 0, scale: 0.95, y: -50, duration: 0.5 }, 0)
        .fromTo(skillsSection, { opacity: 0, scale: 0.95, y: 50 }, { opacity: 1, scale: 1, y: 0, duration: 0.5 }, 0);
      }

      // Smooth transition between Skills and Projects
      if (skillsSection && projectsSection) {
        gsap.timeline({
          scrollTrigger: {
            trigger: projectsSection,
            start: "top 80%", 
            end: "top top",
            scrub: true,
          }
        })
        .to(skillsSection, { opacity: 0, scale: 0.95, y: -50, duration: 0.5 }, 0)
        .fromTo(projectsSection, { opacity: 0, scale: 0.95, y: 50 }, { opacity: 1, scale: 1, y: 0, duration: 0.5 }, 0);
      }

      // Smooth transition between Projects and Contact (update existing transition)
      if (projectsSection && contactSection) {
        gsap.timeline({
          scrollTrigger: {
            trigger: contactSection,
            start: "top bottom",
            end: "top 70%",
            scrub: true,
          }
        })
        .to(projectsSection, { opacity: 0, scale: 0.95, y: -50, duration: 0.5 }, 0)
        .fromTo(contactSection, { opacity: 0, scale: 0.95, y: 50 }, { opacity: 1, scale: 1, y: 0, duration: 0.5 }, 0);
      }
    });

    return () => {
      ctx.revert(); // Cleanup GSAP context
    };
  }, [animationsInitialized]);

  return (
    <div className="relative bg-background text-foreground min-h-screen">
      <Navbar />
      <Loader>
        <div 
          ref={scrollContainerRef}
          className="relative overflow-hidden"
        >
          <Hero />
          <About />
          <Skills /> 
          <Projects />
          <Contact />
        </div>
      </Loader>
      
      {/* Terminal-like decorative element */}
      <div className="fixed right-6 bottom-6 z-10 hidden md:block">
        <div className="bg-secondary/80 backdrop-blur-sm border border-border rounded-lg p-3 font-mono text-xs">
          <div className="flex items-center text-muted-foreground">
            <span className="mr-2">$</span>
            <span className="typing-text">scroll --smooth</span>
          </div>
        </div>
      </div>
    </div>
  );
}
