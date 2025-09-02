<template>
  <div>
    <UContainer class="py-8">
      <UCard>
        <template #header>
            <div class="text-center">
            <h1 class="text-4xl font-bold mb-2">{{ t('terms.title') }}</h1>
            <p class="text-slate-300">{{ t('terms.lastUpdated') }}: {{ lastUpdated }}</p>
            <p class="text-sm text-slate-400 mt-2">
              {{ t('terms.description') }}
            </p>
          </div>
        </template>

        <div class="space-y-8">
          <!-- Table of Contents -->
          <UCard>
            <template #header>
              <h2 class="text-2xl font-semibold">{{ t('terms.tableOfContents') }}</h2>
            </template>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div v-for="section in tableOfContents" :key="section.id" class="space-y-2">
                <UButton
                  :label="section.title"
                  variant="ghost"
                  color="primary"
                  class="justify-start text-left w-full"
                  @click="scrollToSection(section.id)"
                />
              </div>
            </div>
          </UCard>

          <!-- 1. Agreement & Acceptance -->
          <section id="agreement" class="space-y-6">
            <h2 class="text-3xl font-bold">1. Agreement & Acceptance</h2>
            
            <UCard>
              <div class="space-y-4">
                <UAlert 
                  icon="i-lucide-handshake" 
                  color="info" 
                  variant="subtle"
                  :title="t('terms.alerts.welcomeTitle')"
                  :description="t('terms.alerts.welcomeDesc')"
                />
                
                <div class="space-y-4">
                  <h3 class="text-xl font-semibold">What This Agreement Covers</h3>
                  <ul class="space-y-2">
                    <li v-for="coverage in agreementCoverage" :key="coverage" class="text-sm text-slate-400 flex items-start gap-2">
                      <UIcon name="i-lucide-check" class="text-green-500 w-4 h-4 mt-0.5 flex-shrink-0" />
                      {{ coverage }}
                    </li>
                  </ul>
                </div>

                <UAlert 
                  icon="i-lucide-alert-triangle" 
                  color="warning" 
                  variant="subtle"
                  :title="t('terms.alerts.importantTitle') || t('terms.alerts.importantTitle')"
                  :description="t('terms.alerts.importantDesc')"
                />
              </div>
            </UCard>
          </section>

          <!-- 2. User Responsibilities -->
          <section id="user-responsibilities" class="space-y-6">
            <h2 class="text-3xl font-bold text-gray-900">2. Your Responsibilities as a PawGo Member</h2>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <UCard v-for="responsibility in userResponsibilities" :key="responsibility.title">
                <template #header>
                  <h3 class="text-lg font-semibold flex items-center gap-2">
                    <UIcon :name="responsibility.icon" :class="responsibility.color" />
                    {{ responsibility.title }}
                  </h3>
                </template>
                <ul class="space-y-2">
                  <li v-for="rule in responsibility.rules" :key="rule" class="text-sm text-gray-600 flex items-start gap-2">
                    <UIcon name="i-lucide-arrow-right" class="text-gray-400 w-4 h-4 mt-0.5 flex-shrink-0" />
                    {{ rule }}
                  </li>
                </ul>
              </UCard>
            </div>
          </section>

          <!-- 3. Pet Safety & Care Standards -->
          <section id="pet-safety" class="space-y-6">
            <h2 class="text-3xl font-bold text-gray-900">3. Pet Safety & Care Standards</h2>
            
            <UAlert 
              icon="i-lucide-heart" 
              color="error" 
              variant="solid"
              :title="t('terms.alerts.petSafetyTitle')"
              :description="t('terms.alerts.petSafetyDesc')"
            />

            <div class="space-y-4">
              <UCard v-for="standard in petSafetyStandards" :key="standard.category">
                <template #header>
                  <h3 class="text-lg font-semibold flex items-center gap-2">
                    <UIcon :name="standard.icon" :class="standard.color" />
                    {{ standard.category }}
                  </h3>
                </template>
                <div class="space-y-3">
                  <p class="text-sm text-gray-600">{{ standard.description }}</p>
                  <ul class="space-y-1">
                    <li v-for="requirement in standard.requirements" :key="requirement" class="text-sm text-gray-600 flex items-start gap-2">
                      <UIcon name="i-lucide-shield-check" class="text-green-500 w-4 h-4 mt-0.5 flex-shrink-0" />
                      {{ requirement }}
                    </li>
                  </ul>
                </div>
              </UCard>
            </div>
          </section>

          <!-- 4. Community Guidelines -->
          <section id="community-guidelines" class="space-y-6">
            <h2 class="text-3xl font-bold text-gray-900">4. Community Guidelines & Behavior</h2>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <UCard v-for="guideline in communityGuidelines" :key="guideline.title">
                <template #header>
                  <h3 class="text-lg font-semibold flex items-center gap-2">
                    <UIcon :name="guideline.icon" :class="guideline.color" />
                    {{ guideline.title }}
                  </h3>
                </template>
                <div class="space-y-3">
                  <p class="text-sm text-gray-600">{{ guideline.description }}</p>
                  <ul class="space-y-1">
                    <li v-for="rule in guideline.rules" :key="rule" class="text-sm text-gray-600 flex items-start gap-2">
                      <UIcon name="i-lucide-star" class="text-yellow-500 w-4 h-4 mt-0.5 flex-shrink-0" />
                      {{ rule }}
                    </li>
                  </ul>
                </div>
              </UCard>
            </div>
          </section>

          <!-- 5. Age Requirements & Minor Protection -->
          <section id="age-requirements" class="space-y-6">
            <h2 class="text-3xl font-bold text-gray-900">5. Age Requirements & Minor Protection</h2>
            
            <UAlert 
              icon="i-lucide-baby" 
              color="warning" 
              variant="solid"
              title="Age Verification Required"
              description="We take child safety seriously and have specific protections in place."
            />

            <div class="space-y-4">
              <UCard v-for="ageGroup in ageRequirements" :key="ageGroup.group">
                <template #header>
                  <div class="flex items-center justify-between">
                    <h3 class="text-lg font-semibold flex items-center gap-2">
                      <UIcon :name="ageGroup.icon" :class="ageGroup.color" />
                      {{ ageGroup.group }}
                    </h3>
                    <UBadge 
                      :color="ageGroup.allowed ? 'success' : 'error'" 
                      variant="subtle"
                    >
                      {{ ageGroup.allowed ? 'Allowed with conditions' : 'Not permitted' }}
                    </UBadge>
                  </div>
                </template>
                <div class="space-y-3">
                  <p class="text-sm text-gray-600">{{ ageGroup.description }}</p>
                  <ul class="space-y-1">
                    <li v-for="requirement in ageGroup.requirements" :key="requirement" class="text-sm text-gray-600 flex items-start gap-2">
                      <UIcon name="i-lucide-shield" class="text-blue-500 w-4 h-4 mt-0.5 flex-shrink-0" />
                      {{ requirement }}
                    </li>
                  </ul>
                </div>
              </UCard>
            </div>
          </section>

          <!-- 6. Service Provider Terms -->
          <section id="service-providers" class="space-y-6">
            <h2 class="text-3xl font-bold text-gray-900">6. Service Provider Terms</h2>
            
            <div class="space-y-4">
              <UCard v-for="providerType in serviceProviderTerms" :key="providerType.type">
                <template #header>
                  <h3 class="text-lg font-semibold flex items-center gap-2">
                    <UIcon :name="providerType.icon" :class="providerType.color" />
                    {{ providerType.type }}
                  </h3>
                </template>
                <div class="space-y-3">
                  <p class="text-sm text-gray-600">{{ providerType.description }}</p>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 class="font-medium text-sm mb-2">Requirements:</h4>
                      <ul class="space-y-1">
                        <li v-for="requirement in providerType.requirements" :key="requirement" class="text-xs text-gray-600 flex items-start gap-2">
                          <UIcon name="i-lucide-check-circle" class="text-green-500 w-3 h-3 mt-0.5 flex-shrink-0" />
                          {{ requirement }}
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h4 class="font-medium text-sm mb-2">Responsibilities:</h4>
                      <ul class="space-y-1">
                        <li v-for="responsibility in providerType.responsibilities" :key="responsibility" class="text-xs text-gray-600 flex items-start gap-2">
                          <UIcon name="i-lucide-briefcase" class="text-blue-500 w-3 h-3 mt-0.5 flex-shrink-0" />
                          {{ responsibility }}
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </UCard>
            </div>
          </section>

          <!-- 7. Liability & Insurance -->
          <section id="liability" class="space-y-6">
            <h2 class="text-3xl font-bold text-gray-900">7. Liability & Insurance</h2>
            
            <UAlert 
              icon="i-lucide-shield-alert" 
              color="warning" 
              variant="subtle"
              title="Important Legal Information"
              description="Understanding liability and insurance is crucial for all community members."
            />

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <UCard v-for="liability in liabilityTerms" :key="liability.title">
                <template #header>
                  <h3 class="text-lg font-semibold flex items-center gap-2">
                    <UIcon :name="liability.icon" :class="liability.color" />
                    {{ liability.title }}
                  </h3>
                </template>
                <div class="space-y-3">
                  <p class="text-sm text-gray-600">{{ liability.description }}</p>
                  <ul class="space-y-1">
                    <li v-for="point in liability.points" :key="point" class="text-sm text-gray-600 flex items-start gap-2">
                      <UIcon name="i-lucide-scale" class="text-purple-500 w-4 h-4 mt-0.5 flex-shrink-0" />
                      {{ point }}
                    </li>
                  </ul>
                </div>
              </UCard>
            </div>
          </section>

          <!-- 8. Platform Rules & Enforcement -->
          <section id="platform-rules" class="space-y-6">
            <h2 class="text-3xl font-bold text-gray-900">8. Platform Rules & Enforcement</h2>
            
            <div class="space-y-4">
              <UCard v-for="enforcement in enforcementPolicies" :key="enforcement.category">
                <template #header>
                  <h3 class="text-lg font-semibold flex items-center gap-2">
                    <UIcon :name="enforcement.icon" :class="enforcement.color" />
                    {{ enforcement.category }}
                  </h3>
                </template>
                <div class="space-y-3">
                  <p class="text-sm text-gray-600">{{ enforcement.description }}</p>
                  <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div v-for="action in enforcement.actions" :key="action.severity" class="border rounded-lg p-3">
                      <div class="flex items-center gap-2 mb-2">
                        <UBadge 
                          :color="action.color as 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'error'" 
                          variant="subtle"
                        >
                          {{ action.severity }}
                        </UBadge>
                      </div>
                      <ul class="space-y-1">
                        <li v-for="consequence in action.consequences" :key="consequence" class="text-xs text-gray-600">
                          {{ consequence }}
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </UCard>
            </div>
          </section>

          <!-- 9. Payments & Refunds -->
          <section id="payments" class="space-y-6">
            <h2 class="text-3xl font-bold text-gray-900">9. Payments & Refunds</h2>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <UCard v-for="payment in paymentTerms" :key="payment.type">
                <template #header>
                  <h3 class="text-lg font-semibold flex items-center gap-2">
                    <UIcon :name="payment.icon" :class="payment.color" />
                    {{ payment.type }}
                  </h3>
                </template>
                <div class="space-y-3">
                  <p class="text-sm text-gray-600">{{ payment.description }}</p>
                  <ul class="space-y-1">
                    <li v-for="term in payment.terms" :key="term" class="text-sm text-gray-600 flex items-start gap-2">
                      <UIcon name="i-lucide-credit-card" class="text-green-500 w-4 h-4 mt-0.5 flex-shrink-0" />
                      {{ term }}
                    </li>
                  </ul>
                </div>
              </UCard>
            </div>
          </section>

          <!-- 10. Termination & Account Closure -->
          <section id="termination" class="space-y-6">
            <h2 class="text-3xl font-bold text-gray-900">10. Account Termination</h2>
            
            <div class="space-y-4">
              <UCard v-for="termination in terminationPolicies" :key="termination.type">
                <template #header>
                  <h3 class="text-lg font-semibold flex items-center gap-2">
                    <UIcon :name="termination.icon" :class="termination.color" />
                    {{ termination.type }}
                  </h3>
                </template>
                <div class="space-y-3">
                  <p class="text-sm text-gray-600">{{ termination.description }}</p>
                  <ul class="space-y-1">
                    <li v-for="condition in termination.conditions" :key="condition" class="text-sm text-gray-600 flex items-start gap-2">
                      <UIcon name="i-lucide-x-circle" class="text-red-500 w-4 h-4 mt-0.5 flex-shrink-0" />
                      {{ condition }}
                    </li>
                  </ul>
                </div>
              </UCard>
            </div>
          </section>

          <!-- 11. Dispute Resolution -->
          <section id="disputes" class="space-y-6">
            <h2 class="text-3xl font-bold text-gray-900">11. Dispute Resolution</h2>
            
            <UAlert 
              icon="i-lucide-handshake" 
              color="info" 
              variant="subtle"
              title="We're Here to Help"
              description="Most disputes can be resolved through communication and our support team."
            />

            <div class="space-y-4">
              <UCard v-for="resolution in disputeResolution" :key="resolution.step">
                <template #header>
                  <h3 class="text-lg font-semibold flex items-center gap-2">
                    <UBadge color="primary" variant="subtle">Step {{ resolution.step }}</UBadge>
                    <span>{{ resolution.title }}</span>
                  </h3>
                </template>
                <div class="space-y-3">
                  <p class="text-sm text-gray-600">{{ resolution.description }}</p>
                  <ul class="space-y-1">
                    <li v-for="action in resolution.actions" :key="action" class="text-sm text-gray-600 flex items-start gap-2">
                      <UIcon name="i-lucide-arrow-right" class="text-blue-500 w-4 h-4 mt-0.5 flex-shrink-0" />
                      {{ action }}
                    </li>
                  </ul>
                </div>
              </UCard>
            </div>
          </section>

          <!-- 12. Legal & Compliance -->
          <section id="legal" class="space-y-6">
            <h2 class="text-3xl font-bold text-gray-900">12. Legal Information</h2>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <UCard v-for="legal in legalInformation" :key="legal.topic">
                <template #header>
                  <h3 class="text-lg font-semibold flex items-center gap-2">
                    <UIcon :name="legal.icon" :class="legal.color" />
                    {{ legal.topic }}
                  </h3>
                </template>
                <div class="space-y-3">
                  <p class="text-sm text-gray-600">{{ legal.description }}</p>
                  <ul class="space-y-1">
                    <li v-for="detail in legal.details" :key="detail" class="text-sm text-gray-600 flex items-start gap-2">
                      <UIcon name="i-lucide-book-open" class="text-gray-400 w-4 h-4 mt-0.5 flex-shrink-0" />
                      {{ detail }}
                    </li>
                  </ul>
                </div>
              </UCard>
            </div>
          </section>

          <!-- 13. Contact & Support -->
          <section id="contact" class="space-y-6">
            <h2 class="text-3xl font-bold text-gray-900">13. Contact & Support</h2>
            
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
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// Meta tags for SEO
useHead({
  title: 'Terms of Service - PawGo',
  meta: [
    {
      name: 'description',
      content: 'PawGo Terms of Service - Comprehensive guidelines for using our pet community platform safely and responsibly.'
    }
  ]
})

