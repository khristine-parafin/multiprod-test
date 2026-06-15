/* Shared offer data + formatters + small atoms used across variations. */

const FLEX = {
  key: 'flex',
  name: 'Flex',
  /* Short, emphatic distinguishing phrase — the line we want users to read first. */
  tagline: 'Pay back as you sell.',
  /* Soft sub-explainer that sits under the tagline. */
  pitchSub: 'Repayments rise and fall with your daily revenue.',
  /* Legacy single string (kept for any variant not yet split). */
  pitch: 'Pay back as you sell. Repayments rise and fall with your daily revenue.',
  /* Flex has TWO contractable durations — 9 or 12 months. Longer terms have
     a smaller daily bite (lower holdback %) but cost more in total fee. */
  durations: [
    { months: 12, feeRate: 0.155, holdback: 0.10 },
    { months:  9, feeRate: 0.115, holdback: 0.14 },
  ],
  defaultDurationIdx: 0,   // 12 months by default
  freq: 'Daily, % of sales',
  apr_eq: 28.4,            // illustrative
  maxAmount: 35000,        // Flex is risk-priced off revenue, so it caps lower
  /* Backward-compat getters — variants that don't yet expose a duration
     picker can keep reading .feeRate / .holdback / .est_months. */
  get feeRate()    { return this.durations[this.defaultDurationIdx].feeRate; },
  get holdback()   { return this.durations[this.defaultDurationIdx].holdback; },
  get est_months() { return this.durations[this.defaultDurationIdx].months; },
};

const TERM = {
  key: 'term',
  name: 'Term',
  tagline: 'Pay back on a set schedule.',
  pitchSub: 'Same weekly amount until the loan is repaid.',
  pitch: 'Pay back on a set schedule. Fixed weekly payments until the loan is repaid.',
  feeRate: 0.094,          // 9.4% flat fee on principal (lower because term)
  weeks: 52,
  /* Term has TWO contractable durations — 9 or 12 months. Payments are
     debited every two weeks (bi-weekly). Shorter terms mean a higher
     bi-weekly amount but a smaller total fee. */
  durations: [
    { months: 12, weeks: 52, biweeks: 26, feeRate: 0.094 },
    { months:  9, weeks: 39, biweeks: 19, feeRate: 0.071 },
  ],
  defaultDurationIdx: 0,   // 12 months by default
  freq: 'Fixed weekly',
  apr_eq: 19.9,
  maxAmount: 50000,        // Term goes all the way to the approved ceiling
  weekly: (amount) => Math.round((amount * 1.094) / 52),
};

function usd(n, opts = {}) {
  const { cents = false, compact = false } = opts;
  if (compact && n >= 1000) {
    if (n >= 1000000) return '$' + (n / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
    return '$' + Math.round(n / 1000) + 'k';
  }
  if (cents) return '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return '$' + Math.round(n).toLocaleString('en-US');
}

function flexTotal(amount, durIdx = FLEX.defaultDurationIdx) {
  return Math.round(amount * (1 + FLEX.durations[durIdx].feeRate));
}
function flexFee(amount, durIdx = FLEX.defaultDurationIdx) {
  return Math.round(amount * FLEX.durations[durIdx].feeRate);
}
function termTotal(amount, weeks = TERM.weeks) {
  // Term fee scales modestly with term length
  const yrFrac = weeks / 52;
  const fee = amount * (0.094 * yrFrac);
  return Math.round(amount + fee);
}
function termFee(amount, weeks = TERM.weeks) {
  const yrFrac = weeks / 52;
  return Math.round(amount * 0.094 * yrFrac);
}
function termWeekly(amount, weeks = TERM.weeks) {
  return Math.round(termTotal(amount, weeks) / weeks);
}

/* Tiny info icon  */
function InfoDot() {
  return (
    <svg viewBox="0 0 16 16" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.4"
         style={{ verticalAlign: '-1px', color: 'var(--dv-black-40)' }}>
      <circle cx="8" cy="8" r="6.5"/>
      <path d="M8 7.2v3.6M8 5.2v.05"/>
    </svg>
  );
}

/* Amount slider card (shared)
 * Optional `flexMax`: when provided, renders a tick marker on the slider at
 * that value and shades the past-max zone — used to visually communicate
 * that Flex caps below Term.
 */
function AmountCard({ amount, setAmount, min = 5000, max = 50000, step = 500, caption, flexMax }) {
  const pct = ((amount - min) / (max - min)) * 100;
  const flexPct = flexMax ? ((flexMax - min) / (max - min)) * 100 : 0;
  return (
    <section className="ofr-amount-card">
      <div className="ofr-amount-row">
        <div>
          <div className="ofr-amount-label">Your offer</div>
          <div className="ofr-amount-value">{usd(amount)}</div>
        </div>
        <div className="ofr-amount-cap">
          {caption || (
            flexMax ? (
              <React.Fragment>
                Up to <b>{usd(max)}</b> with Term<br/>
                Up to <b>{usd(flexMax)}</b> with Flex
              </React.Fragment>
            ) : (
              <React.Fragment>
                Approved up to <b>{usd(max)}</b><br/>
                Choose any amount from <b>{usd(min)}</b>
              </React.Fragment>
            )
          )}
        </div>
      </div>

      {flexMax ? (
        <div className="ofr-slider-stack">
          <div
            className="ofr-slider-track"
            style={{ '--pct': pct + '%', '--flex-pct': flexPct + '%' }}
          />
          <input
            type="range"
            className="ofr-slider-input"
            min={min} max={max} step={step} value={amount}
            onChange={e => setAmount(Number(e.target.value))}
            aria-label="Offer amount"
          />
          <div className="ofr-slider-tick" style={{ left: flexPct + '%' }}>
            <span className="ofr-slider-tick-line"/>
            <span className="ofr-slider-tick-label">Flex max · {usd(flexMax)}</span>
          </div>
        </div>
      ) : (
        <input
          type="range"
          className="ofr-range"
          min={min} max={max} step={step} value={amount}
          onChange={e => setAmount(Number(e.target.value))}
          style={{ '--pct': pct + '%' }}
          aria-label="Offer amount"
        />
      )}

      <div className="ofr-range-axis" style={flexMax ? { marginTop: 28 } : null}>
        <span>{usd(min)}</span>
        <span>
          {flexMax
            ? <em style={{fontStyle:'normal',color:'var(--dv-black-50)'}}>Term-only above {usd(flexMax)} →</em>
            : usd((min + max) / 2)}
        </span>
        <span>{usd(max)}</span>
      </div>
    </section>
  );
}

Object.assign(window, {
  FLEX, TERM,
  usd, flexTotal, flexFee, termTotal, termFee, termWeekly,
  InfoDot, AmountCard,
});
