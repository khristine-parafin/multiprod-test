/* mof-compare.jsx — comparison-focused capital widget variations.
 * Three takes that make the offer amounts + how repayment works the
 * clearest. Reuses globals: usd, MOF_FLEX_MAX, MOF_TERM_MAX, FLEX, TERM,
 * MofBenefits. Term is shown first (higher ceiling). */

const CMP_HOLDBACK = Math.round(FLEX.durations[0].holdback * 100);

/* Repayment mini-visual — the core contrast.
 *   fixed : uniform brand bars  → "same payment every time"
 *   flex  : varying grey bars w/ a brand slice → "a % of each day's sales" */
function CmpViz({ mode, legend = false }) {
  const fixed = [58, 58, 58, 58, 58, 58, 58];
  const flex = [40, 64, 30, 80, 16, 54, 46];
  const data = mode === 'fixed' ? fixed : flex;
  return (
    <div>
      <div className={'cmp-viz cmp-viz--' + mode} aria-hidden="true">
        {data.map((h, i) => (
          <span key={i} className="cmp-viz-bar" style={{ height: h + '%' }}>
            {mode === 'flex' && <span className="cmp-viz-slice" style={{ height: '32%' }} />}
          </span>
        ))}
      </div>
      {legend && mode === 'flex' &&
        <div className="cmp-viz-legend">
          <span className="k"><span className="sw bar" />Daily sales</span>
          <span className="k"><span className="sw pay" />{CMP_HOLDBACK}% repaid</span>
        </div>}
      {legend && mode === 'fixed' &&
        <div className="cmp-viz-legend">
          <span className="k"><span className="sw pay" />Same amount, every 2 weeks</span>
        </div>}
    </div>);
}

