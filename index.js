// near plus roketo
let connectButton = document.getElementById("connect");
let signInbtn = document.getElementById("signIn");

let contract;
let wallet;
let near;
let accountDetail;
let ftContract;
let contract_dcversus;
async function load() {
  let near = await new nearApi.Near({
    keyStore: new nearApi.keyStores.BrowserLocalStorageKeyStore(),
    networkId: "testnet",
    nodeUrl: "https://rpc.testnet.near.org",
    walletUrl: "https://wallet.testnet.near.org",
  });

  wallet = new nearApi.WalletConnection(near);

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
    accountDetail = await wallet.getAccountId();
  }
}

load().then(async () => {
  if (accountDetail != undefined) {
    await get_balance_emp1();
    await get_balance_emp2();
    await get_balance_emp3();
    console.log(accountDetail);
  }
});
async function get_balance_emp1() {
  let balance1 = await ftContract.ft_balance_of({
    account_id: "emp1.testnet",
  });
  console.log(balance1);
  if (balance1 == 0) {
    document.getElementById("stat1").innerHTML = "Waiting for deposit";
    document.getElementById("stat1").classList.add("waiting");
  } else {
    document.getElementById("stat1").innerHTML = "active";
    document.getElementById("stat1").classList.add("active");
  }
}
async function get_balance_emp2() {
  let balance2 = await ftContract.ft_balance_of({
    account_id: "emp2.testnet",
  });
  console.log(balance2);
  if (balance2 == 0) {
    document.getElementById("stat2").innerHTML = "Waiting for deposit";
    document.getElementById("stat2").classList.add("waiting");
  } else {
    document.getElementById("stat2").innerHTML = "active";
    document.getElementById("stat2").classList.add("active");
  }
}
async function get_balance_emp3() {
  let balance3 = await ftContract.ft_balance_of({
    account_id: "emp3.testnet",
  });
  console.log(balance3);
  if (balance3 == 0) {
    document.getElementById("stat3").innerHTML = "Waiting for deposit";
    document.getElementById("stat3").classList.add("waiting");
  } else {
    document.getElementById("stat3").innerHTML = "active";
    document.getElementById("stat3").classList.add("active");
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const qsa = document.querySelectorAll.bind(document);
  const buttons = Array.from(
    qsa(".table-responsive-xl button:not([disabled])")
  );

  buttons.map((btn) =>
    btn.addEventListener("click", async (event) => {
      const { id } = event.target.dataset;
      console.log(id);
      const testAccount =
        document.getElementById("empTable").rows[id].cells[3].innerHTML;
      const monthHour =
        document.getElementById("empTable").rows[id].cells[4].innerHTML;
      const hourRate =
        document.getElementById("empTable").rows[id].cells[5].innerHTML;
      console.log(testAccount);
      let payment = monthHour * hourRate;
      let tokenPseconds = 385802469135802469 * payment;
      console.log(payment);
      let response = await ftContract.ft_transfer_call(
        {
          receiver_id: "streaming-r-v2.dcversus.testnet",
          amount: nearApi.utils.format.parseNearAmount(payment.toString()), // 1 NEAR
          memo: "salariy",
          msg: JSON.stringify({
            Create: {
              request: {
                owner_id: wallet.getAccountId(),
                receiver_id: testAccount,
                tokens_per_sec: parseInt(tokenPseconds.toString()), // 1 month for payment NEAR
              },
            },
          }),
        },
        "100000000000000",
        "1"
      );
      console.log(response);
    })
  );
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
