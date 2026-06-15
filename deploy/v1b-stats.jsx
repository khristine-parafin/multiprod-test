/* V1B — Twin hero stats
 * Two cards, each with the radio at top + TWO oversized numeric heroes:
 *   1) "How you pay"     — 12% of daily sales   /   $566 every week
 *   2) "Expected payoff" — ~7 months           /   52 weeks (Apr 14, 2027)
 * Mini repayment shape demoted to context strip. Spec table compressed.
 *
 * Goal: at a glance, the user sees the only two questions that matter —
 *   the cadence of each payment and when the obligation ends.
 */

function V1bStats({ amount, setAmount, choice, setChoice, recommend }) {
  const today = new Date('2026-05-20');
  const flexMax = FLEX.maxAmount;
  const termMax = TERM.maxAmount;
  const flexAvailable = amount <= flexMax;

  // Flex has two contractable durations — 9 or 12 months.
  const [flexDurIdx, setFlexDurIdx] = React.useState(FLEX.defaultDurationIdx);
  const flexDur = FLEX.durations[flexDurIdx];
  const flexDone = addMonths(today, flexDur.months);
  const termDone = addDays(today, TERM.weeks * 7);

  // Auto-switch to Term if the user pushes the amount past Flex's cap.
  React.useEffect(() => {
    if (choice === 'flex' && amount > flexMax) setChoice('term');
  }, [amount, choice, flexMax, setChoice]);

  // Clicking the (otherwise disabled) Flex card clamps amount + selects.
  const onChooseFlex = () => {
    if (amount > flexMax) setAmount(flexMax);
    setChoice('flex');
  };

  return (
    <div className="ofr" data-screen-label="V1B Twin hero stats">
      <header style={{display:'flex',flexDirection:'column',gap:8}}>
        <div className="ofr-eyebrow"><span className="pip"/> Capital offer · Hearty Kitchens</div>
        <h1 className="ofr-title">Configure your capital.</h1>
        <p className="ofr-lede">
          You're approved for <b>up to {usd(termMax)}</b> with Term, or{' '}
          <b>up to {usd(flexMax)}</b> with Flex. Pick an amount and how
          you'd like to pay it back.
        </p>
      </header>

      {/* STEP 1 — Amount */}
      <section className="ofr-step">
        <header className="ofr-step-head">
          <span className="ofr-step-num">1</span>
          <div className="ofr-step-titles">
            <h2 className="ofr-step-title">Choose your amount</h2>
            <p className="ofr-step-sub">
              From {usd(5000)} up to {usd(termMax)}. Amounts above{' '}
              <b>{usd(flexMax)}</b> are Term-only.
            </p>
          </div>
        </header>
        <AmountCard amount={amount} setAmount={setAmount} flexMax={flexMax}/>
      </section>

      {/* STEP 2 — Repayment */}
      <section className="ofr-step">
        <header className="ofr-step-head">
          <span className="ofr-step-num">2</span>
          <div className="ofr-step-titles">
            <h2 className="ofr-step-title">Choose how to repay</h2>
            <p className="ofr-step-sub">Same amount. Two ways to pay it back.</p>
          </div>
        </header>

        <div className="v1-compare">
        <V1bCard
          option="flex" name="Flex"
          cap={`Up to ${usd(flexMax)}`}
          pitch={FLEX.tagline}
          pitchSub={FLEX.pitchSub}
          isOn={choice === 'flex'}
          disabled={!flexAvailable}
          recommend={recommend === 'flex'}
          onChoose={onChooseFlex}
          unavailableNote={
            !flexAvailable && (
              <React.Fragment>
                <b>Not available at {usd(amount)}.</b>{' '}
                Flex caps at {usd(flexMax)} because repayments come from your daily sales.{' '}
                <button
                  className="ofr-clamp-btn"
                  onClick={(e) => { e.stopPropagation(); onChooseFlex(); }}
                >
                  Reduce to {usd(flexMax)} and use Flex
                </button>
              </React.Fragment>
            )
          }
          payHero={<><span className="v1b-num">{Math.round(flexDur.holdback*100)}%</span><span className="v1b-unit">of daily sales</span></>}
          payCaption="Every business day · Auto-debit"
          payoffHero={
            flexAvailable ? (
              <V1bDurChips
                durations={FLEX.durations}
                value={flexDurIdx}
                onChange={(i) => {
                  setFlexDurIdx(i);
                  if (choice !== 'flex') onChooseFlex();
                }}
              />
            ) : (
              <><span className="v1b-num">{flexDur.months}</span><span className="v1b-unit">months</span></>
            )
          }
          payoffCaption={`Around ${fmtDate(flexDone)} · Faster if sales grow`}
          shape={<FlexShape/>}
          shapeCap={`Last 14 business days · varies with revenue`}
          fee={flexFee(amount, flexDurIdx)} feeRate={flexDur.feeRate}
          total={flexTotal(amount, flexDurIdx)}
        />
        <V1bCard
          option="term" name="Term"
          cap={`Up to ${usd(termMax)}`}
          pitch={TERM.tagline}
          pitchSub={TERM.pitchSub}
          isOn={choice === 'term'}
          recommend={recommend === 'term'}
          onChoose={() => setChoice('term')}
          payHero={<><span className="v1b-num">{usd(termWeekly(amount))}</span><span className="v1b-unit">every week</span></>}
          payCaption="Same day, every week · Auto-debit"
          payoffHero={<><span className="v1b-num">{TERM.weeks}</span><span className="v1b-unit">weeks</span></>}
          payoffCaption={`Done ${fmtDate(termDone)} · Date doesn't move`}
          shape={<TermShape/>}
          shapeCap={`Same fixed payment, every week`}
          fee={termFee(amount)} feeRate={0.094}
          total={termTotal(amount)}
        />
        </div>
      </section>

      <V1CTA amount={amount} choice={choice} flexDurIdx={flexDurIdx}/>

      <Powered/>
    </div>
  );
}

