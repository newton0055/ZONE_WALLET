import React from 'react'
import { HeaderLogo } from './header-logo'

export const Header  = () => {
  return (
    <header
    className='bg-gradient-to-b from-purple-700 to-purple-500 px-4 py-8 lg:px-14 pb-36'>
        <div className='max-w-screen-2xl mx-auto'>
            <div className='w-full flex items-center justifiy-between mb-14'>
                <div className='flex items-center lg:gap-x-16'>
                    <HeaderLogo />
                </div>

            </div>

        </div>
    </header>
  )
}
