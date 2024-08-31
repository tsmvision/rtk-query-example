import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import {pokemonApi, useGetTestQuery} from "./redux/api/pokemon.ts";

function App() {
  const [count, setCount] = useState(0);
  const {
      data,
  } = useGetTestQuery();

  //
  // const {
  //     data: test2
  // } = useGetTest2Query();

  // useEffect(() => {
  //     console.log('test2: ', test2);
  // }, [test2]);

  const name = data?.name ?? '';
  return (
    <>
        <h3>{name}</h3>
        {/*{*/}
        {/*    test2?.data?.map(*/}
        {/*        (element) => <div>{element}</div>*/}
        {/*    )*/}
        {/*}*/}
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
