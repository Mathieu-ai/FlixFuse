-- CreateEnum
CREATE TYPE "public"."UserGender" AS ENUM ('MALE', 'FEMALE', 'NON_BINARY', 'PREFER_NOT_TO_SAY');

-- CreateEnum
CREATE TYPE "public"."UserRole" AS ENUM ('MEMBER', 'VIP_MEMBER', 'MODERATOR', 'ADMIN', 'SUPER_ADMIN', 'SERVICE_PROVIDER');

-- CreateEnum
CREATE TYPE "public"."UserStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'SUSPENDED', 'BANNED', 'PENDING_VERIFICATION', 'DELETED');

-- CreateEnum
CREATE TYPE "public"."ExperienceLevel" AS ENUM ('BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT', 'PROFESSIONAL');

-- CreateEnum
CREATE TYPE "public"."PetSpecies" AS ENUM ('DOG', 'CAT', 'RABBIT', 'BIRD', 'HAMSTER', 'GUINEA_PIG', 'FERRET', 'REPTILE', 'FISH', 'HORSE', 'OTHER');

-- CreateEnum
CREATE TYPE "public"."PetGender" AS ENUM ('MALE', 'FEMALE', 'UNKNOWN');

-- CreateEnum
CREATE TYPE "public"."AgeUnit" AS ENUM ('WEEKS', 'MONTHS', 'YEARS');

-- CreateEnum
CREATE TYPE "public"."EnergyLevel" AS ENUM ('VERY_LOW', 'LOW', 'MODERATE', 'HIGH', 'VERY_HIGH');

-- CreateEnum
CREATE TYPE "public"."SocialLevel" AS ENUM ('SHY', 'CAUTIOUS', 'FRIENDLY', 'VERY_SOCIAL', 'OVERLY_SOCIAL');

-- CreateEnum
CREATE TYPE "public"."TrainingLevel" AS ENUM ('UNTRAINED', 'BASIC', 'INTERMEDIATE', 'ADVANCED', 'PROFESSIONAL');

-- CreateEnum
CREATE TYPE "public"."FriendshipStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED', 'BLOCKED');

-- CreateEnum
CREATE TYPE "public"."HealthRecordType" AS ENUM ('VACCINATION', 'MEDICAL_CHECKUP', 'TREATMENT', 'SURGERY', 'DENTAL_CARE', 'GROOMING', 'ALLERGY_TEST', 'MEDICATION', 'EMERGENCY_VISIT', 'BEHAVIORAL_CONSULTATION', 'NUTRITION_CONSULTATION', 'PARASITE_TREATMENT', 'OTHER');

-- CreateEnum
CREATE TYPE "public"."WalkType" AS ENUM ('CASUAL', 'TRAINING', 'EXERCISE', 'SOCIAL', 'PUPPY_FRIENDLY', 'SENIOR_FRIENDLY', 'THERAPY_DOGS', 'BREED_SPECIFIC', 'SIZE_SPECIFIC', 'HIKING', 'BEACH_WALK', 'CITY_WALK', 'PARK_WALK', 'NIGHT_WALK');

-- CreateEnum
CREATE TYPE "public"."WalkDifficulty" AS ENUM ('EASY', 'MODERATE', 'CHALLENGING', 'DIFFICULT');

-- CreateEnum
CREATE TYPE "public"."WalkPace" AS ENUM ('SLOW', 'MODERATE', 'BRISK', 'FAST');

-- CreateEnum
CREATE TYPE "public"."WalkStatus" AS ENUM ('DRAFT', 'SCHEDULED', 'RECRUITING', 'FULL', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'POSTPONED');

-- CreateEnum
CREATE TYPE "public"."WalkParticipationStatus" AS ENUM ('PENDING', 'CONFIRMED', 'DECLINED', 'WAITLISTED', 'COMPLETED', 'NO_SHOW', 'CANCELLED');

-- CreateEnum
CREATE TYPE "public"."ServiceType" AS ENUM ('VETERINARIAN', 'EMERGENCY_VET', 'GROOMER', 'PET_SITTER', 'DOG_WALKER', 'TRAINER', 'BEHAVIORIST', 'PET_PHOTOGRAPHER', 'PET_TAXI', 'BOARDING', 'DAYCARE', 'PET_STORE', 'NUTRITIONIST', 'OTHER');

-- CreateEnum
CREATE TYPE "public"."BookingStatus" AS ENUM ('PENDING', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'NO_SHOW', 'RESCHEDULED');

-- CreateEnum
CREATE TYPE "public"."EventType" AS ENUM ('PICNIC', 'TRAINING_WORKSHOP', 'ADOPTION_FAIR', 'DOG_SHOW', 'COMPETITION', 'SOCIAL_GATHERING', 'FUNDRAISER', 'EDUCATIONAL_SEMINAR', 'HEALTH_CLINIC', 'GROOMING_DAY', 'PHOTO_SHOOT', 'CHARITY_WALK', 'AGILITY_TRAINING', 'PUPPY_SOCIALIZATION', 'SENIOR_PET_MEETUP', 'BREED_MEETUP', 'HOLIDAY_CELEBRATION', 'MEMORIAL_SERVICE', 'PROTEST_RALLY', 'OTHER');

-- CreateEnum
CREATE TYPE "public"."EventStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ACTIVE', 'FULL', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'POSTPONED');

-- CreateEnum
CREATE TYPE "public"."EventParticipationStatus" AS ENUM ('REGISTERED', 'CONFIRMED', 'WAITLISTED', 'CANCELLED', 'ATTENDED', 'NO_SHOW', 'COMPLETED_WITH_CERTIFICATE');

-- CreateEnum
CREATE TYPE "public"."PaymentStatus" AS ENUM ('PENDING', 'PAID', 'FAILED', 'REFUNDED', 'PARTIALLY_REFUNDED', 'WAIVED');

-- CreateEnum
CREATE TYPE "public"."PostType" AS ENUM ('TEXT', 'PHOTO', 'VIDEO', 'POLL', 'QUESTION', 'TIP_ADVICE', 'ALERT_LOST', 'ALERT_FOUND', 'ANNOUNCEMENT', 'REVIEW', 'STORY', 'LIVE_UPDATE', 'MEMORIAL', 'ADOPTION_POST', 'SERVICE_RECOMMENDATION', 'EVENT_RECAP');

-- CreateEnum
CREATE TYPE "public"."PostCategory" AS ENUM ('HEALTH_MEDICAL', 'TRAINING_BEHAVIOR', 'NUTRITION_DIET', 'GROOMING_CARE', 'EXERCISE_ACTIVITY', 'SOCIAL_MEETUPS', 'EMERGENCY_SAFETY', 'PRODUCT_REVIEW', 'SERVICE_REVIEW', 'COMMUNITY_NEWS', 'FUNNY_CUTE', 'EDUCATIONAL', 'LOST_FOUND', 'ADOPTION', 'MEMORIAL');

-- CreateEnum
CREATE TYPE "public"."PostVisibility" AS ENUM ('PUBLIC', 'NEIGHBORHOOD', 'FRIENDS_ONLY', 'FOLLOWERS_ONLY', 'PRIVATE', 'MEMBERS_ONLY');

-- CreateEnum
CREATE TYPE "public"."ModerationStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'FLAGGED', 'UNDER_REVIEW', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "public"."ShareType" AS ENUM ('REPOST', 'QUOTE_REPOST', 'EXTERNAL_SHARE', 'DIRECT_MESSAGE');

-- CreateEnum
CREATE TYPE "public"."ReactionType" AS ENUM ('LIKE', 'LOVE', 'PAW', 'HEART', 'LAUGH', 'WOW', 'SAD', 'ANGRY', 'HELPFUL', 'BRILLIANT');

-- CreateEnum
CREATE TYPE "public"."ConversationCategory" AS ENUM ('GENERAL', 'NEIGHBORHOOD', 'BREED_SPECIFIC', 'WALK_GROUP', 'EVENT_PLANNING', 'HEALTH_SUPPORT', 'TRAINING_TIPS', 'EMERGENCY', 'ANNOUNCEMENTS', 'MARKETPLACE');

-- CreateEnum
CREATE TYPE "public"."ParticipantRole" AS ENUM ('OWNER', 'ADMIN', 'MODERATOR', 'MEMBER');

-- CreateEnum
CREATE TYPE "public"."ParticipantStatus" AS ENUM ('ACTIVE', 'INVITED', 'BANNED', 'LEFT');

-- CreateEnum
CREATE TYPE "public"."MessageType" AS ENUM ('TEXT', 'IMAGE', 'VIDEO', 'AUDIO', 'FILE', 'LOCATION', 'CONTACT', 'POLL', 'SYSTEM', 'WALK_SHARE', 'EVENT_SHARE', 'PET_PROFILE_SHARE', 'STICKER', 'GIF');

-- CreateEnum
CREATE TYPE "public"."DeleteType" AS ENUM ('FOR_ME', 'FOR_EVERYONE');

-- CreateEnum
CREATE TYPE "public"."MessagePriority" AS ENUM ('LOW', 'NORMAL', 'HIGH', 'URGENT');

-- CreateEnum
CREATE TYPE "public"."SystemAction" AS ENUM ('USER_JOINED', 'USER_LEFT', 'USER_ADDED', 'USER_REMOVED', 'CONVERSATION_CREATED', 'NAME_CHANGED', 'AVATAR_CHANGED', 'ADMIN_PROMOTED', 'ADMIN_DEMOTED', 'SETTINGS_CHANGED');

-- CreateEnum
CREATE TYPE "public"."VenueType" AS ENUM ('DOG_PARK', 'CAT_CAFE', 'VETERINARIAN', 'EMERGENCY_VET', 'SPECIALIST_VET', 'PET_STORE', 'GROOMER', 'BOARDING', 'DAYCARE', 'TRAINING_CENTER', 'DOG_RUN', 'BEACH_DOG_AREA', 'HIKING_TRAIL', 'PET_FRIENDLY_RESTAURANT', 'PET_FRIENDLY_CAFE', 'PET_FRIENDLY_HOTEL', 'PHARMACY_PET', 'PET_PHOTOGRAPHER', 'PET_TAXI', 'ANIMAL_SHELTER', 'RESCUE_ORGANIZATION', 'BREEDING_FACILITY', 'DOG_WALKER_SERVICE', 'PET_SITTER_SERVICE', 'MOBILE_VET', 'MOBILE_GROOMER', 'PET_WASTE_STATION', 'WATER_FOUNTAIN_PET', 'OTHER');

-- CreateEnum
CREATE TYPE "public"."PriceRange" AS ENUM ('FREE', 'BUDGET', 'MODERATE', 'EXPENSIVE', 'LUXURY');

-- CreateEnum
CREATE TYPE "public"."BadgeCategory" AS ENUM ('SOCIAL', 'ACTIVITY', 'COMMUNITY', 'MILESTONE', 'SPECIAL', 'PROFILE', 'LEADERSHIP', 'ENGAGEMENT', 'HEALTH_TRACKING', 'TRAINING', 'EVENTS', 'WALKS', 'PHOTOGRAPHY', 'HELPFULNESS', 'EXPLORATION', 'SEASONAL', 'ANNIVERSARY');

-- CreateEnum
CREATE TYPE "public"."BadgeRarity" AS ENUM ('COMMON', 'UNCOMMON', 'RARE', 'EPIC', 'LEGENDARY', 'MYTHIC');

-- CreateEnum
CREATE TYPE "public"."BadgeDifficulty" AS ENUM ('EASY', 'MODERATE', 'HARD', 'EXPERT', 'MASTER');

-- CreateEnum
CREATE TYPE "public"."NotificationType" AS ENUM ('FRIEND_REQUEST', 'FRIEND_REQUEST_ACCEPTED', 'POST_LIKE', 'POST_COMMENT', 'COMMENT_REPLY', 'MENTION', 'MESSAGE_RECEIVED', 'WALK_INVITATION', 'WALK_REQUEST_APPROVED', 'WALK_CANCELLED', 'WALK_REMINDER', 'WALK_STARTING_SOON', 'WALK_COMPLETED', 'EVENT_INVITATION', 'EVENT_REMINDER', 'EVENT_CANCELLED', 'EVENT_STARTING_SOON', 'HEALTH_REMINDER', 'VACCINATION_DUE', 'VET_APPOINTMENT_REMINDER', 'MEDICATION_REMINDER', 'BADGE_EARNED', 'LEVEL_UP', 'WEEKLY_SUMMARY', 'MONTHLY_REPORT', 'NEW_MEMBER_NEIGHBORHOOD', 'TRENDING_POST', 'SYSTEM_ANNOUNCEMENT', 'ACCOUNT_SECURITY', 'PASSWORD_CHANGED', 'EMAIL_VERIFIED', 'PROFILE_APPROVED', 'CONTENT_FLAGGED', 'CONTENT_APPROVED', 'BOOKING_CONFIRMED', 'BOOKING_CANCELLED', 'BOOKING_REMINDER', 'PAYMENT_RECEIVED', 'PAYMENT_FAILED', 'LOST_PET_ALERT', 'FOUND_PET_MATCH', 'EMERGENCY_ALERT', 'WEATHER_WARNING', 'WELCOME_SERIES', 'FEATURE_ANNOUNCEMENT', 'SURVEY_INVITATION', 'REFERRAL_REWARD');

-- CreateEnum
CREATE TYPE "public"."NotificationPriority" AS ENUM ('LOW', 'NORMAL', 'HIGH', 'URGENT', 'CRITICAL');

-- CreateEnum
CREATE TYPE "public"."NotificationCategory" AS ENUM ('SOCIAL', 'ACTIVITY', 'HEALTH', 'SYSTEM', 'MARKETING', 'EMERGENCY', 'TRANSACTIONAL');

-- CreateEnum
CREATE TYPE "public"."ContentType" AS ENUM ('USER_PROFILE', 'PET_PROFILE', 'POST', 'COMMENT', 'MESSAGE', 'PHOTO', 'VIDEO', 'REVIEW', 'WALK', 'EVENT', 'VENUE', 'CONVERSATION');

-- CreateEnum
CREATE TYPE "public"."ReportReason" AS ENUM ('SPAM', 'HARASSMENT', 'HATE_SPEECH', 'VIOLENCE', 'INAPPROPRIATE_CONTENT', 'MISINFORMATION', 'COPYRIGHT_VIOLATION', 'FRAUD_SCAM', 'ANIMAL_ABUSE', 'ILLEGAL_ACTIVITY', 'PRIVACY_VIOLATION', 'FAKE_PROFILE', 'UNDERAGE_USER', 'OTHER');

-- CreateEnum
CREATE TYPE "public"."ReportCategory" AS ENUM ('CONTENT_VIOLATION', 'USER_BEHAVIOR', 'TECHNICAL_ISSUE', 'SAFETY_CONCERN', 'LEGAL_ISSUE', 'COMMUNITY_GUIDELINES');

-- CreateEnum
CREATE TYPE "public"."ReportSeverity" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL', 'EMERGENCY');

-- CreateEnum
CREATE TYPE "public"."ReportStatus" AS ENUM ('PENDING', 'UNDER_REVIEW', 'INVESTIGATING', 'RESOLVED', 'DISMISSED', 'ESCALATED', 'APPEALED', 'CLOSED');

-- CreateEnum
CREATE TYPE "public"."ReportResolution" AS ENUM ('NO_ACTION_NEEDED', 'WARNING_ISSUED', 'CONTENT_REMOVED', 'CONTENT_EDITED', 'USER_SUSPENDED', 'USER_BANNED', 'ACCOUNT_RESTRICTED', 'EDUCATIONAL_NOTICE', 'COMMUNITY_SERVICE', 'REFERRED_TO_AUTHORITIES');

-- CreateEnum
CREATE TYPE "public"."ActivityType" AS ENUM ('LOGIN', 'LOGOUT', 'REGISTRATION', 'PASSWORD_CHANGE', 'EMAIL_VERIFICATION', 'PROFILE_UPDATE', 'FRIEND_REQUEST_SENT', 'FRIEND_REQUEST_ACCEPTED', 'MESSAGE_SENT', 'POST_CREATED', 'POST_LIKED', 'POST_SHARED', 'COMMENT_POSTED', 'PET_ADDED', 'PET_UPDATED', 'HEALTH_RECORD_ADDED', 'VET_APPOINTMENT_BOOKED', 'WALK_CREATED', 'WALK_JOINED', 'WALK_COMPLETED', 'EVENT_CREATED', 'EVENT_ATTENDED', 'VENUE_REVIEWED', 'BADGE_EARNED', 'SEARCH_PERFORMED', 'CONTENT_VIEWED', 'APP_OPENED', 'FEATURE_USED', 'REPORT_SUBMITTED', 'HELP_REQUEST', 'FEEDBACK_PROVIDED');

