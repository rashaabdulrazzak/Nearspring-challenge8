// near plus roketo
// import nearAPI from "near-api-js";

let signInbtn = document.getElementById("signIn");

let contract;
let wallet;
let near;
let accountDetail;
let ftContract;
let contract_dcversus;
async function load() {
  // connect to near
  let near = await new nearApi.Near({
    keyStore: new nearApi.keyStores.BrowserLocalStorageKeyStore(),
    networkId: "testnet",
    nodeUrl: "https://rpc.testnet.near.org",
    walletUrl: "https://wallet.testnet.near.org",
  });
  // connect to the NEAR Wallet
  wallet = new nearApi.WalletConnection(near);
  // connect to a NEAR smart contract wrap.testnet
  ftContract = new nearApi.Contract(wallet.account(), "wrap.testnet", {
    viewMethods: ["ft_balance_of"],
    changeMethods: [
      "ft_transfer_call",
      "ft_transfer",
      "start_stream",
      "pause_stream",
      "stop_stream",
      "withdraw",
      "near_deposit",
    ],
  });

  if (wallet.isSignedIn()) {
    signInbtn.textContent = "sign out   " + wallet.getAccountId();
    accountDetail = await wallet.getAccountId();
  }
}

load().then(async () => {
  if (accountDetail != undefined) {
    if (accountDetail == "hrcompany.testnet") {
      window.location.replace("./hr.html");
    } else {
      window.location.replace("./emp.html");
    }
    console.log(accountDetail);
  }
});

signInbtn.addEventListener("click", async () => {
  console.log(wallet);
  if (!wallet.isSignedIn()) {
    wallet.requestSignIn("wrap.testnet");
  } else {
    wallet.signOut();
    signInbtn.textContent = "sign in";
    location.reload();
  }
});
