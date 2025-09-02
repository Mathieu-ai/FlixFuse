<template>
  <UContainer class="py-8">
    <UCard class="max-w-6xl mx-auto">
      <template #header>
        <div class="text-center">
          <h1 class="text-4xl font-bold mb-2">{{ t('about.title') }}</h1>
          <p class="text-gray-600 dark:text-gray-300">{{ t('about.subtitle') }}</p>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-2">
            {{ t('about.description') }}
          </p>
        </div>
      </template>

      <div class="space-y-8">
        <!-- Hero Section -->
        <UCard>
          <div class="text-center space-y-6 p-8">
            <div class="flex justify-center">
              <div class="w-24 h-24 bg-gradient-to-br from-primary to-purple-600 rounded-full flex items-center justify-center">
                <UIcon name="i-lucide-heart" class="text-white text-4xl" />
              </div>
            </div>
            <div class="space-y-4">
              <h2 class="text-3xl font-bold">{{ t('about.hero.title') }}</h2>
              <p class="text-lg text-gray-600 dark:text-gray-300 max-w-4xl mx-auto">{{ t('about.hero.description') }}</p>
              <div class="flex flex-wrap justify-center gap-2">
                <UBadge v-for="value in missionStatement.values" :key="value" color="primary" variant="subtle">
                  {{ t(`about.missionStatement.statements.${value}`) }}
                </UBadge>
              </div>
            </div>
          </div>
        </UCard>

        <UAlert
          icon="i-lucide-flask-conical"
          color="warning"
          variant="subtle"
          :title="t('about.beta.title')"
          :description="t('about.beta.description')"
        />

        <!-- Our Story -->
        <section id="our-story" class="space-y-6">
          <h2 class="text-3xl font-bold">{{ t('about.ourStory.title') }}</h2>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <UCard>
                <template #header>
                  <h3 class="text-xl font-semibold flex items-center gap-2">
                    <UIcon name="i-lucide-lightbulb" class="text-yellow-500" />
                    {{ t('about.ourStory.beginning.heading') }}
                  </h3>
                </template>
                <div class="space-y-4">
                  <p class="text-sm text-slate-400">{{ t('about.ourStory.beginning.p1') }}</p>
                  <p class="text-sm text-slate-400">{{ t('about.ourStory.beginning.p2') }}</p>
                </div>
              </UCard>

              <UCard>
                <template #header>
                  <h3 class="text-xl font-semibold flex items-center gap-2">
                    <UIcon name="i-lucide-users" class="text-blue-500" />
                    {{ t('about.ourStory.growing.heading') }}
                  </h3>
                </template>
                <div class="space-y-4">
                  <p class="text-sm text-slate-400">{{ t('about.ourStory.growing.p1') }}</p>
                  <p class="text-sm text-slate-400">{{ t('about.ourStory.growing.p2') }}</p>
                  <p class="text-sm text-slate-400">{{ t('about.ourStory.growing.p3') }}</p>
                </div>
              </UCard>
            </div>
          </section>

          <!-- Open Source -->
          <UCard>
            <template #header>
              <h3 class="text-xl font-semibold flex items-center gap-2">
                <UIcon name="i-lucide-git-branch" class="text-gray-700" />
                Open Source & Transparency
              </h3>
            </template>
            <div class="space-y-3">
                <p class="text-sm text-gray-600">{{ t('about.openSource.p1') }}</p>
                <p class="text-sm text-gray-600">{{ t('about.openSource.p2') }}: <a href="https://github.com/Mathieu-ai/PawGo" target="_blank" class="text-primary-500 hover:underline">{{ t('about.openSource.repoLinkText') }}</a></p>
                  <div class="pt-2 flex items-center gap-4">
                <div class="flex items-center gap-2 text-sm text-gray-600">
                  <UIcon name="i-lucide-star" class="text-yellow-500" />
                  <span>
                    <template v-if="repoLoading">{{ t('common.loading') }}</template>
                    <template v-else-if="repoError">{{ t('common.error') }}</template>
                    <template v-else>{{ repoStats.stars ?? 0 }} {{ t('about.openSource.starsLabel') }}</template>
                  </span>
                </div>
                <div class="flex items-center gap-2 text-sm text-gray-600">
                  <UIcon name="i-lucide-book-copy" class="text-gray-500" />
                  <span>
                    <template v-if="repoLoading">{{ t('common.loading') }}</template>
                    <template v-else-if="repoError">{{ t('common.error') }}</template>
                    <template v-else>{{ repoStats.forks ?? 0 }} {{ t('about.openSource.forksLabel') }}</template>
                  </span>
                </div>
                <div v-if="repoError" class="text-xs text-red-500">{{ repoError }}</div>
              </div>
            </div>
          </UCard>

          <!-- What We Do -->
          <section id="what-we-do" class="space-y-6">
            <h2 class="text-3xl font-bold text-gray-900">{{ t('about.whatWeDo.title') }}</h2>
            
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <UCard v-for="service in ourServices" :key="service.key">
                <template #header>
                  <h3 class="text-lg font-semibold flex items-center gap-2">
                    <UIcon :name="service.icon" :class="service.color" />
                    {{ t(`services.${service.key}.title`) }}
                  </h3>
                </template>
                <div class="space-y-3">
                  <p class="text-sm text-gray-600">{{ t(`services.${service.key}.description`) }}</p>
                  <ul class="space-y-1">
                    <li v-for="featureKey in service.features" :key="featureKey" class="text-sm text-gray-600 flex items-start gap-2">
                      <UIcon name="i-lucide-check" class="text-green-500 w-4 h-4 mt-0.5 flex-shrink-0" />
                      {{ t(`services.${service.key}.features.${featureKey}`) }}
                    </li>
                  </ul>
                </div>
              </UCard>
            </div>
          </section>

          <!-- Our Values -->
          <section id="our-values" class="space-y-6">
            <h2 class="text-3xl font-bold text-gray-900">{{ t('about.coreValues.title') }}</h2>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <UCard v-for="value in coreValues" :key="value.key">
                <template #header>
                  <h3 class="text-lg font-semibold flex items-center gap-2">
                    <UIcon :name="value.icon" :class="value.color" />
                    {{ t(`values.${value.key}.title`) }}
                  </h3>
                </template>
                <div class="space-y-3">
                  <p class="text-sm text-gray-600">{{ t(`values.${value.key}.description`) }}</p>
                  <div class="bg-blue-950 rounded-lg p-3">
                    <h4 class="font-medium text-sm mb-2">{{ t('misc.howWeLiveValue') }}</h4>
                    <ul class="space-y-1">
                      <li v-for="exampleKey in value.examples" :key="exampleKey" class="text-xs text-shadow-old-neutral-50 flex items-start gap-2">
                        <UIcon name="i-lucide-arrow-right" class="text-gray-400 w-3 h-3 mt-0.5 flex-shrink-0" />
                        {{ t(`values.${value.key}.examples.${exampleKey}`) }}
                      </li>
                    </ul>
                  </div>
                </div>
              </UCard>
            </div>
          </section>

          <!-- Founder Section -->
          <section id="our-team" class="space-y-6">
            <h2 class="text-3xl font-bold text-gray-900">{{ t('about.founder.title') }}</h2>

            <UCard>
              <template #header>
                <div class="flex items-center gap-4">
                  <div class="w-20 h-20 rounded-full overflow-hidden bg-blue-950 flex items-center justify-center">
                    <img v-if="founderBio.avatar" :src="founderBio.avatar" :alt="`${founderBio.name} avatar`" class="w-full h-full object-cover" />
                    <UIcon v-else name="i-lucide-user" class="text-blue-500 text-2xl" />
                  </div>
                  <div>
                    <h3 class="text-xl font-semibold flex items-center gap-2">
                      {{ founderBio.name }} — Founder
                    </h3>
                    <p class="text-sm text-gray-600">{{ t('misc.founderLocation') }} {{ founderBio.location }}</p>
                  </div>
                </div>
              </template>
              <div class="space-y-4">
                <p class="text-sm text-gray-600">{{ t('about.founder.paragraph1') }}</p>
                <p class="text-sm text-gray-600">{{ t('about.founder.paragraph2') }} <a href="mailto:{{ t('about.joinUs.contactEmail') }}" class="text-primary-500 hover:underline">{{ t('about.joinUs.contactEmail') }}</a>.</p>
        <div class="bg-blue-950 rounded-lg p-3">
                  <h4 class="font-medium text-sm mb-1">{{ t('misc.quickFacts') }}</h4>
                  <ul class="space-y-1 text-xs text-amber-50">
          <li>{{ t('about.founder.quickFacts.github') }}</li>
                    <li>{{ t('about.founder.quickFacts.status') }}</li>
                    <li>{{ t('about.founder.quickFacts.story') }}</li>
                  </ul>
                </div>
              </div>
            </UCard>
          </section>

          <!-- Safety & Trust -->
          <section id="safety-trust" class="space-y-6">
            <h2 class="text-3xl font-bold text-gray-900">{{ t('misc.safetyTrust') }}</h2>
            
            <UAlert 
              icon="i-lucide-shield-check" 
              color="success" 
              variant="solid"
              :title="t('about.safety.alertTitle')"
              :description="t('about.safety.alertDescription')"
            />

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <UCard v-for="safety in safetyMeasures" :key="safety.key">
                <template #header>
                  <h3 class="text-lg font-semibold flex items-center gap-2">
                    <UIcon :name="safety.icon" :class="safety.color" />
                    {{ t(`safety.${safety.key}.title`) }}
                  </h3>
                </template>
                <div class="space-y-3">
                  <p class="text-sm text-gray-600">{{ t(`safety.${safety.key}.description`) }}</p>
                  <ul class="space-y-1">
                    <li v-for="measureKey in safety.measures" :key="measureKey" class="text-sm text-gray-600 flex items-start gap-2">
                      <UIcon name="i-lucide-shield" class="text-green-500 w-4 h-4 mt-0.5 flex-shrink-0" />
                      {{ t(`safety.${safety.key}.measures.${measureKey}`) }}
                    </li>
                  </ul>
                </div>
              </UCard>
            </div>
          </section>

          <!-- Community Impact -->
          <section id="community-impact" class="space-y-6">
            <h2 class="text-3xl font-bold text-gray-900">{{ t('misc.communityImpact') }}</h2>
            
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <UCard v-for="stat in communityStats" :key="stat.key">
                <div class="text-center space-y-3">
                  <div class="flex justify-center">
                    <UIcon :name="stat.icon" :class="`${stat.color} text-3xl`" />
                  </div>
                  <div>
                    <h3 class="text-2xl font-bold text-gray-900">{{ stat.value }}</h3>
                    <p class="text-sm text-gray-600">{{ t(`stats.${stat.key}`) }}</p>
                  </div>
                </div>
              </UCard>
            </div>

            <UCard>
              <template #header>
                <h3 class="text-xl font-semibold">{{ t('about.partnerships.title') }}</h3>
              </template>
              <div class="space-y-4">
                <p class="text-sm text-gray-600">
                  {{ t('misc.communityPartnerships') }}
                </p>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div v-for="partnership in partnerships" :key="partnership.key" class="text-center space-y-2">
                    <UIcon :name="partnership.icon" :class="`${partnership.color} text-2xl`" />
                    <h4 class="font-medium">{{ t(`partnerships.${partnership.key}.title`) }}</h4>
                    <p class="text-xs text-gray-600">{{ t(`partnerships.${partnership.key}.description`) }}</p>
                  </div>
                </div>
              </div>
            </UCard>
          </section>

          <!-- Technology & Innovation -->
          <section id="technology" class="space-y-6">
            <h2 class="text-3xl font-bold text-gray-900">{{ t('about.technology.title') }}</h2>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <UCard v-for="tech in technologyFeatures" :key="tech.key">
                <template #header>
                  <h3 class="text-lg font-semibold flex items-center gap-2">
                    <UIcon :name="tech.icon" :class="tech.color" />
                    {{ t(`technology.${tech.key}.title`) }}
                  </h3>
                </template>
                <div class="space-y-3">
                  <p class="text-sm text-gray-600">{{ t(`technology.${tech.key}.description`) }}</p>
                  <ul class="space-y-1">
                    <li v-for="benefitKey in tech.benefits" :key="benefitKey" class="text-sm text-gray-600 flex items-start gap-2">
                      <UIcon name="i-lucide-sparkles" class="text-yellow-500 w-4 h-4 mt-0.5 flex-shrink-0" />
                      {{ t(`technology.${tech.key}.benefits.${benefitKey}`) }}
                    </li>
                  </ul>
                </div>
              </UCard>
            </div>
          </section>

          <!-- Future Vision -->
          <section id="future-vision" class="space-y-6">
            <h2 class="text-3xl font-bold text-gray-900">{{ t('about.futureVision.title') }}</h2>
            
            <UCard>
              <div class="space-y-6">
                <div class="text-center">
                  <h3 class="text-2xl font-semibold text-gray-900 mb-2">{{ t('about.futureVision.heroTitle') }}</h3>
                  <p class="text-lg text-gray-600 max-w-3xl mx-auto">
                    {{ t('about.futureVision.heroParagraph') }}
                  </p>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div v-for="goal in futureGoals" :key="goal.key" class="text-center space-y-3">
                    <div class="flex justify-center">
                      <div :class="`w-16 h-16 ${goal.bgColor} rounded-full flex items-center justify-center`">
                        <UIcon :name="goal.icon" :class="`${goal.color} text-2xl`" />
                      </div>
                    </div>
                    <h4 class="font-semibold">{{ t(`future.${goal.key}.title`) }}</h4>
                    <p class="text-sm text-gray-600">{{ t(`future.${goal.key}.description`) }}</p>
                  </div>
                </div>
              </div>
            </UCard>
          </section>

          <!-- Join Us -->
          <section id="join-us" class="space-y-6">
            <h2 class="text-3xl font-bold text-gray-900">{{ t('about.joinUs.title') }}</h2>
            
            <UCard>
              <div class="text-center space-y-6">
                <div class="space-y-4">
                  <h3 class="text-2xl font-semibold text-gray-900">{{ t('about.joinUs.heroTitle') }}</h3>
                  <p class="text-lg text-gray-600 max-w-2xl mx-auto">
                    {{ t('about.joinUs.heroParagraph') }}
                  </p>
                </div>

                <div class="flex flex-wrap justify-center gap-4">
                  <UButton 
                    :label="t('about.joinUs.ctaJoin')" 
                    color="primary" 
                    size="lg"
                    @click="navigateTo('/signup')"
                  />
                  <UButton 
                    :label="t('about.joinUs.ctaExplore')" 
                    color="secondary" 
                    variant="outline" 
                    size="lg"
                    @click="navigateTo('/features')"
                  />
                  <UButton 
                    :label="t('about.joinUs.ctaContact')" 
                    color="primary" 
                    variant="ghost" 
                    size="lg"
                    @click="navigateTo('/contact')"
                  />
                </div>

                <div class="pt-6 border-t">
                  <p class="text-sm text-gray-500">
                    {{ t('about.joinUs.contactBlurb') }}
                    <a href="mailto:hello@pawgo.com" class="text-primary-500 hover:underline">{{ t('about.joinUs.contactEmail') }}</a>
                  </p>
                </div>
              </div>
            </UCard>
          </section>
        </div>
      </UCard>
    </UContainer>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

