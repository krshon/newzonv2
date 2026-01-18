import React, { useState, useEffect } from 'react';
import { Trophy, TrendingUp, Clock, MapPin, Calendar } from 'lucide-react';

export default function CricketSportsPage() {
  const [matches, setMatches] = useState([]);
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('live');

  useEffect(() => {
    fetchCricketData();
    fetchCricketNews();
  }, []);

  const fetchCricketData = async () => {
    try {
      // Using cricapi.com free API (you'll need to sign up for an API key at https://www.cricapi.com/)
      // For demo purposes, I'm showing sample data structure
      const sampleMatches = [
        {
          id: 1,
          title: "India vs Australia - 2nd Test",
          matchType: "Test",
          venue: "Melbourne Cricket Ground",
          status: "Live",
          team1: "India",
          team2: "Australia",
          team1Score: "326/5 (90.0)",
          team2Score: "280 (85.4)",
          team1Flag: "🇮🇳",
          team2Flag: "🇦🇺",
          currentStatus: "India lead by 46 runs"
        },
        {
          id: 2,
          title: "England vs Pakistan - ODI",
          matchType: "ODI",
          venue: "Lord's Cricket Ground",
          status: "Completed",
          team1: "England",
          team2: "Pakistan",
          team1Score: "285/7 (50.0)",
          team2Score: "278 (49.2)",
          team1Flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
          team2Flag: "🇵🇰",
          currentStatus: "England won by 7 runs"
        },
        {
          id: 3,
          title: "South Africa vs New Zealand - T20",
          matchType: "T20",
          venue: "Wanderers Stadium",
          status: "Upcoming",
          team1: "South Africa",
          team2: "New Zealand",
          team1Score: "TBA",
          team2Score: "TBA",
          team1Flag: "🇿🇦",
          team2Flag: "🇳🇿",
          currentStatus: "Match starts at 6:00 PM"
        }
      ];
      setMatches(sampleMatches);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching cricket data:', error);
      setLoading(false);
    }
  };

  const fetchCricketNews = async () => {
    try {
      // Using NewsAPI or similar (you'll need an API key)
      const sampleNews = [
        {
          id: 1,
          title: "Kohli's Masterclass: 150 Runs in Melbourne Test",
          description: "Virat Kohli showcased his batting prowess with a magnificent 150 runs, putting India in a commanding position against Australia.",
          image: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=400",
          source: "ESPN Cricinfo",
          time: "2 hours ago"
        },
        {
          id: 2,
          title: "ICC Announces New Rules for T20 World Cup 2025",
          description: "The International Cricket Council has introduced several rule changes ahead of the upcoming T20 World Cup.",
          image: "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=400",
          source: "Cricbuzz",
          time: "5 hours ago"
        },
        {
          id: 3,
          title: "Rising Star: 19-Year-Old Takes 5 Wickets on Debut",
          description: "A remarkable debut performance sees young pace bowler claim five wickets in the first innings.",
          image: "https://images.unsplash.com/photo-1512719994953-eabf50895df7?w=400",
          source: "Cricket World",
          time: "8 hours ago"
        }
      ];
      setNews(sampleNews);
    } catch (error) {
      console.error('Error fetching news:', error);
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Live': return 'bg-red-500';
      case 'Completed': return 'bg-green-500';
      case 'Upcoming': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const filteredMatches = matches.filter(match => {
    if (activeTab === 'live') return match.status === 'Live';
    if (activeTab === 'upcoming') return match.status === 'Upcoming';
    if (activeTab === 'completed') return match.status === 'Completed';
    return true;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Header */}
      <header className="bg-black/30 backdrop-blur-md border-b border-white/10 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Trophy className="w-8 h-8 text-yellow-400" />
              <h1 className="text-2xl font-bold text-white">Newzon Sports</h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-white/70 text-sm flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Live Updates
              </span>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Match Filters */}
        <div className="flex gap-3 mb-6 overflow-x-auto pb-2">
          {['live', 'upcoming', 'completed'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 rounded-full font-medium transition-all whitespace-nowrap ${
                activeTab === tab
                  ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/50'
                  : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)} Matches
            </button>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Matches Section */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-blue-400" />
              Cricket Matches
            </h2>

            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="bg-white/10 backdrop-blur-md rounded-xl p-6 animate-pulse">
                    <div className="h-6 bg-white/20 rounded w-3/4 mb-4"></div>
                    <div className="h-4 bg-white/20 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredMatches.length === 0 ? (
                  <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 text-center">
                    <p className="text-white/70">No {activeTab} matches at the moment</p>
                  </div>
                ) : (
                  filteredMatches.map((match) => (
                    <div key={match.id} className="bg-white/10 backdrop-blur-md rounded-xl p-6 hover:bg-white/15 transition-all border border-white/10 hover:border-blue-500/50">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-semibold text-white mb-1">{match.title}</h3>
                          <div className="flex items-center gap-3 text-sm text-white/60">
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {match.venue}
                            </span>
                            <span className="px-2 py-0.5 bg-white/10 rounded">{match.matchType}</span>
                          </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${getStatusColor(match.status)} animate-pulse`}>
                          {match.status}
                        </span>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center justify-between bg-black/20 rounded-lg p-3">
                          <div className="flex items-center gap-3">
                            <span className="text-3xl">{match.team1Flag}</span>
                            <span className="text-white font-medium">{match.team1}</span>
                          </div>
                          <span className="text-white font-bold text-lg">{match.team1Score}</span>
                        </div>

                        <div className="flex items-center justify-between bg-black/20 rounded-lg p-3">
                          <div className="flex items-center gap-3">
                            <span className="text-3xl">{match.team2Flag}</span>
                            <span className="text-white font-medium">{match.team2}</span>
                          </div>
                          <span className="text-white font-bold text-lg">{match.team2Score}</span>
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t border-white/10">
                        <p className="text-blue-300 font-medium">{match.currentStatus}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* News Section */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <Calendar className="w-6 h-6 text-yellow-400" />
              Top News
            </h2>

            <div className="space-y-4">
              {news.map((article) => (
                <div key={article.id} className="bg-white/10 backdrop-blur-md rounded-xl overflow-hidden hover:bg-white/15 transition-all border border-white/10 hover:border-yellow-500/50 cursor-pointer">
                  <img 
                    src={article.image} 
                    alt={article.title}
                    className="w-full h-40 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-white font-semibold mb-2 line-clamp-2">{article.title}</h3>
                    <p className="text-white/60 text-sm mb-3 line-clamp-2">{article.description}</p>
                    <div className="flex items-center justify-between text-xs text-white/50">
                      <span>{article.source}</span>
                      <span>{article.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* API Integration Guide */}
            <div className="mt-6 bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
              <h3 className="text-yellow-400 font-semibold mb-2 flex items-center gap-2">
                ⚡ Connect Real APIs
              </h3>
              <p className="text-white/70 text-sm mb-2">
                This demo uses sample data. To get live scores:
              </p>
              <ul className="text-white/60 text-xs space-y-1">
                <li>• <a href="https://www.cricapi.com/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">CricAPI</a> - Cricket scores</li>
                <li>• <a href="https://newsapi.org/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">NewsAPI</a> - Sports news</li>
                <li>• Replace sample data with API calls</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}