const { t } = useI18n()
const lastUpdated = ref('August 15, 2025')

const tableOfContents = ref([
  { id: 'agreement', title: '1. Agreement & Acceptance' },
  { id: 'user-responsibilities', title: '2. User Responsibilities' },
  { id: 'pet-safety', title: '3. Pet Safety & Care Standards' },
  { id: 'community-guidelines', title: '4. Community Guidelines' },
  { id: 'age-requirements', title: '5. Age Requirements & Minor Protection' },
  { id: 'service-providers', title: '6. Service Provider Terms' },
  { id: 'liability', title: '7. Liability & Insurance' },
  { id: 'platform-rules', title: '8. Platform Rules & Enforcement' },
  { id: 'payments', title: '9. Payments & Refunds' },
  { id: 'termination', title: '10. Account Termination' },
  { id: 'disputes', title: '11. Dispute Resolution' },
  { id: 'legal', title: '12. Legal Information' },
  { id: 'contact', title: '13. Contact & Support' }
])

const agreementCoverage = ref([
  'Your rights and responsibilities as a PawGo member',
  'Pet safety standards and care requirements',
  'Community guidelines and behavior expectations',
  'Service provider terms and obligations',
  'Privacy protection and data handling',
  'Payment processing and refund policies',
  'Dispute resolution and legal procedures',
  'Platform rules and enforcement actions'
])

