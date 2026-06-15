/* V1B · "Stats out" branch
 *
 * Same Ledger aesthetic, but the "how you pay / expected payoff" stats
 * leave the Step 2 selector cards entirely — those cards become pure
 * choice (radio + name + cap + pitch + illustration). The derived stats
 * surface elsewhere:
 *
 *   previewStyle = "inline-row" — a slim strip between Step 2 and Step 3
 *   previewStyle = "panel"      — a full offer-summary panel after Step 3
 *   previewStyle = "cta-bar"    — a richer two-line sticky CTA at bottom
 *
 * The Step 2 illustration intentionally drops the % from the legend so
 * the card doesn't appear to "lie" about the user's eventual rate.
 */

function V1bStatsOut({
  amount, setAmount, choice, setChoice, recommend,
  termShapeStyle = 'calendar', fullPage = false,
  previewStyle = 'panel', naming = 'product',
  compareStyle = 'none', chrome = false,
  partnerName = 'Hearty Kitchens',
  mobile = false,
  supportStyle = 'inline',
  summaryLevel = 'full',
  layout = 'stacked',
  ctaSummary = 'sentence',
  onClose
}) {
  const L = skLabels(naming);
  const today = new Date('2026-05-20');
  const flexMax = FLEX.maxAmount;
  const termMax = TERM.maxAmount;
  const flexAvailable = amount <= flexMax;
  const isFlex = choice === 'flex';

  const [flexDurIdx, setFlexDurIdx] = React.useState(FLEX.defaultDurationIdx);
  const [termDurIdx, setTermDurIdx] = React.useState(TERM.defaultDurationIdx);

  const flexDur = FLEX.durations[flexDurIdx];
  const termDur = TERM.durations[termDurIdx];
  const flexDone = addMonths(today, flexDur.months);
  const termDone = addDays(today, termDur.weeks * 7);

  const termFeeAmt = Math.round(amount * termDur.feeRate);
  const termTotalAmt = Math.round(amount * (1 + termDur.feeRate));
  const termBiweeklyAmt = Math.round(termTotalAmt / termDur.biweeks);

  const fee = isFlex ? flexFee(amount, flexDurIdx) : termFeeAmt;
  const total = isFlex ? flexTotal(amount, flexDurIdx) : termTotalAmt;
  const feeRate = isFlex ? flexDur.feeRate : termDur.feeRate;

  React.useEffect(() => {
    if (isFlex && amount > flexMax) setChoice('term');
  }, [amount, isFlex, flexMax, setChoice]);

  const onChooseFlex = () => {
    if (amount > flexMax) setAmount(flexMax);
    setChoice('flex');
  };

  const _rail = layout === 'rail' && !mobile;
  const _b1 = (<>{/* ── Step 1 ───────────────────────────────────────── */}
        <section className="sk-step">
          <header className="sk-step-head">
            <span className="sk-step-num">1</span>
            <h2 className="sk-step-title">Choose your amount</h2>
          </header>
          <SkAmount amount={amount} setAmount={setAmount}
          flexMax={flexMax} termMax={termMax} labels={L} />
        </section>

        </>);
  const _b2 = (<>{/* ── Step 2: slim cards, illustration only ─────────── */}
        <section className="sk-step">
          <header className="sk-step-head">
            <span className="sk-step-num">2</span>
            <h2 className="sk-step-title">{L.repaymentTitle}</h2>
          </header>
          <div className="sk-twin">
            <SkSlimOptionCard
              isOn={isFlex}
              disabled={!flexAvailable}
              recommend={recommend === 'flex'}
              onChoose={onChooseFlex}
              headline="Pay as you sell"
              productName={L.flex} cap={`Up to ${usd(flexMax)}`}
              pitch={!flexAvailable ?
              <span style={{ color: "rgb(0, 0, 0)" }}>Only available for {usd(flexMax)} and under</span> :
              "A percentage of your daily sales is debited automatically every day until repaid."
              }
              footerNote={!flexAvailable ?
              <span className="sk-dur-card-adjust" role="button" tabIndex={0}
                onClick={(e) => { e.stopPropagation(); setAmount(flexMax); setChoice('flex'); }}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); e.stopPropagation(); setAmount(flexMax); setChoice('flex'); } }}>
                Lower amount to {usd(flexMax)} to unlock <span aria-hidden="true">→</span>
              </span> : null}
              shape={!flexAvailable ? null : <SkFlexShape holdback={flexDur.holdback} />}
              statFooter={!flexAvailable ? null : compareStyle === 'card-footer' || compareStyle === 'both' ? {
                label: 'How you pay',
                value: `${Math.round(flexDur.holdback * 100)}% of daily sales`,
                meta: `For ${flexDur.months}-mo term`
              } : null} />
            
            <SkSlimOptionCard
              isOn={!isFlex}
              recommend={recommend === 'term'}
              onChoose={() => setChoice('term')}
              headline="Pay a fixed amount"
              productName={L.term} cap={`Up to ${usd(termMax)}`}
              pitch="The same payment, made every two weeks."
              shape={<SkTermShape variant={termShapeStyle}
              weekly={termBiweeklyAmt}
              weeks={termDur.weeks}
              total={termTotalAmt} />}
              statFooter={compareStyle === 'card-footer' || compareStyle === 'both' ? {
                label: 'How you pay',
                value: `${usd(termBiweeklyAmt)} every 2 weeks`,
                meta: `For ${termDur.months}-mo term`
              } : null} />
            
          </div>
        </section>

        </>);
  const _b3 = (<>{/* ── Optional compare table after step 2 ─────────── */}
        {(compareStyle === 'compare-table' || compareStyle === 'both') &&
        <SkCompareTable
          isFlex={isFlex}
          amount={amount}
          flexDur={flexDur} termDur={termDur}
          termWeeklyAmt={termBiweeklyAmt}
          flexDone={flexDone} termDone={termDone}
          flexMax={flexMax} termMax={termMax}
          labels={L} />

        }

        </>);
  const _b4 = (<>{/* ── Optional preview between step 2 and step 3 ─────── */}
        {previewStyle === 'inline-row' && (isFlex ? flexAvailable : true) &&
        <SkInlinePreview
          isFlex={isFlex}
          holdback={flexDur.holdback}
          weekly={termBiweeklyAmt}
          durationMonths={isFlex ? flexDur.months : termDur.months}
          labels={L} />

        }

        </>);
  const _b5 = (<>{/* ── Step 3 ──────────────────────────────────────────── */}
        {isFlex && flexAvailable &&
        <SkDurationStep
          amount={amount}
          durIdx={flexDurIdx} setDurIdx={setFlexDurIdx}
          mode="flex" onAdjustAmount={setAmount} />

        }
        {!isFlex &&
        <SkDurationStep
          amount={amount}
          durIdx={termDurIdx} setDurIdx={setTermDurIdx}
          mode="term" onAdjustAmount={setAmount} />

        }

        </>);
  const _b6 = (<>{/* ── Step 4 — Review (plan + funding + support) ──────── */}
        {previewStyle === 'panel' &&
        <section className="sk-step">
            <header className="sk-step-head">
              <span className="sk-step-num">4</span>
              <h2 className="sk-step-title">Review your plan</h2>
            </header>
            <div className="sk-review">
              <SkPlanPanel
              amount={amount}
              isFlex={isFlex}
              flexDur={flexDur}
              termDur={termDur}
              termWeeklyAmt={termBiweeklyAmt}
              flexDone={flexDone}
              termDone={termDone}
              fee={fee} total={total} feeRate={feeRate}
              labels={L} summaryLevel={summaryLevel} />
            </div>
          </section>
        }

        </>);
  const _b7 = (<>{/* ── CTA bar ─────────────────────────────────────────── */}
        {previewStyle === 'cta-bar' ?
        <SkRichCta
          amount={amount}
          isFlex={isFlex}
          flexDur={flexDur}
          termDur={termDur}
          termWeeklyAmt={termBiweeklyAmt}
          flexDone={flexDone}
          termDone={termDone}
          total={total}
          labels={L} /> :


        <SkCta amount={amount} choice={choice}
        flexDurIdx={flexDurIdx} termDurIdx={termDurIdx} labels={L} summary={ctaSummary} />
        }

        </>);

  return (
    <div className={
    'sk sk--ledger' + (
    fullPage ? ' sk--fullpage' : '') + (
    chrome ? ' sk--chromed' : '') + (
    mobile ? ' sk--mobile' : '')
    }
    data-screen-label={`V1B · Stats out · ${previewStyle}${mobile ? ' · Mobile' : ''}`}>
      {chrome && <SkIframeHeader partnerName={partnerName} onClose={onClose} />}
      <div className="sk-page">
        <header style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <h1 className="sk-h1">{L.headline}</h1>
        </header>

        {_rail ?
        <div className="sk-cols">
          <div className="sk-cols-main">
            {_b1}{_b2}{_b3}{_b4}{_b5}
          </div>
          <aside className="sk-cols-rail">
            <div className="sk-rail-merged">{_b6}{_b7}</div>
            <p className="sk-rail-support">Have questions? <button type="button" className="sk-link">Schedule a call</button></p>
          </aside>
        </div> :
        <React.Fragment>
          {_b1}{_b2}{_b3}{_b4}{_b5}{_b6}{_b7}
        </React.Fragment>
        }

        <SkPowered />
      </div>
      {chrome && <SkIframeFooter partnerName={partnerName} />}
    </div>);

}

