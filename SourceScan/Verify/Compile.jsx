const useNetwork = (mainnet, testnet) => {
  return context.networkId === "mainnet" ? mainnet : testnet;
};

State.init({
  appUrl: useNetwork(
    "https://sourcescan.2bb.dev",
    "https://sourcescan.testnet.2bb.dev"
  ),
  apiHost: props.apiHost || "https://sourcescan-api.2bb.dev",
  ownerId: useNetwork("sourcescan.near", "sourcescan.testnet"),
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
  github: props.github,
  key: props.key,
  files: props.files,
  entryPoint: null,
  lang: "rust",
  loading: false,
  error: false,
  gatewayKey: null,
});

const clearState = () => {
  State.update({
    entryPoint: null,
    lang: "rust",
    loading: false,
    error: false,
    gatewayKey: null,
  });
};

if (!props.github) {
  <Widget
    src={`${state.ownerId}/widget/SourceScan.Common.ErrorAlert`}
    props={{
      message:
        "Please provide github: {repo: string, owner: string, sha: string} to the component",
    }}
  />;
} else if (!props.key) {
  <Widget
    src={`${state.ownerId}/widget/SourceScan.Common.ErrorAlert`}
    props={{
      message: "Please provide key: string to the component",
    }}
  />;
} else if (!props.files) {
  <Widget
    src={`${state.ownerId}/widget/SourceScan.Common.ErrorAlert`}
    props={{
      message: "Please provide files: string[] to the component",
    }}
  />;
}

const Center = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
`;

const EPContainer = styled.div`
  height: 100%;
  padding: 10px;
  border-radius: 6px;
  border-style: dashed;
  border-color: ${state.theme.border};
  flex-direction: row;
  text-align: center;
  align-items: center;
  justify-content: space-between;

  @media only screen and (max-width: 750px) {
    width: 90%;
  }
`;

const EntryPoint = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  text-align: start;
  align-items: center;
  justify-content: start;
  gap: 25px;
  padding-top: 25px;
  padding-bottom: 25px;
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

const Text = styled.div`
  max-width: 350;
  font-size: ${state.theme.text.fontSize};
  font-weight: ${state.theme.text.fontWeight};
  color: ${state.theme.color};

  @media only screen and (max-width: 750px) {
    max-width: 200px;
  }
`;

const Heading = styled.div`
  font-size: ${state.theme.heading.fontSize};
  font-weight: ${state.theme.heading.fontWeight};
  color: ${state.theme.color};

  @media only screen and (max-width: 750px) {
    width: 200px;
  }
`;

const Stack = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  text-align: center;
  align-items: center;
  justify-content: center;
  gap: 35px;
`;

const DeployStack = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  text-align: center;
  align-items: center;
  justify-content: center;
  gap: 25px;
`;

const HStack = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  text-align: center;
  align-items: center;
  justify-content: center;
`;

const Select = styled.select`
  cursor: pointer;
  border: 1px solid ${state.theme.border};
  background-color: transparent;
  border-radius: 6px;
  height: 36px;
  width: 150px;
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
  font-weight: 600;
  border-radius: 6px;
  padding: 15px;
  border: 1px dashed ${state.theme.border};
  color: ${state.theme.color};
  background-color: ${state.theme.bg};
  transition: background-color 0.1s ease-in-out;

  :hover {
    background-color: ${state.theme.hover.bg};
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

const handleEntryPointSelect = (file) => {
  if (state.loading || state.gatewayKey || state.error) return;

  if (state.entryPoint === file) {
    State.update({
      entryPoint: null,
    });
    return;
  }

  State.update({ entryPoint: file });
};

const handleLangChange = (e) => {
  if (state.loading || state.gatewayKey || state.error) return;

  State.update({ lang: e.target.value });
};

const handleKeyGen = () => {
  if (state.loading || state.gatewayKey || state.error) return;

  State.update({
    loading: true,
  });

  asyncFetch(`${state.apiHost}/api/gateway/genKey`, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({
      key: state.key,
      lang: state.lang,
      entry_point: state.entryPoint,
      github: state.github,
      account_id: context.accountId,
    }),
  })
    .then((res) => {
      if (res.status !== 200) {
        clearState();
        State.update({ error: true });
      } else {
        State.update({
          gatewayKey: res.body,
        });
      }
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

const customUriEncode = (str) => {
  const allowedChars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_.~";

  let encodedStr = "";

  for (let i = 0; i < str.length; i++) {
    let char = str[i];

    if (allowedChars.indexOf(char) !== -1) {
      encodedStr += char;
    } else {
      let hexValue = char.charCodeAt(0).toString(16).toUpperCase();
      encodedStr += "%" + (hexValue.length < 2 ? "0" + hexValue : hexValue);
    }
  }

  return encodedStr;
};

return (
  <Stack>
    <Heading>Select entry point</Heading>
    <EPContainer>
      {state.files.map((file, i) => (
        <EntryPoint key={i}>
          {state.entryPoint === file ? (
            <SelectedRButton onClick={() => handleEntryPointSelect(file)} />
          ) : (
            <RButton onClick={() => handleEntryPointSelect(file)} />
          )}
          <Heading>{file}</Heading>
        </EntryPoint>
      ))}
    </EPContainer>
    {state.entryPoint ? (
      <>
        <Heading>What to compile</Heading>
        <Select onChange={(e) => handleLangChange(e)}>
          <option
            value={"rust"}
            selected={state.lang === "rust"}
            disabled={state.loading || state.error}
          >
            Rust
          </option>
          <option
            value={"ts"}
            selected={state.lang === "ts"}
            disabled={state.loading || state.error}
          >
            TypeScript
          </option>
        </Select>
        {state.gatewayKey ? (
          <DeployStack>
            <Heading>
              You will be redirected to another site for compilation and
              deployment
            </Heading>
            <A
              href={`${state.appUrl}/gateway?key=${customUriEncode(
                state.gatewayKey
              )}`}
              target={"_blank"}
            >
              <Button>Gateway</Button>
            </A>
          </DeployStack>
        ) : (
          <Button onClick={handleKeyGen} disabled={state.loading}>
            {!state.loading ? (
              "Generate Key"
            ) : (
              <Widget
                src={`${state.ownerId}/widget/SourceScan.Common.Spinner`}
                props={{ width: "20px", height: "20px" }}
              />
            )}
          </Button>
        )}
      </>
    ) : null}
  </Stack>
);