// Meta tags for SEO
useHead({
  title: 'About Us - PawGo',
  meta: [
    {
      name: 'description',
      content: 'Learn about PawGo - the pet community platform connecting pet owners, service providers, and animal lovers worldwide.'
    }
  ]
})

const { t } = useI18n()

const missionStatement = ref({
  values: ['safetyFirst', 'communityDriven', 'petFocused', 'trustedPartners', 'innovation', 'compassion']
})

const ourServices = ref([
  {
    key: 'socialNetworking',
    icon: 'i-lucide-users',
    color: 'text-blue-500',
    features: ['profiles', 'groups', 'events', 'playdates', 'venues']
  },
  {
    key: 'professionalServices',
    icon: 'i-lucide-briefcase',
    color: 'text-green-500',
    features: ['veterinary', 'sitting', 'walking', 'grooming', 'training']
  },
  {
    key: 'emergencySupport',
    icon: 'i-lucide-phone',
    color: 'text-red-500',
    features: ['contacts', 'lostPet', 'veterinaryReferrals', 'rescue', 'crisis']
  },
  {
    key: 'education',
    icon: 'i-lucide-book-open',
    color: 'text-purple-500',
    features: ['articles', 'tutorials', 'health', 'breeds', 'qa']
  },
  {
    key: 'marketplace',
    icon: 'i-lucide-shopping-bag',
    color: 'text-orange-500',
    features: ['buysell', 'recommendations', 'reviews', 'directory', 'classifieds']
  },
  {
    key: 'healthTracking',
    icon: 'i-lucide-heart-pulse',
    color: 'text-pink-500',
    features: ['vaccinations', 'history', 'reminders', 'medications', 'milestones']
  }
])

