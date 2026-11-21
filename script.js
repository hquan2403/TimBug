/* TimBug – trò chơi tìm lỗi trong code (chế độ cá nhân)
   Mỗi lỗi: l = số thứ tự dòng (từ 0), o = các cách sửa (phần tử đầu tiên là đáp án đúng), e = lời giải thích. */
const STAGES = ["Khởi động", "Thử thách", "Chinh phục"];
const LV = [
  { st: 0, q: "Chương trình không chạy được vì lỗi cú pháp. Tìm 2 lỗi.",
    code: [`diem = 10`, `if diem >= 5`, `    print("Dat"`],
    bugs: [
      { l: 1, o: [`if diem >= 5:`, `if diem >= 5;`, `if (diem >= 5)`], e: "Sau điều kiện if của Python phải có dấu hai chấm." },
      { l: 2, o: [`    print("Dat")`, `    print("Dat"))`, `    print "Dat")`], e: "Lệnh print thiếu dấu ngoặc đóng." }] },
  { st: 0, q: "Hàm phải trả về 15 nhưng lại trả về 5. Tìm 2 lỗi.",
    code: [`def tinh_tong(ds):`, `    tong = 0`, `    for i in range(1, len(ds)):`, `        tong = tong + ds[i]`, `        return tong`, ``, `print(tinh_tong([3, 5, 7]))  # mong đợi 15`],
    bugs: [
      { l: 2, o: [`    for i in range(0, len(ds)):`, `    for i in range(1, len(ds) + 1):`, `    for i in range(len(ds), 0):`], e: "Chỉ số danh sách bắt đầu từ 0, nên range(1, ...) bỏ qua phần tử đầu." },
      { l: 4, o: [`    return tong`, `        return tong + 1`, `    return ds`], e: "return nằm trong vòng lặp nên hàm thoát ngay sau lượt đầu. Cần thụt ra ngang hàng với for." }] },
  { st: 0, q: "Hai dòng cuối đều gây lỗi khi chạy. Tìm 2 lỗi.",
    code: [`ds = [4, 6, 8]`, `print(ds[3])`, `x = "5" + 2`],
    bugs: [
      { l: 1, o: [`print(ds[2])`, `print(ds[4])`, `print(ds(3))`], e: "Danh sách có 3 phần tử, chỉ số là 0, 1, 2. Chỉ số 3 vượt giới hạn." },
      { l: 2, o: [`x = int("5") + 2`, `x = str(5) + 2`, `x = "5" + 2 + ""`], e: "Cộng chuỗi với số gây lỗi kiểu dữ liệu. Cần đổi chuỗi sang số bằng int()." }] },
  { st: 1, q: "Hàm phải đếm số chẵn trong [1, 2, 4] và trả về 2. Tìm 3 lỗi.",
    code: [`def dem_chan(ds):`, `    dem = 1`, `    for so in ds:`, `        if so % 2 = 0:`, `            dem + 1`, `    return dem`],
    bugs: [
      { l: 1, o: [`    dem = 0`, `    dem = -1`, `    dem = []`], e: "Biến đếm phải bắt đầu từ 0, nếu không kết quả luôn dư 1." },
      { l: 3, o: [`        if so % 2 == 0:`, `        if so % 2 === 0:`, `        if so // 2 == 0:`], e: "So sánh bằng dùng ==. Một dấu = là phép gán." },
      { l: 4, o: [`            dem += 1`, `            dem == 1`, `            dem - 1`], e: "dem + 1 chỉ tính ra giá trị mà không lưu lại. Cần gán lại bằng +=." }] },
  { st: 1, q: "Hàm phải tìm số lớn nhất, ví dụ [-3, -1, -7] cho -1. Tìm 3 lỗi.",
    code: [`def lon_nhat(ds):`, `    best = 0`, `    for so in ds:`, `        if so < best:`, `            best = so`, `    print(best)`],
    bugs: [
      { l: 1, o: [`    best = ds[0]`, `    best = 1`, `    best = ds[-1] + 1`], e: "Bắt đầu từ 0 sẽ sai khi mọi số đều âm. Nên lấy phần tử đầu làm mốc." },
      { l: 3, o: [`        if so > best:`, `        if so != best:`, `        if so == best:`], e: "Tìm số lớn nhất phải so sánh “lớn hơn”, không phải “nhỏ hơn”." },
      { l: 5, o: [`    return best`, `    return so`, `    best`], e: "Hàm cần trả về giá trị. In ra màn hình chưa phải là trả về." }] },
  { st: 2, q: "Hàm phải tính giai thừa: giai_thua(4) = 24. Tìm 3 lỗi logic.",
    code: [`def giai_thua(n):`, `    kq = 0`, `    for i in range(1, n):`, `        kq = kq + i`, `    return kq`, ``, `print(giai_thua(4))  # mong đợi 24`],
    bugs: [
      { l: 1, o: [`    kq = 1`, `    kq = n`, `    kq = -1`], e: "Phép nhân với 0 luôn ra 0, nên kết quả phải bắt đầu từ 1." },
      { l: 2, o: [`    for i in range(1, n + 1):`, `    for i in range(0, n):`, `    for i in range(n, 1):`], e: "range loại trừ điểm cuối, nên phải dùng n + 1 để nhân cả n." },
      { l: 3, o: [`        kq = kq * i`, `        kq = kq - i`, `        kq = i`], e: "Giai thừa là tích các số, không phải tổng." }] }
];
const DAYS = [1, 3, 7];
const CAUSES = ["Thiếu kiến thức", "Hiểu nhầm", "Đọc vội", "Chủ quan"];
const FRESH = { score: 0, unlocked: 1, best: {}, book: [], mine: [] };

