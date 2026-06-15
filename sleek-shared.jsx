/* sleek-shared.jsx — small atoms reused across the sleek variants. */

const SK_BARS_FLEX = [
18, 24, 20, 32, 28, 34, 22, 16, 26, 30, 38, 24, 18, 28];

const SK_BARS_TERM = Array(14).fill(24);

/* Naming framings.
 *   "product" — Parafin's marketed names: Flex / Term
 *   "concept" — universal concept names: Flexible / Fixed (helpful when the
 *               product names aren't familiar yet to the buyer).
 * The shape of each entry is the same so we can pass `labels.flex` /
 * `labels.term` everywhere a display name is needed without branching.
 */
const SK_LABELS = {
  product: {
    flex: 'Flex', term: 'Term',
    flexShort: 'Flex', termShort: 'Term',
    headline: 'Select your pre-approved offer details',
    repaymentTitle: 'Choose how to repay',
    repaymentSub: 'Flexible or fixed repayment'
  },
  concept: {
    flex: 'Flexible', term: 'Fixed',
    flexShort: 'Flexible', termShort: 'Fixed',
    headline: 'Select your pre-approved offer details',
    repaymentTitle: 'Fixed or flexible?',
    repaymentSub: 'Pick the repayment style that fits your business'
  }
};

function skLabels(naming) {
  return SK_LABELS[naming] || SK_LABELS.product;
}

function SkBars({ data = SK_BARS_FLEX, max = 40, className = '' }) {
  return (
    <div className={'sk-bars ' + className}>
      {data.map((v, i) =>
      <span key={i} style={{ height: `${v / max * 100}%` }} />
      )}
    </div>);

}

/* SkTermShape — illustrations of "fixed weekly amount, every week".
 * The wrapping <div class="sk-shape-term"> gives all variants the same
 * vertical rhythm (legend + visual + label row) so a Term card aligns
 * with a Flex card next to it.
 */
function SkTermShape({ variant = 'calendar', weekly, weeks = 52, total, detailed = true }) {
  const wrap = (content) =>
  <div className={'sk-shape-term' + (detailed ? '' : ' compact')}>
      {detailed &&
    <div className="sk-shape-flex-legend">
          <span><span className="dot pay" />Weekly payment</span>
        </div>
    }
      <div className="sk-shape-term-row">{content}</div>
    </div>;


  if (variant === 'weeks') {
    // Bi-weekly cadence as a list of payment weeks: 1, 3, 5, …, 51.
    return (
      <div className={'sk-shape-term' + (detailed ? '' : ' compact')}>
        {detailed &&
        <div className="sk-shape-flex-legend">
            <span><span className="dot pay" />Biweekly payment</span>
          </div>
        }
        <div className="sk-shape-weeklist">
          <div className="sk-shape-weekrow"><span className="wk">Week 1</span><span className="amt">{usd(weekly)}</span></div>
          <div className="sk-shape-weekrow"><span className="wk">Week 3</span><span className="amt">{usd(weekly)}</span></div>
          <div className="sk-shape-weekrow sk-shape-weekrow--ell" aria-hidden="true"><span className="wk">⋮</span></div>
          <div className="sk-shape-weekrow"><span className="wk">Week 51</span><span className="amt">{usd(weekly)}</span></div>
        </div>
      </div>);

  }
  if (variant === 'bars') {
    return wrap(<SkBars data={SK_BARS_TERM} max={40} className="term" />);
  }
  if (variant === 'equation') {
    return wrap(
      <div className="sk-shape-eq">
        <span className="num">{usd(weekly)}</span>
        <span className="op">×</span>
        <span className="num">{weeks}<span style={{ fontWeight: 400, marginLeft: 2, fontSize: 12, color: 'var(--sk-ink-3)' }}>wk</span></span>
        <span className="op">=</span>
        <span className="num">{usd(total)}</span>
      </div>
    );
  }
  if (variant === 'calendar') {
    // 6 bi-weekly columns. Each shows 7 day-bars; one day (Thursday) of
    // every other column is taller and brand-colored — reads as: same
    // day, every two weeks.
    const cols = 6;
    const paymentDay = 3;
    return (
      <div className={'sk-shape-term' + (detailed ? '' : ' compact')}>
        {detailed &&
        <div className="sk-shape-flex-legend">
            <span><span className="dot pay" />Bi-weekly payment</span>
          </div>
        }
        <div className="sk-shape-cal">
          {Array.from({ length: cols }).map((_, w) => {
            const isPayWeek = w % 2 === 0;
            return (
              <div key={w} className="sk-shape-cal-week">
                <div className="sk-shape-cal-days">
                  {Array.from({ length: 7 }).map((_, d) =>
                  <span key={d} className={isPayWeek && d === paymentDay ? 'pay' : ''} />
                  )}
                </div>
                {detailed &&
                <span className="sk-shape-flex-amt">
                    {isPayWeek ? usd(weekly) : '—'}
                  </span>
                }
                <span className="sk-shape-flex-day-label">W{w + 1}</span>
              </div>);

          })}
        </div>
      </div>);

  }
  if (variant === 'ticks') {
    return wrap(
      <div className="sk-shape-ticks">
        <div className="sk-shape-ticks-bar" />
        <div className="sk-shape-ticks-marks">
          {Array.from({ length: weeks }).map((_, i) =>
          <span key={i} className={i % 4 === 0 ? 'major' : ''} />
          )}
        </div>
      </div>
    );
  }
  // dots (default)
  return wrap(
    <div className="sk-shape-dots">
      {Array.from({ length: weeks }).map((_, i) =>
      <span key={i} className={i % 4 === 0 ? 'month-marker' : ''} />
      )}
    </div>
  );
}

