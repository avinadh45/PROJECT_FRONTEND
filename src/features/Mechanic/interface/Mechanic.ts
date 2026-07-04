export type MechanicLoginDTO = {
    email:string,
    password : string
}
export type MechanicResponse = {
    id:string,
    name:string,
    email:string,
    garageId:string,
    isBlocked:boolean
}
export type CreateMechanicDTO = {
    name: string;
  email: string;
  password: string;
   
}
export type MechanicAuthResponse= {
    success:Boolean;
    data:{
        mechanic:MechanicResponse;
        accessToken:string;
        rfreshToken:string
    }
}