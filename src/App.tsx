import { useEffect, useRef } from 'react'
import Phaser from 'phaser'
import GameScene from './GameScene'
import './App.css'

function App() {
  const gameRef = useRef<Phaser.Game | null>(null)

  useEffect(() => {
    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: 1440,
      height: 1056,
      parent: 'game-container',
      backgroundColor: '#000000',
      scene: [GameScene],
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 1440,
        height: 1056,
        parent: 'game-container',
        expandParent: false,
        max: {
          width: 1440,
          height: 1056
        }
      },
    }

    gameRef.current = new Phaser.Game(config)

    return () => {
      gameRef.current?.destroy(true)
    }
  }, [])

  return <div id="game-container" />
}

export default App
