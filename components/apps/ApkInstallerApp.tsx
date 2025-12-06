
import React, { useState, useEffect } from 'react';
import { useOS } from '../../context/OSContext';
import { AppId } from '../../types';
import { APPS } from '../../constants';
import { Package, ShieldCheck, AlertTriangle, Check, Smartphone } from 'lucide-react';

const ApkInstallerApp: React.FC<{ windowId: string }> = ({ windowId }) => {
  const { windows, getFileContent, installApp, closeWindow, fileSystem } = useOS();
  const [appMetadata, setAppMetadata] = useState<any>(null);
  const [status, setStatus] = useState<'analyzing' | 'ready' | 'installing' | 'success' | 'error'>('analyzing');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const win = windows.find(w => w.id === windowId);
    if (win?.props?.fileId) {
      const fileId = win.props.fileId;
      const fileNode = fileSystem.find(f => f.id === fileId);

      // Simulate parsing "real" APK header
      setTimeout(() => {
          if (fileNode) {
              const fileName = fileNode.name.toLowerCase();
              let matchedAppId: AppId | null = null;
              
              // Map Filenames to Internal App IDs (The "Real" Logic)
              if (fileName.includes('instagram')) matchedAppId = AppId.INSTAGRAM;
              else if (fileName.includes('spotify')) matchedAppId = AppId.SPOTIFY;
              else if (fileName.includes('tiktok')) matchedAppId = AppId.TIKTOK;
              else if (fileName.includes('twitter') || fileName.includes('x.apk')) matchedAppId = AppId.TWITTER;
              else if (fileName.includes('discord')) matchedAppId = AppId.DISCORD;
              else if (fileName.includes('free') && fileName.includes('fire')) matchedAppId = AppId.BATTLE_ROYALE;
              else if (fileName.includes('office')) matchedAppId = AppId.NEXUS_OFFICE;
              else if (fileName.includes('chrome')) matchedAppId = AppId.CHROME;

              if (matchedAppId) {
                  const appConfig = APPS[matchedAppId];
                  setAppMetadata({
                      title: appConfig.title,
                      version: '1.0.0', // Simulated version from APK manifest
                      appId: matchedAppId,
                      size: '45MB'
                  });
                  setStatus('ready');
              } else {
                  // Unknown APK - Cannot run on this "Architecture"
                  setStatus('error');
              }
          } else {
              setStatus('error');
          }
      }, 1500); // Fake analysis time
    }
  }, [windowId, windows, fileSystem]);

  const handleInstall = () => {
    if (!appMetadata) return;
    setStatus('installing');
    
    let p = 0;
    const interval = setInterval(() => {
        p += 5; // Slower install for realism
        setProgress(p);
        if (p >= 100) {
            clearInterval(interval);
            if (appMetadata.appId) {
                installApp(appMetadata.appId as AppId);
            }
            setStatus('success');
        }
    }, 100);
  };

  const getAppIcon = () => {
      if (appMetadata && APPS[appMetadata.appId as AppId]) {
          const Icon = APPS[appMetadata.appId as AppId].icon;
          return <Icon size={48} className="text-gray-700" />;
      }
      return <Package size={48} className="text-gray-400" />;
  }

  if (status === 'analyzing') {
      return (
          <div className="flex flex-col items-center justify-center h-full bg-white text-gray-800 p-8">
              <div className="relative mb-4">
                  <Smartphone size={64} className="text-gray-300" />
                  <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  </div>
              </div>
              <h2 className="text-lg font-medium">Staging app...</h2>
              <p className="text-xs text-gray-500 mt-2">Reading package manifest</p>
          </div>
      );
  }

  if (status === 'error') {
      return (
          <div className="flex flex-col items-center justify-center h-full bg-white text-gray-800 p-8 text-center">
              <AlertTriangle size={64} className="text-red-500 mb-4" />
              <h2 className="text-xl font-bold mb-2">Parse Error</h2>
              <p className="text-gray-500 mb-6">
                  There was a problem parsing the package.
                  <br/><span className="text-xs">Error: Incompatible Architecture or Corrupt APK.</span>
              </p>
              <button onClick={() => closeWindow(windowId)} className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded-lg font-medium">Close</button>
          </div>
      );
  }

  if (status === 'success') {
      return (
          <div className="flex flex-col items-center justify-center h-full bg-white text-gray-800 p-8 text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6 animate-fade-in">
                  <Check size={40} className="text-green-600" />
              </div>
              <h2 className="text-xl font-bold mb-2">App Installed</h2>
              <p className="text-gray-500 mb-8">{appMetadata?.title} is ready to use.</p>
              <button onClick={() => closeWindow(windowId)} className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded-lg font-medium">Done</button>
          </div>
      );
  }

  return (
    <div className="flex flex-col h-full bg-white text-gray-800 font-sans">
      <div className="flex items-center gap-4 p-6 border-b border-gray-100 bg-gray-50">
          <div className="w-20 h-20 bg-white rounded-xl shadow-sm flex items-center justify-center border border-gray-200">
              {getAppIcon()}
          </div>
          <div>
              <h1 className="text-xl font-bold text-gray-900">{appMetadata?.title || 'Unknown App'}</h1>
              <p className="text-sm text-gray-500">Version {appMetadata?.version || '1.0.0'}</p>
          </div>
      </div>

      <div className="flex-1 p-6 overflow-y-auto">
          <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Do you want to install this application?</h3>
              <p className="text-xs text-gray-500 mb-4">It does not require any special access.</p>
              <ul className="space-y-3">
                  <li className="flex items-center gap-3 text-sm text-gray-700">
                      <ShieldCheck size={18} className="text-green-600" />
                      <span>Access shared storage</span>
                  </li>
                  <li className="flex items-center gap-3 text-sm text-gray-700">
                      <ShieldCheck size={18} className="text-green-600" />
                      <span>Full network access</span>
                  </li>
              </ul>
          </div>
          
          {status === 'installing' && (
              <div className="space-y-2">
                  <div className="flex justify-between text-xs text-gray-500">
                      <span>Installing...</span>
                      <span>{progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                      <div className="bg-blue-600 h-full transition-all duration-200" style={{ width: `${progress}%` }} />
                  </div>
              </div>
          )}
      </div>

      <div className="p-4 border-t border-gray-200 flex justify-end gap-3 bg-gray-50">
          <button onClick={() => closeWindow(windowId)} disabled={status === 'installing'} className="px-6 py-2 rounded-lg font-medium text-gray-700 hover:bg-gray-200 disabled:opacity-50">Cancel</button>
          <button onClick={handleInstall} disabled={status === 'installing'} className="px-6 py-2 rounded-lg font-medium bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50">Install</button>
      </div>
    </div>
  );
};

export default ApkInstallerApp;
