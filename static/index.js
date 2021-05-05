const baseURL = "http://api.coinlayer.com/api/";
const key = "?access_key=90736134eff058d655f1444b6dbbf471";
const listEP = "list";
const liveEp = "live";

const elemCryptoGrid = document.getElementById("crypto-grid");
const elemCryptoList = document.getElementById("crypto-list-options");
const elemCryptoInput = document.getElementById("crypto-list");
const elemCurrencyUS = document.getElementById("currency-us");
const elemCurrencyEU = document.getElementById("currency-eu");
const elemTopBtn = document.getElementById("top-btn");

let cryptoList = [];
let fiatList = [];
let liveList = [];
let liveTarget = "";
let tempList = [];
let currentCoin = "";

// live and historical URL - &symbols=BTC,ETH

const renderCryptoList = () => {
  tempList.forEach(x => {
    let cOption = document.createElement("option");
    cOption.setAttribute("value", x);
    elemCryptoList.appendChild(cOption);
  })
}

const jumpToCoin = (symbol) => {
  if(currentCoin){
    document.getElementById(currentCoin).setAttribute("class", "card mb-2 shadow text-end");
    currentCoin = "";
  }
  if(symbol){
    document.getElementById(symbol).setAttribute("class", "card mb-2 shadow text-end border-primary border border-5");
    document.getElementById(symbol).scrollIntoView({behavior: "smooth", block: "center"});
    currentCoin = symbol;
  }
}

const showTopBtn = () => {
  if (document.body.scrollTop > 30 || document.documentElement.scrollTop > 30) {
    elemTopBtn.style.display = "block";
  } else {
    elemTopBtn.style.display = "none";
  }
}

const scrollTop = () => {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
}

const loadLive = async (fiat) => {
  let url = baseURL + liveEp + key;
  if (fiat) {
    url = url + `&target=${fiat}`;
  }
  await fetch(url)
    .then((res) => res.json())
    .then((json) => {
      liveTarget = json.target;
      liveList.rates = json.rates;
    });
  
  if(fiat){
    elemCurrencyEU.setAttribute("class", "btn btn-primary active");
    elemCurrencyUS.setAttribute("class", "btn btn-primary");
  }else{
    elemCurrencyUS.setAttribute("class", "btn btn-primary active");
    elemCurrencyEU.setAttribute("class", "btn btn-primary");
  }
  elemCryptoGrid.querySelectorAll("*").forEach(node => node.remove())

  for (let [k, v] of Object.entries(liveList.rates)) {
    let imageUrl = cryptoList[k].icon_url;
    let template = `
    <div class="col align-self-center align-items-center justify-content-center" id="main-body">
      <div class="card mb-2 shadow text-end border border-1 border-dark" style="max-width: 450px;" id="${k}">
        <div class="row">
          <div class="col-md-3">
            <img src="${imageUrl}" alt="..." id="crypto-image">
          </div>
          <div class="col-md-8">
            <div class="card-body justify-content-center align-items-center p-4">
              <h3 class="card-title">${cryptoList[k].name}</h3>
              <h5 class="card-text text-muted">Symbol: ${k}</h5>
              <h4 class="card-text text-success">${v}</h4>
            </div>
          </div>
        </div>
      </div>
    </div>`;
    elemCryptoGrid.insertAdjacentHTML("beforeend", template);
    tempList.push(k)
  }
  renderCryptoList();
};

const loadData = async () => {
  await fetch(baseURL + listEP + key)
    .then((res) => res.json())
    .then((json) => {
      cryptoList = json.crypto;
      fiatList = json.fiat;
    });
  loadLive();
};

window.onscroll = function() {showTopBtn()};

elemCryptoInput.addEventListener("change", (e) => jumpToCoin(e.target.value));
elemCurrencyUS.addEventListener("click", (e) => loadLive());
elemCurrencyEU.addEventListener("click", (e) => loadLive("EUR"))
elemTopBtn.addEventListener("click", (e) => scrollTop())

loadData();
