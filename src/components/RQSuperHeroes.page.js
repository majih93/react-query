import axios from "axios";
import { useState } from "react";
import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import { useSuperHeroesData } from "../hooks/useSuperHeroesData";

export const RQSuperHeroesPage = () => {
  const onSuccess = (data) => {
    console.log("done", data.data);
  };
  const onError = (error) => {
    console.log("error", error.message);
  };

  const { isLoading, data, isError, error, isFetching, refetch } =
    useSuperHeroesData(onSuccess, onError);

  if (isLoading || isFetching) {
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
      <button onClick={refetch}>히어로 목록 불러오기</button>
      {data?.data.map((hero) => (
        <div key={hero.id}>
          <Link to={`/rq-superheroes/${hero.id}`}>{hero.name}</Link>
        </div>
      ))}
    </>
  );
};