-- CreateEnum
CREATE TYPE "public"."LocationSource" AS ENUM ('GPS', 'NETWORK', 'MANUAL', 'CHECK_IN', 'WALK_START', 'WALK_END', 'EVENT_ATTENDANCE');

-- CreateEnum
CREATE TYPE "public"."GeofencePurpose" AS ENUM ('WALK_REMINDER', 'EVENT_REMINDER', 'SAFETY_ALERT', 'VENUE_PROMOTION', 'LOST_PET_ALERT', 'NEIGHBORHOOD_NOTIFICATION', 'TRAINING_ZONE', 'RESTRICTED_AREA', 'EMERGENCY_ZONE');

-- CreateEnum
CREATE TYPE "public"."AlertType" AS ENUM ('INFO', 'WARNING', 'EMERGENCY', 'PROMOTION', 'REMINDER');

-- CreateEnum
CREATE TYPE "public"."GeofenceEventType" AS ENUM ('ENTER', 'EXIT', 'DWELL');

-- CreateEnum
CREATE TYPE "public"."ModerationType" AS ENUM ('AUTOMATED', 'REPORTED', 'RANDOM_SAMPLE', 'ESCALATED', 'APPEAL_REVIEW', 'BULK_ACTION');

-- CreateEnum
CREATE TYPE "public"."ModerationAction" AS ENUM ('APPROVE', 'REJECT', 'REQUIRE_EDIT', 'ADD_WARNING', 'RESTRICT_VISIBILITY', 'REMOVE_CONTENT', 'SUSPEND_USER', 'BAN_USER', 'ESCALATE', 'NEEDS_HUMAN_REVIEW');

-- CreateEnum
CREATE TYPE "public"."SearchType" AS ENUM ('GENERAL', 'USERS', 'PETS', 'WALKS', 'EVENTS', 'VENUES', 'POSTS', 'SERVICES', 'HEALTH_INFO', 'TRAINING_TIPS');

-- CreateEnum
CREATE TYPE "public"."SubscriptionPlan" AS ENUM ('FREE', 'BASIC', 'PREMIUM', 'PROFESSIONAL', 'ENTERPRISE');

-- CreateEnum
CREATE TYPE "public"."SubscriptionStatus" AS ENUM ('TRIALING', 'ACTIVE', 'PAST_DUE', 'CANCELLED', 'INCOMPLETE', 'INCOMPLETE_EXPIRED', 'UNPAID');

-- CreateEnum
CREATE TYPE "public"."InvoiceStatus" AS ENUM ('PENDING', 'PAID', 'OVERDUE', 'CANCELLED', 'REFUNDED');

-- CreateEnum
CREATE TYPE "public"."SystemNotificationType" AS ENUM ('INFO', 'WARNING', 'ERROR', 'SUCCESS', 'MAINTENANCE', 'FEATURE_ANNOUNCEMENT', 'POLICY_UPDATE');

-- CreateEnum
CREATE TYPE "public"."ClassifiedCategory" AS ENUM ('PET_SITTING', 'DOG_WALKING', 'GROOMING', 'TRAINING', 'ACCESSORIES', 'FOOD_TREATS', 'TOYS', 'FURNITURE_BEDS', 'TRANSPORT', 'HEALTH_CARE', 'BREEDING', 'ADOPTION', 'SERVICES', 'LOST_FOUND', 'OTHER');

-- CreateEnum
CREATE TYPE "public"."PriceType" AS ENUM ('FIXED', 'HOURLY', 'DAILY', 'WEEKLY', 'MONTHLY', 'NEGOTIABLE', 'FREE', 'TRADE');

-- CreateEnum
CREATE TYPE "public"."ItemCondition" AS ENUM ('NEW', 'LIKE_NEW', 'GOOD', 'FAIR', 'POOR');

-- CreateEnum
CREATE TYPE "public"."VetContactMethod" AS ENUM ('IN_APP', 'PHONE', 'EMAIL', 'WHATSAPP');

-- CreateEnum
CREATE TYPE "public"."ContactMethod" AS ENUM ('IN_APP', 'PHONE', 'EMAIL', 'SMS', 'WHATSAPP', 'VIDEO_CALL');

