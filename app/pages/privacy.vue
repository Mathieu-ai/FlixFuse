<template>
  <UContainer class="py-8">
    <UCard class="max-w-4xl mx-auto">
      <template #header>
        <div class="text-center">
          <h1 class="text-4xl font-bold mb-2">{{ t('privacy.title') }}</h1>
          <p class="text-gray-600 dark:text-gray-300">{{ t('privacy.lastUpdated') }}: {{ lastUpdated }}</p>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-2">
            {{ t('privacy.description') }}
          </p>
        </div>
      </template>

      <div class="space-y-8">
        <!-- Table of Contents -->
        <UCard>
          <template #header>
            <h2 class="text-2xl font-semibold">{{ t('privacy.tableOfContents') }}</h2>
          </template>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <UButton
              v-for="section in tableOfContents"
              :key="section.id"
              :label="section.title"
              variant="ghost"
              color="primary"
              class="justify-start text-left w-full"
              @click="scrollToSection(section.id)"
            />
          </div>
        </UCard>

        <!-- 1. Data We Collect -->
        <section id="data-collection" class="space-y-6">
          <h2 class="text-3xl font-bold">{{ t('privacy.sections.dataCollection') }}</h2>
          
          <!-- Personal Information -->
          <UCard>
            <template #header>
              <h3 class="text-xl font-semibold flex items-center gap-2">
                <UIcon name="i-lucide-user" class="text-blue-500" />
                {{ t('privacy.sections.personalInformation') || 'Personal Information' }}
              </h3>
            </template>
            <div class="space-y-4">
              <UAlert 
                icon="i-lucide-info" 
                color="info" 
                variant="subtle"
                title="Account Information"
                description="Required for account creation and platform functionality"
              />
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <UCard v-for="category in personalDataCategories" :key="category.name">
                  <div class="p-4">
                    <h4 class="font-semibold text-lg mb-2 flex items-center gap-2">
                      <UIcon :name="category.icon" :class="category.color" />
                      {{ category.name }}
                    </h4>
                    <ul class="space-y-1">
                      <li v-for="field in category.fields" :key="field" class="text-sm text-gray-600 dark:text-gray-300 flex items-center gap-2">
                        <UIcon name="i-lucide-check" class="text-green-500 w-3 h-3" />
                        {{ field }}
                      </li>
                    </ul>
                  </div>
                </UCard>
              </div>
            </div>
          </UCard>

          <!-- Pet Information -->
          <UCard>
            <template #header>
              <h3 class="text-xl font-semibold flex items-center gap-2">
                <UIcon name="i-lucide-heart" class="text-pink-500" />
                Pet Information
              </h3>
            </template>
            <div class="space-y-4">
              <UAlert 
                icon="i-lucide-heart" 
                color="error" 
                variant="subtle"
                :title="t('privacy.petProfiles.title') || 'Pet Profiles'"
                :description="t('privacy.petProfiles.description') || 'Information about your pets to enhance community interactions and safety'"
              />
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <UCard v-for="category in petDataCategories" :key="category.name">
                  <div class="p-4">
                    <h4 class="font-semibold text-lg mb-2 flex items-center gap-2">
                      <UIcon :name="category.icon" :class="category.color" />
                      {{ category.name }}
                    </h4>
                    <ul class="space-y-1">
                      <li v-for="field in category.fields" :key="field" class="text-sm text-gray-600 dark:text-gray-300 flex items-center gap-2">
                        <UIcon name="i-lucide-check" class="text-green-500 w-3 h-3" />
                        {{ field }}
                      </li>
                    </ul>
                  </div>
                </UCard>
              </div>
            </div>
          </UCard>

          <!-- Activity & Behavioral Data -->
          <UCard>
            <template #header>
              <h3 class="text-xl font-semibold flex items-center gap-2">
                <UIcon name="i-lucide-activity" class="text-purple-500" />
                Activity & Behavioral Data
              </h3>
            </template>
            <div class="space-y-4">
              <UAlert 
                icon="i-lucide-activity" 
                color="secondary" 
                variant="subtle"
                title="Platform Usage"
                description="Data collected to improve your experience and platform functionality"
              />
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div v-for="category in activityDataCategories" :key="category.name" class="border rounded-lg p-4">
                  <h4 class="font-semibold text-lg mb-2 flex items-center gap-2">
                    <UIcon :name="category.icon" :class="category.color" />
                    {{ category.name }}
                  </h4>
                  <ul class="space-y-1">
                    <li v-for="field in category.fields" :key="field" class="text-sm text-gray-600 flex items-center gap-2">
                      <UIcon name="i-lucide-check" class="text-green-500 w-3 h-3" />
                      {{ field }}
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </UCard>
        </section>

          <!-- 2. How We Use Your Data -->
          <section id="data-usage" class="space-y-6">
            <h2 class="text-3xl font-bold text-gray-900">{{ t('privacy.sections.dataUsage') }}</h2>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <UCard v-for="usage in dataUsage" :key="usage.title">
                <template #header>
                  <h3 class="text-lg font-semibold flex items-center gap-2">
                    <UIcon :name="usage.icon" :class="usage.color" />
                    {{ usage.title }}
                  </h3>
                </template>
                <ul class="space-y-2">
                  <li v-for="purpose in usage.purposes" :key="purpose" class="text-sm text-gray-600 flex items-start gap-2">
                    <UIcon name="i-lucide-arrow-right" class="text-gray-400 w-4 h-4 mt-0.5 flex-shrink-0" />
                    {{ purpose }}
                  </li>
                </ul>
              </UCard>
            </div>
          </section>

          <!-- 3. Data Sharing & Third Parties -->
          <section id="data-sharing" class="space-y-6">
            <h2 class="text-3xl font-bold text-gray-900">3. Data Sharing & Third Parties</h2>
            
            <UAlert 
              icon="i-lucide-shield-check" 
              color="success" 
              variant="subtle"
              title="We Never Sell Your Data"
              description="Your personal information is never sold to third parties for marketing or advertising purposes."
            />

            <div class="space-y-4">
              <UCard v-for="sharing in dataSharingCategories" :key="sharing.title">
                <template #header>
                  <h3 class="text-lg font-semibold flex items-center gap-2">
                    <UIcon :name="sharing.icon" :class="sharing.color" />
                    {{ sharing.title }}
                  </h3>
                </template>
                <div class="space-y-3">
                  <p class="text-sm text-gray-600">{{ sharing.description }}</p>
                  <ul class="space-y-1">
                    <li v-for="scenario in sharing.scenarios" :key="scenario" class="text-sm text-gray-600 flex items-start gap-2">
                      <UIcon name="i-lucide-check" class="text-green-500 w-4 h-4 mt-0.5 flex-shrink-0" />
                      {{ scenario }}
                    </li>
                  </ul>
                </div>
              </UCard>
            </div>
          </section>

          <!-- 4. Data Security -->
          <section id="data-security" class="space-y-6">
            <h2 class="text-3xl font-bold text-gray-900">4. Data Security</h2>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <UCard v-for="security in securityMeasures" :key="security.title">
                <template #header>
                  <h3 class="text-lg font-semibold flex items-center gap-2">
                    <UIcon :name="security.icon" :class="security.color" />
                    {{ security.title }}
                  </h3>
                </template>
                <ul class="space-y-2">
                  <li v-for="measure in security.measures" :key="measure" class="text-sm text-gray-600 flex items-start gap-2">
                    <UIcon name="i-lucide-shield" class="text-blue-500 w-4 h-4 mt-0.5 flex-shrink-0" />
                    {{ measure }}
                  </li>
                </ul>
              </UCard>
            </div>
          </section>

          <!-- 5. Your Rights -->
          <section id="your-rights" class="space-y-6">
            <h2 class="text-3xl font-bold text-gray-900">5. Your Rights (GDPR & CCPA)</h2>
            
            <UAlert 
              icon="i-lucide-scale" 
              color="warning" 
              variant="subtle"
              title="Your Data Rights"
              description="Under GDPR and CCPA, you have specific rights regarding your personal data."
            />

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <UCard v-for="right in userRights" :key="right.title">
                <template #header>
                  <h3 class="text-lg font-semibold flex items-center gap-2">
                    <UIcon :name="right.icon" :class="right.color" />
                    {{ right.title }}
                  </h3>
                </template>
                <div class="space-y-3">
                  <p class="text-sm text-gray-600">{{ right.description }}</p>
                  <UButton 
                    v-if="right.action"
                    :label="right.action.label"
                    color="primary"
                    variant="outline"
                    size="sm"
                    @click="handleRightAction(right.action.type)"
                  />
                </div>
              </UCard>
            </div>
          </section>

          <!-- 6. Data Retention -->
          <section id="data-retention" class="space-y-6">
            <h2 class="text-3xl font-bold text-gray-900">6. Data Retention</h2>
            
            <div class="space-y-4">
              <UCard v-for="retention in dataRetentionPolicies" :key="retention.category">
                <template #header>
                  <h3 class="text-lg font-semibold flex items-center gap-2">
                    <UIcon :name="retention.icon" :class="retention.color" />
                    {{ retention.category }}
                  </h3>
                </template>
                <div class="space-y-3">
                  <div class="flex items-center gap-2">
                    <UBadge color="primary" variant="subtle">
                      {{ retention.period }}
                    </UBadge>
                    <span class="text-sm text-gray-600">{{ retention.description }}</span>
                  </div>
                  <ul class="space-y-1">
                    <li v-for="policy in retention.policies" :key="policy" class="text-sm text-gray-600 flex items-start gap-2">
                      <UIcon name="i-lucide-clock" class="text-gray-400 w-4 h-4 mt-0.5 flex-shrink-0" />
                      {{ policy }}
                    </li>
                  </ul>
                </div>
              </UCard>
            </div>
          </section>

          <!-- 7. Cookies & Tracking -->
          <section id="cookies-tracking" class="space-y-6">
            <h2 class="text-3xl font-bold text-gray-900">7. Cookies & Tracking</h2>
            
            <div class="space-y-4">
              <UCard v-for="cookie in cookieCategories" :key="cookie.type">
                <template #header>
                  <div class="flex items-center justify-between">
                    <h3 class="text-lg font-semibold flex items-center gap-2">
                      <UIcon :name="cookie.icon" :class="cookie.color" />
                      {{ cookie.type }}
                    </h3>
                    <UBadge 
                      :color="cookie.required ? 'error' : 'success'" 
                      variant="subtle"
                    >
                      {{ cookie.required ? 'Required' : 'Optional' }}
                    </UBadge>
                  </div>
                </template>
                <div class="space-y-3">
                  <p class="text-sm text-gray-600">{{ cookie.description }}</p>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 class="font-medium text-sm mb-2">Purpose:</h4>
                      <ul class="space-y-1">
                        <li v-for="purpose in cookie.purposes" :key="purpose" class="text-xs text-gray-600 flex items-start gap-2">
                          <UIcon name="i-lucide-dot" class="w-3 h-3 mt-0.5 flex-shrink-0" />
                          {{ purpose }}
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h4 class="font-medium text-sm mb-2">Duration:</h4>
                      <p class="text-xs text-gray-600">{{ cookie.duration }}</p>
                    </div>
                  </div>
                </div>
              </UCard>
            </div>
          </section>

          <!-- 8. Children's Privacy -->
          <section id="children-privacy" class="space-y-6">
            <h2 class="text-3xl font-bold text-gray-900">8. Children's Privacy</h2>
            
            <UAlert 
              icon="i-lucide-baby" 
              color="warning" 
              variant="solid"
              title="Age Restriction: 13+"
              description="Our platform is not intended for children under 13 years old."
            />

            <UCard>
              <div class="space-y-4">
                <h3 class="text-lg font-semibold">Protection of Minors</h3>
                <ul class="space-y-2">
                  <li v-for="protection in childrenProtections" :key="protection" class="text-sm text-gray-600 flex items-start gap-2">
                    <UIcon name="i-lucide-shield-check" class="text-orange-500 w-4 h-4 mt-0.5 flex-shrink-0" />
                    {{ protection }}
                  </li>
                </ul>
              </div>
            </UCard>
          </section>

          <!-- 9. International Transfers -->
          <section id="international-transfers" class="space-y-6">
            <h2 class="text-3xl font-bold text-gray-900">9. International Data Transfers</h2>
            
            <UCard>
              <div class="space-y-4">
                <UAlert 
                  icon="i-lucide-globe" 
                  color="info" 
                  variant="subtle"
                  title="Data Processing Locations"
                  description="Your data may be processed in different countries with appropriate safeguards."
                />
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div v-for="transfer in internationalTransfers" :key="transfer.region" class="border rounded-lg p-4">
                    <h4 class="font-semibold text-lg mb-2 flex items-center gap-2">
                      <UIcon :name="transfer.icon" :class="transfer.color" />
                      {{ transfer.region }}
                    </h4>
                    <p class="text-sm text-gray-600 mb-2">{{ transfer.description }}</p>
                    <ul class="space-y-1">
                      <li v-for="safeguard in transfer.safeguards" :key="safeguard" class="text-xs text-gray-600 flex items-start gap-2">
                        <UIcon name="i-lucide-check" class="text-green-500 w-3 h-3 mt-0.5 flex-shrink-0" />
                        {{ safeguard }}
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </UCard>
          </section>

          <!-- 10. Contact Information -->
          <section id="contact" class="space-y-6">
            <h2 class="text-3xl font-bold text-gray-900">10. Contact Us</h2>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <UCard v-for="contact in contactMethods" :key="contact.type">
                <template #header>
                  <h3 class="text-lg font-semibold flex items-center gap-2">
                    <UIcon :name="contact.icon" :class="contact.color" />
                    {{ contact.type }}
                  </h3>
                </template>
                <div class="space-y-3">
                  <p class="text-sm text-gray-600">{{ contact.description }}</p>
                  <div class="space-y-2">
                    <div v-for="method in contact.methods" :key="method.label" class="flex items-center gap-2">
                      <UIcon :name="method.icon" class="text-gray-400 w-4 h-4" />
                      <span class="text-sm">{{ method.label }}: {{ method.value }}</span>
                    </div>
                  </div>
                  <UButton 
                    v-if="contact.action"
                    :label="contact.action.label"
                    color="primary"
                    variant="outline"
                    size="sm"
                    @click="handleContactAction(contact.action.type)"
                  />
                </div>
              </UCard>
            </div>
          </section>
        </div>
      </UCard>
    </UContainer>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

