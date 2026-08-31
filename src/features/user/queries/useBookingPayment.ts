import { useMutation } from "@tanstack/react-query";
import { createBooking,verifyBookingPayment } from "../service/AuthService";
import type { BookingOrderPayload,VerifyPaymentPayload } from "../interface/bookingInterface";

export const useCreateBookingOrder = ()=>{

    return useMutation({
        mutationFn:(payload:BookingOrderPayload)=> createBooking(payload)
    })
}
export const useVerifyBookingPayment =()=>{

    return useMutation({
        mutationFn: (payload: VerifyPaymentPayload)=> verifyBookingPayment(payload)
    })
}
