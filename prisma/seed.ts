/**
 * Idempotent Prisma seed script
 * - Creates example users, pets, walks, events, posts, bookings and related records
 * - Uses find-or-create helpers so running multiple times is safe
 *
 * Edit and extend this file to add the business-specific seeding logic for features.
 */

/* eslint-disable @typescript-eslint/no-explicit-any */
import { PrismaClient, UserRole, PetSpecies, WalkType, WalkPace, PostType, PostVisibility, BookingStatus, ServiceType } from '@prisma/client'
import { hashPassword as pbkdf2Hash } from '../server/services/auth.service.ts'

const prisma = new PrismaClient()

async function ensureUser(data: Record<string, unknown>) {
  const email = typeof data.email === 'string' ? data.email : undefined
  if (!email) throw new Error('User data requires email')
  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) return existing
  // Build a safe create payload with the commonly used fields
  const payload: any = {
    email,
    firstName: typeof data.firstName === 'string' ? data.firstName : 'Unknown',
    lastName: typeof data.lastName === 'string' ? data.lastName : undefined,
    username: typeof data.username === 'string' ? data.username : undefined,
    displayName: typeof data.displayName === 'string' ? data.displayName : undefined,
  passwordHash: typeof data.passwordHash === 'string' ? data.passwordHash : await pbkdf2Hash('changeme'),
    isEmailVerified: typeof data.isEmailVerified === 'boolean' ? data.isEmailVerified : false,
    role: (data.role as any) ?? UserRole.MEMBER,
    language: typeof data.language === 'string' ? data.language : 'en',
    timeZone: typeof data.timeZone === 'string' ? data.timeZone : 'UTC'
  }
  return prisma.user.create({ data: payload })
}

async function ensurePet(data: Record<string, unknown>) {
  const name = typeof data.name === 'string' ? data.name : undefined
  const ownerId = typeof data.ownerId === 'string' ? data.ownerId : undefined
  if (!name || !ownerId) throw new Error('Pet must have name and ownerId')
  const existing = await prisma.pet.findFirst({ where: { name, ownerId } })
  if (existing) return existing
  const payload: any = {
    name,
    species: (data.species as any) ?? PetSpecies.DOG,
    breed: typeof data.breed === 'string' ? data.breed : undefined,
    ownerId,
    isNeutered: typeof data.isNeutered === 'boolean' ? data.isNeutered : true,
    age: typeof data.age === 'number' ? data.age : undefined,
    ageUnit: (data.ageUnit as any) ?? 'YEARS',
    photos: Array.isArray(data.photos) ? data.photos : [],
    personalityTraits: Array.isArray(data.personalityTraits) ? data.personalityTraits : [],
    behaviorTraits: Array.isArray(data.behaviorTraits) ? data.behaviorTraits : []
  }
  return prisma.pet.create({ data: payload })
}

async function ensureFriendship(requesterId: string, receiverId: string) {
  const existing = await prisma.friendship.findFirst({ where: { requesterId, receiverId } })
  if (existing) return existing
  return prisma.friendship.create({ data: { requesterId, receiverId, status: 'ACCEPTED' } })
}

async function ensureWalk(data: Record<string, unknown>) {
  const title = typeof data.title === 'string' ? data.title : undefined
  const createdById = typeof data.createdById === 'string' ? data.createdById : undefined
  if (!title || !createdById) throw new Error('Walk requires title and createdById')
  const existing = await prisma.walk.findFirst({ where: { title, createdById } })
  if (existing) return existing
  const payload: any = {
    title,
    description: typeof data.description === 'string' ? data.description : undefined,
    startTime: data.startTime ? new Date(data.startTime as any) : new Date(),
    estimatedDuration: typeof data.estimatedDuration === 'number' ? data.estimatedDuration : 30,
    meetingPoint: data.meetingPoint ?? {},
    walkType: (data.walkType as any) ?? WalkType.CASUAL,
    pace: (data.pace as any) ?? WalkPace.MODERATE,
    createdById,
    venueId: typeof data.venueId === 'string' ? data.venueId : undefined
  }
  return prisma.walk.create({ data: payload })
}

