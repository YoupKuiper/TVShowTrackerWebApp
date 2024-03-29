/* This example requires Tailwind CSS v2.0+ */
import { Fragment, useState } from 'react'
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { MenuIcon, XIcon } from '@heroicons/react/outline'
import { PAGE_NAME_SEARCH, PAGE_NAME_TRACKED_TV_SHOWS } from '../../constants';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
import logo from '../../Img/logo.png'

interface NavBarProps {
  isLoggedIn: boolean;
  currentPage: string;
  darkMode: boolean;
  emailAddress: string;
  wantsNotifications: boolean;
  setWantsNotifications: (newSetting: boolean) => Promise<void>;
  setShowLoginModal: (params: boolean) => void;
  setShowCreateAccountModal: (params: boolean) => void;
  logout: () => void;
  setDarkMode: (params: boolean) => void;
  setCurrentPage: (newPage: string) => void;
}

const classNames = (...classes: any) => {
  return classes.filter(Boolean).join(' ')
}


export const NavBar = ({ currentPage, darkMode, isLoggedIn, emailAddress, wantsNotifications, setWantsNotifications, setShowLoginModal, setShowCreateAccountModal, logout, setDarkMode, setCurrentPage }: NavBarProps) => {

  const [showSpinner, setShowSpinner] = useState(false);
  const navigation = [
    { name: PAGE_NAME_SEARCH, onClick: () => setCurrentPage(PAGE_NAME_SEARCH), current: currentPage === PAGE_NAME_SEARCH },
    { name: PAGE_NAME_TRACKED_TV_SHOWS, onClick: () => setCurrentPage(PAGE_NAME_TRACKED_TV_SHOWS), current: currentPage === PAGE_NAME_TRACKED_TV_SHOWS },
  ]

  const handleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setShowSpinner(true)
    await setWantsNotifications(!wantsNotifications)
    setShowSpinner(false)
  }

  return (
    <Disclosure as="nav" className="bg-gray-800">
      {({ open }) => (
        <>
          <div className="container mx-auto">
            <div className="relative flex items-center justify-between h-16">
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                {/* Mobile menu button*/}
                <Disclosure.Button className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <MenuIcon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
              <div className="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start">
                <div className="flex-shrink-0 flex items-center">
                  <img
                    className="block lg:hidden h-10 w-auto"
                    src={logo}
                    alt="Workflow"
                  />
                  <img
                    className="hidden lg:block h-8 w-auto"
                    src={logo}
                    alt="Workflow"
                  />
                </div>
                <div className="hidden sm:block sm:ml-6">
                  <div className="flex space-x-4">
                    {navigation.map((item) => (
                      <button
                        key={item.name}
                        onClick={() => item.onClick()}
                        className={classNames(
                          item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                          'px-3 py-2 rounded-md text-sm font-medium tst-navButton'
                        )}
                        aria-current={item.current ? 'page' : undefined}
                      >
                        {item.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">

                <button onClick={() => setDarkMode(!darkMode)} data-tooltip-target="default-button-example-toggle-dark-mode-tooltip" type="button" data-toggle-dark="light" className="flex items-center p-2 mr-2 text-xs font-medium text-gray-700 bg-white rounded-lg border border-gray-200 toggle-dark-state hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-500 dark:bg-gray-800 focus:outline-none dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">
                  <svg aria-hidden="true" data-toggle-icon={darkMode ? 'moon' : 'sun'} className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    {darkMode ? <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" fillRule="evenodd" clipRule="evenodd" /> :
                      <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />}
                  </svg>
                  <span className="sr-only">Toggle dark/light mode</span>
                </button>

                <Menu as="div" className="ml-3 relative">
                  <div>
                    <Menu.Button className="tst-userButton bg-gray-800 text-slate-50 flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
                      <span className="sr-only">Open user menu</span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
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
                    <Menu.Items className="dark:bg-gray-700 origin-top-right absolute z-50 right-0 mt-2 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                      {!isLoggedIn && <Menu.Item>
                        {({ active }) => (
                          <a
                            href="/#"
                            className={classNames(active ? 'bg-gray-100 dark:bg-gray-500' : '', 'block px-4 py-2 text-sm dark:text-white text-gray-700')}
                            onClick={() => { setShowLoginModal(true) }}
                          >
                            Login
                          </a>
                        )}
                      </Menu.Item>}
                      {!isLoggedIn && <Menu.Item>
                        {({ active }) => (
                          <a
                            href="/#"
                            className={classNames(active ? 'bg-gray-100 dark:bg-gray-500' : '', 'tst-create-account block px-4 py-2 text-sm dark:text-white text-gray-700')}
                            onClick={() => { setShowCreateAccountModal(true) }}
                          >
                            Create account
                          </a>
                        )}
                      </Menu.Item>}
                      {isLoggedIn && <Menu.Item>
                        {({ active }) => (
                          <p
                            className={classNames('tst-logged-in bg-slate-200 dark:bg-slate-900 italic block px-4 dark:text-white py-2 text-sm text-gray-700')}
                          >
                            {emailAddress}
                          </p>
                        )}
                      </Menu.Item>}
                      {isLoggedIn &&
                        <label htmlFor="small-toggle" className="inline-flex px-4 dark:text-white py-2 text-sm text-gray-700 relative items-center cursor-pointer">
                          {showSpinner ? <LoadingSpinner size={5} /> : <div><input type="checkbox" id="small-toggle" className="sr-only peer" checked={wantsNotifications} onChange={handleChange} />
                            <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-400 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[10px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all after:mx-4 dark:border-gray-600 peer-checked:bg-blue-600"></div>
                          </div>}
                          <span className="ml-3 text-sm text-gray-900 dark:text-white">Notifications</span>
                        </label>
                      }
                      {isLoggedIn && <Menu.Item>
                        {({ active }) => (
                          <a
                            href="/#"
                            className={classNames(active ? 'bg-gray-100 dark:bg-gray-500' : '', 'tst-sign-out-button block px-4 dark:text-white py-2 text-sm text-gray-700')}
                            onClick={logout}
                          >
                            Sign out
                          </a>
                        )}
                      </Menu.Item>}
                    </Menu.Items>
                  </Transition>
                </Menu>
              </div>
            </div>
          </div>

          <Disclosure.Panel className="sm:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigation.map((item) => (
                <Disclosure.Button
                  key={item.name}
                  as="a"
                  onClick={item.onClick}
                  className={classNames(
                    item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                    'block px-3 py-2 rounded-md text-base font-medium'
                  )}
                  aria-current={item.current ? 'page' : undefined}
                >
                  {item.name}
                </Disclosure.Button>
              ))}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  )
}