function V1bCard({
  option, name, cap, pitch, pitchSub, isOn, disabled, recommend, onChoose,
  payHero, payCaption, payoffHero, payoffCaption,
  shape, shapeCap, fee, feeRate, total, unavailableNote, extras,
}) {
  const cls = ['v1-card', 'v1b-card'];
  if (isOn) cls.push('is-on');
  if (disabled) cls.push('is-disabled');
  return (
    <article
      className={cls.join(' ')}
      onClick={() => { if (!disabled) onChoose(); }}
      role="radio" aria-checked={isOn} aria-disabled={disabled} tabIndex={disabled ? -1 : 0}
      onKeyDown={e => !disabled && (e.key === 'Enter' || e.key === ' ') && onChoose()}
    >
      <div className="v1-card-head">
        <span className="v1-radio"/>
        <div style={{display:'flex',flexDirection:'column',gap:6,flex:1,minWidth:0}}>
          <div className="v1-card-nameline">
            <h2 className="v1-card-name">{name}</h2>
            {cap && <span className="v1-card-cap">{cap}</span>}
            {recommend && <span className="v1-card-tag">Recommended</span>}
          </div>
          <p className="v1-card-pitch">{pitch}</p>
          {pitchSub && <p className="v1-card-pitch-sub">{pitchSub}</p>}
        </div>
      </div>

      {unavailableNote ? (
        <div className="v1-card-unavailable">{unavailableNote}</div>
      ) : (
        <React.Fragment>
          {extras}
          <div className="v1b-hero-grid">
            <section className="v1b-hero">
              <span className="v1b-hero-label">How you pay</span>
              <div className="v1b-hero-val">{payHero}</div>
              <span className="v1b-hero-cap">{payCaption}</span>
            </section>

            <section className="v1b-hero">
              <span className="v1b-hero-label">Expected payoff</span>
              <div className="v1b-hero-val">{payoffHero}</div>
              <span className="v1b-hero-cap">{payoffCaption}</span>
            </section>
          </div>

          <div className="v1b-shape">
            {shape}
            <span className="v1b-shape-cap">{shapeCap}</span>
          </div>

          <div className="v1b-totals">
            <div className="v1b-totals-row">
              <span>Capital fee</span>
              <span>{usd(fee)} <span style={{color:'var(--dv-black-50)',fontWeight:400,marginLeft:2}}>({(feeRate*100).toFixed(1)}%)</span></span>
            </div>
            <div className="v1b-totals-row total">
              <span>Total you'll pay</span>
              <span>{usd(total)}</span>
            </div>
          </div>
        </React.Fragment>
      )}
    </article>
  );
}

