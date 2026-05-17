import { Trophy, TrendingUp } from "lucide-react";

export interface PerformerData {
  name: string;
  totalLeads: number;
  qualifiedLeads: number;
  conversionRate: number;
  rank: number;
}

interface TopPerformersProps {
  data: PerformerData[];
}

export function TopPerformers({ data }: TopPerformersProps) {
  return (
    <div style={{ background: 'black', border: '1px solid #2a2d35', borderRadius: 12, padding: 20, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <h3 style={{ fontSize: 16, fontWeight: 600, color: '#f0ede6', margin: 0 }}>Top Performers</h3>
          <p style={{ fontSize: 14, color: '#9ca3af', margin: '4px 0 0' }}>This month's leaders</p>
        </div>
        <div style={{ color: '#f59e0b' }}>
          <Trophy className="w-5 h-5" size={20} />
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, flex: 1, overflowY: 'auto' }}>
        {data.length === 0 ? (
          <div style={{ padding: '20px', textAlign: 'center', color: '#9ca3af', fontSize: 14 }}>
            No performance data yet
          </div>
        ) : data.map((person) => (
          <div
            key={person.name}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px',
              borderRadius: 8,
              transition: 'background 0.2s',
              cursor: 'pointer',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ position: 'relative' }}>
                <div style={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, rgba(74, 222, 128, 0.2) 0%, rgba(59, 130, 246, 0.2) 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 14,
                  fontWeight: 600,
                  color: '#4ade80'
                }}>
                  {person.name.split(" ").map((n) => n[0]).join("")}
                </div>
                {person.rank <= 3 && (
                  <div style={{
                    position: 'absolute',
                    top: -4,
                    right: -4,
                    width: 20,
                    height: 20,
                    borderRadius: '50%',
                    background: '#f59e0b',
                    fontSize: 10,
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#0a0a0a'
                  }}>
                    {person.rank}
                  </div>
                )}
              </div>
              <div>
                <p style={{ fontSize: 14, fontWeight: 500, color: '#f0ede6', margin: 0 }}>{person.name}</p>
                <p style={{ fontSize: 12, color: '#9ca3af', margin: '2px 0 0' }}>{person.totalLeads} total leads</p>
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <p style={{ fontSize: 14, fontWeight: 600, color: '#f0ede6', margin: 0 }}>{person.qualifiedLeads} Qualified</p>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 4, fontSize: 12, color: '#4ade80', marginTop: 2 }}>
                <TrendingUp size={12} />
                {person.conversionRate}% Conv
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
