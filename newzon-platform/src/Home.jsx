import React, { useState, useEffect } from 'react';
import { 
  Eye, Zap, TrendingUp, Shield, ChevronLeft, ChevronRight, 
  Sparkles, Users, BarChart3, Award, Target, Crosshair,
  Search, Menu 
} from 'lucide-react';

export default function NewzonHomepage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [floatingElements, setFloatingElements] = useState([]);

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % bigStories.length);
    }, 5000);
    
    // Generate floating elements
    const elements = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 40 + 20,
      duration: Math.random() * 20 + 10,
      delay: Math.random() * -20
    }));
    setFloatingElements(elements);
    
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const bigStories = [
    {
      title: "AI Revolution: New Model Beats Human Experts",
      category: "Technology",
      truthScore: 94,
      bias: { left: 20, neutral: 60, right: 20 },
      image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=400&fit=crop"
    },
    {
      title: "Climate Summit Reaches Historic Agreement",
      category: "Environment",
      truthScore: 89,
      bias: { left: 45, neutral: 40, right: 15 },
      image: "https://images.unsplash.com/photo-1569163139394-de4798aa62b6?w=800&h=400&fit=crop"
    },
    {
      title: "Tech Giants Face New Regulations",
      category: "Business",
      truthScore: 91,
      bias: { left: 35, neutral: 30, right: 35 },
      image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=400&fit=crop"
    },
    {
      title: "Breakthrough in Renewable Energy Storage",
      category: "Science",
      truthScore: 96,
      bias: { left: 25, neutral: 55, right: 20 },
      image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&h=400&fit=crop"
    }
  ];

  const features = [
    { icon: Shield, title: "Truth Index", desc: "AI-powered fact verification system", color: "from-blue-500 to-cyan-500" },
    { icon: BarChart3, title: "Bias Detection", desc: "Comprehensive political analysis", color: "from-indigo-500 to-purple-500" },
    { icon: Zap, title: "Real-time Updates", desc: "Breaking news as it happens", color: "from-orange-500 to-amber-500" },
    { icon: Users, title: "Community Verified", desc: "Crowd-sourced fact checking", color: "from-emerald-500 to-teal-500" }
  ];

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % bigStories.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + bigStories.length) % bigStories.length);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 text-white overflow-hidden relative">
      {/* Floating Geometric Shapes */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {floatingElements.map((el) => (
          <div
            key={el.id}
            className="absolute rounded-lg bg-gradient-to-br from-blue-500/10 to-purple-500/10 backdrop-blur-sm"
            style={{
              left: `${el.x}%`,
              top: `${el.y}%`,
              width: `${el.size}px`,
              height: `${el.size}px`,
              animation: `float ${el.duration}s ease-in-out infinite`,
              animationDelay: `${el.delay}s`,
              transform: `rotate(${el.id * 45}deg)`
            }}
          />
        ))}
      </div>

      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute w-[600px] h-[600px] bg-blue-500/20 rounded-full blur-3xl animate-pulse"
          style={{
            left: `${mousePosition.x / 15}px`,
            top: `${mousePosition.y / 15}px`,
            transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
          }}
        />
        <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-indigo-500/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-1/4 left-1/3 w-[500px] h-[500px] bg-purple-500/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

<style>{`
  .ticker-track {
    display: flex;
    white-space: nowrap;
    overflow: hidden;
  }

  .ticker-list {
    display: flex;
    gap: 40px;
    padding: 10px 20px;
    animation: scroll-loop 18s linear infinite;
  }

  .ticker-list span {
    font-size: 0.95rem;
    font-weight: 500;
    color: #60a5fa; /* nice blue */
  }

  @keyframes scroll-loop {
    0%   { transform: translateX(0); }
    100% { transform: translateX(-100%); }
  }
`}</style>

{/* Header */}
<header
  className={`relative z-50 px-6 py-4 flex justify-between items-center 
  backdrop-blur-xl bg-white/5 border-b border-white/10 
  transition-all duration-1000 
  ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}`}
>

  {/* LEFT: Logo */}
<div className="flex items-center gap-4 cursor-pointer group">

  {/* NEWZON LOGO IMAGE */}
  <img 
    src="/newzon.png"    // add in /public
    alt="NEWZON Logo"
    className="h-12 w-12 object-contain rounded-xl shadow-lg shadow-blue-500/30
               group-hover:scale-110 transition-all duration-300"
  />

  {/* TEXT: NEWZON */}
  <span
    className="text-4xl font-extrabold bg-gradient-to-r 
               from-blue-400 via-indigo-400 to-purple-400 
               bg-clip-text text-transparent drop-shadow-lg tracking-wide
               group-hover:brightness-125 transition-all duration-300"
  >
    NEWZON
  </span>

</div>

  {/* MIDDLE NAV */}
  <nav className="hidden md:flex gap-10 text-gray-300 text-lg font-medium">
    <button className="hover:text-white transition">Home</button>
    <button className="hover:text-white transition">Trending</button>
    <button className="hover:text-white transition">Categories</button>
    <button className="hover:text-white transition">About</button>
  </nav>

  {/* RIGHT BUTTONS */}
  <div className="flex gap-4 items-center">

    {/* Search */}
    <button className="px-5 py-2 rounded-xl bg-white/10 border border-white/20 
      hover:bg-white/20 transition flex items-center gap-2">
      <Search className="w-5 h-5 text-blue-300" />
      Search
    </button>

    {/* Explore */}
    <button className="px-6 py-2 rounded-xl bg-gradient-to-r 
      from-blue-500 to-indigo-600 hover:shadow-xl 
      hover:shadow-blue-500/40 transition-all font-medium">
      Explore
    </button>

    {/* Mobile Menu */}
    <button className="md:hidden p-2 rounded-xl bg-white/10 hover:bg-white/20 transition">
      <Menu className="w-6 h-6 text-white" />
    </button>

  </div>
</header>

{/* Trending Hashtag Ticker */}
{/* Trending Hashtag Ticker */}
<div className="w-full overflow-hidden bg-white/5 backdrop-blur-md 
  border-t border-b border-white/10">
  
  <div className="ticker-track">
    <div className="ticker-list">
      <span>#AIRevolution</span>
      <span>#Elections2025</span>
      <span>#TechRegulations</span>
      <span>#StockMarketSurge</span>
      <span>#ClimateSummit</span>
      <span>#StartupIndia</span>
      <span>#SpaceTech</span>
      <span>#CyberSecurity</span>
      <span>#EducationReform</span>
    </div>

    {/* Duplicate for smooth infinite scroll */}
    <div className="ticker-list">
      <span>#AIRevolution</span>
      <span>#Elections2025</span>
      <span>#TechRegulations</span>
      <span>#StockMarketSurge</span>
      <span>#ClimateSummit</span>
      <span>#StartupIndia</span>
      <span>#SpaceTech</span>
      <span>#CyberSecurity</span>
      <span>#EducationReform</span>
    </div>
  </div>

</div>


      {/* Hero Section */}
      <section className={`relative z-10 px-6 py-24 text-center transition-all duration-1000 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
        <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-blue-500/20 border border-blue-500/30 mb-8 backdrop-blur-sm animate-bounce shadow-lg shadow-blue-500/20">
          <Sparkles className="w-5 h-5 text-blue-400" />
          <span className="text-sm font-medium">Transparent News. Verified Facts.</span>
        </div>
        
        <h1 className="text-7xl md:text-9xl font-black mb-8 leading-tight">
          News With
          <br />
          <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent animate-pulse">
            No Hidden Agenda
          </span>
        </h1>
        
        <p className="text-2xl text-gray-300 max-w-3xl mx-auto mb-10 leading-relaxed">
          Experience journalism powered by AI verification and bias detection. 
          Know exactly what you're reading and where it stands.
        </p>

        <div className="flex gap-5 justify-center flex-wrap mb-16">
          <button 
            onClick={() => { setShowAuthModal(true); setAuthMode('signup'); }}
            className="px-10 py-5 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 font-semibold text-lg hover:shadow-2xl hover:shadow-blue-500/50 transition-all duration-300 transform hover:scale-110 hover:-translate-y-1"
          >
            Get Started Free
          </button>
          <button 
            onClick={() => document.getElementById('how-it-works').scrollIntoView({ behavior: 'smooth' })}
            className="px-10 py-5 rounded-xl border-2 border-white/30 font-semibold text-lg hover:bg-white/10 transition-all duration-300 transform hover:scale-110 hover:-translate-y-1 backdrop-blur-sm"
          >
            How It Works
          </button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-6 max-w-4xl mx-auto">
          {[
            { icon: Award, label: '10M+', desc: 'Articles Verified' },
            { icon: Users, label: '500K+', desc: 'Active Readers' },
            { icon: Target, label: '95%', desc: 'Accuracy Rate' }
          ].map((stat, idx) => (
            <div key={idx} className="p-6 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 transform hover:scale-105 transition-all duration-300">
              <stat.icon className="w-8 h-8 mx-auto mb-3 text-blue-400" />
              <div className="text-3xl font-bold mb-1">{stat.label}</div>
              <div className="text-sm text-gray-400">{stat.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Trending Stories Slideshow */}
      <section className={`relative z-10 px-6 py-20 transition-all duration-1000 delay-500 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-5xl font-bold flex items-center gap-4">
              <TrendingUp className="text-blue-400 w-12 h-12" />
              Trending Stories
            </h2>
            <div className="flex gap-3">
              <button onClick={prevSlide} className="p-3 rounded-xl bg-white/10 hover:bg-white/20 transition-all transform hover:scale-110">
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button onClick={nextSlide} className="p-3 rounded-xl bg-white/10 hover:bg-white/20 transition-all transform hover:scale-110">
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          </div>

          <div className="relative h-[500px] rounded-3xl overflow-hidden group shadow-2xl">
            {bigStories.map((story, idx) => (
              <div
                key={idx}
                className={`absolute inset-0 transition-all duration-700 ${
                  idx === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                }`}
              >
                <div className="relative h-full">
                  <img src={story.image} alt={story.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
                  
                  <div className="absolute bottom-0 left-0 right-0 p-10">
                    <span className="inline-block px-5 py-2 rounded-full bg-blue-500/90 text-sm font-bold mb-4 backdrop-blur-sm">
                      {story.category}
                    </span>
                    <h3 className="text-4xl font-bold mb-6">{story.title}</h3>
                    
                    <div className="grid grid-cols-1 gap-4 mb-4">
                      <div className="p-4 rounded-xl bg-black/40 backdrop-blur-md border border-white/20">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Shield className="w-5 h-5 text-green-400" />
                            <span className="font-semibold">Truth Score</span>
                          </div>
                          <span className="text-2xl font-bold text-green-400">{story.truthScore}%</span>
                        </div>
                        <div className="w-full h-3 bg-white/20 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full transition-all duration-1000"
                            style={{ width: `${story.truthScore}%` }}
                          />
                        </div>
                        <p className="text-xs text-gray-300 mt-2">Verified by AI and trusted sources</p>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-black/40 backdrop-blur-md border border-white/20">
                      <div className="flex items-center gap-2 mb-3">
                        <BarChart3 className="w-5 h-5 text-blue-400" />
                        <span className="font-semibold">Political Bias Analysis</span>
                      </div>
                      <div className="w-full h-3 bg-white/20 rounded-full overflow-hidden flex mb-2">
                        <div 
                          className="bg-blue-500 transition-all duration-1000" 
                          style={{ width: `${story.bias.left}%` }}
                          title={`Left: ${story.bias.left}%`}
                        />
                        <div 
                          className="bg-gray-400 transition-all duration-1000" 
                          style={{ width: `${story.bias.neutral}%` }}
                          title={`Neutral: ${story.bias.neutral}%`}
                        />
                        <div 
                          className="bg-red-500 transition-all duration-1000" 
                          style={{ width: `${story.bias.right}%` }}
                          title={`Right: ${story.bias.right}%`}
                        />
                      </div>
                      <div className="flex justify-between text-xs text-gray-300">
                        <span>← Left {story.bias.left}%</span>
                        <span>Neutral {story.bias.neutral}%</span>
                        <span>Right {story.bias.right}% →</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Slide Indicators */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-10">
              {bigStories.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    idx === currentSlide ? 'bg-blue-400 w-12' : 'bg-white/50 w-2'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="relative z-10 px-6 py-20 bg-white/5 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-5xl font-bold text-center mb-6">How NEWZON Works</h2>
          <p className="text-xl text-gray-400 text-center mb-16 max-w-3xl mx-auto">
            We combine artificial intelligence, verified sources, and transparency to deliver news you can trust.
          </p>
          
          <div className="grid md:grid-cols-2 gap-10">
            {/* Truth Index Explanation */}
            <div className="p-8 rounded-3xl bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/30 backdrop-blur-md transform hover:scale-105 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-green-500/50">
                <Shield className="w-8 h-8" />
              </div>
              <h3 className="text-3xl font-bold mb-4">Truth Index</h3>
              <p className="text-gray-300 mb-6 leading-relaxed">
                Our proprietary Truth Index analyzes every article using advanced AI algorithms. 
                It cross-references claims with verified databases, checks source credibility, 
                and detects manipulated content or misinformation.
              </p>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-green-400 mt-2" />
                  <div>
                    <div className="font-semibold text-green-400">Source Verification</div>
                    <div className="text-sm text-gray-400">Cross-checks with trusted databases</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-green-400 mt-2" />
                  <div>
                    <div className="font-semibold text-green-400">Fact Matching</div>
                    <div className="text-sm text-gray-400">Compares claims across multiple sources</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-green-400 mt-2" />
                  <div>
                    <div className="font-semibold text-green-400">AI Detection</div>
                    <div className="text-sm text-gray-400">Identifies manipulated media and deepfakes</div>
                  </div>
                </div>
              </div>
              <div className="mt-6 p-4 rounded-xl bg-black/30">
                <div className="text-sm text-gray-400 mb-2">Example Score</div>
                <div className="flex items-center gap-4">
                  <div className="flex-1 h-4 bg-white/20 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full" style={{ width: '92%' }} />
                  </div>
                  <span className="text-2xl font-bold text-green-400">92%</span>
                </div>
              </div>
            </div>

            {/* Bias Bar Explanation */}
            <div className="p-8 rounded-3xl bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border border-blue-500/30 backdrop-blur-md transform hover:scale-105 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-blue-500/50">
                <BarChart3 className="w-8 h-8" />
              </div>
              <h3 className="text-3xl font-bold mb-4">Political Bias Detection</h3>
              <p className="text-gray-300 mb-6 leading-relaxed">
                Our Bias Bar visualizes the political leaning of each article and source. 
                Using natural language processing and historical analysis, we detect tone, 
                word choice, and framing to show you the complete picture.
              </p>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-blue-400 mt-2" />
                  <div>
                    <div className="font-semibold text-blue-400">Language Analysis</div>
                    <div className="text-sm text-gray-400">Detects loaded language and framing</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-blue-400 mt-2" />
                  <div>
                    <div className="font-semibold text-blue-400">Source History</div>
                    <div className="text-sm text-gray-400">Analyzes publisher's historical stance</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-blue-400 mt-2" />
                  <div>
                    <div className="font-semibold text-blue-400">Topic Patterns</div>
                    <div className="text-sm text-gray-400">Identifies what's emphasized or omitted</div>
                  </div>
                </div>
              </div>
              <div className="mt-6 p-4 rounded-xl bg-black/30">
                <div className="text-sm text-gray-400 mb-2">Example Analysis</div>
                <div className="w-full h-4 bg-white/20 rounded-full overflow-hidden flex mb-3">
                  <div className="bg-blue-500" style={{ width: '30%' }} title="Left: 30%" />
                  <div className="bg-gray-400" style={{ width: '40%' }} title="Neutral: 40%" />
                  <div className="bg-red-500" style={{ width: '30%' }} title="Right: 30%" />
                </div>
                <div className="flex justify-between text-xs text-gray-400">
                  <span className="text-blue-400">← Left 30%</span>
                  <span className="text-gray-300">Neutral 40%</span>
                  <span className="text-red-400">Right 30% →</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className={`relative z-10 px-6 py-20 transition-all duration-1000 delay-700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
        <div className="max-w-7xl mx-auto">
          <h2 className="text-5xl font-bold text-center mb-16">Why Choose NEWZON</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, idx) => (
              <div
                key={idx}
                className="p-8 rounded-3xl bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 transition-all duration-300 transform hover:scale-110 hover:-translate-y-2 group"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 group-hover:rotate-12 transition-transform shadow-lg`}>
                  <feature.icon className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 px-6 py-24 text-center">
        <div className="max-w-5xl mx-auto p-16 rounded-3xl bg-gradient-to-r from-blue-500/20 to-indigo-500/20 border border-blue-500/30 backdrop-blur-md shadow-2xl">
          <Crosshair className="w-16 h-16 mx-auto mb-6 text-blue-400 animate-pulse" />
          <h2 className="text-6xl font-bold mb-6">Ready for Truth?</h2>
          <p className="text-2xl text-gray-300 mb-10 max-w-3xl mx-auto">
            Join thousands of readers who trust NEWZON for transparent, verified news coverage
          </p>
          <button 
            onClick={() => { setShowAuthModal(true); setAuthMode('signup'); }}
            className="px-14 py-5 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 font-bold text-xl hover:shadow-2xl hover:shadow-blue-500/50 transition-all duration-300 transform hover:scale-110"
          >
            Sign Up Now
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 px-6 py-10 text-center border-t border-white/10">
        <p className="text-gray-400 text-lg">&copy; 2025 NEWZON. All rights reserved. Truth matters.</p>
      </footer>

      {/* Auth Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-slate-900 rounded-3xl p-10 max-w-md w-full border border-blue-500/30 transform animate-in zoom-in duration-300 shadow-2xl">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-3xl font-bold">
                {authMode === 'login' ? 'Welcome Back' : 'Join NEWZON'}
              </h3>
              <button onClick={() => setShowAuthModal(false)} className="text-gray-400 hover:text-white text-2xl">
                ✕
              </button>
            </div>

            <div className="flex gap-3 mb-8">
              <button
                onClick={() => setAuthMode('login')}
                className={`flex-1 py-3 rounded-xl transition-all font-medium ${
                  authMode === 'login' ? 'bg-blue-500 shadow-lg shadow-blue-500/50' : 'bg-white/5'
                }`}
              >
                Login
              </button>
              <button
                onClick={() => setAuthMode('signup')}
                className={`flex-1 py-3 rounded-xl transition-all font-medium ${
                  authMode === 'signup' ? 'bg-blue-500 shadow-lg shadow-blue-500/50' : 'bg-white/5'
                }`}
              >
                Sign Up
              </button>
            </div>

            <div className="space-y-4">
              {authMode === 'signup' && (
                <input
                  type="text"
                  placeholder="Full Name"
                  className="w-full px-5 py-4 rounded-xl bg-white/5 border border-white/10 focus:border-blue-500 focus:outline-none transition-all"
                />
              )}
              <input
                type="email"
                placeholder="Email Address"
                className="w-full px-5 py-4 rounded-xl bg-white/5 border border-white/10 focus:border-blue-500 focus:outline-none transition-all"
              />
              <input
                type="password"
                placeholder="Password"
                className="w-full px-5 py-4 rounded-xl bg-white/5 border border-white/10 focus:border-blue-500 focus:outline-none transition-all"
              />
              {authMode === 'signup' && (
                <input
                  type="password"
                  placeholder="Confirm Password"
                  className="w-full px-5 py-4 rounded-xl bg-white/5 border border-white/10 focus:border-blue-500 focus:outline-none transition-all"
                />
              )}
              <button
                onClick={(e) => {
                  e.preventDefault();
                  console.log('Auth submitted');
                }}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 font-semibold text-lg hover:shadow-xl hover:shadow-blue-500/50 transition-all transform hover:scale-105"
              >
                {authMode === 'login' ? 'Login' : 'Create Account'}
              </button>
            </div>

            <div className="mt-8 text-center text-sm text-gray-400">
              Or continue with
            </div>
            <div className="grid grid-cols-2 gap-4 mt-5">
              <button className="py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all font-medium">
                Google
              </button>
              <button className="py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all font-medium">
                Twitter
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}