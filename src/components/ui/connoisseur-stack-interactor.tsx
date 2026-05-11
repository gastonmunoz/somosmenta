"use client"

import { cn } from "@/lib/utils"
import { useEffect, useRef, useState, useLayoutEffect } from "react"
import gsap from "gsap"

interface MenuItem {
  num: string
  name: string
  clipId: string
  image: string
}

export const ConnoisseurStackInteractor = ({
  items,
  className,
}: {
  items: MenuItem[]
  className?: string
}) => {
  const [activeIndex, setActiveIndex] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<SVGImageElement>(null)
  const mainGroupRef = useRef<SVGGElement>(null)
  const masterTl = useRef<gsap.core.Timeline | null>(null)

  const createLoop = (index: number) => {
    const item = items[index]
    const selector = `#${item.clipId} .path`

    if (masterTl.current) masterTl.current.kill()

    if (imageRef.current) imageRef.current.setAttribute("href", item.image)
    if (mainGroupRef.current)
      mainGroupRef.current.setAttribute("clip-path", `url(#${item.clipId})`)

    gsap.set(selector, { scale: 0, transformOrigin: "50% 50%" })

    const tl = gsap.timeline({ repeat: -1, repeatDelay: 1 })

    tl.to(selector, {
      scale: 1,
      duration: 0.8,
      stagger: { amount: 0.4, from: "random" },
      ease: "expo.out",
    })
      .to(selector, {
        scale: 1.05,
        duration: 1.5,
        yoyo: true,
        repeat: 1,
        ease: "sine.inOut",
        stagger: { amount: 0.2, from: "center" },
      })
      .to(selector, {
        scale: 0,
        duration: 0.6,
        stagger: { amount: 0.3, from: "edges" },
        ease: "expo.in",
      })

    masterTl.current = tl
  }

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      createLoop(0)
    }, containerRef)
    return () => ctx.revert()
  }, [])

  const handleItemHover = (index: number) => {
    if (index === activeIndex) return
    setActiveIndex(index)
    createLoop(index)
  }

  return (
    <div
      ref={containerRef}
      className={cn(
        "flex flex-col md:flex-row items-center justify-between w-full overflow-hidden",
        className
      )}
    >
      {/* LEFT: menu */}
      <div className="z-20 w-full md:w-1/2">
        <nav>
          <ul className="flex flex-col gap-6 md:gap-10 lg:gap-14">
            {items.map((item, index) => (
              <li
                key={item.num}
                onMouseEnter={() => handleItemHover(index)}
                onClick={() => handleItemHover(index)}
                className="group cursor-pointer"
              >
                <div className="flex items-start gap-4 md:gap-6">
                  <span
                    className="text-lg md:text-2xl font-bold transition-all duration-500 mt-1 md:mt-2 tabular-nums"
                    style={{
                      color:
                        activeIndex === index ? "var(--sage)" : "#3a3a3a",
                      transform:
                        activeIndex === index ? "scale(1.1)" : "scale(1)",
                      display: "inline-block",
                    }}
                  >
                    {item.num}
                  </span>

                  <h2
                    className="text-[clamp(1.8rem,6vw,3.75rem)] md:text-5xl lg:text-6xl uppercase leading-[0.85] transition-all duration-700"
                    style={{
                      fontFamily: "var(--font-playfair)",
                      fontWeight: 900,
                      letterSpacing: "-1px",
                      color: activeIndex === index ? "#ffffff" : "transparent",
                      WebkitTextStroke:
                        activeIndex === index ? "0px" : "1.5px #3a3a3a",
                      opacity: activeIndex === index ? 1 : 0.6,
                      transform:
                        activeIndex === index
                          ? "translateX(16px)"
                          : "translateX(0px)",
                    }}
                  >
                    {item.name.split(" ")[0]}
                    <br />
                    {item.name.split(" ").slice(1).join(" ")}
                  </h2>
                </div>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* RIGHT: SVG clip animation — hidden on mobile */}
      <div className="hidden md:flex relative w-full md:w-1/2 justify-center items-center mt-16 md:mt-0">
        <div
          className="absolute w-[120%] h-[120%] blur-[120px] rounded-full"
          style={{ background: "rgba(93,138,107,0.08)" }}
        />

        <svg
          viewBox="0 0 500 500"
          className="w-full max-w-[420px] h-auto z-10"
          style={{ filter: "drop-shadow(0 0 60px rgba(0,0,0,0.8))" }}
        >
          <defs>
            <clipPath id="clip-original">
              <path className="path" d="M480.6,235H19.4c-6,0-10.8-4.9-10.8-10.8v-9.5c0-6,4.9-10.8,10.8-10.8h461.1c6,0,10.8,4.9,10.8,10.8v9.5C491.4,230.2,486.6,235,480.6,235z" />
              <path className="path" d="M483.1,362.4H16.9c-4.6,0-8.3-3.7-8.3-8.3v-1.8c0-4.6,3.7-8.3,8.3-8.3h466.1c4.6,0,8.3,3.7,8.3,8.3v1.8C491.4,358.7,487.7,362.4,483.1,362.4z" />
              <path className="path" d="M460.3,336.3H39.7c-17.2,0-31.1-13.9-31.1-31.1v-31.5c0-17.2,13.9-31.1,31.1-31.1h420.7c17.2,0,31.1,13.9,31.1,31.1v31.5C491.4,322.4,477.5,336.3,460.3,336.3z" />
              <path className="path" d="M459.2,196.2H40.8v-35c0-47.5,38.5-86,86-86h246.5c47.5,0,86,38.5,86,86V196.2z" />
              <path className="path" d="M441.9,424.9H58.1c-9.6,0-17.3-7.8-17.3-17.3v-37.4h418.5v37.4C459.2,417.1,451.5,424.9,441.9,424.9z" />
            </clipPath>

            <clipPath id="clip-hexagons">
              <rect className="path" x="20" y="20" width="200" height="280" rx="12" />
              <rect className="path" x="20" y="320" width="200" height="160" rx="12" />
              <rect className="path" x="240" y="20" width="240" height="140" rx="12" />
              <rect className="path" x="240" y="180" width="110" height="160" rx="12" />
              <rect className="path" x="370" y="180" width="110" height="160" rx="12" />
              <rect className="path" x="240" y="360" width="240" height="120" rx="12" />
            </clipPath>

            <clipPath id="clip-pixels">
              {Array.from({ length: 9 }).map((_, i) => (
                <rect
                  key={i}
                  className="path"
                  x={(i % 3) * 160 + 20}
                  y={Math.floor(i / 3) * 160 + 20}
                  width="140"
                  height="140"
                  rx="4"
                />
              ))}
            </clipPath>

            <clipPath id="clip-diagonals">
              <rect className="path" x="20" y="20" width="220" height="220" rx="4" />
              <rect className="path" x="260" y="20" width="220" height="220" rx="4" />
              <rect className="path" x="20" y="260" width="220" height="220" rx="4" />
              <rect className="path" x="260" y="260" width="220" height="220" rx="4" />
            </clipPath>
          </defs>

          <g ref={mainGroupRef} clipPath={`url(#${items[0].clipId})`}>
            <image
              ref={imageRef}
              href={items[0].image}
              width="500"
              height="500"
              preserveAspectRatio="xMidYMid slice"
            />
          </g>
        </svg>
      </div>
    </div>
  )
}
