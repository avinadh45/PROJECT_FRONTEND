import type { ChatMessage } from "../../features/user/interface/chatInterface";
import { API_ROUTES } from "../api/apiRoutes";
import axiosClient from "../api/axiosClient";

export const fetchMessages = async(conversationId: string, page:number,limit:number):Promise<{data:ChatMessage[]; total:number; page:number; limit:number;totalPages:number}>=>{

const res = await axiosClient.get(API_ROUTES.CHAT._CHAT(conversationId),{params:{page,limit}})
return res.data.data
}