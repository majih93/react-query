import "./App.css";
import { Link, Route, Routes } from "react-router-dom";
import { HomePage } from "./components/Home.page";
import { SuperHeroesPage } from "./components/SuperHeroes.page";
import { RQSuperHeroesPage } from "./components/RQSuperHeroes.page";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";

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
                <Link to="/rq">RQ Superheroes</Link>
              </li>
            </ul>
          </nav>
        </div>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/superheroes" element={<SuperHeroesPage />} />
          <Route path="/rq" element={<RQSuperHeroesPage />} />
        </Routes>
      </div>
      <ReactQueryDevtools initialIsOpen={false} position="bottom-right" />
    </QueryClientProvider>
  );
}

export default App;