function V1bDurChips({ durations, value, onChange }) {
  return (
    <div className="v1b-dur-chips" onClick={(e) => e.stopPropagation()}>
      {durations.map((d, i) => (
        <button
          key={i}
          type="button"
          className={'v1b-dur-chips-btn' + (i === value ? ' on' : '')}
          onClick={(e) => { e.stopPropagation(); onChange(i); }}
        >
          <span className="v1b-dur-chips-num">{d.months}</span>
          <span className="v1b-dur-chips-unit">months</span>
        </button>
      ))}
    </div>
  );
}

function V1bDurSwap({ durations, value, onChange }) {
  return (
    <div className="v1b-dur-swap" onClick={(e) => e.stopPropagation()}>
      {durations.map((d, i) => (
        <button
          key={i}
          type="button"
          className={'v1b-dur-swap-btn' + (i === value ? ' on' : '')}
          onClick={(e) => { e.stopPropagation(); onChange(i); }}
        >
          <span className="v1b-num">{d.months}</span>
          <span className="v1b-unit">mo</span>
        </button>
      ))}
    </div>
  );
}

function V1bDurationPicker({ durations, value, onChange }) {
  return (
    <div className="v1b-duration">
      <div className="v1b-duration-row">
        <span className="v1b-duration-label">Duration</span>
        <div className="ofr-seg" onClick={(e) => e.stopPropagation()}>
          {durations.map((d, i) => (
            <button
              key={i}
              type="button"
              className={i === value ? 'on' : ''}
              onClick={(e) => { e.stopPropagation(); onChange(i); }}
            >
              {d.months} months
            </button>
          ))}
        </div>
      </div>
      <p className="v1b-duration-help">
        {durations[value].months === 9
          ? 'Faster payoff, bigger daily bite, lower total fee.'
          : 'Smaller daily bite, more months, higher total fee.'}
      </p>
    </div>
  );
}

/* helpers */
function addMonths(d, n) { const x = new Date(d); x.setMonth(x.getMonth() + n); return x; }
function addDays(d, n)   { const x = new Date(d); x.setDate(x.getDate() + n); return x; }
function fmtDate(d) { return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }); }

function V1CTA({ amount, choice, flexDurIdx = FLEX.defaultDurationIdx }) {
  const flexDur = FLEX.durations[flexDurIdx];
  const summary = choice === 'flex'
    ? <>You'll borrow <b>{usd(amount)}</b> and pay back <b>{Math.round(flexDur.holdback*100)}%</b> of daily sales until <b>{usd(flexTotal(amount, flexDurIdx))}</b> is repaid.</>
    : <>You'll borrow <b>{usd(amount)}</b> and pay <b>{usd(termWeekly(amount))}</b>/week for <b>{TERM.weeks} weeks</b>.</>;
  return (
    <div className="v1-cta">
      <div className="v1-cta-line">
        <span>{summary}</span>
        <span style={{whiteSpace:'nowrap'}}>Total {usd(choice === 'flex' ? flexTotal(amount, flexDurIdx) : termTotal(amount))}</span>
      </div>
      <button className="ofr-btn ofr-btn-primary ofr-btn-lg ofr-btn-block">
        Continue with {choice === 'flex' ? 'Flex' : 'Term'}
      </button>
    </div>
  );
}

