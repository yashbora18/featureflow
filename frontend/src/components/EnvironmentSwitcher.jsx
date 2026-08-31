function EnvironmentSwitcher() {
  return (
    <select
      style={{
        padding: "8px",
        borderRadius: "5px",
        fontSize: "16px",
      }}
    >
      <option>Development</option>
      <option>Staging</option>
      <option>Production</option>
    </select>
  );
}

export default EnvironmentSwitcher;