const userResponsibilities = ref([
  {
    title: 'Account Integrity',
    icon: 'i-lucide-user-check',
    color: 'text-blue-500',
    rules: [
      'Provide accurate and truthful information',
      'Keep your account secure and confidential',
      'Update information when it changes',
      'Don\'t share accounts or impersonate others',
      'Report suspicious activity immediately',
      'Maintain only one personal account'
    ]
  },
  {
    title: 'Respectful Communication',
    icon: 'i-lucide-message-circle-heart',
    color: 'text-green-500',
    rules: [
      'Be kind and respectful to all community members',
      'No harassment, bullying, or threatening behavior',
      'Respect different opinions and experiences',
      'Use appropriate language in all communications',
      'Report inappropriate behavior when you see it',
      'Help maintain a positive community atmosphere'
    ]
  },
  {
    title: 'Content Standards',
    icon: 'i-lucide-image',
    color: 'text-purple-500',
    rules: [
      'Only share appropriate photos and content',
      'No graphic, violent, or disturbing images',
      'Respect intellectual property and copyrights',
      'Don\'t spam or post repetitive content',
      'Keep content relevant to pets and community',
      'Follow platform content guidelines'
    ]
  },
  {
    title: 'Legal Compliance',
    icon: 'i-lucide-scale',
    color: 'text-orange-500',
    rules: [
      'Follow all local, state, and federal laws',
      'Comply with pet ownership regulations',
      'Respect licensing and permit requirements',
      'Don\'t use the platform for illegal activities',
      'Report illegal behavior to authorities',
      'Cooperate with law enforcement when requested'
    ]
  }
])

