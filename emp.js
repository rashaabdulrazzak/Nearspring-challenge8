let addButton = document.getElementById("add");
let connectButton = document.getElementById("connect");
let texthead = document.getElementById("display-4");
let contract;
let wallet;
let near;
let accountDetail;
let ftContract;
let contract_dcversus;
async function load() {
  /* connect near */

  let near = await new nearApi.Near({
    keyStore: new nearApi.keyStores.BrowserLocalStorageKeyStore(),
    networkId: "testnet",
    nodeUrl: "https://rpc.testnet.near.org",
    walletUrl: "https://wallet.testnet.near.org",
  });
  // connect to the NEAR Wallet
  wallet = new nearApi.WalletConnection(near);
  // connect to a NEAR smart contract streaming-r-v2.dcversus.testnet
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

  contract_dcversus = new nearApi.Contract(
    wallet.account(),
    "streaming-r-v2.dcversus.testnet",
    {
      viewMethods: [
        "get_stats",
        "get_stream",
        "get_account",
        "get_account_incoming_streams",
        "get_account_outgoing_streams",
      ],
      changeMethods: [
        "start_stream",
        "pause_stream",
        "stop_stream",
        "withdraw",
      ],
    }
  );

  if (wallet.isSignedIn()) {
    connectButton.textContent = "sign out   " + wallet.getAccountId();
    texthead.innerHTML = "Hello   " + wallet.getAccountId();
    accountDetail = await wallet.getAccountId();
  }
}

load().then(async () => {
  if (accountDetail != undefined) {
    await list_stream();
    console.log(accountDetail);
  }
});

addButton.addEventListener("click", async () => {
  let response = await ftContract.near_deposit(
    {},
    "300000000000000",
    nearApi.utils.format.parseNearAmount(
      document.getElementById("deposit").value
    )
  );
  console.log(response);
});
connectButton.addEventListener("click", async () => {
  console.log(wallet);
  if (!wallet.isSignedIn()) {
    wallet.requestSignIn("wrap.testnet");
  } else {
    wallet.signOut();
    connectButton.textContent = "sign in";
    window.location.replace("./index.html");
  }
});
async function withdrawFunc(streamId) {
  console.log(streamId);
  let response = await contract_dcversus.withdraw(
    {
      stream_ids: [streamId],
    },
    "100000000000000",
    "1"
  );
  console.log(response);
}

async function list_stream() {
  let results = await contract_dcversus.get_account_incoming_streams({
    account_id: wallet.getAccountId(),
    from: 0,
    limit: 100,
  });
  console.log(results);

  $.each(results, function (i) {
    let templateString =
      '<div class="card"> <div class="card-body">  <h5>' +
      " Stream id:  " +
      results[i].id +
      "</h5> <br> <p>" +
      "Sender Id: " +
      results[i].creator_id +
      "</p> <br> <p> " +
      "Status:" +
      results[i].status +
      "</p><br>" +
      "<button data-id=" +
      `${results[i].id}` +
      " onclick=withdrawFunc(" +
      `${results[i].id}` +
      ")>" +
      " withdraw" +
      " </button> </div> </div><br><br>";
    $("#mystreams").append(templateString);
  });
}
