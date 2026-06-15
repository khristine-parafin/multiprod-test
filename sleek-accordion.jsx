/* sleek-accordion.jsx — collapsible-step ("wizard") version of the
 * Flex vs Term offer. Same content + atoms as V1bStatsOut, but the four
 * steps are an accordion: one step is expanded at a time, finished steps
 * collapse to a check + chosen-value summary with an Edit affordance, and
 * upcoming steps are dimmed.
 *
 * Reuses globals: usd, FLEX, TERM, addMonths, addDays, flexFee, flexTotal,
 * skLabels, SkAmount, SkSlimOptionCard, SkFlexShape, SkTermShape,
 * SkDurationStep, SkPlanPanel, SkSupportCard, SkPowered,
 * SkIframeHeader, SkIframeFooter.
 */

function AccCheck() {
  return (
    <svg viewBox="0 0 16 16" width="15" height="15" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3.5 8.4l3 3 6-6.8" />
    </svg>);
}

function AccPencil() {
  return (
    <svg viewBox="0 0 16 16" width="13" height="13" fill="none"
      stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M10.8 2.6l2.6 2.6M11.6 1.8 4.3 9.1l-.9 3.5 3.5-.9 7.3-7.3a1.4 1.4 0 0 0 0-2l-.6-.6a1.4 1.4 0 0 0-2 0Z" />
    </svg>);
}

