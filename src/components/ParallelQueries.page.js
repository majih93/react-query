import axios from "axios";
import { useQuery } from "react-query";

const fetchSuperHeroes = () => {
  return axios.get("http://localhost:4000/superheroes");
};

const fetchFriends = () => {
  return axios.get("http://localhost:4000/friends");
};

export const ParallelQueriesPage = () => {
  const {
    data: superHeroes,
    isLoading: loadingHeroes,
    error: heroesLoadingError,
  } = useQuery("superheroes", fetchSuperHeroes);

  const { data: friendsCharacters, isLoading: loadingFriends } = useQuery(
    "friends",
    fetchFriends
  );

  return <div>ParallelQueries.page</div>;
};
