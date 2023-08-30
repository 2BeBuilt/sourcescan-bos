State.init({
  theme: props.theme || "light",
  value: props.value || "",
});

const dark = {
  bg: "#28282b",
  color: "#e6eaee",
  border: "#748094",
  hoverBorder: "#4e5460",
  button: {
    bg: "#39393c",
    hoverBg: "#5e5e60",
  },
};

const light = {
  bg: "#e3e8ef",
  color: "#4c5566",
  border: "#748094",
  hoverBorder: "#d8dfe7",
  button: {
    bg: "#eef2f6",
    hoverBg: "#e3e8ef",
  },
};

const useTheme = (light, dark) => {
  return state.theme === "light" ? light : dark;
};

const handleChange = (e) => {
  State.update({ value: e.target.value });
};

const HStack = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
`;

const SearchInput = styled.input`
  height: 36px;
  width: 126px;
  border-radius: 6px;
  padding-left: 10px;
  padding-right: 10px;
  padding-top: 5px;
  padding-bottom: 5px;
  border: 1px solid ${useTheme(light.border, dark.border)};
  color: ${useTheme(light.color, dark.color)};
  background-color: ${useTheme(light.bg, dark.bg)};
  transition: border 0.1s ease-in-out;

  :hover {
    border: 1px solid ${useTheme(light.hoverBorder, dark.hoverBorder)};
  }
`;

const SearchButton = styled.button`
  height: 36px;
  width: 96px;
  font-weight: 600;
  border-radius: 6px;
  padding-top: 5px;
  padding-bottom: 5px;
  border: 1px solid transparent;
  color: ${useTheme(light.color, dark.color)};
  background-color: ${useTheme(light.button.bg, dark.button.bg)};
  transition: background-color 0.1s ease-in-out;

  :hover {
    background-color: ${useTheme(light.button.hoverBg, dark.button.hoverBg)};
  }
`;

return (
  <HStack>
    <SearchInput
      placeholder={"Account ID"}
      value={state.value}
      onChange={handleChange}
      autoFocus
    />
    <SearchButton onClick={() => props.handleSubmit(state.value)}>
      Search
    </SearchButton>
  </HStack>
);
