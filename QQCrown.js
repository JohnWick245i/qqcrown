var RateGen = (function () {
  function t(e) {
    (this._value = NaN),
      "string" == typeof e ? (this._seed = this.hashCode(e)) : "number" == typeof e ? (this._seed = this.getSafeSeed(e)) : (this._seed = this.getSafeSeed(t.MIN + Math.floor((t.MAX - t.MIN) * Math.random()))),
      this.reset();
  }
  return (
    (t.prototype.next = function (e, o) {
      return void 0 === e && (e = 0), void 0 === o && (o = 1), this.recalculate(), this.map(this._value, t.MIN, t.MAX, e, o);
    }),
    (t.prototype.nextInt = function (e, o) {
      return void 0 === e && (e = 10), void 0 === o && (o = 100), this.recalculate(), Math.floor(this.map(this._value, t.MIN, t.MAX, e, o + 1));
    }),
    (t.prototype.nextString = function (t, e) {
      void 0 === t && (t = 16), void 0 === e && (e = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789");
      for (var o = ""; o.length < t;) o += this.nextChar(e);
      return o;
    }),
    (t.prototype.nextChar = function (t) {
      return void 0 === t && (t = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"), t.substr(this.nextInt(0, t.length - 1), 1);
    }),
    (t.prototype.nextArrayItem = function (t) {
      return t[this.nextInt(0, t.length - 1)];
    }),
    (t.prototype.nextBoolean = function () {
      return this.recalculate(), this._value > 0.5;
    }),
    (t.prototype.skip = function (t) {
      for (void 0 === t && (t = 1); t-- > 0;) this.recalculate();
    }),
    (t.prototype.reset = function () {
      this._value = this._seed;
    }),
    (t.prototype.recalculate = function () {
      this._value = this.xorshift(this._value);
    }),
    (t.prototype.xorshift = function (t) {
      return (t ^= t << 13), (t ^= t >> 17), (t ^= t << 5);
    }),
    (t.prototype.map = function (t, e, o, r, n) {
      return ((t - e) / (o - e)) * (n - r) + r;
    }),
    (t.prototype.hashCode = function (t) {
      var e = 0;
      if (t) for (var o = t.length, r = 0; r < o; r++) (e = (e << 5) - e + t.charCodeAt(r)), (e |= 0), (e = this.xorshift(e));
      return this.getSafeSeed(e);
    }),
    (t.prototype.getSafeSeed = function (t) {
      return 0 === t ? 1 : t;
    }),
    (t.MIN = -2147483648),
    (t.MAX = 2147483647),
    t
  );
})();


const mobileLogin = "#page-content-wrapper > div.header > button.login-btn";
const desktopLogin = "#btnLogin";
const mobileMenu = ".header a.hamburger";

function isLoggedIn() {
  const loginButton = document.querySelector(mobileLogin) || document.querySelector(desktopLogin);
  return !loginButton;
};

function isMobile() {
  const hamburger = document.querySelector(mobileMenu);
  return Boolean(hamburger);
}

document.addEventListener('contextmenu', e => e.preventDefault());

document.addEventListener("DOMContentLoaded", () => {
  const path = window.location.pathname;
  if (path.includes("/slots") && !path.includes("Fishing")) {
    const exceptions = ["GAME TERBARU", "Promosi", "Spaceman"];
    const common = Math.floor(Date.now() / 3600000);
    const slots = document.querySelectorAll("div > div.game-box-slots");

    for (let i = 0; i < slots.length; i++) {
      const nameElement = slots[i].querySelector(".game-title-slots");
      const name = nameElement.innerText.replace(/'/g, ' ');
      const seed = `${name}${common}`;
      const generator = new RateGen(seed);
      const rateSeed = generator.nextInt(0, 59);
      const rate = (rateSeed >= 20) ? (90 + (rateSeed % 10)) : (60 + rateSeed);
      const time = generator.nextInt(0, 288);
      const polaSeed = generator.nextInt(100000000000, 999999999999);
      const color = rate > 80 ? 'mediumseagreen' : rate > 65 ? 'goldenrod' : 'maroon';
      const isException = exceptions.includes(name);

      // RTP bar and button.
      slots[i].innerHTML += `
          <div style="visibility: ${isException ? 'hidden' : 'visible'};">
            <div class="rtp-bar">
              <div style="width: ${rate}%; background-color: ${color};">
                <div>${rate}%</div>
              </div>
            </div>
            <button class="rtp-button" onclick="(e => {
              const images = ${isMobile()
          ? "document.querySelectorAll('img.slot-image')"
          : "document.querySelectorAll('.slots-img-wrap img')"};
              renderPola('${name}', images[${i}].src, ${time}, ${rate}, ${polaSeed});
            })(arguments[0])">
              Pola Slot
            </button>
          </div>
        `;
    }

    // Disable the overlay ribbon from blocking the pola button.
    document.querySelectorAll(".ribbon-wrapper").forEach(ribbon => {
      ribbon.style['pointer-events'] = 'none';
      ribbon.style['user-select'] = 'none';
    });
  }
});


const isEven = num => Number(num) % 2 === 0;
const autoValues = [10, 20, 30, 50, 70, 100];

document.addEventListener("DOMContentLoaded", () => {
  if (window.location.pathname.includes("/slots")) {
    const content = document.querySelector("div.main") || document.getElementById("page-content-wrapper");
    content.innerHTML += '<div id="pola-modal" style="display: none;"></div>';
  }
});

function closeModal() {
  const modal = document.getElementById("pola-modal");
  modal.style.display = "none";
  modal.innerHTML = "";
}

function getPolaSpin(seed) {
  const [spin, auto, onetwo, three] = seed;

  const autoBool = isEven(auto);
  const spin1to9 = Math.max(spin, 1);
  const index0to5 = Math.round((spin1to9 / 3) * 2) - 1;
  const even1and2 = isEven(onetwo);

  const isAuto = autoBool ? "Auto" : "Manual";
  const spins = autoBool ? autoValues[index0to5] : spin1to9;
  const check1 = even1and2 ? 'âœ…' : 'âŒ';
  const check2 = even1and2 ? 'âŒ' : 'âœ…';
  const check3 = isEven(three) ? 'âœ…' : 'âŒ';

  return `${spins} ${check1}${check2}${check3} ${isAuto}`;
}

function renderPola(name, image, time, rate, pola) {
  const padNumber = num => (num < 10) ? ("0" + num) : num.toString();
  const toTimeFormat = (hours, minutes) => padNumber(hours) + ":" + padNumber(minutes);
  const normalizeHours = num => (num >= 24) ? (num - 24) : num;

  const minuteCount = time * 5;
  const hours = Math.floor(minuteCount / 60);
  const minutes = minuteCount % 60;
  const startTime = toTimeFormat(hours, minutes);
  const endTime = toTimeFormat(normalizeHours(hours + 3), minutes);

  const polaSeed = String(pola);
  const seed1 = polaSeed.substring(0, 4);
  const seed2 = polaSeed.substring(4, 8);
  const seed3 = polaSeed.substring(8, 12);

  const content = (`
      <div>
        <h3>RTP dan Pola ${name}</h3>
        <div>
          <img src="${image}" alt="${name}" />
          <table>
            <tbody>
              <tr>
                <td>Jam Panas</td>
                <td>${startTime} - ${endTime}</td>
              </tr>
              <tr>
                <td>Pola Spin</td>
                <td>
                  <div>${getPolaSpin(seed1)}</div>
                  <div>${getPolaSpin(seed2)}</div>
                  <div>${getPolaSpin(seed3)}</div>
                </td>
              </tr>
              <tr>
                <td>RTP Live</td>
                <td>${rate}%</td>
              </tr>  
            </tbody>
          </table>
          <button onclick="closeModal()">Tutup</button>
        </div>
      </div>
    `);
  const modal = document.getElementById("pola-modal");
  modal.innerHTML += content;
  modal.style.display = "flex";
}


document.addEventListener("DOMContentLoaded", () => {

  // Add the extra button to the bottom navbar on mobile.
  const navbar = document.querySelector(".navbar-grid");
  if (navbar) {
    const anchor = document.createElement("a");
    anchor.className = "grid-btn grid-btn-icon-top tada";
    anchor.href = isLoggedIn() ? "/games/slots" : "/slots";
    anchor.innerHTML = '<i class="svg-slot"></i>RTP Slot';

    const li = document.createElement("li");
    li.className = "navbar-grid-e";
    li.style.float = "left";
    li.appendChild(anchor);
    navbar.appendChild(li);
  }
});

const titles = [
  "Sports", "IDNLIVE", "Slots", "Live Casino", "Lottery", "IDNPoker", "Table Games", "Tembak Ikan"
];

const bannersWithoutLogin = [
  "#page-content-wrapper > a:nth-child(6) > div > div",
  "#page-content-wrapper > a:nth-child(7) > div > div",
  "#page-content-wrapper > a:nth-child(8) > div > div",
  "#page-content-wrapper > a:nth-child(9) > div > div",
  "#page-content-wrapper > a:nth-child(10) > div > div",
  "#page-content-wrapper > a:nth-child(11) > div > div",
  "#page-content-wrapper > a:nth-child(13) > div > div",
  "#page-content-wrapper > a:nth-child(14) > div > div"
];

const bannersWithLogin = [
  "#page-content-wrapper > div.mt-10 > a:nth-child(1) > div > div",
  "#page-content-wrapper > div.mt-10 > a:nth-child(2) > div > div",
  "#page-content-wrapper > div.mt-10 > a:nth-child(3) > div > div",
  "#page-content-wrapper > div.mt-10 > a:nth-child(4) > div > div",
  "#page-content-wrapper > div.mt-10 > a:nth-child(5) > div > div",
  "#page-content-wrapper > div.mt-10 > a:nth-child(6) > div > div",
  "#page-content-wrapper > div.mt-10 > a:nth-child(8) > div > div",
  "#page-content-wrapper > div.mt-10 > a:nth-child(9) > div > div"
];

const BannerIDNTrade = [
  "#page-content-wrapper > a:nth-child(12) > div > div"
];

const BannerIDNTradeLogin = [
  "#page-content-wrapper > div.mt-10 > a:nth-child(7) > div > div"
]

const IdnTradeBanner = [
  "https://blogger.googleusercontent.com/img/a/AVvXsEhfTFxcIjFuuJMBBv-lMmBqhyuqwPQkwBIgv6tZfLXjZ5X_W6DK0OMCnla6fOovKjfwRTmXA64J-vRMdg-jvfkndm50aS-ex4wRu4IEgpOKl8qj4uQiVbmnMvkM7Lk8KvUBgVPJEPGVwTQAj1_FSjWrwXeY8w4keY1ocNrGikuxBCk661NV73hvo5Hslxc"
]


document.addEventListener("DOMContentLoaded", () => {
  const isHome = window.location.pathname === '/' || window.location.pathname.includes("/dashboard");
  if (isMobile() && isHome) {

    const selectors = isLoggedIn() ? bannersWithLogin : bannersWithoutLogin;
    selectors.forEach((selector, i) => {
      const element = document.querySelector(selector);
      element.innerHTML = "";
      element.style.aspectRatio = 1.695;
      element.style.background = `url("${banners[i]}")`;
      element.style.backgroundSize = 'contain';

      const parent = element.parentElement;

      const limElem = document.querySelector('.time-limit');
      const limVal = limElem.classList.contains('time-limit');

      if(limVal){
        parent.innerHTML += `<h5 class="game-title">${titles[i]}</h5>`;
      }
    });

    const tradeselector = isLoggedIn() ? BannerIDNTradeLogin : BannerIDNTrade;
    tradeselector.forEach((idselector, i) => {
      const imageElem = document.querySelector(idselector);
      imageElem.innerHTML = "";
      const image = document.createElement('img');
      image.classList.add('responsive-image', 'game-image')
      image.src = IdnTradeBanner;
      imageElem.appendChild(image);
    })
  }
});