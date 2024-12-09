'use client'

import React, { useRef, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'

import { currentYear } from '@/lib/utils'

export const SlideMenu = () => {
  const [position, setPosition] = useState({
    left: 0,
    width: 0,
    opacity: 0
  })

  return (
    <ul
      onMouseLeave={() => {
        setPosition(pv => ({
          ...pv,
          opacity: 0
        }))
      }}
      className='relative mx-auto my-10 flex w-fit rounded-full border-2 border-black bg-white p-1'
    >
      <Tab setPosition={setPosition}>
        <Link href={`/`}>{`Teams`}</Link>
      </Tab>
      <Tab setPosition={setPosition}>
        <Link href={`/season/${currentYear}`}>{`Seasons`}</Link>
      </Tab>
      <Tab setPosition={setPosition}>
        <Link href='/legendary-team-rivals'>{`Legendary`}</Link>
      </Tab>

      <Cursor position={position} />
    </ul>
  )
}

const Tab = ({ children, setPosition }) => {
  const ref = useRef(null)

  return (
    <li
      ref={ref}
      onMouseEnter={() => {
        if (!ref?.current) return

        // @ts-expect-error
        const { width } = ref.current.getBoundingClientRect()

        setPosition({
          // @ts-expect-error
          left: ref.current.offsetLeft,
          width,
          opacity: 1
        })
      }}
      className='relative z-10 block cursor-pointer px-3 py-1.5 text-xs uppercase text-white mix-blend-difference md:px-5 md:py-3 md:text-base'
    >
      {children}
    </li>
  )
}

const Cursor = ({ position }) => {
  return (
    <motion.li
      animate={{
        ...position
      }}
      // @ts-expect-error
      className='absolute z-0 h-7 rounded-full bg-black md:h-12'
    />
  )
}