-- CreateEnum
CREATE TYPE "public"."InquiryStatus" AS ENUM ('PENDING', 'RESPONDED', 'ACCEPTED', 'DECLINED', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "public"."QuestionCategory" AS ENUM ('HEALTH_MEDICAL', 'NUTRITION_DIET', 'TRAINING_BEHAVIOR', 'GROOMING_CARE', 'BREEDING', 'ADOPTION', 'LEGAL_ADVICE', 'EMERGENCY', 'GENERAL_CARE', 'PRODUCT_RECOMMENDATION', 'VETERINARY', 'OTHER');

-- CreateEnum
CREATE TYPE "public"."QuestionUrgency" AS ENUM ('LOW', 'NORMAL', 'HIGH', 'URGENT', 'EMERGENCY');

-- CreateEnum
CREATE TYPE "public"."VoteType" AS ENUM ('UP', 'DOWN');

-- CreateEnum
CREATE TYPE "public"."GroupType" AS ENUM ('NEIGHBORHOOD', 'BREED_SPECIFIC', 'ACTIVITY_BASED', 'SUPPORT_GROUP', 'PROFESSIONAL', 'GENERAL', 'SPECIAL_INTEREST');

-- CreateEnum
CREATE TYPE "public"."GroupPrivacy" AS ENUM ('PUBLIC', 'PRIVATE', 'SECRET', 'INVITE_ONLY');

-- CreateEnum
CREATE TYPE "public"."GroupCategory" AS ENUM ('LOCAL_COMMUNITY', 'BREED_CLUBS', 'TRAINING_GROUPS', 'HEALTH_SUPPORT', 'ACTIVITY_CLUBS', 'PROFESSIONAL_NETWORK', 'SPECIAL_NEEDS', 'RESCUE_GROUPS');

-- CreateEnum
CREATE TYPE "public"."GroupModerationLevel" AS ENUM ('OPEN', 'MODERATE', 'STRICT', 'ADMIN_ONLY');

-- CreateEnum
CREATE TYPE "public"."GroupRole" AS ENUM ('MEMBER', 'MODERATOR', 'ADMIN', 'FOUNDER');

-- CreateEnum
CREATE TYPE "public"."MembershipStatus" AS ENUM ('ACTIVE', 'PENDING', 'BANNED', 'LEFT', 'REMOVED');

-- CreateEnum
CREATE TYPE "public"."ContractType" AS ENUM ('PET_SITTING', 'DOG_WALKING', 'BOARDING', 'DAYCARE', 'VACATION_CARE', 'EMERGENCY_CARE', 'BREEDING_ARRANGEMENT', 'TRAINING_SESSION', 'SOCIALIZATION', 'MEDICAL_CARE', 'TEMPORARY_FOSTERING', 'OTHER');

-- CreateEnum
CREATE TYPE "public"."PaymentMethod" AS ENUM ('CASH', 'BANK_TRANSFER', 'CARD', 'PAYPAL', 'CRYPTO', 'BARTER_EXCHANGE', 'FREE');

-- CreateEnum
CREATE TYPE "public"."ContractStatus" AS ENUM ('DRAFT', 'PENDING_SIGNATURES', 'ACTIVE', 'COMPLETED', 'CANCELLED', 'EXPIRED', 'DISPUTED', 'TERMINATED', 'ON_HOLD');

-- CreateEnum
CREATE TYPE "public"."UpdateFrequency" AS ENUM ('HOURLY', 'TWICE_DAILY', 'DAILY', 'EVERY_OTHER_DAY', 'WEEKLY', 'AS_NEEDED', 'NO_UPDATES');

-- CreateEnum
CREATE TYPE "public"."WitnessType" AS ENUM ('FRIEND', 'FAMILY_MEMBER', 'VETERINARIAN', 'PROFESSIONAL', 'NOTARY', 'COMMUNITY_MEMBER');

-- CreateEnum
CREATE TYPE "public"."HandoverType" AS ENUM ('PICKUP', 'RETURN', 'CHECK_IN', 'EMERGENCY_RETURN', 'EXTENSION_PICKUP');

-- CreateEnum
CREATE TYPE "public"."VerificationMethod" AS ENUM ('PHOTO_ID', 'DIGITAL_CODE', 'BIOMETRIC', 'VIDEO_CALL', 'WITNESS_VERIFICATION', 'GPS_LOCATION');

-- CreateEnum
CREATE TYPE "public"."HandoverStatus" AS ENUM ('SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'DISPUTED', 'NO_SHOW');

-- CreateEnum
CREATE TYPE "public"."ExtensionStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'CANCELLED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "public"."UpdateType" AS ENUM ('GENERAL_UPDATE', 'PHOTO_SHARE', 'LOCATION_UPDATE', 'HEALTH_UPDATE', 'BEHAVIOR_REPORT', 'FEEDING_REPORT', 'EXERCISE_REPORT', 'MILESTONE_ACHIEVED', 'ISSUE_REPORT', 'EMERGENCY_ALERT', 'MEDICATION_GIVEN', 'VET_VISIT', 'SOCIAL_INTERACTION');

-- CreateEnum
CREATE TYPE "public"."UpdatePriority" AS ENUM ('LOW', 'NORMAL', 'HIGH', 'URGENT', 'EMERGENCY');

-- CreateEnum
CREATE TYPE "public"."EmergencyType" AS ENUM ('MEDICAL_EMERGENCY', 'ACCIDENT', 'LOST_PET', 'STOLEN_PET', 'AGGRESSIVE_BEHAVIOR', 'POISONING', 'INJURY', 'SEVERE_ILLNESS', 'NATURAL_DISASTER', 'HUMAN_EMERGENCY', 'PROPERTY_DAMAGE', 'LEGAL_ISSUE', 'OTHER');

-- CreateEnum
CREATE TYPE "public"."EmergencySeverity" AS ENUM ('LOW', 'MODERATE', 'HIGH', 'CRITICAL', 'LIFE_THREATENING');

-- CreateEnum
CREATE TYPE "public"."EmergencyStatus" AS ENUM ('ACTIVE', 'UNDER_CONTROL', 'RESOLVED', 'ESCALATED', 'CLOSED');

-- CreateEnum
CREATE TYPE "public"."DisputeType" AS ENUM ('BREACH_OF_CONTRACT', 'PAYMENT_ISSUE', 'PET_CARE_NEGLIGENCE', 'PROPERTY_DAMAGE', 'LATE_RETURN', 'UNAUTHORIZED_ACTIVITY', 'COMMUNICATION_FAILURE', 'SAFETY_VIOLATION', 'HEALTH_ISSUE', 'BEHAVIORAL_PROBLEM', 'FRAUD', 'HARASSMENT', 'OTHER');

-- CreateEnum
CREATE TYPE "public"."DisputeCategory" AS ENUM ('FINANCIAL', 'CARE_QUALITY', 'SAFETY_SECURITY', 'COMMUNICATION', 'BREACH_OF_TERMS', 'LEGAL');

-- CreateEnum
CREATE TYPE "public"."DisputeSeverity" AS ENUM ('MINOR', 'MODERATE', 'MAJOR', 'SEVERE', 'CRITICAL');

-- CreateEnum
CREATE TYPE "public"."DisputeStatus" AS ENUM ('OPEN', 'UNDER_REVIEW', 'IN_MEDIATION', 'AWAITING_RESPONSE', 'RESOLVED', 'ESCALATED', 'CLOSED', 'APPEALED');

-- CreateEnum
CREATE TYPE "public"."ResolutionType" AS ENUM ('MUTUAL_AGREEMENT', 'MEDIATED_SETTLEMENT', 'COMPENSATION_AWARDED', 'CONTRACT_TERMINATION', 'WARNING_ISSUED', 'ACCOUNT_RESTRICTION', 'LEGAL_ACTION', 'NO_ACTION_REQUIRED');

-- CreateEnum
CREATE TYPE "public"."VetProfessionalType" AS ENUM ('VETERINARIAN', 'VET_SPECIALIST', 'VET_SURGEON', 'VET_DENTIST', 'VET_DERMATOLOGIST', 'VET_CARDIOLOGIST', 'VET_NEUROLOGIST', 'VET_ONCOLOGIST', 'VET_BEHAVIORIST', 'VET_NUTRITIONIST', 'VET_TECHNICIAN', 'VET_NURSE', 'ANIMAL_PHYSIOTHERAPIST', 'ANIMAL_CHIROPRACTOR', 'ANIMAL_ACUPUNCTURIST', 'GROOMER', 'TRAINER', 'BEHAVIORIST', 'PET_NUTRITIONIST');

-- CreateEnum
CREATE TYPE "public"."VetPracticeType" AS ENUM ('SMALL_ANIMAL_CLINIC', 'LARGE_ANIMAL_PRACTICE', 'MIXED_PRACTICE', 'SPECIALTY_HOSPITAL', 'EMERGENCY_CLINIC', 'MOBILE_PRACTICE', 'TELEHEALTH_ONLY', 'RESEARCH_INSTITUTION', 'TEACHING_HOSPITAL', 'GOVERNMENT_AGENCY', 'ANIMAL_SHELTER', 'ZOO_AQUARIUM', 'INDEPENDENT_CONSULTANT');

-- CreateEnum
CREATE TYPE "public"."VetConsultationType" AS ENUM ('ROUTINE_CHECKUP', 'EMERGENCY_CONSULTATION', 'FOLLOW_UP', 'SECOND_OPINION', 'BEHAVIORAL_CONSULTATION', 'NUTRITIONAL_CONSULTATION', 'SURGICAL_CONSULTATION', 'DENTAL_CONSULTATION', 'VACCINATION_CONSULTATION', 'TELEHEALTH', 'HOME_VISIT', 'PHONE_CONSULTATION', 'VIDEO_CONSULTATION');

-- CreateEnum
CREATE TYPE "public"."VetVerificationLevel" AS ENUM ('BASIC', 'ENHANCED', 'PROFESSIONAL', 'EXPERT', 'CERTIFIED');

-- CreateEnum
CREATE TYPE "public"."VerificationLevel" AS ENUM ('BASIC', 'ENHANCED', 'VERIFIED', 'PREMIUM', 'TRUSTED');

-- CreateEnum
CREATE TYPE "public"."VetConnectionType" AS ENUM ('PRIMARY_VET', 'SPECIALIST_REFERRAL', 'EMERGENCY_CONTACT', 'SECOND_OPINION', 'CONSULTANT', 'TEMPORARY_CARE', 'BREEDING_ADVISOR', 'BEHAVIORAL_SPECIALIST', 'NUTRITIONIST', 'GROOMER', 'TRAINER');

-- CreateEnum
CREATE TYPE "public"."VetRelationshipType" AS ENUM ('ACTIVE_CLIENT', 'FORMER_CLIENT', 'CONSULTATION_ONLY', 'REFERRAL_ONLY', 'EMERGENCY_ONLY', 'SPECIALIST_CONSULT', 'COLLABORATIVE_CARE');

-- CreateEnum
CREATE TYPE "public"."VetPermissionLevel" AS ENUM ('READ_ONLY', 'LIMITED_UPDATE', 'FULL_ACCESS', 'EMERGENCY_ACCESS', 'ADMINISTRATIVE');

-- CreateEnum
CREATE TYPE "public"."VetConsultationUrgency" AS ENUM ('ROUTINE', 'URGENT', 'EMERGENCY', 'CRITICAL');

-- CreateEnum
CREATE TYPE "public"."VetConsultationStatus" AS ENUM ('SCHEDULED', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'NO_SHOW', 'RESCHEDULED');

-- CreateEnum
CREATE TYPE "public"."VetConsultationPrivacy" AS ENUM ('PRIVATE', 'SHARED_WITH_NETWORK', 'RESEARCH_ANONYMOUS', 'PUBLIC_ANONYMOUS');

-- CreateEnum
CREATE TYPE "public"."PetMedicalRecordType" AS ENUM ('GENERAL_CHECKUP', 'VACCINATION_RECORD', 'SURGICAL_PROCEDURE', 'EMERGENCY_VISIT', 'DIAGNOSTIC_TEST', 'TREATMENT_PLAN', 'MEDICATION_RECORD', 'BEHAVIORAL_ASSESSMENT', 'DENTAL_PROCEDURE', 'REHABILITATION', 'FOLLOW_UP_VISIT', 'SECOND_OPINION', 'SPECIALIST_CONSULTATION', 'HEALTH_CERTIFICATE', 'INSURANCE_EXAM', 'BREEDING_EVALUATION', 'EUTHANASIA_RECORD');

-- CreateEnum
CREATE TYPE "public"."RecordPriority" AS ENUM ('LOW', 'NORMAL', 'HIGH', 'CRITICAL', 'EMERGENCY');

-- CreateEnum
CREATE TYPE "public"."AccessType" AS ENUM ('EMERGENCY_ACCESS', 'CONSULTATION_ACCESS', 'SHARED_CARE', 'TEMPORARY_CARE', 'RESEARCH_ACCESS', 'INSURANCE_CLAIM', 'LEGAL_PROCEEDING', 'BREEDING_EVALUATION');

-- CreateEnum
CREATE TYPE "public"."AccessLevel" AS ENUM ('VIEW_ONLY', 'LIMITED_EDIT', 'FULL_ACCESS', 'ADMINISTRATIVE');

-- CreateEnum
CREATE TYPE "public"."VerificationType" AS ENUM ('DOCUMENT_SCAN', 'BIOMETRIC_FACE', 'BIOMETRIC_FINGERPRINT', 'PHONE_SMS', 'PHONE_CALL', 'EMAIL_LINK', 'EMAIL_CODE', 'ADDRESS_VERIFICATION', 'PROFESSIONAL_LICENSE', 'EDUCATIONAL_CREDENTIALS', 'REFERENCE_CHECK', 'VIDEO_CALL', 'IN_PERSON');

-- CreateEnum
CREATE TYPE "public"."DocumentType" AS ENUM ('PASSPORT', 'DRIVERS_LICENSE', 'NATIONAL_ID', 'RESIDENCE_PERMIT', 'PROFESSIONAL_LICENSE', 'UTILITY_BILL', 'BANK_STATEMENT', 'INSURANCE_DOCUMENT', 'TAX_DOCUMENT', 'EMPLOYMENT_LETTER', 'EDUCATIONAL_CERTIFICATE');

-- CreateEnum
CREATE TYPE "public"."BiometricType" AS ENUM ('FACIAL_RECOGNITION', 'FINGERPRINT', 'VOICE_RECOGNITION', 'IRIS_SCAN', 'PALM_PRINT');

-- CreateEnum
CREATE TYPE "public"."VerificationStatus" AS ENUM ('PENDING', 'IN_REVIEW', 'VERIFIED', 'REJECTED', 'EXPIRED', 'SUSPENDED', 'APPEALING');

-- CreateEnum
CREATE TYPE "public"."BackgroundCheckType" AS ENUM ('CRIMINAL_HISTORY', 'ANIMAL_ABUSE_REGISTRY', 'SEX_OFFENDER_REGISTRY', 'REFERENCE_CHECK', 'CREDIT_CHECK', 'EMPLOYMENT_HISTORY', 'EDUCATION_VERIFICATION', 'PROFESSIONAL_LICENSE', 'MALPRACTICE_HISTORY', 'DISCIPLINARY_ACTIONS', 'SOCIAL_MEDIA_SCAN', 'ONLINE_REPUTATION', 'COURT_RECORDS', 'BANKRUPTCY_CHECK');

-- CreateEnum
CREATE TYPE "public"."CheckResult" AS ENUM ('CLEAR', 'MINOR_ISSUES', 'MAJOR_CONCERNS', 'DISQUALIFYING', 'INSUFFICIENT_DATA', 'ERROR');

-- CreateEnum
CREATE TYPE "public"."RiskLevel" AS ENUM ('VERY_LOW', 'LOW', 'MODERATE', 'HIGH', 'VERY_HIGH', 'UNACCEPTABLE');

-- CreateEnum
CREATE TYPE "public"."ProfessionalStanding" AS ENUM ('EXCELLENT', 'GOOD', 'FAIR', 'POOR', 'SUSPENDED', 'REVOKED');

-- CreateEnum
CREATE TYPE "public"."BackgroundCheckStatus" AS ENUM ('INITIATED', 'IN_PROGRESS', 'COMPLETED', 'FAILED', 'EXPIRED', 'DISPUTED');

-- CreateEnum
CREATE TYPE "public"."TrendDirection" AS ENUM ('IMPROVING', 'STABLE', 'DECLINING', 'VOLATILE');

-- CreateEnum
CREATE TYPE "public"."DepositType" AS ENUM ('PET_CARE_SECURITY', 'DAMAGE_PROTECTION', 'CANCELLATION_PROTECTION', 'EMERGENCY_FUND', 'TRUST_DEPOSIT', 'PERFORMANCE_BOND', 'CLEANING_DEPOSIT', 'KEY_DEPOSIT');

-- CreateEnum
CREATE TYPE "public"."DepositStatus" AS ENUM ('PENDING', 'HELD', 'PARTIALLY_RELEASED', 'FULLY_RELEASED', 'FORFEITED', 'DISPUTED', 'REFUNDED');

-- CreateEnum
CREATE TYPE "public"."InsurancePolicyType" AS ENUM ('ACCIDENT_ONLY', 'ACCIDENT_ILLNESS', 'COMPREHENSIVE', 'WELLNESS_PREVENTIVE', 'LIABILITY_ONLY', 'THIRD_PARTY_LIABILITY', 'TRAVEL_INSURANCE', 'BREEDING_INSURANCE', 'MORTALITY_INSURANCE');

-- CreateEnum
CREATE TYPE "public"."InsuranceCoverage" AS ENUM ('ACCIDENTS', 'ILLNESSES', 'CHRONIC_CONDITIONS', 'HEREDITARY_CONDITIONS', 'BEHAVIORAL_THERAPY', 'ALTERNATIVE_THERAPY', 'PRESCRIPTION_MEDICATIONS', 'DIAGNOSTIC_TESTS', 'SURGERY', 'HOSPITALIZATION', 'EMERGENCY_CARE', 'SPECIALIST_CARE', 'PREVENTIVE_CARE', 'DENTAL_CARE', 'BREEDING_COMPLICATIONS', 'THIRD_PARTY_LIABILITY', 'LEGAL_EXPENSES', 'TRAVEL_COVERAGE', 'LOST_PET_ADVERTISING', 'CREMATION_BURIAL');

-- CreateEnum
CREATE TYPE "public"."BillingFrequency" AS ENUM ('MONTHLY', 'QUARTERLY', 'SEMI_ANNUALLY', 'ANNUALLY');

-- CreateEnum
CREATE TYPE "public"."PolicyStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'CANCELLED', 'EXPIRED', 'SUSPENDED', 'PENDING_RENEWAL', 'LAPSED');

-- CreateEnum
CREATE TYPE "public"."ClaimType" AS ENUM ('ACCIDENT', 'ILLNESS', 'EMERGENCY', 'ROUTINE_CARE', 'PREVENTIVE_CARE', 'DENTAL_CARE', 'BEHAVIORAL_THERAPY', 'ALTERNATIVE_THERAPY', 'LIABILITY_CLAIM', 'LEGAL_EXPENSES', 'LOST_PET', 'DEATH_BURIAL', 'BREEDING_COMPLICATION');

-- CreateEnum
CREATE TYPE "public"."ClaimStatus" AS ENUM ('SUBMITTED', 'ACKNOWLEDGED', 'UNDER_REVIEW', 'PENDING_INFORMATION', 'APPROVED', 'PARTIALLY_APPROVED', 'REJECTED', 'PAID', 'CLOSED', 'APPEALED');

-- CreateEnum
CREATE TYPE "public"."TemplateComplexity" AS ENUM ('SIMPLE', 'INTERMEDIATE', 'ADVANCED', 'EXPERT');

-- CreateEnum
CREATE TYPE "public"."TemplateStatus" AS ENUM ('DRAFT', 'REVIEW', 'PUBLISHED', 'DEPRECATED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "public"."LegalDocumentType" AS ENUM ('TERMS_OF_SERVICE', 'PRIVACY_POLICY', 'LIABILITY_WAIVER', 'INDEMNITY_AGREEMENT', 'NON_DISCLOSURE_AGREEMENT', 'POWER_OF_ATTORNEY', 'EMERGENCY_AUTHORIZATION', 'MEDICAL_CONSENT', 'LIABILITY_RELEASE', 'PROPERTY_DAMAGE_WAIVER', 'PHOTO_VIDEO_RELEASE', 'ARBITRATION_AGREEMENT', 'GOVERNING_LAW_CLAUSE', 'FORCE_MAJEURE_CLAUSE', 'TERMINATION_AGREEMENT');

-- CreateEnum
CREATE TYPE "public"."DocumentStatus" AS ENUM ('DRAFT', 'PENDING_REVIEW', 'ACTIVE', 'EXPIRED', 'REVOKED', 'SUSPENDED');

-- CreateTable
CREATE TABLE "public"."users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "username" TEXT,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT,
    "displayName" TEXT,
    "profilePicture" TEXT,
    "phoneNumber" TEXT,
    "whatsappNumber" TEXT,
    "dateOfBirth" TIMESTAMP(3),
    "gender" "public"."UserGender",
    "passwordHash" TEXT NOT NULL,
    "isEmailVerified" BOOLEAN NOT NULL DEFAULT false,
    "isPhoneVerified" BOOLEAN NOT NULL DEFAULT false,
    "emailVerificationToken" TEXT,
    "phoneVerificationToken" TEXT,
    "passwordResetToken" TEXT,
    "passwordResetExpires" TIMESTAMP(3),
    "twoFactorEnabled" BOOLEAN NOT NULL DEFAULT false,
    "twoFactorSecret" TEXT,
    "backupCodes" TEXT[],
    "role" "public"."UserRole" NOT NULL DEFAULT 'MEMBER',
    "status" "public"."UserStatus" NOT NULL DEFAULT 'ACTIVE',
    "location" JSONB,
    "timeZone" TEXT DEFAULT 'Europe/Paris',
    "language" TEXT NOT NULL DEFAULT 'fr',
    "bio" TEXT,
    "interests" TEXT[],
    "personalityTraits" TEXT[],
    "experienceLevel" "public"."ExperienceLevel" NOT NULL DEFAULT 'BEGINNER',
    "walkPreferences" JSONB,
    "availability" JSONB,
    "privacySettings" JSONB,
    "notificationSettings" JSONB,
    "communicationPreferences" JSONB,
    "theme" TEXT NOT NULL DEFAULT 'light',
    "units" TEXT NOT NULL DEFAULT 'metric',
    "points" INTEGER NOT NULL DEFAULT 0,
    "level" INTEGER NOT NULL DEFAULT 1,
    "totalWalks" INTEGER NOT NULL DEFAULT 0,
    "totalDistanceKm" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "joinDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "lastActiveAt" TIMESTAMP(3),
    "lastLoginAt" TIMESTAMP(3),
    "deactivatedAt" TIMESTAMP(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."pets" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "nickname" TEXT,
    "species" "public"."PetSpecies" NOT NULL,
    "breed" TEXT,
    "mixedBreed" BOOLEAN NOT NULL DEFAULT false,
    "secondaryBreed" TEXT,
    "age" INTEGER,
    "ageUnit" "public"."AgeUnit" NOT NULL DEFAULT 'YEARS',
    "gender" "public"."PetGender",
    "isNeutered" BOOLEAN NOT NULL DEFAULT false,
    "weight" DOUBLE PRECISION,
    "weightUnit" TEXT NOT NULL DEFAULT 'kg',
    "height" DOUBLE PRECISION,
    "color" TEXT,
    "markings" TEXT,
    "microchipId" TEXT,
    "photos" TEXT[],
    "videos" TEXT[],
    "profilePhoto" TEXT,
    "personalityTraits" TEXT[],
    "behaviorTraits" TEXT[],
    "energyLevel" "public"."EnergyLevel",
    "socialLevel" "public"."SocialLevel",
    "trainingLevel" "public"."TrainingLevel",
    "allergies" TEXT[],
    "medicalConditions" TEXT[],
    "medications" TEXT[],
    "specialNeeds" TEXT,
    "dietaryRestrictions" TEXT[],
    "isVaccinated" BOOLEAN NOT NULL DEFAULT false,
    "lastVetVisit" TIMESTAMP(3),
    "nextVetVisit" TIMESTAMP(3),
    "compatibility" JSONB,
    "playStyle" TEXT[],
    "favoriteActivities" TEXT[],
    "fearsTriggers" TEXT[],
    "feedingSchedule" JSONB,
    "exerciseNeeds" JSONB,
    "careInstructions" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "isLost" BOOLEAN NOT NULL DEFAULT false,
    "lostDetails" JSONB,
    "ownerId" TEXT NOT NULL,
    "emergencyContact" JSONB,
    "registrationNumber" TEXT,
    "pedigree" BOOLEAN NOT NULL DEFAULT false,
    "insuranceInfo" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."friendships" (
    "id" TEXT NOT NULL,
    "requesterId" TEXT NOT NULL,
    "receiverId" TEXT NOT NULL,
    "status" "public"."FriendshipStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "acceptedAt" TIMESTAMP(3),
    "rejectedAt" TIMESTAMP(3),
    "blockedAt" TIMESTAMP(3),

    CONSTRAINT "friendships_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."user_blocks" (
    "id" TEXT NOT NULL,
    "blockerId" TEXT NOT NULL,
    "blockedId" TEXT NOT NULL,
    "reason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_blocks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."emergency_contacts" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "email" TEXT,
    "relationship" TEXT NOT NULL,
    "priority" INTEGER NOT NULL DEFAULT 1,
    "notes" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "emergency_contacts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."pet_health_records" (
    "id" TEXT NOT NULL,
    "petId" TEXT NOT NULL,
    "recordType" "public"."HealthRecordType" NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "date" TIMESTAMP(3) NOT NULL,
    "veterinarian" TEXT,
    "vetClinic" TEXT,
    "vetPhone" TEXT,
    "nextDueDate" TIMESTAMP(3),
    "cost" DOUBLE PRECISION,
    "currency" TEXT NOT NULL DEFAULT 'EUR',
    "documents" TEXT[],
    "photos" TEXT[],
    "isPrivate" BOOLEAN NOT NULL DEFAULT true,
    "remindOwner" BOOLEAN NOT NULL DEFAULT false,
    "reminderDays" INTEGER DEFAULT 7,
    "tags" TEXT[],
    "symptoms" TEXT[],
    "treatment" TEXT,
    "followUpNeeded" BOOLEAN NOT NULL DEFAULT false,
    "followUpDate" TIMESTAMP(3),
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pet_health_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."walks" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "startTime" TIMESTAMP(3) NOT NULL,
    "estimatedDuration" INTEGER NOT NULL,
    "actualDuration" INTEGER,
    "meetingPoint" JSONB NOT NULL,
    "route" JSONB,
    "distance" DOUBLE PRECISION,
    "difficulty" "public"."WalkDifficulty" NOT NULL DEFAULT 'EASY',
    "terrain" TEXT[],
    "walkType" "public"."WalkType" NOT NULL,
    "pace" "public"."WalkPace" NOT NULL DEFAULT 'MODERATE',
    "maxParticipants" INTEGER,
    "minParticipants" INTEGER DEFAULT 1,
    "allowsNewMembers" BOOLEAN NOT NULL DEFAULT true,
    "ageRestrictions" JSONB,
    "breedRestrictions" TEXT[],
    "sizeRestrictions" TEXT[],
    "requiresVaccination" BOOLEAN NOT NULL DEFAULT false,
    "experienceRequired" "public"."ExperienceLevel" NOT NULL DEFAULT 'BEGINNER',
    "cost" DOUBLE PRECISION DEFAULT 0,
    "currency" TEXT NOT NULL DEFAULT 'EUR',
    "paymentRequired" BOOLEAN NOT NULL DEFAULT false,
    "paymentDeadline" TIMESTAMP(3),
    "weatherDependent" BOOLEAN NOT NULL DEFAULT false,
    "cancelConditions" TEXT[],
    "allowsPhotos" BOOLEAN NOT NULL DEFAULT true,
    "allowsCheckins" BOOLEAN NOT NULL DEFAULT true,
    "isRecurring" BOOLEAN NOT NULL DEFAULT false,
    "recurringPattern" JSONB,
    "status" "public"."WalkStatus" NOT NULL DEFAULT 'SCHEDULED',
    "cancellationReason" TEXT,
    "specialInstructions" TEXT,
    "equipmentNeeded" TEXT[],
    "tags" TEXT[],
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "allowsGuestPets" BOOLEAN NOT NULL DEFAULT false,
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "completedAt" TIMESTAMP(3),
    "cancelledAt" TIMESTAMP(3),
    "venueId" TEXT,

    CONSTRAINT "walks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."walk_participations" (
    "id" TEXT NOT NULL,
    "walkId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "petId" TEXT,
    "status" "public"."WalkParticipationStatus" NOT NULL DEFAULT 'PENDING',
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "confirmedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "leftAt" TIMESTAMP(3),
    "checkedIn" BOOLEAN NOT NULL DEFAULT false,
    "checkedInAt" TIMESTAMP(3),
    "rating" INTEGER,
    "review" TEXT,
    "emergencyContact" JSONB,
    "specialRequests" TEXT,
    "noShowReason" TEXT,
    "notes" TEXT,

    CONSTRAINT "walk_participations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."walk_photos" (
    "id" TEXT NOT NULL,
    "walkId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "photoUrl" TEXT NOT NULL,
    "caption" TEXT,
    "tagsUsers" TEXT[],
    "tagsPets" TEXT[],
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "walk_photos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."service_provider_profiles" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "businessName" TEXT NOT NULL,
    "businessType" "public"."ServiceType" NOT NULL,
    "specialties" TEXT[],
    "description" TEXT NOT NULL,
    "businessPhone" TEXT NOT NULL,
    "businessEmail" TEXT,
    "businessAddress" TEXT NOT NULL,
    "serviceArea" JSONB NOT NULL,
    "certifications" TEXT[],
    "licenses" TEXT[],
    "insurance" BOOLEAN NOT NULL DEFAULT false,
    "yearsExperience" INTEGER,
    "openingHours" JSONB NOT NULL,
    "pricing" JSONB NOT NULL,
    "acceptsEmergencies" BOOLEAN NOT NULL DEFAULT false,
    "homeVisits" BOOLEAN NOT NULL DEFAULT false,
    "averageRating" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalReviews" INTEGER NOT NULL DEFAULT 0,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "verifiedAt" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "service_provider_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."bookings" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "serviceProviderId" TEXT NOT NULL,
    "petId" TEXT,
    "serviceType" "public"."ServiceType" NOT NULL,
    "appointmentDate" TIMESTAMP(3) NOT NULL,
    "duration" INTEGER,
    "location" TEXT,
    "specialRequests" TEXT,
    "estimatedCost" DOUBLE PRECISION,
    "actualCost" DOUBLE PRECISION,
    "currency" TEXT NOT NULL DEFAULT 'EUR',
    "status" "public"."BookingStatus" NOT NULL DEFAULT 'PENDING',
    "notes" TEXT,
    "cancellationReason" TEXT,
    "rescheduledFrom" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "confirmedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "cancelledAt" TIMESTAMP(3),

    CONSTRAINT "bookings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."reviews" (
    "id" TEXT NOT NULL,
    "reviewerId" TEXT NOT NULL,
    "serviceProviderId" TEXT NOT NULL,
    "bookingId" TEXT,
    "rating" INTEGER NOT NULL,
    "title" TEXT,
    "content" TEXT NOT NULL,
    "pros" TEXT[],
    "cons" TEXT[],
    "wouldRecommend" BOOLEAN NOT NULL DEFAULT true,
    "serviceDate" TIMESTAMP(3) NOT NULL,
    "photos" TEXT[],
    "response" TEXT,
    "respondedAt" TIMESTAMP(3),
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "helpfulVotes" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."events" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "eventType" "public"."EventType" NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3),
    "location" JSONB NOT NULL,
    "capacity" INTEGER,
    "currentAttendees" INTEGER NOT NULL DEFAULT 0,
    "fee" DOUBLE PRECISION DEFAULT 0,
    "currency" TEXT NOT NULL DEFAULT 'EUR',
    "requiresRegistration" BOOLEAN NOT NULL DEFAULT true,
    "registrationDeadline" TIMESTAMP(3),
    "ageRestrictions" JSONB,
    "equipmentNeeded" TEXT[],
    "tags" TEXT[],
    "images" TEXT[],
    "requiresVaccination" BOOLEAN NOT NULL DEFAULT false,
    "allowsChildren" BOOLEAN NOT NULL DEFAULT true,
    "wheelchairAccessible" BOOLEAN NOT NULL DEFAULT false,
    "isOutdoor" BOOLEAN NOT NULL DEFAULT true,
    "weatherDependent" BOOLEAN NOT NULL DEFAULT false,
    "isRecurring" BOOLEAN NOT NULL DEFAULT false,
    "recurringRule" JSONB,
    "parentEventId" TEXT,
    "status" "public"."EventStatus" NOT NULL DEFAULT 'DRAFT',
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "cancellationPolicy" TEXT,
    "refundPolicy" TEXT,
    "allowsPhotos" BOOLEAN NOT NULL DEFAULT true,
    "allowsReviews" BOOLEAN NOT NULL DEFAULT true,
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "publishedAt" TIMESTAMP(3),
    "cancelledAt" TIMESTAMP(3),
    "venueId" TEXT,

    CONSTRAINT "events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."event_participations" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "petId" TEXT,
    "status" "public"."EventParticipationStatus" NOT NULL DEFAULT 'REGISTERED',
    "registeredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "confirmedAt" TIMESTAMP(3),
    "checkedInAt" TIMESTAMP(3),
    "checkedOutAt" TIMESTAMP(3),
    "paymentStatus" "public"."PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "paymentAmount" DOUBLE PRECISION,
    "paymentDate" TIMESTAMP(3),
    "paymentMethod" TEXT,
    "refundAmount" DOUBLE PRECISION,
    "refundDate" TIMESTAMP(3),
    "specialRequests" TEXT,
    "dietaryNeeds" TEXT[],
    "emergencyContact" JSONB,
    "waiverSigned" BOOLEAN NOT NULL DEFAULT false,
    "waiverSignedAt" TIMESTAMP(3),
    "rating" INTEGER,
    "review" TEXT,
    "photos" TEXT[],
    "certificates" TEXT[],
    "noShowReason" TEXT,
    "cancellationReason" TEXT,
    "cancelledAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "event_participations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."posts" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "images" TEXT[],
    "videos" TEXT[],
    "documents" TEXT[],
    "audioFiles" TEXT[],
    "thumbnails" TEXT[],
    "postType" "public"."PostType" NOT NULL,
    "category" "public"."PostCategory",
    "hashtags" TEXT[],
    "mentions" TEXT[],
    "visibility" "public"."PostVisibility" NOT NULL DEFAULT 'NEIGHBORHOOD',
    "targetAudience" JSONB,
    "location" JSONB,
    "walkId" TEXT,
    "eventId" TEXT,
    "petId" TEXT,
    "isPinned" BOOLEAN NOT NULL DEFAULT false,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "isSponsored" BOOLEAN NOT NULL DEFAULT false,
    "sponsorInfo" JSONB,
    "isEdited" BOOLEAN NOT NULL DEFAULT false,
    "editHistory" JSONB[],
    "moderationStatus" "public"."ModerationStatus" NOT NULL DEFAULT 'APPROVED',
    "moderatedAt" TIMESTAMP(3),
    "moderatedBy" TEXT,
    "moderationNotes" TEXT,
    "isUrgent" BOOLEAN NOT NULL DEFAULT false,
    "expiresAt" TIMESTAMP(3),
    "isResolved" BOOLEAN NOT NULL DEFAULT false,
    "resolvedAt" TIMESTAMP(3),
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "shareCount" INTEGER NOT NULL DEFAULT 0,
    "saveCount" INTEGER NOT NULL DEFAULT 0,
    "title" TEXT,
    "excerpt" TEXT,
    "tags" TEXT[],
    "authorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "publishedAt" TIMESTAMP(3),
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "posts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."post_shares" (
    "id" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "shareType" "public"."ShareType" NOT NULL DEFAULT 'REPOST',
    "message" TEXT,
    "platform" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "post_shares_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."post_saves" (
    "id" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "collection" TEXT DEFAULT 'default',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "post_saves_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."comments" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "images" TEXT[],
    "videos" TEXT[],
    "postId" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "parentId" TEXT,
    "threadLevel" INTEGER NOT NULL DEFAULT 0,
    "mentions" TEXT[],
    "isEdited" BOOLEAN NOT NULL DEFAULT false,
    "editHistory" JSONB[],
    "moderationStatus" "public"."ModerationStatus" NOT NULL DEFAULT 'APPROVED',
    "moderatedAt" TIMESTAMP(3),
    "moderatedBy" TEXT,
    "isHighlighted" BOOLEAN NOT NULL DEFAULT false,
    "isPinned" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "comments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."likes" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "postId" TEXT,
    "commentId" TEXT,
    "reactionType" "public"."ReactionType" NOT NULL DEFAULT 'LIKE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "likes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."conversations" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "description" TEXT,
    "avatar" TEXT,
    "isGroup" BOOLEAN NOT NULL DEFAULT false,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "maxParticipants" INTEGER DEFAULT 50,
    "requiresApproval" BOOLEAN NOT NULL DEFAULT false,
    "allowsInvites" BOOLEAN NOT NULL DEFAULT true,
    "isEncrypted" BOOLEAN NOT NULL DEFAULT false,
    "autoDeleteAfter" INTEGER,
    "lastMessageAt" TIMESTAMP(3),
    "isArchived" BOOLEAN NOT NULL DEFAULT false,
    "isMuted" BOOLEAN NOT NULL DEFAULT false,
    "tags" TEXT[],
    "category" "public"."ConversationCategory",
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "archivedAt" TIMESTAMP(3),

    CONSTRAINT "conversations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."conversation_participants" (
    "id" TEXT NOT NULL,
    "conversationId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" "public"."ParticipantRole" NOT NULL DEFAULT 'MEMBER',
    "status" "public"."ParticipantStatus" NOT NULL DEFAULT 'ACTIVE',
    "canAddMembers" BOOLEAN NOT NULL DEFAULT false,
    "canRemoveMembers" BOOLEAN NOT NULL DEFAULT false,
    "canEditGroup" BOOLEAN NOT NULL DEFAULT false,
    "canDeleteMessages" BOOLEAN NOT NULL DEFAULT false,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "leftAt" TIMESTAMP(3),
    "lastReadAt" TIMESTAMP(3),
    "lastActiveAt" TIMESTAMP(3),
    "notificationsEnabled" BOOLEAN NOT NULL DEFAULT true,
    "isMuted" BOOLEAN NOT NULL DEFAULT false,
    "mutedUntil" TIMESTAMP(3),
    "messageCount" INTEGER NOT NULL DEFAULT 0,
    "invitedBy" TEXT,
    "invitedAt" TIMESTAMP(3),
    "kickedBy" TEXT,
    "kickedAt" TIMESTAMP(3),
    "kickReason" TEXT,

    CONSTRAINT "conversation_participants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."messages" (
    "id" TEXT NOT NULL,
    "content" TEXT,
    "messageType" "public"."MessageType" NOT NULL DEFAULT 'TEXT',
    "attachments" TEXT[],
    "thumbnails" TEXT[],
    "mentions" TEXT[],
    "replyToId" TEXT,
    "forwardedFrom" TEXT,
    "location" JSONB,
    "walkId" TEXT,
    "eventId" TEXT,
    "petId" TEXT,
    "conversationId" TEXT NOT NULL,
    "senderId" TEXT NOT NULL,
    "receiverId" TEXT,
    "deliveredAt" TIMESTAMP(3),
    "readBy" JSONB,
    "isEdited" BOOLEAN NOT NULL DEFAULT false,
    "editedAt" TIMESTAMP(3),
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TIMESTAMP(3),
    "deletedBy" TEXT,
    "deleteType" "public"."DeleteType" NOT NULL DEFAULT 'FOR_ME',
    "priority" "public"."MessagePriority" NOT NULL DEFAULT 'NORMAL',
    "isUrgent" BOOLEAN NOT NULL DEFAULT false,
    "expiresAt" TIMESTAMP(3),
    "reactions" JSONB,
    "isPinned" BOOLEAN NOT NULL DEFAULT false,
    "pinnedBy" TEXT,
    "pinnedAt" TIMESTAMP(3),
    "systemAction" "public"."SystemAction",
    "systemData" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."venues" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT,
    "venueType" "public"."VenueType" NOT NULL,
    "subCategory" TEXT,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "zipCode" TEXT NOT NULL,
    "coordinates" JSONB NOT NULL,
    "neighborhood" TEXT,
    "landmarks" TEXT[],
    "phoneNumber" TEXT,
    "alternatePhone" TEXT,
    "email" TEXT,
    "website" TEXT,
    "socialMedia" JSONB,
    "description" TEXT,
    "amenities" TEXT[],
    "services" TEXT[],
    "specialties" TEXT[],
    "openingHours" JSONB,
    "seasonalHours" JSONB,
    "isTemporarilyClosed" BOOLEAN NOT NULL DEFAULT false,
    "closureReason" TEXT,
    "reopenDate" TIMESTAMP(3),
    "priceRange" "public"."PriceRange",
    "acceptsCards" BOOLEAN NOT NULL DEFAULT true,
    "acceptsCash" BOOLEAN NOT NULL DEFAULT true,
    "parkingInfo" TEXT,
    "petsAllowed" BOOLEAN NOT NULL DEFAULT true,
    "petRestrictions" TEXT[],
    "wheelchairAccessible" BOOLEAN NOT NULL DEFAULT false,
    "hasParking" BOOLEAN NOT NULL DEFAULT false,
    "hasWifi" BOOLEAN NOT NULL DEFAULT false,
    "hasOutdoorSpace" BOOLEAN NOT NULL DEFAULT false,
    "allowsPhotos" BOOLEAN NOT NULL DEFAULT true,
    "photos" TEXT[],
    "videos" TEXT[],
    "virtualTour" TEXT,
    "logo" TEXT,
    "coverPhoto" TEXT,
    "averageRating" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalReviews" INTEGER NOT NULL DEFAULT 0,
    "ratingBreakdown" JSONB,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "verifiedAt" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "isSponsored" BOOLEAN NOT NULL DEFAULT false,
    "tags" TEXT[],
    "keywords" TEXT[],
    "ownerId" TEXT,
    "managedBy" TEXT[],
    "claimCode" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "venues_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."venue_reviews" (
    "id" TEXT NOT NULL,
    "venueId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "title" TEXT,
    "review" TEXT,
    "pros" TEXT[],
    "cons" TEXT[],
    "serviceRating" INTEGER,
    "valueRating" INTEGER,
    "cleanlinessRating" INTEGER,
    "locationRating" INTEGER,
    "visitDate" TIMESTAMP(3),
    "visitReason" TEXT,
    "serviceUsed" TEXT,
    "petType" TEXT,
    "groupSize" INTEGER,
    "photos" TEXT[],
    "videos" TEXT[],
    "receipts" TEXT[],
    "wouldRecommend" BOOLEAN NOT NULL DEFAULT true,
    "recommendedFor" TEXT[],
    "bestTime" TEXT,
    "tips" TEXT[],
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "isEdited" BOOLEAN NOT NULL DEFAULT false,
    "editedAt" TIMESTAMP(3),
    "flaggedCount" INTEGER NOT NULL DEFAULT 0,
    "helpfulVotes" INTEGER NOT NULL DEFAULT 0,
    "notHelpfulVotes" INTEGER NOT NULL DEFAULT 0,
    "businessResponse" TEXT,
    "respondedAt" TIMESTAMP(3),
    "respondedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "venue_reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."badges" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "shortDescription" TEXT,
    "icon" TEXT NOT NULL,
    "color" TEXT NOT NULL DEFAULT '#3B82F6',
    "animation" TEXT,
    "category" "public"."BadgeCategory" NOT NULL,
    "rarity" "public"."BadgeRarity" NOT NULL DEFAULT 'COMMON',
    "difficulty" "public"."BadgeDifficulty" NOT NULL DEFAULT 'EASY',
    "criteria" JSONB NOT NULL,
    "prerequisites" TEXT[],
    "isSecret" BOOLEAN NOT NULL DEFAULT false,
    "points" INTEGER NOT NULL DEFAULT 0,
    "unlocks" TEXT[],
    "perks" JSONB,
    "hasProgress" BOOLEAN NOT NULL DEFAULT false,
    "maxProgress" INTEGER,
    "progressUnit" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "totalAwarded" INTEGER NOT NULL DEFAULT 0,
    "uniqueHolders" INTEGER NOT NULL DEFAULT 0,
    "tags" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "badges_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."user_badges" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "badgeId" TEXT NOT NULL,
    "earnedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "earnedBy" TEXT,
    "progress" JSONB,
    "completedSteps" TEXT[],
    "isDisplayed" BOOLEAN NOT NULL DEFAULT true,
    "isFavorite" BOOLEAN NOT NULL DEFAULT false,
    "displayOrder" INTEGER,
    "relatedContent" JSONB,
    "witnessedBy" TEXT[],
    "location" TEXT,
    "notificationSent" BOOLEAN NOT NULL DEFAULT false,
    "celebrationViewed" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "user_badges_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."notifications" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "public"."NotificationType" NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "shortMessage" TEXT,
    "icon" TEXT,
    "image" TEXT,
    "color" TEXT,
    "actionUrl" TEXT,
    "actionLabel" TEXT,
    "deepLink" TEXT,
    "data" JSONB,
    "relatedEntityId" TEXT,
    "relatedEntityType" TEXT,
    "tags" TEXT[],
    "priority" "public"."NotificationPriority" NOT NULL DEFAULT 'NORMAL',
    "category" "public"."NotificationCategory" NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "readAt" TIMESTAMP(3),
    "deliveryMethod" TEXT[],
    "deliveredAt" TIMESTAMP(3),
    "failedDelivery" BOOLEAN NOT NULL DEFAULT false,
    "failureReason" TEXT,
    "scheduledFor" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "clickedAt" TIMESTAMP(3),
    "dismissedAt" TIMESTAMP(3),
    "groupKey" TEXT,
    "batchId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."reports" (
    "id" TEXT NOT NULL,
    "reportedById" TEXT NOT NULL,
    "reportedUserId" TEXT,
    "contentType" "public"."ContentType" NOT NULL,
    "contentId" TEXT NOT NULL,
    "contentUrl" TEXT,
    "contentSnapshot" JSONB,
    "reason" "public"."ReportReason" NOT NULL,
    "category" "public"."ReportCategory",
    "description" TEXT,
    "evidence" TEXT[],
    "severity" "public"."ReportSeverity" NOT NULL DEFAULT 'MEDIUM',
    "isUrgent" BOOLEAN NOT NULL DEFAULT false,
    "affectedUsers" TEXT[],
    "status" "public"."ReportStatus" NOT NULL DEFAULT 'PENDING',
    "reviewedById" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "reviewNotes" TEXT,
    "actionTaken" TEXT,
    "resolution" "public"."ReportResolution",
    "resolutionNotes" TEXT,
    "escalatedTo" TEXT,
    "followUpRequired" BOOLEAN NOT NULL DEFAULT false,
    "followUpDate" TIMESTAMP(3),
    "appealable" BOOLEAN NOT NULL DEFAULT true,
    "appealDeadline" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "postId" TEXT,

    CONSTRAINT "reports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."user_activities" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "activityType" "public"."ActivityType" NOT NULL,
    "activityData" JSONB NOT NULL,
    "sessionId" TEXT,
    "deviceInfo" JSONB,
    "location" JSONB,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "referrer" TEXT,
    "duration" INTEGER,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_activities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."location_history" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "coordinates" JSONB NOT NULL,
    "address" TEXT,
    "neighborhood" TEXT,
    "city" TEXT,
    "country" TEXT,
    "activityType" TEXT,
    "accuracy" DOUBLE PRECISION,
    "speed" DOUBLE PRECISION,
    "heading" DOUBLE PRECISION,
    "altitude" DOUBLE PRECISION,
    "isManualEntry" BOOLEAN NOT NULL DEFAULT false,
    "source" "public"."LocationSource" NOT NULL DEFAULT 'GPS',
    "purpose" TEXT,
    "isPrivate" BOOLEAN NOT NULL DEFAULT true,
    "sharedWith" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3),

    CONSTRAINT "location_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."geofences" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdById" TEXT NOT NULL,
    "centerPoint" JSONB NOT NULL,
    "radius" DOUBLE PRECISION NOT NULL,
    "boundary" JSONB,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "triggerOnEnter" BOOLEAN NOT NULL DEFAULT true,
    "triggerOnExit" BOOLEAN NOT NULL DEFAULT false,
    "triggerOnDwell" BOOLEAN NOT NULL DEFAULT false,
    "dwellTime" INTEGER,
    "notifyUsers" TEXT[],
    "notificationMessage" TEXT,
    "alertType" "public"."AlertType" NOT NULL DEFAULT 'INFO',
    "purpose" "public"."GeofencePurpose" NOT NULL,
    "relatedEntityId" TEXT,
    "relatedEntityType" TEXT,
    "activeFrom" TIMESTAMP(3),
    "activeTo" TIMESTAMP(3),
    "activeDays" TEXT[],
    "activeHours" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "geofences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."geofence_events" (
    "id" TEXT NOT NULL,
    "geofenceId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "eventType" "public"."GeofenceEventType" NOT NULL,
    "location" JSONB NOT NULL,
    "accuracy" DOUBLE PRECISION,
    "dwellTime" INTEGER,
    "metadata" JSONB,
    "triggeredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "geofence_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."content_moderation" (
    "id" TEXT NOT NULL,
    "contentType" "public"."ContentType" NOT NULL,
    "contentId" TEXT NOT NULL,
    "moderationType" "public"."ModerationType" NOT NULL,
    "aiConfidence" DOUBLE PRECISION,
    "aiFlags" TEXT[],
    "aiRecommendation" "public"."ModerationAction" NOT NULL,
    "reviewedById" TEXT,
    "humanDecision" "public"."ModerationAction",
    "reviewNotes" TEXT,
    "reviewTime" INTEGER,
    "sentimentScore" DOUBLE PRECISION,
    "toxicityScore" DOUBLE PRECISION,
    "languageDetected" TEXT,
    "explicitContent" BOOLEAN NOT NULL DEFAULT false,
    "minorSafety" BOOLEAN NOT NULL DEFAULT true,
    "finalDecision" "public"."ModerationAction" NOT NULL,
    "actionTaken" TEXT[],
    "reasonCodes" TEXT[],
    "appealable" BOOLEAN NOT NULL DEFAULT true,
    "appealed" BOOLEAN NOT NULL DEFAULT false,
    "appealedAt" TIMESTAMP(3),
    "appealDecision" "public"."ModerationAction",
    "appealNotes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "decidedAt" TIMESTAMP(3),

    CONSTRAINT "content_moderation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."search_queries" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "query" TEXT NOT NULL,
    "queryType" "public"."SearchType" NOT NULL,
    "filters" JSONB,
    "location" JSONB,
    "resultCount" INTEGER NOT NULL DEFAULT 0,
    "clickedResults" TEXT[],
    "bookmarkedResults" TEXT[],
    "source" TEXT,
    "sessionId" TEXT,
    "deviceType" TEXT,
    "responseTime" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "search_queries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."subscriptions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "planType" "public"."SubscriptionPlan" NOT NULL,
    "status" "public"."SubscriptionStatus" NOT NULL DEFAULT 'ACTIVE',
    "currentPeriodStart" TIMESTAMP(3) NOT NULL,
    "currentPeriodEnd" TIMESTAMP(3) NOT NULL,
    "cancelAtPeriodEnd" BOOLEAN NOT NULL DEFAULT false,
    "cancelledAt" TIMESTAMP(3),
    "cancelReason" TEXT,
    "stripeCustomerId" TEXT,
    "stripeSubscriptionId" TEXT,
    "paymentMethodId" TEXT,
    "currency" TEXT NOT NULL DEFAULT 'EUR',
    "amount" DOUBLE PRECISION NOT NULL,
    "usageData" JSONB,
    "limitsData" JSONB,
    "trialStart" TIMESTAMP(3),
    "trialEnd" TIMESTAMP(3),
    "isTrialing" BOOLEAN NOT NULL DEFAULT false,
    "discountCode" TEXT,
    "discountAmount" DOUBLE PRECISION DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "subscriptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."invoices" (
    "id" TEXT NOT NULL,
    "subscriptionId" TEXT NOT NULL,
    "invoiceNumber" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'EUR',
    "status" "public"."InvoiceStatus" NOT NULL DEFAULT 'PENDING',
    "invoiceDate" TIMESTAMP(3) NOT NULL,
    "dueDate" TIMESTAMP(3) NOT NULL,
    "paidAt" TIMESTAMP(3),
    "paymentIntentId" TEXT,
    "paymentMethodId" TEXT,
    "lineItems" JSONB NOT NULL,
    "subtotal" DOUBLE PRECISION NOT NULL,
    "taxAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "discountAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalAmount" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "invoices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."app_settings" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" JSONB NOT NULL,
    "description" TEXT,
    "category" TEXT,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "app_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."audit_logs" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "action" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT,
    "oldValues" JSONB,
    "newValues" JSONB,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."system_notifications" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "type" "public"."SystemNotificationType" NOT NULL DEFAULT 'INFO',
    "priority" "public"."NotificationPriority" NOT NULL DEFAULT 'NORMAL',
    "targetUserIds" TEXT[],
    "targetGroups" TEXT[],
    "targetRoles" TEXT[],
    "targetLocations" TEXT[],
    "publishAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "isSticky" BOOLEAN NOT NULL DEFAULT false,
    "showOnLogin" BOOLEAN NOT NULL DEFAULT false,
    "requiresAck" BOOLEAN NOT NULL DEFAULT false,
    "imageUrl" TEXT,
    "actionUrl" TEXT,
    "actionLabel" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "totalSent" INTEGER NOT NULL DEFAULT 0,
    "totalRead" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "system_notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."classifieds" (
    "id" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" "public"."ClassifiedCategory" NOT NULL,
    "subcategory" TEXT,
    "price" DOUBLE PRECISION,
    "currency" TEXT NOT NULL DEFAULT 'EUR',
    "priceType" "public"."PriceType" NOT NULL DEFAULT 'FIXED',
    "isNegotiable" BOOLEAN NOT NULL DEFAULT false,
    "condition" "public"."ItemCondition",
    "brand" TEXT,
    "model" TEXT,
    "size" TEXT,
    "color" TEXT,
    "age" TEXT,
    "images" TEXT[],
    "videos" TEXT[],
    "location" JSONB NOT NULL,
    "deliveryOptions" TEXT[],
    "deliveryRadius" DOUBLE PRECISION,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isReserved" BOOLEAN NOT NULL DEFAULT false,
    "isSold" BOOLEAN NOT NULL DEFAULT false,
    "availableFrom" TIMESTAMP(3),
    "availableUntil" TIMESTAMP(3),
    "contactMethod" "public"."ContactMethod" NOT NULL DEFAULT 'IN_APP',
    "phoneVisible" BOOLEAN NOT NULL DEFAULT false,
    "emailVisible" BOOLEAN NOT NULL DEFAULT false,
    "moderationStatus" "public"."ModerationStatus" NOT NULL DEFAULT 'PENDING',
    "moderatedAt" TIMESTAMP(3),
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "favoriteCount" INTEGER NOT NULL DEFAULT 0,
    "inquiryCount" INTEGER NOT NULL DEFAULT 0,
    "tags" TEXT[],
    "hashtags" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "soldAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),

    CONSTRAINT "classifieds_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."classified_inquiries" (
    "id" TEXT NOT NULL,
    "classifiedId" TEXT NOT NULL,
    "inquirerId" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "offerPrice" DOUBLE PRECISION,
    "isSerious" BOOLEAN NOT NULL DEFAULT true,
    "response" TEXT,
    "respondedAt" TIMESTAMP(3),
    "status" "public"."InquiryStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "classified_inquiries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."classified_favorites" (
    "id" TEXT NOT NULL,
    "classifiedId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "classified_favorites_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."questions" (
    "id" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "category" "public"."QuestionCategory" NOT NULL,
    "tags" TEXT[],
    "urgency" "public"."QuestionUrgency" NOT NULL DEFAULT 'NORMAL',
    "isAnonymous" BOOLEAN NOT NULL DEFAULT false,
    "allowsComments" BOOLEAN NOT NULL DEFAULT true,
    "isResolved" BOOLEAN NOT NULL DEFAULT false,
    "resolvedAt" TIMESTAMP(3),
    "resolvedBy" TEXT,
    "moderationStatus" "public"."ModerationStatus" NOT NULL DEFAULT 'APPROVED',
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "voteScore" INTEGER NOT NULL DEFAULT 0,
    "images" TEXT[],
    "videos" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "questions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."answers" (
    "id" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "isExpertAnswer" BOOLEAN NOT NULL DEFAULT false,
    "images" TEXT[],
    "videos" TEXT[],
    "documents" TEXT[],
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "moderationStatus" "public"."ModerationStatus" NOT NULL DEFAULT 'APPROVED',
    "voteScore" INTEGER NOT NULL DEFAULT 0,
    "isAccepted" BOOLEAN NOT NULL DEFAULT false,
    "acceptedAt" TIMESTAMP(3),
    "isEdited" BOOLEAN NOT NULL DEFAULT false,
    "editedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "answers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."question_votes" (
    "id" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "voteType" "public"."VoteType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "question_votes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."answer_votes" (
    "id" TEXT NOT NULL,
    "answerId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "voteType" "public"."VoteType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "answer_votes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."community_groups" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "groupType" "public"."GroupType" NOT NULL,
    "privacy" "public"."GroupPrivacy" NOT NULL DEFAULT 'PUBLIC',
    "category" "public"."GroupCategory",
    "location" JSONB,
    "radius" DOUBLE PRECISION,
    "neighborhoods" TEXT[],
    "maxMembers" INTEGER,
    "requiresApproval" BOOLEAN NOT NULL DEFAULT false,
    "allowsInvites" BOOLEAN NOT NULL DEFAULT true,
    "minimumAge" INTEGER,
    "allowedSpecies" "public"."PetSpecies"[],
    "avatar" TEXT,
    "coverPhoto" TEXT,
    "color" TEXT,
    "rules" TEXT[],
    "guidelines" TEXT,
    "allowsEvents" BOOLEAN NOT NULL DEFAULT true,
    "allowsWalks" BOOLEAN NOT NULL DEFAULT true,
    "allowsMarketplace" BOOLEAN NOT NULL DEFAULT true,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "moderationLevel" "public"."GroupModerationLevel" NOT NULL DEFAULT 'MODERATE',
    "memberCount" INTEGER NOT NULL DEFAULT 0,
    "postCount" INTEGER NOT NULL DEFAULT 0,
    "eventCount" INTEGER NOT NULL DEFAULT 0,
    "tags" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "community_groups_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."group_memberships" (
    "id" TEXT NOT NULL,
    "groupId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" "public"."GroupRole" NOT NULL DEFAULT 'MEMBER',
    "status" "public"."MembershipStatus" NOT NULL DEFAULT 'ACTIVE',
    "canPost" BOOLEAN NOT NULL DEFAULT true,
    "canComment" BOOLEAN NOT NULL DEFAULT true,
    "canCreateEvents" BOOLEAN NOT NULL DEFAULT false,
    "canInvite" BOOLEAN NOT NULL DEFAULT false,
    "canModerate" BOOLEAN NOT NULL DEFAULT false,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastActiveAt" TIMESTAMP(3),
    "notificationsEnabled" BOOLEAN NOT NULL DEFAULT true,
    "emailDigest" BOOLEAN NOT NULL DEFAULT false,
    "warningCount" INTEGER NOT NULL DEFAULT 0,
    "isMuted" BOOLEAN NOT NULL DEFAULT false,
    "mutedUntil" TIMESTAMP(3),
    "mutedReason" TEXT,
    "joinReason" TEXT,
    "invitedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "group_memberships_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."group_posts" (
    "id" TEXT NOT NULL,
    "groupId" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "title" TEXT,
    "content" TEXT NOT NULL,
    "postType" "public"."PostType" NOT NULL DEFAULT 'TEXT',
    "images" TEXT[],
    "videos" TEXT[],
    "documents" TEXT[],
    "isPinned" BOOLEAN NOT NULL DEFAULT false,
    "allowsComments" BOOLEAN NOT NULL DEFAULT true,
    "moderationStatus" "public"."ModerationStatus" NOT NULL DEFAULT 'APPROVED',
    "tags" TEXT[],
    "category" "public"."PostCategory",
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "group_posts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."group_events" (
    "id" TEXT NOT NULL,
    "groupId" TEXT NOT NULL,
    "organizerId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "eventType" "public"."EventType" NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3),
    "isRecurring" BOOLEAN NOT NULL DEFAULT false,
    "location" JSONB NOT NULL,
    "isOnline" BOOLEAN NOT NULL DEFAULT false,
    "maxAttendees" INTEGER,
    "requiresApproval" BOOLEAN NOT NULL DEFAULT false,
    "membersOnly" BOOLEAN NOT NULL DEFAULT true,
    "allowsGuests" BOOLEAN NOT NULL DEFAULT false,
    "status" "public"."EventStatus" NOT NULL DEFAULT 'PUBLISHED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "group_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."pet_lending_contracts" (
    "id" TEXT NOT NULL,
    "lenderId" TEXT NOT NULL,
    "borrowerId" TEXT NOT NULL,
    "petId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "contractType" "public"."ContractType" NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "duration" INTEGER NOT NULL,
    "isRecurring" BOOLEAN NOT NULL DEFAULT false,
    "recurringPattern" JSONB,
    "pickupLocation" JSONB NOT NULL,
    "dropoffLocation" JSONB NOT NULL,
    "allowLocationChange" BOOLEAN NOT NULL DEFAULT false,
    "dailyRate" DOUBLE PRECISION DEFAULT 0,
    "totalCost" DOUBLE PRECISION,
    "currency" TEXT NOT NULL DEFAULT 'EUR',
    "paymentMethod" "public"."PaymentMethod" NOT NULL DEFAULT 'CASH',
    "securityDepositRequired" BOOLEAN NOT NULL DEFAULT true,
    "securityDepositAmount" DOUBLE PRECISION,
    "careInstructions" TEXT NOT NULL,
    "feedingSchedule" JSONB NOT NULL,
    "exerciseRequirements" JSONB NOT NULL,
    "medicationSchedule" JSONB,
    "specialNeeds" TEXT,
    "emergencyInstructions" TEXT,
    "vaccinationRequired" BOOLEAN NOT NULL DEFAULT true,
    "healthCertificateRequired" BOOLEAN NOT NULL DEFAULT true,
    "healthCertificateDate" TIMESTAMP(3),
    "vetContactRequired" BOOLEAN NOT NULL DEFAULT true,
    "allowedActivities" TEXT[],
    "restrictedActivities" TEXT[],
    "allowsOtherPets" BOOLEAN NOT NULL DEFAULT false,
    "allowsChildren" BOOLEAN NOT NULL DEFAULT true,
    "allowsOutdoorTime" BOOLEAN NOT NULL DEFAULT true,
    "maxWalkDistance" DOUBLE PRECISION,
    "emergencyContactInfo" JSONB NOT NULL,
    "preferredVetId" TEXT,
    "insuranceInfo" JSONB,
    "allowsVetVisits" BOOLEAN NOT NULL DEFAULT true,
    "emergencyBudgetLimit" DOUBLE PRECISION,
    "terms" TEXT NOT NULL,
    "liabilityTerms" TEXT NOT NULL,
    "cancellationPolicy" TEXT NOT NULL,
    "lateReturnPolicy" TEXT,
    "damagePolicy" TEXT,
    "status" "public"."ContractStatus" NOT NULL DEFAULT 'DRAFT',
    "signedByLender" BOOLEAN NOT NULL DEFAULT false,
    "signedByBorrower" BOOLEAN NOT NULL DEFAULT false,
    "lenderSignedAt" TIMESTAMP(3),
    "borrowerSignedAt" TIMESTAMP(3),
    "witnessRequired" BOOLEAN NOT NULL DEFAULT false,
    "notarizedRequired" BOOLEAN NOT NULL DEFAULT false,
    "allowsReview" BOOLEAN NOT NULL DEFAULT true,
    "lenderRating" INTEGER,
    "borrowerRating" INTEGER,
    "lenderReview" TEXT,
    "borrowerReview" TEXT,
    "allowsPhotoUpdates" BOOLEAN NOT NULL DEFAULT true,
    "allowsVideoUpdates" BOOLEAN NOT NULL DEFAULT false,
    "updateFrequency" "public"."UpdateFrequency" NOT NULL DEFAULT 'DAILY',
    "lastUpdateSent" TIMESTAMP(3),
    "totalActiveTime" INTEGER DEFAULT 0,
    "handoverCount" INTEGER NOT NULL DEFAULT 0,
    "extensionCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "activatedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "cancelledAt" TIMESTAMP(3),

    CONSTRAINT "pet_lending_contracts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."contract_witnesses" (
    "id" TEXT NOT NULL,
    "contractId" TEXT NOT NULL,
    "witnessId" TEXT NOT NULL,
    "witnessType" "public"."WitnessType" NOT NULL,
    "signedAt" TIMESTAMP(3),
    "signature" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "contract_witnesses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."pet_handovers" (
    "id" TEXT NOT NULL,
    "contractId" TEXT NOT NULL,
    "handoverType" "public"."HandoverType" NOT NULL,
    "lenderId" TEXT NOT NULL,
    "borrowerId" TEXT NOT NULL,
    "supervisorId" TEXT,
    "scheduledAt" TIMESTAMP(3) NOT NULL,
    "actualAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "location" JSONB NOT NULL,
    "petCondition" JSONB NOT NULL,
    "healthCheck" JSONB,
    "behaviorNotes" TEXT,
    "itemsTransferred" JSONB NOT NULL,
    "returnItems" JSONB,
    "missingItems" TEXT[],
    "photos" TEXT[],
    "videos" TEXT[],
    "signedDocument" TEXT,
    "verificationMethod" "public"."VerificationMethod" NOT NULL DEFAULT 'PHOTO_ID',
    "securityCode" TEXT,
    "bothPartiesPresent" BOOLEAN NOT NULL DEFAULT true,
    "issues" TEXT[],
    "lenderNotes" TEXT,
    "borrowerNotes" TEXT,
    "supervisorNotes" TEXT,
    "status" "public"."HandoverStatus" NOT NULL DEFAULT 'SCHEDULED',
    "confirmedByLender" BOOLEAN NOT NULL DEFAULT false,
    "confirmedByBorrower" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pet_handovers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."contract_extensions" (
    "id" TEXT NOT NULL,
    "contractId" TEXT NOT NULL,
    "requestedBy" TEXT NOT NULL,
    "originalEndDate" TIMESTAMP(3) NOT NULL,
    "newEndDate" TIMESTAMP(3) NOT NULL,
    "additionalDays" INTEGER NOT NULL,
    "reason" TEXT NOT NULL,
    "additionalCost" DOUBLE PRECISION DEFAULT 0,
    "newTotalCost" DOUBLE PRECISION,
    "status" "public"."ExtensionStatus" NOT NULL DEFAULT 'PENDING',
    "approvedBy" TEXT,
    "approvedAt" TIMESTAMP(3),
    "rejectedReason" TEXT,
    "modifiedTerms" TEXT,
    "requiresNewSigning" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "contract_extensions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."contract_updates" (
    "id" TEXT NOT NULL,
    "contractId" TEXT NOT NULL,
    "senderId" TEXT NOT NULL,
    "updateType" "public"."UpdateType" NOT NULL,
    "title" TEXT,
    "message" TEXT NOT NULL,
    "photos" TEXT[],
    "videos" TEXT[],
    "location" JSONB,
    "petStatus" JSONB,
    "isScheduled" BOOLEAN NOT NULL DEFAULT false,
    "scheduledFor" TIMESTAMP(3),
    "requiresResponse" BOOLEAN NOT NULL DEFAULT false,
    "responseReceived" BOOLEAN NOT NULL DEFAULT false,
    "responseMessage" TEXT,
    "respondedAt" TIMESTAMP(3),
    "priority" "public"."UpdatePriority" NOT NULL DEFAULT 'NORMAL',
    "isEmergency" BOOLEAN NOT NULL DEFAULT false,
    "readAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "contract_updates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."emergency_responses" (
    "id" TEXT NOT NULL,
    "contractId" TEXT,
    "userId" TEXT NOT NULL,
    "emergencyType" "public"."EmergencyType" NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "severity" "public"."EmergencySeverity" NOT NULL,
    "location" JSONB,
    "petId" TEXT,
    "petCondition" TEXT,
    "immediateActions" TEXT,
    "actionsTaken" TEXT[],
    "emergencyContacts" TEXT[],
    "vetContacted" BOOLEAN NOT NULL DEFAULT false,
    "vetDetails" JSONB,
    "authorityContacted" BOOLEAN NOT NULL DEFAULT false,
    "authorityDetails" JSONB,
    "status" "public"."EmergencyStatus" NOT NULL DEFAULT 'ACTIVE',
    "resolvedAt" TIMESTAMP(3),
    "resolution" TEXT,
    "followUpRequired" BOOLEAN NOT NULL DEFAULT false,
    "followUpDate" TIMESTAMP(3),
    "photos" TEXT[],
    "videos" TEXT[],
    "documents" TEXT[],
    "emergencyCost" DOUBLE PRECISION DEFAULT 0,
    "insuranceClaimed" BOOLEAN NOT NULL DEFAULT false,
    "insuranceClaimId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "emergency_responses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."contract_disputes" (
    "id" TEXT NOT NULL,
    "contractId" TEXT NOT NULL,
    "raisedById" TEXT NOT NULL,
    "againstUserId" TEXT NOT NULL,
    "disputeType" "public"."DisputeType" NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" "public"."DisputeCategory" NOT NULL,
    "evidence" TEXT[],
    "witnesses" TEXT[],
    "chatHistory" JSONB,
    "severity" "public"."DisputeSeverity" NOT NULL DEFAULT 'MODERATE',
    "financialImpact" DOUBLE PRECISION DEFAULT 0,
    "requestedResolution" TEXT NOT NULL,
    "status" "public"."DisputeStatus" NOT NULL DEFAULT 'OPEN',
    "mediatorId" TEXT,
    "mediationNotes" TEXT,
    "resolutionType" "public"."ResolutionType",
    "resolution" TEXT,
    "compensationAmount" DOUBLE PRECISION DEFAULT 0,
    "agreedByBoth" BOOLEAN NOT NULL DEFAULT false,
    "resolvedAt" TIMESTAMP(3),
    "appealable" BOOLEAN NOT NULL DEFAULT true,
    "appealDeadline" TIMESTAMP(3),
    "appealRaised" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "contract_disputes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."vet_profiles" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "professionalType" "public"."VetProfessionalType" NOT NULL,
    "licenseNumber" TEXT NOT NULL,
    "licenseIssuer" TEXT NOT NULL,
    "licenseExpiry" TIMESTAMP(3) NOT NULL,
    "practiceName" TEXT,
    "practiceType" "public"."VetPracticeType" NOT NULL,
    "specializations" TEXT[],
    "certifications" TEXT[],
    "yearsExperience" INTEGER NOT NULL,
    "education" JSONB NOT NULL,
    "languages" TEXT[],
    "servicesOffered" TEXT[],
    "consultationTypes" "public"."VetConsultationType"[],
    "availability" JSONB NOT NULL,
    "emergencyAvailable" BOOLEAN NOT NULL DEFAULT false,
    "houseCalls" BOOLEAN NOT NULL DEFAULT false,
    "telemedicine" BOOLEAN NOT NULL DEFAULT true,
    "serviceAreas" TEXT[],
    "maxTravelDistance" DOUBLE PRECISION,
    "consultationFees" JSONB NOT NULL,
    "acceptsInsurance" BOOLEAN NOT NULL DEFAULT true,
    "acceptedInsurers" TEXT[],
    "paymentMethods" "public"."PaymentMethod"[],
    "clinicAffiliations" TEXT[],
    "professionalMemberships" TEXT[],
    "referralNetwork" TEXT[],
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "verificationLevel" "public"."VetVerificationLevel" NOT NULL DEFAULT 'BASIC',
    "verifiedAt" TIMESTAMP(3),
    "backgroundCheckDate" TIMESTAMP(3),
    "averageRating" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalReviews" INTEGER NOT NULL DEFAULT 0,
    "totalConsultations" INTEGER NOT NULL DEFAULT 0,
    "responseTime" DOUBLE PRECISION,
    "preferredContactMethod" "public"."VetContactMethod" NOT NULL DEFAULT 'IN_APP',
    "autoResponder" BOOLEAN NOT NULL DEFAULT false,
    "autoResponse" TEXT,
    "acceptsNewClients" BOOLEAN NOT NULL DEFAULT true,
    "requiresReferral" BOOLEAN NOT NULL DEFAULT false,
    "specialtyFocus" TEXT,
    "treatmentPhilosophy" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "onVacation" BOOLEAN NOT NULL DEFAULT false,
    "vacationUntil" TIMESTAMP(3),
    "lastActiveAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "vet_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."vet_connections" (
    "id" TEXT NOT NULL,
    "vetProfileId" TEXT NOT NULL,
    "petOwnerId" TEXT NOT NULL,
    "connectionType" "public"."VetConnectionType" NOT NULL,
    "relationship" "public"."VetRelationshipType" NOT NULL,
    "establishedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isAuthorized" BOOLEAN NOT NULL DEFAULT false,
    "authorizedAt" TIMESTAMP(3),
    "authorizationCode" TEXT,
    "permissionLevel" "public"."VetPermissionLevel" NOT NULL DEFAULT 'READ_ONLY',
    "accessiblePets" TEXT[],
    "accessDuration" INTEGER,
    "expiresAt" TIMESTAMP(3),
    "allowDirectContact" BOOLEAN NOT NULL DEFAULT true,
    "emergencyContact" BOOLEAN NOT NULL DEFAULT false,
    "preferredMethod" "public"."ContactMethod" NOT NULL DEFAULT 'IN_APP',
    "primaryVet" BOOLEAN NOT NULL DEFAULT false,
    "specialtyRole" TEXT,
    "referralSource" TEXT,
    "lastContactDate" TIMESTAMP(3),
    "totalConsultations" INTEGER NOT NULL DEFAULT 0,
    "lastConsultationDate" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "pausedAt" TIMESTAMP(3),
    "terminatedAt" TIMESTAMP(3),
    "terminationReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "vet_connections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."vet_consultations" (
    "id" TEXT NOT NULL,
    "vetId" TEXT NOT NULL,
    "petOwnerId" TEXT NOT NULL,
    "petId" TEXT,
    "consultationType" "public"."VetConsultationType" NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "scheduledAt" TIMESTAMP(3),
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "estimatedDuration" INTEGER,
    "actualDuration" INTEGER,
    "isRemote" BOOLEAN NOT NULL DEFAULT false,
    "location" JSONB,
    "meetingLink" TEXT,
    "meetingId" TEXT,
    "chiefComplaint" TEXT,
    "symptoms" TEXT[],
    "duration" TEXT,
    "urgency" "public"."VetConsultationUrgency" NOT NULL DEFAULT 'ROUTINE',
    "vitalSigns" JSONB,
    "physicalExam" TEXT,
    "diagnosis" TEXT,
    "differentialDiagnosis" TEXT,
    "treatmentPlan" TEXT,
    "medications" JSONB,
    "followUpNeeded" BOOLEAN NOT NULL DEFAULT false,
    "followUpDate" TIMESTAMP(3),
    "referrals" TEXT,
    "clinicalNotes" TEXT,
    "photos" TEXT[],
    "documents" TEXT[],
    "voiceNotes" TEXT[],
    "consultationFee" DOUBLE PRECISION,
    "currency" TEXT NOT NULL DEFAULT 'EUR',
    "paymentStatus" "public"."PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "paidAt" TIMESTAMP(3),
    "invoiceNumber" TEXT,
    "clientSatisfaction" INTEGER,
    "clientFeedback" TEXT,
    "followUpCompleted" BOOLEAN NOT NULL DEFAULT false,
    "outcomeTracking" JSONB,
    "consentGiven" BOOLEAN NOT NULL DEFAULT false,
    "consentDocument" TEXT,
    "privacyLevel" "public"."VetConsultationPrivacy" NOT NULL DEFAULT 'PRIVATE',
    "status" "public"."VetConsultationStatus" NOT NULL DEFAULT 'SCHEDULED',
    "cancellationReason" TEXT,
    "rescheduledFrom" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "vet_consultations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."vet_reviews" (
    "id" TEXT NOT NULL,
    "reviewerId" TEXT NOT NULL,
    "vetId" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "title" TEXT,
    "content" TEXT NOT NULL,
    "expertiseRating" INTEGER,
    "communicationRating" INTEGER,
    "availabilityRating" INTEGER,
    "valueRating" INTEGER,
    "recommendationScore" INTEGER,
    "serviceUsed" "public"."VetConsultationType",
    "consultationDate" TIMESTAMP(3),
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "positiveAspects" TEXT[],
    "negativeAspects" TEXT[],
    "wouldRecommend" BOOLEAN NOT NULL DEFAULT true,
    "wouldUseAgain" BOOLEAN NOT NULL DEFAULT true,
    "vetResponse" TEXT,
    "respondedAt" TIMESTAMP(3),
    "moderationStatus" "public"."ModerationStatus" NOT NULL DEFAULT 'APPROVED',
    "moderatedAt" TIMESTAMP(3),
    "helpfulVotes" INTEGER NOT NULL DEFAULT 0,
    "notHelpfulVotes" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "vet_reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."medical_records" (
    "id" TEXT NOT NULL,
    "petId" TEXT NOT NULL,
    "createdById" TEXT NOT NULL,
    "recordType" "public"."PetMedicalRecordType" NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "clinicalFindings" TEXT,
    "diagnosis" TEXT,
    "treatment" TEXT,
    "outcome" TEXT,
    "vitalSigns" JSONB,
    "bodyCondition" JSONB,
    "medications" JSONB,
    "treatments" JSONB,
    "vaccinations" JSONB,
    "labResults" JSONB,
    "imagingResults" JSONB,
    "testReports" TEXT[],
    "veterinarianName" TEXT,
    "clinicName" TEXT,
    "licenseNumber" TEXT,
    "documents" TEXT[],
    "images" TEXT[],
    "followUpRequired" BOOLEAN NOT NULL DEFAULT false,
    "followUpDate" TIMESTAMP(3),
    "monitoringNotes" TEXT,
    "isPrivate" BOOLEAN NOT NULL DEFAULT true,
    "sharedWith" TEXT[],
    "accessExpiry" TIMESTAMP(3),
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "verifiedBy" TEXT,
    "digitalSignature" TEXT,
    "tags" TEXT[],
    "priority" "public"."RecordPriority" NOT NULL DEFAULT 'NORMAL',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "medical_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."medical_record_access" (
    "id" TEXT NOT NULL,
    "recordId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "grantedById" TEXT NOT NULL,
    "accessType" "public"."AccessType" NOT NULL,
    "accessLevel" "public"."AccessLevel" NOT NULL,
    "purpose" TEXT,
    "grantedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3),
    "isTemporary" BOOLEAN NOT NULL DEFAULT false,
    "canView" BOOLEAN NOT NULL DEFAULT true,
    "canEdit" BOOLEAN NOT NULL DEFAULT false,
    "canShare" BOOLEAN NOT NULL DEFAULT false,
    "canDownload" BOOLEAN NOT NULL DEFAULT false,
    "lastAccessedAt" TIMESTAMP(3),
    "accessCount" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "revokedAt" TIMESTAMP(3),
    "revokedBy" TEXT,
    "revokeReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "medical_record_access_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."identity_verifications" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "verificationType" "public"."VerificationType"[],
    "documentType" "public"."DocumentType" NOT NULL,
    "documentNumber" TEXT NOT NULL,
    "documentExpiry" TIMESTAMP(3),
    "documentCountry" TEXT NOT NULL,
    "documentImages" TEXT[],
    "biometricType" "public"."BiometricType",
    "biometricData" TEXT,
    "addressVerified" BOOLEAN NOT NULL DEFAULT false,
    "addressDocument" TEXT,
    "addressVerifiedAt" TIMESTAMP(3),
    "phoneVerified" BOOLEAN NOT NULL DEFAULT false,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "phoneVerifiedAt" TIMESTAMP(3),
    "emailVerifiedAt" TIMESTAMP(3),
    "professionalVerified" BOOLEAN NOT NULL DEFAULT false,
    "licenseVerified" BOOLEAN NOT NULL DEFAULT false,
    "educationVerified" BOOLEAN NOT NULL DEFAULT false,
    "status" "public"."VerificationStatus" NOT NULL DEFAULT 'PENDING',
    "verificationLevel" "public"."VerificationLevel" NOT NULL DEFAULT 'BASIC',
    "verifiedAt" TIMESTAMP(3),
    "verifiedBy" TEXT,
    "rejectionReason" TEXT,
    "appealCount" INTEGER NOT NULL DEFAULT 0,
    "lastAppealDate" TIMESTAMP(3),
    "riskScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "fraudFlags" TEXT[],
    "duplicateCheck" BOOLEAN NOT NULL DEFAULT false,
    "duplicateMatches" TEXT[],
    "gdprConsent" BOOLEAN NOT NULL DEFAULT false,
    "dataRetention" TIMESTAMP(3),
    "auditTrail" JSONB NOT NULL,
    "ipAddress" TEXT,
    "deviceFingerprint" TEXT,
    "userAgent" TEXT,
    "geolocation" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "expiresAt" TIMESTAMP(3),

    CONSTRAINT "identity_verifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."background_checks" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "checkTypes" "public"."BackgroundCheckType"[],
    "criminalCheck" BOOLEAN NOT NULL DEFAULT false,
    "criminalResult" "public"."CheckResult",
    "criminalDetails" JSONB,
    "animalAbuseCheck" BOOLEAN NOT NULL DEFAULT false,
    "animalAbuseResult" "public"."CheckResult",
    "animalIncidents" JSONB,
    "referenceCheck" BOOLEAN NOT NULL DEFAULT false,
    "references" JSONB[],
    "referencesVerified" INTEGER NOT NULL DEFAULT 0,
    "creditCheck" BOOLEAN NOT NULL DEFAULT false,
    "creditScore" INTEGER,
    "financialRisk" "public"."RiskLevel",
    "professionalCheck" BOOLEAN NOT NULL DEFAULT false,
    "malpracticeHistory" BOOLEAN NOT NULL DEFAULT false,
    "disciplinaryActions" JSONB[],
    "professionalStanding" "public"."ProfessionalStanding",
    "socialMediaCheck" BOOLEAN NOT NULL DEFAULT false,
    "onlineReputationScore" DOUBLE PRECISION,
    "redFlags" TEXT[],
    "overallRisk" "public"."RiskLevel" NOT NULL,
    "riskFactors" TEXT[],
    "recommendations" TEXT[],
    "status" "public"."BackgroundCheckStatus" NOT NULL DEFAULT 'IN_PROGRESS',
    "completedAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "checkProvider" TEXT,
    "providerReference" TEXT,
    "cost" DOUBLE PRECISION,
    "consentGiven" BOOLEAN NOT NULL DEFAULT false,
    "consentDate" TIMESTAMP(3),
    "disputeRaised" BOOLEAN NOT NULL DEFAULT false,
    "disputeDetails" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "background_checks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."trust_scores" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "overallScore" DOUBLE PRECISION NOT NULL,
    "reliabilityScore" DOUBLE PRECISION NOT NULL DEFAULT 50,
    "communicationScore" DOUBLE PRECISION NOT NULL DEFAULT 50,
    "careQualityScore" DOUBLE PRECISION NOT NULL DEFAULT 50,
    "safetyScore" DOUBLE PRECISION NOT NULL DEFAULT 50,
    "totalContracts" INTEGER NOT NULL DEFAULT 0,
    "successfulContracts" INTEGER NOT NULL DEFAULT 0,
    "cancelledContracts" INTEGER NOT NULL DEFAULT 0,
    "disputedContracts" INTEGER NOT NULL DEFAULT 0,
    "averageRating" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalReviews" INTEGER NOT NULL DEFAULT 0,
    "positiveReviews" INTEGER NOT NULL DEFAULT 0,
    "negativeReviews" INTEGER NOT NULL DEFAULT 0,
    "responseTime" DOUBLE PRECISION,
    "punctuality" DOUBLE PRECISION NOT NULL DEFAULT 50,
    "communicationQuality" DOUBLE PRECISION NOT NULL DEFAULT 50,
    "verificationLevel" "public"."VerificationLevel" NOT NULL DEFAULT 'BASIC',
    "backgroundCheckPassed" BOOLEAN NOT NULL DEFAULT false,
    "professionalVerified" BOOLEAN NOT NULL DEFAULT false,
    "riskFlags" TEXT[],
    "warningCount" INTEGER NOT NULL DEFAULT 0,
    "suspensionCount" INTEGER NOT NULL DEFAULT 0,
    "scoreHistory" JSONB[],
    "trendDirection" "public"."TrendDirection" NOT NULL DEFAULT 'STABLE',
    "lastCalculated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "calculationVersion" TEXT NOT NULL DEFAULT '1.0',
    "dataPoints" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "trust_scores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."security_deposits" (
    "id" TEXT NOT NULL,
    "contractId" TEXT,
    "payerId" TEXT NOT NULL,
    "receiverId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'EUR',
    "depositType" "public"."DepositType" NOT NULL,
    "purpose" TEXT NOT NULL,
    "paymentMethod" "public"."PaymentMethod" NOT NULL,
    "paymentDate" TIMESTAMP(3),
    "transactionId" TEXT,
    "paymentProvider" TEXT,
    "status" "public"."DepositStatus" NOT NULL DEFAULT 'PENDING',
    "heldUntil" TIMESTAMP(3),
    "releaseConditions" TEXT[],
    "releaseRequested" BOOLEAN NOT NULL DEFAULT false,
    "releaseRequestDate" TIMESTAMP(3),
    "releaseApproved" BOOLEAN NOT NULL DEFAULT false,
    "releaseDate" TIMESTAMP(3),
    "releaseAmount" DOUBLE PRECISION,
    "deductions" JSONB[],
    "totalDeductions" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "netReleaseAmount" DOUBLE PRECISION,
    "disputeRaised" BOOLEAN NOT NULL DEFAULT false,
    "disputeReason" TEXT,
    "arbitrationNeeded" BOOLEAN NOT NULL DEFAULT false,
    "finalResolution" TEXT,
    "terms" TEXT NOT NULL,
    "jurisdiction" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "security_deposits_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."pet_insurance_policies" (
    "id" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "petId" TEXT,
    "policyNumber" TEXT NOT NULL,
    "insurer" TEXT NOT NULL,
    "policyType" "public"."InsurancePolicyType" NOT NULL,
    "coverage" "public"."InsuranceCoverage"[],
    "coverageLimit" DOUBLE PRECISION,
    "deductible" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "coinsurance" DOUBLE PRECISION,
    "premiumAmount" DOUBLE PRECISION NOT NULL,
    "premiumFrequency" "public"."BillingFrequency" NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'EUR',
    "effectiveDate" TIMESTAMP(3) NOT NULL,
    "expirationDate" TIMESTAMP(3) NOT NULL,
    "renewalDate" TIMESTAMP(3),
    "autoRenewal" BOOLEAN NOT NULL DEFAULT true,
    "preExistingConditions" TEXT[],
    "waitingPeriods" JSONB NOT NULL,
    "annualLimit" DOUBLE PRECISION,
    "perIncidentLimit" DOUBLE PRECISION,
    "lifetimeLimit" DOUBLE PRECISION,
    "exclusions" TEXT[],
    "breedRestrictions" TEXT[],
    "ageRestrictions" JSONB NOT NULL,
    "liabilityCoverage" BOOLEAN NOT NULL DEFAULT false,
    "liabilityLimit" DOUBLE PRECISION,
    "status" "public"."PolicyStatus" NOT NULL DEFAULT 'ACTIVE',
    "claimsCount" INTEGER NOT NULL DEFAULT 0,
    "totalClaimsAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "lastClaimDate" TIMESTAMP(3),
    "policyDocument" TEXT,
    "certificateOfInsurance" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pet_insurance_policies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."insurance_claims" (
    "id" TEXT NOT NULL,
    "policyId" TEXT NOT NULL,
    "claimantId" TEXT NOT NULL,
    "petId" TEXT,
    "claimNumber" TEXT NOT NULL,
    "incidentDate" TIMESTAMP(3) NOT NULL,
    "claimDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "claimType" "public"."ClaimType" NOT NULL,
    "description" TEXT NOT NULL,
    "causeOfLoss" TEXT NOT NULL,
    "circumstances" TEXT NOT NULL,
    "location" JSONB,
    "veterinarianName" TEXT,
    "clinicName" TEXT,
    "diagnosisCode" TEXT,
    "treatmentCode" TEXT,
    "totalExpenses" DOUBLE PRECISION NOT NULL,
    "claimedAmount" DOUBLE PRECISION NOT NULL,
    "approvedAmount" DOUBLE PRECISION DEFAULT 0,
    "deductibleAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "coinsuranceAmount" DOUBLE PRECISION DEFAULT 0,
    "paidAmount" DOUBLE PRECISION DEFAULT 0,
    "receipts" TEXT[],
    "medicalRecords" TEXT[],
    "photos" TEXT[],
    "policereport" TEXT,
    "status" "public"."ClaimStatus" NOT NULL DEFAULT 'SUBMITTED',
    "adjusterId" TEXT,
    "reviewNotes" TEXT,
    "acknowledgedAt" TIMESTAMP(3),
    "processedAt" TIMESTAMP(3),
    "approvedAt" TIMESTAMP(3),
    "rejectedAt" TIMESTAMP(3),
    "paidAt" TIMESTAMP(3),
    "closedAt" TIMESTAMP(3),
    "rejectionReason" TEXT,
    "appealRaised" BOOLEAN NOT NULL DEFAULT false,
    "appealDate" TIMESTAMP(3),
    "appealOutcome" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "insurance_claims_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."contract_templates" (
    "id" TEXT NOT NULL,
    "createdById" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "templateType" "public"."ContractType" NOT NULL,
    "version" TEXT NOT NULL DEFAULT '1.0',
    "content" TEXT NOT NULL,
    "clauses" JSONB[],
    "variables" JSONB[],
    "jurisdiction" TEXT NOT NULL,
    "governingLaw" TEXT NOT NULL,
    "language" TEXT NOT NULL DEFAULT 'en',
    "legalReview" BOOLEAN NOT NULL DEFAULT false,
    "reviewedBy" TEXT,
    "reviewDate" TIMESTAMP(3),
    "usageCount" INTEGER NOT NULL DEFAULT 0,
    "rating" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "isCertified" BOOLEAN NOT NULL DEFAULT false,
    "categories" TEXT[],
    "tags" TEXT[],
    "complexity" "public"."TemplateComplexity" NOT NULL DEFAULT 'SIMPLE',
    "parentTemplateId" TEXT,
    "isLatestVersion" BOOLEAN NOT NULL DEFAULT true,
    "changelog" JSONB[],
    "status" "public"."TemplateStatus" NOT NULL DEFAULT 'DRAFT',
    "publishedAt" TIMESTAMP(3),
    "deprecatedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "contract_templates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."legal_documents" (
    "id" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "documentType" "public"."LegalDocumentType" NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "content" TEXT NOT NULL,
    "fileUrl" TEXT,
    "jurisdiction" TEXT NOT NULL,
    "governingLaw" TEXT NOT NULL,
    "language" TEXT NOT NULL DEFAULT 'en',
    "requiresSignature" BOOLEAN NOT NULL DEFAULT false,
    "signedAt" TIMESTAMP(3),
    "signatories" JSONB[],
    "witnesses" JSONB[],
    "notarized" BOOLEAN NOT NULL DEFAULT false,
    "notaryInfo" JSONB,
    "effectiveDate" TIMESTAMP(3),
    "expirationDate" TIMESTAMP(3),
    "status" "public"."DocumentStatus" NOT NULL DEFAULT 'DRAFT',
    "version" TEXT NOT NULL DEFAULT '1.0',
    "previousVersionId" TEXT,
    "changeHistory" JSONB[],
    "isConfidential" BOOLEAN NOT NULL DEFAULT true,
    "accessList" TEXT[],
    "tags" TEXT[],
    "relatedContracts" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "legal_documents_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "public"."users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "public"."users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "friendships_requesterId_receiverId_key" ON "public"."friendships"("requesterId", "receiverId");

-- CreateIndex
CREATE UNIQUE INDEX "user_blocks_blockerId_blockedId_key" ON "public"."user_blocks"("blockerId", "blockedId");

-- CreateIndex
CREATE UNIQUE INDEX "walk_participations_walkId_userId_key" ON "public"."walk_participations"("walkId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "service_provider_profiles_userId_key" ON "public"."service_provider_profiles"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "reviews_bookingId_key" ON "public"."reviews"("bookingId");

-- CreateIndex
CREATE UNIQUE INDEX "event_participations_eventId_userId_key" ON "public"."event_participations"("eventId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "post_shares_postId_userId_key" ON "public"."post_shares"("postId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "post_saves_postId_userId_key" ON "public"."post_saves"("postId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "likes_userId_postId_key" ON "public"."likes"("userId", "postId");

-- CreateIndex
CREATE UNIQUE INDEX "likes_userId_commentId_key" ON "public"."likes"("userId", "commentId");

-- CreateIndex
CREATE UNIQUE INDEX "conversation_participants_conversationId_userId_key" ON "public"."conversation_participants"("conversationId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "venues_slug_key" ON "public"."venues"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "venue_reviews_venueId_userId_key" ON "public"."venue_reviews"("venueId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "badges_name_key" ON "public"."badges"("name");

-- CreateIndex
CREATE UNIQUE INDEX "badges_slug_key" ON "public"."badges"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "user_badges_userId_badgeId_key" ON "public"."user_badges"("userId", "badgeId");

-- CreateIndex
CREATE UNIQUE INDEX "content_moderation_contentType_contentId_key" ON "public"."content_moderation"("contentType", "contentId");

-- CreateIndex
CREATE UNIQUE INDEX "subscriptions_userId_key" ON "public"."subscriptions"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "invoices_invoiceNumber_key" ON "public"."invoices"("invoiceNumber");

-- CreateIndex
CREATE UNIQUE INDEX "app_settings_key_key" ON "public"."app_settings"("key");

-- CreateIndex
CREATE UNIQUE INDEX "classified_favorites_classifiedId_userId_key" ON "public"."classified_favorites"("classifiedId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "question_votes_questionId_userId_key" ON "public"."question_votes"("questionId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "answer_votes_answerId_userId_key" ON "public"."answer_votes"("answerId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "community_groups_slug_key" ON "public"."community_groups"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "group_memberships_groupId_userId_key" ON "public"."group_memberships"("groupId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "contract_witnesses_contractId_witnessId_key" ON "public"."contract_witnesses"("contractId", "witnessId");

-- CreateIndex
CREATE UNIQUE INDEX "vet_profiles_userId_key" ON "public"."vet_profiles"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "vet_profiles_licenseNumber_key" ON "public"."vet_profiles"("licenseNumber");

-- CreateIndex
CREATE UNIQUE INDEX "vet_connections_vetProfileId_petOwnerId_key" ON "public"."vet_connections"("vetProfileId", "petOwnerId");

-- CreateIndex
CREATE UNIQUE INDEX "vet_reviews_reviewerId_vetId_key" ON "public"."vet_reviews"("reviewerId", "vetId");

-- CreateIndex
CREATE UNIQUE INDEX "medical_record_access_recordId_userId_key" ON "public"."medical_record_access"("recordId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "identity_verifications_userId_key" ON "public"."identity_verifications"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "background_checks_userId_key" ON "public"."background_checks"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "pet_insurance_policies_policyNumber_key" ON "public"."pet_insurance_policies"("policyNumber");

-- CreateIndex
CREATE UNIQUE INDEX "insurance_claims_claimNumber_key" ON "public"."insurance_claims"("claimNumber");

-- AddForeignKey
ALTER TABLE "public"."pets" ADD CONSTRAINT "pets_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."friendships" ADD CONSTRAINT "friendships_requesterId_fkey" FOREIGN KEY ("requesterId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."friendships" ADD CONSTRAINT "friendships_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."user_blocks" ADD CONSTRAINT "user_blocks_blockerId_fkey" FOREIGN KEY ("blockerId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."user_blocks" ADD CONSTRAINT "user_blocks_blockedId_fkey" FOREIGN KEY ("blockedId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."emergency_contacts" ADD CONSTRAINT "emergency_contacts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."pet_health_records" ADD CONSTRAINT "pet_health_records_petId_fkey" FOREIGN KEY ("petId") REFERENCES "public"."pets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."pet_health_records" ADD CONSTRAINT "pet_health_records_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."walks" ADD CONSTRAINT "walks_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."walks" ADD CONSTRAINT "walks_venueId_fkey" FOREIGN KEY ("venueId") REFERENCES "public"."venues"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."walk_participations" ADD CONSTRAINT "walk_participations_walkId_fkey" FOREIGN KEY ("walkId") REFERENCES "public"."walks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."walk_participations" ADD CONSTRAINT "walk_participations_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."walk_participations" ADD CONSTRAINT "walk_participations_petId_fkey" FOREIGN KEY ("petId") REFERENCES "public"."pets"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."walk_photos" ADD CONSTRAINT "walk_photos_walkId_fkey" FOREIGN KEY ("walkId") REFERENCES "public"."walks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."service_provider_profiles" ADD CONSTRAINT "service_provider_profiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."bookings" ADD CONSTRAINT "bookings_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."bookings" ADD CONSTRAINT "bookings_serviceProviderId_fkey" FOREIGN KEY ("serviceProviderId") REFERENCES "public"."service_provider_profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."reviews" ADD CONSTRAINT "reviews_reviewerId_fkey" FOREIGN KEY ("reviewerId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."reviews" ADD CONSTRAINT "reviews_serviceProviderId_fkey" FOREIGN KEY ("serviceProviderId") REFERENCES "public"."service_provider_profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."reviews" ADD CONSTRAINT "reviews_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "public"."bookings"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."events" ADD CONSTRAINT "events_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."events" ADD CONSTRAINT "events_parentEventId_fkey" FOREIGN KEY ("parentEventId") REFERENCES "public"."events"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."events" ADD CONSTRAINT "events_venueId_fkey" FOREIGN KEY ("venueId") REFERENCES "public"."venues"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."event_participations" ADD CONSTRAINT "event_participations_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "public"."events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."event_participations" ADD CONSTRAINT "event_participations_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."event_participations" ADD CONSTRAINT "event_participations_petId_fkey" FOREIGN KEY ("petId") REFERENCES "public"."pets"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."posts" ADD CONSTRAINT "posts_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."posts" ADD CONSTRAINT "posts_walkId_fkey" FOREIGN KEY ("walkId") REFERENCES "public"."walks"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."posts" ADD CONSTRAINT "posts_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "public"."events"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."posts" ADD CONSTRAINT "posts_petId_fkey" FOREIGN KEY ("petId") REFERENCES "public"."pets"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."post_shares" ADD CONSTRAINT "post_shares_postId_fkey" FOREIGN KEY ("postId") REFERENCES "public"."posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."post_shares" ADD CONSTRAINT "post_shares_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."post_saves" ADD CONSTRAINT "post_saves_postId_fkey" FOREIGN KEY ("postId") REFERENCES "public"."posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."post_saves" ADD CONSTRAINT "post_saves_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."comments" ADD CONSTRAINT "comments_postId_fkey" FOREIGN KEY ("postId") REFERENCES "public"."posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."comments" ADD CONSTRAINT "comments_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."comments" ADD CONSTRAINT "comments_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "public"."comments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."likes" ADD CONSTRAINT "likes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."likes" ADD CONSTRAINT "likes_postId_fkey" FOREIGN KEY ("postId") REFERENCES "public"."posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."likes" ADD CONSTRAINT "likes_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "public"."comments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."conversation_participants" ADD CONSTRAINT "conversation_participants_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "public"."conversations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."conversation_participants" ADD CONSTRAINT "conversation_participants_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."messages" ADD CONSTRAINT "messages_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "public"."conversations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."messages" ADD CONSTRAINT "messages_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."messages" ADD CONSTRAINT "messages_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."messages" ADD CONSTRAINT "messages_replyToId_fkey" FOREIGN KEY ("replyToId") REFERENCES "public"."messages"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."venues" ADD CONSTRAINT "venues_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."venue_reviews" ADD CONSTRAINT "venue_reviews_venueId_fkey" FOREIGN KEY ("venueId") REFERENCES "public"."venues"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."venue_reviews" ADD CONSTRAINT "venue_reviews_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."user_badges" ADD CONSTRAINT "user_badges_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."user_badges" ADD CONSTRAINT "user_badges_badgeId_fkey" FOREIGN KEY ("badgeId") REFERENCES "public"."badges"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."notifications" ADD CONSTRAINT "notifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."reports" ADD CONSTRAINT "reports_reportedById_fkey" FOREIGN KEY ("reportedById") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."reports" ADD CONSTRAINT "reports_reportedUserId_fkey" FOREIGN KEY ("reportedUserId") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."reports" ADD CONSTRAINT "reports_postId_fkey" FOREIGN KEY ("postId") REFERENCES "public"."posts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."user_activities" ADD CONSTRAINT "user_activities_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."location_history" ADD CONSTRAINT "location_history_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."geofences" ADD CONSTRAINT "geofences_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."geofence_events" ADD CONSTRAINT "geofence_events_geofenceId_fkey" FOREIGN KEY ("geofenceId") REFERENCES "public"."geofences"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."geofence_events" ADD CONSTRAINT "geofence_events_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."content_moderation" ADD CONSTRAINT "content_moderation_reviewedById_fkey" FOREIGN KEY ("reviewedById") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."search_queries" ADD CONSTRAINT "search_queries_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."subscriptions" ADD CONSTRAINT "subscriptions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."invoices" ADD CONSTRAINT "invoices_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "public"."subscriptions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."audit_logs" ADD CONSTRAINT "audit_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."classifieds" ADD CONSTRAINT "classifieds_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."classified_inquiries" ADD CONSTRAINT "classified_inquiries_classifiedId_fkey" FOREIGN KEY ("classifiedId") REFERENCES "public"."classifieds"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."classified_inquiries" ADD CONSTRAINT "classified_inquiries_inquirerId_fkey" FOREIGN KEY ("inquirerId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."classified_favorites" ADD CONSTRAINT "classified_favorites_classifiedId_fkey" FOREIGN KEY ("classifiedId") REFERENCES "public"."classifieds"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."classified_favorites" ADD CONSTRAINT "classified_favorites_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."questions" ADD CONSTRAINT "questions_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."answers" ADD CONSTRAINT "answers_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "public"."questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."answers" ADD CONSTRAINT "answers_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."question_votes" ADD CONSTRAINT "question_votes_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "public"."questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."question_votes" ADD CONSTRAINT "question_votes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."answer_votes" ADD CONSTRAINT "answer_votes_answerId_fkey" FOREIGN KEY ("answerId") REFERENCES "public"."answers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."answer_votes" ADD CONSTRAINT "answer_votes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."group_memberships" ADD CONSTRAINT "group_memberships_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "public"."community_groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."group_memberships" ADD CONSTRAINT "group_memberships_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."group_posts" ADD CONSTRAINT "group_posts_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "public"."community_groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."group_posts" ADD CONSTRAINT "group_posts_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."group_events" ADD CONSTRAINT "group_events_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "public"."community_groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."group_events" ADD CONSTRAINT "group_events_organizerId_fkey" FOREIGN KEY ("organizerId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."pet_lending_contracts" ADD CONSTRAINT "pet_lending_contracts_lenderId_fkey" FOREIGN KEY ("lenderId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."pet_lending_contracts" ADD CONSTRAINT "pet_lending_contracts_borrowerId_fkey" FOREIGN KEY ("borrowerId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."pet_lending_contracts" ADD CONSTRAINT "pet_lending_contracts_petId_fkey" FOREIGN KEY ("petId") REFERENCES "public"."pets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."pet_lending_contracts" ADD CONSTRAINT "pet_lending_contracts_preferredVetId_fkey" FOREIGN KEY ("preferredVetId") REFERENCES "public"."vet_profiles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."contract_witnesses" ADD CONSTRAINT "contract_witnesses_contractId_fkey" FOREIGN KEY ("contractId") REFERENCES "public"."pet_lending_contracts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."contract_witnesses" ADD CONSTRAINT "contract_witnesses_witnessId_fkey" FOREIGN KEY ("witnessId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."pet_handovers" ADD CONSTRAINT "pet_handovers_contractId_fkey" FOREIGN KEY ("contractId") REFERENCES "public"."pet_lending_contracts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."pet_handovers" ADD CONSTRAINT "pet_handovers_lenderId_fkey" FOREIGN KEY ("lenderId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."pet_handovers" ADD CONSTRAINT "pet_handovers_borrowerId_fkey" FOREIGN KEY ("borrowerId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."pet_handovers" ADD CONSTRAINT "pet_handovers_supervisorId_fkey" FOREIGN KEY ("supervisorId") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."contract_extensions" ADD CONSTRAINT "contract_extensions_contractId_fkey" FOREIGN KEY ("contractId") REFERENCES "public"."pet_lending_contracts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."contract_updates" ADD CONSTRAINT "contract_updates_contractId_fkey" FOREIGN KEY ("contractId") REFERENCES "public"."pet_lending_contracts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."emergency_responses" ADD CONSTRAINT "emergency_responses_contractId_fkey" FOREIGN KEY ("contractId") REFERENCES "public"."pet_lending_contracts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."emergency_responses" ADD CONSTRAINT "emergency_responses_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."contract_disputes" ADD CONSTRAINT "contract_disputes_contractId_fkey" FOREIGN KEY ("contractId") REFERENCES "public"."pet_lending_contracts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."vet_profiles" ADD CONSTRAINT "vet_profiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."vet_connections" ADD CONSTRAINT "vet_connections_vetProfileId_fkey" FOREIGN KEY ("vetProfileId") REFERENCES "public"."vet_profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."vet_connections" ADD CONSTRAINT "vet_connections_petOwnerId_fkey" FOREIGN KEY ("petOwnerId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."vet_consultations" ADD CONSTRAINT "vet_consultations_vetId_fkey" FOREIGN KEY ("vetId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."vet_consultations" ADD CONSTRAINT "vet_consultations_petOwnerId_fkey" FOREIGN KEY ("petOwnerId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."vet_consultations" ADD CONSTRAINT "vet_consultations_profile_fkey" FOREIGN KEY ("vetId") REFERENCES "public"."vet_profiles"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."vet_reviews" ADD CONSTRAINT "vet_reviews_reviewerId_fkey" FOREIGN KEY ("reviewerId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."vet_reviews" ADD CONSTRAINT "vet_reviews_vetId_fkey" FOREIGN KEY ("vetId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."medical_records" ADD CONSTRAINT "medical_records_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."medical_records" ADD CONSTRAINT "medical_records_vet_creator_fkey" FOREIGN KEY ("createdById") REFERENCES "public"."vet_profiles"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."medical_record_access" ADD CONSTRAINT "medical_record_access_recordId_fkey" FOREIGN KEY ("recordId") REFERENCES "public"."medical_records"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."medical_record_access" ADD CONSTRAINT "medical_record_access_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."identity_verifications" ADD CONSTRAINT "identity_verifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."background_checks" ADD CONSTRAINT "background_checks_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."trust_scores" ADD CONSTRAINT "trust_scores_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."security_deposits" ADD CONSTRAINT "security_deposits_payerId_fkey" FOREIGN KEY ("payerId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."security_deposits" ADD CONSTRAINT "security_deposits_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."pet_insurance_policies" ADD CONSTRAINT "pet_insurance_policies_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."insurance_claims" ADD CONSTRAINT "insurance_claims_policyId_fkey" FOREIGN KEY ("policyId") REFERENCES "public"."pet_insurance_policies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."insurance_claims" ADD CONSTRAINT "insurance_claims_claimantId_fkey" FOREIGN KEY ("claimantId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."contract_templates" ADD CONSTRAINT "contract_templates_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."legal_documents" ADD CONSTRAINT "legal_documents_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