let S = load();
let G = null; // trạng thái màn đang chơi
let R = null; // trạng thái lượt ôn lại

function load() {
  try { return Object.assign(JSON.parse(JSON.stringify(FRESH)), JSON.parse(localStorage.getItem("timbug") || "{}")); }
  catch (e) { return JSON.parse(JSON.stringify(FRESH)); }
}
function save() { try { localStorage.setItem("timbug", JSON.stringify(S)); } catch (e) {} }
const $ = s => document.querySelector(s);
const esc = s => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const shuffle = a => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const dayPlus = n => { const d = new Date(); d.setHours(0, 0, 0, 0); d.setDate(d.getDate() + n); return d.getTime(); };
const lvl = () => G.cust || LV[G.i];
const bugOf = (lv, l) => (typeof lv === "object" ? lv : LV[lv]).bugs.find(b => b.l === l);

function head() {
  $("#top").innerHTML = `<span class="brand"><span class="logo">🐛</span>TimBug</span>
    <button onclick="showMap()">Bản đồ</button>
    <button onclick="showShop()">Xưởng bug (${S.mine.length})</button>
    <button onclick="showBook()">Sổ lỗi (${S.book.length})</button>
    <span class="score">${S.score} điểm</span>`;
}

/* ---------- Bản đồ ---------- */
function showMap() {
  head(); G = null;
  const room = i => {
    const ok = i < S.unlocked, b = S.best[i];
    return `<button class="room st${LV[i].st} ${ok ? "" : "locked"}" ${ok ? `onclick="start(${i})"` : "disabled"}>
      <b>Màn ${i + 1}</b><span>${ok ? (b != null ? "Điểm cao: " + b : "Chưa chơi") : "🔒 Chưa mở khóa"}</span></button>`;
  };
  $("#main").innerHTML = `<h2>Thư viện Mã nguồn</h2>
    <p class="lead">Con sâu Bug đã gặm vào các dòng code. Vào từng phòng, bấm vào dòng nghi có lỗi, rồi chọn cách sửa đúng. Đạt từ 60% số lỗi để mở màn tiếp theo.</p>
    <div class="prog"><div style="width:${Math.round(100 * Object.keys(S.best).length / LV.length)}%"></div></div>
    <p class="small">Đã chơi ${Object.keys(S.best).length}/${LV.length} màn. Muốn thử sức theo chiều ngược lại? Mở Xưởng bug để tự cài lỗi.</p>` +
    STAGES.map((n, s) => `<h3>Chặng ${s + 1}: ${n}</h3><div class="rooms">${LV.map((l, i) => l.st === s ? room(i) : "").join("")}</div>`).join("") +
    `<div class="row"><button onclick="resetAll()">Xóa tiến độ và chơi lại từ đầu</button></div>`;
}
function resetAll() {
  if (confirm("Xóa toàn bộ điểm, tiến độ và Sổ lỗi?")) { S = JSON.parse(JSON.stringify(FRESH)); save(); showMap(); }
}

