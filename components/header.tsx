import { Button } from '@/components/ui/button'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

export default function Header() {
    return (
        <header className='bg-white max-h-[134px] flex w-full justify-between items-center max-w-7xl py-2.5 px-4 md:px-20'>
            <Image src={'/logo.png'} width={140} height={114} alt='' />
            <Link href={'#form'}>
                <Button className='h-[58px] w-[137px]'>Apply</Button>
            </Link>
        </header>
    )
}
