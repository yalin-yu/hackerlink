type Role = 'builder' | 'backer' | 'organizer';

export default function RoleAvatar({ role, size = 40 }: { role: Role; size?: number }) {
  const roleEmojis = {
    builder: '👾',
    backer: '💰',
    organizer: '🎪'
  };

  const emoji = roleEmojis[role];
  const fontSize = size * 0.6; // Emoji size is 60% of container

  return (
    <div
      className="flex items-center justify-center bg-white border-2 border-[#2563EB] rounded-full"
      style={{ width: size, height: size }}
    >
      <span style={{ fontSize: `${fontSize}px`, lineHeight: 1 }}>
        {emoji}
      </span>
    </div>
  );
}
