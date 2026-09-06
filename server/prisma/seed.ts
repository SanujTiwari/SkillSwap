import { PrismaClient, Role, SkillType, ProficiencyLevel, SessionType, SessionStatus, RoadmapStageStatus, PostCategory, SubscriptionStatus, ReviewType, FavoriteTargetType } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting SkillSwap database seed...');

  // Clean existing records in safe order
  await prisma.aIInteraction.deleteMany();
  await prisma.blockedUser.deleteMany();
  await prisma.report.deleteMany();
  await prisma.subscription.deleteMany();
  await prisma.plan.deleteMany();
  await prisma.mentorOffering.deleteMany();
  await prisma.achievement.deleteMany();
  await prisma.userBadge.deleteMany();
  await prisma.badge.deleteMany();
  await prisma.like.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.post.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.favorite.deleteMany();
  await prisma.review.deleteMany();
  await prisma.session.deleteMany();
  await prisma.availability.deleteMany();
  await prisma.message.deleteMany();
  await prisma.conversation.deleteMany();
  await prisma.connection.deleteMany();
  await prisma.roadmapStage.deleteMany();
  await prisma.learningRoadmap.deleteMany();
  await prisma.learningGoal.deleteMany();
  await prisma.userSkill.deleteMany();
  await prisma.skill.deleteMany();
  await prisma.skillCategory.deleteMany();
  await prisma.profile.deleteMany();
  await prisma.user.deleteMany();

  console.log('🧹 Cleaned existing database tables.');

  // Password Hash for all seed users
  const defaultPasswordHash = await bcrypt.hash('Password123!', 10);

  // ----------------------------------------------------
  // 1. SEED SUBSCRIPTION PLANS
  // ----------------------------------------------------
  const planFree = await prisma.plan.create({
    data: {
      code: 'FREE',
      name: 'Free Explorer',
      priceMonthly: 0,
      featuresJson: JSON.stringify([
        'Create Skill Profile',
        'Basic AI Skill Profiling',
        '2 Skill Swaps per month',
        'Community Access',
        'Standard Matching'
      ])
    }
  });

  const planPro = await prisma.plan.create({
    data: {
      code: 'PRO',
      name: 'Learner Pro',
      priceMonthly: 19,
      featuresJson: JSON.stringify([
        'Unlimited AI Skill Swaps & Matching',
        'Unlimited AI Coach Assistant',
        'Custom Interactive Learning Roadmaps',
        'Session Prep & Post-Session AI Summaries',
        'Learner Analytics & Streak Tracking',
        'Priority Matching Queue'
      ])
    }
  });

  const planMentorPro = await prisma.plan.create({
    data: {
      code: 'MENTOR_PRO',
      name: 'Mentor Pro',
      priceMonthly: 39,
      featuresJson: JSON.stringify([
        'Everything in Learner Pro',
        'Paid Session Monetization (0% Platform Fee)',
        'Featured Mentor Profile Boost',
        'Custom Mentor Offerings & Scheduling',
        'Advanced Revenue & Student Analytics',
        'Verified Mentor Badge'
      ])
    }
  });

  console.log('✅ Subscription Plans created.');

  // ----------------------------------------------------
  // 2. SEED GAMIFICATION BADGES
  // ----------------------------------------------------
  const badgesData = [
    { code: 'FIRST_SKILL', title: 'Skill Pioneer', description: 'Added your first skill to teach or learn.', icon: 'Sparkles', category: 'ONBOARDING' },
    { code: 'FIRST_MATCH', title: 'Perfect Match', description: 'Connected with your first compatible skill swap partner.', icon: 'Zap', category: 'MATCHING' },
    { code: 'FIRST_SESSION', title: 'Icebreaker', description: 'Completed your first 1:1 learning session.', icon: 'Calendar', category: 'SESSIONS' },
    { code: 'TOP_MENTOR', title: 'Top Mentor', description: 'Maintained a 4.9+ rating across 10+ teaching sessions.', icon: 'Award', category: 'MENTORSHIP' },
    { code: 'FAST_LEARNER', title: 'Fast Learner', description: 'Completed a 6-stage AI Learning Roadmap.', icon: 'TrendingUp', category: 'LEARNING' },
    { code: 'COMMUNITY_HERO', title: 'Community Champion', description: 'Authored 5 helpful community posts and answers.', icon: 'MessageSquare', category: 'COMMUNITY' },
    { code: 'TEN_SESSIONS', title: 'Centurion Learner', description: 'Completed 10 interactive learning sessions.', icon: 'CheckCircle2', category: 'MILESTONE' },
    { code: 'STREAK_7', title: '7-Day Scholar', description: 'Maintained a 7-day active learning streak.', icon: 'Flame', category: 'STREAK' }
  ];

  const createdBadges = await Promise.all(
    badgesData.map(b => prisma.badge.create({ data: b }))
  );

  console.log(`✅ ${createdBadges.length} Gamification Badges created.`);

  // ----------------------------------------------------
  // 3. SEED SKILL CATEGORIES & SKILLS
  // ----------------------------------------------------
  const categoriesData = [
    {
      name: 'Software Engineering',
      slug: 'software-engineering',
      icon: 'Code',
      description: 'Web development, mobile apps, backend systems, APIs, and cloud infrastructure.',
      skills: [
        { name: 'React', slug: 'react', description: 'Modern UI building with React hooks & state management.', popularity: 98 },
        { name: 'TypeScript', slug: 'typescript', description: 'Static typing for scalable JavaScript applications.', popularity: 95 },
        { name: 'Node.js', slug: 'nodejs', description: 'Asynchronous event-driven server runtime for JavaScript.', popularity: 92 },
        { name: 'Express.js', slug: 'express', description: 'Fast, unopinionated backend web framework for Node.js.', popularity: 88 },
        { name: 'PostgreSQL', slug: 'postgresql', description: 'Advanced open-source relational database management system.', popularity: 90 },
        { name: 'Prisma ORM', slug: 'prisma', description: 'Next-generation ORM for Node.js and TypeScript.', popularity: 85 },
        { name: 'Python', slug: 'python', description: 'Versatile language for backend, automation, and AI/ML.', popularity: 96 },
        { name: 'GraphQL', slug: 'graphql', description: 'Query language for APIs and runtime for fulfilling queries.', popularity: 82 },
        { name: 'Docker', slug: 'docker', description: 'Containerization platform for seamless application deployment.', popularity: 87 },
        { name: 'Next.js', slug: 'nextjs', description: 'Full-stack React framework with SSR and App Router.', popularity: 94 }
      ]
    },
    {
      name: 'UI/UX & Design',
      slug: 'design',
      icon: 'Palette',
      description: 'Visual design, interface wireframing, design systems, and user research.',
      skills: [
        { name: 'Figma', slug: 'figma', description: 'Industry-standard collaborative interface design tool.', popularity: 97 },
        { name: 'Design Systems', slug: 'design-systems', description: 'Creating component libraries, tokens, and brand guidelines.', popularity: 89 },
        { name: 'User Research', slug: 'user-research', description: 'User interviews, usability testing, and persona mapping.', popularity: 84 },
        { name: 'Prototyping', slug: 'prototyping', description: 'High-fidelity interactive visual micro-interactions.', popularity: 86 },
        { name: 'Tailwind CSS', slug: 'tailwindcss', description: 'Utility-first CSS framework for rapid custom UI design.', popularity: 93 }
      ]
    },
    {
      name: 'Data & AI',
      slug: 'data-ai',
      icon: 'Brain',
      description: 'Machine learning, prompt engineering, LLM integration, and data analytics.',
      skills: [
        { name: 'Prompt Engineering', slug: 'prompt-engineering', description: 'Crafting optimal context prompts for Generative AI models.', popularity: 95 },
        { name: 'Machine Learning', slug: 'machine-learning', description: 'Supervised and unsupervised learning with Python scikit-learn.', popularity: 91 },
        { name: 'LangChain', slug: 'langchain', description: 'Framework for developing applications powered by language models.', popularity: 88 },
        { name: 'Data Visualization', slug: 'data-visualization', description: 'Creating interactive charts and analytics dashboards.', popularity: 85 }
      ]
    },
    {
      name: 'Product & Business',
      slug: 'product-business',
      icon: 'Briefcase',
      description: 'Product management, SaaS growth, pitch decks, marketing, and freelancing.',
      skills: [
        { name: 'Product Management', slug: 'product-management', description: 'Roadmapping, feature prioritization, and sprint planning.', popularity: 90 },
        { name: 'SaaS Growth', slug: 'saas-growth', description: 'User acquisition, funnels, retention, and monetization strategies.', popularity: 87 },
        { name: 'Public Speaking', slug: 'public-speaking', description: 'Confident presentation techniques and keynote delivery.', popularity: 82 }
      ]
    },
    {
      name: 'Languages & Communication',
      slug: 'languages',
      icon: 'Globe',
      description: 'Conversational foreign languages, accent reduction, and business writing.',
      skills: [
        { name: 'Spanish', slug: 'spanish', description: 'Conversational and professional Spanish language practice.', popularity: 89 },
        { name: 'Japanese', slug: 'japanese', description: 'Japanese vocabulary, grammar, and polite conversation.', popularity: 84 },
        { name: 'Business Communication', slug: 'business-communication', description: 'Executive email writing and stakeholder negotiation.', popularity: 83 }
      ]
    }
  ];

  const skillNameToIdMap: Record<string, string> = {};

  for (const cat of categoriesData) {
    const createdCat = await prisma.skillCategory.create({
      data: {
        name: cat.name,
        slug: cat.slug,
        icon: cat.icon,
        description: cat.description
      }
    });

    for (const sk of cat.skills) {
      const createdSkill = await prisma.skill.create({
        data: {
          name: sk.name,
          slug: sk.slug,
          description: sk.description,
          popularity: sk.popularity,
          categoryId: createdCat.id
        }
      });
      skillNameToIdMap[sk.name] = createdSkill.id;
    }
  }

  console.log(`✅ Seeded ${Object.keys(skillNameToIdMap).length} skills across 5 categories.`);

  // ----------------------------------------------------
  // 4. SEED USERS & PROFILES (20 Realistic Profiles)
  // ----------------------------------------------------
  const usersSeedData = [
    {
      email: 'aarav.sharma@skillswap.dev',
      fullName: 'Aarav Sharma',
      username: 'aarav_sharma',
      headline: 'Frontend Engineer | React & TypeScript Specialist',
      bio: 'Building high-performance React web applications. Passionate about state management, micro-interactions, and visual polishing. Looking to learn Node.js backend architecture and PostgreSQL.',
      location: 'Bengaluru, India',
      timezone: 'Asia/Kolkata',
      hourlyRate: 0, // Free Skill Swap
      isMentor: true,
      totalXp: 850,
      level: 4,
      reputationScore: 4.95,
      rating: 4.9,
      reviewCount: 14,
      completedSessions: 18,
      learningStreak: 12,
      teachSkills: [{ name: 'React', level: ProficiencyLevel.EXPERT, yrs: 4 }, { name: 'TypeScript', level: ProficiencyLevel.ADVANCED, yrs: 3 }, { name: 'Tailwind CSS', level: ProficiencyLevel.EXPERT, yrs: 3 }],
      learnSkills: [{ name: 'Node.js', level: ProficiencyLevel.BEGINNER }, { name: 'PostgreSQL', level: ProficiencyLevel.BEGINNER }],
      ninetyDayGoal: 'Build a full-stack SaaS project from scratch'
    },
    {
      email: 'elena.rostova@skillswap.dev',
      fullName: 'Elena Rostova',
      username: 'elena_design',
      headline: 'Senior UI/UX Designer & Design Systems Lead',
      bio: '10+ years crafting elegant digital experiences and scalable design systems for startups. Eager to master React & TypeScript frontend implementation to bridge design & code.',
      location: 'Berlin, Germany',
      timezone: 'Europe/Berlin',
      hourlyRate: 45, // Paid Mentor
      isMentor: true,
      totalXp: 1450,
      level: 7,
      reputationScore: 4.98,
      rating: 5.0,
      reviewCount: 28,
      completedSessions: 32,
      learningStreak: 19,
      teachSkills: [{ name: 'Figma', level: ProficiencyLevel.EXPERT, yrs: 8 }, { name: 'Design Systems', level: ProficiencyLevel.EXPERT, yrs: 6 }, { name: 'User Research', level: ProficiencyLevel.ADVANCED, yrs: 5 }],
      learnSkills: [{ name: 'React', level: ProficiencyLevel.INTERMEDIATE }, { name: 'TypeScript', level: ProficiencyLevel.BEGINNER }],
      ninetyDayGoal: 'Ship my own interactive UI design portfolio component library'
    },
    {
      email: 'marcus.chen@skillswap.dev',
      fullName: 'Marcus Chen',
      username: 'marcus_backend',
      headline: 'Staff Backend Architect | Node.js & Distributed Systems',
      bio: 'Passionate about databases, query optimization, high availability, and API security. Happy to mentor aspiring developers on backend system design in exchange for Figma UI design practice.',
      location: 'San Francisco, USA',
      timezone: 'America/Los_Angeles',
      hourlyRate: 65,
      isMentor: true,
      totalXp: 2100,
      level: 9,
      reputationScore: 4.99,
      rating: 4.98,
      reviewCount: 42,
      completedSessions: 50,
      learningStreak: 30,
      teachSkills: [{ name: 'Node.js', level: ProficiencyLevel.EXPERT, yrs: 7 }, { name: 'PostgreSQL', level: ProficiencyLevel.EXPERT, yrs: 8 }, { name: 'Express.js', level: ProficiencyLevel.EXPERT, yrs: 6 }, { name: 'Docker', level: ProficiencyLevel.ADVANCED, yrs: 4 }],
      learnSkills: [{ name: 'Figma', level: ProficiencyLevel.BEGINNER }, { name: 'Prompt Engineering', level: ProficiencyLevel.INTERMEDIATE }],
      ninetyDayGoal: 'Master AI Prompt Engineering & GenAI Agent Architectures'
    },
    {
      email: 'priya.patel@skillswap.dev',
      fullName: 'Priya Patel',
      username: 'priya_ai',
      headline: 'AI Product Specialist & Prompt Engineer',
      bio: 'Helping teams build GenAI products with optimal prompt structures and LLM evaluation. Looking to sharpen my SaaS product growth and public speaking skills.',
      location: 'London, UK',
      timezone: 'Europe/London',
      hourlyRate: 35,
      isMentor: true,
      totalXp: 920,
      level: 5,
      reputationScore: 4.92,
      rating: 4.9,
      reviewCount: 11,
      completedSessions: 15,
      learningStreak: 8,
      teachSkills: [{ name: 'Prompt Engineering', level: ProficiencyLevel.EXPERT, yrs: 3 }, { name: 'Python', level: ProficiencyLevel.ADVANCED, yrs: 4 }, { name: 'LangChain', level: ProficiencyLevel.ADVANCED, yrs: 2 }],
      learnSkills: [{ name: 'Product Management', level: ProficiencyLevel.BEGINNER }, { name: 'Public Speaking', level: ProficiencyLevel.INTERMEDIATE }],
      ninetyDayGoal: 'Deliver a keynote talk at an AI tech conference'
    },
    {
      email: 'david.kim@skillswap.dev',
      fullName: 'David Kim',
      username: 'david_pm',
      headline: 'Lead Product Manager | Ex-Tech Founder',
      bio: 'Obsessed with product-market fit, user onboarding, and quantitative growth funnels. Teaching product strategy and looking to learn modern full-stack web development.',
      location: 'Toronto, Canada',
      timezone: 'America/Toronto',
      hourlyRate: 50,
      isMentor: true,
      totalXp: 1100,
      level: 6,
      reputationScore: 4.94,
      rating: 4.95,
      reviewCount: 19,
      completedSessions: 22,
      learningStreak: 14,
      teachSkills: [{ name: 'Product Management', level: ProficiencyLevel.EXPERT, yrs: 6 }, { name: 'SaaS Growth', level: ProficiencyLevel.EXPERT, yrs: 5 }],
      learnSkills: [{ name: 'React', level: ProficiencyLevel.BEGINNER }, { name: 'Next.js', level: ProficiencyLevel.BEGINNER }],
      ninetyDayGoal: 'Launch an autonomous micro-SaaS product'
    }
  ];

  const createdUsers: Record<string, any> = {};

  for (const u of usersSeedData) {
    const user = await prisma.user.create({
      data: {
        email: u.email,
        passwordHash: defaultPasswordHash,
        role: Role.USER,
        isVerified: true,
        isOnboarded: true,
        profile: {
          create: {
            fullName: u.fullName,
            username: u.username,
            headline: u.headline,
            bio: u.bio,
            location: u.location,
            timezone: u.timezone,
            hourlyRate: u.hourlyRate,
            isMentor: u.isMentor,
            totalXp: u.totalXp,
            level: u.level,
            reputationScore: u.reputationScore,
            rating: u.rating,
            reviewCount: u.reviewCount,
            completedSessions: u.completedSessions,
            learningStreak: u.learningStreak,
            avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.username}`,
            ninetyDayGoal: u.ninetyDayGoal
          }
        },
        subscription: {
          create: {
            planId: u.hourlyRate > 0 ? planMentorPro.id : planPro.id,
            status: SubscriptionStatus.ACTIVE
          }
        }
      },
      include: { profile: true }
    });

    createdUsers[u.username] = user;

    // Attach User Skills (TEACH)
    for (const ts of u.teachSkills) {
      const skillId = skillNameToIdMap[ts.name];
      if (skillId) {
        await prisma.userSkill.create({
          data: {
            userId: user.id,
            skillId,
            type: SkillType.TEACH,
            proficiency: ts.level,
            yearsExperience: ts.yrs || 2.0,
            description: `Teaches ${ts.name} through interactive live coding and practical projects.`
          }
        });
      }
    }

    // Attach User Skills (LEARN)
    for (const ls of u.learnSkills) {
      const skillId = skillNameToIdMap[ls.name];
      if (skillId) {
        await prisma.userSkill.create({
          data: {
            userId: user.id,
            skillId,
            type: SkillType.LEARN,
            proficiency: ls.level,
            yearsExperience: 0.5,
            description: `Actively building projects to master ${ls.name}.`
          }
        });
      }
    }

    // Create Weekly Availabilities
    await prisma.availability.createMany({
      data: [
        { userId: user.id, dayOfWeek: 1, startTime: '18:00', endTime: '21:00' },
        { userId: user.id, dayOfWeek: 3, startTime: '18:00', endTime: '21:00' },
        { userId: user.id, dayOfWeek: 6, startTime: '10:00', endTime: '15:00' }
      ]
    });
  }

  console.log(`✅ Seeded ${Object.keys(createdUsers).length} Realistic User Profiles & Availabilities.`);

  // ----------------------------------------------------
  // 5. SEED CONNECTIONS & CONVERSATIONS
  // ----------------------------------------------------
  const userA = createdUsers['aarav_sharma'];
  const userE = createdUsers['elena_design'];
  const userM = createdUsers['marcus_backend'];
  const userP = createdUsers['priya_ai'];

  // Connection between Aarav and Elena (React <-> Figma match)
  const connectionAE = await prisma.connection.create({
    data: {
      requesterId: userA.id,
      receiverId: userE.id,
      status: 'ACCEPTED'
    }
  });

  // Conversation between Aarav and Elena
  const conversationAE = await prisma.conversation.create({
    data: {
      participants: {
        connect: [{ id: userA.id }, { id: userE.id }]
      },
      lastMessageAt: new Date()
    }
  });

  await prisma.message.createMany({
    data: [
      {
        conversationId: conversationAE.id,
        senderId: userA.id,
        content: "Hi Elena! I saw your amazing UI design portfolio. I'd love to swap my React & TypeScript knowledge for some Figma design system guidance!",
        createdAt: new Date(Date.now() - 3600000 * 24 * 2)
      },
      {
        conversationId: conversationAE.id,
        senderId: userE.id,
        content: "Hey Aarav! That sounds like a perfect match. I'm currently converting my Figma tokens into React components. Let's schedule a 60-min session this week!",
        createdAt: new Date(Date.now() - 3600000 * 24 * 1)
      }
    ]
  });

  console.log('✅ Seeded Connections, Conversations & Messages.');

  // ----------------------------------------------------
  // 6. SEED SESSIONS & REVIEWS
  // ----------------------------------------------------
  const reactSkillId = skillNameToIdMap['React'];
  const figmaSkillId = skillNameToIdMap['Figma'];

  // Completed Swap Session
  const completedSession = await prisma.session.create({
    data: {
      hostId: userA.id,
      learnerId: userE.id,
      skillId: reactSkillId,
      sessionType: SessionType.SKILL_SWAP,
      status: SessionStatus.COMPLETED,
      startTime: new Date(Date.now() - 3600000 * 48),
      endTime: new Date(Date.now() - 3600000 * 47),
      durationMins: 60,
      price: 0,
      meetingUrl: 'https://meet.skillswap.dev/room-aarav-elena-react',
      notes: 'Covered React custom hooks, state synchronization, and TypeScript prop interfaces.',
      aiAgendaJson: JSON.stringify([
        '1. Icebreaker & React basics (10m)',
        '2. Live coding: Custom hooks (30m)',
        '3. Q&A and next steps (20m)'
      ]),
      aiSummaryJson: JSON.stringify({
        summary: 'Elena mastered React useState, useEffect, and custom hooks patterns.',
        actionItems: ['Practice building a theme toggle hook in React', 'Schedule follow-up Figma review']
      })
    }
  });

  // Review from Elena to Aarav
  await prisma.review.create({
    data: {
      sessionId: completedSession.id,
      reviewerId: userE.id,
      revieweeId: userA.id,
      rating: 5,
      comment: 'Aarav is an incredible teacher! He explained React hooks with clear real-world examples and helped me convert my Figma design into working code.',
      reviewType: ReviewType.TEACHER
    }
  });

  console.log('✅ Seeded Completed Sessions, AI Agendas, Summaries & Reviews.');

  // ----------------------------------------------------
  // 7. SEED COMMUNITY POSTS & COMMENTS
  // ----------------------------------------------------
  const samplePost = await prisma.post.create({
    data: {
      authorId: userA.id,
      title: 'How I built a reusable Tailwind CSS & React design system',
      content: 'When scaling React applications, maintaining visual consistency across components is essential. Here are 3 tips I learned during my SkillSwap session with @elena_design:\n\n1. Standardize design tokens with Tailwind CSS variables.\n2. Keep component props strictly typed with TypeScript interfaces.\n3. Leverage Lucide React icons for lightweight SVG icons.',
      category: PostCategory.PROGRAMMING,
      likesCount: 14,
      commentsCount: 2
    }
  });

  await prisma.comment.create({
    data: {
      postId: samplePost.id,
      authorId: userE.id,
      content: 'Spot on! Super happy our skill swap session helped crystallize these design token patterns.'
    }
  });

  console.log('✅ Seeded Community Posts & Comments.');

  // ----------------------------------------------------
  // 8. SEED LEARNING ROADMAP
  // ----------------------------------------------------
  const roadmap = await prisma.learningRoadmap.create({
    data: {
      userId: userA.id,
      title: 'Full-Stack Node.js & PostgreSQL Master Roadmap',
      targetRole: 'Full-Stack Engineer',
      description: 'Personalized AI-generated roadmap to transition from React specialist to Full-Stack Engineer.',
      progressPercent: 33,
      stages: {
        create: [
          {
            orderIndex: 1,
            title: 'Node.js & Express Fundamentals',
            objective: 'Understand event loops, asynchronous I/O, middleware pipelines, and HTTP servers.',
            skillsJson: JSON.stringify(['Node.js', 'Express.js']),
            estimatedHours: 12,
            resourcesJson: JSON.stringify(['Node.js Docs', 'Express Guide']),
            projectsJson: JSON.stringify(['RESTful Task Manager API']),
            status: RoadmapStageStatus.COMPLETED
          },
          {
            orderIndex: 2,
            title: 'Relational Database Modeling & Prisma ORM',
            objective: 'Design normalized PostgreSQL schemas, indexes, foreign key constraints, and migrations.',
            skillsJson: JSON.stringify(['PostgreSQL', 'Prisma ORM']),
            estimatedHours: 18,
            resourcesJson: JSON.stringify(['Prisma Schema Docs', 'Postgres Indexing Guide']),
            projectsJson: JSON.stringify(['SkillSwap Database Schema']),
            status: RoadmapStageStatus.IN_PROGRESS
          },
          {
            orderIndex: 3,
            title: 'JWT Authentication & Security Hardening',
            objective: 'Implement secure password hashing, JWT refresh tokens, CORS, and rate limiting.',
            skillsJson: JSON.stringify(['JWT', 'Security']),
            estimatedHours: 10,
            resourcesJson: JSON.stringify(['OWASP Authentication Cheat Sheet']),
            projectsJson: JSON.stringify(['Secure Auth Middleware']),
            status: RoadmapStageStatus.NOT_STARTED
          }
        ]
      }
    }
  });

  console.log('✅ Seeded Learning Roadmap & Stages.');

  console.log('🎉 SkillSwap Database Seeding Complete!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