/* Slim card — leads with the action phrase. Product name + cap demoted
 * to a small uppercase secondary line. */
function SkSlimOptionCard({
  isOn, disabled, recommend, onChoose,
  headline, productName, cap, pitch, shape, shapeCap, statFooter, footerNote
}) {
  const cls = ['sk-card', 'sk-card--slim'];
  if (isOn) cls.push('is-on');
  if (disabled) cls.push('is-disabled');
  return (
    <article className={cls.join(' ')}
    onClick={() => {if (!disabled) onChoose();}}
    role="radio" aria-checked={isOn} aria-disabled={disabled}
    tabIndex={disabled ? -1 : 0}
    onKeyDown={(e) => !disabled && (e.key === 'Enter' || e.key === ' ') && onChoose()} style={{ color: "rgb(230, 230, 230)" }}>
      <div className="sk-card-head">
        <span className="sk-radio" />
        <div className="sk-card-title-row">
          <div className="sk-card-product-line">
            <span className="sk-card-product">{productName}</span>
            <span className="sep">·</span>
            <span className="cap" style={{ color: "rgb(43, 111, 219)" }}>{cap}</span>
          </div>
          <div className="sk-card-nameline">
            <h3 className="sk-card-name" style={{ fontSize: "17px" }}>{headline}</h3>
            {recommend && <span className="sk-tag">Recommended</span>}
          </div>
          {pitch && <p className="sk-card-pitch">{pitch}</p>}
          {footerNote}
        </div>
      </div>
      {shape &&
      <div className="sk-shape">
          <div className="sk-shape-row">{shape}</div>
          {shapeCap && <span className="sk-shape-cap">{shapeCap}</span>}
        </div>
      }
      {statFooter &&
      <div className="sk-card-stat-footer">
          <span>
            <span className="label">{statFooter.label}</span>{' '}
            <span className="value">{statFooter.value}</span>
          </span>
          <span className="meta">{statFooter.meta}</span>
        </div>
      }
    </article>);

}