const coreValues = ref([
  {
    key: 'petSafety',
    icon: 'i-lucide-shield-check',
    color: 'text-red-500',
    examples: ['backgroundChecks', 'monitoring', 'protocols', 'education', 'zeroTolerance']
  },
  {
    key: 'communityFirst',
    icon: 'i-lucide-heart',
    color: 'text-pink-500',
    examples: ['connections', 'localBusiness', 'inclusive', 'knowledge', 'friendships']
  },
  {
    key: 'transparency',
    icon: 'i-lucide-eye',
    color: 'text-blue-500',
    examples: ['communication', 'feedback', 'pricing', 'safety', 'updates']
  },
  {
    key: 'innovation',
    icon: 'i-lucide-lightbulb',
    color: 'text-yellow-500',
    examples: ['aiMatching', 'monitoring', 'health', 'experience', 'improvements']
  },
  {
    key: 'inclusivity',
    icon: 'i-lucide-accessibility',
    color: 'text-green-500',
    examples: ['multilingual', 'accessibility', 'pricing', 'allPets', 'education']
  },
  {
    key: 'environmental',
    icon: 'i-lucide-leaf',
    color: 'text-emerald-500',
    examples: ['carbon', 'ecoFriendly', 'local', 'responsible', 'conservation']
  }
])

