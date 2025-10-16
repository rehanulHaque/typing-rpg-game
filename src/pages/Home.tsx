import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen flex justify-center items-center">
      <Link to={"/game"}>
        <button className="px-4 py-2 text-white bg-gray-900 rounded-md">
          Start Game
        </button>
      </Link>
    </div>
  )
}
