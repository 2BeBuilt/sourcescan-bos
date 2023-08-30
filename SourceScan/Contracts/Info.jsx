const useNetwork = (mainnet, testnet) => {
  return context.networkId === "mainnet" ? mainnet : testnet;
};

State.init({
  ownerId: useNetwork("sourcescan.near", "sourcescan.testnet"),
  apiHost: "https://sourcescan.2bb.dev",
  rpcUrl: useNetwork(
    "https://rpc.mainnet.near.org",
    "https://rpc.testnet.near.org"
  ),
  theme: props.theme || {
    bg: "#e3e8ef",
    color: "#4c5566",
    border: "1px dashed #748094",
    text: {
      fontSize: "16px",
    },
    heading: {
      fontSize: "18px",
      fontWeight: "600",
      underline: true,
    },
  },
  contract: null,
  wasm: { value: null, error: false },
  tx: { value: null, error: false },
});

const getContract = async () => {
  Near.asyncView(state.ownerId, "get_contract", {
    contract_id: props.contractId,
  })
    .then((res) => {
      State.update({
        contract: res,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

if (!props.contractId) {
  return "Please provide a contractId to the component";
} else {
  getContract();
}

const Main = styled.div`
  background-color: ${state.theme.bg};
  padding: 18px;
  color: ${state.theme.color};
  border: ${state.theme.border};
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  text-align: start;
  align-items: start;
  justify-content: start;
  gap: 30px;

  @media only screen and (max-width: 750px) {
    text-align: center;
    align-items: center;
    justify-content: center;
  }
`;

const Stack = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: start;
  text-align: start;
  gap: 8px;

  @media only screen and (max-width: 750px) {
    width: 90%;
    text-align: center;
    align-items: center;
    justify-content: center;
  }
`;

const HStack = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: start;
  align-items: center;
  text-align: start;
  gap: 5px;

  @media only screen and (max-width: 750px) {
    width: 90%;
    text-align: center;
    align-items: center;
    justify-content: center;
  }
`;

const UHeading = styled.div`
  font-size: ${state.theme.heading.fontSize};
  font-weight: ${state.theme.heading.fontWeight};
  text-decoration: ${state.theme.heading.underline ? "underline" : "none"};
  text-underline-offset: 6px;
  text-decoration-style: dashed;
  text-decoration-color: gray;
`;

const Heading = styled.div`
  font-size: ${state.theme.heading.fontSize};
  font-weight: ${state.theme.heading.fontWeight};
`;

const Desktop = styled.div`
  display: flex;

  @media only screen and (max-width: 750px) {
    display: none;
  }
`;

const Mobile = styled.div`
  display: none;

  @media only screen and (max-width: 750px) {
    display: flex;
  }
`;

const Text = styled.div`
  font-size: ${state.theme.text.fontSize};
  color: ${state.theme.color};
`;

const Center = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  @media only screen and (max-width: 750px) {
    width: 90%;
  }
`;

const EPContainer = styled.div`
  max-width: 100%;

  @media only screen and (max-width: 750px) {
    max-width: 90%;
  }
`;

const A = styled.a`
  text-decoration: none;
  color: ${state.theme.color};

  :hover {
    text-decoration: none;
    color: ${state.theme.color};
  }
`;

const truncateStringInMiddle = (str, maxLength) => {
  if (str.length <= maxLength) {
    return str;
  }

  const halfMaxLength = Math.floor(maxLength / 2);
  const firstHalf = str.slice(0, halfMaxLength);
  const secondHalf = str.slice(-halfMaxLength);

  return firstHalf + "..." + secondHalf;
};

const wasmCheck = () => {
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
        account_id: props.contractId,
      },
    }),
  };
  asyncFetch(state.rpcUrl, options)
    .then((rpc_res) => {
      asyncFetch(`${state.apiHost}/ipfs/${state.contract.cid}/wasm_code_base64`)
        .then((ipfs_res) => {
          State.update({
            wasm: {
              value: rpc_res.body.result.code_base64 === ipfs_res.body,
              error: false,
            },
          });
        })
        .catch((err) => {
          console.log(err);
          State.update({
            wasm: {
              value: null,
              error: true,
            },
          });
        });
    })
    .catch((err) => {
      State.update({
        wasm: {
          error: true,
        },
      });
      console.log(err);
    });
};

const txCheck = () => {
  asyncFetch(`${state.apiHost}/api/ipfs/getTxHash`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: `{ "cid": "${state.contract.cid}" }`,
  })
    .then((res) => {
      State.update({
        tx: {
          value: res.body.tx_hash === state.contract.deploy_tx,
          error: false,
        },
      });
    })
    .catch((err) => {
      console.log(err);
      State.update({
        tx: { value: null, error: true },
      });
    });
};

if (state.contract) {
  wasmCheck();
  txCheck();
}

return (
  <Center>
    {!state.contract ? (
      <Widget
        src={`${state.ownerId}/widget/SourceScan.Common.Spinner`}
        props={{ width: "64px", height: "64px" }}
      />
    ) : (
      <Main>
        <HStack>
          <Heading>{props.contractId}</Heading>
          <A
            href={`https://${
              context.networkId === "mainnet" ? "" : "testnet."
            }nearblocks.io/address/${props.contractId}`}
            target={"_blank"}
          >
            <Widget
              src={`${state.ownerId}/widget/SourceScan.Common.Icons.LinkIcon`}
              props={{ width: "18px", height: "18px" }}
            />
          </A>
        </HStack>
        <Stack>
          <UHeading>Security Checks</UHeading>
          <Stack>
            <HStack>
              {state.wasm.value === null ? (
                <Widget
                  src={`${state.ownerId}/widget/SourceScan.Common.Spinner`}
                />
              ) : state.wasm.value ? (
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
                      label: state.wasm.error ? "Error" : "Not approved",
                    },
                  }}
                />
              )}
              <Text>
                Wasm Code {state.wasm.value ? "Matches" : "Mismatches"}
              </Text>
            </HStack>
            <HStack>
              {state.tx.value === null ? (
                <Widget
                  src={`${state.ownerId}/widget/SourceScan.Common.Spinner`}
                />
              ) : state.tx.value ? (
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
                    width: "32px",
                    height: "32px",
                    tooltip: {
                      placement: props.placement,
                      label: state.tx.error ? "Error" : "Not approved",
                    },
                  }}
                />
              )}
              <Text>Deploy Tx {state.tx.value ? "Matches" : "Mismatches"}</Text>
            </HStack>
          </Stack>
        </Stack>
        <Stack>
          <UHeading>Deploy Tx</UHeading>
          <HStack>
            <Desktop>
              <Text>{state.contract.deploy_tx}</Text>
            </Desktop>
            <Mobile>
              <Text>{truncateStringInMiddle(state.contract.deploy_tx, 8)}</Text>
            </Mobile>
            <A
              href={`https://${
                context.networkId === "mainnet" ? "" : "testnet."
              }nearblocks.io/txns/${state.contract.deploy_tx}`}
              target={"_blank"}
            >
              <Widget
                src={`${state.ownerId}/widget/SourceScan.Common.Icons.LinkIcon`}
                props={{ width: "18px", height: "18px" }}
              />
            </A>
          </HStack>
        </Stack>
        <Stack>
          <UHeading>Entry Point</UHeading>
          <EPContainer>
            <Text>{state.contract.entry_point}</Text>
          </EPContainer>
        </Stack>
        <Stack>
          <UHeading>Lang</UHeading>
          <Text>{state.contract.lang === "ts" ? "TypeScript" : "Rust"}</Text>
        </Stack>
        <Stack>
          <UHeading>IPFS</UHeading>
          <HStack>
            <Desktop>
              <Text>{state.contract.cid}</Text>
            </Desktop>
            <Mobile>
              <Text>{truncateStringInMiddle(state.contract.cid, 8)}</Text>
            </Mobile>
            <A
              href={`${state.apiHost}/ipfs/${state.contract.cid}`}
              target={"_blank"}
            >
              <Widget
                src={`${state.ownerId}/widget/SourceScan.Common.Icons.LinkIcon`}
                props={{ width: "18px", height: "18px" }}
              />
            </A>
          </HStack>
        </Stack>
        {state.contract.github ? (
          <Stack>
            <UHeading>Github</UHeading>
            <Widget
              src={`${state.ownerId}/widget/SourceScan.Common.Github.GithubLink`}
              props={{
                github: state.contract.github,
                theme: {
                  color: state.theme.color,
                  heading: {
                    fontSize: state.heading.fontSize,
                    fontWeight: "800",
                  },
                },
              }}
            />
          </Stack>
        ) : null}
      </Main>
    )}
  </Center>
);