// Meta tags for SEO
useHead({
  title: 'Privacy Policy - PawGo',
  meta: [
    {
      name: 'description',
      content: 'PawGo Privacy Policy - Learn about how we collect, use, and protect your personal information and pet data.'
    }
  ]
})

const { t } = useI18n()
const lastUpdated = ref('August 14, 2025')

const tableOfContents = ref([
  { id: 'data-collection', title: '1. Data We Collect' },
  { id: 'data-usage', title: '2. How We Use Your Data' },
  { id: 'data-sharing', title: '3. Data Sharing & Third Parties' },
  { id: 'data-security', title: '4. Data Security' },
  { id: 'your-rights', title: '5. Your Rights' },
  { id: 'data-retention', title: '6. Data Retention' },
  { id: 'cookies-tracking', title: '7. Cookies & Tracking' },
  { id: 'children-privacy', title: '8. Children\'s Privacy' },
  { id: 'international-transfers', title: '9. International Transfers' },
  { id: 'contact', title: '10. Contact Us' }
])

const personalDataCategories = ref([
  {
    name: 'Account Information',
    icon: 'i-lucide-user-circle',
    color: 'text-blue-500',
    fields: [
      'Email address', 'Username', 'First and last name', 'Display name',
      'Profile picture', 'Phone number', 'WhatsApp number', 'Date of birth',
      'Gender', 'Password (encrypted)', 'Two-factor authentication settings'
    ]
  },
  {
    name: 'Location & Geographic Data',
    icon: 'i-lucide-map-pin',
    color: 'text-green-500',
    fields: [
      'Neighborhood', 'City', 'ZIP code', 'GPS coordinates',
      'Location radius preferences', 'Time zone', 'Language preference',
      'Location history', 'Geofence settings'
    ]
  },
  {
    name: 'Social & Preferences',
    icon: 'i-lucide-users',
    color: 'text-purple-500',
    fields: [
      'Biography', 'Interests', 'Personality traits', 'Experience level',
      'Walk preferences', 'Availability schedule', 'Privacy settings',
      'Notification preferences', 'Communication preferences'
    ]
  },
  {
    name: 'Professional Information',
    icon: 'i-lucide-briefcase',
    color: 'text-orange-500',
    fields: [
      'Service provider profile', 'Business information', 'Certifications',
      'Licenses', 'Professional credentials', 'Veterinarian profile',
      'Background check results', 'Identity verification'
    ]
  }
])

