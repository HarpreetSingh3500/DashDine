import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { serverUrl } from "../App";
import { setShopsInMyCity } from "../redux/userSlice";


function useGetShopsByCity() {

    const {currentCity} = useSelector(state=>state.user);
 
    const dispatch = useDispatch();

    useEffect(()=>{
        const fetchShops = async () => {
            try {
                const result = await axios.get(`${serverUrl}/api/shop/get-by-city/${currentCity}`,{withCredentials:true});
                dispatch(setShopsInMyCity(result.data));
            } catch (error) {
                console.log(error)
            }
        }
        if(currentCity){fetchShops();}
    },[currentCity]);

}

export default useGetShopsByCity