/* Compare table — side-by-side stats for both options. The selected
 * column is brand-tinted (not full-fill) so the comparison reads at a
 * glance without obscuring the unselected option. */
function SkCompareTable({
  isFlex, amount, flexDur, termDur, termWeeklyAmt,
  flexDone, termDone, flexMax, termMax, labels
}) {
  const L = labels;
  const rows = [
  {
    label: 'How you pay',
    flex: `${Math.round(flexDur.holdback * 100)}% of daily sales`,
    term: `${usd(termWeeklyAmt)} every 2 weeks`
  },
  {
    label: 'Cadence',
    flex: 'Daily · % of revenue',
    term: 'Weekly · same day'
  },
  {
    label: 'Expected payoff',
    flex: `${flexDur.months} months · ${fmtDate(flexDone)}`,
    term: `${termDur.months} months · ${fmtDate(termDone)}`
  },
  {
    label: 'Capital fee',
    flex: `${(flexDur.feeRate * 100).toFixed(1)}% · ${usd(Math.round(amount * flexDur.feeRate))}`,
    term: `${(termDur.feeRate * 100).toFixed(1)}% · ${usd(Math.round(amount * termDur.feeRate))}`
  },
  {
    label: 'Total',
    flex: usd(Math.round(amount * (1 + flexDur.feeRate))),
    term: usd(Math.round(amount * (1 + termDur.feeRate)))
  }];

  return (
    <section className="sk-compare">
      <header className="sk-compare-head">
        <div className="label-cell">Side by side</div>
        <div className={'option-cell' + (isFlex ? ' is-on' : '')}>
          <span className="name">{L.flex}</span>
          <span className="cap">≤ {usd(flexMax)}</span>
        </div>
        <div className={'option-cell' + (!isFlex ? ' is-on' : '')}>
          <span className="name">{L.term}</span>
          <span className="cap">≤ {usd(termMax)}</span>
        </div>
      </header>
      {rows.map((r, i) =>
      <div key={i} className="sk-compare-row">
          <span className="label">{r.label}</span>
          <span className={'value' + (isFlex ? ' on' : ' dim')}>{r.flex}</span>
          <span className={'value' + (!isFlex ? ' on' : ' dim')}>{r.term}</span>
        </div>
      )}
    </section>);

}

