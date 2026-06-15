/* Mercury offer system — components.
 *
 * Exports:
 *   OfferWidget        — one embeddable dashboard widget for a product
 *   CapitalWidgets     — both widgets in a small dashboard strip
 *   FlexOfferPage      — Flex offer: amount → duration → review, with a
 *                        `crosssell` prop selecting how the Term offer is
 *                        surfaced ('callout' | 'tabs' | 'footer' | 'rail')
 *
 * Numbers come from FLEX / TERM (offer-shared.jsx); usd / fmtDate /
 * addMonths / addDays from v1b-stats.jsx.
 */

const MOF_FLEX_MAX = FLEX.maxAmount;   // 35,000
const MOF_TERM_MAX = TERM.maxAmount;   // 50,000
const MOF_NINEMO_MAX = 10000;
const MOF_MIN = 5000;
const MOF_TODAY = new Date('2026-05-29');

function MofGlyph({ product }) {
  const p = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round', strokeLinejoin: 'round' };
  // Flex = lightning (pay as you sell) · Term = calendar (fixed schedule)
  return product === 'term'
    ? <svg viewBox="0 0 20 20" aria-hidden="true"><g {...p}><rect x="3" y="4.5" width="14" height="12" rx="2"/><path d="M3 8 H17 M7 3 V6 M13 3 V6"/></g></svg>
    : <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M11 2.5 L4 11 H9.2 L8.5 17.5 L16 8.8 H10.4 Z" {...p}/></svg>;
}
function MofShield() {
  return <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M8 1.6 L13 3.4 V8 C13 11 10.8 13.2 8 14.4 C5.2 13.2 3 11 3 8 V3.4 Z"/><path d="M5.8 8 L7.2 9.4 L10.2 6"/></svg>;
}
function MofArrow() { return <span aria-hidden="true">→</span>; }

const fmtUSD = (n) => usd(n);

/* ── Dashboard widget ─────────────────────────────────────── */

function OfferWidget({ product, amount, onView, expiry = 'Jun 12' }) {
  const isFlex = product === 'flex';
  const max = isFlex ? MOF_FLEX_MAX : MOF_TERM_MAX;
  const dur = (isFlex ? FLEX : TERM).durations[0];
  const holdback = isFlex ? Math.round(FLEX.durations[0].holdback * 100) : null;
  const sample = Math.min(amount, max);
  const biweekly = !isFlex ? Math.round(sample * (1 + dur.feeRate) / dur.biweeks) : null;
  return (
    <div className="mof-widget">
      <div className="mof-widget-top">
        <span className="mof-widget-product">
          <span className="mof-widget-glyph"><MofGlyph product={product} /></span>
          {isFlex ? 'Flex' : 'Term'}
        </span>
        <span className="mof-badge"><span className="dot" /> Offer ready</span>
      </div>
      <div>
        <div className="mof-widget-fig"><span className="pre">Up to </span>{fmtUSD(max)}</div>
      </div>
      <p className="mof-widget-pitch">
        {isFlex
          ? 'Pay as you sell — a share of daily sales until repaid. Flexes with your revenue.'
          : 'Fixed payments every two weeks. Predictable and simple to budget.'}
      </p>
      <div className="mof-widget-meta">
        {isFlex
          ? <span>From <b>{holdback}% of daily sales</b></span>
          : <span>About <b>{fmtUSD(biweekly)}</b> every 2 weeks</span>}
      </div>
      <div className="mof-widget-cta">
        <button className="mof-btn mof-btn--sm" onClick={onView}>View offer <MofArrow /></button>
        <span className="mof-widget-expiry">Expires {expiry}</span>
      </div>
    </div>
  );
}

function CapitalWidgets({ amount, theme = 'light', mobile = false, partner = 'Harbor' }) {
  return (
    <div className={'mof' + (mobile ? ' mof--mobile' : '')} data-theme={theme}
      data-screen-label={`Dashboard widgets${mobile ? ' · Mobile' : ''}`}>
      <div className="mof-dashstrip">
        <div className="mof-dashstrip-head">
          <span className="mof-dashstrip-title">Capital offers</span>
          <span className="mof-dashstrip-sub">2 financing offers available for your business through {partner}.</span>
        </div>
        <div className="mof-widgets" style={mobile ? { flexDirection: 'column' } : null}>
          <OfferWidget product="flex" amount={amount} />
          <OfferWidget product="term" amount={amount} />
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { OfferWidget, CapitalWidgets, MofGlyph, MofShield, MOF_FLEX_MAX, MOF_TERM_MAX, MOF_NINEMO_MAX, MOF_MIN, MOF_TODAY });
