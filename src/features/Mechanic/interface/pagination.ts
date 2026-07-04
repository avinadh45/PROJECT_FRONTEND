import type { MechanicResponse } from "./Mechanic"

export interface PaginationMechanicResponse{
    data : MechanicResponse[];
    total:number;
    page:number;
    limit:number;
    totalPages:number
}