const petSafetyStandards = ref([
  {
    category: 'Basic Pet Care',
    icon: 'i-lucide-heart',
    color: 'text-red-500',
    description: 'Fundamental care requirements for all pets on the platform.',
    requirements: [
      'Ensure pets are healthy and up-to-date on vaccinations',
      'Provide proper food, water, and shelter',
      'Maintain basic hygiene and grooming',
      'Seek veterinary care when needed',
      'Never leave pets unsupervised in dangerous situations',
      'Follow species-specific care guidelines'
    ]
  },
  {
    category: 'Walk & Activity Safety',
    icon: 'i-lucide-footprints',
    color: 'text-blue-500',
    description: 'Safety requirements for walks, playdates, and activities.',
    requirements: [
      'Use proper leashes and safety equipment',
      'Supervise pets at all times during activities',
      'Ensure pets are socialized and well-behaved',
      'Respect other pets\' boundaries and comfort levels',
      'Clean up after your pet immediately',
      'Know your pet\'s limits and energy levels'
    ]
  },
  {
    category: 'Emergency Preparedness',
    icon: 'i-lucide-phone',
    color: 'text-green-500',
    description: 'Required preparations for pet emergencies.',
    requirements: [
      'Provide emergency contact information',
      'Have veterinary contact details readily available',
      'Know your pet\'s medical history and conditions',
      'Carry basic first aid supplies during activities',
      'Have a plan for emergency situations',
      'Inform others of any special needs or conditions'
    ]
  },
  {
    category: 'Professional Services',
    icon: 'i-lucide-briefcase',
    color: 'text-purple-500',
    description: 'Standards for professional pet service providers.',
    requirements: [
      'Maintain proper insurance and bonding',
      'Have relevant certifications and training',
      'Follow professional ethics and standards',
      'Provide safe and appropriate environments',
      'Maintain detailed records of care provided',
      'Communicate regularly with pet owners'
    ]
  }
])