function CmpFoot() {
  return (
    <div className="cmpw-foot">
      <span className="cmpw-poweredby">Powered by <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI3OS4yMDYiIGhlaWdodD0iMTguMjI1IiB2aWV3Qm94PSIwIDAgNzkuMjA2IDE4LjIyNSIgZmlsbD0ibm9uZSI+CiAgPHBhdGggZD0iTSA2Ljk4NiAwLjM0OSBMIDAgMC4zNDkgTCAwIDE4LjA2NSBMIDIuOTExIDE4LjA2NSBMIDIuOTExIDExLjYzNiBMIDYuOTg2IDExLjYzNiBDIDEwLjY4MyAxMS42MzYgMTMuMTE0IDkuNDExIDEzLjExNCA1Ljk5MyBDIDEzLjExNCAyLjU3NSAxMC42ODMgMC4zNDkgNi45ODYgMC4zNDkgWiBNIDYuNzM5IDkuMTA1IEwgMi45MTEgOS4xMDUgTCAyLjkxMSAyLjg4IEwgNi43NTMgMi44OCBDIDguODM1IDIuODggMTAuMTQ1IDQuMDczIDEwLjE0NSA1Ljk5MyBDIDEwLjE0NSA3LjkxMyA4LjgwNiA5LjEwNSA2LjcyNCA5LjEwNSBMIDYuNzM5IDkuMTA1IFogTSAyNC4zMjEgNy4wMTEgQyAyMy40OTEgNS44MTggMjIuMTIzIDQuOTYgMjAuMDg1IDQuOTYgQyAxNi41NjMgNC45NiAxMy45NTggNy41OTMgMTMuOTU4IDExLjU5MyBDIDEzLjk1OCAxNS41OTMgMTYuNTYzIDE4LjIyNSAyMC4wODUgMTguMjI1IEMgMjIuMTA4IDE4LjIyNSAyMy40NzYgMTcuMjY1IDI0LjMyMSAxNi4xMDIgTCAyNC42MjYgMTguMDggTCAyNy4wMjggMTguMDggTCAyNy4wMjggNS4xMDUgTCAyNC42NTUgNS4xMDUgTCAyNC4zMjEgNi45OTYgTCAyNC4zMjEgNy4wMTEgWiBNIDIwLjU1MSAxNS45MTMgQyAxOC4yNjYgMTUuOTEzIDE2Ljc4MSAxNC4xMzggMTYuNzgxIDExLjU3OCBDIDE2Ljc4MSA5LjAxOCAxOC4yODEgNy4yNzMgMjAuNTUxIDcuMjczIEMgMjIuODIyIDcuMjczIDI0LjMyMSA5LjA2MiAyNC4zMjEgMTEuNjIyIEMgMjQuMzIxIDE0LjE4MiAyMi44MjIgMTUuODk4IDIwLjU1MSAxNS44OTggTCAyMC41NTEgMTUuOTEzIFogTSA0Ny44MjYgNy4wMTEgQyA0Ni45OTcgNS44MTggNDUuNjI5IDQuOTYgNDMuNTkxIDQuOTYgQyA0MC4wNjkgNC45NiAzNy40NjMgNy41OTMgMzcuNDYzIDExLjU5MyBDIDM3LjQ2MyAxNS41OTMgNDAuMDY5IDE4LjIyNSA0My41OTEgMTguMjI1IEMgNDUuNjE0IDE4LjIyNSA0Ni45ODIgMTcuMjY1IDQ3LjgyNiAxNi4xMDIgTCA0OC4xMzIgMTguMDggTCA1MC41MzMgMTguMDggTCA1MC41MzMgNS4xMDUgTCA0OC4xNjEgNS4xMDUgTCA0Ny44MjYgNi45OTYgTCA0Ny44MjYgNy4wMTEgWiBNIDQ0LjA1NyAxNS45MTMgQyA0MS43NzIgMTUuOTEzIDQwLjI4NyAxNC4xMzggNDAuMjg3IDExLjU3OCBDIDQwLjI4NyA5LjAxOCA0MS43ODYgNy4yNzMgNDQuMDU3IDcuMjczIEMgNDYuMzI3IDcuMjczIDQ3LjgyNiA5LjA2MiA0Ny44MjYgMTEuNjIyIEMgNDcuODI2IDE0LjE4MiA0Ni4zMjcgMTUuODk4IDQ0LjA1NyAxNS44OTggTCA0NC4wNTcgMTUuOTEzIFogTSAzNi4yNyA1LjEwNSBMIDM2Ljg4MSA1LjEwNSBMIDM2Ljg4MSA3LjY2NSBMIDM1LjY3MyA3LjY2NSBDIDMzLjI0MyA3LjY2NSAzMi40NTcgOS41NTYgMzIuNDU3IDExLjU2NCBMIDMyLjQ1NyAxOC4wNjUgTCAyOS43MiAxOC4wNjUgTCAyOS43MiA1LjEwNSBMIDMyLjE1MSA1LjEwNSBMIDMyLjQ1NyA3LjA1NSBDIDMzLjExMiA1Ljk2NCAzNC4xNiA1LjEwNSAzNi4yODQgNS4xMDUgTCAzNi4yNyA1LjEwNSBaIE0gNjQuODExIDEuNjQ0IEMgNjQuODExIDIuNjA0IDY0LjA4NCAzLjI4NyA2My4xMzggMy4yODcgQyA2Mi4xOTIgMy4yODcgNjEuNDY0IDIuNjA0IDYxLjQ2NCAxLjY0NCBDIDYxLjQ2NCAwLjY4NCA2Mi4xOTIgMCA2My4xMzggMCBDIDY0LjA4NCAwIDY0LjgxMSAwLjY4NCA2NC44MTEgMS42NDQgWiBNIDc5LjIwNiAxMC44NTEgTCA3OS4yMDYgMTguMDY1IEwgNzYuNDQxIDE4LjA2NSBMIDc2LjQ0MSAxMS4wODQgQyA3Ni40NDEgOC42MjUgNzUuNDA3IDcuMzE2IDczLjM1NSA3LjMxNiBDIDcxLjE3MiA3LjMxNiA2OS44OTEgOC45MTYgNjkuODkxIDExLjUzNSBMIDY5Ljg5MSAxOC4wNjUgTCA2Ny4xNTUgMTguMDY1IEwgNjcuMTU1IDUuMTA1IEwgNjkuNTQyIDUuMTA1IEwgNjkuODQ3IDYuODA3IEMgNzAuNjYyIDUuNzg5IDcxLjg5OSA0Ljk2IDczLjk5NSA0Ljk2IEMgNzYuODYzIDQuOTYgNzkuMjA2IDYuNTMxIDc5LjIwNiAxMC44NTEgWiBNIDU2Ljk4MSA1LjEwNSBMIDY0LjUwNiA1LjEwNSBMIDY0LjUwNiAxOC4wNjUgTCA2MS43NCAxOC4wNjUgTCA2MS43NCA3LjUyIEwgNTYuOTgxIDcuNTIgTCA1Ni45ODEgMTguMDY1IEwgNTQuMjE2IDE4LjA2NSBMIDU0LjIxNiA3LjUyIEwgNTEuOTYgNy41MiBMIDUxLjk2IDUuMTIgTCA1NC4yMTYgNS4xMiBMIDU0LjIxNiAzLjgyNSBDIDU0LjIxNiAxLjU0MiA1NS4zMzYgMC4zNjQgNTcuODQgMC4zNjQgTCA2MC4xMzkgMC4zNjQgTCA2MC4xMzkgMi43NjQgTCA1OC4yMTggMi43NjQgQyA1Ny4zMyAyLjc2NCA1Ni45ODEgMy4xNDIgNTYuOTgxIDQuMDI5IEwgNTYuOTgxIDUuMTIgTCA1Ni45ODEgNS4xMDUgWiIgZmlsbD0iY3VycmVudENvbG9yIiBmaWxsLXJ1bGU9Im5vbnplcm8iPjwvcGF0aD4KPC9zdmc+" alt="Parafin" /></span>
    </div>);
}

