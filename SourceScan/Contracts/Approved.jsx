const useNetwork = (mainnet, testnet) => {
  return context.networkId === "mainnet" ? mainnet : testnet;
};

State.init({
  ownerId: useNetwork("sourcescan.near", "sourcescan.testnet"),
  value: null,
  error: false,
});

const compareWasm = () => {
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: "dontcare",
      method: "query",
      params: {
        request_type: "view_code",
        finality: "final",
        account_id: props.accountId,
      },
    }),
  };
  asyncFetch(props.rpcUrl, options)
    .then((rpc_res) => {
      asyncFetch(`${props.apiHost}/ipfs/${props.cid}/wasm_code_base64`)
        .then((ipfs_res) => {
          if (rpc_res.body.result.code_base64 !== ipfs_res.body) {
            State.update({
              value: false,
            });
            return;
          } else {
            asyncFetch(`${props.apiHost}/api/ipfs/getTxHash`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: `{ "cid": "${props.cid}" }`,
            })
              .then((res) => {
                State.update({ value: res.body.tx_hash === props.deploy_tx });
              })
              .catch((err) => {
                console.log(err);
                State.update({ error: true });
              });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      console.log(err);
    });
};

compareWasm();

return (
  <>
    {state.value === null ? (
      <Widget src={`${props.ownerId}/widget/SourceScan.Common.Spinner`} />
    ) : state.value === true ? (
      <Widget
        src={`${state.ownerId}/widget/SourceScan.Common.Icons.CheckIcon`}
        props={{
          width: "20px",
          height: "20px",
          tooltip: { placement: props.placement, label: "Approved" },
        }}
      />
    ) : (
      <Widget
        src={`${state.ownerId}/widget/SourceScan.Common.Icons.CrossIcon`}
        props={{
          width: "20px",
          height: "20px",
          tooltip: {
            placement: props.placement,
            label: state.error ? "Error" : "Not approved",
          },
        }}
      />
    )}
  </>
);
