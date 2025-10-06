import { useEffect, useRef } from 'react'
import Phaser from 'phaser'
import GameScene from './GameScene'
import './App.css'

function App() {
  const gameRef = useRef<Phaser.Game | null>(null)

  useEffect(() => {
    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: 640,
      height: 480,
      parent: 'game-container',
      backgroundColor: '#000000',
      scene: [GameScene],
    }

    gameRef.current = new Phaser.Game(config)

    return () => {
      gameRef.current?.destroy(true)
    }
  }, [])

  return <div id="game-container" />
}

export default App