/* ── Variation 1 · Side-by-side columns (amount-led, read across) ── */
function CmpColumns({ ctaPerProduct = false, onCta, onChoose }) {
  const Col = ({ tag, amt, lead, desc, mode }) => (
    <div className="cmpw-col">
      <span className="cmpw-col-name">{tag}</span>
      <span className="cmpw-col-amt"><span className="pre">Pre-approved up to</span>{amt}</span>
      <span className="cmpw-repay-label">How you repay</span>
      <h4 className="cmpw-repay-lead">{lead}</h4>
      {ctaPerProduct &&
        <button type="button" className="mof-btn mof-btn--sm mof-btn--block cmpw-col-cta"
          onClick={() => onChoose && onChoose(tag.toLowerCase())}>
          Choose {tag} <span aria-hidden="true">→</span>
        </button>}
    </div>);
  return (
    <div className={'cmpw' + (ctaPerProduct ? ' cmpw--per' : '')} data-screen-label={ctaPerProduct ? 'Compare · Columns (CTA per product)' : 'Compare · Columns'}>
      <div className="cmpw-head">
        <h3 className="cmpw-title">Financing on your terms</h3>
        <p className="cmpw-sub">Just choose how you'll pay it back.</p>
      </div>
      <div className="cmpw-cols">
        <Col tag="Term" amt={usd(MOF_TERM_MAX)} mode="fixed"
          lead="A fixed amount, every 2 weeks"
          desc="The same fixed payment on a schedule until it's repaid — easy to budget around." />
        <span className="cmpw-or" aria-hidden="true"><span>or</span></span>
        <Col tag="Flex" amt={usd(MOF_FLEX_MAX)} mode="flex"
          lead="A % of each day's sales"
          desc="Payments rise and fall with revenue — you pay less on slower days, nothing on a $0 day." />
      </div>
      <MofBenefits />
      {!ctaPerProduct &&
        <button type="button" className="mof-btn mof-btn--block" onClick={onCta}>View your offer <span aria-hidden="true">→</span></button>}
      <CmpFoot />
    </div>);
}

/* ── Variation 2 · Repayment-led cards (how-you-repay is the hero) ── */
function CmpRepayLed() {
  const Card = ({ tag, lead, mode, amt, cta }) => (
    <div className="cmpw-rcard">
      <span className="cmpw-rcard-tag">{tag}</span>
      <h4 className="cmpw-rcard-lead">{lead}</h4>
      <div className="cmpw-rcard-viz"><CmpViz mode={mode} legend /></div>
      <div className="cmpw-rcard-foot">
        <span className="cmpw-rcard-amt"><span className="pre">Up to</span>{amt}</span>
        <span className="cmpw-rcard-cta">{cta} <span aria-hidden="true">→</span></span>
      </div>
    </div>);
  return (
    <div className="cmpw" data-screen-label="Compare · Repayment-led">
      <div className="cmpw-head">
        <h3 className="cmpw-title">Pick how you pay it back</h3>
        <p className="cmpw-sub">You're pre-approved for both. The amount you can borrow depends on how you repay.</p>
      </div>
      <div className="cmpw-rcards">
        <Card tag="Term" lead="Pay a fixed amount, every 2 weeks" mode="fixed"
          amt={usd(MOF_TERM_MAX)} cta="Choose Term" />
        <Card tag="Flex" lead="Pay a share of each day's sales" mode="flex"
          amt={usd(MOF_FLEX_MAX)} cta="Choose Flex" />
      </div>
      <MofBenefits />
      <CmpFoot />
    </div>);
}

