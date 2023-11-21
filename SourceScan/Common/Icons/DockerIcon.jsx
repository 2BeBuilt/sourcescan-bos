State.init({
  cursor: props.cursor || "pointer",
  tooltip: props.tooltip || {
    placement: "top",
    label: "Docker",
  },
});

const DockerIcon = (width, height) => {
  const SVG = styled.svg`
        width: ${width}
        height: ${height}
      `;

  return (
    <SVG
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Docker"
      role="img"
      viewBox="0 0 512 512"
      cursor={state.cursor}
    >
      <path
        stroke="currentColor"
        stroke-width="38"
        d="M296 226h42m-92 0h42m-91 0h42m-91 0h41m-91 0h42m8-46h41m8 0h42m7 0h42m-42-46h42"
      />
      <path
        fill="currentColor"
        d="m472 228s-18-17-55-11c-4-29-35-46-35-46s-29 35-8 74c-6 3-16 7-31 7H68c-5 19-5 145 133 145 99 0 173-46 208-130 52 4 63-39 63-39"
      />
    </SVG>
  );
};

return (
  <OverlayTrigger
    key={state.tooltip.placement}
    placement={state.tooltip.placement}
    overlay={
      <Tooltip id={`tooltip-${state.tooltip.placement}`}>
        {state.tooltip.label}
      </Tooltip>
    }
  >
    <DockerIcon width={props.width} height={props.height} />
  </OverlayTrigger>
);