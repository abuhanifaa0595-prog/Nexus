import React from 'react';
import { AppId, AppConfig } from './types';
import { 
  Bot, 
  Search, 
  FileText, 
  Settings, 
  Folder, 
  Calculator,
  Globe,
  ShoppingBag,
  Terminal,
  Palette,
  Camera,
  Music,
  Twitter,
  MessageSquare,
  Video,
  Chrome,
  PlayCircle,
  Image as ImageIcon,
  Briefcase,
  Play,
  Package,
  Crosshair,
  Code,
  Smartphone
} from 'lucide-react';

// Lazy Load Apps to prevent circular dependency with OSContext
const GeminiChatApp = React.lazy(() => import('./components/apps/GeminiChatApp'));
const SearchApp = React.lazy(() => import('./components/apps/SearchApp'));
const NotepadApp = React.lazy(() => import('./components/apps/NotepadApp'));
const SettingsApp = React.lazy(() => import('./components/apps/SettingsApp'));
const FileExplorerApp = React.lazy(() => import('./components/apps/FileExplorerApp'));
const CalculatorApp = React.lazy(() => import('./components/apps/CalculatorApp'));
const BrowserApp = React.lazy(() => import('./components/apps/BrowserApp'));
const ChromeApp = React.lazy(() => import('./components/apps/ChromeApp'));
const AppMarket = React.lazy(() => import('./components/apps/AppMarket'));
const TerminalApp = React.lazy(() => import('./components/apps/TerminalApp'));
const PhotoEditorApp = React.lazy(() => import('./components/apps/PhotoEditorApp'));
const MediaPlayerApp = React.lazy(() => import('./components/apps/MediaPlayerApp'));
const ImageViewerApp = React.lazy(() => import('./components/apps/ImageViewerApp'));
const NexusOfficeApp = React.lazy(() => import('./components/apps/NexusOfficeApp'));
const PlayStoreApp = React.lazy(() => import('./components/apps/PlayStoreApp'));
const ApkInstallerApp = React.lazy(() => import('./components/apps/ApkInstallerApp'));
const BattleRoyaleApp = React.lazy(() => import('./components/apps/BattleRoyaleApp'));
const VSCodeApp = React.lazy(() => import('./components/apps/VSCodeApp'));
const GenericApp = React.lazy(() => import('./components/apps/GenericApp'));

// Native Clones
const InstagramApp = React.lazy(() => import('./components/apps/InstagramApp'));
const SpotifyApp = React.lazy(() => import('./components/apps/SpotifyApp'));
const TikTokApp = React.lazy(() => import('./components/apps/TikTokApp'));
const TwitterApp = React.lazy(() => import('./components/apps/TwitterApp'));
const DiscordApp = React.lazy(() => import('./components/apps/DiscordApp'));

// --- STORE APP GENERATION ---
const createStoreApp = (id: string, title: string, category: AppConfig['category'], color: string, iconUrl?: string): AppConfig => ({
  id,
  title,
  icon: iconUrl || Smartphone,
  defaultWidth: 400,
  defaultHeight: 700, // Mobile aspect ratio
  component: GenericApp,
  description: `Official ${title} application for NexusOS.`,
  category,
  storageSize: Math.floor(Math.random() * 200) + 50,
  memoryUsage: Math.floor(Math.random() * 300) + 100,
  themeColor: color
});

