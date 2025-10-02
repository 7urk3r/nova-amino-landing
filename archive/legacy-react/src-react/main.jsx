import React, { Fragment, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { Menu, Transition } from '@headlessui/react'
import '../styles/ev-menu.css'
import '../styles/tailwind.css'
import PeptideMarquee from '../components/PeptideMarqueeInline.tsx'

function Icon({ d }){
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={d} />
    </svg>
  )
}

function Dropdown({ label, items }){
  const [isOpen, setIsOpen] = useState(false)
  
  return (
    <Menu as="div" className="ev-menu">
      <div
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
      >
        <Menu.Button className="nav-pill__link ev-menu__button" aria-label={`${label} menu`}>
          {label}
        </Menu.Button>
        {isOpen && (
          <Transition as={Fragment}
            show={isOpen}
            enter="ev-transition-enter" enterFrom="ev-transition-enter-from" enterTo="ev-transition-enter-to"
            leave="ev-transition-leave" leaveFrom="ev-transition-leave-from" leaveTo="ev-transition-leave-to">
            <Menu.Items static className="ev-menu__items" style={{ marginTop: 12 }}>
              <div className="ev-menu__section">
                {items.map((it, idx) => (
                  <Menu.Item key={idx}>
                    {({ active }) => (
                      <a href={it.href} className={`ev-menu__item ${active ? 'is-active' : ''}`}>{it.label}</a>
                    )}
                  </Menu.Item>
                ))}
              </div>
            </Menu.Items>
          </Transition>
        )}
      </div>
    </Menu>
  )
}

function NavPill(){
  return (
    <div className="nav-pill nav-pill--sticky">
      <a href="/" className="nav-pill__link">Home</a>
      <Dropdown label="Catalog" items={[
        {label:'All Products', href:'/products'},
        {label:'New', href:'/products#new'},
        {label:'Popular', href:'/products#popular'},
      ]} />
      <a href="/faq" className="nav-pill__link">FAQ</a>
      <Dropdown label="Announcements" items={[
        {label:'Changelog', href:'/announcements#changelog'},
        {label:'Blog', href:'/announcements#blog'},
        {label:'Press', href:'/announcements#press'},
      ]} />
    </div>
  )
}

const navCenter = document.getElementById('nav-center-mount')
if (navCenter) createRoot(navCenter).render(<NavPill />)

const marqueeMount = document.getElementById('peptide-marquee-mount')
if (marqueeMount) createRoot(marqueeMount).render(<PeptideMarquee />)
