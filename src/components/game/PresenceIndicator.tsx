'use client'

import { usePresence } from '@/lib/hooks/usePresence'
import { useAuthStore } from '@/lib/stores/auth-store'
import { User } from 'lucide-react'

/**
 * Props for PresenceIndicator component
 */
export interface PresenceIndicatorProps {
  /** Session ID to track presence for */
  sessionId: string
  /** Campaign ID (alternative to sessionId) */
  campaignId?: string
  /** Map ID being viewed */
  mapId?: string
  /** Whether to show the user list */
  showList?: boolean
  /** Whether to show cursors on the map */
  showCursors?: boolean
  /** Additional CSS classes */
  className?: string
  /** Compact/minimal view mode */
  compact?: boolean
}

/**
 * Component to display online players and their presence
 * 
 * Shows list of online players with avatars/names, displays user cursors
 * or avatars on the map canvas, and shows which users are viewing which layers/maps.
 * 
 * @example
 * ```tsx
 * <PresenceIndicator
 *   sessionId="session-123"
 *   mapId="map-456"
 *   showList
 *   showCursors
 * />
 * ```
 */
export function PresenceIndicator({
  sessionId,
  campaignId,
  mapId,
  showList = true,
  showCursors = false,
  className = '',
  compact = false,
}: PresenceIndicatorProps) {
  const { user } = useAuthStore()
  const {
    onlineUsers,
    onlineUsersList,
    isTracking,
    error,
    updateCursorPosition,
  } = usePresence({
    sessionId,
    campaignId,
    mapId,
    enabled: true,
  })

  // Don't render if not tracking or no users
  if (!isTracking && onlineUsersList.length === 0 && !error) {
    return null
  }

  if (compact) {
    return (
      <div className={`flex items-center gap-1 ${className}`}>
        <div className="flex -space-x-2">
          {onlineUsersList.slice(0, 3).map((presenceUser) => (
            <div
              key={presenceUser.userId}
              className="w-6 h-6 rounded-full bg-blue-500 border-2 border-white flex items-center justify-center text-white text-xs font-medium"
              title={presenceUser.userName}
            >
              {presenceUser.avatarUrl ? (
                <img
                  src={presenceUser.avatarUrl}
                  alt={presenceUser.userName}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <span>
                  {presenceUser.userName.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
          ))}
        </div>
        {onlineUsersList.length > 3 && (
          <span className="text-xs text-gray-500 ml-1">
            +{onlineUsersList.length - 3}
          </span>
        )}
      </div>
    )
  }

  return (
    <div className={`${className}`}>
      {error && (
        <div className="text-xs text-red-500 mb-2" role="alert">
          {error}
        </div>
      )}

      {showList && (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-2">
          <div className="text-xs font-medium text-gray-700 mb-2">
            Online ({onlineUsersList.length})
          </div>
          <div className="space-y-1">
            {onlineUsersList.length === 0 ? (
              <div className="text-xs text-gray-500">No other users online</div>
            ) : (
              onlineUsersList.map((presenceUser) => (
                <div
                  key={presenceUser.userId}
                  className="flex items-center gap-2 text-sm"
                >
                  <div className="relative">
                    {presenceUser.avatarUrl ? (
                      <img
                        src={presenceUser.avatarUrl}
                        alt={presenceUser.userName}
                        className="w-6 h-6 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-medium">
                        {presenceUser.userName.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 border border-white rounded-full" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium text-gray-900 truncate">
                      {presenceUser.userName}
                      {presenceUser.userId === user?.id && ' (You)'}
                    </div>
                    {presenceUser.mapId && (
                      <div className="text-xs text-gray-500 truncate">
                        Viewing map
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {showCursors && (
        <div className="relative">
          {/* Cursors would be rendered on the map canvas */}
          {/* This is a placeholder - actual cursor rendering would be done
              in the map component using the cursor positions from onlineUsers */}
          {onlineUsersList.map((presenceUser) => {
            if (!presenceUser.cursorPosition) return null

            return (
              <div
                key={presenceUser.userId}
                className="absolute pointer-events-none z-50"
                style={{
                  left: `${presenceUser.cursorPosition.x}px`,
                  top: `${presenceUser.cursorPosition.y}px`,
                }}
              >
                <div className="flex items-center gap-1 bg-white border border-gray-300 rounded px-2 py-1 shadow-sm">
                  {presenceUser.avatarUrl ? (
                    <img
                      src={presenceUser.avatarUrl}
                      alt={presenceUser.userName}
                      className="w-4 h-4 rounded-full object-cover"
                    />
                  ) : (
                    <User className="w-4 h-4 text-gray-600" />
                  )}
                  <span className="text-xs font-medium text-gray-900">
                    {presenceUser.userName}
                  </span>
                </div>
                <div
                  className="absolute top-0 left-0 w-2 h-2 bg-blue-500 rounded-full transform -translate-x-1/2 -translate-y-1/2"
                  style={{
                    boxShadow: '0 0 0 2px rgba(59, 130, 246, 0.3)',
                  }}
                />
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