const petDataCategories = ref([
  {
    name: 'Basic Pet Information',
    icon: 'i-lucide-heart',
    color: 'text-pink-500',
    fields: [
      'Pet name and nickname', 'Species and breed', 'Age and gender',
      'Weight and height', 'Color and markings', 'Microchip ID',
      'Photos and videos', 'Registration numbers'
    ]
  },
  {
    name: 'Health & Medical Records',
    icon: 'i-lucide-stethoscope',
    color: 'text-red-500',
    fields: [
      'Vaccination records', 'Medical conditions', 'Allergies',
      'Current medications', 'Veterinary visits', 'Health checkups',
      'Treatments and surgeries', 'Insurance information'
    ]
  },
  {
    name: 'Behavior & Training',
    icon: 'i-lucide-brain',
    color: 'text-indigo-500',
    fields: [
      'Personality traits', 'Behavioral characteristics', 'Energy level',
      'Social level', 'Training level', 'Compatibility with other pets',
      'Play style', 'Favorite activities', 'Fears and triggers'
    ]
  },
  {
    name: 'Care Instructions',
    icon: 'i-lucide-clipboard-list',
    color: 'text-teal-500',
    fields: [
      'Feeding schedule', 'Exercise needs', 'Care instructions',
      'Special needs', 'Dietary restrictions', 'Emergency contact',
      'Lost pet details', 'Lending contracts'
    ]
  }
])