/* ---------- Chơi một màn ---------- */
function start(i, c) {
  G = { i, cust: c || null, lives: 3, pts: 0, fixed: {}, wrong: {}, hint: {}, pos: {}, sel: null, opts: null, lost: false, done: false, msg: "" };
  play();
}
function play() {
  head();
  const L = lvl(), tot = L.bugs.length, got = L.bugs.filter(b => G.fixed[b.l]).length;
  const lines = L.code.map((c, n) => {
    const fixed = G.fixed[n], txt = fixed ? bugOf(lvl(), n).o[0] : c;
    const cls = "ln" + (fixed ? " ok" : "") + (G.sel === n ? " sel" : "") + (G.hint[n] && !fixed ? " hint" : "");
    return `<button class="${cls}" ${fixed ? "disabled" : ""} onclick="pick(${n})"><i>${n + 1}</i><code>${esc(txt) || " "}</code></button>`;
  }).join("");
  const opts = G.sel !== null && G.opts
    ? `<div class="opts"><p>Chọn cách sửa dòng ${G.sel + 1}:</p>${G.opts.map((o, k) => `<button onclick="fix(${k})"><code>${esc(o)}</code></button>`).join("")}</div>` : "";
  $("#main").innerHTML = `<div class="hud"><h2>${G.cust ? esc(G.cust.title) : "Màn " + (G.i + 1)}</h2>
    <span>Lượt: ${"●".repeat(Math.max(G.lives, 0))}${"○".repeat(3 - Math.max(G.lives, 0))}</span>
    <span>Điểm: ${G.pts}</span><span>Lỗi đã sửa: ${got}/${tot}</span></div>
    <p class="lead">${L.q}</p><div class="code"><div class="bar"><span></span><span></span><span></span><em>${G.cust ? "de_cua_toi.py" : "man_" + (G.i + 1) + ".py"}</em></div>${lines}</div>${opts}<div class="msg">${G.msg}</div>
    <div class="row"><button onclick="hint()">Xem gợi ý (−5 điểm)</button><button onclick="${G.cust ? "showShop()" : "showMap()"}">Thoát</button></div>`;
}
function pick(n) {
  if (G.done || G.fixed[n]) return;
  const b = bugOf(lvl(), n);
  if (!b) {
    G.pts -= 5; G.lives--; G.lost = true; G.sel = null; G.opts = null;
    G.msg = `<p class="bad">Dòng ${n + 1} không có lỗi. Trừ 5 điểm và mất 1 lượt.</p>`;
    return check();
  }
  if (!G.pos[n]) { G.pos[n] = 1; G.pts += 10; }
  G.sel = n; G.opts = shuffle(b.o.slice());
  G.msg = `<p class="good">Đúng vị trí lỗi (+10). Hãy chọn cách sửa.</p>`;
  play();
}
function fix(k) {
  const b = bugOf(lvl(), G.sel), ch = G.opts[k];
  if (ch === b.o[0]) {
    G.pts += 10; G.fixed[b.l] = 1; G.sel = null; G.opts = null;
    G.msg = `<p class="good">Sửa đúng (+10). ${b.e}</p>`;
  } else {
    G.pts -= 5; G.lives--; G.lost = true; G.wrong[b.l] = 1; G.opts.splice(k, 1);
    G.msg = `<p class="bad">Chưa đúng. Trừ 5 điểm và mất 1 lượt. Thử hỏi ngược: nếu muốn dòng này sai, người ta sẽ làm gì?</p>`;
  }
  check();
}
function hint() {
  if (G.done) return;
  const b = bugOf(lvl(), G.sel) || lvl().bugs.find(b => !G.fixed[b.l]);
  if (!b || G.fixed[b.l]) return;
  G.pts -= 5; G.hint[b.l] = 1;
  G.msg = `<p>Gợi ý: hãy xem lại dòng ${b.l + 1}. Nếu muốn dòng này làm chương trình sai, bạn sẽ sửa gì ở đó?</p>`;
  play();
}
function check() {
  const L = lvl();
  if (G.lives <= 0 || L.bugs.every(b => G.fixed[b.l])) finish(); else play();
}

