function Environments() {
  return (
    <div style={{ padding: "20px" }}>
      <h1>🌍 Environments</h1>

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          marginTop: "20px",
        }}
      >
        <thead>
          <tr style={{ background: "#1976d2", color: "white" }}>
            <th style={{ padding: "10px" }}>Environment</th>
            <th>Description</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td style={{ padding: "10px" }}>Development</td>
            <td>Used by Developers</td>
            <td>🟢 Active</td>
          </tr>

          <tr>
            <td style={{ padding: "10px" }}>Testing</td>
            <td>QA Testing</td>
            <td>🟢 Active</td>
          </tr>

          <tr>
            <td style={{ padding: "10px" }}>Production</td>
            <td>Live Users</td>
            <td>🟢 Active</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default Environments;