const founderBio = ref({
  name: 'Mathieu',
  location: 'France',
  avatar: 'https://avatars.githubusercontent.com/u/70896773?v=4'
})

const safetyMeasures = ref([
  {
    key: 'userVerification',
    icon: 'i-lucide-user-check',
    color: 'text-blue-500',
    measures: ['idVerification', 'backgroundChecks', 'licenseVerification', 'references', 'monitoring', 'reverification']
  },
  {
    key: 'petProtection',
    icon: 'i-lucide-heart-pulse',
    color: 'text-red-500',
    measures: ['vaccination', 'assessment', 'tracking', 'emergency', 'insurance', 'hotline']
  },
  {
    key: 'communityMonitoring',
    icon: 'i-lucide-eye',
    color: 'text-green-500',
    measures: ['aiModeration', 'humanReview', 'alerts', 'reporting', 'audits', 'response']
  },
  {
    key: 'dataSecurity',
    icon: 'i-lucide-lock',
    color: 'text-purple-500',
    measures: ['encryption', 'storage', 'audits', 'compliance', 'minimal', 'rights']
  }
])

const communityStats = ref([
  {
    key: 'activeFamilies',
    icon: 'i-lucide-users',
    color: 'text-blue-500',
    value: '50K+'
  },
  {
    key: 'registeredPets',
    icon: 'i-lucide-heart',
    color: 'text-red-500',
    value: '75K+'
  },
  {
    key: 'cities',
    icon: 'i-lucide-map-pin',
    color: 'text-green-500',
    value: '500+'
  },
  {
    key: 'rating',
    icon: 'i-lucide-star',
    color: 'text-yellow-500',
    value: '4.9/5'
  }
])

