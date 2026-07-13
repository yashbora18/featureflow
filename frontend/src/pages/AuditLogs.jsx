function AuditLogs() {
  return (
    <div style={{ padding: "20px" }}>
      <h1>📜 Audit Logs</h1>

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          marginTop: "20px",
        }}
      >
        <thead>
          <tr style={{ background: "#1976d2", color: "white" }}>
            <th style={{ padding: "10px" }}>Time</th>
            <th>User</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td style={{ padding: "10px" }}>10:30 AM</td>
            <td>Admin</td>
            <td>Created new_dashboard flag</td>
          </tr>

          <tr>
            <td style={{ padding: "10px" }}>11:15 AM</td>
            <td>Rahul</td>
            <td>Updated payment_feature</td>
          </tr>

          <tr>
            <td style={{ padding: "10px" }}>12:45 PM</td>
            <td>System</td>
            <td>Evaluation performed</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default AuditLogs;