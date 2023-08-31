const useNetwork = (mainnet, testnet) => {
  return context.networkId === "mainnet" ? mainnet : testnet;
};

State.init({
  ownerId: useNetwork("sourcescan.near", "sourcescan.testnet"),
  theme: props.theme || light,
  loading: false,
  error: false,
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
  State.update({ loading: true });
  const repoUrl = value.toLocaleLowerCase();
  const parsed = repoUrl?.replace("https://github.com/", "").split("/");

  asyncFetch(`https://api.github.com/repos/${parsed[0]}/${parsed[1]}`, {
    method: "GET",
  })
    .then((res) => {
      if (res.status !== 200) {
        State.update({ error: true });
      } else {
        State.update({
          user: {
            name: res.body.owner.login,
            avatar: res.body.owner.avatar_url,
          },
        });
        State.update({ repo: { name: res.body.name, url: res.body.html_url } });
      }
    })
    .finally(() => {
      State.update({ loading: false });
    });
};

console.log(state.error);

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
    {!state.loading && state.repo && state.user ? (
      <Stack>
        <Widget
          src={`${state.ownerId}/widget/SourceScan.Common.Github.GithubLink`}
          props={{
            github: { owner: state.user?.name, repo: state.repo?.name },
            theme: { color: state.theme.color, heading: state.theme.heading },
          }}
        />
      </Stack>
    ) : state.loading && !state.error ? (
      <Widget
        src={`${state.ownerId}/widget/SourceScan.Common.Spinner`}
        props={{ width: "64px", height: "64px" }}
      />
    ) : state.error ? (
      <Widget
        src={`${state.ownerId}/widget/SourceScan.Common.ErrorAlert`}
        props={{ message: "Invalid repository URL" }}
      />
    ) : null}
  </Stack>
);
