import { useEffect, useRef, useState, type ChangeEvent } from 'react'
import { getRandomNumber } from '../utils'
import { wordList } from '../wordsList'
import { CssSprite } from '../components/Sprite'

export default function Game() {
  const [text, setText] = useState("")
  const [userInput, setUserInput] = useState("")
  const [timer, setTimer] = useState(90)
  const [start, setStart] = useState(false)
  const [heroHealth, setHeroHealth] = useState(100)
  const [monsterHealth, setMonsterHealth] = useState(100)
  const [gameOver, setGameOver] = useState(false)


  const heroSpriteList = [
    "/hero/hero-idle.png",
    "/hero/hero-fight.png",
    "/hero/hero-hurt.png",
    "/hero/hero-death.png",
  ]

  const monsterSpriteList = [
    "/monster/monster-idle.png",
    "/monster/monster-attack.png",
    "/monster/monster-hurt.png",
    "/monster/monster-died.png",
  ]

  const [heroSprite, sethHeroSprite] = useState(heroSpriteList[0])
  const [monsterSprite, setMonsterSprite] = useState(monsterSpriteList[0])

  const maxHealth = 100

  const inputRef = useRef<HTMLInputElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);


  useEffect(() => {
    setText(wordList[getRandomNumber()])
    inputRef.current?.focus()
  }, [])


  const handelChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    audioRef.current?.play()
    sethHeroSprite(heroSpriteList[1])
    setMonsterSprite(monsterSpriteList[1])

    if (value.length > text.length || heroHealth == 0) {
      setStart(false)
      if (monsterHealth < heroHealth) {
        setMonsterSprite(monsterSpriteList[3])
        sethHeroSprite(heroSpriteList[0])
        setGameOver(true)
      } if (heroHealth < monsterHealth) {
        sethHeroSprite(heroSpriteList[3])
        setMonsterSprite(monsterSpriteList[0])
        setGameOver(true)
      }
      return
    }

    const lastIndex = value.length - 1;
    const lastTyped = value[lastIndex];
    const correctChar = text[lastIndex];

    // Detect wrong character just typed
    if (lastTyped && lastTyped !== correctChar) {
      setHeroHealth((prev) => Math.max(prev - 10, 0));
      sethHeroSprite(heroSpriteList[2])
    } else {
      setMonsterHealth((prev) => Math.max(prev - 1, 0));
      setMonsterSprite(monsterSpriteList[2])
    }

    setUserInput(value)
    setStart(true)
  }
  useEffect(() => {
    if (!start) return;
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setStart(false);
          if (monsterHealth < heroHealth) {
            setMonsterSprite(monsterSpriteList[3])
            sethHeroSprite(heroSpriteList[0])
          } if (heroHealth < monsterHealth) {
            sethHeroSprite(heroSpriteList[3])
            setMonsterSprite(monsterSpriteList[0])
          }
          setGameOver(true)
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval)
  }, [start])

  const charClass = (char: string, index: number) => {
    if (userInput[index] == null) {
      return "text-gray-600"
    }
    if (userInput[index]) {
      if (userInput[index] === char) {
        return "text-green-600"
      }
      else {
        return "text-red-600"
      }
    }
  }

  return (
    <div className='min-h-screen md:px-16 px-4 py-8 relative'>
      {/* Helath bar */}
      <div className="flex justify-between gap-3 items-center w-full mb-6">
          {/* HERO BAR */}
          <div className="flex-1">
            <div className="text-[10px] font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">Hero</div>
            <div className="h-2.5 bg-slate-200 rounded-full overflow-hidden shadow-inner">
              <div
                className="h-full bg-emerald-500 transition-all duration-300 rounded-full"
                style={{ width: `${(heroHealth / maxHealth) * 100}%` }}
              />
            </div>
            <p className="text-[10px] mt-1 text-slate-600 font-medium">{heroHealth}/{maxHealth}</p>
          </div>

          {/* TIMER */}
          <div className="px-4 py-1.5 bg-white rounded-lg shadow-sm border border-slate-200">
            <span className="text-xl font-semibold text-slate-800 tabular-nums">{timer}</span>
          </div>

          {/* MONSTER BAR */}
          <div className="flex-1">
            <div className="text-[10px] font-semibold text-slate-700 mb-1.5 uppercase tracking-wider text-right">Monster</div>
            <div className="h-2.5 bg-slate-200 rounded-full overflow-hidden shadow-inner">
              <div
                className="h-full bg-rose-500 transition-all duration-300 rounded-full"
                style={{ width: `${(monsterHealth / maxHealth) * 100}%` }}
              />
            </div>
            <p className="text-[10px] mt-1 text-slate-600 font-medium text-right">{monsterHealth}/{maxHealth}</p>
          </div>
        </div>

      {/* Hero and monster */}
      <div className='flex gap-8 justify-center items-center my-24'>
        <CssSprite imgSrc={heroSprite} scale={4} frameCount={8} frameHeight={64} frameWidth={64} fps={6} position={192} />
        <CssSprite imgSrc={monsterSprite} scale={2.5} frameCount={8} frameHeight={64} frameWidth={64} fps={6} position={0} />
      </div>

      {/* Text */}
      <div className='my-8'>
        <p>
          {text.split("").map((char, index) => (
            <span key={index} className={`${charClass(char, index)}`}>{char}</span>
          ))}
        </p>
      </div>

      {/* Input */}
      <div>
        <input type="text" ref={inputRef} onChange={handelChange} placeholder="Start typing..."
          value={userInput} className='w-full rounded-md p-4 py-2 border border-black' />
      </div>

      {/* Game over */}
      {gameOver && (
        <div className='absolute min-h-screen min-w-screen flex justify-center items-center top-0 right-0 z-50 bg-black/50'>
          <div className="flex flex-col gap-4 items-center">
            <h1 className='text-2xl font-bold'>Game Over</h1>
            <button className='px-4 py-2 text-white bg-gray-900 rounded-md' onClick={() => window.location.reload()}>Restart</button>
          </div>
        </div>
      )}
      <audio src="/sword_sound.mp3" ref={audioRef} className='hidden'></audio>
    </div>
  )
}