const communityGuidelines = ref([
  {
    title: 'Inclusive Environment',
    icon: 'i-lucide-heart-handshake',
    color: 'text-pink-500',
    description: 'We welcome everyone who loves pets and treats others with respect.',
    rules: [
      'Embrace diversity in our community',
      'Support new members and help them learn',
      'Share knowledge and experiences generously',
      'Celebrate different pet types and care approaches',
      'Be patient with those learning about pet care',
      'Foster connections and friendships'
    ]
  },
  {
    title: 'Safety First',
    icon: 'i-lucide-shield-check',
    color: 'text-blue-500',
    description: 'Pet and human safety is our top priority in all interactions.',
    rules: [
      'Always prioritize pet welfare and safety',
      'Report unsafe situations immediately',
      'Share safety tips and best practices',
      'Be cautious when meeting new people',
      'Trust your instincts about situations',
      'Help create a secure environment for everyone'
    ]
  },
  {
    title: 'Helpful Support',
    icon: 'i-lucide-helping-hand',
    color: 'text-green-500',
    description: 'We support each other through challenges and celebrate successes.',
    rules: [
      'Offer help and advice when appropriate',
      'Be supportive during difficult times',
      'Share resources and recommendations',
      'Celebrate pet milestones and achievements',
      'Provide encouragement to fellow pet owners',
      'Connect people with similar interests'
    ]
  },
  {
    title: 'Constructive Engagement',
    icon: 'i-lucide-message-square-plus',
    color: 'text-orange-500',
    description: 'Engage constructively and help build a positive community.',
    rules: [
      'Share experiences and learn from others',
      'Ask questions and seek advice when needed',
      'Provide thoughtful feedback and suggestions',
      'Participate in community events and activities',
      'Help moderate discussions and keep them positive',
      'Contribute to the growth of our community'
    ]
  }
])

const ageRequirements = ref([
  {
    group: 'Under 13 Years',
    icon: 'i-lucide-baby',
    color: 'text-red-500',
    allowed: false,
    description: 'Children under 13 are not permitted to use PawGo for their protection.',
    requirements: [
      'Platform not accessible to children under 13',
      'Age verification required during registration',
      'Immediate account termination if under-age use detected',
      'Parents must supervise any pet-related activities',
      'Alternative family-friendly resources available',
      'Report suspected under-age accounts immediately'
    ]
  },
  {
    group: '13-15 Years',
    icon: 'i-lucide-user-check',
    color: 'text-orange-500',
    allowed: true,
    description: 'Teens aged 13-15 can use PawGo with parental consent and supervision.',
    requirements: [
      'Verified parental consent required',
      'Limited messaging and communication features',
      'Enhanced privacy protections active',
      'Parent/guardian must approve activities',
      'Cannot provide professional pet services',
      'Regular check-ins with parents/guardians required'
    ]
  },
  {
    group: '16-17 Years',
    icon: 'i-lucide-users',
    color: 'text-yellow-500',
    allowed: true,
    description: 'Older teens can participate more fully with some restrictions.',
    requirements: [
      'Parental awareness and consent recommended',
      'Cannot offer certain professional services',
      'Limited payment and financial features',
      'Enhanced safety monitoring active',
      'Must follow additional safety protocols',
      'Parents notified of certain activities'
    ]
  },
  {
    group: '18+ Years',
    icon: 'i-lucide-user',
    color: 'text-green-500',
    allowed: true,
    description: 'Adults have full access to all platform features and services.',
    requirements: [
      'Full access to all platform features',
      'Can provide professional pet services',
      'Responsible for their own safety',
      'May supervise minor family members',
      'Can participate in all community activities',
      'Subject to all adult liability terms'
    ]
  }
])

