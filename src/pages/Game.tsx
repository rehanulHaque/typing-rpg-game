import { useEffect, useRef, useState, type ChangeEvent } from 'react'
import { getRandomNumber } from '../utils'
import { wordList } from '../wordsList'
import { CssSprite } from '../components/Sprite'

export default function Game() {
  const [text, setText] = useState("")
  const [userInput, setUserInput] = useState("")
  const [timer, setTimer] = useState(5)
  const [start, setStart] = useState(false)
  const [heroHealth, setHeroHealth] = useState(100)
  const [monsterHealth, setMonsterHealth] = useState(100)


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
          if(monsterHealth < heroHealth){
            setMonsterSprite(monsterSpriteList[3])
            sethHeroSprite(heroSpriteList[0])
          } if(heroHealth < monsterHealth){
            sethHeroSprite(heroSpriteList[3])
            setMonsterSprite(monsterSpriteList[0])
          }
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
        // setHeroHealth((prev) => prev - 10)
        return "text-red-600"
      }
    }
  }

  // const correctCount = [...text].filter((c, i) => c === userInput[i]).length;
  // const accuracy = text.length ? Math.round((correctCount / text.length) * 100) : 100;

  return (
    <div className='min-h-screen md:mx-16 mx-4 py-8'>
      {/* Helath bar */}
      <div className="flex justify-between md:gap-4 gap-2 items-center w-full">
        {/* HERO BAR */}
        <div>
          {/* outer track with fixed pixel width */}
          <div className="w-[150px] md:w-[200px] h-4 bg-gray-300 border border-black rounded overflow-hidden">
            {/* inner fill width is percentage of max */}
            <div
              className="h-full bg-green-600 transition-all duration-300"
              style={{ width: `${(heroHealth / maxHealth) * 100}%` }}
            />
          </div>
          <p className="text-xs mt-1">HP: {heroHealth}/{maxHealth}</p>
        </div>

        {/* TIMER */}
        <div>
          <div className="border border-black rounded-md flex items-center justify-center px-4 py-2">
            <span>{timer}</span>
          </div>
        </div>

        {/* MONSTER BAR (example of full bar) */}
        <div>
          {/* outer track with fixed pixel width */}
          <div className="w-[150px] md:w-[200px] h-4 bg-gray-300 border border-black rounded overflow-hidden">
            {/* inner fill width is percentage of max */}
            <div
              className="h-full bg-red-600 transition-all duration-300"
              style={{ width: `${(monsterHealth / maxHealth) * 100}%` }}
            />
          </div>
          <p className="text-xs mt-1">HP: {monsterHealth}/{maxHealth}</p>
        </div>
      </div>

      {/* Hero and monster */}
      <div className='flex gap-8 justify-center items-center my-24'>
        <CssSprite imgSrc={heroSprite} scale={4} frameCount={8} frameHeight={64} frameWidth={64} fps={6} position={192}/>
        <CssSprite imgSrc={monsterSprite} scale={2.5} frameCount={8} frameHeight={64} frameWidth={64} fps={6} position={0}/>
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
      {/* {!start && (
        <div className='h-[300px] w-full border border-black rounded-md mt-4 flex justify-center items-center'>
          <div>
            <p>Typed: {text.length}/{userInput.length}</p>
            <p>Accuracy: {accuracy}%</p>
            <p>Correct chars: {correctCount}</p>
          </div>
        </div>
      )} */}
      <audio src="/sword_sound.mp3" ref={audioRef} className='hidden'></audio>
    </div>
  )
}