function Powered() {
  return (
    <span className="ofr-poweredby">
      Powered by
      <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMi4wMjAiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMi4wMjAgMzIiIGZpbGw9Im5vbmUiPgogIDxwYXRoIGQ9Ik0gMTYuNjA0IDEwLjI3IEwgMTcuNjI4IDAuMDggQyAxNy4wOSAwLjAyNiAxNi41NSAwIDE2LjAxIDAgQyAxNS40OSAwIDE0Ljk3NSAwLjAyNSAxNC40NjcgMC4wNzQgTCAxNC45NTggNS4wODQgQyAxNS4zMTEgNC45NTcgMTUuNjczIDQuODQ0IDE2LjA0MSA0Ljc1MyBMIDE2LjAzNSAxMC4yNDEgQyAxNi4yMjcgMTAuMjQgMTYuNDE3IDEwLjI1MSAxNi42MDQgMTAuMjcgWiIgZmlsbD0iY3VycmVudENvbG9yIiBmaWxsLXJ1bGU9Im5vbnplcm8iPjwvcGF0aD4KICA8cGF0aCBkPSJNIDExLjMyOCA3LjIgQyAxMS41ODcgNi45NzggMTEuODU1IDYuNzY3IDEyLjEzMiA2LjU2OCBMIDEzLjgyNiAxMC42NjcgQyAxNC4wMDEgMTAuNTk2IDE0LjE4MSAxMC41MzMgMTQuMzY0IDEwLjQ4IEwgMTEuNDA4IDAuNjcyIEMgMTAuMzk2IDAuOTc2IDkuNDE3IDEuMzc5IDguNDg1IDEuODc2IEwgMTEuMzI4IDcuMiBaIiBmaWxsPSJjdXJyZW50Q29sb3IiIGZpbGwtcnVsZT0ibm9uemVybyI+PC9wYXRoPgogIDxwYXRoIGQ9Ik0gMTkuNTUgNC40MTkgQyAxOS45NjUgNC40NDIgMjAuMzc4IDQuNDg3IDIwLjc4NyA0LjU1NSBMIDE4LjIzOCAxMC42ODYgQyAxOC40MTQgMTAuNzYgMTguNTg1IDEwLjg0MiAxOC43NTIgMTAuOTMyIEwgMjMuNiAxLjkwOSBDIDIyLjY3IDEuNDA4IDIxLjY5MyAxLjAwMSAyMC42ODMgMC42OTMgTCAxOS41NSA0LjQxOSBaIiBmaWxsPSJjdXJyZW50Q29sb3IiIGZpbGwtcnVsZT0ibm9uemVybyI+PC9wYXRoPgogIDxwYXRoIGQ9Ik0gOS4zODQgOS4zNDUgQyA5LjIwOCA5LjYwMiA5LjAzOSA5Ljg2NCA4Ljg3OSAxMC4xMyBMIDMuNjQ1IDUuODM0IEMgNC4zMTcgNS4wMTkgNS4wNjcgNC4yNzIgNS44ODYgMy42MDQgTCAxMi4zNyAxMS41MzIgQyAxMi4yMjIgMTEuNjUyIDEyLjA4MSAxMS43NzkgMTEuOTQ2IDExLjkxNCBMIDkuMzg0IDkuMzQ1IFoiIGZpbGw9ImN1cnJlbnRDb2xvciIgZmlsbC1ydWxlPSJub256ZXJvIj48L3BhdGg+CiAgPHBhdGggZD0iTSAyMC4wOTkgMTEuOTQxIEwgMjUuNTU0IDYuNTAxIEMgMjUuMTg5IDYuMjQ0IDI0LjgwOCA2LjAwOCAyNC40MTUgNS43OTYgTCAyNi4xODQgMy42NDMgQyAyNi45OTggNC4zMTUgMjcuNzQ1IDUuMDY1IDI4LjQxMiA1Ljg4MyBMIDIwLjQ3OSAxMi4zNjMgQyAyMC4zNTkgMTIuMjE2IDIwLjIzMiAxMi4wNzUgMjAuMDk5IDExLjk0MSBaIiBmaWxsPSJjdXJyZW50Q29sb3IiIGZpbGwtcnVsZT0ibm9uemVybyI+PC9wYXRoPgogIDxwYXRoIGQ9Ik0gMjEuNTMzIDE0LjM0MyBMIDMxLjM0NyAxMS4zODkgQyAzMS4wNDMgMTAuMzc5IDMwLjYzOSA5LjQwMSAzMC4xNDIgOC40NzEgTCAyOC40MyA5LjM4NSBDIDI4LjY5NyA5Ljc3IDI4Ljk0MSAxMC4xNzEgMjkuMTYxIDEwLjU4NSBMIDIxLjM0MSAxMy44MDggQyAyMS40MTQgMTMuOTgzIDIxLjQ3OCAxNC4xNjIgMjEuNTMzIDE0LjM0MyBaIiBmaWxsPSJjdXJyZW50Q29sb3IiIGZpbGwtcnVsZT0ibm9uemVybyI+PC9wYXRoPgogIDxwYXRoIGQ9Ik0gMjUuNTMgMjUuNTIgQyAyNS45MDEgMjUuMjU5IDI2LjI1OCAyNC45NzcgMjYuNTk3IDI0LjY3NSBMIDI4LjM4MyAyNi4xNTEgQyAyNy43MTMgMjYuOTY2IDI2Ljk2NSAyNy43MTMgMjYuMTQ5IDI4LjM4MiBMIDE5LjY2NSAyMC40NTQgQyAxOS44MTIgMjAuMzM0IDE5Ljk1MiAyMC4yMDYgMjAuMDg2IDIwLjA3MiBMIDI1LjUzIDI1LjUyIFoiIGZpbGw9ImN1cnJlbnRDb2xvciIgZmlsbC1ydWxlPSJub256ZXJvIj48L3BhdGg+CiAgPHBhdGggZD0iTSAzMC40OTkgMTYuMDE2IEwgMzAuNDk5IDE2IEMgMzAuNDk5IDE1LjUzIDMwLjQ3IDE1LjA2MSAzMC40MTMgMTQuNTk1IEwgMzEuOTQ0IDE0LjQ0NSBDIDMxLjk5NCAxNC45NTggMzIuMDIgMTUuNDc4IDMyLjAyIDE2LjAwNCBDIDMyLjAyIDE2LjU0MyAzMS45OTMgMTcuMDc1IDMxLjk0IDE3LjYgTCAyMS43NDUgMTYuNTc0IEMgMjEuNzYzIDE2LjM4NyAyMS43NzQgMTYuMTk4IDIxLjc3NCAxNi4wMDYgTCAzMC40OTkgMTYuMDE2IFoiIGZpbGw9ImN1cnJlbnRDb2xvciIgZmlsbC1ydWxlPSJub256ZXJvIj48L3BhdGg+CiAgPHBhdGggZD0iTSA5LjM3MiAyMi42NCBMIDExLjkzOSAyMC4wOCBDIDExLjgwNSAxOS45NDYgMTEuNjc3IDE5LjgwNSAxMS41NTUgMTkuNjU4IEwgMy42MjMgMjYuMTM4IEMgNC4yOTMgMjYuOTU2IDUuMDQyIDI3LjcwNiA1Ljg1OSAyOC4zNzggTCA5Ljk0OSAyMy40MDEgQyA5Ljc0NyAyMy4xNTMgOS41NTUgMjIuODk5IDkuMzcyIDIyLjY0IFoiIGZpbGw9ImN1cnJlbnRDb2xvciIgZmlsbC1ydWxlPSJub256ZXJvIj48L3BhdGg+CiAgPHBhdGggZD0iTSA3LjI4NSAxNS45OSBMIDcuMjg1IDE2IEMgNy4yODUgMTYuMjg3IDcuMjk2IDE2LjU3MiA3LjMyIDE2Ljg1NCBMIDAuMDggMTcuNTYyIEMgMC4wMjYgMTcuMDQ5IDAgMTYuNTI3IDAgMTYgQyAwIDE1LjQ2IDAuMDI3IDE0LjkyNiAwLjA4IDE0LjQgTCAxMC4yNzUgMTUuNDE5IEMgMTAuMjU3IDE1LjYwNyAxMC4yNDYgMTUuNzk4IDEwLjI0NiAxNS45OSBMIDcuMjg1IDE1Ljk5IFoiIGZpbGw9ImN1cnJlbnRDb2xvciIgZmlsbC1ydWxlPSJub256ZXJvIj48L3BhdGg+CiAgPHBhdGggZD0iTSA4LjA4NSAyMC4yNCBDIDcuOTc4IDE5Ljk2NSA3Ljg4MSAxOS42ODUgNy43OTIgMTkuNCBMIDEwLjY4NiAxOC4yMDYgQyAxMC42MTMgMTguMDMxIDEwLjU0OSAxNy44NTEgMTAuNDkzIDE3LjY2OCBMIDAuNjggMjAuNjIyIEMgMC45ODQgMjEuNjM0IDEuMzg5IDIyLjYxMyAxLjg4OSAyMy41NDUgTCA4LjA4NSAyMC4yNCBaIiBmaWxsPSJjdXJyZW50Q29sb3IiIGZpbGwtcnVsZT0ibm9uemVybyI+PC9wYXRoPgogIDxwYXRoIGQ9Ik0gMjAuNzU5IDI3LjQ1IEMgMjEuMTc4IDI3LjM4MiAyMS41OTIgMjcuMjkyIDIyLjAwMSAyNy4xNzggTCAyMy41NjYgMzAuMTA5IEMgMjIuNjM2IDMwLjYwNyAyMS42NTggMzEuMDEyIDIwLjY0NyAzMS4zMTggTCAxNy42OSAyMS41MSBDIDE3Ljg3MyAyMS40NTUgMTguMDUyIDIxLjM5IDE4LjIyNyAyMS4zMTggTCAyMC43NTkgMjcuNDUgWiIgZmlsbD0iY3VycmVudENvbG9yIiBmaWxsLXJ1bGU9Im5vbnplcm8iPjwvcGF0aD4KICA8cGF0aCBkPSJNIDI5LjcyOSAyMC4xNiBDIDI5LjU2IDIwLjYgMjkuMzY0IDIxLjAzIDI5LjE0MiAyMS40NDYgTCAyMS4zMzYgMTguMjA0IEMgMjEuMjY0IDE4LjM3OSAyMS4xODQgMTguNTUgMjEuMDk2IDE4LjcxNyBMIDMwLjEyNSAyMy41NjIgQyAzMC42MjQgMjIuNjMzIDMxLjAzIDIxLjY1NyAzMS4zMzYgMjAuNjQ3IEwgMjkuNzI5IDIwLjE2IFoiIGZpbGw9ImN1cnJlbnRDb2xvciIgZmlsbC1ydWxlPSJub256ZXJvIj48L3BhdGg+CiAgPHBhdGggZD0iTSAxNy4xNTQgMjcuNDY4IEwgMTcuNTkgMzEuOTIgQyAxNy4wNyAzMS45NzMgMTYuNTQ0IDMyIDE2LjAxIDMyIEMgMTUuNDc2IDMyIDE0Ljk1IDMxLjk3MyAxNC40MyAzMS45MiBMIDE1LjQ1IDIxLjczIEMgMTUuNjM2IDIxLjc0OCAxNS44MjIgMjEuNzU4IDE2LjAxIDIxLjc1OCBMIDE2LjAyMyAyMS43NTggTCAxNi4wMTYgMjcuMjM4IEMgMTYuMzkxIDI3LjMzNCAxNi43NzEgMjcuNDExIDE3LjE1NCAyNy40NjggWiIgZmlsbD0iY3VycmVudENvbG9yIiBmaWxsLXJ1bGU9Im5vbnplcm8iPjwvcGF0aD4KICA8cGF0aCBkPSJNIDEyLjExMSAyNS40MTcgQyAxMi4zOTYgMjUuNjIxIDEyLjY5IDI1LjgxMiAxMi45OTEgMjUuOTkgTCAxMS4zNzIgMzEuMzE3IEMgMTAuMzYgMzEuMDExIDkuMzgxIDMwLjYwNiA4LjQ1IDMwLjEwNiBMIDEzLjI5NSAyMS4wODYgQyAxMy40NjIgMjEuMTcyIDEzLjYzNCAyMS4yNTQgMTMuODExIDIxLjMyNiBMIDEyLjExMSAyNS40MTcgWiIgZmlsbD0iY3VycmVudENvbG9yIiBmaWxsLXJ1bGU9Im5vbnplcm8iPjwvcGF0aD4KICA8cGF0aCBkPSJNIDcuNzk3IDEyLjU4MiBDIDcuNzExIDEyLjg2MSA3LjYzNiAxMy4xNDQgNy41NyAxMy40MzEgTCAwLjY5IDExLjM0MiBDIDAuOTk3IDEwLjMzMSAxLjQwNSA5LjM1MyAxLjkwNyA4LjQyMiBMIDEwLjkzNiAxMy4yNjYgQyAxMC44NDUgMTMuNDMzIDEwLjc2MyAxMy42MDYgMTAuNjkgMTMuNzgyIEwgNy43OTcgMTIuNTgyIFoiIGZpbGw9ImN1cnJlbnRDb2xvciIgZmlsbC1ydWxlPSJub256ZXJvIj48L3BhdGg+Cjwvc3ZnPg==" alt=""/>
      <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI3OS4yMDYiIGhlaWdodD0iMTguMjI1IiB2aWV3Qm94PSIwIDAgNzkuMjA2IDE4LjIyNSIgZmlsbD0ibm9uZSI+CiAgPHBhdGggZD0iTSA2Ljk4NiAwLjM0OSBMIDAgMC4zNDkgTCAwIDE4LjA2NSBMIDIuOTExIDE4LjA2NSBMIDIuOTExIDExLjYzNiBMIDYuOTg2IDExLjYzNiBDIDEwLjY4MyAxMS42MzYgMTMuMTE0IDkuNDExIDEzLjExNCA1Ljk5MyBDIDEzLjExNCAyLjU3NSAxMC42ODMgMC4zNDkgNi45ODYgMC4zNDkgWiBNIDYuNzM5IDkuMTA1IEwgMi45MTEgOS4xMDUgTCAyLjkxMSAyLjg4IEwgNi43NTMgMi44OCBDIDguODM1IDIuODggMTAuMTQ1IDQuMDczIDEwLjE0NSA1Ljk5MyBDIDEwLjE0NSA3LjkxMyA4LjgwNiA5LjEwNSA2LjcyNCA5LjEwNSBMIDYuNzM5IDkuMTA1IFogTSAyNC4zMjEgNy4wMTEgQyAyMy40OTEgNS44MTggMjIuMTIzIDQuOTYgMjAuMDg1IDQuOTYgQyAxNi41NjMgNC45NiAxMy45NTggNy41OTMgMTMuOTU4IDExLjU5MyBDIDEzLjk1OCAxNS41OTMgMTYuNTYzIDE4LjIyNSAyMC4wODUgMTguMjI1IEMgMjIuMTA4IDE4LjIyNSAyMy40NzYgMTcuMjY1IDI0LjMyMSAxNi4xMDIgTCAyNC42MjYgMTguMDggTCAyNy4wMjggMTguMDggTCAyNy4wMjggNS4xMDUgTCAyNC42NTUgNS4xMDUgTCAyNC4zMjEgNi45OTYgTCAyNC4zMjEgNy4wMTEgWiBNIDIwLjU1MSAxNS45MTMgQyAxOC4yNjYgMTUuOTEzIDE2Ljc4MSAxNC4xMzggMTYuNzgxIDExLjU3OCBDIDE2Ljc4MSA5LjAxOCAxOC4yODEgNy4yNzMgMjAuNTUxIDcuMjczIEMgMjIuODIyIDcuMjczIDI0LjMyMSA5LjA2MiAyNC4zMjEgMTEuNjIyIEMgMjQuMzIxIDE0LjE4MiAyMi44MjIgMTUuODk4IDIwLjU1MSAxNS44OTggTCAyMC41NTEgMTUuOTEzIFogTSA0Ny44MjYgNy4wMTEgQyA0Ni45OTcgNS44MTggNDUuNjI5IDQuOTYgNDMuNTkxIDQuOTYgQyA0MC4wNjkgNC45NiAzNy40NjMgNy41OTMgMzcuNDYzIDExLjU5MyBDIDM3LjQ2MyAxNS41OTMgNDAuMDY5IDE4LjIyNSA0My41OTEgMTguMjI1IEMgNDUuNjE0IDE4LjIyNSA0Ni45ODIgMTcuMjY1IDQ3LjgyNiAxNi4xMDIgTCA0OC4xMzIgMTguMDggTCA1MC41MzMgMTguMDggTCA1MC41MzMgNS4xMDUgTCA0OC4xNjEgNS4xMDUgTCA0Ny44MjYgNi45OTYgTCA0Ny44MjYgNy4wMTEgWiBNIDQ0LjA1NyAxNS45MTMgQyA0MS43NzIgMTUuOTEzIDQwLjI4NyAxNC4xMzggNDAuMjg3IDExLjU3OCBDIDQwLjI4NyA5LjAxOCA0MS43ODYgNy4yNzMgNDQuMDU3IDcuMjczIEMgNDYuMzI3IDcuMjczIDQ3LjgyNiA5LjA2MiA0Ny44MjYgMTEuNjIyIEMgNDcuODI2IDE0LjE4MiA0Ni4zMjcgMTUuODk4IDQ0LjA1NyAxNS44OTggTCA0NC4wNTcgMTUuOTEzIFogTSAzNi4yNyA1LjEwNSBMIDM2Ljg4MSA1LjEwNSBMIDM2Ljg4MSA3LjY2NSBMIDM1LjY3MyA3LjY2NSBDIDMzLjI0MyA3LjY2NSAzMi40NTcgOS41NTYgMzIuNDU3IDExLjU2NCBMIDMyLjQ1NyAxOC4wNjUgTCAyOS43MiAxOC4wNjUgTCAyOS43MiA1LjEwNSBMIDMyLjE1MSA1LjEwNSBMIDMyLjQ1NyA3LjA1NSBDIDMzLjExMiA1Ljk2NCAzNC4xNiA1LjEwNSAzNi4yODQgNS4xMDUgTCAzNi4yNyA1LjEwNSBaIE0gNjQuODExIDEuNjQ0IEMgNjQuODExIDIuNjA0IDY0LjA4NCAzLjI4NyA2My4xMzggMy4yODcgQyA2Mi4xOTIgMy4yODcgNjEuNDY0IDIuNjA0IDYxLjQ2NCAxLjY0NCBDIDYxLjQ2NCAwLjY4NCA2Mi4xOTIgMCA2My4xMzggMCBDIDY0LjA4NCAwIDY0LjgxMSAwLjY4NCA2NC44MTEgMS42NDQgWiBNIDc5LjIwNiAxMC44NTEgTCA3OS4yMDYgMTguMDY1IEwgNzYuNDQxIDE4LjA2NSBMIDc2LjQ0MSAxMS4wODQgQyA3Ni40NDEgOC42MjUgNzUuNDA3IDcuMzE2IDczLjM1NSA3LjMxNiBDIDcxLjE3MiA3LjMxNiA2OS44OTEgOC45MTYgNjkuODkxIDExLjUzNSBMIDY5Ljg5MSAxOC4wNjUgTCA2Ny4xNTUgMTguMDY1IEwgNjcuMTU1IDUuMTA1IEwgNjkuNTQyIDUuMTA1IEwgNjkuODQ3IDYuODA3IEMgNzAuNjYyIDUuNzg5IDcxLjg5OSA0Ljk2IDczLjk5NSA0Ljk2IEMgNzYuODYzIDQuOTYgNzkuMjA2IDYuNTMxIDc5LjIwNiAxMC44NTEgWiBNIDU2Ljk4MSA1LjEwNSBMIDY0LjUwNiA1LjEwNSBMIDY0LjUwNiAxOC4wNjUgTCA2MS43NCAxOC4wNjUgTCA2MS43NCA3LjUyIEwgNTYuOTgxIDcuNTIgTCA1Ni45ODEgMTguMDY1IEwgNTQuMjE2IDE4LjA2NSBMIDU0LjIxNiA3LjUyIEwgNTEuOTYgNy41MiBMIDUxLjk2IDUuMTIgTCA1NC4yMTYgNS4xMiBMIDU0LjIxNiAzLjgyNSBDIDU0LjIxNiAxLjU0MiA1NS4zMzYgMC4zNjQgNTcuODQgMC4zNjQgTCA2MC4xMzkgMC4zNjQgTCA2MC4xMzkgMi43NjQgTCA1OC4yMTggMi43NjQgQyA1Ny4zMyAyLjc2NCA1Ni45ODEgMy4xNDIgNTYuOTgxIDQuMDI5IEwgNTYuOTgxIDUuMTIgTCA1Ni45ODEgNS4xMDUgWiIgZmlsbD0iY3VycmVudENvbG9yIiBmaWxsLXJ1bGU9Im5vbnplcm8iPjwvcGF0aD4KPC9zdmc+" alt="Parafin"/>
    </span>
  );
}

Object.assign(window, { V1bStats, V1CTA, Powered, addMonths, addDays, fmtDate });