/* ---------- Kết thúc màn ---------- */
function finish() {
  G.done = true;
  const L = lvl(), tot = L.bugs.length, got = L.bugs.filter(b => G.fixed[b.l]).length;
  if (G.cust) {
    if (got === tot) G.cust.done = (G.cust.done || 0) + 1;
    save(); head();
    $("#main").innerHTML = `<h2>${got === tot ? "Bạn đã giải được đề của chính mình" : "Lần này chưa giải được"}</h2>
      <p class="lead">${G.cust.bugs[0].e}</p><div class="row"><button class="primary" onclick="start(-1, S.mine[${S.mine.indexOf(G.cust)}])">Giải lại</button><button onclick="showShop()">Về Xưởng bug</button></div>`;
    return;
  }
  const bonus = got === tot && !G.lost ? 20 : 0;
  G.pts += bonus;
  const pass = got / tot >= 0.6;
  L.bugs.forEach(b => {
    const type = !G.fixed[b.l] ? "Bỏ sót" : G.wrong[b.l] ? "Sửa sai" : G.hint[b.l] ? "Dùng gợi ý" : null;
    if (type && !S.book.some(e => e.lv === G.i && e.l === b.l))
      S.book.push({ lv: G.i, l: b.l, type, cause: "", note: "", step: 0, due: dayPlus(DAYS[0]) });
  });
  S.score += Math.max(G.pts, 0);
  S.best[G.i] = Math.max(S.best[G.i] || 0, G.pts);
  if (pass && S.unlocked < G.i + 2) S.unlocked = Math.min(G.i + 2, LV.length);
  save(); head();
  const next = pass && G.i + 1 < LV.length;
  $("#main").innerHTML = `<h2>${pass ? "Hoàn thành Màn " + (G.i + 1) : "Chưa qua Màn " + (G.i + 1)}</h2>
    <p class="lead">Bạn sửa được ${got}/${tot} lỗi. Điểm màn: ${G.pts}${bonus ? " (đã gồm thưởng 20 điểm vì không mất lượt nào)" : ""}.
    ${pass ? (next ? "Màn tiếp theo đã mở." : "") : "Cần ít nhất 60% số lỗi để mở màn tiếp theo."}</p>
    <ul class="result">${L.bugs.map(b => `<li><b>Dòng ${b.l + 1}:</b> ${b.e}</li>`).join("")}</ul>
    <p>Lỗi bỏ sót, sửa sai hoặc cần gợi ý đã được ghi vào Sổ lỗi.</p>
    <div class="row">${next ? `<button class="primary" onclick="start(${G.i + 1})">Chơi Màn ${G.i + 2}</button>` : ""}
    <button onclick="start(${G.i})">Chơi lại màn này</button><button onclick="showBook()">Mở Sổ lỗi</button><button onclick="showMap()">Về bản đồ</button></div>`;
}

