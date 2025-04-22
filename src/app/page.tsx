"use client";

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  Send,
  Camera,
  MoreHorizontal,
  Search,
  Filter,
  X,
  PlusCircle,
  Clock,
  MapPin,
  Thermometer,
  Droplets,
  Wind,
  Sunrise,
  Sunset,
  CloudRain,
  CloudSun,
  Cloudy,
  Flame,
  type LucideIcon,
} from "lucide-react"
import { Titillium_Web } from "next/font/google"

const titillium = Titillium_Web({
  subsets: ["latin"],
  weight: ["200", "300", "400", "600", "700", "900"],
  variable: "--font-titillium",
})

interface Plant {
  id: number
  name: string
  species: string
  age: number
  location: string
  temperature: number
  humidity: number
  light: number
  watered: boolean
  image: string
  notes: string
}

interface Post {
  id: number
  plantId: number
  userId: number
  type: "update" | "question" | "discovery"
  text: string
  image: string
  likes: number
  comments: number
  shares: number
  bookmarked: boolean
  createdAt: string
}

interface User {
  id: number
  name: string
  avatar: string
  bio: string
}

interface Comment {
  id: number
  postId: number
  userId: number
  text: string
  createdAt: string
}

interface Message {
  id: number
  senderId: number
  receiverId: number
  text: string
  createdAt: string
}

interface Notification {
  id: number
  userId: number
  type: "like" | "comment" | "follow"
  text: string
  createdAt: string
  read: boolean
}

interface WeatherData {
  temperature: number
  humidity: number
  precipitation: number
  windSpeed: number
  sunrise: string
  sunset: string
  condition: "sunny" | "cloudy" | "rainy" | "stormy"
}

interface GardeningTip {
  id: number
  title: string
  description: string
  plantType: string
  image: string
  createdAt: string
}

interface Challenge {
  id: number
  title: string
  description: string
  startDate: string
  endDate: string
  participants: number
  completed: number
  image: string
}

interface JournalEntry {
  id: number
  userId: number
  plantId: number
  date: string
  notes: string
  progressPhotos: string[]
}

interface Location {
  id: number
  name: string
  description: string
  latitude: number
  longitude: number
  plants: number
}

const plantData = [
  {
    id: 1,
    name: "Snake Plant",
    species: "Sansevieria Trifasciata",
    age: 2,
    location: "Living Room",
    temperature: 22,
    humidity: 60,
    light: 50,
    watered: true,
    image:
      "https://media.istockphoto.com/id/469396933/photo/snake-plant-sansevieria-trifasciata-on-white-pot-isolated-on-white-background.jpg?s=612x612&w=0&k=20&c=El6e3oF7JXwI3o9XoG0YJp8iX7-wK8N4cDgC3gXf4cA=",
    notes: "This plant is very low maintenance and perfect for indoor spaces.",
  },
  {
    id: 2,
    name: "Monstera",
    species: "Monstera Deliciosa",
    age: 1,
    location: "Bedroom",
    temperature: 20,
    humidity: 70,
    light: 40,
    watered: false,
    image:
      "https://hips.hearstapps.com/hmg-prod/images/monstera-deliciosa-royal-botanic-gardens-kew-royal-botanic-6675955a4da60.jpg?crop=0.927xw:0.694xh;0.0326xw,0.00733xh&resize=1200:*",
    notes: "Loves bright indirect light and regular watering.",
  },
  {
    id: 3,
    name: "ZZ Plant",
    species: "Zamioculcas Zamiifolia",
    age: 3,
    location: "Office",
    temperature: 25,
    humidity: 50,
    light: 30,
    watered: true,
    image:
      "https://cdn.shopify.com/s/files/1/0150/6262/products/the-sill_zz-plant_dark-purple_hero.jpg?v=1690306987",
    notes: "Extremely tolerant of neglect, perfect for busy people.",
  },
]

const postData = [
  {
    id: 1,
    plantId: 1,
    userId: 1,
    type: "update",
    text: "Just watered my snake plant! It's been two weeks since the last watering.",
    image:
      "https://media.istockphoto.com/id/469396933/photo/snake-plant-sansevieria-trifasciata-on-white-pot-isolated-on-white-background.jpg?s=612x612&w=0&k=20&c=El6e3oF7JXwI3o9XoG0YJp8iX7-wK8N4cDgC3gXf4cA=",
    likes: 12,
    comments: 3,
    shares: 2,
    bookmarked: true,
    createdAt: "2025-03-01T10:30:00Z",
  },
  {
    id: 2,
    plantId: 2,
    userId: 2,
    type: "question",
    text: "Has anyone experienced leaf drop with their Monstera? Mine is suddenly losing leaves and I'm worried I might be overwatering it. Any advice would be appreciated!",
    image:
      "https://hips.hearstapps.com/hmg-prod/images/monstera-deliciosa-royal-botanic-gardens-kew-royal-botanic-6675955a4da60.jpg?crop=0.927xw:0.694xh;0.0326xw,0.00733xh&resize=1200:*",
    likes: 8,
    comments: 2,
    shares: 1,
    bookmarked: false,
    createdAt: "2025-03-02T14:45:00Z",
  },
  {
    id: 3,
    plantId: 3,
    userId: 3,
    type: "discovery",
    text: "I just repotted my ZZ Plant into a new purple ceramic pot and I'm obsessed! The contrast of the dark leaves against the vibrant purple is stunning.",
    image:
      "https://cdn.shopify.com/s/files/1/0150/6262/products/the-sill_zz-plant_dark-purple_hero.jpg?v=1690306987",
    likes: 15,
    comments: 1,
    shares: 3,
    bookmarked: true,
    createdAt: "2025-03-03T09:15:00Z",
  },
]

const userData = [
  {
    id: 1,
    name: "Alex Green",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8cHJvZmlsZSUyMHBpY3R1cmV8ZW58MHx8MHx8fDA%3D",
    bio: "Plant enthusiast and interior design student. Loves tropical plants and cozy spaces.",
  },
  {
    id: 2,
    name: "Jordan Leaf",
    avatar:
      "https://plus.unsplash.com/premium_photo-1689977968861-9c91dbb16049?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cHJvZmlsZSUyMHBpY3R1cmV8ZW58MHx8MHx8fDA%3D",
    bio: "Botany graduate and professional gardener. Specializes in succulents and cacti.",
  },
  {
    id: 3,
    name: "Taylor Bloom",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8cHJvZmlsZSUyMHBpY3R1cmV8ZW58MHx8MHx8fDA%3D",
    bio: "Plant blogger and YouTube personality. Creating content about urban gardening and plant care.",
  },
]

const commentData = [
  {
    id: 1,
    postId: 1,
    userId: 1,
    text: "I usually water mine every 10 days and it looks great!",
    createdAt: "2025-03-01T11:15:00Z",
  },
  {
    id: 2,
    postId: 1,
    userId: 2,
    text: "You might want to check the soil moisture before watering again. Sometimes plants need less water during certain seasons.",
    createdAt: "2025-03-01T12:30:00Z",
  },
  {
    id: 3,
    postId: 1,
    userId: 3,
    text: "I have a similar plant! Mine is doing well with just a sprinkle of fertilizer every month.",
    createdAt: "2025-03-01T14:45:00Z",
  },
  {
    id: 4,
    postId: 2,
    userId: 1,
    text: "I had this problem last week! Turns out I was overwatering. Try letting the soil dry out completely between waterings.",
    createdAt: "2025-03-02T15:30:00Z",
  },
  {
    id: 5,
    postId: 2,
    userId: 3,
    text: "Also check for root rot! If the roots are rotting, it can cause leaf drop even after you fix the watering.",
    createdAt: "2025-03-02T16:45:00Z",
  },
  {
    id: 6,
    postId: 3,
    userId: 2,
    text: "That purple pot is gorgeous! Where did you find it?",
    createdAt: "2025-03-03T10:30:00Z",
  },
]