/* Single-line preview strip — sits between Step 2 and Step 3. */
function SkInlinePreview({ isFlex, holdback, weekly, durationMonths, labels }) {
  return (
    <div className="sk-inline-preview">
      <span className="label">Your plan so far</span>
      {isFlex ?
      <span>
          Pay back <b>{Math.round(holdback * 100)}%</b> of daily sales for about <b>{durationMonths} months</b>.
        </span> :

      <span>
          Pay <b>{usd(weekly)}/week</b> for <b>{durationMonths} months</b>, same day each week.
        </span>
      }
    </div>);

}

/* Offer summary panel — derived stats. `summaryLevel` selects how much:
 *   'full'    — term length, repayment rate, capital fee, capital amount, total
 *   'minimal' — capital fee + total owed only
 */
function SkPlanPanel({
  amount, isFlex, flexDur, termDur, termWeeklyAmt,
  flexDone, termDone, fee, total, feeRate, labels, summaryLevel = 'full'
}) {
  const L = labels;
  const minimal = summaryLevel === 'minimal';
  return (
    <div className="sk-card-block">
      <section className="sk-plan">
        <div className="sk-plan-grid">
        {!minimal &&
        <React.Fragment>
          <div className="sk-plan-item">
            <span className="label">
              {isFlex ? 'Est. payoff' : 'Term length'}
              <SkInfo title={isFlex
                ? 'Estimated time to fully repay, based on your recent sales. Actual payoff varies with daily sales.'
                : 'How long it takes to fully repay your capital.'} />
            </span>
            <span className="value">
              {isFlex ? `~${flexDur.months} months` : `${termDur.months} months`}
            </span>
          </div>
          <div className="sk-plan-item">
            <span className="label">Repayment rate</span>
            <span className="value">
              {isFlex ?
                `${Math.round(flexDur.holdback * 100)}% of daily sales` :
                `${usd(termWeeklyAmt)} every 2 weeks`}
            </span>
          </div>
          <div className="sk-plan-divider" />
        </React.Fragment>
        }
        <div className="sk-plan-item">
          <span className="label">
            Capital fee
            <SkInfo title="A one-time fee on the principal, included in your total. Not an interest rate — what you see is what you pay." />
          </span>
          <span className="value">{usd(fee)}</span>
        </div>
        {!minimal &&
        <div className="sk-plan-item">
          <span className="label">Capital amount</span>
          <span className="value">{usd(amount)}</span>
        </div>
        }

        <div className="sk-plan-divider" />

        <div className="sk-plan-item total">
          <span className="label">Total owed</span>
          <span className="value">{usd(total)}</span>
        </div>
      </div>
      </section>
    </div>);

}

/* Rich CTA — two-line summary inside the sticky bar. */
function SkRichCta({
  amount, isFlex, flexDur, termDur, termWeeklyAmt,
  flexDone, termDone, total, labels
}) {
  const L = labels;
  return (
    <div className="sk-cta sk-cta--rich">
      <div className="sk-cta-summary-stack">
        <div className="line1">
          <span><b>{usd(amount)}</b> borrowed</span>
          <span className="sep">·</span>
          <span><b>{isFlex ? L.flex : L.term}</b></span>
          <span className="sep">·</span>
          <span><b>{isFlex ? flexDur.months : termDur.months} months</b></span>
        </div>
        <div className="line2">
          {isFlex ?
          <>{Math.round(flexDur.holdback * 100)}% of daily sales</> :
          <>{usd(termWeeklyAmt)} every 2 weeks</>}
          {' · Total '}<b style={{ color: 'var(--sk-ink)', fontWeight: 500 }}>{usd(total)}</b>
          {' · Done ~'}{fmtDate(isFlex ? flexDone : termDone)}
        </div>
      </div>
      <button className="sk-btn">
        Get Started
        <span style={{ opacity: 0.6 }}>→</span>
      </button>
    </div>);

}

Object.assign(window, {
  V1bStatsOut, SkSlimOptionCard, SkInlinePreview, SkPlanPanel, SkRichCta,
  SkCompareTable, SkFundingRow, SkSupportCard
});

/* SkSupportCard — "talk to a human" callout. Text-style CTA so it doesn't
 * compete with the primary Continue button at the bottom of the page. */
