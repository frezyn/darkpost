import { router } from "@workspace/trpc";
import { generatePayment } from "./generatePayment";

import { checkPaymentStatus } from "./checkPaymentStatus";

export const billing = router({
  generatePayment,
  checkPaymentStatus,
})