/* ---------- Sổ lỗi và lịch xem lại 1–3–7 ngày ---------- */
function snippet(e, shown) {
  return `<div class="code">${LV[e.lv].code.map((c, n) =>
    `<div class="ln static ${n === e.l ? "mark" : ""}"><i>${n + 1}</i><code>${esc(shown && n === e.l ? shown : c) || " "}</code></div>`).join("")}</div>`;
}
function showBook() {
  head();
  const items = S.book.map((e, i) => {
    const b = bugOf(e.lv, e.l);
    const status = e.step >= 3 ? "Đã khép sổ" : `Ôn lại lần ${e.step + 1} vào ${new Date(e.due).toLocaleDateString("vi-VN")}`;
    return `<div class="entry"><h3>Màn ${e.lv + 1}, dòng ${e.l + 1} <span class="tag">${e.type}</span></h3>
      ${snippet(e)}<p><b>Cách sửa đúng:</b> <code>${esc(b.o[0].trim())}</code></p><p>${b.e}</p>
      <label for="c${i}">Nguyên nhân sai</label>
      <select id="c${i}" onchange="S.book[${i}].cause=this.value;save()"><option value="">Chọn nguyên nhân</option>
        ${CAUSES.map(c => `<option ${e.cause === c ? "selected" : ""}>${c}</option>`).join("")}</select>
      <label for="n${i}">Lật ngược lần hai</label>
      <textarea id="n${i}" placeholder="Muốn cố tình viết sai như vậy thì làm gì? Quy tắc đúng là gì?" oninput="S.book[${i}].note=this.value;save()">${esc(e.note)}</textarea>
      <div class="row"><span>${status}</span>${e.step < 3 ? `<button onclick="review(${i})">Ôn ngay</button>` : ""}</div></div>`;
  }).join("");
  $("#main").innerHTML = `<h2>Sổ lỗi</h2>
    <p class="lead">Mỗi lỗi bạn bỏ sót, sửa sai hoặc cần gợi ý được ghi lại. Hãy viết quy tắc đúng bằng lời của mình, rồi ôn lại sau 1, 3 và 7 ngày.</p>` +
    (items || `<p class="empty">Sổ lỗi đang trống. Chơi một màn để Sổ lỗi bắt đầu ghi.</p>`);
}
function review(i) {
  const e = S.book[i], b = bugOf(e.lv, e.l);
  R = { i, opts: shuffle(b.o.slice()) };
  $("#main").innerHTML = `<h2>Ôn lại lỗi</h2><p class="lead">Dòng được đánh dấu đang sai. Chọn cách sửa đúng.</p>
    ${snippet(e)}<div class="opts">${R.opts.map((o, k) => `<button onclick="answer(${k})"><code>${esc(o)}</code></button>`).join("")}</div>
    <div class="row"><button onclick="showBook()">Quay lại Sổ lỗi</button></div>`;
}
function answer(k) {
  const e = S.book[R.i], b = bugOf(e.lv, e.l), ok = R.opts[k] === b.o[0];
  if (ok) { e.step++; e.due = e.step < 3 ? dayPlus(DAYS[e.step]) : 0; }
  else { e.step = 0; e.due = dayPlus(DAYS[0]); }
  save();
  $("#main").innerHTML = `<h2>${ok ? "Đúng rồi" : "Chưa đúng"}</h2>
    <p class="${ok ? "good" : "bad"}">${ok ? (e.step >= 3 ? "Bạn đã khép sổ lỗi này." : "Lỗi này chuyển sang lần ôn tiếp theo.") : "Lỗi này quay về mốc ôn đầu tiên (sau 1 ngày)."}</p>
    <p>${b.e}</p><div class="row"><button class="primary" onclick="showBook()">Quay lại Sổ lỗi</button></div>`;
}

