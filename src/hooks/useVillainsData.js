import axios from "axios";
import { useQuery } from "react-query";

const fetchVillains = () => {
  return axios.get("http://localhost:4000/villains");
};

// 실행할 때 그때그때 맞춰서 주고 싶은 것들 매개변수로 전달
export const useVillainsData = (onSuccess, onError) => {
  return useQuery("getVillains", fetchVillains, {
    onSuccess,
    onError,
  });
};