async function ensurePost(data: Record<string, unknown>) {
  const content = typeof data.content === 'string' ? data.content : undefined
  const authorId = typeof data.authorId === 'string' ? data.authorId : undefined
  if (!content || !authorId) throw new Error('Post requires content and authorId')
  const existing = await prisma.post.findFirst({ where: { content, authorId } })
  if (existing) return existing
  const payload: any = {
    content,
    postType: (data.postType as any) ?? PostType.TEXT,
    visibility: (data.visibility as any) ?? PostVisibility.NEIGHBORHOOD,
    authorId,
    createdAt: data.createdAt ? new Date(data.createdAt as any) : new Date()
  }
  return prisma.post.create({ data: payload })
}

async function main() {
  console.log('Start seeding...')

  // --- Users ---
  const alice = await ensureUser({
    email: 'alice@example.com',
    username: 'alice',
    firstName: 'Alice',
    lastName: 'Duval',
    displayName: 'Alice D.',
  passwordHash: await pbkdf2Hash('password123'),
    isEmailVerified: true,
    role: UserRole.MEMBER,
    language: 'en',
    timeZone: 'Europe/Paris'
  })

  const bob = await ensureUser({
    email: 'bob@example.com',
    username: 'bob',
    firstName: 'Bob',
    lastName: 'Martin',
    displayName: 'Bob M.',
  passwordHash: await pbkdf2Hash('password123'),
    isEmailVerified: true,
    role: UserRole.MEMBER,
    language: 'en',
    timeZone: 'Europe/Paris'
  })

  const carol = await ensureUser({
    email: 'carol@example.com',
    username: 'carol',
    firstName: 'Carol',
    lastName: 'Jones',
    displayName: 'Carol J.',
  passwordHash: await pbkdf2Hash('password123'),
    isEmailVerified: true,
    role: UserRole.SERVICE_PROVIDER,
    language: 'en',
    timeZone: 'Europe/Paris'
  })

  // --- Pets ---
  const rex = await ensurePet({
    name: 'Rex',
    species: PetSpecies.DOG,
    breed: 'Labrador',
    ownerId: alice.id,
    isNeutered: true,
    age: 4,
    ageUnit: 'YEARS',
    photos: [],
    personalityTraits: ['friendly','energetic'],
    behaviorTraits: ['good_with_kids','leash_trained']
  })

  const whiskers = await ensurePet({
    name: 'Whiskers',
    species: PetSpecies.CAT,
    breed: 'European Shorthair',
    ownerId: bob.id,
    isNeutered: false,
    age: 2,
    ageUnit: 'YEARS',
    photos: [],
    personalityTraits: ['calm'],
    behaviorTraits: ['independent']
  })

  // --- Friendships ---
  await ensureFriendship(alice.id, bob.id)
  await ensureFriendship(bob.id, alice.id)

  // --- Emergency Contacts ---
  await prisma.emergencyContact.upsert({
    where: { id: `ec-${alice.id}` },
    update: {},
    create: {
      id: `ec-${alice.id}`,
      userId: alice.id,
      name: 'Marie Duval',
      phoneNumber: '+33123456789',
      relationship: 'family',
      priority: 1
    }
  })

  // --- Service provider profile for Carol ---
  const carolProfile = await prisma.serviceProviderProfile.upsert({
    where: { userId: carol.id },
    update: {},
    create: {
      userId: carol.id,
      businessName: 'Carol Vet Care',
      businessType: ServiceType.VETERINARIAN,
      specialties: ['general_medicine'],
      description: 'Small animal clinic providing excellent care.',
      businessPhone: '+33100000000',
      businessAddress: '10 Rue de la Sant\u00e9, Paris',
      serviceArea: {},
      certifications: [],
      licenses: [],
      insurance: true,
      // required fields in schema
      openingHours: {},
      pricing: {}
    }
  })

  // --- Venue (find or create) ---
  let park = await prisma.venue.findFirst({ where: { name: 'Central Dog Park' } })
  if (!park) {
    park = await prisma.venue.create({
      data: {
        name: 'Central Dog Park',
        venueType: 'DOG_PARK',
        address: '1 Park Ave',
        city: 'Paris',
        zipCode: '75001',
        coordinates: { lat: 48.8566, lng: 2.3522 },
        isActive: true
      }
    })
  }

  // --- Walk ---
  const morningWalk = await ensureWalk({
    title: 'Morning Walk - Canal route',
    description: 'Casual 60min walk along the canal',
    startTime: new Date(Date.now() + 24 * 3600 * 1000),
    estimatedDuration: 60,
    meetingPoint: { name: 'Canal Bridge', address: 'Bridge 3', coordinates: { lat: 48.858, lng: 2.35 } },
    walkType: WalkType.CASUAL,
    pace: WalkPace.MODERATE,
    createdById: alice.id,
    venueId: park.id
  })

  // --- Walk Participation ---
  await prisma.walkParticipation.createMany({
    data: [
      { walkId: morningWalk.id, userId: alice.id, petId: rex.id, status: 'CONFIRMED' },
      { walkId: morningWalk.id, userId: bob.id, petId: whiskers.id, status: 'PENDING' }
    ],
    skipDuplicates: true
  })

  // --- Event (find or create) ---
  let meetup = await prisma.event.findFirst({ where: { title: 'Neighborhood Meetup' } })
  if (!meetup) {
    meetup = await prisma.event.create({
      data: {
        title: 'Neighborhood Meetup',
        description: 'Monthly community meetup',
        eventType: 'SOCIAL_GATHERING',
        startTime: new Date(Date.now() + 7 * 24 * 3600 * 1000),
        location: { name: 'Community Center', address: '2 Rue du Centre' },
        createdById: bob.id
      }
    })
  }

  // --- Post / Comment / Like ---
  const post = await ensurePost({
    content: 'Lost my favorite ball during the walk today!',
    postType: PostType.TEXT,
    visibility: PostVisibility.NEIGHBORHOOD,
    authorId: alice.id,
    createdAt: new Date()
  })

  await prisma.comment.create({
    data: {
      content: 'I think I saw it near the canal bridge — I will check tomorrow.',
      postId: post.id,
      authorId: bob.id
    }
  })

  await prisma.like.createMany({
    data: [
      { userId: bob.id, postId: post.id },
      { userId: carol.id, postId: post.id }
    ],
    skipDuplicates: true
  })

  // --- Booking & Review ---
  // Create a booking that references the service provider profile id
  const booking = await prisma.booking.create({
    data: {
      clientId: alice.id,
      serviceProviderId: carolProfile.id,
      appointmentDate: new Date(Date.now() + 3 * 24 * 3600 * 1000),
      serviceType: ServiceType.VETERINARIAN,
      status: BookingStatus.PENDING
    }
  })

  await prisma.review.create({
    data: {
      reviewerId: alice.id,
      serviceProviderId: carolProfile.id,
      bookingId: booking.id,
      rating: 5,
      content: 'Great clinic, very caring staff.',
      serviceDate: new Date()
    }
  })

  // --- Badge example ---
  const badge = await prisma.badge.upsert({
    where: { name: 'Early Bird' },
    update: {},
    create: {
      name: 'Early Bird',
      slug: 'early-bird',
      description: 'Attend a walk before 8AM',
      icon: '',
      category: 'WALKS',
      criteria: {}
    }
  })

  await prisma.userBadge.createMany({ data: [{ userId: alice.id, badgeId: badge.id }], skipDuplicates: true })
  // ------------------ Additional varied test data ------------------
  // Utility helpers
  const random = (arr: any[]) => arr[Math.floor(Math.random() * arr.length)]
  const randInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min

  // Create more users
  const extraUsers: any[] = []
  for (let i = 1; i <= 15; i++) {
    const email = `user${i}@example.com`
    const u = await ensureUser({
      email,
      username: `user${i}`,
      firstName: `User${i}`,
      lastName: 'Test',
      displayName: `User ${i}`,
      passwordHash: await pbkdf2Hash('password123'),
      isEmailVerified: i % 3 === 0,
      role: UserRole.MEMBER,
      language: i % 2 === 0 ? 'en' : 'fr',
      timeZone: 'Europe/Paris'
    })
    extraUsers.push(u)
  }

  const allUsers = [alice, bob, carol, ...extraUsers]

  // Promote a few users to service providers and create profiles
  for (let i = 0; i < 4; i++) {
    const u = allUsers[randInt(0, allUsers.length - 1)]
    try {
      await prisma.serviceProviderProfile.upsert({
        where: { userId: u.id },
        update: {},
        create: {
          userId: u.id,
          businessName: `${(u as any).firstName || (u as any).username || 'Prov'} Services`,
          businessType: ServiceType.DOG_WALKER,
          specialties: ['walking', 'pet_care'],
          description: 'Seeded service provider',
          businessPhone: '+33000000000',
          businessAddress: 'Seeded Address',
          serviceArea: {},
          certifications: [],
          licenses: [],
          insurance: true,
          openingHours: {},
          pricing: {}
        }
      })
    } catch (err) {
      console.debug('serviceProvider upsert skipped:', (err as Error).message || err)
    }
  }

  // Create pets for many users
  const petNames = ['Buddy', 'Milo', 'Bella', 'Luna', 'Charlie', 'Max', 'Lola', 'Rocky', 'Zoe', 'Nala']
  const allPets: any[] = [rex, whiskers]
  for (const u of allUsers) {
    const count = randInt(1, 3)
    for (let p = 0; p < count; p++) {
      const name = `${random(petNames)}-${u.username?.slice?.(0,4) || u.firstName?.slice?.(0,4) || 'u'}`
      try {
        const pet = await ensurePet({
          name,
          species: random([PetSpecies.DOG, PetSpecies.CAT]),
          breed: 'Mixed',
          ownerId: u.id,
          isNeutered: Math.random() > 0.5,
          age: randInt(1, 10),
          ageUnit: 'YEARS',
          photos: [],
          personalityTraits: [],
          behaviorTraits: []
        })
        allPets.push(pet)
      } catch (err) {
        console.debug('pet create skipped:', (err as Error).message || err)
      }
    }
  }

  // Create some additional venues
  const venueNames = ['Riverside Park', 'East Dog Park', 'Green Meadow']
  const venues: any[] = [park]
  for (const name of venueNames) {
    let v = await prisma.venue.findFirst({ where: { name } })
    if (!v) {
      v = await prisma.venue.create({
        data: {
          name,
          venueType: 'DOG_PARK',
          address: `${randInt(1,200)} Park Lane`,
          city: 'Paris',
          zipCode: '75001',
          coordinates: { lat: 48.85 + Math.random() * 0.02, lng: 2.35 + Math.random() * 0.02 },
          isActive: true
        }
      })
    }
    venues.push(v)
  }

  // Create many walks
  const walks: any[] = [morningWalk]
  for (let i = 1; i <= 12; i++) {
    const creator = allUsers[randInt(0, allUsers.length - 1)]
    const title = `Walk #${i} - ${['Canal','Park','River','Hill'][i%4]}`
    const w = await ensureWalk({
      title,
      description: `Auto-generated walk ${i}`,
      startTime: new Date(Date.now() + randInt(1, 14) * 24 * 3600 * 1000),
      estimatedDuration: randInt(30, 120),
      meetingPoint: { name: 'Meeting Point', coordinates: { lat: 48.85 + Math.random() * 0.02, lng: 2.35 + Math.random() * 0.02 } },
      walkType: random(Object.values(WalkType)),
      pace: random(Object.values(WalkPace)),
      createdById: creator.id,
      venueId: random(venues).id
    })
    walks.push(w)
  }

  // Participation for walks
  for (const w of walks) {
    const participants = new Set<string>()
    const count = randInt(3, 8)
    const rows: any[] = []
    for (let k = 0; k < count; k++) {
      const u = allUsers[randInt(0, allUsers.length - 1)]
      if (participants.has(u.id)) continue
      participants.add(u.id)
      const pet = allPets.find((p) => p.ownerId === u.id) || null
      rows.push({ walkId: w.id, userId: u.id, petId: pet?.id ?? undefined, status: random(['CONFIRMED','PENDING','WAITLISTED']) })
    }
    if (rows.length) {
      await prisma.walkParticipation.createMany({ data: rows, skipDuplicates: true })
    }
  }

  // Create events
  const events: any[] = [meetup]
  for (let i = 1; i <= 8; i++) {
    const creator = allUsers[randInt(0, allUsers.length - 1)]
    const title = `Event ${i} - Community ${randInt(1,100)}`
    let ev = await prisma.event.findFirst({ where: { title } })
    if (!ev) {
      ev = await prisma.event.create({
        data: {
          title,
          description: 'Generated event',
          eventType: 'SOCIAL_GATHERING',
          startTime: new Date(Date.now() + randInt(2, 30) * 24 * 3600 * 1000),
          location: { name: 'Venue', address: 'Some address' },
          createdById: creator.id,
          venueId: random(venues).id
        }
      })
    }
    events.push(ev)
  }

  // Create posts, comments and likes
  const samplePosts = [
    'Found a friendly black lab near the canal.',
    'Anyone available for a quick walk this afternoon?',
    'Sharing tips for pet grooming at home.'
  ]
  for (const txt of samplePosts) {
    const author = allUsers[randInt(0, allUsers.length - 1)]
    const p = await ensurePost({ content: txt, postType: PostType.TEXT, visibility: PostVisibility.PUBLIC, authorId: author.id })
    // comments
    for (let c = 0; c < randInt(1,4); c++) {
      const commenter = allUsers[randInt(0, allUsers.length - 1)]
      try {
        await prisma.comment.create({ data: { content: `Comment ${c} on ${p.id}`, postId: p.id, authorId: commenter.id } })
      } catch (err) { console.debug('comment create skipped', (err as Error).message || err) }
    }
    // likes - batch and skip duplicates
    const likeRows: any[] = []
    const likers = new Set<string>()
    for (let l = 0; l < randInt(1,6); l++) {
      const liker = allUsers[randInt(0, allUsers.length - 1)]
      if (likers.has(liker.id)) continue
      likers.add(liker.id)
      likeRows.push({ userId: liker.id, postId: p.id })
    }
    if (likeRows.length) {
      try { await prisma.like.createMany({ data: likeRows, skipDuplicates: true }) } catch (err) { console.debug('like createMany skipped', (err as Error).message || err) }
    }
  }

  // Bookings between random clients and available providers
  const providers = await prisma.serviceProviderProfile.findMany({ take: 10 })
  for (let i = 0; i < 12; i++) {
    const client = allUsers[randInt(0, allUsers.length - 1)]
    const provider = random(providers)
    if (!provider) break
    try {
      await prisma.booking.create({ data: {
        clientId: client.id,
        serviceProviderId: provider.id,
        appointmentDate: new Date(Date.now() + randInt(1, 20) * 24 * 3600 * 1000),
        serviceType: ServiceType.DOG_WALKER,
        status: random(Object.values(BookingStatus)) as any
      }})
    } catch (err) { console.debug('booking skipped', (err as Error).message || err) }
  }

  // Additional badges and random awards
  const moreBadges = [
    { name: 'Social Butterfly', slug: 'social-butterfly', description: 'Attend 5 events' },
    { name: 'Trail Blazer', slug: 'trail-blazer', description: 'Create 10 walks' }
  ]
  const createdBadges: any[] = []
  for (const b of moreBadges) {
    const bd = await prisma.badge.upsert({ where: { name: b.name }, update: {}, create: { name: b.name, slug: b.slug, description: b.description, icon: '', category: 'COMMUNITY', criteria: {} } })
    createdBadges.push(bd)
  }
  // Assign badges randomly
  // Batch assign badges to avoid unique-constraint errors when running seed multiple times
  const userBadgeRows: any[] = []
  for (const u of allUsers.slice(0, 10)) {
    const bd = random(createdBadges)
    userBadgeRows.push({ userId: u.id, badgeId: bd.id })
  }
  try {
    if (userBadgeRows.length) {
      await prisma.userBadge.createMany({ data: userBadgeRows, skipDuplicates: true })
    }
  } catch (err) {
    console.debug('userBadge batch assign skipped', (err as Error).message || err)
  }

  console.log('Seeding finished')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