const activityDataCategories = ref([
  {
    name: 'Platform Usage',
    icon: 'i-lucide-mouse-pointer',
    color: 'text-blue-500',
    fields: [
      'Login/logout times', 'Pages visited', 'Features used',
      'Time spent on platform', 'Device information', 'IP address',
      'Browser type', 'Session data', 'Search queries'
    ]
  },
  {
    name: 'Social Interactions',
    icon: 'i-lucide-message-circle',
    color: 'text-green-500',
    fields: [
      'Posts and comments', 'Likes and reactions', 'Messages sent/received',
      'Friend requests', 'Group memberships', 'Event participations',
      'Walk participations', 'Reviews and ratings'
    ]
  },
  {
    name: 'Community Activities',
    icon: 'i-lucide-users',
    color: 'text-purple-500',
    fields: [
      'Walks created/joined', 'Events organized/attended', 'Groups joined',
      'Posts shared', 'Photos uploaded', 'Check-ins', 'Venue reviews',
      'Service bookings', 'Classified ads'
    ]
  },
  {
    name: 'Security & Moderation',
    icon: 'i-lucide-shield',
    color: 'text-red-500',
    fields: [
      'Reports submitted', 'Content flagged', 'Trust scores',
      'Security deposits', 'Background checks', 'Audit logs',
      'Moderation actions', 'Appeals and disputes'
    ]
  }
])

