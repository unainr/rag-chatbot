import PDFUpload from '@/components/chat/pdf-uplaod'
import RagChatBot from '@/components/chat/rag-chat-bot'
import React from 'react'

const Home = () => {
  return (
    <div className='my-20 '>
      <RagChatBot/>
      <PDFUpload/>
      </div>
  )
}

export default Home