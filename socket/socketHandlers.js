const sessionManager = require('../utils/sessionManager');

const socketHandlers = (io) => {
  // Store connected users with enhanced session tracking
  const connectedUsers = new Map();
  const userSessions = new Map();

  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    // Handle user joining with session management
    socket.on('user-join', (userData) => {
      const sessionData = {
        ...userData,
        socketId: socket.id,
        joinedAt: new Date(),
        currentSection: 'homepage',
        achievements: userData.achievements || [],
        interactionCount: 0,
        lastActivity: new Date()
      };
      
      connectedUsers.set(socket.id, sessionData);
      const sessionInfo = {
        userId: userData.userId || socket.id,
        sessionStart: new Date(),
        pageViews: [],
        interactions: [],
        socketId: socket.id,
        userAgent: socket.handshake.headers['user-agent'],
        ipAddress: socket.handshake.address
      };
      
      userSessions.set(socket.id, sessionInfo);
      
      // Store session in Redis for persistence
      sessionManager.setSession(socket.id, sessionInfo, 3600); // 1 hour TTL
      
      // Send welcome data to the user
      socket.emit('session-initialized', {
        sessionId: socket.id,
        connectedUsers: connectedUsers.size,
        serverTime: new Date()
      });
      
      // Broadcast user count update
      io.emit('user-count-update', connectedUsers.size);
      
      console.log(`User session initialized: ${socket.id}, Total users: ${connectedUsers.size}`);
    });

    // Handle section navigation tracking
    socket.on('section-change', (sectionData) => {
      const user = connectedUsers.get(socket.id);
      if (user) {
        user.currentSection = sectionData.section;
        user.lastActivity = new Date();
        
        const session = userSessions.get(socket.id);
        if (session) {
          session.pageViews.push({
            section: sectionData.section,
            timestamp: new Date(),
            timeSpent: sectionData.timeSpent || 0
          });
        }
        
        connectedUsers.set(socket.id, user);
      }
    });

    // Handle skill interactions with enhanced tracking
    socket.on('skill-interaction', (skillData) => {
      const user = connectedUsers.get(socket.id);
      if (user) {
        user.interactionCount++;
        user.lastActivity = new Date();
        
        const session = userSessions.get(socket.id);
        if (session) {
          session.interactions.push({
            type: 'skill-interaction',
            skillId: skillData.skillId,
            timestamp: new Date(),
            data: skillData
          });
        }
      }
      
      // Generate enhanced particle data for skill interaction
      const particleData = {
        skillId: skillData.skillId,
        skillName: skillData.skillName,
        particles: Array.from({ length: Math.min(100, 30 + skillData.level * 10) }, (_, i) => ({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          z: Math.random() * 100,
          color: skillData.color || `hsl(${Math.random() * 360}, 70%, 60%)`,
          size: Math.random() * 3 + 1,
          velocity: {
            x: (Math.random() - 0.5) * 3,
            y: (Math.random() - 0.5) * 3,
            z: (Math.random() - 0.5) * 3,
          },
          life: 1.0,
          decay: Math.random() * 0.02 + 0.01
        })),
        timestamp: Date.now(),
        userId: socket.id
      };
      
      // Broadcast particle update to all clients
      io.emit('particle-update', particleData);
      
      // Send interaction feedback to the user
      socket.emit('interaction-feedback', {
        type: 'skill-interaction',
        skillId: skillData.skillId,
        totalInteractions: user ? user.interactionCount : 1
      });
    });

    // Handle project demo interactions
    socket.on('project-demo-start', (projectData) => {
      socket.broadcast.emit('project-demo-activity', {
        projectId: projectData.projectId,
        userId: socket.id,
        timestamp: Date.now(),
      });
    });

    // Handle real-time demo interactions
    socket.on('project-demo-interaction', (interactionData) => {
      const user = connectedUsers.get(socket.id);
      if (user) {
        user.lastActivity = new Date();
        user.interactionCount++;
        
        const session = userSessions.get(socket.id);
        if (session) {
          session.interactions.push({
            type: 'demo-interaction',
            projectId: interactionData.projectId,
            interactionType: interactionData.interactionType,
            timestamp: new Date(),
            result: interactionData.result
          });
        }
      }
      
      // Broadcast demo interaction to other users for real-time updates
      socket.broadcast.emit('demo-interaction-update', {
        projectId: interactionData.projectId,
        userId: socket.id,
        userName: user ? user.name : 'Anonymous',
        interactionType: interactionData.interactionType,
        timestamp: interactionData.timestamp,
        result: interactionData.result
      });
      
      // Send confirmation back to sender
      socket.emit('demo-interaction-confirmed', {
        projectId: interactionData.projectId,
        timestamp: interactionData.timestamp
      });
    });

    // Handle code collaboration with enhanced synchronization
    socket.on('code-collaboration', (codeData) => {
      const user = connectedUsers.get(socket.id);
      if (user) {
        user.lastActivity = new Date();
        
        const session = userSessions.get(socket.id);
        if (session) {
          session.interactions.push({
            type: 'code-collaboration',
            timestamp: new Date(),
            codeLength: codeData.code ? codeData.code.length : 0
          });
        }
      }
      
      // Enhanced code synchronization
      const syncData = {
        code: codeData.code,
        userId: socket.id,
        userName: user ? user.name : 'Anonymous',
        timestamp: Date.now(),
        cursor: codeData.cursor,
        selection: codeData.selection,
        language: codeData.language || 'javascript',
        operation: codeData.operation || 'edit' // edit, insert, delete
      };
      
      // Broadcast to all other clients in the same room/session
      if (codeData.roomId) {
        socket.to(codeData.roomId).emit('code-sync', syncData);
      } else {
        socket.broadcast.emit('code-sync', syncData);
      }
      
      // Send confirmation back to sender
      socket.emit('code-sync-confirmed', {
        timestamp: syncData.timestamp,
        operation: syncData.operation
      });
    });

    // Handle joining code collaboration rooms
    socket.on('join-code-room', (roomData) => {
      socket.join(roomData.roomId);
      socket.emit('code-room-joined', {
        roomId: roomData.roomId,
        timestamp: Date.now()
      });
      
      // Notify others in the room
      socket.to(roomData.roomId).emit('user-joined-room', {
        userId: socket.id,
        userName: roomData.userName || 'Anonymous',
        timestamp: Date.now()
      });
    });

    // Handle leaving code collaboration rooms
    socket.on('leave-code-room', (roomData) => {
      socket.leave(roomData.roomId);
      socket.to(roomData.roomId).emit('user-left-room', {
        userId: socket.id,
        timestamp: Date.now()
      });
    });

    // Handle chat messages
    socket.on('chat-message', async (messageData) => {
      // Simple AI-like responses (can be enhanced with actual AI integration)
      const responses = [
        "That's an interesting question! I'd love to discuss that further.",
        "Thanks for reaching out! I'm always excited to talk about technology.",
        "Great point! My experience with that technology has been quite rewarding.",
        "I appreciate your interest! Feel free to ask more technical questions.",
      ];
      
      const response = responses[Math.floor(Math.random() * responses.length)];
      
      setTimeout(() => {
        socket.emit('chat-response', {
          message: response,
          timestamp: Date.now(),
          isBot: true,
        });
      }, 1000 + Math.random() * 2000); // Simulate typing delay
    });

    // Handle user unlocking the interface
    socket.on('user-unlocked', (unlockData) => {
      const user = connectedUsers.get(socket.id);
      if (user) {
        user.hasUnlocked = true;
        user.unlockedAt = new Date();
        user.lastActivity = new Date();
        connectedUsers.set(socket.id, user);
      }
      
      // Generate celebration particles
      const celebrationParticles = Array.from({ length: 50 }, (_, i) => ({
        id: `unlock-particle-${socket.id}-${i}`,
        position: [
          (Math.random() - 0.5) * 6,
          (Math.random() - 0.5) * 6,
          (Math.random() - 0.5) * 6
        ],
        velocity: [
          (Math.random() - 0.5) * 0.05,
          (Math.random() - 0.5) * 0.05,
          (Math.random() - 0.5) * 0.05
        ],
        color: ['#ffd700', '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4'][Math.floor(Math.random() * 5)],
        size: Math.random() * 3 + 2,
        life: Math.random() * 3 + 2,
        maxLife: Math.random() * 3 + 2
      }));
      
      // Send particles to the user who unlocked
      socket.emit('particle-update', celebrationParticles);
      
      console.log(`User ${socket.id} unlocked the interface`);
    });

    // Handle achievement unlocks
    socket.on('achievement-unlock', (achievementData) => {
      socket.emit('achievement-unlocked', {
        ...achievementData,
        timestamp: Date.now(),
      });
    });

    // Handle performance metrics sharing
    socket.on('performance-metrics', (metricsData) => {
      // Broadcast performance data for the performance testing mini-game
      io.emit('performance-update', {
        userId: socket.id,
        metrics: metricsData,
        timestamp: Date.now()
      });
    });

    // Handle real-time notifications
    socket.on('send-notification', (notificationData) => {
      if (notificationData.targetUserId) {
        // Send to specific user
        io.to(notificationData.targetUserId).emit('notification', {
          ...notificationData,
          fromUserId: socket.id,
          timestamp: Date.now()
        });
      } else {
        // Broadcast to all users
        socket.broadcast.emit('notification', {
          ...notificationData,
          fromUserId: socket.id,
          timestamp: Date.now()
        });
      }
    });

    // Handle heartbeat for connection monitoring
    socket.on('heartbeat', () => {
      const user = connectedUsers.get(socket.id);
      if (user) {
        user.lastActivity = new Date();
        connectedUsers.set(socket.id, user);
      }
      socket.emit('heartbeat-ack', { timestamp: Date.now() });
    });

    // Handle disconnection with session cleanup
    socket.on('disconnect', (reason) => {
      console.log(`User disconnected: ${socket.id}, Reason: ${reason}`);
      
      const user = connectedUsers.get(socket.id);
      const session = userSessions.get(socket.id);
      
      if (session) {
        // Log session summary
        const sessionDuration = new Date() - session.sessionStart;
        console.log(`Session summary for ${socket.id}: Duration: ${sessionDuration}ms, Page views: ${session.pageViews.length}, Interactions: ${session.interactions.length}`);
      }
      
      // Clean up user data
      connectedUsers.delete(socket.id);
      userSessions.delete(socket.id);
      
      // Broadcast updated user count
      io.emit('user-count-update', connectedUsers.size);
      
      // Notify others if user was in any rooms
      socket.rooms.forEach(room => {
        if (room !== socket.id) {
          socket.to(room).emit('user-left-room', {
            userId: socket.id,
            timestamp: Date.now()
          });
        }
      });
    });

    // Periodic cleanup of inactive sessions (every 5 minutes)
    setInterval(() => {
      const now = new Date();
      const inactiveThreshold = 30 * 60 * 1000; // 30 minutes
      
      connectedUsers.forEach((user, socketId) => {
        if (now - user.lastActivity > inactiveThreshold) {
          console.log(`Cleaning up inactive session: ${socketId}`);
          connectedUsers.delete(socketId);
          userSessions.delete(socketId);
          io.to(socketId).emit('session-expired');
        }
      });
    }, 5 * 60 * 1000);
  });

  return io;
};

module.exports = socketHandlers;