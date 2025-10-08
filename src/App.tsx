import { useEffect, useRef } from 'react'
import Phaser from 'phaser'
import TitleScene from './scenes/TitleScene'
import GameScene from './scenes/GameScene'
import UIScene from './scenes/UIScene'
import GameOverScene from './scenes/GameOverScene'

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
      render: {
        pixelArt: true,
        antialias: false,
        roundPixels: true
      },
      scene: [TitleScene, GameScene, UIScene, GameOverScene],
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