const partnerships = ref([
  {
    key: 'animalShelters',
    icon: 'i-lucide-home',
    color: 'text-blue-500'
  },
  {
    key: 'veterinaryClinics',
    icon: 'i-lucide-stethoscope',
    color: 'text-red-500'
  },
  {
    key: 'petBusinesses',
    icon: 'i-lucide-store',
    color: 'text-green-500'
  }
])

const technologyFeatures = ref([
  {
    key: 'aiMatching',
    icon: 'i-lucide-brain',
    color: 'text-purple-500',
    benefits: ['compatibility', 'location', 'activity', 'professional', 'safety']
  },
  {
    key: 'safetyMonitoring',
    icon: 'i-lucide-shield-check',
    color: 'text-green-500',
    benefits: ['gps', 'checkins', 'alerts', 'detection', 'assessment']
  },
  {
    key: 'healthIntegration',
    icon: 'i-lucide-heart-pulse',
    color: 'text-red-500',
    benefits: ['reminders', 'analysis', 'wearables', 'records', 'preventive']
  },
  {
    key: 'smartCommunication',
    icon: 'i-lucide-message-circle',
    color: 'text-blue-500',
    benefits: ['translation', 'protocols', 'emergency', 'consultation', 'moderation']
  }
])

const futureGoals = ref([
  {
    key: 'globalExpansion',
    icon: 'i-lucide-globe',
    color: 'text-blue-500',
    bgColor: 'bg-blue-100'
  },
  {
    key: 'aiHealth',
    icon: 'i-lucide-brain',
    color: 'text-purple-500',
    bgColor: 'bg-purple-100'
  },
  {
    key: 'zeroHomelessness',
    icon: 'i-lucide-home',
    color: 'text-green-500',
    bgColor: 'bg-green-100'
  }
])

// GitHub repo stats (stars, forks)
const repoStats = ref({ stars: null as number | null, forks: null as number | null })
const repoLoading = ref(false)
const repoError = ref('')

onMounted(async () => {
  repoLoading.value = true
  try {
  const res = await fetch('/api/github-repo-stats')
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`)
  const data = await res.json()
  repoStats.value.stars = data.stars ?? 0
  repoStats.value.forks = data.forks ?? 0
  } catch (err: any) {
    repoError.value = err?.message || String(err)
  } finally {
    repoLoading.value = false
  }
})
</script>