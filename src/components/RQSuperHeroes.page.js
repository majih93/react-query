import axios from "axios";
import { useQuery } from "react-query";

const fetchSuperHeroes = () => {
  return axios.get("http://localhost:4000/superheroes");
};

export const RQSuperHeroesPage = () => {
  // useQuery hook은 두 개의 필수 인수를 요구함.
  // 첫 번째는 이 query를 unique하게 만들어줄 id ->
  // TODO understand significance of query id
  // 두 번째는 promise를 return 하는 함수(axios returns a promise)
  // 원래 axios + useState 를 통해서 데이터를 관리함 -> useQuery는 자체적으로 isLoading, data state 변수를 제공한다
  // effect를 통해서 데이터를 불러오는 작업이 없네?

  const { isLoading, data, isError, error, isFetching } = useQuery(
    "superheroes",
    fetchSuperHeroes,
    {}
  );

  console.log(`isLoading:${isLoading}`, `isFetching: ${isFetching}`);

  if (isLoading) {
    return <h2>Loading...</h2>;
  }

  if (isError) {
    return <h2>{error.message}</h2>;
  }

  return (
    <>
      <h2>
        Superheroes brought by the brand new <b>REACT QUERY</b>
      </h2>
      {data?.data.map((hero) => (
        <div key={hero.id}>{hero.name} </div>
      ))}
    </>
  );
};