/* SkFlexShape — sales-vs-payment illustration. Each day's total bar height
 * = that day's sales. Brand-colored slice at the bottom = the % withheld.
 * One day shows zero sales (a "$0 day"): no withholding, no payment that
 * day — illustrates the variable-cadence promise of Flex.
 */
function SkFlexShape({ holdback = 0.10, detailed = true }) {
  const days = [
  { day: 'M', sales: 250 },
  { day: 'T', sales: 180 },
  { day: 'W', sales: 320 },
  { day: 'T', sales: 0, zero: true },
  { day: 'F', sales: 410 }];

  const maxSales = 500;
  const pct = Math.round(holdback * 100);
  const money = (n) => '$' + n.toLocaleString('en-US');
  return (
    <div className={'sk-shape-flex' + (detailed ? ' sk-shape-flex--amts' : ' compact')}>
      {detailed &&
      <div className="sk-shape-flex-legend">
          <span><span className="dot sales" />Daily sales</span>
          <span><span className="dot pay" />{pct}% withheld</span>
        </div>
      }
      <div className="sk-shape-flex-row">
        {days.map((d, i) => {
          const salesH = d.zero ? 0 : d.sales / maxSales * 100;
          const withheld = d.zero ? 0 : Math.round(d.sales * holdback);
          return (
            <div key={i} className={'sk-shape-flex-day' + (d.zero ? ' is-zero' : '')}>
              {detailed &&
              <span className="sk-shape-flex-sales">{money(d.sales)}</span>
              }
              <div className="sk-shape-flex-bars">
                {d.zero ?
                <span className="sk-shape-flex-flat" /> :

                <span className="sk-shape-flex-bar" style={{ height: salesH + '%' }}>
                    <span className="sk-shape-flex-pay"
                  style={{ height: holdback * 100 + '%' }} />
                  </span>
                }
              </div>
              {detailed &&
              <span className="sk-shape-flex-withheld">
                  {d.zero ? money(0) : '−' + money(withheld)}
                </span>
              }
              {detailed &&
              <span className="sk-shape-flex-day-label">
                  {d.day}
                </span>
              }
            </div>);

        })}
      </div>
    </div>);

}