function SkSupportCard({ variant = 'inline' }) {
  return (
    <section className={'sk-support sk-support--' + variant}>
      <span className="sk-support-icon" aria-hidden="true">
        <PhoneIcon />
      </span>
      <div className="sk-support-text">
        <h3 className="sk-support-title">Schedule a call with a capital program specialist</h3>
        <p className="sk-support-body">
          A specialist from Parafin can walk you through your offer and answer
          questions about the capital program.
        </p>
      </div>
      <button type="button" className="sk-text-btn">
        Schedule a call <span aria-hidden="true">→</span>
      </button>
    </section>);

}

function PhoneIcon() {
  return (
    <svg viewBox="0 0 16 16" width="16" height="16" fill="none"
    stroke="currentColor" strokeWidth="1.5"
    strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3.5 3 C3.5 2.4 4 2 4.5 2 L6.2 2 C6.7 2 7.1 2.4 7.2 2.9 L7.7 5 C7.8 5.5 7.6 6 7.1 6.2 L5.9 6.8 C6.9 8.5 8.5 10.1 10.2 11.1 L10.8 9.9 C11 9.4 11.5 9.2 12 9.3 L14.1 9.8 C14.6 9.9 15 10.3 15 10.8 L15 12.5 C15 13 14.6 13.5 14 13.5 C7.9 13.5 3.5 9.1 3.5 3 Z" />
    </svg>);

}

/* SkFundingRow — Funds destination row shown beneath the offer summary.
 * Static Chase placeholder for the mock; would be driven by the user's
 * connected account in production.
 */
function SkFundingRow({ bankName = 'Chase', last4 = '4829', eta = '1–2 days' }) {
  return (
    <div className="sk-card-block">
      <h3 className="sk-card-label">Funding</h3>
      <section className="sk-funding">
        <div className="sk-funding-row">
          <div className="sk-funding-left">
            <ChaseLogo />
            <div className="sk-funding-meta">
              <div className="sk-funding-name">{bankName} Business Checking</div>
              <div className="sk-funding-num">···· {last4}</div>
            </div>
          </div>
          <span className="sk-funding-pill">
            <BoltIcon /> {eta}
          </span>
        </div>
      </section>
    </div>);

}

/* Approximation of the Chase 4-quadrant octagon mark. */
function ChaseLogo() {
  return (
    <svg viewBox="0 0 100 100" width="26" height="26" aria-hidden="true">
      <g fill="#117ACA">
        <path d="M30 5 L70 5 L62 30 L38 30 Z" />
        <path d="M95 30 L95 70 L70 62 L70 38 Z" />
        <path d="M70 95 L30 95 L38 70 L62 70 Z" />
        <path d="M5 70 L5 30 L30 38 L30 62 Z" />
      </g>
    </svg>);

}

function BoltIcon() {
  return (
    <svg viewBox="0 0 16 16" width="11" height="11" fill="currentColor" aria-hidden="true">
      <path d="M9.6 1 L3 9 H7.5 L6.4 15 L13 7 H8.5 Z" />
    </svg>);

}

Object.assign(window, { SkFundingRow, ChaseLogo, BoltIcon, SkIframeHeader, SkIframeFooter });
function SkIframeHeader({ partnerName = 'Hearty Kitchens', onClose }) {
  const initials = partnerName.split(/\s+/).map((w) => w[0]).join('').slice(0, 2).toUpperCase();
  return (
    <div className="sk-iframe-header">
      <div className="sk-iframe-logo">
        <span className="sk-iframe-logo-mark">{initials}</span>
        <span>{partnerName}</span>
      </div>
      <button type="button" className="sk-iframe-close" aria-label="Close" onClick={onClose}>
        <svg viewBox="0 0 16 16" width="14" height="14" fill="none"
        stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
          <path d="M4 4l8 8M12 4l-8 8" />
        </svg>
      </button>
    </div>);

}

/* White-label footer — partner disclosures. */
function SkIframeFooter({ partnerName = 'Hearty Kitchens' }) {
  return (
    <footer className="sk-iframe-footer">
      <p>
        <b>Disclosures.</b> Working capital and term loans are offered by Parafin, Inc. or
        its lending partners. Eligibility, approval amounts, fees, and repayment
        terms vary based on business performance and account history, and may
        change without notice. Quoted repayment durations are estimates derived
        from your last 90 days of sales and are not guaranteed.
      </p>
      <p>
        Funds typically arrive in your linked business account within 1–2 business
        days of acceptance. By continuing, you authorize ACH debits from that
        account as described in your loan agreement. Offer valid through Jun 14,
        2026, or until withdrawn. See your final agreement for the complete
        terms, including any state-specific disclosures.
      </p>
      <p>
        © 2026 {partnerName}. Working capital powered by Parafin.
      </p>
    </footer>);

}