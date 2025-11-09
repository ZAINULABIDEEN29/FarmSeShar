import React from 'react'
import { Button } from './components/ui/button'

const App:React.FC = () => {

  const onClickHandler= ()=>{
      alert("Button Clicked");
  }
  return (
    <div className='flex items-center  justify-center h-screen '>
      <Button className='mx-auto' onClick={onClickHandler}>
        Shadcn Button
      </Button>
    </div>
  )
}

export default App
