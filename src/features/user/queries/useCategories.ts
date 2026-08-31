import { useQuery } from "@tanstack/react-query";
import { fetchCategories } from "../service/AuthService";


export const useCategories = () =>{

    return useQuery({
        queryKey:["categories"],
        queryFn:fetchCategories
    })
}