const useNetwork = (mainnet, testnet) => {
  return context.networkId === "mainnet" ? mainnet : testnet;
};

State.init({
  ownerId: useNetwork("sourcescan.near", "sourcescan.testnet"),
  theme: props.theme || light,
  user: null,
  repo: null,
});

const Stack = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  text-align: center;
  align-items: center;
  justify-content: center;
  gap: 25px;
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

const handleSubmit = (value) => {
  const repoUrl = value.toLocaleLowerCase();
  const parsed = repoUrl?.replace("https://github.com/", "").split("/");

  asyncFetch(`https://api.github.com/repos/${parsed[0]}/${parsed[1]}`, {
    method: "GET",
  })
    .then((res) => {
      State.update({
        user: {
          name: res.body.owner.login,
          avatar: res.body.owner.avatar_url,
        },
      });
      State.update({ repo: { name: res.body.name, url: res.body.html_url } });
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {});
};
console.log(state);
return (
  <Stack>
    Importing from GitHub
    <SearchStack>
      <Widget
        src={`${state.ownerId}/widget/SourceScan.Inputs.SearchBar`}
        props={{
          inputWidth: "160px",
          placeholder: "Repository URL",
          theme: state.theme,
          handleSubmit: handleSubmit,
          value: state.repo,
        }}
      />
    </SearchStack>
  </Stack>
);