function SkCheck() {
  return (
    <svg viewBox="0 0 16 16" width="14" height="14" fill="none" aria-hidden="true">
      <path d="M3.5 8.5l3 3 6-7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>);

}

function SkPowered() {
  return (
    <span className="sk-powered">
      Powered by
      <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMi4wMjAiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMi4wMjAgMzIiIGZpbGw9Im5vbmUiPgogIDxwYXRoIGQ9Ik0gMTYuNjA0IDEwLjI3IEwgMTcuNjI4IDAuMDggQyAxNy4wOSAwLjAyNiAxNi41NSAwIDE2LjAxIDAgQyAxNS40OSAwIDE0Ljk3NSAwLjAyNSAxNC40NjcgMC4wNzQgTCAxNC45NTggNS4wODQgQyAxNS4zMTEgNC45NTcgMTUuNjczIDQuODQ0IDE2LjA0MSA0Ljc1MyBMIDE2LjAzNSAxMC4yNDEgQyAxNi4yMjcgMTAuMjQgMTYuNDE3IDEwLjI1MSAxNi42MDQgMTAuMjcgWiIgZmlsbD0iY3VycmVudENvbG9yIiBmaWxsLXJ1bGU9Im5vbnplcm8iPjwvcGF0aD4KICA8cGF0aCBkPSJNIDExLjMyOCA3LjIgQyAxMS41ODcgNi45NzggMTEuODU1IDYuNzY3IDEyLjEzMiA2LjU2OCBMIDEzLjgyNiAxMC42NjcgQyAxNC4wMDEgMTAuNTk2IDE0LjE4MSAxMC41MzMgMTQuMzY0IDEwLjQ4IEwgMTEuNDA4IDAuNjcyIEMgMTAuMzk2IDAuOTc2IDkuNDE3IDEuMzc5IDguNDg1IDEuODc2IEwgMTEuMzI4IDcuMiBaIiBmaWxsPSJjdXJyZW50Q29sb3IiIGZpbGwtcnVsZT0ibm9uemVybyI+PC9wYXRoPgogIDxwYXRoIGQ9Ik0gMTkuNTUgNC40MTkgQyAxOS45NjUgNC40NDIgMjAuMzc4IDQuNDg3IDIwLjc4NyA0LjU1NSBMIDE4LjIzOCAxMC42ODYgQyAxOC40MTQgMTAuNzYgMTguNTg1IDEwLjg0MiAxOC43NTIgMTAuOTMyIEwgMjMuNiAxLjkwOSBDIDIyLjY3IDEuNDA4IDIxLjY5MyAxLjAwMSAyMC42ODMgMC42OTMgTCAxOS41NSA0LjQxOSBaIiBmaWxsPSJjdXJyZW50Q29sb3IiIGZpbGwtcnVsZT0ibm9uemVybyI+PC9wYXRoPgogIDxwYXRoIGQ9Ik0gOS4zODQgOS4zNDUgQyA5LjIwOCA5LjYwMiA5LjAzOSA5Ljg2NCA4Ljg3OSAxMC4xMyBMIDMuNjQ1IDUuODM0IEMgNC4zMTcgNS4wMTkgNS4wNjcgNC4yNzIgNS44ODYgMy42MDQgTCAxMi4zNyAxMS41MzIgQyAxMi4yMjIgMTEuNjUyIDEyLjA4MSAxMS43NzkgMTEuOTQ2IDExLjkxNCBMIDkuMzg0IDkuMzQ1IFoiIGZpbGw9ImN1cnJlbnRDb2xvciIgZmlsbC1ydWxlPSJub256ZXJvIj48L3BhdGg+CiAgPHBhdGggZD0iTSAyMC4wOTkgMTEuOTQxIEwgMjUuNTU0IDYuNTAxIEMgMjUuMTg5IDYuMjQ0IDI0LjgwOCA2LjAwOCAyNC40MTUgNS43OTYgTCAyNi4xODQgMy42NDMgQyAyNi45OTggNC4zMTUgMjcuNzQ1IDUuMDY1IDI4LjQxMiA1Ljg4MyBMIDIwLjQ3OSAxMi4zNjMgQyAyMC4zNTkgMTIuMjE2IDIwLjIzMiAxMi4wNzUgMjAuMDk5IDExLjk0MSBaIiBmaWxsPSJjdXJyZW50Q29sb3IiIGZpbGwtcnVsZT0ibm9uemVybyI+PC9wYXRoPgogIDxwYXRoIGQ9Ik0gMjEuNTMzIDE0LjM0MyBMIDMxLjM0NyAxMS4zODkgQyAzMS4wNDMgMTAuMzc5IDMwLjYzOSA5LjQwMSAzMC4xNDIgOC40NzEgTCAyOC40MyA5LjM4NSBDIDI4LjY5NyA5Ljc3IDI4Ljk0MSAxMC4xNzEgMjkuMTYxIDEwLjU4NSBMIDIxLjM0MSAxMy44MDggQyAyMS40MTQgMTMuOTgzIDIxLjQ3OCAxNC4xNjIgMjEuNTMzIDE0LjM0MyBaIiBmaWxsPSJjdXJyZW50Q29sb3IiIGZpbGwtcnVsZT0ibm9uemVybyI+PC9wYXRoPgogIDxwYXRoIGQ9Ik0gMjUuNTMgMjUuNTIgQyAyNS45MDEgMjUuMjU5IDI2LjI1OCAyNC45NzcgMjYuNTk3IDI0LjY3NSBMIDI4LjM4MyAyNi4xNTEgQyAyNy43MTMgMjYuOTY2IDI2Ljk2NSAyNy43MTMgMjYuMTQ5IDI4LjM4MiBMIDE5LjY2NSAyMC40NTQgQyAxOS44MTIgMjAuMzM0IDE5Ljk1MiAyMC4yMDYgMjAuMDg2IDIwLjA3MiBMIDI1LjUzIDI1LjUyIFoiIGZpbGw9ImN1cnJlbnRDb2xvciIgZmlsbC1ydWxlPSJub256ZXJvIj48L3BhdGg+CiAgPHBhdGggZD0iTSAzMC40OTkgMTYuMDE2IEwgMzAuNDk5IDE2IEMgMzAuNDk5IDE1LjUzIDMwLjQ3IDE1LjA2MSAzMC40MTMgMTQuNTk1IEwgMzEuOTQ0IDE0LjQ0NSBDIDMxLjk5NCAxNC45NTggMzIuMDIgMTUuNDc4IDMyLjAyIDE2LjAwNCBDIDMyLjAyIDE2LjU0MyAzMS45OTMgMTcuMDc1IDMxLjk0IDE3LjYgTCAyMS43NDUgMTYuNTc0IEMgMjEuNzYzIDE2LjM4NyAyMS43NzQgMTYuMTk4IDIxLjc3NCAxNi4wMDYgTCAzMC40OTkgMTYuMDE2IFoiIGZpbGw9ImN1cnJlbnRDb2xvciIgZmlsbC1ydWxlPSJub256ZXJvIj48L3BhdGg+CiAgPHBhdGggZD0iTSA5LjM3MiAyMi42NCBMIDExLjkzOSAyMC4wOCBDIDExLjgwNSAxOS45NDYgMTEuNjc3IDE5LjgwNSAxMS41NTUgMTkuNjU4IEwgMy42MjMgMjYuMTM4IEMgNC4yOTMgMjYuOTU2IDUuMDQyIDI3LjcwNiA1Ljg1OSAyOC4zNzggTCA5Ljk0OSAyMy40MDEgQyA5Ljc0NyAyMy4xNTMgOS41NTUgMjIuODk5IDkuMzcyIDIyLjY0IFoiIGZpbGw9ImN1cnJlbnRDb2xvciIgZmlsbC1ydWxlPSJub256ZXJvIj48L3BhdGg+CiAgPHBhdGggZD0iTSA3LjI4NSAxNS45OSBMIDcuMjg1IDE2IEMgNy4yODUgMTYuMjg3IDcuMjk2IDE2LjU3MiA3LjMyIDE2Ljg1NCBMIDAuMDggMTcuNTYyIEMgMC4wMjYgMTcuMDQ5IDAgMTYuNTI3IDAgMTYgQyAwIDE1LjQ2IDAuMDI3IDE0LjkyNiAwLjA4IDE0LjQgTCAxMC4yNzUgMTUuNDE5IEMgMTAuMjU3IDE1LjYwNyAxMC4yNDYgMTUuNzk4IDEwLjI0NiAxNS45OSBMIDcuMjg1IDE1Ljk5IFoiIGZpbGw9ImN1cnJlbnRDb2xvciIgZmlsbC1ydWxlPSJub256ZXJvIj48L3BhdGg+CiAgPHBhdGggZD0iTSA4LjA4NSAyMC4yNCBDIDcuOTc4IDE5Ljk2NSA3Ljg4MSAxOS42ODUgNy43OTIgMTkuNCBMIDEwLjY4NiAxOC4yMDYgQyAxMC42MTMgMTguMDMxIDEwLjU0OSAxNy44NTEgMTAuNDkzIDE3LjY2OCBMIDAuNjggMjAuNjIyIEMgMC45ODQgMjEuNjM0IDEuMzg5IDIyLjYxMyAxLjg4OSAyMy41NDUgTCA4LjA4NSAyMC4yNCBaIiBmaWxsPSJjdXJyZW50Q29sb3IiIGZpbGwtcnVsZT0ibm9uemVybyI+PC9wYXRoPgogIDxwYXRoIGQ9Ik0gMjAuNzU5IDI3LjQ1IEMgMjEuMTc4IDI3LjM4MiAyMS41OTIgMjcuMjkyIDIyLjAwMSAyNy4xNzggTCAyMy41NjYgMzAuMTA5IEMgMjIuNjM2IDMwLjYwNyAyMS42NTggMzEuMDEyIDIwLjY0NyAzMS4zMTggTCAxNy42OSAyMS41MSBDIDE3Ljg3MyAyMS40NTUgMTguMDUyIDIxLjM5IDE4LjIyNyAyMS4zMTggTCAyMC43NTkgMjcuNDUgWiIgZmlsbD0iY3VycmVudENvbG9yIiBmaWxsLXJ1bGU9Im5vbnplcm8iPjwvcGF0aD4KICA8cGF0aCBkPSJNIDI5LjcyOSAyMC4xNiBDIDI5LjU2IDIwLjYgMjkuMzY0IDIxLjAzIDI5LjE0MiAyMS40NDYgTCAyMS4zMzYgMTguMjA0IEMgMjEuMjY0IDE4LjM3OSAyMS4xODQgMTguNTUgMjEuMDk2IDE4LjcxNyBMIDMwLjEyNSAyMy41NjIgQyAzMC42MjQgMjIuNjMzIDMxLjAzIDIxLjY1NyAzMS4zMzYgMjAuNjQ3IEwgMjkuNzI5IDIwLjE2IFoiIGZpbGw9ImN1cnJlbnRDb2xvciIgZmlsbC1ydWxlPSJub256ZXJvIj48L3BhdGg+CiAgPHBhdGggZD0iTSAxNy4xNTQgMjcuNDY4IEwgMTcuNTkgMzEuOTIgQyAxNy4wNyAzMS45NzMgMTYuNTQ0IDMyIDE2LjAxIDMyIEMgMTUuNDc2IDMyIDE0Ljk1IDMxLjk3MyAxNC40MyAzMS45MiBMIDE1LjQ1IDIxLjczIEMgMTUuNjM2IDIxLjc0OCAxNS44MjIgMjEuNzU4IDE2LjAxIDIxLjc1OCBMIDE2LjAyMyAyMS43NTggTCAxNi4wMTYgMjcuMjM4IEMgMTYuMzkxIDI3LjMzNCAxNi43NzEgMjcuNDExIDE3LjE1NCAyNy40NjggWiIgZmlsbD0iY3VycmVudENvbG9yIiBmaWxsLXJ1bGU9Im5vbnplcm8iPjwvcGF0aD4KICA8cGF0aCBkPSJNIDEyLjExMSAyNS40MTcgQyAxMi4zOTYgMjUuNjIxIDEyLjY5IDI1LjgxMiAxMi45OTEgMjUuOTkgTCAxMS4zNzIgMzEuMzE3IEMgMTAuMzYgMzEuMDExIDkuMzgxIDMwLjYwNiA4LjQ1IDMwLjEwNiBMIDEzLjI5NSAyMS4wODYgQyAxMy40NjIgMjEuMTcyIDEzLjYzNCAyMS4yNTQgMTMuODExIDIxLjMyNiBMIDEyLjExMSAyNS40MTcgWiIgZmlsbD0iY3VycmVudENvbG9yIiBmaWxsLXJ1bGU9Im5vbnplcm8iPjwvcGF0aD4KICA8cGF0aCBkPSJNIDcuNzk3IDEyLjU4MiBDIDcuNzExIDEyLjg2MSA3LjYzNiAxMy4xNDQgNy41NyAxMy40MzEgTCAwLjY5IDExLjM0MiBDIDAuOTk3IDEwLjMzMSAxLjQwNSA5LjM1MyAxLjkwNyA4LjQyMiBMIDEwLjkzNiAxMy4yNjYgQyAxMC44NDUgMTMuNDMzIDEwLjc2MyAxMy42MDYgMTAuNjkgMTMuNzgyIEwgNy43OTcgMTIuNTgyIFoiIGZpbGw9ImN1cnJlbnRDb2xvciIgZmlsbC1ydWxlPSJub256ZXJvIj48L3BhdGg+Cjwvc3ZnPg==" alt="" />
      <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI3OS4yMDYiIGhlaWdodD0iMTguMjI1IiB2aWV3Qm94PSIwIDAgNzkuMjA2IDE4LjIyNSIgZmlsbD0ibm9uZSI+CiAgPHBhdGggZD0iTSA2Ljk4NiAwLjM0OSBMIDAgMC4zNDkgTCAwIDE4LjA2NSBMIDIuOTExIDE4LjA2NSBMIDIuOTExIDExLjYzNiBMIDYuOTg2IDExLjYzNiBDIDEwLjY4MyAxMS42MzYgMTMuMTE0IDkuNDExIDEzLjExNCA1Ljk5MyBDIDEzLjExNCAyLjU3NSAxMC42ODMgMC4zNDkgNi45ODYgMC4zNDkgWiBNIDYuNzM5IDkuMTA1IEwgMi45MTEgOS4xMDUgTCAyLjkxMSAyLjg4IEwgNi43NTMgMi44OCBDIDguODM1IDIuODggMTAuMTQ1IDQuMDczIDEwLjE0NSA1Ljk5MyBDIDEwLjE0NSA3LjkxMyA4LjgwNiA5LjEwNSA2LjcyNCA5LjEwNSBMIDYuNzM5IDkuMTA1IFogTSAyNC4zMjEgNy4wMTEgQyAyMy40OTEgNS44MTggMjIuMTIzIDQuOTYgMjAuMDg1IDQuOTYgQyAxNi41NjMgNC45NiAxMy45NTggNy41OTMgMTMuOTU4IDExLjU5MyBDIDEzLjk1OCAxNS41OTMgMTYuNTYzIDE4LjIyNSAyMC4wODUgMTguMjI1IEMgMjIuMTA4IDE4LjIyNSAyMy40NzYgMTcuMjY1IDI0LjMyMSAxNi4xMDIgTCAyNC42MjYgMTguMDggTCAyNy4wMjggMTguMDggTCAyNy4wMjggNS4xMDUgTCAyNC42NTUgNS4xMDUgTCAyNC4zMjEgNi45OTYgTCAyNC4zMjEgNy4wMTEgWiBNIDIwLjU1MSAxNS45MTMgQyAxOC4yNjYgMTUuOTEzIDE2Ljc4MSAxNC4xMzggMTYuNzgxIDExLjU3OCBDIDE2Ljc4MSA5LjAxOCAxOC4yODEgNy4yNzMgMjAuNTUxIDcuMjczIEMgMjIuODIyIDcuMjczIDI0LjMyMSA5LjA2MiAyNC4zMjEgMTEuNjIyIEMgMjQuMzIxIDE0LjE4MiAyMi44MjIgMTUuODk4IDIwLjU1MSAxNS44OTggTCAyMC41NTEgMTUuOTEzIFogTSA0Ny44MjYgNy4wMTEgQyA0Ni45OTcgNS44MTggNDUuNjI5IDQuOTYgNDMuNTkxIDQuOTYgQyA0MC4wNjkgNC45NiAzNy40NjMgNy41OTMgMzcuNDYzIDExLjU5MyBDIDM3LjQ2MyAxNS41OTMgNDAuMDY5IDE4LjIyNSA0My41OTEgMTguMjI1IEMgNDUuNjE0IDE4LjIyNSA0Ni45ODIgMTcuMjY1IDQ3LjgyNiAxNi4xMDIgTCA0OC4xMzIgMTguMDggTCA1MC41MzMgMTguMDggTCA1MC41MzMgNS4xMDUgTCA0OC4xNjEgNS4xMDUgTCA0Ny44MjYgNi45OTYgTCA0Ny44MjYgNy4wMTEgWiBNIDQ0LjA1NyAxNS45MTMgQyA0MS43NzIgMTUuOTEzIDQwLjI4NyAxNC4xMzggNDAuMjg3IDExLjU3OCBDIDQwLjI4NyA5LjAxOCA0MS43ODYgNy4yNzMgNDQuMDU3IDcuMjczIEMgNDYuMzI3IDcuMjczIDQ3LjgyNiA5LjA2MiA0Ny44MjYgMTEuNjIyIEMgNDcuODI2IDE0LjE4MiA0Ni4zMjcgMTUuODk4IDQ0LjA1NyAxNS44OTggTCA0NC4wNTcgMTUuOTEzIFogTSAzNi4yNyA1LjEwNSBMIDM2Ljg4MSA1LjEwNSBMIDM2Ljg4MSA3LjY2NSBMIDM1LjY3MyA3LjY2NSBDIDMzLjI0MyA3LjY2NSAzMi40NTcgOS41NTYgMzIuNDU3IDExLjU2NCBMIDMyLjQ1NyAxOC4wNjUgTCAyOS43MiAxOC4wNjUgTCAyOS43MiA1LjEwNSBMIDMyLjE1MSA1LjEwNSBMIDMyLjQ1NyA3LjA1NSBDIDMzLjExMiA1Ljk2NCAzNC4xNiA1LjEwNSAzNi4yODQgNS4xMDUgTCAzNi4yNyA1LjEwNSBaIE0gNjQuODExIDEuNjQ0IEMgNjQuODExIDIuNjA0IDY0LjA4NCAzLjI4NyA2My4xMzggMy4yODcgQyA2Mi4xOTIgMy4yODcgNjEuNDY0IDIuNjA0IDYxLjQ2NCAxLjY0NCBDIDYxLjQ2NCAwLjY4NCA2Mi4xOTIgMCA2My4xMzggMCBDIDY0LjA4NCAwIDY0LjgxMSAwLjY4NCA2NC44MTEgMS42NDQgWiBNIDc5LjIwNiAxMC44NTEgTCA3OS4yMDYgMTguMDY1IEwgNzYuNDQxIDE4LjA2NSBMIDc2LjQ0MSAxMS4wODQgQyA3Ni40NDEgOC42MjUgNzUuNDA3IDcuMzE2IDczLjM1NSA3LjMxNiBDIDcxLjE3MiA3LjMxNiA2OS44OTEgOC45MTYgNjkuODkxIDExLjUzNSBMIDY5Ljg5MSAxOC4wNjUgTCA2Ny4xNTUgMTguMDY1IEwgNjcuMTU1IDUuMTA1IEwgNjkuNTQyIDUuMTA1IEwgNjkuODQ3IDYuODA3IEMgNzAuNjYyIDUuNzg5IDcxLjg5OSA0Ljk2IDczLjk5NSA0Ljk2IEMgNzYuODYzIDQuOTYgNzkuMjA2IDYuNTMxIDc5LjIwNiAxMC44NTEgWiBNIDU2Ljk4MSA1LjEwNSBMIDY0LjUwNiA1LjEwNSBMIDY0LjUwNiAxOC4wNjUgTCA2MS43NCAxOC4wNjUgTCA2MS43NCA3LjUyIEwgNTYuOTgxIDcuNTIgTCA1Ni45ODEgMTguMDY1IEwgNTQuMjE2IDE4LjA2NSBMIDU0LjIxNiA3LjUyIEwgNTEuOTYgNy41MiBMIDUxLjk2IDUuMTIgTCA1NC4yMTYgNS4xMiBMIDU0LjIxNiAzLjgyNSBDIDU0LjIxNiAxLjU0MiA1NS4zMzYgMC4zNjQgNTcuODQgMC4zNjQgTCA2MC4xMzkgMC4zNjQgTCA2MC4xMzkgMi43NjQgTCA1OC4yMTggMi43NjQgQyA1Ny4zMyAyLjc2NCA1Ni45ODEgMy4xNDIgNTYuOTgxIDQuMDI5IEwgNTYuOTgxIDUuMTIgTCA1Ni45ODEgNS4xMDUgWiIgZmlsbD0iY3VycmVudENvbG9yIiBmaWxsLXJ1bGU9Im5vbnplcm8iPjwvcGF0aD4KPC9zdmc+" alt="Parafin" />
    </span>);

}

function SkAmount({ amount, setAmount, flexMax, termMax, min = 5000, step = 500, labels, single = false }) {
  const max = termMax;
  const L = labels || SK_LABELS.product;
  const pct = (amount - min) / (max - min) * 100;
  const flexPct = (flexMax - min) / (max - min) * 100;
  // `draft` holds the raw text while the field is focused so the input
  // reflects exactly what's typed; the slider/amount track it live, and we
  // clamp + snap to a valid value only on blur.
  const [draft, setDraft] = React.useState(null);
  const onText = (e) => {
    const raw = e.target.value.replace(/[^\d]/g, '');
    setDraft(raw);
    if (raw) {
      let n = parseInt(raw, 10);
      if (n > max) n = max;
      setAmount(Math.max(min, Math.round(n / step) * step));
    }
  };
  const onBlur = () => {
    let n = parseInt((draft || '').replace(/[^\d]/g, ''), 10);
    if (!n || n < min) n = min;
    if (n > max) n = max;
    setAmount(Math.round(n / step) * step);
    setDraft(null);
  };
  const display = draft != null ?
    (draft ? parseInt(draft, 10).toLocaleString('en-US') : '') :
    amount.toLocaleString('en-US');
  return (
    <div className="sk-amount-wrap">
      <div className="sk-amount">
        <div className="sk-amount-field">
          <span className="pre">$</span>
          <input type="text" inputMode="numeric"
          value={display}
          onChange={onText} onBlur={onBlur} aria-label="Loan amount" />
        </div>
      </div>
      <div className="sk-slider">
        {single ?
        <React.Fragment>
          <div className="sk-slider-track-bg" style={{ left: 0, right: 0 }} />
          <div className="sk-slider-track-fill" style={{ width: pct + '%' }} />
        </React.Fragment> :
        <React.Fragment>
        <div className="sk-slider-track-bg sk-slider-track-bg-flex"
        style={{ width: `calc(${flexPct}% - 2px)` }} />
        <div className="sk-slider-track-bg sk-slider-track-bg-term"
        style={{ left: `calc(${flexPct}% + 2px)` }} />
        {/* Brand fill — split into two pieces past the flex-max so the
         * 4px gap stays visible even when the amount overshoots. */}
        {pct > flexPct ?
        <React.Fragment>
            <div className="sk-slider-track-fill"
            style={{ width: `calc(${flexPct}% - 2px)` }} />
            <div className="sk-slider-track-fill"
            style={{
              left: `calc(${flexPct}% + 2px)`,
              width: `calc(${pct - flexPct}% - 2px)`
            }} />
          </React.Fragment> :

        <div className="sk-slider-track-fill" style={{ width: pct + '%' }} />
        }
        </React.Fragment>}
        <input type="range" min={min} max={max} step={step} value={amount}
        onChange={(e) => setAmount(Number(e.target.value))}
        aria-label="Amount" />
      </div>
      <div className="sk-slider-axis">
        <span className="num">{usd(min)}</span>
        <span className="hint">← Slide to adjust →</span>
        <span className="num">{usd(max)}</span>
      </div>
    </div>);

}

function SkDurChips({ durations, value, onChange }) {
  return (
    <div className="sk-dur-chips" onClick={(e) => e.stopPropagation()}>
      {durations.map((d, i) =>
      <button key={i} type="button"
      className={i === value ? 'on' : ''}
      onClick={(e) => {e.stopPropagation();onChange(i);}}>
          {d.months} mo
        </button>
      )}
    </div>);

}

/* Step 3 — Duration cards. Works for both Flex AND Term. */
function SkDurationStep({ amount, durIdx, setDurIdx, mode = 'flex', stepNum = '3', showRate = false, onAdjustAmount }) {
  const durations = mode === 'term' ? TERM.durations : FLEX.durations;
  const nineMoMin = 10000;
  const nineMoDisabled = amount > nineMoMin;
  const enabledCount = durations.filter((d) => !(d.months === 9 && nineMoDisabled)).length;
  const soloEnabled = enabledCount === 1;

  React.useEffect(() => {
    const dur = durations[durIdx];
    if (dur && dur.months === 9 && nineMoDisabled) {
      const fallback = durations.findIndex((x) => x.months === 12);
      if (fallback !== -1) setDurIdx(fallback);
    }
  }, [amount, durIdx, durations, nineMoDisabled, setDurIdx]);

  return (
    <section className="sk-step">
      <header className="sk-step-head">
        <span className="sk-step-num">{stepNum}</span>
        <h2 className="sk-step-title">Choose a duration</h2>
      </header>
      <div className="sk-dur-step">
        {durations.map((d, i) => {
          const disabled = d.months === 9 && nineMoDisabled;
          const isOn = i === durIdx && !disabled;
          const fee = Math.round(amount * d.feeRate);
          const total = Math.round(amount * (1 + d.feeRate));
          const secondary = mode === 'term' ?
          `${usd(Math.round(total / d.biweeks))} every 2 weeks` :
          `${Math.round(d.holdback * 100)}% of daily sales`;
          const pitch9 = 'Lower fee · quicker payoff';
          const pitch12 = 'Lower payments · slower payoff';
          const pitch = disabled ?
          'Only available for $10,000 and under' :
          d.months === 9 ? pitch9 : pitch12;
          return (
            <button key={i} type="button"
            className={
            'sk-dur-card' + (
            isOn ? ' is-on' : '') + (
            disabled ? ' is-disabled' : '')
            }
            onClick={() => {if (!disabled) setDurIdx(i);}}
            disabled={disabled && !onAdjustAmount}
            role="radio" aria-checked={isOn} aria-disabled={disabled}>
              <span className="sk-radio" />
              {!disabled && !soloEnabled &&
              <span className="sk-dur-card-pill">
                  {d.months === 9 ? 'Lowest $ fee' : 'Lowest payment rate'}
                </span>
              }
              <div className="sk-dur-card-body">
                <div className="sk-dur-card-nameline">
                  <h3 className="sk-dur-card-name">{d.months} months</h3>
                </div>
                {!(soloEnabled && !disabled) &&
                <p className="sk-dur-card-pitch" style={{ fontSize: "14px" }}>{pitch}</p>
                }
                {disabled && onAdjustAmount &&
                <span className="sk-dur-card-adjust" role="button" tabIndex={0}
                  onClick={(e) => { e.stopPropagation(); onAdjustAmount(nineMoMin); }}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); e.stopPropagation(); onAdjustAmount(nineMoMin); } }}>
                  Lower amount to {usd(nineMoMin)} to unlock <span aria-hidden="true">→</span>
                </span>
                }
                {(showRate || soloEnabled) && !disabled &&
                <div className="sk-dur-card-rate">
                    <span className="l">{mode === 'term' ? 'Bi-weekly payment' : 'Daily debit'}</span>
                    <span className="v">{secondary}</span>
                  </div>
                }
              </div>
            </button>);

        })}
      </div>
    </section>);

}