const messageData = [
  {
    id: 1,
    senderId: 1,
    receiverId: 2,
    text: "Hey Jordan, I loved your comment on my post! Could you help me with my Monstera?",
    createdAt: "2025-03-04T09:15:00Z",
  },
  {
    id: 2,
    senderId: 2,
    receiverId: 1,
    text: "Sure Alex, I'd be happy to help! What's going on with your Monstera?",
    createdAt: "2025-03-04T09:30:00Z",
  },
  {
    id: 3,
    senderId: 1,
    receiverId: 2,
    text: "It's just dropping leaves suddenly. I water it every week.",
    createdAt: "2025-03-04T09:45:00Z",
  },
  {
    id: 4,
    senderId: 2,
    receiverId: 1,
    text: "That could be the problem! Most Monsteras only need watering every 2-3 weeks. Let's take a look at a photo.",
    createdAt: "2025-03-04T10:00:00Z",
  },
  {
    id: 5,
    senderId: 1,
    receiverId: 3,
    text: "Hey Taylor, your Monstera looks amazing! Could you share some tips?",
    createdAt: "2025-03-05T14:30:00Z",
  },
  {
    id: 6,
    senderId: 3,
    receiverId: 1,
    text: "Sure thing! I actually have a whole video series on Monstera care. I'll send you the link.",
    createdAt: "2025-03-05T14:45:00Z",
  },
]

const notificationData = [
  {
    id: 1,
    userId: 1,
    type: "like",
    text: "Jordan liked your post about your snake plant.",
    createdAt: "2025-03-01T11:15:00Z",
    read: true,
  },
  {
    id: 2,
    userId: 1,
    type: "comment",
    text: "Taylor commented on your post about your snake plant.",
    createdAt: "2025-03-01T14:45:00Z",
    read: true,
  },
  {
    id: 3,
    userId: 2,
    type: "like",
    text: "Alex liked your post about your Monstera.",
    createdAt: "2025-03-02T15:30:00Z",
    read: true,
  },
  {
    id: 4,
    userId: 2,
    type: "comment",
    text: "Taylor commented on your post about your Monstera.",
    createdAt: "2025-03-02T16:45:00Z",
    read: false,
  },
  {
    id: 5,
    userId: 3,
    type: "like",
    text: "Alex liked your post about your ZZ Plant.",
    createdAt: "2025-03-03T10:30:00Z",
    read: true,
  },
  {
    id: 6,
    userId: 3,
    type: "follow",
    text: "Jordan started following you.",
    createdAt: "2025-03-03T11:15:00Z",
    read: false,
  },
]

const weatherData: WeatherData = {
  temperature: 22,
  humidity: 60,
  precipitation: 0,
  windSpeed: 5,
  sunrise: "06:30",
  sunset: "18:45",
  condition: "sunny",
}

const gardeningTipData = [
  {
    id: 1,
    title: "5 Tips for Growing Healthy Succulents",
    description:
      "Succulents are low-maintenance plants that can thrive in indoor spaces with proper care. Here are 5 tips to keep your succulents healthy and happy.",
    plantType: "Succulent",
    image:
      "https://hips.hearstapps.com/hmg-prod/images/succulent-plant-in-a-pot-on-a-white-background-royalty-free-image-1674753714.jpg?crop=0.447xw:0.670xh;0.267xw,0.330xh&resize=1200:*",
    createdAt: "2025-03-01T09:00:00Z",
  },
  {
    id: 2,
    title: "How to Propagate Pothos Plants",
    description:
      "Pothos plants are easy to propagate at home. Learn how to grow new plants from cuttings and expand your indoor garden.",
    plantType: "Pothos",
    image:
      "https://hips.hearstapps.com/hmg-prod/images/pothos-plant-in-a-basket-royalty-free-image-1693329526.jpg?crop=0.668xw:0.891xh;0.332xw,0&resize=1200:*",
    createdAt: "2025-03-02T10:00:00Z",
  },
  {
    id: 3,
    title: "Caring for Your Fiddle Leaf Fig",
    description:
      "Fiddle leaf figs are popular houseplants that require special care. Learn how to keep your fiddle leaf fig healthy and thriving.",
    plantType: "Fiddle Leaf Fig",
    image:
      "https://hips.hearstapps.com/hmg-prod/images/fiddle-leaf-fig-royalty-free-image-1701188427.jpg?crop=0.448xw:0.672xh;0.552xw,0.328xh&resize=1200:*",
    createdAt: "2025-03-03T11:00:00Z",
  },
]

const challengeData = [
  {
    id: 1,
    title: "Spring Planting Challenge",
    description:
      "Join our spring planting challenge and grow your indoor garden with our guided planting schedule and care tips.",
    startDate: "2025-03-15",
    endDate: "2025-05-15",
    participants: 25,
    completed: 5,
    image:
      "https://hips.hearstapps.com/hmg-prod/images/spring-garden-with-poppies-and-other-colorful-flowers-royalty-free-image-1681409865.jpg?crop=0.447xw:0.670xh;0.553xw,0&resize=1200:*",
  },
  {
    id: 2,
    title: "Succulent Survival Challenge",
    description:
      "Test your green thumb in our succulent survival challenge. Can you keep these hardy plants alive for 30 days?",
    startDate: "2025-03-10",
    endDate: "2025-04-10",
    participants: 42,
    completed: 12,
    image:
      "https://hips.hearstapps.com/hmg-prod/images/succulent-plant-in-a-pot-on-a-white-background-royalty-free-image-1674753714.jpg?crop=0.447xw:0.670xh;0.267xw,0.330xh&resize=1200:*",
  },
  {
    id: 3,
    title: "Herb Garden Challenge",
    description:
      "Grow your own herb garden and join our cooking challenges with fresh, home-grown ingredients.",
    startDate: "2025-04-01",
    endDate: "2025-06-01",
    participants: 18,
    completed: 3,
    image:
      "https://hips.hearstapps.com/hmg-prod/images/close-up-of-herbs-growing-in-a-garden-royalty-free-image-1694708752.jpg?crop=0.448xw:0.672xh;0.552xw,0.328xh&resize=1200:*",
  },
]

const journalEntryData = [
  {
    id: 1,
    userId: 1,
    plantId: 1,
    date: "2025-03-05",
    notes: "Watered my snake plant today. It's looking a bit droopy, so I gave it a good soaking. Fingers crossed it perks up soon!",
    progressPhotos: [
      "https://media.istockphoto.com/id/469396933/photo/snake-plant-sansevieria-trifasciata-on-white-pot-isolated-on-white-background.jpg?s=612x612&w=0&k=20&c=El6e3oF7JXwI3o9XoG0YJp8iX7-wK8N4cDgC3gXf4cA=",
      "https://media.istockphoto.com/id/638349734/photo/snake-plant-in-a-white-pot-on-isolated-white-background.jpg?s=612x612&w=0&k=20&c=HxIuIu3gq3Xg4cSjD95I7cP2r0M-2Y2QlqXxMFM3VZE=",
    ],
  },
  {
    id: 2,
    userId: 2,
    plantId: 2,
    date: "2025-03-07",
    notes: "My Monstera is getting too big for its pot! Time to repot it into something bigger.",
    progressPhotos: [
      "https://hips.hearstapps.com/hmg-prod/images/monstera-deliciosa-royal-botanic-gardens-kew-royal-botanic-6675955a4da60.jpg?crop=0.927xw:0.694xh;0.0326xw,0.00733xh&resize=1200:*",
      "https://media.istockphoto.com/id/2153993254/photo/monstera-deliciosa-in-a-white-pot-on-a-white-background.jpg?s=612x612&w=0&k=20&c=2p3XlcyRsxXvM0QZNiMEl2rM8Xbp8G1P3i3rWe3GRUw=",
    ],
  },
  {
    id: 3,
    userId: 3,
    plantId: 3,
    date: "2025-03-10",
    notes: "Just rotated my ZZ Plant to ensure even growth. It's still looking a bit pale, so I might need to adjust its position.",
    progressPhotos: [
      "https://cdn.shopify.com/s/files/1/0150/6262/products/the-sill_zz-plant_dark-purple_hero.jpg?v=1690306987",
      "https://media.istockphoto.com/id/638349734/photo/snake-plant-in-a-white-pot-on-isolated-white-background.jpg?s=612x612&w=0&k=20&c=HxIuIu3gq3Xg4cSjD95I7cP2r0M-2Y2QlqXxMFM3VZE=",
    ],
  },
]

