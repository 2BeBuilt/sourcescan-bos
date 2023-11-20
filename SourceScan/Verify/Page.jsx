const useNetwork = (mainnet, testnet) => {
  return context.networkId === "mainnet" ? mainnet : testnet;
};

State.init({
  ownerId: useNetwork("sourcescan.near", "sourcescan.testnet"),
  apiHost: props.apiHost || "https://sourcsecan.2bb.dev",
  theme: props.theme || {
    name: "light",
    bg: "#e3e8ef",
    color: "#4c5566",
    border: "#748094",
    hover: {
      bg: "#eef2f6",
      border: "#d8dfe7",
    },
    text: {
      fontSize: "16px",
    },
    heading: {
      fontSize: "18px",
      fontWeight: "600",
    },
  },
  loading: false,
  error: false,
  contractId: null,
  codeHash: null,
});

const Stack = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  text-align: center;
  align-items: center;
  justify-content: center;
  gap: 35px;
`;

const HStack = styled.div`
  display: flex;
  flex-direction: row;
  text-align: center;
  align-items: center;
  justify-content: center;
  gap: 25px;
`;

const ImportStack = styled.div`
  display: flex;
  flex-direction: row;
  text-align: center;
  align-items: center;
  justify-content: center;
  gap: 25px;

  @media only screen and (max-width: 750px) {
    flex-direction: column;
    gap: 30px;
  }
`;

const Commit = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  text-align: center;
  align-items: center;
  justify-content: space-between;
  gap: 25px;
  border-bottom: 1px dashed ${state.theme.border};

  @media only screen and (max-width: 750px) {
    flex-direction: column;
    justify-content: center;
    margin-top: 25px;
  }
`;

const CommitsContainer = styled.div`
  height: 100%;
  padding: 10px;
  border-radius: 6px;
  border-style: dashed;
  border-color: ${state.theme.border};
  flex-direction: row;
  text-align: center;
  align-items: center;
  justify-content: space-between;
`;

const CommitInfo = styled.div`
  width: 100%;
  display: flex;
  padding: 15px;
  flex-direction: row;
  text-align: start;
  align-items: center;
  justify-content: space-between;
  gap: 25px;

  @media only screen and (max-width: 750px) {
    flex-direction: column;
    text-align: center;
    justify-content: center;
  }
`;

const SearchStack = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 15px;

  @media only screen and (max-width: 750px) {
    flex-direction: column;
    gap: 30px;
  }
`;

const Text = styled.div`
  font-size: ${state.theme.text.fontSize};
  font-weight: ${state.theme.text.fontWeight};
  color: ${state.theme.color};
`;

const MHeading = styled.div`
  font-size: ${state.theme.heading.fontSize};
  font-weight: ${state.theme.heading.fontWeight};
  color: ${state.theme.color};
  width: 250px;
`;

const Heading = styled.div`
  font-size: ${state.theme.heading.fontSize};
  font-weight: ${state.theme.heading.fontWeight};
  color: ${state.theme.color};
`;

const Select = styled.select`
  cursor: pointer;
  border: 1px solid ${state.theme.border};
  background-color: transparent;
  border-radius: 6px;
  height: 36px;
  width: 200px;
  padding-left: 10px;
  padding-right: 10px;
  text-align: start;
  transition: border 0.1s ease-in-out;
  color: ${state.theme.color};

  :hover {
    border: 1px solid ${state.theme.hover.border};
  }
`;

const Button = styled.button`
  height: 36px;
  width: 96px;
  font-weight: 600;
  border-radius: 6px;
  padding-top: 5px;
  padding-bottom: 5px;
  border: 1px dashed ${state.theme.border};
  color: ${state.theme.color};
  background-color: ${state.theme.bg};
  transition: background-color 0.1s ease-in-out;

  :hover {
    background-color: ${state.theme.hover.bg};
  }
`;

const RButton = styled.button`
  background-color: ${state.theme.bg};
  border: 1px solid ${state.theme.border};
  width: 20px;
  height: 20px;
  border-radius: 50px;
`;

const SelectedRButton = styled.button`
  background-color: ${state.theme.border};
  border: 1px solid ${state.theme.border};
  width: 20px;
  height: 20px;
  border-radius: 50px;
`;

const clearState = () => {
  State.update({
    loading: false,
    error: false,
    contractId: null,
    codeHash: null,
  });
};

const handleSubmit = (value) => {
  clearState();

  State.update({ loading: true });

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
        account_id: value,
      },
    }),
  };
  asyncFetch(props.rpcUrl, options)
    .then((rpc_res) => {
      console.log(rpc_res);

      if (rpc_res.body.error) {
        State.update({ error: rpc_res.body.error.cause.name });
      }

      State.update({
        contractId: value,
        codeHash: rpc_res.body.result.hash,
      });
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      State.update({ loading: false });
    });
};

const truncateStringInMiddle = (str, maxLength) => {
  if (str.length <= maxLength) {
    return str;
  }

  const halfMaxLength = Math.floor(maxLength / 2);
  const firstHalf = str.slice(0, halfMaxLength);
  const secondHalf = str.slice(-halfMaxLength);

  return firstHalf + "..." + secondHalf;
};

console.log(state);

return (
  <Stack>
    {context.accountId ? (
      <>
        <Heading>Contract to verify</Heading>
        <SearchStack>
          <Widget
            src={`${state.ownerId}/widget/SourceScan.Inputs.SearchBar`}
            props={{
              inputWidth: "160px",
              placeholder: "Account ID",
              theme: state.theme,
              handleSubmit: handleSubmit,
              value: state.contractId,
            }}
          />
        </SearchStack>
        {state.error && state.error !== "NO_CONTRACT_CODE" ? (
          <Widget
            src={`${state.ownerId}/widget/SourceScan.Common.ErrorAlert`}
            props={{
              message: "Error while loading contract from rpc",
            }}
          />
        ) : (
          <>
            <Heading>{state.contractId}</Heading>
            {state.contractId ? (
              state.error === "NO_CONTRACT_CODE" ? (
                <Heading>No contract code found</Heading>
              ) : (
                <>
                  <Widget
                    src={`${state.ownerId}/widget/SourceScan.Contracts.Info`}
                    props={{
                      contractId: state.contractId,
                      theme: {
                        ...state.theme,
                        border: `1px dashed ${light.border}`,
                        heading: {
                          ...light.heading,
                          underline: true,
                        },
                      },
                    }}
                  />
                  <HStack>
                    <Heading>Docker</Heading>
                    <Heading>Full Access Key</Heading>
                  </HStack>
                  <Widget
                    src={`${state.ownerId}/widget/SourceScan.Verify.Github`}
                    props={{
                      rpcUrl: props.rpcUrl,
                      theme: state.theme,
                      apiHost: state.apiHost,
                    }}
                  />
                </>
              )
            ) : state.loading ? (
              <Widget
                src={`${state.ownerId}/widget/SourceScan.Common.Spinner`}
                props={{ width: "64px", height: "64px" }}
              />
            ) : null}
          </>
        )}
      </>
    ) : (
      <Heading>Please login to your account</Heading>
    )}
  </Stack>
);