const dataUsage = ref([
  {
    title: 'Platform Functionality',
    icon: 'i-lucide-cog',
    color: 'text-blue-500',
    purposes: [
      'Account creation and authentication',
      'Profile management and customization',
      'Pet profile creation and management',
      'Walk and event organization',
      'Messaging and social features',
      'Service provider bookings',
      'Payment processing'
    ]
  },
  {
    title: 'Safety & Security',
    icon: 'i-lucide-shield-check',
    color: 'text-green-500',
    purposes: [
      'Identity verification',
      'Background checks for service providers',
      'Lost pet alerts and recovery',
      'Emergency contact notifications',
      'Content moderation and safety',
      'Fraud prevention',
      'Trust score calculations'
    ]
  },
  {
    title: 'Personalization & Recommendations',
    icon: 'i-lucide-target',
    color: 'text-purple-500',
    purposes: [
      'Personalized walk and event suggestions',
      'Local pet community recommendations',
      'Compatible pet and owner matching',
      'Customized notification preferences',
      'Location-based content',
      'Service provider recommendations'
    ]
  },
  {
    title: 'Communication & Support',
    icon: 'i-lucide-mail',
    color: 'text-orange-500',
    purposes: [
      'Customer support and assistance',
      'Platform updates and announcements',
      'Health and care reminders',
      'Event and walk notifications',
      'Emergency communications',
      'Legal and compliance notices'
    ]
  }
])

