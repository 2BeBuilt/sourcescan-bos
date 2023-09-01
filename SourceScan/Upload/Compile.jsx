const useNetwork = (mainnet, testnet) => {
  return context.networkId === "mainnet" ? mainnet : testnet;
};

State.init({
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
  key: props.key,
  files: props.files,
  entryPoint: null,
  lang: "rust",
  compiling: false,
  error: false,
  compiled: false,
});

if (!props.key) {
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
`;

const EntryPoint = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  text-align: start;
  align-items: center;
  justify-content: start;
  gap: 25px;
  padding: 15px;
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
  font-size: ${state.theme.text.fontSize};
  font-weight: ${state.theme.text.fontWeight};
  color: ${state.theme.color};
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

const Select = styled.select`
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

const CompileButton = styled.button`
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

const handleEntryPointSelect = (file) => {
  if (state.compiling || state.compiled || state.error) return;

  if (state.entryPoint === file) {
    State.update({
      entryPoint: null,
    });
    return;
  }

  State.update({ entryPoint: file });
};

const handleLangChange = (e) => {
  if (state.compiling || state.compiled || state.error) return;

  State.update({ lang: e.target.value });
};

const handleCompile = () => {
  State.update({
    compiling: true,
  });
};

return (
  <Stack>
    <Text>Select entry point</Text>
    <EPContainer>
      {state.files.map((file, i) => (
        <EntryPoint key={i}>
          {state.entryPoint === file ? (
            <SelectedRButton onClick={() => handleEntryPointSelect(file)} />
          ) : (
            <RButton onClick={() => handleEntryPointSelect(file)} />
          )}
          <Text>{file}</Text>
        </EntryPoint>
      ))}
    </EPContainer>
    {state.entryPoint ? (
      <>
        <Text>What to compile</Text>
        <Select onChange={(e) => handleLangChange(e)}>
          <option
            value={"rust"}
            selected={state.lang === "rust"}
            disabled={state.compiling || state.compiled || state.error}
          >
            Rust
          </option>
          <option
            value={"ts"}
            selected={state.lang === "ts"}
            disabled={state.compiling || state.compiled || state.error}
          >
            TypeScript
          </option>
        </Select>
        <CompileButton onClick={handleCompile}>
          {state.compiling ? (
            <Widget
              src={`${state.ownerId}/widget/SourceScan.Common.Spinner`}
              props={{ width: "20px", height: "20px" }}
            />
          ) : (
            "Compile"
          )}
        </CompileButton>
      </>
    ) : null}
  </Stack>
);
