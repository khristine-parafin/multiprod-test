/* V1b — single-product offer.
 *
 * One product only (Flex OR Term): no product-choice step. Flow:
 * amount → duration (with repayment rate) → review. The "How you'll pay
 * back" illustration sits ABOVE the offer summary inside ONE combined card
 * (a divider separates them).
 *
 * `crosssell` controls the other-product offer card:
 *   'callout' — inline tinted callout after the review (button beside copy
 *               on desktop, below on mobile)
 *   'rail'    — a right-rail companion card beside the flow (desktop);
 *               reflows to an inline callout on mobile
 *
 * Reuses globals: SkAmount, SkDurationStep, SkPlanPanel, SkFlexShape,
 * SkTermShape, SkCta, SkPowered, SkIframeHeader/Footer, skLabels,
 * FLEX/TERM, usd, addMonths/addDays.
 */

function V1bSingle({
  product = 'flex', amount: amountProp, setAmount, naming = 'product',
  partnerName = 'Hearty Kitchens', chrome = false, mobile = false,
  summaryLevel = 'minimal', fullPage = false, crosssell = 'callout', railReview = false,
  ctaSummary = 'sentence',
  onClose, onSwitch
}) {
  const L = skLabels(naming);
  const today = new Date('2026-05-20');
  const isFlex = product === 'flex';
  const flexMax = FLEX.maxAmount;
  const termMax = TERM.maxAmount;
  const max = isFlex ? flexMax : termMax;
  const otherMax = isFlex ? termMax : flexMax;
  const otherName = isFlex ? L.term : L.flex;

  // Clamp the displayed amount to THIS product's cap locally. We never call
  // setAmount to cap, because that would tug a shared amount tweak down and
  // stop other artboards' sliders from moving past this product's max
  // (e.g. the flex-only artboard pinning every slider at $35,000).
  const amount = Math.min(amountProp, max);

  // Value props — how the OTHER product differs from this one.
  const otherProps = isFlex
    ? ['Fixed payments instead of a % of sales', 'Same amount every 2 weeks — predictable']
    : ['Repays as a % of your daily sales', 'Smaller payments on slower days', 'No fixed schedule — flexes with revenue'];

  const [durIdx, setDurIdx] = React.useState(
    isFlex ? FLEX.defaultDurationIdx : TERM.defaultDurationIdx);
  const durs = isFlex ? FLEX.durations : TERM.durations;
  const dur = durs[Math.min(durIdx, durs.length - 1)];

  const fee = Math.round(amount * dur.feeRate);
  const total = Math.round(amount * (1 + dur.feeRate));
  const feeRate = dur.feeRate;
  const flexDur = isFlex ? dur : FLEX.durations[FLEX.defaultDurationIdx];
  const termDur = isFlex ? TERM.durations[TERM.defaultDurationIdx] : dur;
  const termBiweeklyAmt = Math.round(amount * (1 + termDur.feeRate) / termDur.biweeks);
  const flexDone = addMonths(today, flexDur.months);
  const termDone = addDays(today, termDur.weeks * 7);

  const railReviewMode = railReview;
  const useRail = crosssell === 'rail' && !mobile && !railReviewMode;

  const otherCard = (asRail) =>
    <div className={'sk-crossoffer' + (asRail ? ' sk-crossoffer--rail' : '')}>
      <div className="sk-crossoffer-body">
        <span className="sk-crossoffer-title">You also have a {otherName} offer</span>
        {isFlex ? (
          <span className="sk-crossoffer-desc">
            You're pre-approved for up to <b>{usd(termMax)}</b> on {otherName}. Pay the same fixed amount every two weeks.
          </span>
        ) : (
          <span className="sk-crossoffer-desc">
            You're pre-approved for up to <b>{usd(flexMax)}</b> on {otherName}. Repayment amount adjusts based on your sales, so you pay less on slower days.
          </span>
        )}
      </div>
      <button type="button" className="sk-crossoffer-btn"
        onClick={() => onSwitch && onSwitch(isFlex ? 'term' : 'flex')}>
        View {otherName} offer <span aria-hidden="true">→</span>
      </button>
    </div>;

  const _amount = (
    <section className="sk-step">
      <header className="sk-step-head">
        <span className="sk-step-num">1</span>
        <h2 className="sk-step-title">Choose your amount</h2>
      </header>
      <SkAmount amount={amount} setAmount={setAmount}
        flexMax={isFlex ? flexMax : termMax} termMax={max} labels={L} />
    </section>);

  const _duration = (
    <SkDurationStep amount={amount} durIdx={durIdx} setDurIdx={setDurIdx}
      mode={isFlex ? 'flex' : 'term'} stepNum="2" showRate onAdjustAmount={setAmount} />);

  const _illus = (
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
              weeks={termDur.weeks} total={Math.round(amount * (1 + termDur.feeRate))} />}
        </div>
      </div>
    </div>);

  const _plan = (
    <SkPlanPanel
      amount={amount} isFlex={isFlex}
      flexDur={flexDur} termDur={termDur}
      termWeeklyAmt={termBiweeklyAmt}
      flexDone={flexDone} termDone={termDone}
      fee={fee} total={total} feeRate={feeRate}
      labels={L} summaryLevel={summaryLevel} />);

  const _cta = (
    <SkCta amount={amount} choice={product}
      flexDurIdx={isFlex ? durIdx : FLEX.defaultDurationIdx}
      termDurIdx={isFlex ? TERM.defaultDurationIdx : durIdx} labels={L} summary={ctaSummary} />);

  // Lead with WHY a merchant might switch to the other product.
  const switchReasons = isFlex
    ? ['Pay the same fixed amount every two weeks', 'Predictable schedule — easy to budget around']
    : ['Repayment amount fluctuates with your sales', 'More flexible — pay less on slower days'];

  const softOtherCard = (
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

  const _reviewSection = (
    <section className="sk-step">
      <header className="sk-step-head">
        <span className="sk-step-num">3</span>
        <h2 className="sk-step-title">Review your plan</h2>
      </header>
      <div className="sk-review">{_illus}{_plan}</div>
    </section>);

  return (
    <div className={
      'sk sk--ledger' + (fullPage ? ' sk--fullpage' : '') +
      (chrome ? ' sk--chromed' : '') + (mobile ? ' sk--mobile' : '')
    }
      data-screen-label={`Single · ${isFlex ? 'Flex' : 'Term'} · ${railReviewMode ? 'rail-review' : crosssell}${mobile ? ' · Mobile' : ''}`}>
      {chrome && <SkIframeHeader partnerName={partnerName} onClose={onClose} />}
      <div className="sk-page">
        <header style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <h1 className="sk-h1">{L.headline}</h1>
        </header>

        {railReviewMode ?
          (mobile ?
            <React.Fragment>
              {_amount}{_duration}
              <div className="sk-paystack">{_illus}{softOtherCard}</div>
              <div className="sk-rail-merged">{_plan}{_cta}</div>
            </React.Fragment> :
            <div className="sk-single-cols">
              <div className="sk-single-main">
                {_amount}{_duration}
                <div className="sk-paystack">{_illus}{softOtherCard}</div>
              </div>
              <aside className="sk-single-rail sk-single-rail--full">
                <div className="sk-rail-merged">
                  {_plan}
                  {_cta}
                </div>
              </aside>
            </div>
          ) :
        useRail ?
          <div className="sk-single-cols">
            <div className="sk-single-main">{_amount}{_duration}{_reviewSection}{_cta}</div>
            <aside className="sk-single-rail">{otherCard(true)}</aside>
          </div> :
          <React.Fragment>
            {_amount}{_duration}
            <section className="sk-step">
              <header className="sk-step-head">
                <span className="sk-step-num">3</span>
                <h2 className="sk-step-title">Review your plan</h2>
              </header>
              <div className="sk-review">
                <div className="sk-paystack">{_illus}{softOtherCard}</div>
                {_plan}
              </div>
            </section>
            {_cta}
          </React.Fragment>
        }

        <SkPowered />
      </div>
      {chrome && <SkIframeFooter partnerName={partnerName} />}
    </div>);

}

function SkCheck() {
  return (
    <svg viewBox="0 0 16 16" width="14" height="14" fill="none"
      stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 8.5 L6.5 12 L13 4" />
    </svg>);
}

Object.assign(window, { V1bSingle, SkCheck });
