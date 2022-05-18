import React from "react";
import { useVillainsData } from "../hooks/useVillainsData";

export const RQVillains = () => {
  const onSuccess = () => {
    console.log("빌런 등장");
  };
  const onError = () => {
    console.log("빌런 소환 실패");
  };

  const { data, isLoading, error, isError, isFetching } = useVillainsData(
    onSuccess,
    onError
  );

  if (isLoading) {
    return <div>로 딩 중 이 야</div>;
  }

  if (isError) {
    return <div>{error.message}</div>;
  }
  return (
    <div>
      <h2>무찔러야 하는 빌런 목록</h2>
      <ul>
        {data.data.map((villain) => (
          <li key={villain.name}>{villain.name}</li>
        ))}
      </ul>
    </div>
  );
};