const dataSharingCategories = ref([
  {
    title: 'Community Members',
    icon: 'i-lucide-users',
    color: 'text-blue-500',
    description: 'Information shared with other community members based on your privacy settings.',
    scenarios: [
      'Public profile information for walk participants',
      'Pet information for safety during walks/events',
      'Reviews and ratings you provide',
      'Posts and comments you make publicly',
      'Emergency contact info during walks (if authorized)'
    ]
  },
  {
    title: 'Service Providers',
    icon: 'i-lucide-briefcase',
    color: 'text-green-500',
    description: 'Information shared with veterinarians, groomers, and other service providers you book.',
    scenarios: [
      'Pet health information for veterinary consultations',
      'Contact information for service bookings',
      'Pet behavioral information for training services',
      'Location information for home visits',
      'Payment information for completed services'
    ]
  },
  {
    title: 'Legal Requirements',
    icon: 'i-lucide-scale',
    color: 'text-red-500',
    description: 'Data shared only when required by law or to protect safety.',
    scenarios: [
      'Law enforcement requests with valid warrants',
      'Emergency situations involving pet or human safety',
      'Court orders and legal proceedings',
      'Regulatory compliance requirements',
      'Child protection services (if applicable)'
    ]
  },
  {
    title: 'Technical Partners',
    icon: 'i-lucide-server',
    color: 'text-gray-500',
    description: 'Limited data shared with trusted technical service providers.',
    scenarios: [
      'Cloud hosting providers (encrypted data only)',
      'Payment processors (transaction data only)',
      'Analytics services (anonymized usage data)',
      'Email service providers (for platform communications)',
      'Security services (for fraud prevention)'
    ]
  }
])

const securityMeasures = ref([
  {
    title: 'Data Protection',
    icon: 'i-lucide-lock',
    color: 'text-blue-500',
    measures: [
      'End-to-end encryption for sensitive communications',
      'AES-256 encryption for stored data',
      'Encrypted database backups',
      'Secure password hashing (bcrypt)',
      'SSL/TLS encryption for all data transmissions'
    ]
  },
  {
    title: 'Access Controls',
    icon: 'i-lucide-key',
    color: 'text-green-500',
    measures: [
      'Multi-factor authentication (2FA)',
      'Role-based access permissions',
      'Regular access reviews and audits',
      'Secure API authentication',
      'Session management and timeout controls'
    ]
  },
  {
    title: 'Infrastructure Security',
    icon: 'i-lucide-server',
    color: 'text-purple-500',
    measures: [
      'SOC 2 compliant cloud hosting',
      'Regular security penetration testing',
      'Automated vulnerability scanning',
      'Firewall and intrusion detection systems',
      'Regular security updates and patches'
    ]
  },
  {
    title: 'Monitoring & Response',
    icon: 'i-lucide-eye',
    color: 'text-orange-500',
    measures: [
      '24/7 security monitoring',
      'Incident response procedures',
      'Audit logging for all data access',
      'Breach notification protocols',
      'Regular security training for staff'
    ]
  }
])

