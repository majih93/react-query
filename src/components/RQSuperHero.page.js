import React from "react";
import { useParams } from "react-router-dom";
import { useSuperHeroData } from "../hooks/useSuperHeroData";

export const RQSuperHeroPage = () => {
  const { heroId } = useParams();
  console.log(`heroId 는 ${heroId}`);

  const { isLoading, data, isError, error } = useSuperHeroData(heroId);

  return (
    <div>
      {data?.data.name} - {data?.data.alterEgo}
    </div>
  );
};
