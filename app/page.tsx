import PDFUpload from '@/components/chat/pdf-upload'
import RagChatBot from '@/components/chat/rag-chat-bot'
import { ModeToggle } from '@/components/mode-toggle'
import React from 'react'

const Home = () => {
  return (
    <div className='my-20 '>
								<ModeToggle />

      <RagChatBot/>
      <PDFUpload/>
      </div>
  )
}

export default Home