import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const AppContext = createContext();

const RANKS = [
  {
    level: 1, title: "Ambassador", color: "#C8A96E", glow: "#C8A96E40",
    customers: 5, ambassadors: 0, volume: 2500,
    directPct: 10, overrides: [],
    avgProgram: 1500, estRevenue: [250, 375],
    badge: "◆",
  },
  {
    level: 2, title: "Senior Ambassador", color: "#A8C4D4", glow: "#A8C4D440",
    customers: 15, ambassadors: 3, volume: 10000,
    directPct: 12, overrides: [{ label: "Team Override", pct: 3 }],
    avgProgram: 1500, estRevenue: [600, 900],
    badge: "◈",
  },
  {
    level: 3, title: "Team Manager", color: "#7EC8A4", glow: "#7EC8A440",
    customers: 30, ambassadors: 10, volume: 25000,
    directPct: 15, overrides: [{ label: "L1 Override", pct: 5 }, { label: "L2 Override", pct: 2 }],
    avgProgram: 1500, estRevenue: [1500, 2500],
    badge: "⬡",
  },
  {
    level: 4, title: "Senior Manager", color: "#C47DB8", glow: "#C47DB840",
    customers: 75, ambassadors: 25, volume: 75000,
    directPct: 15, overrides: [{ label: "L1 Override", pct: 6 }, { label: "L2 Override", pct: 3 }],
    avgProgram: 1500, estRevenue: [4500, 6000],
    badge: "✦",
  },
  {
    level: 5, title: "Director", color: "#E8845C", glow: "#E8845C40",
    customers: 150, ambassadors: 50, volume: 150000,
    directPct: 15, overrides: [{ label: "L1 Override", pct: 6 }, { label: "L2 Override", pct: 4 }, { label: "L3 Override", pct: 2 }],
    avgProgram: 1500, estRevenue: [10000, 15000],
    badge: "★",
  },
  {
    level: 6, title: "Executive Director", color: "#B39DDB", glow: "#B39DDB40",
    customers: 300, ambassadors: 100, volume: 300000,
    directPct: 15, overrides: [{ label: "L1 Override", pct: 6 }, { label: "L2 Override", pct: 4 }, { label: "L3 Override", pct: 2 }, { label: "L4 Override", pct: 1 }],
    avgProgram: 1500, estRevenue: [20000, 30000],
    badge: "✷",
  },
  {
    level: 7, title: "Presidential Ambassador", color: "#F48FB1", glow: "#F48FB140",
    customers: 500, ambassadors: 200, volume: 500000,
    directPct: 15, overrides: [{ label: "L1 Override", pct: 7 }, { label: "L2 Override", pct: 5 }, { label: "L3 Override", pct: 3 }, { label: "L4 Override", pct: 2 }],
    avgProgram: 1500, estRevenue: [40000, 60000],
    badge: "♛",
  },
  {
    level: 8, title: "Crown Ambassador", color: "#FFE082", glow: "#FFE08240",
    customers: 1000, ambassadors: 500, volume: 1000000,
    directPct: 15, overrides: [{ label: "L1 Override", pct: 8 }, { label: "L2 Override", pct: 6 }, { label: "L3 Override", pct: 4 }, { label: "L4 Override", pct: 2 }, { label: "L5 Override", pct: 1 }],
    avgProgram: 1500, estRevenue: [80000, 150000],
    badge: "♔",
  },
];

export function AppProvider({ children }) {
  const { user } = useAuth();

  const [loadingSync, setLoadingSync] = useState(true);
  const [sales, setSales] = useState(0);
  const [recruits, setRecruits] = useState(0);
  const [selectedRank, setSelectedRank] = useState(0);
  const [volume, setVolume] = useState(0);
  const [referralLink, setReferralLink] = useState("https://remotefitlabs.com/join");

  // Payment data from GHL's connected Stripe
  const [commissions, setCommissions] = useState({ available: 0, pending: 0 });
  const [transactions, setTransactions] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);

  const [activities, setActivities] = useState([]);

  useEffect(() => {
    async function syncGHL() {
      if (!user) {
        setLoadingSync(false);
        return;
      }

      try {
        setLoadingSync(true);
        const { data, error } = await supabase.functions.invoke('ghl-sync');

        if (error) {
          console.error("Error syncing with GHL:", error);
          toast.error("Failed to sync with GoHighLevel API.");
          setSales(0);
          setRecruits(0);
          setVolume(0);
          setSelectedRank(0);
          setReferralLink("https://remotefitlabs.com/join");
        } else if (data) {
          // Toast Notifications
          if (data.mocked) {
            toast.error("Backend API Keys not set. Showing mock data.");
          } else if (data.contactFound === false) {
            toast.error("Your email was not found in GoHighLevel. Are you registered?", { duration: 5000 });
          } else {
            toast.success("Successfully synced live data from GoHighLevel!");
          }

          // Ambassador metrics
          setSales(data.sales ?? 0);
          setRecruits(data.recruits ?? 0);
          setVolume(data.volume ?? 0);
          setSelectedRank(data.selectedRank ?? 0);
          setReferralLink(data.referralLink ?? `https://remotefitlabs.com/join?ref=${data.contactId || 'new'}`);

          // Payment data from GHL Stripe
          if (data.commissions) {
            setCommissions(data.commissions);
          }
          if (data.transactions) {
            setTransactions(data.transactions);
          }
          if (data.subscriptions) {
            setSubscriptions(data.subscriptions);
          }

          // Build real activity feed from transactions
          const realActivities = (data.transactions || []).slice(0, 5).map((t, i) => ({
            id: t.id || i,
            type: t.type === 'charge' ? 'sale' : 'commission',
            text: `${t.description} — $${t.amount?.toFixed(2)}`,
            time: t.createdAt ? new Date(t.createdAt).toLocaleDateString() : 'Recently',
            color: t.status === 'succeeded' ? '#7EC8A4' : t.status === 'pending' ? '#C8A96E' : '#A8C4D4',
          }));

          if (realActivities.length > 0) {
            setActivities(realActivities);
          } else {
            // No transactions yet — show a welcome message
            setActivities([
              { id: 1, type: "info", text: "Welcome to your Ambassador Dashboard!", time: "Just now", color: "#C8A96E" },
              { id: 2, type: "info", text: "Your stats will update as sales come in", time: "Just now", color: "#7EC8A4" },
            ]);
          }
        }
      } catch (err) {
        console.error("Exception invoking ghl-sync:", err);
      } finally {
        setLoadingSync(false);
      }
    }

    syncGHL();
  }, [user]);

  const rank = RANKS[selectedRank];
  const salesPct = Math.min((sales / rank.customers) * 100, 100);
  const recruitPct = rank.ambassadors > 0 ? Math.min((recruits / rank.ambassadors) * 100, 100) : 100;
  const overallPct = (salesPct * 0.7) + (recruitPct * 0.3);
  const estimatedCommission = volume * (rank.directPct / 100);

  return (
    <AppContext.Provider value={{
      RANKS,
      sales, setSales,
      recruits, setRecruits,
      selectedRank, setSelectedRank,
      volume, setVolume,
      referralLink, setReferralLink,
      rank, salesPct, recruitPct, overallPct, estimatedCommission,
      activities,
      commissions, transactions, subscriptions,
      loadingSync
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useAppContext = () => useContext(AppContext);
