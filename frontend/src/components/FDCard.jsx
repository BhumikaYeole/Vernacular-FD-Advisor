function FDCard({ fds }) {
  return (
    <table className="w-full border mt-4">
  <thead>
    <tr>
      <th>Bank</th>
      <th>Rate (%)</th>
      <th>Type</th>
    </tr>
  </thead>
  <tbody>
    {fds.map((fd, i) => (
      <tr key={i}>
        <td>{fd.bank}</td>
        <td>{fd.rate}</td>
        <td>{fd.type}</td>
      </tr>
    ))}
  </tbody>
</table>
  );
}

export default FDCard;