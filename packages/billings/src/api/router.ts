import { router } from "@workspace/trpc";

import { quoteToday } from "./css/quote";
import { GenerateInviteCode, GetInviteCode } from "./generateInviteCode";
import { generatePayment } from "./generatePayment";

import { checkPaymentStatus } from "./checkPaymentStatus";

export const billing = router({
  generatePayment,
  quoteToday,
  checkPaymentStatus,
  GenerateInviteCode,
  GetInviteCode,
})
