import React from 'react'
import { Loader2 } from 'lucide-react'
import { UserButton, ClerkLoading, ClerkLoaded} from '@clerk/nextjs'

import { HeaderLogo } from './header-logo'
import { Navigation } from './navigation'
import { WelcomeMsg } from './welcome-msg'
import { Filters} from './filters'

export const Header  = () => {
  return (
    <header
    className='bg-gradient-to-b from-purple-700 to-purple-500 px-4 py-8 lg:px-14 pb-36'>
        <div className='max-w-screen-2xl mx-auto'>
            <div className='w-full flex items-center justify-between mb-14'>
                <div className='flex items-center lg:gap-x-16'>
                    <HeaderLogo />
                    <Navigation />
                </div>
            </div>
            <WelcomeMsg />
        </div>
    </header>
  )
}