/* ── Variation 3 · At-a-glance spec table ─────────────────────── */
function CmpSpecTable({ ctaPerProduct = false, onCta }) {
  const rows = [
    {
      label: 'How you repay',
      term: { v: 'A fixed amount', s: 'Same payment every cycle' },
      flex: { v: '% of sales', s: 'A share of each day’s revenue' },
    },
    {
      label: 'Schedule',
      term: { v: 'Every 2 weeks', s: 'Set, predictable dates' },
      flex: { v: 'Daily', s: 'Rises & falls with sales' },
    },
  ];
  return (
    <div className="cmpw" data-screen-label={ctaPerProduct ? 'Compare · Spec table (CTA per product)' : 'Compare · Spec table'}>
      <div className="cmpw-head">
        <h3 className="cmpw-title">Compare your offers</h3>
        <p className="cmpw-sub">Two pre-approved offers — here's how they stack up side by side.</p>
      </div>
      <div className="cmpw-spec">
        <div className="cmpw-spec-cell rowlabel cmpw-spec-head" />
        <div className="cmpw-spec-cell cmpw-spec-head">
          <span className="cmpw-spec-prodname">Term</span>
          <span className="cmpw-spec-amt"><span className="pre">Up to</span>{usd(MOF_TERM_MAX)}</span>
        </div>
        <div className="cmpw-spec-cell cmpw-spec-head">
          <span className="cmpw-spec-prodname">Flex</span>
          <span className="cmpw-spec-amt"><span className="pre">Up to</span>{usd(MOF_FLEX_MAX)}</span>
        </div>
        {rows.map((r, i) => {
          const last = i === rows.length - 1 ? ' lastrow' : '';
          return (
          <React.Fragment key={i}>
            <div className={'cmpw-spec-cell rowlabel' + last}>{r.label}</div>
            <div className={'cmpw-spec-cell' + last}>
              <span className="cmpw-spec-val">{r.term.v}</span>
              <span className="cmpw-spec-sub">{r.term.s}</span>
            </div>
            <div className={'cmpw-spec-cell' + last}>
              <span className="cmpw-spec-val">{r.flex.v}</span>
              <span className="cmpw-spec-sub">{r.flex.s}</span>
            </div>
          </React.Fragment>
          );
        })}
        {ctaPerProduct &&
          <React.Fragment>
            <div className="cmpw-spec-cell rowlabel cmpw-spec-ctacell" />
            <div className="cmpw-spec-cell cmpw-spec-ctacell">
              <button type="button" className="mof-btn mof-btn--sm mof-btn--block">Choose Term <span aria-hidden="true">→</span></button>
            </div>
            <div className="cmpw-spec-cell cmpw-spec-ctacell">
              <button type="button" className="mof-btn mof-btn--sm mof-btn--block">Choose Flex <span aria-hidden="true">→</span></button>
            </div>
          </React.Fragment>}
      </div>
      <MofBenefits />
      {!ctaPerProduct &&
        <button type="button" className="mof-btn mof-btn--block" onClick={onCta}>View your offer <span aria-hidden="true">→</span></button>}
      <CmpFoot />
    </div>);
}

function MofCompareStage({ theme = 'light', mobile = false, title, sub, children }) {
  return (
    <div className={'mof' + (mobile ? ' mof--mobile' : '')} data-theme={theme}>
      <div className="mofcmp" data-theme={theme}>
        <div className="mofcmp-head">
          <span className="mofcmp-eyebrow">Capital</span>
          <span className="mofcmp-name">{title}</span>
          {sub && <span className="mofcmp-note">{sub}</span>}
        </div>
        {children}
      </div>
    </div>);
}

/* ── Variation · Single amount, choose how to repay ───────────────
 * Leads with ONE hero figure — the highest ceiling ($50k) — instead of
 * a per-product amount. The two products are reframed as a repayment
 * CHOICE beneath it (same money in, two ways out). A small note keeps
 * the Flex cap honest without competing with the hero number. */
