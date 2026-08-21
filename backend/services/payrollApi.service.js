// services/payrollApi.service.js
// Thin wrapper around whichever external payroll/payment provider gets
// chosen (Paystack / Stripe / PayFast). Kept isolated behind this service
// so swapping providers later doesn't ripple into payroll.controller.js —
// the controller only ever calls disburse() and getStatus().
//
// No provider is wired up yet (no PAYROLL_API_KEY set anywhere in .env.example
// besides the placeholder). Until a real provider is chosen and its SDK
// installed, disburse() simulates a successful payout in development so the
// rest of the flow (status -> 'paid', payslip generation) can be built and
// demoed without a live payment integration. Swap the body of disburse()
// for a real SDK call once a provider is picked — the function signature
// and return shape are what payroll.controller.js depends on, so keep those
// stable.

async function disburse({ payrollRun, employee }) {
  if (!process.env.PAYROLL_API_KEY) {
    // No provider configured — simulate success for local/dev/demo use.
    return {
      success: true,
      simulated: true,
      reference: `SIMULATED-${payrollRun.payroll_id}-${Date.now()}`,
      provider: null,
    };
  }

  // --- Real integration goes here once a provider is chosen, e.g.: ---
  // const res = await fetch("https://api.paystack.co/transfer", {
  //   method: "POST",
  //   headers: {
  //     Authorization: `Bearer ${process.env.PAYROLL_API_KEY}`,
  //     "Content-Type": "application/json",
  //   },
  //   body: JSON.stringify({
  //     amount: Math.round(payrollRun.net_pay * 100), // provider may expect cents
  //     recipient: employee.contact,
  //     reason: `Payroll ${payrollRun.pay_period_start} - ${payrollRun.pay_period_end}`,
  //   }),
  // });
  // const data = await res.json();
  // if (!res.ok) {
  //   throw new Error(data.message || "Payroll disbursement failed");
  // }
  // return { success: true, simulated: false, reference: data.reference, provider: "paystack" };

  throw new Error(
    "PAYROLL_API_KEY is set but no provider integration is implemented yet in payrollApi.service.js"
  );
}

export { disburse };
