import { useState } from "react"
import { ForcastContainer, MainCard, SearchBar } from "./components"

function App() {
  const [MainCardDisable, setMainCardDisable] = useState(true);

  return (
    <>
      <div className='text-white '>
        <header className=' p-4'>
          {/* <SearchBar /> */}
          <SearchBar CardSwitch={setMainCardDisable} />
        </header>
        <main>

          <div className='p-4' hidden={MainCardDisable}>
            <MainCard CardSwitch={setMainCardDisable} />
          </div>

          <div className="p-4">
            <div className=" rounded-[30px] bg-[rgba(107,107,107,0.22)] p-4" hidden={!MainCardDisable}>
              <p className="text-6xl font-bold text-center">
                Loading...
              </p>
            </div>
          </div>

          <div className='p-4' hidden={MainCardDisable}>
            <ForcastContainer />
          </div>

        </main>
        
        <footer>
        </footer>

      </div>
    </>
  )
}

export default App
