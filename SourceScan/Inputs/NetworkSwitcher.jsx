const networks = ["mainnet", "testnet"];

State.init({
  theme: props.theme || "light",
});

const dark = {
  bg: "#28282b",
  color: "#e6eaee",
  border: "#748094",
  hoverBg: "#4b4b4b",
};

const light = {
  bg: "#e3e8ef",
  color: "#4c5566",
  border: "#748094",
  hoverBg: "#eef2f6",
};

const useTheme = (light, dark) => {
  return state.theme === "light" ? light : dark;
};

const Select = styled.select`
  font-weight: 600;
  cursor: pointer;
  border: 1px dashed ${useTheme(light.border, dark.border)};
  background-color: ${useTheme(light.bg, dark.bg)};
  border-radius: 8px;
  width: 122px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: ${useTheme(light.color, dark.color)};
  transition: background-color 0.1s ease-in-out;

  :hover {
    background-color: ${useTheme(light.hoverBg, dark.hoverBg)};
  }
`;

const strCapitalize = (str) => {
  if (str.length === 0) return str;

  return str.replace(/^./, (match) => match.toUpperCase());
};

const DropDown = styled.div`
  .dropbtn {
    font-weight: 600;
    cursor: pointer;
    border: 1px dashed ${useTheme(light.border, dark.border)};
    background-color: ${useTheme(light.bg, dark.bg)};
    border-radius: 8px;
    width: 122px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    color: ${useTheme(light.color, dark.color)};
    transition: background-color 0.1s ease-in-out;

    :hover {
      background-color: ${useTheme(light.hoverBg, dark.hoverBg)};
    }
  }

  .dropdown {
    position: relative;
    display: inline-block;
  }

  .dropdown-content {
    display: none;
    align-items: center;
    justify-content: center;
    text-align: center;
    position: absolute;
    border: 1px dashed ${useTheme(light.border, dark.border)};
    background-color: ${useTheme(light.bg, dark.bg)};
    border-radius: 8px;
    width: 122px;
    height: 40px;
    z-index: 10;
  }

  .dropdown-content a {
    display: block;
    align-items: center;
    justify-content: center;
    text-align: center;
    width: 100%;
    padding: 6px;
    height: 100%;
    font-weight: 600;
    color: ${useTheme(light.color, dark.color)};
    cursor: pointer;
    border-radius: 8px;
    text-decoration: none;
  }

  .dropdown-content a:hover {
    background-color: ${useTheme(light.hoverBg, dark.hoverBg)};
  }

  .dropdown:hover .dropdown-content {
    display: flex;
  }

  .dropdown:hover .dropbtn {
    background-color: ${useTheme(light.hoverBg, dark.hoverBg)};
  }
`;

const appHref = (network) => {
  return network === "mainnet"
    ? "https://near.org/sourcescan.near/widget/SourceScan"
    : "https://test.near.org/sourcescan.testnet/widget/SourceScan";
};

return (
  <DropDown>
    <div class="dropdown">
      <button class="dropbtn">{strCapitalize(context.networkId)}</button>
      <div class="dropdown-content">
        {networks
          .filter((n) => n !== context.networkId)
          .map((network, i) => (
            <a key={i} href={appHref(network)} target={"_self"}>
              {strCapitalize(network)}
            </a>
          ))}
      </div>
    </div>
  </DropDown>
);
