import React from 'react'
import { FeedPosts } from './feedPosts'

export const Feed = ({usuario}) => {
  return (
    <>
    <main className='hidden lg:flex lg:flex-col p-10 overflow-y-auto h-screen'>
        <FeedPosts usuario={usuario} />
    </main>
    <main className='flex flex-col overflow-y-auto h-screen lg:hidden'>
        <FeedPosts usuario={usuario} />
    </main>
    </>
  )
}