const locationData = [
  {
    id: 1,
    name: "Central Park",
    description: "A large public park in Manhattan, New York City, featuring walking paths, gardens, and scenic landscapes.",
    latitude: 40.7859,
    longitude: -73.9654,
    plants: 15,
  },
  {
    id: 2,
    name: "Brooklyn Botanic Garden",
    description:
      "A 52-acre botanical garden in Brooklyn, New York City, featuring a diverse collection of plants from around the world.",
    latitude: 40.6673,
    longitude: -73.9632,
    plants: 12,
  },
  {
    id: 3,
    name: "High Line",
    description:
      "An elevated linear park built on a historic freight rail line on Manhattan's West Side, featuring public art installations and landscaped gardens.",
    latitude: 40.7478,
    longitude: -74.0045,
    plants: 10,
  },
]

const HomePage = () => {
  const [activeTab, setActiveTab] = useState<string>("home")
  const [mounted, setMounted] = useState<boolean>(false)
  const [showLocationModal, setShowLocationModal] = useState<boolean>(false)
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null)
  const [showPostModal, setShowPostModal] = useState<boolean>(false)
  const [showPlantModal, setShowPlantModal] = useState<boolean>(false)
  const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null)
  const [showUserModal, setShowUserModal] = useState<boolean>(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [showCommentSection, setShowCommentSection] = useState<boolean>(false)
  const [selectedPost, setSelectedPost] = useState<Post | null>(null)
  const [showNotifications, setShowNotifications] = useState<boolean>(false)
  const [showMessageModal, setShowMessageModal] = useState<boolean>(false)
  const [selectedRecipient, setSelectedRecipient] = useState<User | null>(null)
  const [showSearchResults, setShowSearchResults] = useState<boolean>(false)
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [searchResults, setSearchResults] = useState<{
    plants: Plant[]
    posts: Post[]
    users: User[]
  }>({ plants: [], posts: [], users: [] })
  const [showFilters, setShowFilters] = useState<boolean>(false)
  const [filters, setFilters] = useState<{
    plantType: string
    location: string
    dateRange: { from: string; to: string }
  }>({ plantType: "", location: "", dateRange: { from: "", to: "" } })
  const [currentUser, setCurrentUser] = useState<User>({
    id: 1,
    name: "Alex Green",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8cHJvZmlsZSUyMHBpY3R1cmV8ZW58MHx8MHx8fDA%3D",
    bio: "Plant enthusiast and interior design student. Loves tropical plants and cozy spaces.",
  })
  const [posts, setPosts] = useState<Post[]>(postData)
  const [plants, setPlants] = useState<Plant[]>(plantData)
  const [users, setUsers] = useState<User[]>(userData)
  const [comments, setComments] = useState<Comment[]>(commentData)
  const [messages, setMessages] = useState<Message[]>(messageData)
  const [notifications, setNotifications] = useState<Notification[]>(notificationData)
  const [gardeningTips, setGardeningTips] = useState<GardeningTip[]>(gardeningTipData)
  const [challenges, setChallenges] = useState<Challenge[]>(challengeData)
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>(journalEntryData)
  const [locations, setLocations] = useState<Location[]>(locationData)
  const [weather, setWeather] = useState<WeatherData>(weatherData)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Simulate API calls
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Initialize data from constants
        setPosts(postData)
        setPlants(plantData)
        setUsers(userData)
        setComments(commentData)
        setMessages(messageData)
        setNotifications(notificationData)
        setGardeningTips(gardeningTipData)
        setChallenges(challengeData)
        setJournalEntries(journalEntryData)
        setLocations(locationData)
        setWeather(weatherData)

        setMounted(true)
      } catch (error) {
        console.error("Error fetching data:", error)
      }
    }

    fetchData()
  }, [])

  const handleCreatePost = (post: Omit<Post, "id" | "createdAt">) => {
    const newPost: Post = {
      ...post,
      id: posts.length + 1,
      createdAt: new Date().toISOString(),
    }
    setPosts([newPost, ...posts])
  }

  const handleCreateComment = (comment: Omit<Comment, "id">) => {
    const newComment: Comment = {
      ...comment,
      id: comments.length + 1,
    }
    setComments([...comments, newComment])

    // Update post comments count
    setPosts(
      posts.map((post) =>
        post.id === comment.postId
          ? { ...post, comments: post.comments + 1 }
          : post,
      ),
    )
  }

  const handleSendMessage = (message: Omit<Message, "id" | "createdAt">) => {
    const newMessage: Message = {
      ...message,
      id: messages.length + 1,
      createdAt: new Date().toISOString(),
    }
    setMessages([...messages, newMessage])
  }

  const handleLikePost = (postId: number) => {
    setPosts(
      posts.map((post) =>
        post.id === postId ? { ...post, likes: post.likes + 1 } : post,
      ),
    )

    // Add notification for like
    const post = posts.find((p) => p.id === postId)
    if (post) {
      const newNotification: Notification = {
        id: notifications.length + 1,
        userId: post.userId,
        type: "like",
        text: `${currentUser.name} liked your post.`,
        createdAt: new Date().toISOString(),
        read: false,
      }
      setNotifications([newNotification, ...notifications])
    }
  }

  const handleBookmarkPost = (postId: number) => {
    setPosts(
      posts.map((post) =>
        post.id === postId ? { ...post, bookmarked: !post.bookmarked } : post,
      ),
    )
  }

  const handleFollowUser = (userId: number) => {
    // Add notification for follow
    const newNotification: Notification = {
      id: notifications.length + 1,
      userId,
      type: "follow",
      text: `${currentUser.name} started following you.`,
      createdAt: new Date().toISOString(),
      read: false,
    }
    setNotifications([newNotification, ...notifications])
  }

  const handleMarkAsRead = (notificationId: number) => {
    setNotifications(
      notifications.map((n) =>
        n.id === notificationId ? { ...n, read: true } : n,
      ),
    )
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query)

    if (query.trim()) {
      const results = {
        plants: plants.filter((p) =>
          p.name.toLowerCase().includes(query.toLowerCase()),
        ),
        posts: posts.filter((p) =>
          p.text.toLowerCase().includes(query.toLowerCase()),
        ),
        users: users.filter((u) =>
          u.name.toLowerCase().includes(query.toLowerCase()),
        ),
      }
      setSearchResults(results)
      setShowSearchResults(true)
    } else {
      setShowSearchResults(false)
    }
  }

  const clearSearch = () => {
    setSearchQuery("")
    setShowSearchResults(false)
  }

  const applyFilters = () => {
    let filtered = [...postData]

    if (filters.plantType) {
      filtered = filtered.filter((post) =>
        post.text.toLowerCase().includes(filters.plantType.toLowerCase()),
      )
    }

    if (filters.location) {
      filtered = filtered.filter((post) =>
        post.text.toLowerCase().includes(filters.location.toLowerCase()),
      )
    }

    if (filters.dateRange.from && filters.dateRange.to) {
      filtered = filtered.filter((post) => {
        const postDate = new Date(post.createdAt)
        const fromDate = new Date(filters.dateRange.from)
        const toDate = new Date(filters.dateRange.to)

        return postDate >= fromDate && postDate <= toDate
      })
    }

    setPosts(filtered)
    setShowFilters(false)
  }

  const clearFilters = () => {
    setFilters({
      plantType: "",
      location: "",
      dateRange: { from: "", to: "" },
    })
    setPosts(postData)
  }

  const renderMobileView = () => (
    <div className="flex flex-col h-screen bg-[#faf7f8]">
      {/* Header */}
      <header className="px-4 py-3 flex justify-between items-center bg-[#faf7f8] shadow-sm sticky top-0 z-10">
        <div className="flex items-center">
          <button
            onClick={() => setActiveTab("home")}
            className="text-[#4f5d2f] p-2 rounded-full bg-[#e2e9de] mr-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
          </button>
          <h1 className="text-2xl font-['Playfair_Display'] tracking-tight text-[#4f5d2f]">
            Plant Social
          </h1>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-full bg-[#e2e9de] text-[#4f5d2f] shadow-sm"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M10 2a6 6 0 00-6 6v3H7a1 1 0 100 2h1v3a1 1 0 11-2 0v-1H4a1 1 0 100-2h1V8a6 6 0 006-6zm4 14a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {notifications.filter((n) => !n.read).length > 0 && (
              <span className="absolute top-1 right-1 bg-[#c06162] text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                {notifications.filter((n) => !n.read).length}
              </span>
            )}
          </button>
          <button
            onClick={() => setShowMessageModal(!showMessageModal)}
            className="p-2 rounded-full bg-[#e2e9de] text-[#4f5d2f] shadow-sm"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
            </svg>
          </button>
          <button
            onClick={() => setShowPostModal(!showPostModal)}
            className="p-2 rounded-full bg-[#4f5d2f] text-white shadow-md"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </header>
     
   
  
  

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto pb-16">
          {/* Home Screen */}
          {activeTab === "home" && (
            <div>
              {/* Banner */}
              <div className="relative h-40 bg-gradient-to-br from-[#4f5d2f] to-[#7f8c72] overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <h2 className="text-2xl font-['Playfair_Display'] text-white drop-shadow-md">
                      Welcome back, {currentUser.name.split(" ")[0]}!
                    </h2>
                    <p className="text-[#e2e9de] mt-1">
                      Here's what's new in your garden today
                    </p>
                  </div>
                </div>
              </div>

              {/* Today's Tasks */}
              <div className="px-4 py-3 bg-white border-b">
                <h3 className="font-['Playfair_Display'] text-[#4f5d2f] mb-2">
                  Today's Tasks
                </h3>
                <div className="flex overflow-x-auto space-x-3">
                  {plants.map((plant) => (
                    <div
                      key={plant.id}
                      className="min-w-[120px] p-3 rounded-lg bg-[#faf7f8] border border-[#e2e9de] shadow-sm"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-['Playfair_Display'] text-[#4f5d2f]">
                          {plant.name}
                        </span>
                        <span className="text-xs text-[#7f8c72]">
                          {plant.watered ? "Watered" : "Needs water"}
                        </span>
                      </div>
                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-xs text-[#7f8c72]">
                          Temp: {plant.temperature}°C
                        </span>
                        <span className="text-xs text-[#7f8c72]">
                          Humidity: {plant.humidity}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Feed Section */}
              <div className="px-4 py-3">
                <h3 className="font-['Playfair_Display'] text-[#4f5d2f] mb-3">
                  Your Feed
                </h3>

                {/* Search and Filters */}
                <div className="mb-4 flex flex-col space-y-2">
                  <div className="relative">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => handleSearch(e.target.value)}
                      placeholder="Search plants, posts, and people..."
                      className="w-full p-2 pl-8 rounded-lg bg-[#faf7f8] border border-[#e2e9de] text-[#4f5d2f] shadow-sm focus:outline-none focus:ring-2 focus:ring-[#7f8c72] transition-all duration-200"
                    />
                    <div className="absolute left-2 top-2.5 text-[#7f8c72]">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    {showSearchResults && (
                      <div className="absolute right-2 top-2.5">
                        <button
                          onClick={clearSearch}
                          className="text-[#7f8c72] hover:text-[#4f5d2f] transition-colors duration-200"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Search Results Dropdown */}
                  {showSearchResults && (
                    <div className="bg-white border border-[#e2e9de] rounded-lg shadow-lg z-10 w-full">
                      {searchResults.plants.length > 0 ||
                      searchResults.posts.length > 0 ||
                      searchResults.users.length > 0 ? (
                        <>
                          {searchResults.plants.length > 0 && (
                            <div className="p-2 border-b border-[#e2e9de]">
                              <h4 className="text-xs uppercase tracking-wider text-[#7f8c72] mb-2">
                                Plants
                              </h4>
                              {searchResults.plants.map((plant) => (
                                <div
                                  key={plant.id}
                                  className="p-2 hover:bg-[#faf7f8] rounded-lg cursor-pointer"
                                  onClick={() => {
                                    setSelectedPlant(plant)
                                    setShowPlantModal(true)
                                    clearSearch()
                                  }}
                                >
                                  <div className="flex items-center">
                                    <div className="w-8 h-8 rounded-full bg-[#e2e9de] flex items-center justify-center mr-2">
                                      <img
                                        src={plant.image || "/placeholder.svg"}
                                        alt={plant.name}
                                        className="w-full h-full object-cover rounded-full"
                                      />
                                    </div>
                                    <span className="text-[#4f5d2f]">
                                      {plant.name}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                          {searchResults.posts.length > 0 && (
                            <div className="p-2 border-b border-[#e2e9de]">
                              <h4 className="text-xs uppercase tracking-wider text-[#7f8c72] mb-2">
                                Posts
                              </h4>
                              {searchResults.posts.map((post) => (
                                <div
                                  key={post.id}
                                  className="p-2 hover:bg-[#faf7f8] rounded-lg cursor-pointer"
                                  onClick={() => {
                                    setSelectedPost(post)
                                    setShowCommentSection(true)
                                    clearSearch()
                                  }}
                                >
                                  <div className="flex items-center">
                                    <div className="w-8 h-8 rounded-full bg-[#e2e9de] flex items-center justify-center mr-2">
                                      <img
                                        src={post.image || "/placeholder.svg"}
                                        alt={`Post by ${post.userId}`}
                                        className="w-full h-full object-cover rounded-full"
                                      />
                                    </div>
                                    <span className="text-[#4f5d2f]">
                                      Post by User ID: {post.userId}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                          {searchResults.users.length > 0 && (
                            <div className="p-2">
                              <h4 className="text-xs uppercase tracking-wider text-[#7f8c72] mb-2">
                                People
                              </h4>
                              {searchResults.users.map((user) => (
                                <div
                                  key={user.id}
                                  className="p-2 hover:bg-[#faf7f8] rounded-lg cursor-pointer"
                                  onClick={() => {
                                    setSelectedUser(user)
                                    setShowUserModal(true)
                                    clearSearch()
                                  }}
                                >
                                  <div className="flex items-center">
                                    <div className="w-8 h-8 rounded-full bg-[#e2e9de] flex items-center justify-center mr-2">
                                      <img
                                        src={user.avatar || "/placeholder.svg"}
                                        alt={user.name}
                                        className="w-full h-full object-cover rounded-full"
                                      />
                                    </div>
                                    <span className="text-[#4f5d2f]">
                                      {user.name}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="p-4 text-center text-[#7f8c72]">
                          No results found
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {posts.map((post) => (
                  <div
                    key={post.id}
                    className="mb-3 rounded-lg bg-white border border-[#e2e9de] shadow-sm overflow-hidden"
                  >
                    <div className="p-3 flex items-start justify-between">
                      <div className="flex items-start">
                        <img
                          src={
                            users.find((u) => u.id === post.userId)?.avatar ||
                            "/placeholder.svg"
                          }
                          alt={
                            users.find((u) => u.id === post.userId)?.name ||
                            "User"
                          }
                          className="w-8 h-8 rounded-full mr-2 object-cover"
                        />
                        <div>
                          <p className="text-sm font-['Playfair_Display'] text-[#4f5d2f]">
                            {
                              users.find((u) => u.id === post.userId)
                                ?.name.split(" ")[0]
                            }
                          </p>
                          <p className="text-xs text-[#7f8c72]">
                            {new Date(post.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <button className="text-[#7f8c72] hover:text-[#4f5d2f]">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                        </svg>
                      </button>
                    </div>
                    <img
                      src={post.image || "/placeholder.svg"}
                      alt={`Post by ${post.userId}`}
                      className="w-full h-40 object-cover"
                    />
                    <div className="p-3">
                      <p className="text-sm text-[#4f5d2f] mb-2">
                        {post.text}
                      </p>
                      <div className="flex justify-between items-center">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleLikePost(post.id)}
                            className="flex items-center space-x-1 bg-[#e2e9de] px-2 py-1 rounded-full text-[#4f5d2f] hover:bg-[#4f5d2f] hover:text-white transition-colors duration-200"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
                            </svg>
                            <span className="text-xs">{post.likes}</span>
                          </button>
                          <button
                            onClick={() => {
                              setSelectedPost(post)
                              setShowCommentSection(!showCommentSection)
                            }}
                            className="flex items-center space-x-1 bg-[#e2e9de] px-2 py-1 rounded-full text-[#4f5d2f] hover:bg-[#4f5d2f] hover:text-white transition-colors duration-200"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M18 13V5a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2h3l3 3 3-3h3a2 2 0 002-2zM5 7a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm1 3a1 1 0 100 2h3a1 1 0 100-2H6z"
                                clipRule="evenodd"
                              />
                            </svg>
                            <span className="text-xs">{post.comments}</span>
                          </button>
                          <button className="flex items-center space-x-1 bg-[#e2e9de] px-2 py-1 rounded-full text-[#4f5d2f] hover:bg-[#4f5d2f] hover:text-white transition-colors duration-200">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                            </svg>
                            <span className="text-xs">{post.shares}</span>
                          </button>
                        </div>
                        <button
                          onClick={() => handleBookmarkPost(post.id)}
                          className={`text-[#7f8c72] ${
                            post.bookmarked
                              ? "opacity-100"
                              : "opacity-40 hover:opacity-100"
                          }`}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                          </svg>
                        </button>
                      </div>

                      {/* Comments Section */}
                      {showCommentSection && selectedPost?.id === post.id && (
                        <div className="mt-3 bg-[#faf7f8] rounded-lg p-2">
                          <h4 className="text-sm font-['Playfair_Display'] text-[#4f5d2f] mb-2">
                            Comments
                          </h4>
                          <div className="space-y-2 mb-2 max-h-28 overflow-y-auto">
                            {comments
                              .filter((c) => c.postId === post.id)
                              .map((comment) => (
                                <div
                                  key={comment.id}
                                  className="flex items-start bg-white p-2 rounded-lg"
                                >
                                  <img
                                    src={
                                      users.find((u) => u.id === comment.userId)
                                        ?.avatar || "/placeholder.svg"
                                    }
                                    alt={
                                      users.find((u) => u.id === comment.userId)
                                        ?.name || "User"
                                    }
                                    className="w-6 h-6 rounded-full mr-2 object-cover"
                                  />
                                  <div>
                                    <p className="text-xs font-['Playfair_Display'] text-[#4f5d2f]">
                                      {
                                        users.find(
                                          (u) => u.id === comment.userId,
                                        )?.name.split(" ")[0]
                                      }
                                    </p>
                                    <p className="text-xs text-[#4f5d2f]">
                                      {comment.text}
                                    </p>
                                  </div>
                                </div>
                              ))}
                          </div>
                          <form
                            onSubmit={(e) => {
                              e.preventDefault()
                              const formData = new FormData(e.currentTarget)
                              const commentText = formData.get("comment")

                              if (commentText) {
                                handleCreateComment({
                                  postId: post.id,
                                  userId: currentUser.id,
                                  text: commentText as string,
                                })
                              }

                              e.currentTarget.reset()
                            }}
                            className="flex space-x-2"
                          >
                            <input
                              type="text"
                              name="comment"
                              placeholder="Add a comment..."
                              className="flex-1 p-2 bg-white border border-[#e2e9de] rounded-full text-[#4f5d2f] focus:outline-none focus:ring-2 focus:ring-[#7f8c72] transition-all duration-200"
                            />
                            <button
                              type="submit"
                              className="bg-[#4f5d2f] text-white p-2 rounded-full hover:bg-[#7f8c72] transition-colors duration-200"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                              </svg>
                            </button>
                          </form>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Garden Screen */}
          {activeTab === "garden" && (
            <div>
              {/* Banner */}
              <div className="relative h-40 bg-gradient-to-br from-[#4f5d2f] to-[#7f8c72] overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <h2 className="text-2xl font-['Playfair_Display'] text-white drop-shadow-md">
                      Your Garden
                    </h2>
                    <p className="text-[#e2e9de] mt-1">
                      Track your plant collection and monitor their health
                    </p>
                  </div>
                </div>
              </div>

              {/* Plant Collection */}
              <div className="px-4 py-3">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-['Playfair_Display'] text-[#4f5d2f]">
                    Your Plants
                  </h3>
                  <button
                    onClick={() => setShowPlantModal(!showPlantModal)}
                    className="bg-[#4f5d2f] text-white px-3 py-1 rounded-full hover:bg-[#7f8c72] transition-colors duration-200 flex items-center"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-1"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Add Plant
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {plants.map((plant) => (
                    <div
                      key={plant.id}
                      className="rounded-lg bg-white border border-[#e2e9de] shadow-sm overflow-hidden"
                    >
                      <img
                        src={plant.image || "/placeholder.svg"}
                        alt={plant.name}
                        className="w-full h-24 object-cover"
                      />
                      <div className="p-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-sm font-['Playfair_Display'] text-[#4f5d2f]">
                              {plant.name}
                            </p>
                            <p className="text-xs text-[#7f8c72]">
                              {plant.species}
                            </p>
                          </div>
                          <div className="flex space-x-1">
                            <span
                              className={`px-1.5 py-0.5 rounded-full text-xs font-['Playfair_Display'] ${
                                plant.watered
                                  ? "bg-[#e2e9de] text-[#4f5d2f]"
                                  : "bg-[#f8e2e2] text-[#c06162]"
                              }`}
                            >
                              {plant.watered ? "Watered" : "Needs water"}
                            </span>
                            <button className="text-[#7f8c72] hover:text-[#4f5d2f]">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                              </svg>
                            </button>
                          </div>
                        </div>
                        <div className="mt-2 flex items-center justify-between">
                          <div>
                            <p className="text-xs text-[#7f8c72]">
                              Temp: {plant.temperature}°C
                            </p>
                            <p className="text-xs text-[#7f8c72]">
                              Humidity: {plant.humidity}%
                            </p>
                          </div>
                          <button
                            onClick={() => {
                              setSelectedPlant(plant)
                              setShowPlantModal(true)
                            }}
                            className="text-[#4f5d2f] hover:text-[#7f8c72]"
                          >
                            View Details
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Community Screen */}
          {activeTab === "community" && (
            <div>
              {/* Banner */}
              <div className="relative h-40 bg-gradient-to-br from-[#4f5d2f] to-[#7f8c72] overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <h2 className="text-2xl font-['Playfair_Display'] text-white drop-shadow-md">
                      Community
                    </h2>
                    <p className="text-[#e2e9de] mt-1">
                      Connect with fellow plant enthusiasts
                    </p>
                  </div>
                </div>
              </div>

              {/* Featured Users */}
              <div className="px-4 py-3">
                <h3 className="font-['Playfair_Display'] text-[#4f5d2f] mb-3">
                  Featured Gardeners
                </h3>
                <div className="flex overflow-x-auto space-x-3">
                  {users.map((user) => (
                    <div
                      key={user.id}
                      className="min-w-[120px] p-3 rounded-lg bg-[#faf7f8] border border-[#e2e9de] shadow-sm"
                    >
                      <div className="flex flex-col items-center">
                        <img
                          src={user.avatar || "/placeholder.svg"}
                          alt={user.name}
                          className="w-12 h-12 rounded-full mb-2 object-cover"
                        />
                        <p className="text-sm font-['Playfair_Display'] text-[#4f5d2f]">
                          {user.name.split(" ")[0]}
                        </p>
                        <p className="text-xs text-[#7f8c72] mb-2">
                          {user.bio.substring(0, 20)}...
                        </p>
                        <button
                          onClick={() => {
                            setSelectedUser(user)
                            setShowUserModal(true)
                          }}
                          className="bg-[#4f5d2f] text-white px-2 py-1 rounded-full hover:bg-[#7f8c72] transition-colors duration-200 text-xs"
                        >
                          View Profile
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Gardening Challenges */}
              <div className="px-4 py-3 bg-white border-t border-b">
                <h3 className="font-['Playfair_Display'] text-[#4f5d2f] mb-3">
                  Gardening Challenges
                </h3>
                <div className="flex overflow-x-auto space-x-3">
                  {challenges.map((challenge) => (
                    <div
                      key={challenge.id}
                      className="min-w-[240px] p-3 rounded-lg bg-[#faf7f8] border border-[#e2e9de] shadow-sm"
                    >
                      <img
                        src={challenge.image || "/placeholder.svg"}
                        alt={challenge.title}
                        className="w-full h-16 object-cover rounded mb-2"
                      />
                      <h4 className="text-sm font-['Playfair_Display'] text-[#4f5d2f]">
                        {challenge.title}
                      </h4>
                      <p className="text-xs text-[#7f8c72] mb-2">
                        {challenge.description.substring(0, 60)}...
                      </p>
                      <div className="flex justify-between items-center">
                        <span className="text-xs bg-[#e2e9de] text-[#4f5d2f] px-2 py-1 rounded-full">
                          {challenge.participants} participants
                        </span>
                        <button className="text-[#4f5d2f] hover:text-[#7f8c72] text-xs">
                          Join Challenge
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Gardening Tips */}
              <div className="px-4 py-3">
                <h3 className="font-['Playfair_Display'] text-[#4f5d2f] mb-3">
                  Gardening Tips
                </h3>
                <div className="flex overflow-x-auto space-x-3">
                  {gardeningTips.map((tip) => (
                    <div
                      key={tip.id}
                      className="min-w-[240px] p-3 rounded-lg bg-[#faf7f8] border border-[#e2e9de] shadow-sm"
                    >
                      <img
                        src={tip.image || "/placeholder.svg"}
                        alt={tip.title}
                        className="w-full h-16 object-cover rounded mb-2"
                      />
                      <h4 className="text-sm font-['Playfair_Display'] text-[#4f5d2f]">
                        {tip.title}
                      </h4>
                      <p className="text-xs text-[#7f8c72] mb-2">
                        {tip.description.substring(0, 60)}...
                      </p>
                      <button className="text-[#4f5d2f] hover:text-[#7f8c72] text-xs">
                        Read More
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Profile Screen */}
          {activeTab === "profile" && (
            <div>
              {/* Banner */}
              <div className="relative h-40 bg-gradient-to-br from-[#4f5d2f] to-[#7f8c72] overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <h2 className="text-2xl font-['Playfair_Display'] text-white drop-shadow-md">
                      Your Profile
                    </h2>
                    <p className="text-[#e2e9de] mt-1">
                      Manage your account and preferences
                    </p>
                  </div>
                </div>
              </div>

              {/* User Profile Card */}
              <div className="px-4 py-3">
                <div className="rounded-lg bg-white border border-[#e2e9de] shadow-sm overflow-hidden">
                  <div className="flex flex-col items-center p-4">
                    <img
                      src={currentUser.avatar || "/placeholder.svg"}
                      alt={currentUser.name}
                      className="w-20 h-20 rounded-full mb-3 object-cover"
                    />
                    <h3 className="text-xl font-['Playfair_Display'] text-[#4f5d2f]">
                      {currentUser.name}
                    </h3>
                    <p className="text-sm text-[#7f8c72] mb-3">
                      {currentUser.bio}
                    </p>
                    <div className="flex space-x-3">
                      <button
                        onClick={() => setShowUserModal(true)}
                        className="bg-[#4f5d2f] text-white px-3 py-1 rounded-full hover:bg-[#7f8c72] transition-colors duration-200"
                      >
                        Edit Profile
                      </button>
                      <button className="bg-[#e2e9de] text-[#4f5d2f] px-3 py-1 rounded-full hover:bg-[#7f8c72] hover:text-white transition-colors duration-200">
                        Share Profile
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats Section */}
              <div className="px-4 py-3">
                <div className="rounded-lg bg-white border border-[#e2e9de] shadow-sm overflow-hidden">
                  <div className="p-4 flex justify-between">
                    <div className="flex flex-col items-center">
                      <p className="text-sm font-['Playfair_Display'] text-[#4f5d2f]">
                        Plants
                      </p>
                      <p className="text-lg font-['Playfair_Display'] text-[#4f5d2f]">
                        {plants.length}
                      </p>
                    </div>
                    <div className="flex flex-col items-center">
                      <p className="text-sm font-['Playfair_Display'] text-[#4f5d2f]">
                        Followers
                      </p>
                      <p className="text-lg font-['Playfair_Display'] text-[#4f5d2f]">
                        245
                      </p>
                    </div>
                    <div className="flex flex-col items-center">
                      <p className="text-sm font-['Playfair_Display'] text-[#4f5d2f]">
                        Following
                      </p>
                      <p className="text-lg font-['Playfair_Display'] text-[#4f5d2f]">
                        180
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Journal Entries */}
              <div className="px-4 py-3">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-['Playfair_Display'] text-[#4f5d2f]">
                    Journal Entries
                  </h3>
                  <button className="text-[#4f5d2f] hover:text-[#7f8c72]">
                    View All
                  </button>
                </div>
                <div className="space-y-3">
                  {journalEntries
                    .filter((j) => j.userId === currentUser.id)
                    .map((entry) => (
                      <div
                        key={entry.id}
                        className="rounded-lg bg-[#faf7f8] border border-[#e2e9de] shadow-sm overflow-hidden"
                      >
                        <div className="p-3">
                          <div className="flex justify-between items-start mb-2">
                            <p className="text-sm font-['Playfair_Display'] text-[#4f5d2f]">
                              {new Date(entry.date).toLocaleDateString()}
                            </p>
                            <button className="text-[#7f8c72] hover:text-[#4f5d2f]">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                              </svg>
                            </button>
                          </div>
                          <p className="text-sm text-[#4f5d2f] mb-2">
                            {entry.notes}
                          </p>
                          {entry.progressPhotos.length > 0 && (
                            <div className="flex overflow-x-auto space-x-2">
                              {entry.progressPhotos.map((photo, index) => (
                                <img
                                  key={index}
                                  src={photo || "/placeholder.svg"}
                                  alt={`Journal entry photo ${index + 1}`}
                                  className="h-16 w-16 object-cover rounded"
                                />
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}
        </main>

        {/* Mobile Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#e2e9de] flex justify-around items-center py-2 z-10">
          <button
            onClick={() => setActiveTab("home")}
            className={`flex flex-col items-center ${
              activeTab === "home" ? "text-[#4f5d2f]" : "text-[#7f8c72]"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
            <span className="text-xs mt-1">Home</span>
          </button>
          <button
            onClick={() => setActiveTab("garden")}
            className={`flex flex-col items-center ${
              activeTab === "garden" ? "text-[#4f5d2f]" : "text-[#7f8c72]"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M7.5 2a.5.5 0 01.5.5v4.5a.5.5 0 01-1 0V2.5a.5.5 0 01.5-.5zM3 5a.5.5 0 01.5-.5h4.5a.5.5 0 010 1H3.5a.5.5 0 01-.5-.5zM7.5 8a.5.5 0 01.5-.5h4.5a.5.5 0 010 1H8a.5.5 0 01-.5-.5zM12 5a.5.5 0 01.5-.5h4.5a.5.5 0 010 1H12.5a.5.5 0 01-.5-.5zm-.5 3a.5.5 0 01.5-.5h4.5a.5.5 0 010 1h-4.5a.5.5 0 01-.5-.5z" />
              <path
                fillRule="evenodd"
                d="M1.5 4A1.5 1.5 0 003 2.5h14A1.5 1.5 0 0018.5 4v12a1.5 1.5 0 01-1.5 1.5h-14A1.5 1.5 0 011.5 16V4zm14 4V6H3v2h12zm1 3v2H2v-2h14zm-4 0v2H6v-2h6z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-xs mt-1">Garden</span>
          </button>
          <button
            onClick={() => setActiveTab("community")}
            className={`flex flex-col items-center ${
              activeTab === "community" ? "text-[#4f5d2f]" : "text-[#7f8c72]"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M8 5a1 1 0 100-2 1 1 0 000 2zM3 8a5 5 0 1110 0V4a1 1 0 10-2 0v4a3 3 0 11-6 0V4a1 1 0 10-2 0v4zm9 3a1 1 0 10-2 0v7a1 1 0 102 0v-7zM8 17a1 1 0 110-2 1 1 0 010 2z" />
            </svg>
            <span className="text-xs mt-1">Community</span>
          </button>
          <button
            onClick={() => setActiveTab("profile")}
            className={`flex flex-col items-center ${
              activeTab === "profile" ? "text-[#4f5d2f]" : "text-[#7f8c72]"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-xs mt-1">Profile</span>
          </button>
        </div>

        {/* Modals */}
        {showPostModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 relative border border-[#e2e9de]">
              <button
                onClick={() => setShowPostModal(false)}
                className="absolute top-4 right-4 text-[#7f8c72] hover:text-[#4f5d2f] transition-colors duration-200"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
              <h2 className="text-xl font-['Playfair_Display'] text-[#4f5d2f] mb-4">
                Create New Post
              </h2>
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  const formData = new FormData(e.currentTarget)
                  const postText = formData.get("postText")
                  const postImage = formData.get("postImage")

                  if (postText || postImage) {
                    handleCreatePost({
                      plantId: 1,
                      userId: currentUser.id,
                      type: "update",
                      text: postText as string,
                      image: postImage as string,
                      likes: 0,
                      comments: 0,
                      shares: 0,
                      bookmarked: false,
                    })
                  }

                  setShowPostModal(false)
                  e.currentTarget.reset()
                }}
              >
                <div className="mb-4">
                  <label
                    htmlFor="postText"
                    className="block text-sm text-[#7f8c72] mb-2"
                  >
                    Share your gardening journey...
                  </label>
                  <textarea
                    id="postText"
                    name="postText"
                    rows={3}
                    className="w-full p-3 bg-[#faf7f8] border border-[#e2e9de] rounded-lg text-[#4f5d2f] focus:outline-none focus:ring-2 focus:ring-[#7f8c72] transition-all duration-200"
                    placeholder="What's new in your garden today?"
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="postImage"
                    className="block text-sm text-[#7f8c72] mb-2"
                  >
                    Add a photo
                  </label>
                  <input
                    type="file"
                    id="postImage"
                    name="postImage"
                    accept="image/*"
                    className="w-full p-2 bg-[#faf7f8] border border-[#e2e9de] rounded-lg text-[#4f5d2f] focus:outline-none focus:ring-2 focus:ring-[#7f8c72] transition-all duration-200"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-[#4f5d2f] text-white py-2 px-4 rounded-full hover:bg-[#7f8c72] transition-colors duration-200 flex items-center justify-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                  </svg>
                  Share Post
                </button>
              </form>
            </div>
          </div>
        )}

        {showPlantModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 relative border border-[#e2e9de]">
              <button
                onClick={() => setShowPlantModal(false)}
                className="absolute top-4 right-4 text-[#7f8c72] hover:text-[#4f5d2f] transition-colors duration-200"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
              <h2 className="text-xl font-['Playfair_Display'] text-[#4f5d2f] mb-4">
                {selectedPlant ? "Edit Plant" : "Add New Plant"}
              </h2>
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  const formData = new FormData(e.currentTarget)
                  const plantName = formData.get("plantName")
                  const plantSpecies = formData.get("plantSpecies")
                  const plantLocation = formData.get("plantLocation")

                  if (plantName && plantSpecies && plantLocation) {
                    if (selectedPlant) {
                      // Update existing plant
                      setPlants(
                        plants.map((p) =>
                          p.id === selectedPlant.id
                            ? {
                                ...p,
                                name: plantName as string,
                                species: plantSpecies as string,
                                location: plantLocation as string,
                              }
                            : p,
                        ),
                      )
                    } else {
                      // Add new plant
                      const newPlant: Plant = {
                        id: plants.length + 1,
                        name: plantName as string,
                        species: plantSpecies as string,
                        location: plantLocation as string,
                        temperature: 22,
                        humidity: 60,
                        light: 50,
                        watered: false,
                        image:
                          "https://hips.hearstapps.com/hmg-prod/images/flower-plant-in-a-pot-on-a-white-background-royalty-free-image-1674753714.jpg?crop=0.447xw:0.670xh;0.267xw,0.330xh&resize=1200:*",
                        notes: "",
                      }
                      setPlants([...plants, newPlant])
                    }
                  }

                  setShowPlantModal(false)
                  setSelectedPlant(null)
                  e.currentTarget.reset()
                }}
              >
                <div className="mb-4">
                  <label
                    htmlFor="plantName"
                    className="block text-sm text-[#7f8c72] mb-2"
                  >
                    Plant Name
                  </label>
                  <input
                    type="text"
                    id="plantName"
                    name="plantName"
                    defaultValue={selectedPlant?.name}
                    className="w-full p-3 bg-[#faf7f8] border border-[#e2e9de] rounded-lg text-[#4f5d2f] focus:outline-none focus:ring-2 focus:ring-[#7f8c72] transition-all duration-200"
                    placeholder="Enter plant name"
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="plantSpecies"
                    className="block text-sm text-[#7f8c72] mb-2"
                  >
                    Species
                  </label>
                  <input
                    type="text"
                    id="plantSpecies"
                    name="plantSpecies"
                    defaultValue={selectedPlant?.species}
                    className="w-full p-3 bg-[#faf7f8] border border-[#e2e9de] rounded-lg text-[#4f5d2f] focus:outline-none focus:ring-2 focus:ring-[#7f8c72] transition-all duration-200"
                    placeholder="Enter plant species"
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="plantLocation"
                    className="block text-sm text-[#7f8c72] mb-2"
                  >
                    Location
                  </label>
                  <input
                    type="text"
                    id="plantLocation"
                    name="plantLocation"
                    defaultValue={selectedPlant?.location}
                    className="w-full p-3 bg-[#faf7f8] border border-[#e2e9de] rounded-lg text-[#4f5d2f] focus:outline-none focus:ring-2 focus:ring-[#7f8c72] transition-all duration-200"
                    placeholder="Where is this plant located?"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-[#4f5d2f] text-white py-2 px-4 rounded-full hover:bg-[#7f8c72] transition-colors duration-200 flex items-center justify-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {selectedPlant ? "Save Changes" : "Add Plant"}
                </button>
              </form>
            </div>
          </div>
        )}

        {showUserModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 relative border border-[#e2e9de]">
              <button
                onClick={() => setShowUserModal(false)}
                className="absolute top-4 right-4 text-[#7f8c72] hover:text-[#4f5d2f] transition-colors duration-200"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
              <h2 className="text-xl font-['Playfair_Display'] text-[#4f5d2f] mb-4">
                {selectedUser ? "User Profile" : "Edit Profile"}
              </h2>
              <div className="flex flex-col items-center">
                <img
                  src={selectedUser?.avatar || currentUser.avatar}
                  alt={selectedUser?.name || currentUser.name}
                  className="w-20 h-20 rounded-full mb-3 object-cover"
                />
                <h3 className="text-lg font-['Playfair_Display'] text-[#4f5d2f]">
                  {selectedUser?.name || currentUser.name}
                </h3>
                <p className="text-sm text-[#7f8c72] mb-4">
                  {selectedUser?.bio || currentUser.bio}
                </p>

                {selectedUser && selectedUser.id !== currentUser.id && (
                  <button
                    onClick={() => {
                      handleFollowUser(selectedUser.id)
                      setShowUserModal(false)
                    }}
                    className="bg-[#4f5d2f] text-white px-4 py-2 rounded-full hover:bg-[#7f8c72] transition-colors duration-200"
                  >
                    Follow
                  </button>
                )}

                {(!selectedUser || selectedUser.id === currentUser.id) && (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault()
                      const formData = new FormData(e.currentTarget)
                      const userName = formData.get("userName")
                      const userBio = formData.get("userBio")

                      if (userName && userBio) {
                        setCurrentUser({
                          ...currentUser,
                          name: userName as string,
                          bio: userBio as string,
                        })
                      }

                      setShowUserModal(false)
                      e.currentTarget.reset()
                    }}
                    className="w-full mt-4"
                  >
                    <div className="mb-4">
                      <label
                        htmlFor="userName"
                        className="block text-sm text-[#7f8c72] mb-2"
                      >
                        Name
                      </label>
                      <input
                        type="text"
                        id="userName"
                        name="userName"
                        defaultValue={currentUser.name}
                        className="w-full p-3 bg-[#faf7f8] border border-[#e2e9de] rounded-lg text-[#4f5d2f] focus:outline-none focus:ring-2 focus:ring-[#7f8c72] transition-all duration-200"
                        placeholder="Enter your name"
                      />
                    </div>
                    <div className="mb-4">
                      <label
                        htmlFor="userBio"
                        className="block text-sm text-[#7f8c72] mb-2"
                      >
                        Bio
                      </label>
                      <textarea
                        id="userBio"
                        name="userBio"
                        rows={3}
                        defaultValue={currentUser.bio}
                        className="w-full p-3 bg-[#faf7f8] border border-[#e2e9de] rounded-lg text-[#4f5d2f] focus:outline-none focus:ring-2 focus:ring-[#7f8c72] transition-all duration-200"
                        placeholder="Tell us about yourself"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full bg-[#4f5d2f] text-white py-2 px-4 rounded-full hover:bg-[#7f8c72] transition-colors duration-200 flex items-center justify-center"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-2"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Save Changes
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        )}

        {showMessageModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 relative border border-[#e2e9de]">
              <button
                onClick={() => setShowMessageModal(false)}
                className="absolute top-4 right-4 text-[#7f8c72] hover:text-[#4f5d2f] transition-colors duration-200"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
              <h2 className="text-xl font-['Playfair_Display'] text-[#4f5d2f] mb-4">
                Messages
              </h2>

              {/* Recipient Selection */}
              {!selectedRecipient && (
                <div className="mb-4">
                  <label
                    htmlFor="recipient"
                    className="block text-sm text-[#7f8c72] mb-2"
                  >
                    Select Recipient
                  </label>
                  <div className="bg-[#faf7f8] rounded-lg p-2">
                    {users
                      .filter((u) => u.id !== currentUser.id)
                      .map((user) => (
                        <div
                          key={user.id}
                          className="flex items-center p-2 hover:bg-[#e2e9de] rounded-lg cursor-pointer"
                          onClick={() => setSelectedRecipient(user)}
                        >
                          <img
                            src={user.avatar || "/placeholder.svg"}
                            alt={user.name}
                            className="w-8 h-8 rounded-full mr-2 object-cover"
                          />
                          <span className="text-[#4f5d2f]">{user.name}</span>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* Chat Interface */}
              {selectedRecipient && (
                <div>
                  <div className="flex items-center mb-4 bg-[#e2e9de] p-2 rounded-lg">
                    <button
                      onClick={() => setSelectedRecipient(null)}
                      className="text-[#7f8c72] hover:text-[#4f5d2f] mr-2"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                    <img
                      src={selectedRecipient.avatar || "/placeholder.svg"}
                      alt={selectedRecipient.name}
                      className="w-8 h-8 rounded-full mr-2 object-cover"
                    />
                    <span className="text-[#4f5d2f]">
                      {selectedRecipient.name}
                    </span>
                  </div>

                  {/* Messages Area */}
                  <div className="max-h-64 overflow-y-auto space-y-2 mb-4">
                    {messages
                      .filter(
                        (m) =>
                          (m.senderId === currentUser.id &&
                            m.receiverId === selectedRecipient.id) ||
                          (m.senderId === selectedRecipient.id &&
                            m.receiverId === currentUser.id),
                      )
                      .map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${
                            message.senderId === currentUser.id
                              ? "justify-end"
                              : "justify-start"
                          }`}
                        >
                          <div
                            className={`p-2 rounded-lg max-w-xs ${
                              message.senderId === currentUser.id
                                ? "bg-[#4f5d2f] text-white"
                                : "bg-[#e2e9de] text-[#4f5d2f]"
                            }`}
                          >
                            <p className="text-sm">{message.text}</p>
                            <p className="text-xs mt-1 opacity-70">
                              {new Date(message.createdAt).toLocaleTimeString(
                                [],
                                {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                },
                              )}
                            </p>
                          </div>
                        </div>
                      ))}
                  </div>

                  {/* Message Input */}
                  <form
                    onSubmit={(e) => {
                      e.preventDefault()
                      const formData = new FormData(e.currentTarget)
                      const messageText = formData.get("messageText")

                      if (messageText) {
                        handleSendMessage({
                          senderId: currentUser.id,
                          receiverId: selectedRecipient.id,
                          text: messageText as string,
                        })
                      }

                      e.currentTarget.reset()
                    }}
                    className="flex space-x-2"
                  >
                    <input
                      type="text"
                      name="messageText"
                      placeholder="Type a message..."
                      className="flex-1 p-2 bg-[#faf7f8] border border-[#e2e9de] rounded-full text-[#4f5d2f] focus:outline-none focus:ring-2 focus:ring-[#7f8c72] transition-all duration-200"
                    />
                    <button
                      type="submit"
                      className="bg-[#4f5d2f] text-white p-2 rounded-full hover:bg-[#7f8c72] transition-colors duration-200"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                      </svg>
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        )}

        {showNotifications && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 relative border border-[#e2e9de]">
              <button
                onClick={() => setShowNotifications(false)}
                className="absolute top-4 right-4 text-[#7f8c72] hover:text-[#4f5d2f] transition-colors duration-200"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
              <h2 className="text-xl font-['Playfair_Display'] text-[#4f5d2f] mb-4">
                Notifications
              </h2>
              <div className="max-h-96 overflow-y-auto space-y-3">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`flex items-start p-3 rounded-lg ${
                      notification.read
                        ? "bg-[#faf7f8]"
                        : "bg-[#e2e9de] border border-[#4f5d2f]"
                    }`}
                  >
                    <div
                      className={`w-2 h-2 rounded-full ${
                        notification.read ? "bg-[#7f8c72]" : "bg-[#4f5d2f]"
                      } mr-2 mt-1`}
                    ></div>
                    <div>
                      <p className="text-sm text-[#4f5d2f]">
                        {notification.text}
                      </p>
                      <p className="text-xs mt-1 text-[#7f8c72]">
                        {new Date(notification.createdAt).toLocaleDateString(
                          [],
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          },
                        )}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {showLocationModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 relative border border-[#e2e9de]">
              <button
                onClick={() => setShowLocationModal(false)}
                className="absolute top-4 right-4 text-[#7f8c72] hover:text-[#4f5d2f] transition-colors duration-200"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
              <h2 className="text-xl font-['Playfair_Display'] text-[#4f5d2f] mb-4">
                Nearby Gardens
              </h2>
              <div className="max-h-96 overflow-y-auto space-y-3">
                {locations.map((location) => (
                  <div
                    key={location.id}
                    className="flex items-start p-3 rounded-lg bg-[#faf7f8] border border-[#e2e9de]"
                  >
                    <div className="mr-3">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-[#4f5d2f]"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-sm font-['Playfair_Display'] text-[#4f5d2f]">
                        {location.name}
                        </h4>
                      <p className="text-xs text-[#7f8c72] mb-2">
                        {location.description}
                      </p>
                      <div className="flex items-center">
                        <span className="text-xs bg-[#e2e9de] text-[#4f5d2f] px-2 py-1 rounded-full">
                          {location.plants} plants
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
  )
      return renderMobileView()
    }




// Zod Schema
export const Schema = {
    "commentary": "This is a relaxing gardening social app, a cozy place for plant lovers.",
    "template": "nextjs-developer",
    "title": "Gardening App",
    "description": "A relaxing gardening social app for plant lovers.",
    "additional_dependencies": [
        "lucide-react",
        "framer-motion"
    ],
    "has_additional_dependencies": true,
    "install_dependencies_command": "npm install lucide-react framer-motion",
    "port": 3000,
    "file_path": "app/page.tsx",
    "code": "<see code above>"
}
export default HomePage