const serviceProviderTerms = ref([
  {
    type: 'Pet Sitters & Walkers',
    icon: 'i-lucide-heart',
    color: 'text-pink-500',
    description: 'Individuals providing pet sitting, walking, and basic care services.',
    requirements: [
      'Valid government-issued ID verification',
      'Basic pet care knowledge and experience',
      'Clean background check (no animal abuse)',
      'Professional liability insurance recommended',
      'First aid certification encouraged',
      'Local licensing if required by law'
    ],
    responsibilities: [
      'Follow all pet care instructions precisely',
      'Maintain constant supervision during care',
      'Communicate regularly with pet owners',
      'Handle emergencies appropriately',
      'Respect client privacy and property',
      'Provide detailed care reports'
    ]
  },
  {
    type: 'Veterinarians & Medical',
    icon: 'i-lucide-stethoscope',
    color: 'text-blue-500',
    description: 'Licensed veterinary professionals providing medical advice and services.',
    requirements: [
      'Valid veterinary license in good standing',
      'Professional malpractice insurance',
      'Continuing education compliance',
      'State board registration verification',
      'Clean disciplinary record',
      'Clinic or practice affiliation'
    ],
    responsibilities: [
      'Provide accurate medical advice only',
      'Maintain professional standards at all times',
      'Respect client confidentiality',
      'Refer complex cases appropriately',
      'Follow all regulatory requirements',
      'Maintain detailed medical records'
    ]
  },
  {
    type: 'Trainers & Behaviorists',
    icon: 'i-lucide-brain',
    color: 'text-purple-500',
    description: 'Certified animal trainers and behavior specialists.',
    requirements: [
      'Recognized certification in animal training',
      'Positive reinforcement methodology',
      'Continuing education in animal behavior',
      'Professional liability insurance',
      'References from previous clients',
      'Clean background check'
    ],
    responsibilities: [
      'Use only humane training methods',
      'Assess pets before training begins',
      'Provide detailed training plans',
      'Monitor progress and adjust methods',
      'Educate owners on training techniques',
      'Report serious behavioral concerns'
    ]
  },
  {
    type: 'Groomers & Spa Services',
    icon: 'i-lucide-scissors',
    color: 'text-green-500',
    description: 'Professional grooming and pet spa service providers.',
    requirements: [
      'Professional grooming certification',
      'Sanitization and safety training',
      'Professional liability insurance',
      'Current health and safety permits',
      'Equipment safety certifications',
      'CPR/First aid training for pets'
    ],
    responsibilities: [
      'Maintain clean and safe facilities',
      'Use proper sanitization procedures',
      'Handle pets gently and safely',
      'Recognize signs of distress or illness',
      'Follow breed-specific grooming standards',
      'Provide after-care instructions'
    ]
  }
])

const liabilityTerms = ref([
  {
    title: 'Platform Liability',
    icon: 'i-lucide-shield',
    color: 'text-blue-500',
    description: 'PawGo\'s role and limitations as a platform provider.',
    points: [
      'PawGo acts as a connection platform, not a service provider',
      'Users are responsible for their own interactions and agreements',
      'Platform provides tools but cannot guarantee outcomes',
      'Limited liability for third-party actions or services',
      'Insurance recommendations but not requirements',
      'Clear dispute resolution processes available'
    ]
  },
  {
    title: 'User Liability',
    icon: 'i-lucide-user',
    color: 'text-green-500',
    description: 'Individual user responsibilities and potential liabilities.',
    points: [
      'Users liable for their pets\' actions and behavior',
      'Responsible for accurate representation of pets and services',
      'Must maintain appropriate insurance coverage',
      'Liable for property damage caused by pets',
      'Responsible for following local laws and regulations',
      'Must report incidents and emergencies promptly'
    ]
  },
  {
    title: 'Service Provider Liability',
    icon: 'i-lucide-briefcase',
    color: 'text-purple-500',
    description: 'Professional liability requirements for service providers.',
    points: [
      'Professional liability insurance strongly recommended',
      'Responsible for quality and safety of services provided',
      'Must follow professional standards and ethics',
      'Liable for negligence or misconduct',
      'Required to maintain detailed service records',
      'Must report serious incidents immediately'
    ]
  },
  {
    title: 'Emergency Situations',
    icon: 'i-lucide-phone',
    color: 'text-red-500',
    description: 'Liability and responsibilities during emergencies.',
    points: [
      'Good Samaritan protections for emergency aid',
      'Immediate veterinary care authorized in emergencies',
      'Emergency contact notification requirements',
      'Detailed incident reporting required',
      'Cooperation with emergency services mandatory',
      'No liability for reasonable emergency decisions'
    ]
  }
])

