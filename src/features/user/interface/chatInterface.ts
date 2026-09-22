export interface ChatMessage {

    id:string;
    conversationId:string;
    senderRole: "user" | "serviceCenter" | "mechanic"; 
    text: string;
    type: "text" | "image" | "system";
    createdAt:string
}