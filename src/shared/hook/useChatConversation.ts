import { useState,useEffect,useCallback,useRef } from "react";
import { getSocket } from "../lib/socket";
import { fetchMessages } from "../service/chatService";
import type { ChatMessage } from "../../features/user/interface/chatInterface";

interface UseChatConversationProps {
    bookingId?: string;
    concernId?: string;
    currentUserId: string;
}

export function useChatConversation({bookingId,concernId,currentUserId}:UseChatConversationProps){

    const [conversationId, setConversationId] = useState<string | null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [isJoining, setIsJoining] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [hasMore, setHasMore] = useState(false);
    const pageRef = useRef(1); 

    useEffect(()=>{
        const socket = getSocket()
        setIsJoining(true)
        setError(null) 

        socket.emit("chat:join",{bookingId,concernId}) 

        function handleJoined({conversationId}:{conversationId:string}){
            setConversationId(conversationId)
            setIsJoining(false)
            loadHistory(conversationId, 1, true);
        }
        function handleError({message}:{message:string}){
             console.error("chat:error received:", message);  
            setError(message)
            setIsJoining(false)
        }
        function handleMessage(msg:ChatMessage){
            setMessages((prev)=>[...prev,msg])
        }
        socket.on("chat:joined",handleJoined);
        socket.on("chat:error",handleError);
        socket.on("chat:message",handleMessage)
        return()=>{
            socket.off("chat:joined",handleJoined);
            socket.off("chat:error",handleError);
            socket.off("chat:message",handleMessage)
        };
    },[bookingId,concernId])

    async function loadHistory(convId: string,page:number,replace:boolean){

        const result = await fetchMessages(convId,page,30)
        setMessages((prev)=>(replace ? result.data: [...result.data,...prev]));
        setHasMore(page< result.totalPages);
        pageRef.current = page
    }

    const loadMore = useCallback(()=>{
        
        if(conversationId)loadHistory(conversationId,pageRef.current + 1,false) 
    },[conversationId])

   const sendMessage = useCallback(
    (text: string) => {
      if (!conversationId || !text.trim()) return;
      console.log("emitting chat:send", { conversationId, text: text.trim() });
      getSocket().emit("chat:send", { conversationId, text: text.trim() });
    },
    [conversationId]
  );

  const markRead = useCallback(()=>{
    if(conversationId) getSocket().emit("chat:markRead",{conversationId})
  },[conversationId])

    return { messages,isJoining,error,hasMore,loadMore,sendMessage,markRead,conversationId}
}