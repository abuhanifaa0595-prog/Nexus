import React from 'react';

export enum AppId {
  GEMINI_CHAT = 'gemini_chat',
  WEB_SEARCH = 'web_search',
  NOTEPAD = 'notepad',
  SETTINGS = 'settings',
  FILE_EXPLORER = 'file_explorer',
  CALCULATOR = 'calculator',
  BROWSER = 'browser',
  CHROME = 'chrome',
  APP_MARKET = 'app_market',
  TERMINAL = 'terminal',
  PHOTO_EDITOR = 'photo_editor',
  MEDIA_PLAYER = 'media_player',
  IMAGE_VIEWER = 'image_viewer',
  INSTAGRAM = 'instagram',
  TIKTOK = 'tiktok',
  TWITTER = 'twitter',
  SPOTIFY = 'spotify',
  DISCORD = 'discord',
  NEXUS_OFFICE = 'nexus_office',
  PLAY_STORE = 'play_store',
  APK_INSTALLER = 'apk_installer',
  BATTLE_ROYALE = 'battle_royale',
  VSCODE = 'vscode',
  ANDROID_EMULATOR = 'android_emulator',
  GENERIC = 'generic'
}

export interface WindowState {
  id: string;
  appId: string; // Changed from AppId to string to support dynamic apps
  title: string;
  x: number;
  y: number;
  width: number;
  height: number;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
  props?: any;
}

export type MobileAppCategory = 'Social' | 'Entertainment' | 'Games' | 'Productivity' | 'Utilities' | 'Shopping' | 'Finance' | 'Food' | 'Travel' | 'Lifestyle' | 'News' | 'System' | 'Network' | 'AI' | 'Development' | 'Creative';

export interface AppConfig {
  id: string; // Changed from AppId to string
  title: string;
  icon: React.ComponentType<any> | string; // Allow URL strings for icons
  defaultWidth: number;
  defaultHeight: number;
  component: React.ComponentType<{ windowId: string }>;
  description?: string;
  category?: MobileAppCategory;
  storageSize: number; // In MB
  memoryUsage: number; // In MB
  url?: string; // For WebApps
  themeColor?: string; // For Generic Apps
}

export interface FileNode {
  id: string;
  parentId: string | null;
  name: string;
  type: 'file' | 'folder';
  content?: string;
  createdAt: number;
  originalParentId?: string | null; // For restoring from Trash
}

export type Theme = 'nebula' | 'sunset' | 'midnight' | 'forest' | 'aurora' | 'cyberpunk';

export interface ContextMenuOption {
  label: string;
  icon?: React.ComponentType<any>;
  action: () => void;
  disabled?: boolean;
  danger?: boolean;
  separator?: boolean;
}

export interface User {
  name: string;
  username: string;
  email: string;
  avatar: string;
  password?: string;
  isGuest?: boolean;
  isAdmin?: boolean;
}