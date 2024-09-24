"use client";

import React, { useState } from "react";
import { User, Send, Phone, Video, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/ScrollArea";

interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: string;
}

interface Contact {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  lastMessageTime: string;
}

const DmPage: React.FC = () => {
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [message, setMessage] = useState("");

  const contacts: Contact[] = [
    {
      id: "1",
      name: "Alice Johnson",
      avatar: "/placeholder.svg?height=40&width=40",
      lastMessage: "Hey, how are you?",
      lastMessageTime: "10:30 AM",
    },
    {
      id: "2",
      name: "Bob Smith",
      avatar: "/placeholder.svg?height=40&width=40",
      lastMessage: "Can we meet tomorrow?",
      lastMessageTime: "Yesterday",
    },
    {
      id: "3",
      name: "Charlie Brown",
      avatar: "/placeholder.svg?height=40&width=40",
      lastMessage: "Thanks for your help!",
      lastMessageTime: "Monday",
    },
    {
      id: "4",
      name: "Diana Prince",
      avatar: "/placeholder.svg?height=40&width=40",
      lastMessage: "I'm sorry, I can't do that.",
      lastMessageTime: "Today",
    },
    {
      id: "5",
      name: "Eve Adams",
      avatar: "/placeholder.svg?height=40&width=40",
      lastMessage: "What's the project deadline?",
      lastMessageTime: "Tomorrow",
    },
    {
      id: "6",
      name: "Fiona Green",
      avatar: "/placeholder.svg?height=40&width=40",
      lastMessage: "Can you send me the report?",
      lastMessageTime: "Yesterday",
    },
    {
      id: "7",
      name: "Grace White",
      avatar: "/placeholder.svg?height=40&width=40",
      lastMessage: "I'll send it to you later.",
      lastMessageTime: "Today",
    },
    {
      id: "8",
      name: "Hannah Lee",
      avatar: "/placeholder.svg?height=40&width=40",
      lastMessage: "I'm not sure about that.",
      lastMessageTime: "Yesterday",
    },
    {
      id: "9",
      name: "Ivy Moore",
      avatar: "/placeholder.svg?height=40&width=40",
      lastMessage: "I'm not sure about that.",
      lastMessageTime: "Yesterday",
    },
    {
      id: "10",
      name: "Jasmine Kim",
      avatar: "/placeholder.svg?height=40&width=40",
      lastMessage: "I'm not sure about that.",
      lastMessageTime: "Yesterday",
    },

    {
      id: "11",
      name: "Katherine Chen",
      avatar: "/placeholder.svg?height=40&width=40",
      lastMessage: "I'm not sure about that.",
      lastMessageTime: "Yesterday",
    },
    {
      id: "1",
      name: "Alice Johnson",
      avatar: "/placeholder.svg?height=40&width=40",
      lastMessage: "Hey, how are you?",
      lastMessageTime: "10:30 AM",
    },
    {
      id: "2",
      name: "Bob Smith",
      avatar: "/placeholder.svg?height=40&width=40",
      lastMessage: "Can we meet tomorrow?",
      lastMessageTime: "Yesterday",
    },
    {
      id: "3",
      name: "Charlie Brown",
      avatar: "/placeholder.svg?height=40&width=40",
      lastMessage: "Thanks for your help!",
      lastMessageTime: "Monday",
    },
    {
      id: "4",
      name: "Diana Prince",
      avatar: "/placeholder.svg?height=40&width=40",
      lastMessage: "I'm sorry, I can't do that.",
      lastMessageTime: "Today",
    },
    {
      id: "5",
      name: "Eve Adams",
      avatar: "/placeholder.svg?height=40&width=40",
      lastMessage: "What's the project deadline?",
      lastMessageTime: "Tomorrow",
    },
    {
      id: "6",
      name: "Fiona Green",
      avatar: "/placeholder.svg?height=40&width=40",
      lastMessage: "Can you send me the report?",
      lastMessageTime: "Yesterday",
    },
    {
      id: "7",
      name: "Grace White",
      avatar: "/placeholder.svg?height=40&width=40",
      lastMessage: "I'll send it to you later.",
      lastMessageTime: "Today",
    },
    {
      id: "8",
      name: "Hannah Lee",
      avatar: "/placeholder.svg?height=40&width=40",
      lastMessage: "I'm not sure about that.",
      lastMessageTime: "Yesterday",
    },
    {
      id: "9",
      name: "Ivy Moore",
      avatar: "/placeholder.svg?height=40&width=40",
      lastMessage: "I'm not sure about that.",
      lastMessageTime: "Yesterday",
    },
    {
      id: "10",
      name: "Jasmine Kim",
      avatar: "/placeholder.svg?height=40&width=40",
      lastMessage: "I'm not sure about that.",
      lastMessageTime: "Yesterday",
    },

    {
      id: "11",
      name: "Katherine Chen",
      avatar: "/placeholder.svg?height=40&width=40",
      lastMessage: "I'm not sure about that.",
      lastMessageTime: "Yesterday",
    },
  ];

  const messages: Message[] = [
    {
      id: "1",
      sender: "Alice Johnson",
      content: "Hey, how are you?",
      timestamp: "10:30 AM",
    },
    {
      id: "2",
      sender: "You",
      content: "I'm good, thanks! How about you?",
      timestamp: "10:32 AM",
    },
    {
      id: "3",
      sender: "Alice Johnson",
      content: "Doing well! Just wanted to check in.",
      timestamp: "10:33 AM",
    },
    {
      id: "1",
      sender: "Alice Johnson",
      content: "Hey, how are you?",
      timestamp: "10:30 AM",
    },
    {
      id: "2",
      sender: "You",
      content: "I'm good, thanks! How about you?",
      timestamp: "10:32 AM",
    },
    {
      id: "3",
      sender: "Alice Johnson",
      content: "Doing well! Just wanted to check in.",
      timestamp: "10:33 AM",
    },
    {
      id: "1",
      sender: "Alice Johnson",
      content: "Hey, how are you?",
      timestamp: "10:30 AM",
    },
    {
      id: "2",
      sender: "You",
      content: "I'm good, thanks! How about you?",
      timestamp: "10:32 AM",
    },
    {
      id: "3",
      sender: "Alice Johnson",
      content: "Doing well! Just wanted to check in.",
      timestamp: "10:33 AM",
    },
    {
      id: "1",
      sender: "Alice Johnson",
      content: "Hey, how are you?",
      timestamp: "10:30 AM",
    },
    {
      id: "2",
      sender: "You",
      content: "I'm good, thanks! How about you?",
      timestamp: "10:32 AM",
    },
    {
      id: "3",
      sender: "Alice Johnson",
      content: "Doing well! Just wanted to check in.",
      timestamp: "10:33 AM",
    },
    {
      id: "1",
      sender: "Alice Johnson",
      content: "Hey, how are you?",
      timestamp: "10:30 AM",
    },
    {
      id: "2",
      sender: "You",
      content: "I'm good, thanks! How about you?",
      timestamp: "10:32 AM",
    },
    {
      id: "3",
      sender: "Alice Johnson",
      content: "Doing well! Just wanted to check in.",
      timestamp: "10:33 AM",
    },
    {
      id: "1",
      sender: "Alice Johnson",
      content: "Hey, how are you?",
      timestamp: "10:30 AM",
    },
    {
      id: "2",
      sender: "You",
      content: "I'm good, thanks! How about you?",
      timestamp: "10:32 AM",
    },
    {
      id: "3",
      sender: "Alice Johnson",
      content: "Doing well! Just wanted to check in.",
      timestamp: "10:33 AM",
    },
    {
      id: "1",
      sender: "Alice Johnson",
      content: "Hey, how are you?",
      timestamp: "10:30 AM",
    },
    {
      id: "2",
      sender: "You",
      content: "I'm good, thanks! How about you?",
      timestamp: "10:32 AM",
    },
    {
      id: "3",
      sender: "Alice Johnson",
      content: "Doing well! Just wanted to check in.",
      timestamp: "10:33 AM",
    },
    {
      id: "1",
      sender: "Alice Johnson",
      content: "Hey, how are you?",
      timestamp: "10:30 AM",
    },
    {
      id: "2",
      sender: "You",
      content: "I'm good, thanks! How about you?",
      timestamp: "10:32 AM",
    },
    {
      id: "3",
      sender: "Alice Johnson",
      content: "Doing well! Just wanted to check in.",
      timestamp: "10:33 AM",
    },
    {
      id: "1",
      sender: "Alice Johnson",
      content: "Hey, how are you?",
      timestamp: "10:30 AM",
    },
    {
      id: "2",
      sender: "You",
      content: "I'm good, thanks! How about you?",
      timestamp: "10:32 AM",
    },
    {
      id: "3",
      sender: "Alice Johnson",
      content: "Doing well! Just wanted to check in.",
      timestamp: "10:33 AM",
    },
    {
      id: "1",
      sender: "Alice Johnson",
      content: "Hey, how are you?",
      timestamp: "10:30 AM",
    },
    {
      id: "2",
      sender: "You",
      content: "I'm good, thanks! How about you?",
      timestamp: "10:32 AM",
    },
    {
      id: "3",
      sender: "Alice Johnson",
      content: "Doing well! Just wanted to check in.",
      timestamp: "10:33 AM",
    },
    {
      id: "1",
      sender: "Alice Johnson",
      content: "Hey, how are you?",
      timestamp: "10:30 AM",
    },
    {
      id: "2",
      sender: "You",
      content: "I'm good, thanks! How about you?",
      timestamp: "10:32 AM",
    },
    {
      id: "3",
      sender: "Alice Johnson",
      content: "Doing well! Just wanted to check in.",
      timestamp: "10:33 AM",
    },
  ];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      // Here you would typically send the message to your backend
      console.log("Sending message:", message);
      setMessage("");
    }
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Contacts List */}
      <div className="w-1/4 border-r border-border">
        <div className="p-4 border-b border-border">
          <h2 className="text-lg font-semibold">Direct Messages</h2>
        </div>
        <ScrollArea className="h-[calc(100vh-5rem)]">
          {contacts.map((contact) => (
            <div
              key={contact.id}
              className={`flex items-center p-4 hover:bg-accent cursor-pointer ${
                selectedContact?.id === contact.id ? "bg-accent text-surface" : ""
              }`}
              onClick={() => setSelectedContact(contact)}
            >
              <img
                src={contact.avatar}
                alt={contact.name}
                className="w-10 h-10 rounded-full mr-3"
              />
              <div className="flex-1">
                <h3 className="font-medium">{contact.name}</h3>
                <p className="text-sm text-muted-foreground truncate">
                  {contact.lastMessage}
                </p>
              </div>
              <span className="text-xs text-muted-foreground">
                {contact.lastMessageTime}
              </span>
            </div>
          ))}
        </ScrollArea>
      </div>

      {/* Chat Window */}
      <div className="flex-1 flex flex-col">
        {selectedContact ? (
          <>
            {/* Chat Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div className="flex items-center">
                <img
                  src={selectedContact.avatar}
                  alt={selectedContact.name}
                  className="w-10 h-10 rounded-full mr-3"
                />
                <h2 className="text-lg font-semibold">
                  {selectedContact.name}
                </h2>
              </div>
              <div className="flex space-x-2">
                <Button variant="ghost" size="icon">
                  <Phone className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Video className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Info className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex mb-4 ${
                    msg.sender === "You" ? "justify-end" : ""
                  }`}
                >
                  <div
                    className={`max-w-[70%] p-3 rounded-lg ${
                      msg.sender === "You"
                        ? "bg-primary-500 text-primary-foreground"
                        : "bg-accent"
                    }`}
                  >
                    <p>{msg.content}</p>
                    <span className="text-xs opacity-50 mt-1 block">
                      {msg.timestamp}
                    </span>
                  </div>
                </div>
              ))}
            </ScrollArea>

            {/* Message Input */}
            <form
              onSubmit={handleSendMessage}
              className="p-4 border-t border-border"
            >
              <div className="flex space-x-2">
                <Input
                  type="text"
                  placeholder="Type a message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="flex-1"
                />
                <Button type="submit">
                  <Send className="h-5 w-5" />
                </Button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <User className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h2 className="text-xl font-semibold mb-2">
                Select a conversation
              </h2>
              <p className="text-muted-foreground">
                Choose a contact to start chatting
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DmPage;
