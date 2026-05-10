'use client'

import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'

gsap.registerPlugin(useGSAP)

const DefaultItems: Item[] = [
  {
    imgUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&q=80',
    title: 'Servicios',
    href: '#servicios',
  },
  {
    imgUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&q=80',
    title: 'Nosotros',
    href: '#nosotros',
  },
  {
    imgUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=400&q=80',
    title: 'Proceso',
    href: '#proceso',
  },
  {
    imgUrl: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=400&q=80',
    title: 'Event Brief',
    href: '#brief',
  },
  {
    imgUrl: 'https://images.unsplash.com/photo-1423666639041-f56000c27a9a?w=400&q=80',
    title: 'Contacto',
    href: '#contacto',
  },
]

type Item = {
  imgUrl: string
  title: string
  href: string
}

interface Props {
  items?: Item[]
  onNavigate?: () => void
}

export default function ImageHover({ items = DefaultItems, onNavigate }: Props) {
  const sectionRef = useRef<HTMLElement>(null)
  const previewContainerRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      if (!sectionRef.current) return
      const previewContainer = previewContainerRef.current
      const menuLinkItems = sectionRef.current.querySelectorAll('.menu-link-item')

      let lastHoveredIndex: number | null = null

      const handleMouseOver = (index: number) => {
        if (index !== lastHoveredIndex) {
          const imgContainer = document.createElement('div')
          imgContainer.classList.add(
            'temp-image',
            'absolute',
            'rotate-[-30deg]',
            '-left-1/2',
            'top-[125%]'
          )
          const img = document.createElement('img')
          img.src = items[index].imgUrl
          img.alt = ''
          img.classList.add('w-full', 'h-full', 'object-cover')
          imgContainer.appendChild(img)
          previewContainer!.appendChild(imgContainer)

          gsap.to(imgContainer, {
            top: '0%',
            left: '0%',
            rotate: 0,
            duration: 1.25,
            ease: 'power3.out',
            onComplete: () => {
              gsap.delayedCall(2, () => {
                const allImgContainers =
                  previewContainer!.querySelectorAll('.temp-image')
                if (allImgContainers.length > 1) {
                  Array.from(allImgContainers)
                    .slice(0, -1)
                    .forEach((container) => {
                      setTimeout(() => container.remove(), 2000)
                    })
                }
              })
            },
          })

          lastHoveredIndex = index
        }
      }

      menuLinkItems.forEach((item, index) => {
        item.addEventListener('mouseover', () => handleMouseOver(index))
      })

      return () => {
        menuLinkItems.forEach((item, index) => {
          item.removeEventListener('mouseover', () => handleMouseOver(index))
        })
      }
    },
    { scope: sectionRef, dependencies: [sectionRef] }
  )

  return (
    <section
      ref={sectionRef}
      className="flex h-full w-full items-center justify-center overflow-hidden"
    >
      <div className="w-full max-w-5xl mx-auto px-8 md:px-16 flex items-center gap-8 md:gap-12 lg:gap-20">
        <div className="flex-1 min-w-0">
          <ul className="flex flex-col gap-4 md:gap-5 lg:gap-6 text-[clamp(1.75rem,4vw,3.5rem)] font-normal">
            {items.map(({ title, href }) => (
              <li key={title} className="menu-link-item">
                <a
                  href={href}
                  onClick={onNavigate}
                  className="block text-black/30 hover:text-black transition-colors duration-200 tracking-wide"
                  style={{ fontFamily: 'var(--font-playfair)' }}
                >
                  {title}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex items-center">
          <div
            ref={previewContainerRef}
            className="relative shrink-0 w-36 sm:w-44 md:w-52 lg:w-64 xl:w-80 aspect-[3/4] rotate-[15deg] overflow-hidden [clip-path:polygon(0_0,100%_0,100%_100%,0%_100%)]"
          />
        </div>
      </div>
    </section>
  )
}