const STORE_APPS: AppConfig[] = [
  // Social
  createStoreApp('facebook', 'Facebook', 'Social', '#1877F2', 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Facebook_Logo_%282019%29.png/1024px-Facebook_Logo_%282019%29.png'),
  createStoreApp('messenger', 'Messenger', 'Social', '#00B2FF', 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/be/Facebook_Messenger_logo_2020.svg/2048px-Facebook_Messenger_logo_2020.svg.png'),
  createStoreApp('whatsapp', 'WhatsApp', 'Social', '#25D366', 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/WhatsApp.svg/2048px-WhatsApp.svg.png'),
  createStoreApp('snapchat', 'Snapchat', 'Social', '#FFFC00', 'https://upload.wikimedia.org/wikipedia/en/thumb/c/c4/Snapchat_logo.svg/1200px-Snapchat_logo.svg.png'),
  createStoreApp('telegram', 'Telegram', 'Social', '#26A5E4', 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Telegram_logo.svg/2048px-Telegram_logo.svg.png'),
  createStoreApp('linkedin', 'LinkedIn', 'Social', '#0077B5', 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/LinkedIn_logo_initials.png/600px-LinkedIn_logo_initials.png'),
  createStoreApp('pinterest', 'Pinterest', 'Social', '#E60023', 'https://upload.wikimedia.org/wikipedia/commons/0/08/Pinterest-logo.png'),
  createStoreApp('reddit', 'Reddit', 'Social', '#FF4500', 'https://upload.wikimedia.org/wikipedia/en/thumb/5/58/Reddit_logo_new.svg/2560px-Reddit_logo_new.svg.png'),
  createStoreApp('tumblr', 'Tumblr', 'Social', '#36465D', 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/Tumblr_logotype_2018.svg/1200px-Tumblr_logotype_2018.svg.png'),
  createStoreApp('wechat', 'WeChat', 'Social', '#7BB32E', 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/WeChat_logo.svg/1200px-WeChat_logo.svg.png'),
  
  // Entertainment
  createStoreApp('netflix', 'Netflix', 'Entertainment', '#E50914', 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Netflix_2015_logo.svg/2560px-Netflix_2015_logo.svg.png'),
  createStoreApp('youtube', 'YouTube', 'Entertainment', '#FF0000', 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/YouTube_full-color_icon_%282017%29.svg/2560px-YouTube_full-color_icon_%282017%29.svg.png'),
  createStoreApp('twitch', 'Twitch', 'Entertainment', '#9146FF', 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/Twitch_Glitch_Logo_Purple.svg/878px-Twitch_Glitch_Logo_Purple.svg.png'),
  createStoreApp('primevideo', 'Prime Video', 'Entertainment', '#00A8E1', 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/Prime_Video.png/600px-Prime_Video.png'),
  createStoreApp('disney', 'Disney+', 'Entertainment', '#113CCF', 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Disney%2B_logo.svg/2560px-Disney%2B_logo.svg.png'),
  createStoreApp('hulu', 'Hulu', 'Entertainment', '#1CE783', 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Hulu_Logo.svg/2560px-Hulu_Logo.svg.png'),
  createStoreApp('hbomax', 'HBO Max', 'Entertainment', '#5D2E91', 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/HBO_Max_Logo.svg/2560px-HBO_Max_Logo.svg.png'),
  createStoreApp('soundcloud', 'SoundCloud', 'Entertainment', '#FF3300', 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Antu_soundcloud.svg/1200px-Antu_soundcloud.svg.png'),
  createStoreApp('shazam', 'Shazam', 'Entertainment', '#0088FF', 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Shazam_icon.svg/2048px-Shazam_icon.svg.png'),
  createStoreApp('roku', 'Roku', 'Entertainment', '#662D91', 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Roku_logo.svg/2560px-Roku_logo.svg.png'),

  // Games
  createStoreApp('candycrush', 'Candy Crush', 'Games', '#E91E63', 'https://upload.wikimedia.org/wikipedia/en/2/25/Candy_Crush_Saga_icon.png'),
  createStoreApp('clashroyale', 'Clash Royale', 'Games', '#2C3E50', 'https://upload.wikimedia.org/wikipedia/en/thumb/4/41/Clash_Royale_logo.png/220px-Clash_Royale_logo.png'),
  createStoreApp('subwaysurfers', 'Subway Surfers', 'Games', '#FFC107', 'https://upload.wikimedia.org/wikipedia/en/3/36/Subway_Surfers_logo.png'),
  createStoreApp('templerun', 'Temple Run', 'Games', '#795548', 'https://upload.wikimedia.org/wikipedia/en/d/dd/Temple_Run_Logo.png'),
  createStoreApp('amongus', 'Among Us', 'Games', '#F44336', 'https://upload.wikimedia.org/wikipedia/en/9/9a/Among_Us_cover_art.jpg'),
  createStoreApp('roblox', 'Roblox', 'Games', '#000000', 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Roblox_logo.svg/2048px-Roblox_logo.svg.png'),
  createStoreApp('minecraftpe', 'Minecraft PE', 'Games', '#4CAF50', 'https://upload.wikimedia.org/wikipedia/en/5/51/Minecraft_cover.png'),
  createStoreApp('pubg', 'PUBG Mobile', 'Games', '#FF9800', 'https://upload.wikimedia.org/wikipedia/en/4/44/PlayerUnknown%27s_Battlegrounds_Mobile_icon.png'),
  createStoreApp('codm', 'Call of Duty', 'Games', '#607D8B', 'https://upload.wikimedia.org/wikipedia/en/thumb/1/1f/Call_of_Duty_Mobile_Logo.jpg/220px-Call_of_Duty_Mobile_Logo.jpg'),
  createStoreApp('genshin', 'Genshin Impact', 'Games', '#E91E63', 'https://upload.wikimedia.org/wikipedia/en/5/5d/Genshin_Impact_logo.svg'),

  // Productivity
  createStoreApp('gmail', 'Gmail', 'Productivity', '#EA4335', 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Gmail_icon_%282020%29.svg/2560px-Gmail_icon_%282020%29.svg.png'),
  createStoreApp('outlook', 'Outlook', 'Productivity', '#0078D4', 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/Microsoft_Office_Outlook_%282018%E2%80%93present%29.svg/2203px-Microsoft_Office_Outlook_%282018%E2%80%93present%29.svg.png'),
  createStoreApp('slack', 'Slack', 'Productivity', '#4A154B', 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Slack_icon_2019.svg/2048px-Slack_icon_2019.svg.png'),
  createStoreApp('zoom', 'Zoom', 'Productivity', '#2D8CFF', 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Zoom_Communications_Logo.svg/2560px-Zoom_Communications_Logo.svg.png'),
  createStoreApp('teams', 'Microsoft Teams', 'Productivity', '#6264A7', 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/Microsoft_Office_Teams_%282018%E2%80%93present%29.svg/2203px-Microsoft_Office_Teams_%282018%E2%80%93present%29.svg.png'),
  createStoreApp('drive', 'Google Drive', 'Productivity', '#1FA463', 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/Google_Drive_icon_%282020%29.svg/2295px-Google_Drive_icon_%282020%29.svg.png'),
  createStoreApp('dropbox', 'Dropbox', 'Productivity', '#0061FF', 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Dropbox_Icon.svg/2200px-Dropbox_Icon.svg.png'),
  createStoreApp('evernote', 'Evernote', 'Productivity', '#00A82D', 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Evernote_logo.svg/1200px-Evernote_logo.svg.png'),
  createStoreApp('trello', 'Trello', 'Productivity', '#0079BF', 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Trello-logo-blue.svg/1280px-Trello-logo-blue.svg.png'),
  createStoreApp('notion', 'Notion', 'Productivity', '#000000', 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/Notion-logo.svg/2048px-Notion-logo.svg.png'),

  // Utilities
  createStoreApp('maps', 'Google Maps', 'Utilities', '#34A853', 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/aa/Google_Maps_icon_%282020%29.svg/2048px-Google_Maps_icon_%282020%29.svg.png'),
  createStoreApp('waze', 'Waze', 'Utilities', '#33CCFF', 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/Waze_2020.svg/1200px-Waze_2020.svg.png'),
  createStoreApp('weather', 'Weather Channel', 'Utilities', '#1B4793', 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/The_Weather_Channel_logo_2005-present.svg/1200px-The_Weather_Channel_logo_2005-present.svg.png'),
  createStoreApp('translator', 'Google Translate', 'Utilities', '#4285F4', 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Google_Translate_logo.svg/2048px-Google_Translate_logo.svg.png'),
  createStoreApp('speedtest', 'Speedtest', 'Utilities', '#000000', 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bf/Ookla_Speedtest_logo.svg/1200px-Ookla_Speedtest_logo.svg.png'),
  createStoreApp('authenticator', 'Authenticator', 'Utilities', '#4285F4', 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/Google_Authenticator_for_Android_icon.svg/2048px-Google_Authenticator_for_Android_icon.svg.png'),
  createStoreApp('files', 'Files by Google', 'Utilities', '#0066FF', 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Files_by_Google_logo.svg/1200px-Files_by_Google_logo.svg.png'),
  createStoreApp('clock', 'Clock', 'Utilities', '#2196F3', 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Google_Clock_icon.svg/2048px-Google_Clock_icon.svg.png'),
  createStoreApp('calculatorplus', 'Calculator+', 'Utilities', '#FF9800', 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Android_Calculator_icon_%282014%29.svg/2048px-Android_Calculator_icon_%282014%29.svg.png'),
  createStoreApp('contacts', 'Contacts', 'Utilities', '#1A73E8', 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Google_Contacts_icon.svg/2048px-Google_Contacts_icon.svg.png'),

  // Shopping
  createStoreApp('amazon', 'Amazon', 'Lifestyle', '#FF9900', 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/2560px-Amazon_logo.svg.png'),
  createStoreApp('ebay', 'eBay', 'Lifestyle', '#E53238', 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/EBay_logo.svg/2560px-EBay_logo.svg.png'),
  createStoreApp('walmart', 'Walmart', 'Lifestyle', '#0071CE', 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Walmart_logo.svg/2560px-Walmart_logo.svg.png'),
  createStoreApp('target', 'Target', 'Lifestyle', '#CC0000', 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Target_logo.svg/2048px-Target_logo.svg.png'),
  createStoreApp('etsy', 'Etsy', 'Lifestyle', '#F1641E', 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Etsy_logo.svg/2560px-Etsy_logo.svg.png'),
  createStoreApp('aliexpress', 'AliExpress', 'Lifestyle', '#FF4747', 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/Aliexpress_logo.svg/2560px-Aliexpress_logo.svg.png'),
  createStoreApp('shein', 'SHEIN', 'Lifestyle', '#000000', 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/92/SHEIN_logo.svg/2560px-SHEIN_logo.svg.png'),
  createStoreApp('nike', 'Nike', 'Lifestyle', '#000000', 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Logo_NIKE.svg/1200px-Logo_NIKE.svg.png'),
  createStoreApp('adidas', 'Adidas', 'Lifestyle', '#000000', 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/20/Adidas_Logo.svg/2560px-Adidas_Logo.svg.png'),
  createStoreApp('zara', 'Zara', 'Lifestyle', '#000000', 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fd/Zara_Logo.svg/2560px-Zara_Logo.svg.png'),

  // Finance
  createStoreApp('paypal', 'PayPal', 'Finance', '#003087', 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/PayPal.svg/2560px-PayPal.svg.png'),
  createStoreApp('cashapp', 'Cash App', 'Finance', '#00D632', 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Cash_App_Logo.svg/2048px-Cash_App_Logo.svg.png'),
  createStoreApp('venmo', 'Venmo', 'Finance', '#3D95CE', 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Venmo_logo_2016.svg/2560px-Venmo_logo_2016.svg.png'),
  createStoreApp('chase', 'Chase', 'Finance', '#117ACA', 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Chase_logo_2007.svg/2560px-Chase_logo_2007.svg.png'),
  createStoreApp('boa', 'Bank of America', 'Finance', '#E31837', 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/20/Bank_of_America_logo.svg/2560px-Bank_of_America_logo.svg.png'),
  createStoreApp('crypto', 'Crypto.com', 'Finance', '#002D74', 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b0/Crypto.com_logo.svg/2560px-Crypto.com_logo.svg.png'),
  createStoreApp('coinbase', 'Coinbase', 'Finance', '#0052FF', 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Coinbase.svg/2560px-Coinbase.svg.png'),
  createStoreApp('robinhood', 'Robinhood', 'Finance', '#00C805', 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/Robinhood_logo.svg/2560px-Robinhood_logo.svg.png'),
  createStoreApp('stripe', 'Stripe', 'Finance', '#635BFF', 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Stripe_Logo%2C_revised_2016.svg/2560px-Stripe_Logo%2C_revised_2016.svg.png'),
  createStoreApp('revolut', 'Revolut', 'Finance', '#FFFFFF', 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Revolut_Logo_White.svg/2560px-Revolut_Logo_White.svg.png'),

  // Food
  createStoreApp('ubereats', 'Uber Eats', 'Lifestyle', '#06C167', 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Uber_Eats_2018_Logo_Suite.svg/2560px-Uber_Eats_2018_Logo_Suite.svg.png'),
  createStoreApp('doordash', 'DoorDash', 'Lifestyle', '#FF3008', 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/99/DoorDash_Logo.svg/2560px-DoorDash_Logo.svg.png'),
  createStoreApp('grubhub', 'Grubhub', 'Lifestyle', '#F83434', 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2b/GrubHub_Logo_2016.svg/2560px-GrubHub_Logo_2016.svg.png'),
  createStoreApp('starbucks', 'Starbucks', 'Lifestyle', '#00704A', 'https://upload.wikimedia.org/wikipedia/en/thumb/d/d3/Starbucks_Corporation_Logo_2011.svg/1200px-Starbucks_Corporation_Logo_2011.svg.png'),
  createStoreApp('mcdonalds', 'McDonald\'s', 'Lifestyle', '#FFC72C', 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/McDonald%27s_Golden_Arches.svg/2339px-McDonald%27s_Golden_Arches.svg.png'),
  
  // Travel
  createStoreApp('uber', 'Uber', 'Network', '#000000', 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/Uber_logo_2018.svg/2560px-Uber_logo_2018.svg.png'),
  createStoreApp('lyft', 'Lyft', 'Network', '#FF00BF', 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Lyft_logo.svg/2560px-Lyft_logo.svg.png'),
  createStoreApp('airbnb', 'Airbnb', 'Network', '#FF5A5F', 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Airbnb_Logo_B%C3%A9lo.svg/2560px-Airbnb_Logo_B%C3%A9lo.svg.png'),
  createStoreApp('booking', 'Booking.com', 'Network', '#003580', 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/be/Booking.com_logo.svg/2560px-Booking.com_logo.svg.png'),
  createStoreApp('expedia', 'Expedia', 'Network', '#00355F', 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Expedia_logo_2012.svg/2560px-Expedia_logo_2012.svg.png'),
];

const STORE_APPS_MAP = STORE_APPS.reduce((acc, app) => {
  acc[app.id] = app;
  return acc;
}, {} as Record<string, AppConfig>);


export const APPS: Record<AppId | string, AppConfig> = {
  [AppId.GEMINI_CHAT]: {
    id: AppId.GEMINI_CHAT,
    title: 'Nexus AI',
    icon: Bot,
    defaultWidth: 800,
    defaultHeight: 600,
    component: GeminiChatApp,
    description: 'Your personal AI assistant powered by Gemini. Ask anything, get instant answers.',
    category: 'AI',
    storageSize: 450,
    memoryUsage: 800
  },
  [AppId.CHROME]: {
    id: AppId.CHROME,
    title: 'Google Chrome',
    icon: Chrome,
    defaultWidth: 1000,
    defaultHeight: 700,
    component: ChromeApp,
    description: 'Access the internet with the most popular web browser.',
    category: 'Network',
    storageSize: 400,
    memoryUsage: 1500
  },
  [AppId.WEB_SEARCH]: {
    id: AppId.WEB_SEARCH,
    title: 'NetSearch',
    icon: Search,
    defaultWidth: 900,
    defaultHeight: 700,
    component: SearchApp,
    description: 'Deep web search grounded by AI. Find information faster and smarter.',
    category: 'Network',
    storageSize: 120,
    memoryUsage: 400
  },
  [AppId.BROWSER]: {
    id: AppId.BROWSER,
    title: 'Nexus Browser',
    icon: Globe,
    defaultWidth: 1000,
    defaultHeight: 700,
    component: BrowserApp,
    description: 'A lightweight, privacy-focused web browser for surfing the interwebs.',
    category: 'Network',
    storageSize: 350,
    memoryUsage: 1200
  },
  [AppId.NEXUS_OFFICE]: {
    id: AppId.NEXUS_OFFICE,
    title: 'Nexus Office',
    icon: Briefcase,
    defaultWidth: 1100,
    defaultHeight: 750,
    component: NexusOfficeApp,
    description: 'Create documents, spreadsheets, and presentations.',
    category: 'Productivity',
    storageSize: 600,
    memoryUsage: 900
  },
  [AppId.VSCODE]: {
    id: AppId.VSCODE,
    title: 'VS Code',
    icon: Code,
    defaultWidth: 1000,
    defaultHeight: 700,
    component: VSCodeApp,
    description: 'Code editing. Redefined. Powerful IDE for web development.',
    category: 'Development',
    storageSize: 500,
    memoryUsage: 800
  },
  [AppId.PLAY_STORE]: {
    id: AppId.PLAY_STORE,
    title: 'Play Store',
    icon: Play,
    defaultWidth: 900,
    defaultHeight: 700,
    component: PlayStoreApp,
    description: 'Download Android apps and games.',
    category: 'System',
    storageSize: 200,
    memoryUsage: 500
  },
  [AppId.APK_INSTALLER]: {
    id: AppId.APK_INSTALLER,
    title: 'Package Installer',
    icon: Package,
    defaultWidth: 400,
    defaultHeight: 500,
    component: ApkInstallerApp,
    description: 'Install APK files.',
    category: 'System',
    storageSize: 50,
    memoryUsage: 100
  },
  [AppId.BATTLE_ROYALE]: {
    id: AppId.BATTLE_ROYALE,
    title: 'FireMax Battle',
    icon: Crosshair,
    defaultWidth: 1200,
    defaultHeight: 700,
    component: BattleRoyaleApp,
    description: 'Survive in this intense 2D battle royale shooter. Be the last one standing!',
    category: 'Games',
    storageSize: 1500,
    memoryUsage: 2048
  },
  [AppId.MEDIA_PLAYER]: {
    id: AppId.MEDIA_PLAYER,
    title: 'Nexus Player',
    icon: PlayCircle,
    defaultWidth: 800,
    defaultHeight: 550,
    component: MediaPlayerApp,
    description: 'Play music and videos with a sleek, modern interface.',
    category: 'Entertainment',
    storageSize: 150,
    memoryUsage: 300
  },
  [AppId.IMAGE_VIEWER]: {
    id: AppId.IMAGE_VIEWER,
    title: 'Gallery',
    icon: ImageIcon,
    defaultWidth: 800,
    defaultHeight: 600,
    component: ImageViewerApp,
    description: 'View your photos and images.',
    category: 'Utilities',
    storageSize: 80,
    memoryUsage: 150
  },
  [AppId.INSTAGRAM]: {
    id: AppId.INSTAGRAM,
    title: 'Instagram',
    icon: Camera,
    defaultWidth: 1000,
    defaultHeight: 700,
    component: InstagramApp,
    description: 'The real Instagram application.',
    category: 'Social',
    storageSize: 200,
    memoryUsage: 600
  },
  [AppId.TIKTOK]: {
    id: AppId.TIKTOK,
    title: 'TikTok',
    icon: Video,
    defaultWidth: 1000,
    defaultHeight: 700,
    component: TikTokApp,
    description: 'Watch, create, and share short-form videos.',
    category: 'Social',
    storageSize: 300,
    memoryUsage: 800
  },
  [AppId.TWITTER]: {
    id: AppId.TWITTER,
    title: 'X (Twitter)',
    icon: Twitter,
    defaultWidth: 1000,
    defaultHeight: 700,
    component: TwitterApp,
    description: 'See what is happening in the world right now.',
    category: 'Social',
    storageSize: 150,
    memoryUsage: 500
  },
  [AppId.SPOTIFY]: {
    id: AppId.SPOTIFY,
    title: 'Spotify',
    icon: Music,
    defaultWidth: 1000,
    defaultHeight: 700,
    component: SpotifyApp,
    description: 'Music for everyone. Millions of songs and podcasts.',
    category: 'Social',
    storageSize: 400,
    memoryUsage: 900
  },
  [AppId.DISCORD]: {
    id: AppId.DISCORD,
    title: 'Discord',
    icon: MessageSquare,
    defaultWidth: 1000,
    defaultHeight: 700,
    component: DiscordApp,
    description: 'Talk, chat, hang out, and stay close with your friends.',
    category: 'Social',
    storageSize: 350,
    memoryUsage: 1100
  },
  [AppId.PHOTO_EDITOR]: {
    id: AppId.PHOTO_EDITOR,
    title: 'Pixel8 Studio',
    icon: Palette,
    defaultWidth: 1100,
    defaultHeight: 750,
    component: PhotoEditorApp,
    description: 'Professional photo editing with AI generation capabilities.',
    category: 'Creative',
    storageSize: 850,
    memoryUsage: 2048
  },
  [AppId.APP_MARKET]: {
    id: AppId.APP_MARKET,
    title: 'App Market',
    icon: ShoppingBag,
    defaultWidth: 900,
    defaultHeight: 650,
    component: AppMarket,
    description: 'Discover and download new applications for your NexusOS.',
    category: 'System',
    storageSize: 150,
    memoryUsage: 300
  },
  [AppId.NOTEPAD]: {
    id: AppId.NOTEPAD,
    title: 'Text Editor',
    icon: FileText,
    defaultWidth: 600,
    defaultHeight: 400,
    component: NotepadApp,
    description: 'Simple and efficient text editing tool for your notes and code.',
    category: 'Productivity',
    storageSize: 15,
    memoryUsage: 80
  },
  [AppId.FILE_EXPLORER]: {
    id: AppId.FILE_EXPLORER,
    title: 'Files',
    icon: Folder,
    defaultWidth: 700,
    defaultHeight: 500,
    component: FileExplorerApp,
    description: 'Manage your files and documents with ease.',
    category: 'System',
    storageSize: 80,
    memoryUsage: 200
  },
  [AppId.CALCULATOR]: {
    id: AppId.CALCULATOR,
    title: 'Calculator',
    icon: Calculator,
    defaultWidth: 320,
    defaultHeight: 450,
    component: CalculatorApp,
    description: 'Perform basic arithmetic and complex calculations.',
    category: 'Utilities',
    storageSize: 10,
    memoryUsage: 50
  },
  [AppId.TERMINAL]: {
    id: AppId.TERMINAL,
    title: 'Terminal',
    icon: Terminal,
    defaultWidth: 600,
    defaultHeight: 400,
    component: TerminalApp,
    description: 'Command line interface for advanced system control.',
    category: 'Development',
    storageSize: 25,
    memoryUsage: 150
  },
  [AppId.SETTINGS]: {
    id: AppId.SETTINGS,
    title: 'Settings',
    icon: Settings,
    defaultWidth: 650,
    defaultHeight: 500,
    component: SettingsApp,
    description: 'Customize your OS experience.',
    category: 'System',
    storageSize: 100,
    memoryUsage: 150
  },
  // Merge the massive store list
  ...STORE_APPS_MAP
};

export const WALLPAPERS = {
  nebula: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=2048&auto=format&fit=crop',
  sunset: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?q=80&w=2048&auto=format&fit=crop',
  midnight: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?q=80&w=2048&auto=format&fit=crop',
  forest: 'https://images.unsplash.com/photo-1448375240586-dfd8d395ea6c?q=80&w=2048&auto=format&fit=crop',
  aurora: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?q=80&w=2048&auto=format&fit=crop',
  cyberpunk: 'https://images.unsplash.com/photo-1555680202-c86f0e12f086?q=80&w=2048&auto=format&fit=crop'
};