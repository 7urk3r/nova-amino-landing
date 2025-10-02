import { Fragment } from 'react'
import { Menu, Transition } from '@headlessui/react'

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

const Icon = {
  Edit: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5" aria-hidden="true" {...props}>
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
    </svg>
  ),
  Copy: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5" aria-hidden="true" {...props}>
      <rect x="9" y="9" width="13" height="13" rx="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  ),
  Archive: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5" aria-hidden="true" {...props}>
      <rect x="3" y="3" width="18" height="4" rx="1" />
      <path d="M5 7v13a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7" />
      <path d="M10 12h4" />
    </svg>
  ),
  Trash: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5" aria-hidden="true" {...props}>
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      <path d="M10 11v6M14 11v6" />
      <path d="M10 6V4a2 2 0 0 1 2-2h0a2 2 0 0 1 2 2v2" />
    </svg>
  )
}

export default function ActionMenu() {
  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button aria-label="Options menu" className="px-3 py-2 rounded-full bg-white/10 text-slate-100 hover:bg-white/20 ring-1 ring-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40 transition">
          Options ▾
        </Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="mt-2 w-56 origin-top-right rounded-2xl bg-white/90 text-slate-900 backdrop-blur-xl shadow-xl ring-1 ring-white/15 divide-y divide-white/10 focus:outline-none p-1 shadow-[0_0_60px_rgba(255,255,255,.08)]">
          <div className="py-1">
            <Menu.Item>
              {({ active }) => (
                <a href="#" className={classNames(
                  'px-3 py-2 rounded-xl flex items-center gap-3',
                  active ? 'bg-white/10' : ''
                )}>
                  <Icon.Edit /> Edit
                </a>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <a href="#" className={classNames(
                  'px-3 py-2 rounded-xl flex items-center gap-3',
                  active ? 'bg-white/10' : ''
                )}>
                  <Icon.Copy /> Duplicate
                </a>
              )}
            </Menu.Item>
          </div>
          <div className="py-1">
            <Menu.Item>
              {({ active }) => (
                <a href="#" className={classNames(
                  'px-3 py-2 rounded-xl flex items-center gap-3',
                  active ? 'bg-white/10' : ''
                )}>
                  <Icon.Archive /> Archive
                </a>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <a href="#" className={classNames(
                  'px-3 py-2 rounded-xl flex items-center gap-3 text-red-200',
                  active ? 'bg-white/10' : ''
                )}>
                  <Icon.Trash /> Delete
                </a>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  )
}