const userRights = ref([
  {
    title: 'Access Your Data',
    icon: 'i-lucide-eye',
    color: 'text-blue-500',
    description: 'Request a copy of all personal data we have about you and your pets.',
    action: { label: 'Request Data Export', type: 'data-export' }
  },
  {
    title: 'Correct Your Data',
    icon: 'i-lucide-edit',
    color: 'text-green-500',
    description: 'Update or correct any inaccurate personal information.',
    action: { label: 'Update Profile', type: 'update-profile' }
  },
  {
    title: 'Delete Your Data',
    icon: 'i-lucide-trash',
    color: 'text-red-500',
    description: 'Request permanent deletion of your account and associated data.',
    action: { label: 'Delete Account', type: 'delete-account' }
  },
  {
    title: 'Data Portability',
    icon: 'i-lucide-download',
    color: 'text-purple-500',
    description: 'Export your data in a machine-readable format.',
    action: { label: 'Export Data', type: 'export-data' }
  },
  {
    title: 'Restrict Processing',
    icon: 'i-lucide-pause',
    color: 'text-orange-500',
    description: 'Limit how we process your personal data.',
    action: { label: 'Manage Preferences', type: 'manage-preferences' }
  },
  {
    title: 'Object to Processing',
    icon: 'i-lucide-x',
    color: 'text-gray-500',
    description: 'Object to specific types of data processing.',
    action: { label: 'Object to Processing', type: 'object-processing' }
  }
])

const dataRetentionPolicies = ref([
  {
    category: 'Account Data',
    icon: 'i-lucide-user',
    color: 'text-blue-500',
    period: 'Account lifetime + 30 days',
    description: 'Retained while account is active, deleted 30 days after account deletion.',
    policies: [
      'Profile information retained for platform functionality',
      'Account deletion triggers 30-day grace period',
      'Backup systems purged after 90 days',
      'Anonymous analytics may be retained longer'
    ]
  },
  {
    category: 'Pet Health Records',
    icon: 'i-lucide-heart',
    color: 'text-red-500',
    period: '7 years after last update',
    description: 'Medical records retained for veterinary continuity of care.',
    policies: [
      'Vaccination records kept for legal compliance',
      'Medical history preserved for pet health continuity',
      'Emergency contact information retained for safety',
      'Can be deleted upon explicit user request'
    ]
  },
  {
    category: 'Financial Records',
    icon: 'i-lucide-credit-card',
    color: 'text-green-500',
    period: '7 years',
    description: 'Payment and transaction records for legal and tax compliance.',
    policies: [
      'Required for tax and accounting purposes',
      'Payment method details encrypted and tokenized',
      'Transaction history for dispute resolution',
      'Service provider payment records'
    ]
  },
  {
    category: 'Communication Data',
    icon: 'i-lucide-message-circle',
    color: 'text-purple-500',
    period: '3 years or account deletion',
    description: 'Messages and communications for safety and dispute resolution.',
    policies: [
      'Messages retained for safety investigations',
      'Public posts may remain for community value',
      'Private messages deleted with account',
      'Emergency communications retained longer'
    ]
  },
  {
    category: 'Security & Audit Logs',
    icon: 'i-lucide-shield',
    color: 'text-orange-500',
    period: '2 years',
    description: 'Security logs for fraud prevention and system integrity.',
    policies: [
      'Login attempts and security events',
      'Access logs for data protection compliance',
      'Fraud prevention and investigation',
      'System performance and error tracking'
    ]
  }
])

const cookieCategories = ref([
  {
    type: 'Essential Cookies',
    icon: 'i-lucide-lock',
    color: 'text-red-500',
    required: true,
    description: 'Necessary for basic platform functionality and security.',
    duration: 'Session to 1 year',
    purposes: [
      'User authentication and session management',
      'Security and fraud prevention',
      'Load balancing and performance',
      'Language and accessibility preferences',
      'CSRF protection and security tokens'
    ]
  },
  {
    type: 'Functional Cookies',
    icon: 'i-lucide-settings',
    color: 'text-blue-500',
    required: false,
    description: 'Enhance your experience with personalized features.',
    duration: '30 days to 1 year',
    purposes: [
      'Remember your preferences and settings',
      'Personalized content and recommendations',
      'Location-based services and mapping',
      'Social media integration',
      'Chat and messaging functionality'
    ]
  },
  {
    type: 'Analytics Cookies',
    icon: 'i-lucide-bar-chart',
    color: 'text-green-500',
    required: false,
    description: 'Help us understand how you use the platform to improve it.',
    duration: '1 to 24 months',
    purposes: [
      'Page views and user journey analysis',
      'Feature usage and performance metrics',
      'Error tracking and debugging',
      'A/B testing and optimization',
      'Platform improvement insights'
    ]
  },
  {
    type: 'Marketing Cookies',
    icon: 'i-lucide-megaphone',
    color: 'text-purple-500',
    required: false,
    description: 'Used to deliver relevant advertisements and track campaign effectiveness.',
    duration: '30 days to 2 years',
    purposes: [
      'Targeted advertising and promotions',
      'Social media advertising integration',
      'Email marketing campaign tracking',
      'Referral program attribution',
      'Cross-platform marketing analytics'
    ]
  }
])