function SkAccordionOffer({
  amount, setAmount, choice, setChoice, recommend,
  termShapeStyle = 'weeks', naming = 'product',
  chrome = false, mobile = false, partnerName = 'Plinko',
  supportStyle = 'tinted', summaryLevel = 'full',
  product = 'both',
  crossSellPlacement = 'review',
  initialStep = 0,
  onClose, onSwitch,
}) {
  const L = skLabels(naming);
  const today = new Date('2026-05-20');
  const flexMax = FLEX.maxAmount;
  const termMax = TERM.maxAmount;
  const single = product !== 'both';
  const isFlex = single ? product === 'flex' : choice === 'flex';
  const productMax = isFlex ? flexMax : termMax;
  // In single-product mode the offer is capped at that product's ceiling —
  // clamp locally so the math + slider never exceed it (without mutating the
  // shared amount that the both-products boards also read).
  const amt = single ? Math.min(amount, productMax) : amount;
  const flexAvailable = amt <= flexMax;

  const [flexDurIdx, setFlexDurIdx] = React.useState(FLEX.defaultDurationIdx);
  const [termDurIdx, setTermDurIdx] = React.useState(TERM.defaultDurationIdx);

  const flexDur = FLEX.durations[flexDurIdx];
  const termDur = TERM.durations[termDurIdx];
  const flexDone = addMonths(today, flexDur.months);
  const termDone = addDays(today, termDur.weeks * 7);

  const termFeeAmt = Math.round(amt * termDur.feeRate);
  const termTotalAmt = Math.round(amt * (1 + termDur.feeRate));
  const termBiweeklyAmt = Math.round(termTotalAmt / termDur.biweeks);

  const fee = isFlex ? flexFee(amt, flexDurIdx) : termFeeAmt;
  const total = isFlex ? flexTotal(amt, flexDurIdx) : termTotalAmt;
  const feeRate = isFlex ? flexDur.feeRate : termDur.feeRate;
  const dur = isFlex ? flexDur : termDur;

  React.useEffect(() => {
    // Only auto-switch products in the two-product flow.
    if (!single && isFlex && amount > flexMax) setChoice('term');
  }, [amount, isFlex, flexMax, setChoice, single]);

  const onChooseFlex = () => {
    if (amount > flexMax) setAmount(flexMax);
    setChoice('flex');
  };

  // Mirror the disabled-duration treatment: from the dimmed Flex card, drop
  // back to the amount step, lower the slider to Flex's cap, and pre-select
  // Flex so proceeding lands on the now-available option.
  const unlockFlex = () => { setAmount(flexMax); setChoice('flex'); setStep(0); };

  /* ── Step bodies ─────────────────────────────────────────────── */
  const amountBody = (
    <SkAmount amount={amt} setAmount={setAmount}
      flexMax={flexMax} termMax={single ? productMax : termMax}
      single={single} labels={L} />);

  const repayBody = (
    <div className="sk-twin">
      <SkSlimOptionCard
        isOn={isFlex}
        disabled={!flexAvailable}
        recommend={recommend === 'flex'}
        onChoose={onChooseFlex}
        headline="Pay as you sell"
        productName={L.flex} cap={`Up to ${usd(flexMax)}`}
        pitch={!flexAvailable ?
          <span style={{ color: 'rgb(0, 0, 0)' }}>Only available for {usd(flexMax)} and under</span> :
          'A percentage of your daily sales is debited automatically every day until repaid.'}
        footerNote={!flexAvailable ?
          <span className="sk-dur-card-adjust" role="button" tabIndex={0}
            onClick={(e) => { e.stopPropagation(); unlockFlex(); }}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); e.stopPropagation(); unlockFlex(); } }}>
            Lower amount to {usd(flexMax)} to unlock <span aria-hidden="true">→</span>
          </span> : null}
        shape={!flexAvailable ? null : <SkFlexShape holdback={flexDur.holdback} />} />
      <SkSlimOptionCard
        isOn={!isFlex}
        recommend={recommend === 'term'}
        onChoose={() => setChoice('term')}
        headline="Pay a fixed amount"
        productName={L.term} cap={`Up to ${usd(termMax)}`}
        pitch="The same payment, made every two weeks."
        shape={<SkTermShape variant={termShapeStyle}
          weekly={termBiweeklyAmt} weeks={termDur.weeks} total={termTotalAmt} />} />
    </div>);

  const durationFacts = (
    <div className="sk-acc-durfacts" aria-live="polite">
      <span className="sk-acc-durfacts-cap">
        With a {dur.months}-month {isFlex ? L.flex : L.term} plan
      </span>
      <div className="sk-acc-durfacts-grid">
        <div className="row">
          <span className="l">Repayment rate</span>
          <span className="v">
            {isFlex
              ? `${Math.round(flexDur.holdback * 100)}% of daily sales`
              : `${usd(termBiweeklyAmt)} every 2 weeks`}
          </span>
        </div>
        <div className="row">
          <span className="l">Capital fee</span>
          <span className="v">
            {usd(fee)} <span className="pct">· {(feeRate * 100).toFixed(1)}%</span>
          </span>
        </div>
      </div>
    </div>);

  const durationBody = (
    <React.Fragment>
      {isFlex ?
        <SkDurationStep amount={amt} durIdx={flexDurIdx} setDurIdx={setFlexDurIdx} mode="flex"
          onAdjustAmount={(max) => { setAmount(max); setStep(0); }} /> :
        <SkDurationStep amount={amt} durIdx={termDurIdx} setDurIdx={setTermDurIdx} mode="term"
          onAdjustAmount={(max) => { setAmount(max); setStep(0); }} />}
      {durationFacts}
    </React.Fragment>);

  // Single-product cross-sell: surface the OTHER product the merchant is also
  // pre-approved for, inside the Review step. Leads with the why, mirroring
  // the single-product page's callout.
  const otherName = isFlex ? L.term : L.flex;
  const switchReasons = isFlex
    ? ['Pay the same fixed amount every two weeks', 'Predictable schedule — easy to budget around']
    : ['Repayment amount fluctuates with your sales', 'More flexible — pay less on slower days'];
  const otherOfferCard = (
    <div className="sk-flexpromo">
      <div className="sk-flexpromo-text">
        <h3 className="sk-flexpromo-title">{isFlex ? 'Want a larger offer with fixed repayments?' : 'Prefer to pay as you sell?'}</h3>
        <p className="sk-flexpromo-pitch">
          {isFlex
            ? <>You're pre-approved for up to <b>{usd(termMax)}</b> on {otherName}. Pay the same fixed amount every two weeks.</>
            : <>You're pre-approved for up to <b>{usd(flexMax)}</b> on {otherName}. Repayment amount adjusts based on your sales, so you pay less on slower days.</>}
        </p>
      </div>
      <button type="button" className="sk-crossoffer-btn"
        onClick={() => onSwitch && onSwitch(isFlex ? 'term' : 'flex')}>View {otherName} offer<span aria-hidden="true">→</span></button>
    </div>);

  // "How you'll pay back" illustration — same block the single-product page
  // shows, reused at the top of the Review step.
  const reviewIllus = (
    <div className="sk-single-illus">
      <div className="sk-single-illus-text">
        <span className="sk-single-illus-eyebrow">How you'll pay back</span>
        <h2 className="sk-single-illus-name">
          {isFlex ? 'Pay as you sell' : 'Pay a fixed amount'}
        </h2>
        <p className="sk-single-illus-pitch">
          {isFlex ?
            'A percentage of your daily sales is debited automatically every day until repaid.' :
            'The same payment, made every two weeks, until repaid.'}
        </p>
      </div>
      <div className="sk-shape sk-single-illus-shape">
        <div className="sk-shape-row">
          {isFlex ?
            <SkFlexShape holdback={flexDur.holdback} /> :
            <SkTermShape variant="weeks" weekly={termBiweeklyAmt}
              weeks={termDur.weeks} total={termTotalAmt} />}
        </div>
      </div>
    </div>);

  const reviewBody = (
    <React.Fragment>
      {single &&
        <div className="sk-paystack">{reviewIllus}{crossSellPlacement === 'review' && otherOfferCard}</div>}
      <SkPlanPanel
        amount={amt} isFlex={isFlex}
        flexDur={flexDur} termDur={termDur}
        termWeeklyAmt={termBiweeklyAmt}
        flexDone={flexDone} termDone={termDone}
        fee={fee} total={total} feeRate={feeRate}
        labels={L} summaryLevel={summaryLevel} />
    </React.Fragment>);

  const repaySummary = isFlex ?
    `${L.flex} · a % of daily sales` :
    `${L.term} · ${usd(termBiweeklyAmt)} every 2 weeks`;

  const amountStep = {
    title: 'Choose your amount', summary: usd(amt),
    body: (single && crossSellPlacement === 'amount') ?
      <React.Fragment>{amountBody}{otherOfferCard}</React.Fragment> :
      amountBody,
  };
  const repayStep = { title: L.repaymentTitle, summary: repaySummary, body: repayBody };
  const durationStep = { title: 'Choose a duration', summary: `${dur.months} months`, body: durationBody };
  const reviewStep = { title: 'Review your plan', summary: `${usd(total)} total`, body: reviewBody, terminal: true };

  const steps = single ?
    [amountStep, durationStep, reviewStep] :
    [amountStep, repayStep, durationStep, reviewStep];
  const lastIdx = steps.length - 1;

  const [step, setStep] = React.useState(initialStep);
  const goNext = () => setStep((s) => Math.min(s + 1, lastIdx));
  const editStep = (i) => setStep(i);

  const productLabel = isFlex ? L.flex : L.term;
  const lede = single ?
    <>You're pre-approved for <b>{productLabel}</b> up to <b>{usd(productMax)}</b>. Complete each step to accept your offer.</> :
    <>Approved for up to <b>{usd(termMax)}</b>. Complete each step to accept your offer.</>;

  return (
    <div className={
      'sk sk--ledger sk--fullpage' +
      (chrome ? ' sk--chromed' : '') +
      (mobile ? ' sk--mobile' : '')}
      data-screen-label={`Accordion · ${single ? productLabel + ' only' : 'Flex + Term'}${mobile ? ' · Mobile' : ''}`}>
      {chrome && <SkIframeHeader partnerName={partnerName} onClose={onClose} />}
      <div className="sk-page">
        <header style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <h1 className="sk-h1">{L.headline}</h1>
          <p className="sk-lede">
            {lede}
          </p>
        </header>

        <div className="sk-acc">
          {steps.map((s, i) => {
            const state = i < step ? 'done' : i === step ? 'active' : 'upcoming';
            const done = state === 'done';
            // Any collapsed step (done OR upcoming) opens on click — free
            // navigation between sections, not just a back-edit.
            const collapsed = state !== 'active';
            return (
              <section key={i} className={'sk-acc-step is-' + state}
                data-screen-label={`Step ${i + 1} · ${s.title}`}>
                <header className="sk-acc-head"
                  onClick={collapsed ? () => editStep(i) : undefined}
                  role={collapsed ? 'button' : undefined}
                  tabIndex={collapsed ? 0 : undefined}
                  onKeyDown={collapsed ? (e) => (e.key === 'Enter' || e.key === ' ') && editStep(i) : undefined}>
                  <span className="sk-acc-num">{done ? <AccCheck /> : i + 1}</span>
                  <div className="sk-acc-headtext">
                    <h2 className="sk-acc-title">{s.title}</h2>
                    {done && <span className="sk-acc-summary">{s.summary}</span>}
                  </div>
                  {done &&
                    <button type="button" className="sk-acc-edit"
                      onClick={(e) => { e.stopPropagation(); editStep(i); }}>
                      <AccPencil /> Edit
                    </button>}
                </header>

                {state === 'active' &&
                  <div className="sk-acc-body">
                    {s.body}
                    <div className="sk-acc-foot">
                      {s.terminal ?
                        <button type="button" className="sk-btn sk-acc-continue">
                          Get Started
                          <span aria-hidden="true">→</span>
                        </button> :
                        <button type="button" className="sk-btn sk-acc-continue" onClick={goNext}>
                          Continue <span aria-hidden="true">→</span>
                        </button>}
                    </div>
                  </div>}
              </section>);
          })}
        </div>

        <SkPowered />
      </div>
      {chrome && <SkIframeFooter partnerName={partnerName} />}
    </div>);
}

Object.assign(window, { SkAccordionOffer });