function CmpOneAmount({ ctaPerProduct = false, product = null, onCta, onChoose }) {
  // This card leads with one amount, so "how you repay" becomes a value
  // prop in its own right rather than a separate selector. Prepend it to
  // the shared benefit list (icon: a path branching two ways).
  const _ic = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.5, strokeLinecap: 'round', strokeLinejoin: 'round' };
  const IcRepay = () => (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <g {..._ic}>
        <path d="M8 14 V8" />
        <path d="M8 8 L4 4.4" />
        <path d="M8 8 L12 4.4" />
        <circle cx="3.6" cy="3.8" r="1.05" />
        <circle cx="12.4" cy="3.8" r="1.05" />
      </g>
    </svg>);

  // ── Single-product variant ──────────────────────────────────────
  // Same single-amount card design, but pinned to ONE product: the hero
  // figure shows that product's own ceiling and the lead benefit states
  // how that product repays (no comparison framing).
  const solo = product === 'flex' || product === 'term';
  if (solo) {
    const isFlex = product === 'flex';
    const label = isFlex ? 'Flex' : 'Term';
    const heroAmt = isFlex ? MOF_FLEX_MAX : MOF_TERM_MAX;
    const IcFlexRepay = () => (
      <svg viewBox="0 0 16 16" aria-hidden="true">
        <path d="M1.8 10 C3.3 5, 5 5, 6.4 8 C7.8 11, 9.5 11, 11 7 C12 4.4, 13.2 4.4, 14.2 6.2" {..._ic} />
      </svg>);
    const IcTermRepay = () => (
      <svg viewBox="0 0 16 16" aria-hidden="true">
        <g {..._ic}>
          <rect x="2.4" y="3.2" width="11.2" height="10.4" rx="1.6" />
          <path d="M2.4 6.2 H13.6 M5.6 1.8 V4 M10.4 1.8 V4" />
        </g>
      </svg>);
    const soloBenefits = [
      [isFlex ? <IcFlexRepay /> : <IcTermRepay />, isFlex
        ? <>Repay as a <b>percentage of your daily sales</b> — lighter on slow days</>
        : <><b>Fixed payments</b> every two weeks — the same amount each time</>],
      ...mofBenefitItems(),
    ];
    const fire = () => onChoose ? onChoose(product) : (onCta && onCta());
    return (
      <div className="cmpw cmpw-one cmpw-one--solo" data-screen-label={`Single amount · ${label} only`}>
        <div className="cmpw-one-hero">
          <span className="cmpw-one-pre">Your {label} offer · pre-approved up to</span>
          <span className="cmpw-one-amt">{usd(heroAmt)}</span>
          <p className="cmpw-one-lede">
            {isFlex
              ? <>Draw what you need, up to your limit — then repay as a share of your daily sales.</>
              : <>Draw what you need, up to your limit — then repay on a fixed biweekly schedule.</>}
          </p>
        </div>
        <ul className="mofw-benefits">
          {soloBenefits.map(([ic, txt], i) => (
            <li key={i}><span className="mofw-bic">{ic}</span><span>{txt}</span></li>
          ))}
        </ul>
        <button type="button" className="mof-btn mof-btn--block" onClick={fire}>
          View {label} offer <span aria-hidden="true">→</span>
        </button>
        <CmpFoot />
      </div>);
  }

  const benefits = [
    [<IcRepay />, <>Choose how you repay — <b>fixed payments or a % of daily sales</b></>],
    ...mofBenefitItems(),
  ];
  return (
    <div className="cmpw cmpw-one" data-screen-label={ctaPerProduct ? 'Compare · Single amount (CTA per product)' : 'Compare · Single amount'}>
      <div className="cmpw-one-hero">
        <span className="cmpw-one-pre">You're pre-approved up to</span>
        <span className="cmpw-one-amt">{usd(MOF_TERM_MAX)}</span>
        <p className="cmpw-one-lede">
          Just choose how you'll pay it back.
        </p>
      </div>
      <ul className="mofw-benefits">
        {benefits.map(([ic, txt], i) => (
          <li key={i}><span className="mofw-bic">{ic}</span><span>{txt}</span></li>
        ))}
      </ul>
      {!ctaPerProduct &&
        <button type="button" className="mof-btn mof-btn--block" onClick={onCta}>View your offer <span aria-hidden="true">→</span></button>}
      <CmpFoot />
    </div>);
}

Object.assign(window, { CmpViz, CmpColumns, CmpRepayLed, CmpSpecTable, CmpOneAmount, MofCompareStage });