const childrenProtections = ref([
  'Age verification during registration process',
  'Parental consent required for users under 16',
  'Enhanced privacy protections for minors',
  'Restricted communication features for young users',
  'No targeted advertising to users under 18',
  'Special data deletion procedures for minors',
  'Educational content about online safety',
  'Reporting mechanisms for inappropriate content'
])

const internationalTransfers = ref([
  {
    region: 'European Union',
    icon: 'i-lucide-map',
    color: 'text-blue-500',
    description: 'Primary data processing location with GDPR compliance.',
    safeguards: [
      'GDPR compliance and data protection laws',
      'Data Protection Officer (DPO) oversight',
      'Privacy by design and default principles',
      'Regular data protection impact assessments',
      'EU-based hosting and processing infrastructure'
    ]
  },
  {
    region: 'United States',
    icon: 'i-lucide-flag',
    color: 'text-red-500',
    description: 'Additional processing for cloud services with Privacy Shield successor agreements.',
    safeguards: [
      'Standard Contractual Clauses (SCCs)',
      'Data Processing Agreements (DPAs)',
      'Privacy Shield successor framework compliance',
      'Additional encryption and security measures',
      'Limited to essential business operations'
    ]
  }
])

const contactMethods = ref([
  {
    type: 'Data Protection Officer',
    icon: 'i-lucide-shield-check',
    color: 'text-blue-500',
    description: 'For privacy-related questions and data protection concerns.',
    methods: [
      { icon: 'i-lucide-mail', label: 'Email', value: 'dpo@pawgo.com' },
      { icon: 'i-lucide-clock', label: 'Response Time', value: '72 hours' },
      { icon: 'i-lucide-globe', label: 'Languages', value: 'English, French, Dutch' }
    ],
    action: { label: 'Contact DPO', type: 'contact-dpo' }
  },
  {
    type: 'General Privacy Support',
    icon: 'i-lucide-help-circle',
    color: 'text-green-500',
    description: 'For general privacy questions and account management.',
    methods: [
      { icon: 'i-lucide-mail', label: 'Email', value: 'privacy@pawgo.com' },
      { icon: 'i-lucide-message-circle', label: 'Live Chat', value: 'Available 9 AM - 6 PM CET' },
      { icon: 'i-lucide-phone', label: 'Phone', value: '+33 1 23 45 67 89' }
    ],
    action: { label: 'Get Support', type: 'general-support' }
  }
])

// Methods
function scrollToSection(sectionId: string) {
  const element = document.getElementById(sectionId)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
  }
}

function handleRightAction(actionType: string) {
  // Handle different user rights actions
  switch (actionType) {
    case 'data-export':
      // Redirect to data export page
      navigateTo('/account/data-export')
      break
    case 'update-profile':
      // Redirect to profile settings
      navigateTo('/account/profile')
      break
    case 'delete-account':
      // Show account deletion confirmation
      navigateTo('/account/delete')
      break
    case 'export-data':
      // Redirect to data portability page
      navigateTo('/account/export')
      break
    case 'manage-preferences':
      // Redirect to privacy preferences
      navigateTo('/account/privacy')
      break
    case 'object-processing':
      // Show objection form
      navigateTo('/account/objections')
      break
  }
}

function handleContactAction(contactType: string) {
  switch (contactType) {
    case 'contact-dpo':
      window.location.href = 'mailto:dpo@pawgo.com'
      break
    case 'general-support':
      // Open support chat or redirect to support page
      navigateTo('/support')
      break
  }
}
</script>
