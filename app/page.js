"use client"
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { db } from './lib/firebaseConfig';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import hljs from 'highlight.js'; 
import { FaGithub, FaInfoCircle  } from "react-icons/fa";
import { MdOutlineSend } from "react-icons/md";
import { BsFillEmojiHeartEyesFill } from "react-icons/bs";
import he from 'he';
import EmojiPicker from 'emoji-picker-react';
import { LYNIX_API_URL, LYNIX_API_KEY } from './lib/config';

const Chat = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [userId, setUserId] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showInfoMenu, setShowInfoMenu] = useState(false);
  const messagesEndRef = useRef(null);

  const toggleInfoMenu = () => {
    setShowInfoMenu(prevState => !prevState);
  };
  
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedUserId = localStorage.getItem('userId') || Math.random().toString(36).substring(2, 15);
      if (!localStorage.getItem('userId')) {
        localStorage.setItem('userId', savedUserId);
      }
      setUserId(savedUserId);
    }
  }, []);

  const encodeInput = (input) => {
    return encodeURIComponent(input);
  };

  const decodeInput = (encodedInput) => {
    return decodeURIComponent(encodedInput);
  };

  const escapeHTML = (str) => {
    return he.escape(str);
  };

  const highlightCode = (html) => {
    const element = document.createElement('div');
    element.innerHTML = html;

    const codeBlocks = element.querySelectorAll('pre code');
    codeBlocks.forEach((block) => {
      block.removeAttribute('data-highlighted');
      hljs.highlightElement(block);
    });

    return element.innerHTML;
  };

  const sendMessage = async () => {
    if (message.trim()) {
      const encodedMessage = encodeInput(message);
      await addDoc(collection(db, 'messages'), {
        text: encodedMessage,
        timestamp: serverTimestamp(),
        sender: 'user',
        userId: userId,
      });

      if (message.startsWith('/bot')) {
        const question = message.substring(5).trim();
        const encodedQuestion = encodeInput(question);

        const response = await fetch(LYNIX_API_URL, {
          method: 'POST',
          headers: {
            'x-api-key': LYNIX_API_KEY,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user_id: "lynix-dd2a5d2a651fa-1af56f16a1fa",
            model: 1,
            question: encodedQuestion,
          }),
        });

        const data = await response.json();

        if (data.success) {
          const aiResponse = data.answer;
          const htmlResponse = marked(aiResponse);
          const cleanHtmlResponse = DOMPurify.sanitize(htmlResponse);
          const highlightedHtml = highlightCode(cleanHtmlResponse);

          await addDoc(collection(db, 'messages'), {
            text: encodeInput(highlightedHtml),
            timestamp: serverTimestamp(),
            sender: 'bot',
            userId: "bot",
          });
        } else {
          console.error('AI API error:', data.notice);
        }
      }

      setMessage('');
    }
  };

  useEffect(() => {
    const q = query(collection(db, 'messages'), orderBy('timestamp'));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const messagesList = [];
      querySnapshot.forEach((doc) => {
        messagesList.push({ id: doc.id, ...doc.data() });
      });
      setMessages(messagesList);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (message.length > 300) {
      setMessage(message.slice(0, 300));
    }
  }, [message]);

  const formatDate = (timestamp) => {
    const date = timestamp?.toDate();
    if (!date) return '';
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();

    return `${hours}:${minutes}:${seconds} ${day}-${month}-${year}`;
  };

  useEffect(() => {
    const highlightMessages = () => {
      const botMessages = document.querySelectorAll('.bot-message');
      botMessages.forEach((message) => {
        const codeBlocks = message.querySelectorAll('pre code');
        codeBlocks.forEach((block) => {
          block.removeAttribute('data-highlighted');
          hljs.highlightElement(block);
        });
      });
    };

    highlightMessages();
  }, [messages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleEmojiSelect = (emoji) => {
    setMessage(prevMessage => prevMessage + emoji.emoji);
    setShowEmojiPicker(false);
  };

  if (!userId) return <div className="h-screen w-full flex justify-center items-center bg-gradient-to-br from-slate-900 to-slate-950 text-slate-200"><Image src="/loading.gif" alt="loading" width={100} height={100} /></div>;

  return (
    <main className="min-h-screen w-full bg-gradient-to-br from-slate-900 to-slate-950 text-slate-200">
      <div className="fixed top-0 left-0 z-50 w-full px-4 py-2 flex justify-between items-center bg-slate-800 text-white border-b border-slate-700">
        <div className="flex gap-2">
		  <Image src="/logo.png" className="rounded-full h-12 w-12 object-cover" alt="logo" width={60} height={60} />
		  <div>
            <h2 className="md:text-xl font-extrabold text-white">Anonymous Messages</h2>
            <p className="text-xs">Integrated with Firebase and AI</p>
          </div>
        </div>
		<div className="flex items-center gap-3">
		  <FaInfoCircle 
            className="text-2xl cursor-pointer" 
            onClick={toggleInfoMenu}
          />
          <a href="https://github.com/fitri-hy">
            <FaGithub className="text-2xl" />
          </a>
        </div>
      </div>
	  
      {showInfoMenu && (
        <div className="fixed top-14 right-12 z-50 w-48 bg-slate-900 border border-slate-800 p-4 rounded-lg shadow-lg">
          <h3 className="text-lg font-bold mb-2">Use AI</h3>
          <p>
			<code className="text-emerald-500">/bot</code> <span className="text-sm">[questions]</span>
		  </p>
        </div>
      )}

      <div className="h-screen w-full overflow-auto overflow-y-auto px-4 pt-16 pb-20">
        {messages.map((msg) => (
          <div key={msg.id} className="flex flex-col my-4">
            {msg.sender === 'bot' && (
              <div className="mb-1 text-xs flex items-center gap-1">
                <span>🤖Lynix-AI</span>
                <Image src="/verif.png" alt="loading" width={15} height={15} />
              </div>
            )}
            <div className={`flex ${msg.userId === userId ? 'justify-end' : 'justify-start'}`}>
              <div className={`p-3 rounded-lg max-w-[90%] ${msg.sender === 'bot' ? 'bg-slate-800 bot-message' : 'bg-gray-700'}`}>
                <p 
                  className={`overflow-y-auto whitespace-pre-line message-content ${msg.sender === 'bot' ? 'prose prose-sm' : ''}`}
                  dangerouslySetInnerHTML={{
                    __html: msg.sender === 'bot'
                      ? DOMPurify.sanitize(decodeInput(msg.text))
                      : DOMPurify.sanitize(escapeHTML(decodeInput(msg.text)))
                  }}
                ></p>
                <p className="text-xs text-slate-300 text-right mt-1">{formatDate(msg.timestamp)}</p>
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="fixed bottom-0 left-0 z-50 w-full flex items-center gap-2 p-4 bg-slate-800 border-t border-slate-700">
        <button 
          onClick={() => setShowEmojiPicker(!showEmojiPicker)} 
          className="bg-slate-700 text-white p-2 rounded hover:bg-slate-600 transition duration-300"
        >
          <BsFillEmojiHeartEyesFill className="text-2xl text-amber-500" />
        </button>

        {showEmojiPicker && (
          <div className="absolute bottom-16 left-4 z-50">
            <EmojiPicker
              onEmojiClick={handleEmojiSelect}
			  skinTonesDisabled={true}
			  theme="dark"
			  emojiStyle="google"
			  searchDisabled={true}
            />
          </div>
        )}

        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          rows="1"
          maxLength={300}
          className="w-full p-2 bg-slate-700 rounded border border-slate-600 focus:outline-none"
        />
        <button
          onClick={sendMessage}
          className="bg-slate-700 text-white p-2 rounded hover:bg-slate-600 transition duration-300"
        >
          <MdOutlineSend className="text-2xl" />
        </button>
      </div>
    </main>
  );
};

export default Chat;
