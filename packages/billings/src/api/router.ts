import { router } from "@workspace/trpc";
import { changeUserCss } from "./changeUserCss";
import { quoteToday } from "./css/quote";
import { GenerateInviteCode, GetInviteCode } from "./generateInviteCode";
import { generatePayment } from "./generatePayment";
import { changeQuote } from "./changeQuote";
import { checkPaymentStatus } from "./checkPaymentStatus";

export const billing = router({
  generatePayment,
  quoteToday,
  changeUserCss,
  checkPaymentStatus,
  GenerateInviteCode,
  GetInviteCode,
  changeQuote
})