/* ---------- Xưởng cài Bug: đảo vai từ người săn bug thành người cài bug ---------- */
function showShop() {
  head();
  const kho = S.mine.map((p, k) => `<div class="entry"><h3>${esc(p.title)} ${p.done ? `<span class="tag ok">Đã giải đúng ${p.done} lần</span>` : ""}</h3>
    <div class="code">${p.code.map((c, n) => `<div class="ln static ${n === p.bugs[0].l ? "mark" : ""}"><i>${n + 1}</i><code>${esc(c) || " "}</code></div>`).join("")}</div>
    <div class="row"><button class="primary" onclick="start(-1, S.mine[${k}])">Tự giải lại</button><button onclick="delMine(${k})">Xóa đề</button></div></div>`).join("");
  $("#main").innerHTML = `<h2>Xưởng cài Bug</h2>
    <p class="lead">Đảo vai: từ người săn bug thành người cài bug. Viết đoạn code đúng, cố ý cài một lỗi, rồi lưu vào kho để vài ngày sau tự giải lại.</p>
    <div class="entry">
      <label for="s-t">Tên đề</label><input id="s-t" placeholder="Ví dụ: Tổng các số lẻ">
      <label for="s-c">Đoạn code đúng (mỗi dòng một câu lệnh, ít nhất 2 dòng)</label>
      <textarea id="s-c" rows="5" spellcheck="false" oninput="prev()"></textarea>
      <div class="code" id="s-p" hidden></div>
      <label for="s-l">Số thứ tự dòng muốn cài lỗi</label><input id="s-l" type="number" min="1" oninput="prev()">
      <label for="s-b">Dòng sau khi cài lỗi</label><input id="s-b" spellcheck="false">
      <label for="s-d1">Phương án sửa sai nghe có vẻ hợp lý (1)</label><input id="s-d1" spellcheck="false">
      <label for="s-d2">Phương án sửa sai nghe có vẻ hợp lý (2)</label><input id="s-d2" spellcheck="false">
      <label for="s-e">Lời giải thích vì sao đó là lỗi</label><textarea id="s-e" rows="2"></textarea>
      <p id="s-msg" role="status"></p>
      <div class="row"><button class="primary" onclick="saveMine()">Lưu đề vào kho</button></div>
    </div>
    <h3>Kho đề của tôi</h3>` + (kho || `<p class="empty">Kho đang trống. Tạo đề đầu tiên ở trên.</p>`);
}
function prev() {
  const lines = $("#s-c").value.split("\n"), l = parseInt($("#s-l").value) - 1, p = $("#s-p");
  p.hidden = !$("#s-c").value.trim();
  p.innerHTML = lines.map((c, n) => `<div class="ln static ${n === l ? "mark" : ""}"><i>${n + 1}</i><code>${esc(c) || " "}</code></div>`).join("");
}
function saveMine() {
  const g = id => $("#" + id).value, lines = g("s-c").replace(/\s+$/, "").split("\n");
  const l = parseInt(g("s-l")) - 1, bad = g("s-b"), d = [g("s-d1"), g("s-d2")], e = g("s-e").trim();
  const err = lines.length < 2 ? "Đoạn code cần ít nhất 2 dòng."
    : !(l >= 0 && l < lines.length) ? "Số thứ tự dòng cài lỗi chưa hợp lệ."
    : !bad.trim() || bad === lines[l] ? "Dòng đã cài lỗi phải khác dòng đúng."
    : d.some(x => !x.trim() || x === lines[l] || x === bad) || d[0] === d[1] ? "Hai phương án sai phải khác nhau và khác đáp án đúng."
    : !e ? "Hãy viết lời giải thích ngắn." : "";
  if (err) { $("#s-msg").className = "bad"; $("#s-msg").textContent = err; return; }
  const code = lines.slice(); code[l] = bad;
  S.mine.push({ title: g("s-t").trim() || "Đề không tên", q: "Đề do bạn tự tạo. Tìm dòng bị cài lỗi và sửa lại.", code, bugs: [{ l, o: [lines[l], ...d], e }], done: 0 });
  save(); showShop();
}
function delMine(k) { if (confirm("Xóa đề này khỏi kho?")) { S.mine.splice(k, 1); save(); showShop(); } }

showMap();