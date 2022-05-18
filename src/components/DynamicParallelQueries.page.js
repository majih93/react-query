import axios from "axios";
import { useQueries } from "react-query";

const fetchSuperHero = (heroId) => {
  return axios.get(`http://localhost:4000/superheroes/${heroId}`);
};

export const DynamicParallelQueriesPage = ({ heroIds }) => {
  const queryResults = useQueries(
    heroIds.map((id) => {
      return {
        queryKey: ["superhero", id],
        queryFn: () => fetchSuperHero(id),
      };
    })
  );

  const { data, isLoading } = queryResults[0];
  console.log(data?.data);
  return <div>DynamicParallelQueries.page</div>;
};