const enforcementPolicies = ref([
  {
    category: 'Community Violations',
    icon: 'i-lucide-users-x',
    color: 'text-orange-500',
    description: 'Actions taken for community guideline violations.',
    actions: [
      {
        severity: 'Minor',
        color: 'yellow',
        consequences: [
          'Friendly reminder and education',
          'Content removal if necessary',
          'Temporary feature restrictions'
        ]
      },
      {
        severity: 'Moderate',
        color: 'orange',
        consequences: [
          'Formal warning issued',
          '1-7 day temporary suspension',
          'Required acknowledgment of guidelines'
        ]
      },
      {
        severity: 'Severe',
        color: 'red',
        consequences: [
          'Permanent account suspension',
          'Content removal and ban',
          'Report to authorities if applicable'
        ]
      }
    ]
  },
  {
    category: 'Safety Violations',
    icon: 'i-lucide-shield-x',
    color: 'text-red-500',
    description: 'Immediate actions for safety-related violations.',
    actions: [
      {
        severity: 'Pet Neglect',
        color: 'orange',
        consequences: [
          'Immediate service suspension',
          'Required safety training',
          'Monitoring period before reinstatement'
        ]
      },
      {
        severity: 'Pet Abuse',
        color: 'red',
        consequences: [
          'Immediate permanent ban',
          'Report to animal control/police',
          'Full cooperation with investigations'
        ]
      },
      {
        severity: 'Human Safety',
        color: 'red',
        consequences: [
          'Immediate account termination',
          'Report to law enforcement',
          'Evidence preservation for authorities'
        ]
      }
    ]
  },
  {
    category: 'Professional Misconduct',
    icon: 'i-lucide-briefcase-x',
    color: 'text-purple-500',
    description: 'Actions for service provider misconduct.',
    actions: [
      {
        severity: 'Minor Issues',
        color: 'yellow',
        consequences: [
          'Additional training required',
          'Increased monitoring period',
          'Client notification if necessary'
        ]
      },
      {
        severity: 'Professional Violations',
        color: 'orange',
        consequences: [
          'Service provider suspension',
          'Professional board notification',
          'Re-certification requirements'
        ]
      },
      {
        severity: 'Serious Misconduct',
        color: 'red',
        consequences: [
          'Permanent service ban',
          'Professional license reporting',
          'Legal action if warranted'
        ]
      }
    ]
  }
])

const paymentTerms = ref([
  {
    type: 'Service Payments',
    icon: 'i-lucide-credit-card',
    color: 'text-green-500',
    description: 'Payment processing for pet services and bookings.',
    terms: [
      'Secure payment processing through verified providers',
      'Payment held in escrow until service completion',
      'Automatic release 24 hours after service unless disputed',
      'Service providers receive payment minus platform fees',
      'Refund protection for cancelled or unsatisfactory services',
      'Detailed transaction records for all parties'
    ]
  },
  {
    type: 'Refund Policy',
    icon: 'i-lucide-rotate-ccw',
    color: 'text-blue-500',
    description: 'Fair refund policies protecting both users and service providers.',
    terms: [
      'Full refund for services cancelled 24+ hours in advance',
      '50% refund for cancellations 2-24 hours before service',
      'No refund for cancellations less than 2 hours before',
      'Emergency cancellations considered on case-by-case basis',
      'Unsatisfactory service refunds processed within 5 business days',
      'Dispute resolution available for payment disagreements'
    ]
  },
  {
    type: 'Platform Fees',
    icon: 'i-lucide-percent',
    color: 'text-purple-500',
    description: 'Transparent fee structure for platform services.',
    terms: [
      'Service providers pay 15% platform fee on completed bookings',
      'Users pay no additional fees beyond service costs',
      'Payment processing fees included in platform fee',
      'No hidden charges or surprise fees',
      'Fee structure clearly displayed before booking',
      'Annual membership options available for frequent users'
    ]
  },
  {
    type: 'Financial Security',
    icon: 'i-lucide-shield-check',
    color: 'text-orange-500',
    description: 'Protection of financial information and transactions.',
    terms: [
      'PCI DSS compliant payment processing',
      'No storage of credit card information on our servers',
      'Encrypted transmission of all financial data',
      'Fraud detection and prevention systems active',
      'Secure authentication for all transactions',
      'Regular security audits and compliance checks'
    ]
  }
])

const terminationPolicies = ref([
  {
    type: 'Voluntary Termination',
    icon: 'i-lucide-log-out',
    color: 'text-blue-500',
    description: 'Users can terminate their accounts at any time.',
    conditions: [
      'Complete any pending service obligations',
      'Resolve outstanding payments or disputes',
      'Download personal data before deletion',
      '30-day grace period for account recovery',
      'Immediate removal from search and discovery',
      'Permanent deletion after grace period'
    ]
  },
  {
    type: 'Policy Violations',
    icon: 'i-lucide-x-circle',
    color: 'text-red-500',
    description: 'Account termination for serious policy violations.',
    conditions: [
      'Immediate suspension for safety violations',
      'Investigation period of up to 14 days',
      'Right to appeal termination decision',
      'No refund for services already provided',
      'Cooperation required with ongoing investigations',
      'Permanent ban from creating new accounts'
    ]
  },
  {
    type: 'Inactive Accounts',
    icon: 'i-lucide-clock',
    color: 'text-gray-500',
    description: 'Handling of accounts with extended inactivity.',
    conditions: [
      'Warning email sent after 12 months of inactivity',
      'Account deactivation after 18 months if no response',
      'Data retention according to privacy policy',
      'Easy reactivation process available',
      'All data preserved during deactivation period',
      'Final deletion notice sent before permanent removal'
    ]
  }
])

