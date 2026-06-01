import { useState, useEffect } from "react";
import axios from "axios";

import { API_URL } from "../constants";

interface UserData {
  id: string;
  username: string;
}

interface AuthData {
  status: boolean;
  user: UserData;
}

function useAuth() {
  const [data, setData] = useState<AuthData>({
    status: false,
    user: { id: "", username: "" },
  });

  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (!token) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setData({ status: false, user: { id: "", username: "" } });
      return;
    }

    axios
      .get(`${API_URL}/users/auth`, {
        headers: {
          Authorization: `${token}`,
        },
      })
      .then((response) => {
        const userData = response.data.user;
        // console.log("response:", response, "userData:", userData);
        setData({
          status: true,
          user: { id: userData.id, username: userData.username },
        });
      })
      .catch((error) => {
        console.error("Authentication failed:", error);
        setData({ status: false, user: { id: "", username: "" } });
      });
  }, []);

  return data;
}

export default useAuth;
