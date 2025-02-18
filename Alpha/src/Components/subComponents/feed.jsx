import React from 'react'
import { FeedPosts } from './feedPosts'

export const Feed = ({usuario}) => {
  return (
    <>
    <main className='flex flex-col w-full h-full overflow-y-auto h-screen'>
        <FeedPosts usuario={usuario} />
    </main>
    </>
  )
}