/* mof-widgets.jsx — three Mercury-style capital widgets.
 *   MofComboWidget — both Flex + Term in one card, ONE CTA
 *   MofSoloWidget  — single product (Flex-only or Term-only)
 *   MofBenefits    — shared marketing benefits list
 * Reuses globals: MofGlyph, FLEX, TERM, usd, MOF_FLEX_MAX, MOF_TERM_MAX. */

/* ── benefit icons (thin-stroke, Mercury feel) ─────────────── */
const _mw = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.5, strokeLinecap: 'round', strokeLinejoin: 'round' };
function IcBolt()  { return <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M9 1.5 L3.5 9 H7.5 L7 14.5 L12.5 7 H8.5 Z" {..._mw}/></svg>; }
function IcTag()   { return <svg viewBox="0 0 16 16" aria-hidden="true"><g {..._mw}><path d="M8.2 1.8 L14 7.6 a1.2 1.2 0 0 1 0 1.7 l-4.7 4.7 a1.2 1.2 0 0 1 -1.7 0 L1.8 8.2 V2.6 a0.8 0.8 0 0 1 0.8 -0.8 Z"/><circle cx="5.3" cy="5.3" r="0.9"/></g></svg>; }
function IcShield(){ return <svg viewBox="0 0 16 16" aria-hidden="true"><g {..._mw}><path d="M8 1.6 L13 3.4 V8 C13 11 10.8 13.2 8 14.4 C5.2 13.2 3 11 3 8 V3.4 Z"/><path d="M5.8 8 L7.2 9.4 L10.2 6"/></g></svg>; }
function IcBoxes() { return <svg viewBox="0 0 16 16" aria-hidden="true"><g {..._mw}><rect x="2" y="2" width="5" height="5" rx="1"/><rect x="9" y="2" width="5" height="5" rx="1"/><rect x="2" y="9" width="5" height="5" rx="1"/><rect x="9" y="9" width="5" height="5" rx="1"/></g></svg>; }

/* Shared value props — identical for both products. Defined once so they
 * can live inside a widget (MofBenefits) OR be pulled out into a single
 * universal band beside the product widgets (MofBenefitsBand). */
function mofBenefitItems() {
  return [
    [<IcBolt/>,   <>Approved? Get funds in <b>as little as 1 business day</b></>],
    [<IcTag/>,    <><b>One fixed fee</b> — no interest, no compounding</>],
    [<IcShield/>, <><b>No credit checks</b> — eligibility is based on your sales performance</>],
    [<IcBoxes/>,  <>Use it for <b>inventory, rent, hiring,</b> or to manage cash flow</>],
  ];
}

/* In-card list (used by the combined + standard solo widgets). */
function MofBenefits() {
  return (
    <ul className="mofw-benefits">
      {mofBenefitItems().map(([ic, txt], i) => (
        <li key={i}><span className="mofw-bic">{ic}</span><span>{txt}</span></li>
      ))}
    </ul>
  );
}

/* Universal band — the shared props placed ONCE beside the product
 * widgets, so each widget can focus on what's different between products. */
function MofBenefitsBand({ label = 'Included with either offer', expiry = 'Jun 12' }) {
  return (
    <div className="mofw-band">
      <span className="mofw-band-label">{label}</span>
      <div className="mofw-band-grid">
        {mofBenefitItems().map(([ic, txt], i) => (
          <div key={i} className="mofw-band-item"><span className="mofw-bic">{ic}</span><span>{txt}</span></div>
        ))}
      </div>
      <div className="mofw-band-foot">
        <span className="mofw-poweredby">Powered by <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI3OS4yMDYiIGhlaWdodD0iMTguMjI1IiB2aWV3Qm94PSIwIDAgNzkuMjA2IDE4LjIyNSIgZmlsbD0ibm9uZSI+CiAgPHBhdGggZD0iTSA2Ljk4NiAwLjM0OSBMIDAgMC4zNDkgTCAwIDE4LjA2NSBMIDIuOTExIDE4LjA2NSBMIDIuOTExIDExLjYzNiBMIDYuOTg2IDExLjYzNiBDIDEwLjY4MyAxMS42MzYgMTMuMTE0IDkuNDExIDEzLjExNCA1Ljk5MyBDIDEzLjExNCAyLjU3NSAxMC42ODMgMC4zNDkgNi45ODYgMC4zNDkgWiBNIDYuNzM5IDkuMTA1IEwgMi45MTEgOS4xMDUgTCAyLjkxMSAyLjg4IEwgNi43NTMgMi44OCBDIDguODM1IDIuODggMTAuMTQ1IDQuMDczIDEwLjE0NSA1Ljk5MyBDIDEwLjE0NSA3LjkxMyA4LjgwNiA5LjEwNSA2LjcyNCA5LjEwNSBMIDYuNzM5IDkuMTA1IFogTSAyNC4zMjEgNy4wMTEgQyAyMy40OTEgNS44MTggMjIuMTIzIDQuOTYgMjAuMDg1IDQuOTYgQyAxNi41NjMgNC45NiAxMy45NTggNy41OTMgMTMuOTU4IDExLjU5MyBDIDEzLjk1OCAxNS41OTMgMTYuNTYzIDE4LjIyNSAyMC4wODUgMTguMjI1IEMgMjIuMTA4IDE4LjIyNSAyMy40NzYgMTcuMjY1IDI0LjMyMSAxNi4xMDIgTCAyNC42MjYgMTguMDggTCAyNy4wMjggMTguMDggTCAyNy4wMjggNS4xMDUgTCAyNC42NTUgNS4xMDUgTCAyNC4zMjEgNi45OTYgTCAyNC4zMjEgNy4wMTEgWiBNIDIwLjU1MSAxNS45MTMgQyAxOC4yNjYgMTUuOTEzIDE2Ljc4MSAxNC4xMzggMTYuNzgxIDExLjU3OCBDIDE2Ljc4MSA5LjAxOCAxOC4yODEgNy4yNzMgMjAuNTUxIDcuMjczIEMgMjIuODIyIDcuMjczIDI0LjMyMSA5LjA2MiAyNC4zMjEgMTEuNjIyIEMgMjQuMzIxIDE0LjE4MiAyMi44MjIgMTUuODk4IDIwLjU1MSAxNS44OTggTCAyMC41NTEgMTUuOTEzIFogTSA0Ny44MjYgNy4wMTEgQyA0Ni45OTcgNS44MTggNDUuNjI5IDQuOTYgNDMuNTkxIDQuOTYgQyA0MC4wNjkgNC45NiAzNy40NjMgNy41OTMgMzcuNDYzIDExLjU5MyBDIDM3LjQ2MyAxNS41OTMgNDAuMDY5IDE4LjIyNSA0My41OTEgMTguMjI1IEMgNDUuNjE0IDE4LjIyNSA0Ni45ODIgMTcuMjY1IDQ3LjgyNiAxNi4xMDIgTCA0OC4xMzIgMTguMDggTCA1MC41MzMgMTguMDggTCA1MC41MzMgNS4xMDUgTCA0OC4xNjEgNS4xMDUgTCA0Ny44MjYgNi45OTYgTCA0Ny44MjYgNy4wMTEgWiBNIDQ0LjA1NyAxNS45MTMgQyA0MS43NzIgMTUuOTEzIDQwLjI4NyAxNC4xMzggNDAuMjg3IDExLjU3OCBDIDQwLjI4NyA5LjAxOCA0MS43ODYgNy4yNzMgNDQuMDU3IDcuMjczIEMgNDYuMzI3IDcuMjczIDQ3LjgyNiA5LjA2MiA0Ny44MjYgMTEuNjIyIEMgNDcuODI2IDE0LjE4MiA0Ni4zMjcgMTUuODk4IDQ0LjA1NyAxNS44OTggTCA0NC4wNTcgMTUuOTEzIFogTSAzNi4yNyA1LjEwNSBMIDM2Ljg4MSA1LjEwNSBMIDM2Ljg4MSA3LjY2NSBMIDM1LjY3MyA3LjY2NSBDIDMzLjI0MyA3LjY2NSAzMi40NTcgOS41NTYgMzIuNDU3IDExLjU2NCBMIDMyLjQ1NyAxOC4wNjUgTCAyOS43MiAxOC4wNjUgTCAyOS43MiA1LjEwNSBMIDMyLjE1MSA1LjEwNSBMIDMyLjQ1NyA3LjA1NSBDIDMzLjExMiA1Ljk2NCAzNC4xNiA1LjEwNSAzNi4yODQgNS4xMDUgTCAzNi4yNyA1LjEwNSBaIE0gNjQuODExIDEuNjQ0IEMgNjQuODExIDIuNjA0IDY0LjA4NCAzLjI4NyA2My4xMzggMy4yODcgQyA2Mi4xOTIgMy4yODcgNjEuNDY0IDIuNjA0IDYxLjQ2NCAxLjY0NCBDIDYxLjQ2NCAwLjY4NCA2Mi4xOTIgMCA2My4xMzggMCBDIDY0LjA4NCAwIDY0LjgxMSAwLjY4NCA2NC44MTEgMS42NDQgWiBNIDc5LjIwNiAxMC44NTEgTCA3OS4yMDYgMTguMDY1IEwgNzYuNDQxIDE4LjA2NSBMIDc2LjQ0MSAxMS4wODQgQyA3Ni40NDEgOC42MjUgNzUuNDA3IDcuMzE2IDczLjM1NSA3LjMxNiBDIDcxLjE3MiA3LjMxNiA2OS44OTEgOC45MTYgNjkuODkxIDExLjUzNSBMIDY5Ljg5MSAxOC4wNjUgTCA2Ny4xNTUgMTguMDY1IEwgNjcuMTU1IDUuMTA1IEwgNjkuNTQyIDUuMTA1IEwgNjkuODQ3IDYuODA3IEMgNzAuNjYyIDUuNzg5IDcxLjg5OSA0Ljk2IDczLjk5NSA0Ljk2IEMgNzYuODYzIDQuOTYgNzkuMjA2IDYuNTMxIDc5LjIwNiAxMC44NTEgWiBNIDU2Ljk4MSA1LjEwNSBMIDY0LjUwNiA1LjEwNSBMIDY0LjUwNiAxOC4wNjUgTCA2MS43NCAxOC4wNjUgTCA2MS43NCA3LjUyIEwgNTYuOTgxIDcuNTIgTCA1Ni45ODEgMTguMDY1IEwgNTQuMjE2IDE4LjA2NSBMIDU0LjIxNiA3LjUyIEwgNTEuOTYgNy41MiBMIDUxLjk2IDUuMTIgTCA1NC4yMTYgNS4xMiBMIDU0LjIxNiAzLjgyNSBDIDU0LjIxNiAxLjU0MiA1NS4zMzYgMC4zNjQgNTcuODQgMC4zNjQgTCA2MC4xMzkgMC4zNjQgTCA2MC4xMzkgMi43NjQgTCA1OC4yMTggMi43NjQgQyA1Ny4zMyAyLjc2NCA1Ni45ODEgMy4xNDIgNTYuOTgxIDQuMDI5IEwgNTYuOTgxIDUuMTIgTCA1Ni45ODEgNS4xMDUgWiIgZmlsbD0iY3VycmVudENvbG9yIiBmaWxsLXJ1bGU9Im5vbnplcm8iPjwvcGF0aD4KPC9zdmc+" alt="Parafin"/></span>
        <span className="mofw-expiry">Offers expire {expiry}</span>
      </div>
    </div>
  );
}

function MofFoot({ expiry = 'Jun 12' }) {
  return (
    <div className="mofw-foot">
      <span className="mofw-poweredby">Powered by <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI3OS4yMDYiIGhlaWdodD0iMTguMjI1IiB2aWV3Qm94PSIwIDAgNzkuMjA2IDE4LjIyNSIgZmlsbD0ibm9uZSI+CiAgPHBhdGggZD0iTSA2Ljk4NiAwLjM0OSBMIDAgMC4zNDkgTCAwIDE4LjA2NSBMIDIuOTExIDE4LjA2NSBMIDIuOTExIDExLjYzNiBMIDYuOTg2IDExLjYzNiBDIDEwLjY4MyAxMS42MzYgMTMuMTE0IDkuNDExIDEzLjExNCA1Ljk5MyBDIDEzLjExNCAyLjU3NSAxMC42ODMgMC4zNDkgNi45ODYgMC4zNDkgWiBNIDYuNzM5IDkuMTA1IEwgMi45MTEgOS4xMDUgTCAyLjkxMSAyLjg4IEwgNi43NTMgMi44OCBDIDguODM1IDIuODggMTAuMTQ1IDQuMDczIDEwLjE0NSA1Ljk5MyBDIDEwLjE0NSA3LjkxMyA4LjgwNiA5LjEwNSA2LjcyNCA5LjEwNSBMIDYuNzM5IDkuMTA1IFogTSAyNC4zMjEgNy4wMTEgQyAyMy40OTEgNS44MTggMjIuMTIzIDQuOTYgMjAuMDg1IDQuOTYgQyAxNi41NjMgNC45NiAxMy45NTggNy41OTMgMTMuOTU4IDExLjU5MyBDIDEzLjk1OCAxNS41OTMgMTYuNTYzIDE4LjIyNSAyMC4wODUgMTguMjI1IEMgMjIuMTA4IDE4LjIyNSAyMy40NzYgMTcuMjY1IDI0LjMyMSAxNi4xMDIgTCAyNC42MjYgMTguMDggTCAyNy4wMjggMTguMDggTCAyNy4wMjggNS4xMDUgTCAyNC42NTUgNS4xMDUgTCAyNC4zMjEgNi45OTYgTCAyNC4zMjEgNy4wMTEgWiBNIDIwLjU1MSAxNS45MTMgQyAxOC4yNjYgMTUuOTEzIDE2Ljc4MSAxNC4xMzggMTYuNzgxIDExLjU3OCBDIDE2Ljc4MSA5LjAxOCAxOC4yODEgNy4yNzMgMjAuNTUxIDcuMjczIEMgMjIuODIyIDcuMjczIDI0LjMyMSA5LjA2MiAyNC4zMjEgMTEuNjIyIEMgMjQuMzIxIDE0LjE4MiAyMi44MjIgMTUuODk4IDIwLjU1MSAxNS44OTggTCAyMC41NTEgMTUuOTEzIFogTSA0Ny44MjYgNy4wMTEgQyA0Ni45OTcgNS44MTggNDUuNjI5IDQuOTYgNDMuNTkxIDQuOTYgQyA0MC4wNjkgNC45NiAzNy40NjMgNy41OTMgMzcuNDYzIDExLjU5MyBDIDM3LjQ2MyAxNS41OTMgNDAuMDY5IDE4LjIyNSA0My41OTEgMTguMjI1IEMgNDUuNjE0IDE4LjIyNSA0Ni45ODIgMTcuMjY1IDQ3LjgyNiAxNi4xMDIgTCA0OC4xMzIgMTguMDggTCA1MC41MzMgMTguMDggTCA1MC41MzMgNS4xMDUgTCA0OC4xNjEgNS4xMDUgTCA0Ny44MjYgNi45OTYgTCA0Ny44MjYgNy4wMTEgWiBNIDQ0LjA1NyAxNS45MTMgQyA0MS43NzIgMTUuOTEzIDQwLjI4NyAxNC4xMzggNDAuMjg3IDExLjU3OCBDIDQwLjI4NyA5LjAxOCA0MS43ODYgNy4yNzMgNDQuMDU3IDcuMjczIEMgNDYuMzI3IDcuMjczIDQ3LjgyNiA5LjA2MiA0Ny44MjYgMTEuNjIyIEMgNDcuODI2IDE0LjE4MiA0Ni4zMjcgMTUuODk4IDQ0LjA1NyAxNS44OTggTCA0NC4wNTcgMTUuOTEzIFogTSAzNi4yNyA1LjEwNSBMIDM2Ljg4MSA1LjEwNSBMIDM2Ljg4MSA3LjY2NSBMIDM1LjY3MyA3LjY2NSBDIDMzLjI0MyA3LjY2NSAzMi40NTcgOS41NTYgMzIuNDU3IDExLjU2NCBMIDMyLjQ1NyAxOC4wNjUgTCAyOS43MiAxOC4wNjUgTCAyOS43MiA1LjEwNSBMIDMyLjE1MSA1LjEwNSBMIDMyLjQ1NyA3LjA1NSBDIDMzLjExMiA1Ljk2NCAzNC4xNiA1LjEwNSAzNi4yODQgNS4xMDUgTCAzNi4yNyA1LjEwNSBaIE0gNjQuODExIDEuNjQ0IEMgNjQuODExIDIuNjA0IDY0LjA4NCAzLjI4NyA2My4xMzggMy4yODcgQyA2Mi4xOTIgMy4yODcgNjEuNDY0IDIuNjA0IDYxLjQ2NCAxLjY0NCBDIDYxLjQ2NCAwLjY4NCA2Mi4xOTIgMCA2My4xMzggMCBDIDY0LjA4NCAwIDY0LjgxMSAwLjY4NCA2NC44MTEgMS42NDQgWiBNIDc5LjIwNiAxMC44NTEgTCA3OS4yMDYgMTguMDY1IEwgNzYuNDQxIDE4LjA2NSBMIDc2LjQ0MSAxMS4wODQgQyA3Ni40NDEgOC42MjUgNzUuNDA3IDcuMzE2IDczLjM1NSA3LjMxNiBDIDcxLjE3MiA3LjMxNiA2OS44OTEgOC45MTYgNjkuODkxIDExLjUzNSBMIDY5Ljg5MSAxOC4wNjUgTCA2Ny4xNTUgMTguMDY1IEwgNjcuMTU1IDUuMTA1IEwgNjkuNTQyIDUuMTA1IEwgNjkuODQ3IDYuODA3IEMgNzAuNjYyIDUuNzg5IDcxLjg5OSA0Ljk2IDczLjk5NSA0Ljk2IEMgNzYuODYzIDQuOTYgNzkuMjA2IDYuNTMxIDc5LjIwNiAxMC44NTEgWiBNIDU2Ljk4MSA1LjEwNSBMIDY0LjUwNiA1LjEwNSBMIDY0LjUwNiAxOC4wNjUgTCA2MS43NCAxOC4wNjUgTCA2MS43NCA3LjUyIEwgNTYuOTgxIDcuNTIgTCA1Ni45ODEgMTguMDY1IEwgNTQuMjE2IDE4LjA2NSBMIDU0LjIxNiA3LjUyIEwgNTEuOTYgNy41MiBMIDUxLjk2IDUuMTIgTCA1NC4yMTYgNS4xMiBMIDU0LjIxNiAzLjgyNSBDIDU0LjIxNiAxLjU0MiA1NS4zMzYgMC4zNjQgNTcuODQgMC4zNjQgTCA2MC4xMzkgMC4zNjQgTCA2MC4xMzkgMi43NjQgTCA1OC4yMTggMi43NjQgQyA1Ny4zMyAyLjc2NCA1Ni45ODEgMy4xNDIgNTYuOTgxIDQuMDI5IEwgNTYuOTgxIDUuMTIgTCA1Ni45ODEgNS4xMDUgWiIgZmlsbD0iY3VycmVudENvbG9yIiBmaWxsLXJ1bGU9Im5vbnplcm8iPjwvcGF0aD4KPC9zdmc+" alt="Parafin"/></span>
    </div>
  );
}

/* ── Single-product widget (Flex-only / Term-only) ─────────── */
function MofSoloWidget({ product = 'flex', amount = 21000, expiry = 'Jun 12', lean = false, wide = false, onChoose }) {
  const isFlex = product === 'flex';
  const max = isFlex ? MOF_FLEX_MAX : MOF_TERM_MAX;
  const holdback = Math.round(FLEX.durations[0].holdback * 100);
  const sample = Math.min(amount, MOF_TERM_MAX);
  const biweekly = Math.round(sample * (1 + TERM.durations[0].feeRate) / TERM.durations[0].biweeks);
  return (
    <div className={'mofw mofw-solo' + (wide ? ' mofw--wide' : '')} data-screen-label={`Widget · ${isFlex ? 'Flex' : 'Term'} only`}>
      <div className="mofw-head">
        <span className="mof-widget-product">
          <span className="mof-widget-glyph"><MofGlyph product={product} /></span>
          {isFlex ? 'Flex' : 'Term'}
        </span>
        <span className="mof-badge"><span className="dot" /> Offer ready</span>
      </div>

      <div className="mofw-fig"><span className="pre">Up to</span>{usd(max)}</div>

      <p className="mofw-desc">
        {isFlex
          ? <>Pay as you sell — a set <b>percentage of your daily sales</b> is debited automatically until it’s repaid. Lighter on slow days.</>
          : <><b>Fixed payments</b> every two weeks — the same amount each time, until it’s repaid. Simple to budget.</>}
      </p>

      <div className="mofw-mech">
        {isFlex
          ? <span>From <b>{holdback}% of daily sales</b></span>
          : <span>About <b>{usd(biweekly)}</b> every 2 weeks</span>}
      </div>

      {!lean && <MofBenefits />}

      <button type="button" className="mof-btn mof-btn--block" onClick={onChoose ? () => onChoose(product) : undefined}>
        View {isFlex ? 'Flex' : 'Term'} offer <span aria-hidden="true">→</span>
      </button>

      {!lean && <MofFoot expiry={expiry} />}
    </div>
  );
}

/* ── Combined widget (both offers) ─────────────────────────────
 * ctaPerSection=false → one shared CTA at the bottom (concept 1).
 * ctaPerSection=true  → a CTA inside each Flex/Term section instead. */
function MofComboWidget({ amount = 21000, expiry = 'Jun 12', ctaPerSection = false, wide = false }) {
  const holdback = Math.round(FLEX.durations[0].holdback * 100);
  const sample = Math.min(amount, MOF_TERM_MAX);
  const biweekly = Math.round(sample * (1 + TERM.durations[0].feeRate) / TERM.durations[0].biweeks);

  const renderOpt = (name, lead, amt, desc) => (
    <div className="mofw-opt">
      <div className="mofw-opt-top">
        <div className="mofw-opt-headgroup">
          <span className="mofw-opt-eyebrow">{name}</span>
          <span className="mofw-opt-lead">{lead}</span>
        </div>
        {!ctaPerSection && <span className="mofw-opt-pill">Up to {amt}</span>}
      </div>
      {ctaPerSection && <span className="mofw-opt-bigamt"><span className="pre">Up to</span>{amt}</span>}
      <p className="mofw-opt-desc">{desc}</p>
      {ctaPerSection &&
        <button type="button" className="mof-btn mof-btn--sm mof-btn--block mofw-opt-cta">
          View {name} offer <span aria-hidden="true">→</span>
        </button>}
    </div>
  );

  return (
    <div className={'mofw mofw-combo' + (wide ? ' mofw--wide' : '') + (ctaPerSection ? ' mofw-combo--per' : '')} data-screen-label={ctaPerSection ? 'Widget · Combined (CTA per section)' : 'Widget · Combined (both offers)'}>
      <div className="mofw-head">
        <div>
          {!ctaPerSection &&
            <React.Fragment>
              <span className="mofw-combo-eyebrow">You’re pre-approved up to</span>
              <span className="mofw-combo-amount">{usd(MOF_TERM_MAX)}</span>
            </React.Fragment>}
          <h3 className="mofw-combo-title">2 offers, 2 ways to pay</h3>
          <p className="mofw-combo-sub">
            Same money in — repay as a percentage of your sales with Flex, or on a fixed schedule with Term.
          </p>
        </div>
      </div>

      <div className="mofw-opts">
        {renderOpt('Term', 'Fixed repayments', usd(MOF_TERM_MAX),
          <><b>Fixed payments</b> every two weeks — the same amount each time.</>)}
        {renderOpt('Flex', '% of sales', usd(MOF_FLEX_MAX),
          <>A <b>percentage of daily sales</b> until repaid — lighter on slow days.</>)}
      </div>

      <MofBenefits />

      {!ctaPerSection &&
        <button type="button" className="mof-btn mof-btn--block">
          View your offer <span aria-hidden="true">→</span>
        </button>}

      <MofFoot expiry={expiry} />
    </div>
  );
}

/* Stage — embeds widgets in the partner Capital dashboard area. */
function MofWidgetStage({ theme = 'light', mobile = false, partner = 'Harbor', title, sub, band, children }) {
  return (
    <div className={'mof' + (mobile ? ' mof--mobile' : '')} data-theme={theme}>
      <div className="mofw-stage">
        <div className="mofw-stage-head">
          <span className="mofw-stage-title">{title}</span>
          <span className="mofw-stage-sub">{sub}</span>
        </div>
        <div className="mofw-row">{children}</div>
        {band}
      </div>
    </div>
  );
}

/* ── Partner dashboard shell — embeds a widget at full width in a real
 * setting (top bar + sidebar nav + a "Capital" page). The root carries
 * .mof so the mercury tokens resolve for the chrome AND the widget. ── */
const _dw = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round', strokeLinejoin: 'round' };
function DIcoHome()    { return <svg viewBox="0 0 18 18" aria-hidden="true"><path d="M3 8 L9 3 L15 8 V15 H3 Z M7 15 V11 H11 V15" {..._dw}/></svg>; }
function DIcoCard()    { return <svg viewBox="0 0 18 18" aria-hidden="true"><g {..._dw}><rect x="2.5" y="4" width="13" height="10" rx="2"/><path d="M2.5 7.5 H15.5"/></g></svg>; }
function DIcoChart()   { return <svg viewBox="0 0 18 18" aria-hidden="true"><path d="M3 3 V15 H15 M6 12 V9 M9.5 12 V6 M13 12 V8" {..._dw}/></svg>; }
function DIcoCapital() { return <svg viewBox="0 0 18 18" aria-hidden="true"><g {..._dw}><ellipse cx="9" cy="5" rx="6" ry="2.4"/><path d="M3 5 V13 C3 14.3 5.7 15.4 9 15.4 C12.3 15.4 15 14.3 15 13 V5"/><path d="M3 9 C3 10.3 5.7 11.4 9 11.4 C12.3 11.4 15 10.3 15 9"/></g></svg>; }
function DIcoGear()    { return <svg viewBox="0 0 18 18" aria-hidden="true"><g {..._dw}><circle cx="9" cy="9" r="2.4"/><path d="M9 1.6 V3.4 M9 14.6 V16.4 M1.6 9 H3.4 M14.6 9 H16.4 M3.8 3.8 L5 5 M13 13 L14.2 14.2 M14.2 3.8 L13 5 M5 13 L3.8 14.2"/></g></svg>; }
function DIcoBell()    { return <svg viewBox="0 0 18 18" aria-hidden="true"><path d="M5 8 a4 4 0 0 1 8 0 c0 3 1 4 1 4 H4 s1 -1 1 -4 M7.5 14.5 a1.5 1.5 0 0 0 3 0" {..._dw}/></svg>; }
function DIcoSearch()  { return <svg viewBox="0 0 18 18" aria-hidden="true"><g {..._dw}><circle cx="8" cy="8" r="5"/><path d="M11.5 11.5 L15 15"/></g></svg>; }

function MofDashboard({ theme = 'light', partner = 'Harbor', mobile = false, children }) {
  const initial = (partner.trim()[0] || 'H').toUpperCase();
  const nav = [
    [<DIcoHome/>, 'Home'], [<DIcoCard/>, 'Payments'], [<DIcoChart/>, 'Reports'],
    [<DIcoCapital/>, 'Capital', true], [<DIcoGear/>, 'Settings'],
  ];
  return (
    <div className={'mof mofdash' + (mobile ? ' mofdash--mobile mof--mobile' : '')} data-theme={theme}
      data-screen-label={`Dashboard · Capital${mobile ? ' · Mobile' : ''}`}>
      <header className="mofdash-top">
        <span className="mofdash-brand">
          <span className="mofdash-brand-mark">{initial}</span>{partner}
        </span>
        <span className="mofdash-search"><DIcoSearch /> Search</span>
        <div className="mofdash-top-right">
          <span className="mofdash-icon-btn"><DIcoBell /></span>
          <span className="mofdash-avatar">JM</span>
        </div>
      </header>
      <div className="mofdash-shell">
        <aside className="mofdash-side">
          <span className="mofdash-side-label">{partner}</span>
          {nav.map(([ic, label, on], i) => (
            <span key={i} className={'mofdash-navitem' + (on ? ' is-on' : '')}>{ic}{label}</span>
          ))}
          <span className="mofdash-side-spacer" />
        </aside>
        <main className="mofdash-main">
          <div className="mofdash-pagehead">
            <span className="mofdash-eyebrow">Financing</span>
            <h1 className="mofdash-h1">Capital</h1>
            <p className="mofdash-lede">
              Funding for your business, powered by Parafin. Review your pre-approved offers below.
            </p>
          </div>
          {children}
        </main>
      </div>
    </div>
  );
}

Object.assign(window, { MofComboWidget, MofSoloWidget, MofBenefits, MofBenefitsBand, MofWidgetStage, MofDashboard, mofBenefitItems });
