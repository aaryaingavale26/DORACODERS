import React, { useState } from 'react';
import { useSisters } from '../../context/SistersContext';
import { X, Send, MessageCircle, Star, Check } from 'lucide-react';

export default function SisterChatModal() {
  const { selectedSisterForChat, setSelectedSisterForChat, setSelectedSisterForBooking } = useSisters();
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'sister',
      text: "Namaste! 🙏 I am available for home visits and custom service orders. How can I help you today?",
      time: 'Just now'
    }
  ]);
  const [inputValue, setInputValue] = useState('');

  if (!selectedSisterForChat) return null;

  const sister = selectedSisterForChat;

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: inputValue.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');

    // Simulated auto-reply
    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'sister',
          text: `Thank you for your message! I would love to assist you. You can also click "Book Service Visit" to schedule a convenient time slot.`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-pink-100 overflow-hidden flex flex-col h-[560px] animate-fade-in">
        
        {/* Chat Header */}
        <div className="bg-gradient-to-r from-pink-900 via-brand-800 to-pink-900 text-white p-4 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-11 h-11 rounded-full overflow-hidden ring-2 ring-white/60">
                <img src={sister.avatar} alt={sister.name} className="w-full h-full object-cover" />
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white"></div>
            </div>
            <div>
              <h3 className="font-bold text-sm font-serif leading-tight">{sister.name}</h3>
              <p className="text-[11px] text-pink-200">{sister.specialty} • Online</p>
            </div>
          </div>

          <button
            onClick={() => setSelectedSisterForChat(null)}
            className="text-white/80 hover:text-white p-1 rounded-full hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Chat Body */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#faf7f5]">
          {messages.map(msg => (
            <div
              key={msg.id}
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-xs sm:text-sm shadow-sm ${
                  msg.sender === 'user'
                    ? 'bg-[#d81b60] text-white rounded-br-none'
                    : 'bg-white text-gray-800 border border-warm-200 rounded-bl-none'
                }`}
              >
                <p>{msg.text}</p>
                <span className={`text-[10px] mt-1 block text-right ${msg.sender === 'user' ? 'text-pink-200' : 'text-gray-400'}`}>
                  {msg.time}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* WhatsApp Banner */}
        <div className="px-4 py-2 bg-emerald-50 border-t border-b border-emerald-200/80 flex items-center justify-between text-xs text-emerald-900">
          <span>Prefer direct WhatsApp conversation?</span>
          <a
            href={`https://wa.me/919876543210?text=Hello%20${encodeURIComponent(sister.name)},%20I%20saw%20your%20profile%20on%20Udaan%20and%20would%20like%20to%20inquire%20about%20your%20services.`}
            target="_blank"
            rel="noreferrer"
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-2.5 py-1 rounded-lg flex items-center gap-1 text-[11px]"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            WhatsApp
          </a>
        </div>

        {/* Input Footer */}
        <form onSubmit={handleSend} className="p-3 bg-white border-t border-warm-200 flex items-center gap-2">
          <input
            type="text"
            placeholder="Type your message..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="flex-1 text-xs sm:text-sm px-4 py-2.5 rounded-full border border-warm-300 focus:outline-none focus:ring-2 focus:ring-pink-500/30"
          />
          <button
            type="submit"
            className="w-10 h-10 rounded-full bg-[#d81b60] hover:bg-[#c2185b] text-white flex items-center justify-center shrink-0 shadow-sm transition-all"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

        {/* Bottom Quick Action: Book */}
        <div className="p-2 bg-warm-100 text-center border-t border-warm-200">
          <button
            onClick={() => {
              setSelectedSisterForChat(null);
              setSelectedSisterForBooking(sister);
            }}
            className="text-xs font-bold text-pink-700 hover:text-pink-900 hover:underline"
          >
            Ready to book? Click here to Schedule a Doorstep Visit →
          </button>
        </div>

      </div>
    </div>
  );
}
