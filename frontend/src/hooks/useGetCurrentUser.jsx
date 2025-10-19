import React, { useEffect } from "react";
import axios from "axios";
import { serverUrl } from "../App";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice";

// check if any user is logged in from cookies
function useGetCurrentUser() {
  const dispatch = useDispatch();
  useEffect(() => {
      const fetchUser = async () => {
        try {
            const result = await axios.get(
              `${serverUrl}/api/user/current-user`,{withCredentials:true}
            );
           dispatch(setUserData(result.data));
        } catch (error) {
            console.log(error);
            
        }
      }
      fetchUser();
  }, []);
}

export default useGetCurrentUser;
