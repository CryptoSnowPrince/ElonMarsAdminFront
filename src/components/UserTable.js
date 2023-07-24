import moment from 'moment';

const UserTable = ({
  users,
  selected,
  setSelected,
}) => {
  const handleSelect = (walletAddress) => {
    if (selected.find(item => item === walletAddress)) {
      setSelected(selected.filter(item => item !== walletAddress));
    } else {
      setSelected([...selected, walletAddress]);
    }
  }

  return (
    <table className="w-full border-collapse">
      <thead>
        <tr>
          <th className="text-[#111827] font-semibold text-sm text-left pr-3 py-3.5"></th>
          <th className="text-[#111827] font-semibold text-sm text-left px-3 py-3.5">Address</th>
          <th className="text-[#111827] font-semibold text-sm text-left px-3 py-3.5">Gold</th>
          <th className="text-[#111827] font-semibold text-sm text-left pl-3 py-3.5">Uranium</th>
          <th className="text-[#111827] font-semibold text-sm text-left px-3 py-3.5">Premium</th>
          <th className="text-[#111827] font-semibold text-sm text-left px-3 py-3.5">Land0</th>
          <th className="text-[#111827] font-semibold text-sm text-left px-3 py-3.5">Land1</th>
          <th className="text-[#111827] font-semibold text-sm text-left px-3 py-3.5">Land2</th>
          <th className="text-[#111827] font-semibold text-sm text-left px-3 py-3.5">Plant</th>
          <th className="text-[#111827] font-semibold text-sm text-left px-3 py-3.5">Mining</th>
          <th className="text-[#111827] font-semibold text-sm text-left px-3 py-3.5">Gbaks</th>
          <th className="text-[#111827] font-semibold text-sm text-left px-3 py-3.5">Res</th>
          <th className="text-[#111827] font-semibold text-sm text-left px-3 py-3.5">Eggs</th>
        </tr>
      </thead>
      <tbody>
        {!users || users.length === 0 ? (
          <tr className="border-t border-t-[#e5e7eb]">
            <td colSpan={8} className="text-[#111827] text-sm text-center py-3.5">No users</td>
          </tr>
        ) : users.map((user, index) => (
          <tr key={`user-${index}`} className="border-t border-t-[#e5e7eb]" onClick={() => handleSelect(user.walletAddress)}>
            <td className="text-[#111827] text-sm text-left pr-3 py-3.5">
              <input type="checkbox" checked={!!selected.find(item => item === user.walletAddress)} onChange={(e) => handleSelect(e, user.walletAddress)} />
            </td>
            <td className="text-[#111827] text-sm text-left px-3 py-3.5">{user.walletAddress}</td>
            <td className="text-[#111827] text-sm text-left px-3 py-3.5">{moment(user.goldMine).format('YYYY-MM-DD')}</td>
            <td className="text-[#111827] text-sm text-left pl-3 py-3.5">{moment(user.uraniumMine).format('YYYY-MM-DD')}</td>
            <td className="text-[#111827] text-sm text-left px-3 py-3.5">{moment(user.premium).format('YYYY-MM-DD')}</td>
            <td className="text-[#111827] text-sm text-left px-3 py-3.5">{user.opendPlace.includes(1) ? "Yes" : "No"}</td>
            <td className="text-[#111827] text-sm text-left px-3 py-3.5">{user.opendPlace.includes(2) ? "Yes" : "No"}</td>
            <td className="text-[#111827] text-sm text-left px-3 py-3.5">{user.opendPlace.includes(3) ? "Yes" : "No"}</td>
            <td className="text-[#111827] text-sm text-left px-3 py-3.5">{moment(user.powerMine).format('YYYY-MM-DD')}</td>
            <td className="text-[#111827] text-sm text-left px-3 py-3.5">{moment(user.miningModule).format('YYYY-MM-DD')}</td>
            <td className="text-[#111827] text-sm text-left px-3 py-3.5">{user.gbaks}</td>
            <td className="text-[#111827] text-sm text-left px-3 py-3.5">{user.resource}</td>
            <td className="text-[#111827] text-sm text-left px-3 py-3.5">{user.eggs}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default UserTable;
