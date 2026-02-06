import { useState, useRef, useEffect } from 'react'
import './Valentine.css'

function Valentine() {
  const [noClicks, setNoClicks] = useState(0)
  const [currentStage, setCurrentStage] = useState('initial') // initial, yesVideo, gift, final
  const [isGiftOpen, setIsGiftOpen] = useState(false)

  const initialVideoRef = useRef(null)
  const yesVideoRef = useRef(null)
  const finalVideoRef = useRef(null)

  useEffect(() => {
    const startVideo = () => {
      console.log("Attempting to start video...")
      if (initialVideoRef.current) {
        console.log("Video element found:", initialVideoRef.current)
        initialVideoRef.current.play().then(() => {
          console.log("Video started successfully")
        }).catch(e => {
          console.log("Auto-play prevented, trying muted first:", e)
          // Try muted first, then unmute
          if (initialVideoRef.current) {
            initialVideoRef.current.muted = true
            initialVideoRef.current.play().then(() => {
              console.log("Video started muted successfully")
              // Once playing, try to unmute
              setTimeout(() => {
                if (initialVideoRef.current) {
                  initialVideoRef.current.muted = false
                  console.log("Video unmuted")
                }
              }, 100)
            }).catch(e => console.log("Even muted autoplay failed:", e))
          }
        })
      } else {
        console.log("Video element not found")
      }
    }

    // Try immediate play
    startVideo()

    // Also try on first user interaction
    const handleInteraction = () => {
      startVideo()
      document.removeEventListener('click', handleInteraction)
      document.removeEventListener('touchstart', handleInteraction)
    }

    document.addEventListener('click', handleInteraction)
    document.addEventListener('touchstart', handleInteraction)

    return () => {
      document.removeEventListener('click', handleInteraction)
      document.removeEventListener('touchstart', handleInteraction)
    }
  }, [])

  const handleYesClick = () => {
    if (currentStage === 'initial') {
      setCurrentStage('yesVideo')
      setTimeout(() => {
        if (yesVideoRef.current) {
          console.log("Attempting to play yes video...")
          yesVideoRef.current.play().then(() => {
            console.log("Yes video started successfully")
          }).catch(e => console.log("Yes video play error:", e))
        } else {
          console.log("Yes video element not found")
        }
      }, 100)
    }
  }

  const handleNoClick = () => {
    setNoClicks(noClicks + 1)
  }

  const handleYesVideoEnd = () => {
    setCurrentStage('gift')
  }

  const handleGiftBoxClick = () => {
    setIsGiftOpen(true)
    setTimeout(() => {
      setCurrentStage('final')
      if (finalVideoRef.current) {
        console.log("Attempting to play final video...")
        finalVideoRef.current.play().then(() => {
          console.log("Final video started successfully")
        }).catch(e => console.log("Final video play error:", e))
      } else {
        console.log("Final video element not found")
      }
    }, 1000)
  }

  const getYesButtonSize = () => {
    const baseSize = 16
    const increment = noClicks * 12
    return Math.min(baseSize + increment, 120)
  }

  const getNoButtonSize = () => {
    const baseSize = 16
    const decrement = noClicks * 1
    return Math.max(baseSize - decrement, 10)
  }

  return (
    <div className="valentine-container">
      {currentStage === 'initial' && (
        <div className="stage-container">
          <div className="video-section">
            <video
              ref={initialVideoRef}
              autoPlay
              loop
              muted
              controls
              className="stage-video"
            >
              <source src="/lurainvalentine/Be my valentine.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>

          <div className="content-section">
            <div className="message">
              <h1>Would you be my Valentine Lurii?</h1>
              <p>I wish I could see you in person or get you something, but you don't want to give me your address.</p>
              <p>So I'm going to have to ask you like this.</p>
              <h2>Lurain Naledi Moshane would you be my valentine?</h2>
            </div>

            <div className="buttons-container">
              <button
                onClick={() => {
                  if (initialVideoRef.current) {
                    initialVideoRef.current.play().catch(e => console.log("Manual play error:", e))
                  }
                  handleYesClick()
                }}
                className="yes-button"
                style={{ fontSize: `${getYesButtonSize()}px` }}
              >
                Yes
              </button>
              <button
                onClick={() => {
                  if (initialVideoRef.current) {
                    initialVideoRef.current.play().catch(e => console.log("Manual play error:", e))
                  }
                  handleNoClick()
                }}
                className="no-button"
                style={{ fontSize: `${getNoButtonSize()}px` }}
              >
                No
              </button>
            </div>

            <div className="play-hint">
              <p> If video doesn't start, click anywhere or press Yes/No buttons</p>
            </div>
          </div>
        </div>
      )}

      {currentStage === 'yesVideo' && (
        <div className="stage-container">
          <div className="video-section">
            <video
              ref={yesVideoRef}
              autoPlay
              muted
              controls
              onEnded={handleYesVideoEnd}
              className="stage-video"
            >
              <source src="/lurainvalentine/My valentine.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>

          <div className="content-section">
            <div className="message">
              <h1>Thank you for saying yes! 💕</h1>
              <p>Enjoy this special video I made for you...</p>
            </div>
          </div>
        </div>
      )}

      {currentStage === 'gift' && (
        <div className="stage-container">
          <div className="video-section">
            <div className="gift-container">
              <div className="gift-message">
                <h2>This is the last surprise</h2>
                <p>Click the gift box to open it 💝</p>
              </div>
              <div
                className={`gift-box ${isGiftOpen ? 'open' : ''}`}
                onClick={handleGiftBoxClick}
              >
                <div className="gift-lid"></div>
                <div className="gift-body">
                  <div className="gift-content">
                    {isGiftOpen && <span className="heart">❤️</span>}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="content-section">
            <div className="message">
              <h1>One more surprise for you!</h1>
              <p>I wanted to make this Valentine's Day extra special...</p>
            </div>
          </div>
        </div>
      )}

      {currentStage === 'final' && (
        <div className="stage-container">
          <div className="video-section">
            <video
              ref={finalVideoRef}
              autoPlay
              muted
              controls
              className="stage-video"
            >
              <source src="/lurainvalentine/Miguel - Adorn (Lyrics).mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>

          <div className="content-section">
            <div className="message">
              <h1>This is the song I thought of when I wanted you to be my valentine</h1>
              <p>Every time I hear this, I think of you... 💕</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Valentine
