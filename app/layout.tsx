
import './globals.css'
import LightRays from './components/LightRays'
import Navbar from './components/navbar'
import { PHProvider } from './provider'


export default function RootLayout ({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
<html>
  <body>
<div

        >

         <Navbar/>
         
         <div className='absolute inset-0 top-0 z-[-1] min-h-screen'>
          <LightRays
            raysOrigin='top-center-offset'
            raysColor='#00ffff'
            raysSpeed={0.9}
            lightSpread={0.9}
            rayLength={1.9}
            followMouse={true}
            mouseInfluence={0.3}
            noiseAmount={0.1}
            distortion={0.03}

          />
          </div>

       
          <PHProvider>{children}</PHProvider>
  
       </div>
</body>
</html>
  )
}