const disputeResolution = ref([
  {
    step: 1,
    title: 'Direct Communication',
    description: 'Most issues can be resolved through direct, respectful communication.',
    actions: [
      'Reach out to the other party politely and clearly',
      'Explain your concerns and desired resolution',
      'Give reasonable time for response and resolution',
      'Document all communications for reference',
      'Try to find mutually acceptable solutions',
      'Keep discussions focused on the specific issue'
    ]
  },
  {
    step: 2,
    title: 'Platform Mediation',
    description: 'Our support team can help mediate disputes between users.',
    actions: [
      'Contact our support team with detailed information',
      'Provide evidence and documentation of the issue',
      'Participate in good faith mediation process',
      'Follow mediator suggestions and recommendations',
      'Work toward fair resolution for all parties',
      'Accept mediated settlement agreements'
    ]
  },
  {
    step: 3,
    title: 'Formal Resolution',
    description: 'For serious disputes that cannot be resolved through mediation.',
    actions: [
      'Submit formal dispute through our resolution center',
      'Provide comprehensive evidence and witness statements',
      'Participate in formal review process',
      'Accept binding decisions from resolution panel',
      'Follow through on resolution requirements',
      'Understand that decisions are final'
    ]
  },
  {
    step: 4,
    title: 'Legal Action',
    description: 'As a last resort, legal proceedings may be necessary.',
    actions: [
      'Exhaust all platform resolution options first',
      'Follow local jurisdiction and applicable laws',
      'Understand that legal costs are your responsibility',
      'Provide platform cooperation as legally required',
      'Accept that platform cannot provide legal advice',
      'Recognize limits of platform involvement in legal matters'
    ]
  }
])

const legalInformation = ref([
  {
    topic: 'Governing Law',
    icon: 'i-lucide-map-pin',
    color: 'text-blue-500',
    description: 'Legal jurisdiction and applicable laws for platform operations.',
    details: [
      'Platform governed by laws of [Jurisdiction]',
      'Users subject to local laws in their jurisdiction',
      'International users subject to applicable treaties',
      'Disputes resolved in [Jurisdiction] courts',
      'Local regulations may impose additional requirements',
      'Professional licensing governed by local authorities'
    ]
  },
  {
    topic: 'Intellectual Property',
    icon: 'i-lucide-copyright',
    color: 'text-green-500',
    description: 'Protection of intellectual property rights on the platform.',
    details: [
      'Users retain rights to their original content',
      'Platform license to use content for service provision',
      'Respect for third-party intellectual property required',
      'DMCA compliance and takedown procedures available',
      'Trademark and copyright infringement prohibited',
      'Fair use principles apply to shared content'
    ]
  },
  {
    topic: 'Privacy & Data Protection',
    icon: 'i-lucide-shield',
    color: 'text-purple-500',
    description: 'Legal compliance with privacy and data protection laws.',
    details: [
      'GDPR compliance for European Union users',
      'CCPA compliance for California residents',
      'Data processing agreements with service providers',
      'User rights respected according to applicable laws',
      'Cross-border data transfer protections in place',
      'Regular compliance audits and updates'
    ]
  },
  {
    topic: 'Accessibility',
    icon: 'i-lucide-accessibility',
    color: 'text-orange-500',
    description: 'Commitment to accessibility and equal access to services.',
    details: [
      'WCAG 2.1 AA compliance for web accessibility',
      'Reasonable accommodations for disabilities',
      'Alternative formats available upon request',
      'Assistive technology compatibility maintained',
      'Regular accessibility testing and improvements',
      'User feedback welcomed for accessibility enhancements'
    ]
  }
])

const contactMethods = ref([
  {
    type: 'Legal & Compliance',
    icon: 'i-lucide-scale',
    color: 'text-blue-500',
    description: 'For legal questions, compliance issues, and terms clarification.',
    methods: [
      { icon: 'i-lucide-mail', label: 'Email', value: 'legal@pawgo.com' },
      { icon: 'i-lucide-clock', label: 'Response Time', value: '5 business days' },
      { icon: 'i-lucide-building', label: 'Office Hours', value: '9 AM - 5 PM CET' }
    ],
    action: { label: 'Contact Legal Team', type: 'contact-legal' }
  },
  {
    type: 'Terms & Policy Support',
    icon: 'i-lucide-help-circle',
    color: 'text-green-500',
    description: 'For questions about these terms and platform policies.',
    methods: [
      { icon: 'i-lucide-mail', label: 'Email', value: 'support@pawgo.com' },
      { icon: 'i-lucide-message-circle', label: 'Live Chat', value: 'Available 24/7' },
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

function handleContactAction(contactType: string) {
  switch (contactType) {
    case 'contact-legal':
      window.location.href = 'mailto:legal@pawgo.com'
      break
    case 'general-support':
      navigateTo('/support')
      break
  }
}
</script>
