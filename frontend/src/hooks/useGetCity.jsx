import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import {
  setCurrentAddress,
  setCurrentCity,
  setCurrentState,
} from "../redux/userSlice";
import { setAddress, setLocation } from "../redux/mapSlice";

function useGetCity() {
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user);
  const apiKey = import.meta.env.VITE_GEOAPIKEY;
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;
      dispatch(setLocation({ lat: latitude, lon: longitude }));
      const url = `https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&apiKey=${apiKey}`;
      const result = await axios.get(url);
      console.log(result)
      dispatch(
        setCurrentCity(result?.data?.features[0].properties.state_district)
      );
      dispatch(setCurrentState(result?.data?.features[0].properties.state));
      const custom_address =
        result?.data?.features[0].properties.address_line1 +
        ", " +
        result?.data?.features[0].properties.address_line2;
      dispatch(setCurrentAddress(custom_address));
      dispatch(setAddress(custom_address));
    });
  }, [userData]);
}

export default useGetCity;
