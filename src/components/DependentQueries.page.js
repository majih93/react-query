import axios from "axios";
import { useState } from "react";
import { useQuery } from "react-query";

const fetchUserByEmail = (email) => {
  return axios.get(`http://localhost:4000/users/${email}`);
};

const fetchCoursesByChannelId = (channelId) => {
  return axios.get(`http://localhost:4000/channels/${channelId}`);
};

export const DependentQueriesPage = ({ email }) => {
  const { data: user } = useQuery(["user", email], () =>
    fetchUserByEmail(email)
  );

  const channelId = user?.data.channelId;

  console.log();

  useQuery(["courses", channelId], () => fetchCoursesByChannelId(channelId), {
    enabled: Boolean(channelId),
  });

  const [hello, useHello] = useState(0);

  return (
    <div>
      <ul>
        <undefined />
        <li>hello</li>
      </ul>
    </div>
  );
};