/* SkInfo — small ⓘ icon used inline next to labels. Native HTML title
 * tooltip; on hover the icon darkens to ink. */
function SkInfo({ title }) {
  return (
    <span className="sk-info" title={title} aria-label={title} role="img" tabIndex={0}>
      <svg viewBox="0 0 16 16" width="12" height="12" fill="none"
      stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <circle cx="8" cy="8" r="6.5" />
        <path d="M8 7.2v3.6M8 5.1v.05" />
      </svg>
    </span>);

}

Object.assign(window, {
  SkBars, SkTermShape, SkFlexShape, SkPowered, SkAmount,
  SkDurChips, SkDurationStep, SK_BARS_FLEX, SK_BARS_TERM,
  SK_LABELS, skLabels, SkCta, SkInfo, SkCheck
});

/* Default sticky CTA — single-line summary + Continue button. Lives here
 * (shared) so any variant using V1bStatsOut works without pulling in the
 * V1B Ledger file. The V1B Ledger file re-defines SkCta in window and
 * intentionally overrides this one when both are loaded — kept identical.
 */
function SkCta({ amount, choice, flexDurIdx, termDurIdx, labels, summary = 'sentence' }) {
  const L = labels || SK_LABELS.product;
  const isFlex = choice === 'flex';
  const flexDur = FLEX.durations[flexDurIdx];
  const termDur = TERM.durations[termDurIdx];
  const termTotalAmt = Math.round(amount * (1 + termDur.feeRate));
  const termBiweeklyAmt = Math.round(termTotalAmt / termDur.biweeks);
  const total = isFlex ? flexTotal(amount, flexDurIdx) : termTotalAmt;
  const fee = total - amount;
  return (
    <div className={'sk-cta' + (summary === 'none' ? ' sk-cta--bare' : '')}>
      {summary === 'none' ? null : summary === 'amounts' ? (
        <div className="sk-cta-summary sk-cta-summary--amounts">
          <span className="pair"><span className="lbl">Borrowing</span> <b>{usd(amount)}</b></span>
          <span className="sep">·</span>
          <span className="pair"><span className="lbl">Capital fee</span> <b>{usd(fee)}</b></span>
        </div>
      ) : (
        <p className="sk-cta-summary">
          You'll borrow <b>{usd(amount)}</b> with a <b>{usd(fee)}</b> fee — total <b>{usd(total)}</b>.
        </p>
      )}
      <div className="sk-cta-action">
        <button className="sk-btn">
          <span>Get Started</span>
          <span style={{ opacity: 0.6 }}>→</span>
        </button>
      </div>
    </div>);

}