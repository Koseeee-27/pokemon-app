import "./App.css";
import { useEffect, useState } from "react";
import { getAllPokemon, getPokemon } from "./utils/pokemon";
import Card from "./commponents/Card/Card";
import Navbar from "./commponents/Navbar/Navbar";

function App() {
  const initialURL = "https://pokeapi.co/api/v2/pokemon";
  const [loading, setLoading] = useState(true);
  const [pokemonData, setPokemonData] = useState([]);
  const [nextURL, setNextURL] = useState("");
  const [prevURL, setPrevURL] = useState("");

  useEffect(() => {
    const fetchPokemonData = async () => {
      //全てのポケモンデータを取得
      let res = await getAllPokemon(initialURL);
      //各ポケモンの詳細データを取得
      loadPoemon(res.results);
      // console.log(res.next);
      //次のページのURLを設定
      setNextURL(res.next);
      //ローディングを終了
      setLoading(false);
    };
    fetchPokemonData();
  }, []);

  const loadPoemon = async (data) => {
    let _pokemonData = await Promise.all(
      data.map((pokemon) => {
        let pokemonRecord = getPokemon(pokemon.url);
        return pokemonRecord;
      })
    );
    setPokemonData(_pokemonData);
  };

  // console.log(pokemonData);

  const handleNextPage = async () => {
    setLoading(true);
    let data = await getAllPokemon(nextURL);
    // console.log(data);
    await loadPoemon(data.results);
    setNextURL(data.next);
    if (data.previous) {
      setPrevURL(data.previous);
    } else {
      setPrevURL("");
    }
    setLoading(false);
  };

  const handlePrevPage = async () => {
    if (!prevURL) return; // 前のページがない場合は何もしない
    setLoading(true);
    let data = await getAllPokemon(prevURL);
    // console.log(data);
    await loadPoemon(data.results);
    setNextURL(data.next);
    if (data.previous) {
      setPrevURL(data.previous);
    } else {
      setPrevURL("");
    }
    setLoading(false);
  };

  return (
    <>
      <Navbar />
      <div className="App">
        {loading ? (
          <h1>ロード中・・・</h1>
        ) : (
          <>
            <div className="pokemonCardContainer">
              {pokemonData.map((pokemon, i) => {
                return <Card key={i} pokemon={pokemon} />;
              })}
            </div>
            <div className="btn">
              <button onClick={handlePrevPage}>前へ</button>
              <button onClick={handleNextPage}>次へ</button>
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default App;
