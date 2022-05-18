import "./App.css";
import { Link, Route, Routes } from "react-router-dom";
import { HomePage } from "./components/Home.page";
import { SuperHeroesPage } from "./components/SuperHeroes.page";
import { RQSuperHeroesPage } from "./components/RQSuperHeroes.page";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { RQVillains } from "./components/RQVillains.page";
import { RQSuperHeroPage } from "./components/RQSuperHero.page";

function App() {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <div className="App">
        <div>
          <nav>
            <ul style={{ listStyle: "none", display: "flex" }}>
              <li style={{ marginRight: "20px" }}>
                <Link to="/">HOME</Link>
              </li>
              <li style={{ marginRight: "20px" }}>
                <Link to="/superheroes">SuperHeroes</Link>
              </li>
              <li>
                <Link to="/rq-superheroes ">RQ Superheroes</Link>
              </li>
              <li>
                <Link to="/rqvills">RQ villains</Link>
              </li>
            </ul>
          </nav>
        </div>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/rq-superheroes/:heroId" element={<RQSuperHeroPage />} />
          <Route path="/superheroes" element={<SuperHeroesPage />} />
          <Route path="/rq-superheroes" element={<RQSuperHeroesPage />} />
          <Route path="/rqvills" element={<RQVillains />} />
        </Routes>
      </div>
      <ReactQueryDevtools initialIsOpen={false} position="bottom-right" />
    </QueryClientProvider>
  );
}

export default App;
